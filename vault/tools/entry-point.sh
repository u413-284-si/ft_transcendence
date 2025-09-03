#!/usr/bin/env bash
set -euo pipefail

##################################
# -- Initial permission setup -- #
##################################

echo "➡️ Running initial setup..."

mkdir -p "$VAULT_KEYS_DIR" "$NGINX_KEYS_DIR" "$APP_KEYS_DIR"
chmod 750 "$SECRETS_DIR" "$VAULT_KEYS_DIR" "$NGINX_KEYS_DIR" "$APP_KEYS_DIR"
chown -R vault:vault "$SECRETS_DIR"
chown -R vault:vault /vault/data

########################################
# -- Startup and unsealing of Vault -- #
########################################

# Start vault
echo "➡️ Starting Vault server..."
su-exec vault:vault vault "$@" &
VAULT_PID=$!

# Wait for Vault API to respond
echo "⏳ Waiting for Vault to start..."
until curl -s  --cacert "$VAULT_CACERT" "$VAULT_ADDR/v1/sys/health" >/dev/null 2>&1; do
  sleep 1
done
# sleep 5
echo "✅ Vault API is up"

# Check if Vault is initialized
if ! jq -e '.initialized' >/dev/null < <(vault status --format=json); then
  echo "🔐 Vault not initialized, running vault operator init..."
  vault operator init -key-shares=5 -key-threshold=3 > /tmp/generated_keys.txt

  # Parse unsealed keys
  mapfile -t keyArray < <( grep "Unseal Key " < /tmp/generated_keys.txt  | cut -c15- )
  # Get root token
  ROOT_TOKEN=$(grep "Initial Root Token: " < /tmp/generated_keys.txt | cut -c21-)

  # Save as Docker secrets
  for i in "${!keyArray[@]}"; do
    echo "${keyArray[$i]}" > "$VAULT_KEYS_DIR/unseal_key_$((i+1))"
  done
  echo "$ROOT_TOKEN" > "$VAULT_KEYS_DIR/root_token"

  chmod 600 "$VAULT_KEYS_DIR"/*
  echo "✅ Keys written to $VAULT_KEYS_DIR"
  rm -f /tmp/generated_keys.txt
else
  echo "ℹ️ Vault already initialized"
fi

unseal_vault() {
    local keys=("$@")
    if [ ${#keys[@]} -eq 0 ]; then
        echo "ℹ️ No unseal keys found, Vault will remain sealed"
        return 1
    fi

    local threshold=3  # Default unseal threshold
    if [ "${#keys[@]}" -lt "$threshold" ]; then
        threshold=${#keys[@]}
    fi

    for i in $(seq 0 $((threshold - 1))); do
        echo "➡️ Unsealing with key $((i+1))"
        vault operator unseal "${keys[$i]}"
    done
    echo "🚀 Vault unseal attempt complete"
    return 0
}

while true; do
    # Load keys if any exist
    if [ -d "$VAULT_KEYS_DIR" ]; then
        mapfile -t keyArray < <(find "$VAULT_KEYS_DIR" -maxdepth 1 -name "unseal_key_*" -print0 | sort -z | xargs -0 cat)
    else
        keyArray=()
    fi

    # Try to unseal
    if unseal_vault "${keyArray[@]}"; then
        echo "✅ Vault is unsealed"
        break
    else
        echo "⏳ Vault remains sealed, waiting for unseal keys..."
        sleep 5  # wait before checking again
    fi
done


#########################
# -- Configure Vault -- #
#########################

# Export root token into VAULT_TOKEN
if [ -f "$VAULT_KEYS_DIR/root_token" ]; then
  export VAULT_TOKEN=$(cat "$VAULT_KEYS_DIR/root_token")
  echo "ℹ️ Root token exported to VAULT_TOKEN"
fi

# Enable kv
echo "➡️ Enabling KV secrets engine..."
if ! vault secrets list -format=json | jq -e '."secret/"' >/dev/null; then
  vault secrets enable -path=secret kv-v2
  echo "✅ KV secrets engine enabled at secret/"
else
  echo "ℹ️ KV already enabled at secret/"
fi

########################################
# -- Set up nginx secret generation -- #
########################################

# Run setup-ssl-ca.sh
echo "➡️ Running certificate authority setup script..."
/usr/local/bin/setup-ssl-ca.sh || {
  echo "❌ Failed to generate certificate authority"
  kill $VAULT_PID
  exit 1
}
echo "✅ SSL certificate authority set up"

# Add policy for nginx
echo "➡️ Adding policy for nginx..."
vault policy write nginx-policy /vault/policies/nginx-policy.hcl

# Enable AppRole authentication if not active
if vault auth list -format=json | jq -e '."approle/"' > /dev/null; then
  echo "ℹ️ AppRole auth method already enabled, skipping..."
else
  echo "➡️ Enabling AppRole authentication..."
  vault auth enable -path=approle approle
  echo "✅ AppRole authentication enabled"
fi

# Create AppRole for nginx if not existent
if vault read -format=json auth/approle/role/nginx-role > /dev/null 2>&1; then
  echo "ℹ️ AppRole nginx-role already exists, skipping..."
else
  echo "➡️ Creating AppRole for nginx..."
  vault write auth/approle/role/nginx-role \
      secret_id_ttl=0 \
      token_num_uses=0 \
      token_ttl=1h \
      token_max_ttl=4h \
      policies=nginx-policy
  echo "✅ AppRole nginx-role created"
fi

# Create role ID and secret ID if not existent
if [ ! -f "$NGINX_KEYS_DIR/nginx_role_id" ]; then
  echo "➡️ Creating role ID for nginx..."
  vault read -field=role_id auth/approle/role/nginx-role/role-id > "$NGINX_KEYS_DIR/nginx_role_id"
  chmod 600 "$NGINX_KEYS_DIR/nginx_role_id"
  chown vault:vault "$NGINX_KEYS_DIR/nginx_role_id"
  echo "✅ Role ID for nginx created"
else
  echo "ℹ️ Role ID for nginx already exists"
fi

if [ ! -f "$NGINX_KEYS_DIR/nginx_secret_id" ]; then
  echo "➡️ Creating secret ID for nginx..."
  vault write -field=secret_id -f auth/approle/role/nginx-role/secret-id > "$NGINX_KEYS_DIR/nginx_secret_id"
  chmod 600 "$NGINX_KEYS_DIR/nginx_secret_id"
  chown vault:vault "$NGINX_KEYS_DIR/nginx_secret_id"
  echo "✅ Secret ID for nginx created"
else
  echo "ℹ️ Secret ID for nginx already exists"
fi

######################################
# -- Set up app secret generation -- #
######################################

# Add jwt secrets
echo "➡️ Adding JWT secrets..."
vault kv put secret/jwt \
    access_token_secret=$(openssl rand -hex 32) \
    refresh_token_secret=$(openssl rand -hex 32) \
    two_fa_login_token_secret=$(openssl rand -hex 32)
echo "✅ JWT secrets added to Vault"

# Add google_secret
echo "➡️ Adding Google secret..."
if [ -f "/run/secrets/google_secret" ]; then
  googleSecret=$(cat "/run/secrets/google_secret")

  vault kv put secret/google \
      google_oauth2_client_secret="$googleSecret"
  echo "✅ Google secret added to Vault"
else
  echo "ℹ️ Google secret not found, skipping..."
fi

# Add policy for app
echo "➡️ Adding policy for app..."
vault policy write app-policy /vault/policies/app-policy.hcl

# Create AppRole for app if not existent
if vault read -format=json auth/approle/role/app-role > /dev/null 2>&1; then
  echo "ℹ️ AppRole app-role already exists, skipping..."
else
  echo "➡️ Creating AppRole for app..."
  vault write auth/approle/role/app-role \
      secret_id_ttl=0 \
      token_num_uses=0 \
      token_ttl=1h \
      token_max_ttl=4h \
      policies=app-policy
  echo "✅ AppRole app-role for app created"
fi

# Create role ID and secret ID if not existent
if [ ! -f "$APP_KEYS_DIR/app_role_id" ]; then
  echo "➡️ Creating role ID for app..."
  vault read -field=role_id auth/approle/role/app-role/role-id > "$APP_KEYS_DIR/app_role_id"
  chmod 600 "$APP_KEYS_DIR/app_role_id"
  chown vault:vault "$APP_KEYS_DIR/app_role_id"
  echo "✅ Role ID for app created"
else
  echo "ℹ️ Role ID for app already exists"
fi

if [ ! -f "$APP_KEYS_DIR/app_secret_id" ]; then
  echo "➡️ Creating secret ID for app..."
  vault write -field=secret_id -f auth/approle/role/app-role/secret-id > "$APP_KEYS_DIR/app_secret_id"
  chmod 600 "$APP_KEYS_DIR/app_secret_id"
  chown vault:vault "$APP_KEYS_DIR/app_secret_id"
  echo "✅ Secret ID for app created"
else
  echo "ℹ️ Secret ID for app already exists"
fi

wait $VAULT_PID

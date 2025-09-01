#!/usr/bin/env bash
set -euo pipefail

##################################
# -- Initial permission setup -- #
##################################

export SECRETS_DIR="/vault/secrets"

echo "➡️ Running initial setup..."

mkdir -p "$SECRETS_DIR"
mkdir -p "$SECRETS_DIR/nginx"
mkdir -p "$SECRETS_DIR/app"
chmod 700 "$SECRETS_DIR"
chown vault:vault "$SECRETS_DIR"
chown -R vault:vault "$SECRETS_DIR/nginx"
chown -R vault:vault "$SECRETS_DIR/app"
chown -R vault:vault /vault/data

########################################
# -- Startup and unsealing of Vault -- #
########################################

# Export values
export VAULT_ADDR="http://127.0.0.1:8200"
export VAULT_SKIP_VERIFY="true"

# Start vault
echo "➡️ Starting Vault server..."
su-exec vault:vault vault "$@" &
VAULT_PID=$!

# Wait for Vault API to respond
echo "⏳ Waiting for Vault to start..."
until curl -s "$VAULT_ADDR/v1/sys/health" >/dev/null 2>&1; do
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
    echo "${keyArray[$i]}" > "$SECRETS_DIR/unseal_key_$((i+1))"
  done
  echo "$ROOT_TOKEN" > "$SECRETS_DIR/root_token"

  chmod 600 "$SECRETS_DIR"/*
  echo "✅ Keys written to $SECRETS_DIR"
  rm -f /tmp/generated_keys.txt
else
  echo "ℹ️ Vault already initialized"
fi

# Load unseal keys from secrets
mapfile -t keyArray < <(find "$SECRETS_DIR" -maxdepth 1 -name "unseal_key_*" -print0 | sort -z | xargs -0 cat)

# Unseal Vault using threshold (first 3 keys)
for i in {0..2}; do
  echo "➡️  Unsealing with key $((i+1))"
  vault operator unseal "${keyArray[$i]}"
done

echo "🚀 Vault is unsealed."

#########################
# -- Configure Vault -- #
#########################

# Export root token into VAULT_TOKEN
if [ -f "$SECRETS_DIR/root_token" ]; then
  export VAULT_TOKEN=$(cat "$SECRETS_DIR/root_token")
  echo "ℹ️ Root token exported to VAULT_TOKEN"
fi

# Enable kv
if ! vault secrets list -format=json | jq -e '."secret/"' >/dev/null; then
  vault secrets enable -path=secret kv-v2
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
fi

# Create role ID and secret ID if not existent
if [ ! -f "$SECRETS_DIR/nginx/nginx_role_id" ]; then
  echo "➡️ Creating role ID for nginx..."
  vault read -field=role_id auth/approle/role/nginx-role/role-id > "$SECRETS_DIR/nginx/nginx_role_id"
  chmod 600 "$SECRETS_DIR/nginx/nginx_role_id"
  chown vault:vault "$SECRETS_DIR/nginx/nginx_role_id"
else
  echo "ℹ️ Role ID for nginx already exists"
fi

if [ ! -f "$SECRETS_DIR/nginx/nginx_secret_id" ]; then
  echo "➡️ Creating secret ID for nginx..."
  vault write -field=secret_id -f auth/approle/role/nginx-role/secret-id > "$SECRETS_DIR/nginx/nginx_secret_id"
  chmod 600 "$SECRETS_DIR/nginx/nginx_secret_id"
  chown vault:vault "$SECRETS_DIR/nginx/nginx_secret_id"
else
  echo "ℹ️ Secret ID for nginx already exists"
fi
echo "✅ Role ID and Secret ID for nginx created"

######################################
# -- Set up app secret generation -- #
######################################

# Add jwt secrets
echo "➡️ Adding JWT secrets..."
vault kv put secret/jwt \
    access_token_secret=$(openssl rand -hex 32) \
    refresh_token_secret=$(openssl rand -hex 32) \
    two_fa_login_token_secret=$(openssl rand -hex 32)

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
fi

# Create role ID and secret ID if not existent
if [ ! -f "$SECRETS_DIR/app/app_role_id" ]; then
  echo "➡️ Creating role ID for app..."
  vault read -field=role_id auth/approle/role/app-role/role-id > "$SECRETS_DIR/app/app_role_id"
  chmod 600 "$SECRETS_DIR/app/app_role_id"
  chown vault:vault "$SECRETS_DIR/app/app_role_id"
else
  echo "ℹ️ Role ID for app already exists"
fi

if [ ! -f "$SECRETS_DIR/app/app_secret_id" ]; then
  echo "➡️ Creating secret ID for app..."
  vault write -field=secret_id -f auth/approle/role/app-role/secret-id > "$SECRETS_DIR/app/app_secret_id"
  chmod 600 "$SECRETS_DIR/app/app_secret_id"
  chown vault:vault "$SECRETS_DIR/app/app_secret_id"
else
  echo "ℹ️ Secret ID for app already exists"
fi
echo "✅ Role ID and Secret ID for app created"

wait $VAULT_PID

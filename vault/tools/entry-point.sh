#!/usr/bin/env bash
set -euo pipefail

##################################
# -- Initial permission setup -- #
##################################

export SECRETS_DIR="/vault/secrets"

echo "➡️ Running initial setup..."

mkdir -p "$SECRETS_DIR"
chmod 700 "$SECRETS_DIR"
chown vault:vault "$SECRETS_DIR"
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

# Enable AppRole authentication
echo "➡️ Enabling AppRole authentication..."
vault auth enable -path=approle approle || true

# Create AppRole for nginx
echo "➡️ Creating AppRole for nginx..."
vault write auth/approle/role/nginx-role \
    secret_id_ttl=0 \
    token_num_uses=0 \
    token_ttl=1h \
    token_max_ttl=4h \
    policies=nginx-policy

# Create role ID and secret ID
if [ ! -f "$SECRETS_DIR/nginx_role_id" ]; then
  echo "➡️ Creating role ID for nginx..."
  vault read -field=role_id auth/approle/role/nginx-role/role-id > "$SECRETS_DIR/nginx_role_id"
  chmod 600 "$SECRETS_DIR/nginx_role_id"
  chown vault:vault "$SECRETS_DIR/nginx_role_id"
else
  echo "ℹ️ Role ID for nginx already exists"
fi

if [ ! -f "$SECRETS_DIR/nginx_secret_id" ]; then
  echo "➡️ Creating secret ID for nginx..."
  vault write -field=secret_id -f auth/approle/role/nginx-role/secret-id > "$SECRETS_DIR/nginx_secret_id"
  chmod 600 "$SECRETS_DIR/nginx_secret_id"
  chown vault:vault "$SECRETS_DIR/nginx_secret_id"
else
  echo "ℹ️ Secret ID for nginx already exists"
fi
echo "✅ Role ID and Secret ID created"

wait $VAULT_PID

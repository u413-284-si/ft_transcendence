#!/usr/bin/env bash
set -euo pipefail

# Export values
VAULT_ADDR="http://127.0.0.1:8200"
export VAULT_ADDR
export VAULT_SKIP_VERIFY="true"

SECRETS_DIR="/run/secrets"
mkdir -p "$SECRETS_DIR"

# Start vault
echo "➡️ Starting Vault server..."
vault "$@" &
VAULT_PID=$!

# Wait for Vault API to respond
echo "⏳ Waiting for Vault to start..."
until curl -s "$VAULT_ADDR/v1/sys/health" >/dev/null 2>&1; do
  sleep 1
done
# sleep 5
echo "✅ Vault API is up"

# Check if Vault is initialized
if ! vault status 2>/dev/null | grep -q "Initialized.*true"; then
  echo "🔐 Vault not initialized, running vault operator init..."
  vault operator init -key-shares=5 -key-threshold=3 > /tmp/generated_keys.txt

  # Parse unsealed keys
  mapfile -t keyArray < <( grep "Unseal Key " < /tmp/generated_keys.txt  | cut -c15- )
  # Get root token
  ROOT_TOKEN=$(grep "Initial Root Token: " < /tmp/generated_keys.txt | cut -c21-)

  # Save as Docker secrets (plain files)
  for i in "${!keyArray[@]}"; do
    echo "${keyArray[$i]}" > "$SECRETS_DIR/unseal_key_$((i+1))"
  done
  echo "$ROOT_TOKEN" > "$SECRETS_DIR/root_token"

  chmod 600 "$SECRETS_DIR"/*
  echo "✅ Keys written to $SECRETS_DIR"
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

# Export root token into VAULT_TOKEN
if [ -f "$SECRETS_DIR/root_token" ]; then
  export VAULT_TOKEN=$(cat "$SECRETS_DIR/root_token")
  echo "ℹ️ Root token exported to VAULT_TOKEN"
fi

# Enable kv
if ! vault secrets list | grep -q '^kv/'; then
  vault secrets enable -version=1 kv
fi

# Add test value to my-secret
vault kv put kv/my-secret my-value=s3cr3t || true

wait $VAULT_PID

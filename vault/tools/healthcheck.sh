#!/usr/bin/env bash
set -euo pipefail

ROLE_FILE="$VAULT_KEYS_DIR/healthcheck-role-id"
SECRET_FILE="$VAULT_KEYS_DIR/healthcheck-secret-id"

if [[ ! -s "$ROLE_FILE" || ! -s "$SECRET_FILE" ]]; then
    echo "⚠️ Healthcheck AppRole not ready yet."
    exit 1
fi

HEALTH_TOKEN=$(vault write -format=json auth/approle/login \
    role_id="$(cat $VAULT_KEYS_DIR/healthcheck-role-id)" \
    secret_id="$(cat $VAULT_KEYS_DIR/healthcheck-secret-id)" \
    | jq -r '.auth.client_token')

VAULT_TOKEN="$HEALTH_TOKEN"

# 1. Check Vault is unsealed and healthy
if ! curl -s --cacert "$VAULT_CACERT" "$VAULT_ADDR/v1/sys/health" | jq -e '.sealed == false'; then
  echo "❌ Vault is sealed or unavailable"
  exit 1
fi

# 2. Verify nginx AppRole
if ! VAULT_TOKEN="$VAULT_TOKEN" vault read -format=json auth/approle/role/nginx >/dev/null 2>&1; then
  echo "❌ nginx-role missing"
  exit 1
fi

# 3. Verify app AppRole
if ! VAULT_TOKEN="$VAULT_TOKEN" vault read -format=json auth/approle/role/app >/dev/null 2>&1; then
  echo "❌ app-role missing"
  exit 1
fi

# 4. Check role-id and secret-id files exist
NGINX_FILES="nginx-role-id nginx-secret-id"
APP_FILES="app-role-id app-secret-id"

# Function to check files in a directory
check_files() {
  dir="$1"
  shift
  for f in "$@"; do
    filepath="$dir/$f"
    if [ ! -s "$filepath" ]; then
      echo "❌ Missing $filepath"
      exit 1
    fi
  done
}

# Run checks
check_files "$NGINX_KEYS_DIR" $NGINX_FILES
check_files "$APP_KEYS_DIR" $APP_FILES

# 5. Check JWT and Google secrets
if ! VAULT_TOKEN="$VAULT_TOKEN" vault kv get -mount=secret jwt >/dev/null 2>&1; then
  echo "❌ jwt secret missing"
  exit 1
fi
if ! VAULT_TOKEN="$VAULT_TOKEN" vault kv get -mount=secret google >/dev/null 2>&1; then
  echo "❌ google secret missing"
  exit 1
fi

echo "✅ Vault health OK"
exit 0

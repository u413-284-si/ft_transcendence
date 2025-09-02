#!/usr/bin/env bash
set -euo pipefail

VAULT_TOKEN=$(cat /vault/secrets/root_token 2>/dev/null || echo "")

# 1. Check Vault is unsealed and healthy
if ! curl -s --cacert "$VAULT_CACERT" "$VAULT_ADDR/v1/sys/health" | jq -e '.sealed == false'; then
  echo "❌ Vault is sealed or unavailable"
  exit 1
fi

# 2. Verify nginx AppRole
if ! VAULT_TOKEN="$VAULT_TOKEN" vault read -format=json auth/approle/role/nginx-role >/dev/null 2>&1; then
  echo "❌ nginx-role missing"
  exit 1
fi

# 3. Verify app AppRole
if ! VAULT_TOKEN="$VAULT_TOKEN" vault read -format=json auth/approle/role/app-role >/dev/null 2>&1; then
  echo "❌ app-role missing"
  exit 1
fi

# 4. Check role_id and secret_id files exist
for f in nginx_role_id nginx_secret_id app_role_id app_secret_id; do
  if [ ! -s "/vault/secrets/$f" ]; then
    echo "❌ Missing $f"
    exit 1
  fi
done

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

#!/usr/bin/env bash
set -euo pipefail

##########################
# -- Helper Functions -- #
##########################

# Return codes:
# 0 = issuer exists and NOT expired
# 1 = issuer exists but expired
# 2 = issuer not found (or unreadable)
is_issuer_valid() {
  local issuer_name=$1
  local mount=$2

  # Fetch issuer JSON; bail if it doesn't exist
  local resp
  if ! resp=$(vault read -format=json "${mount}/issuer/${issuer_name}" 2>/dev/null); then
    return 2  # not found
  fi

  # Extract PEM certificate
  local pem
  pem=$(jq -r '.data.certificate // empty' <<<"${resp}")
  [[ -z "${pem}" ]] && return 2

  # Parse expiration using openssl
  local exp_date exp_sec now_sec
  exp_date=$(openssl x509 -noout -enddate <<<"${pem}" | cut -d= -f2)
  exp_sec=$(date -d "${exp_date}" +%s 2>/dev/null || echo 0)
  now_sec=$(date +%s)

  if (( exp_sec > now_sec )); then
    return 0
  else
    return 1
  fi
}

##########################
# -- PKI Setup Paths --  #
##########################
ROOT_CA_FILE="${SECRETS_DIR}/current_root_issuer"
INT_CA_UUID=$(vault read -field=default pki_int/config/issuers 2>/dev/null || echo "")
ROLE_NAME="pong-dot-com"

##########################
# -- Step 1: Root CA --  #
##########################

if ! vault secrets list | grep -q '^pki/'; then
  vault secrets enable pki
  vault secrets tune -max-lease-ttl=87600h pki
fi

if [[ -f "${ROOT_CA_FILE}" ]]; then
  ROOT_CA_NAME=$(cat "${ROOT_CA_FILE}")
else
  ROOT_CA_NAME="root-$(date +%Y%m%d%H%M%S)"
fi

if is_issuer_valid "${ROOT_CA_NAME}" pki; then
    echo "✔️ Root CA ${ROOT_CA_NAME} is valid"
else
    echo "➡️ Generating new root CA..."
    ROOT_CA_NAME="root-$(date +%Y%m%d%H%M%S)"
    vault write -field=certificate pki/root/generate/internal \
        common_name="pong.com" \
        issuer_name="${ROOT_CA_NAME}" \
        ttl=87600h > "${SECRETS_DIR}/${ROOT_CA_NAME}.crt"

    echo "${ROOT_CA_NAME}" > "${ROOT_CA_FILE}"

    # Create a role for the root CA
    vault write pki/roles/2025-servers allow_any_name=true
    vault write pki/config/urls \
        issuing_certificates="${VAULT_ADDR}/v1/pki/ca" \
        crl_distribution_points="${VAULT_ADDR}/v1/pki/crl"

    echo "✅ Root CA created: ${ROOT_CA_NAME}"
fi

##################################
# -- Step 2: Intermediate CA --  #
##################################

if ! vault secrets list | grep -q '^pki_int/'; then
  vault secrets enable -path=pki_int pki
  vault secrets tune -max-lease-ttl=87600h pki_int
fi

if is_issuer_valid "${INT_CA_UUID}" pki_int; then
    echo "✔️ Intermediate CA (UUID: ${INT_CA_UUID}) is valid"
else
    echo "➡️ Generating new intermediate CA..."
    INT_CA_NAME="pong-intermediate-$(date +%Y%m%d%H%M%S)"

    vault write -format=json pki_int/intermediate/generate/internal \
        common_name="pong.com Intermediate Authority" \
        issuer_name="${INT_CA_NAME}" \
        | jq -r '.data.csr' > "${SECRETS_DIR}/${INT_CA_NAME}.csr"

    vault write -format=json pki/root/sign-intermediate \
        issuer_ref="${ROOT_CA_NAME}" \
        csr=@"${SECRETS_DIR}/${INT_CA_NAME}.csr" \
        format=pem_bundle ttl="87600h" \
        | jq -r '.data.certificate' > "${SECRETS_DIR}/${INT_CA_NAME}.pem"

    vault write pki_int/intermediate/set-signed certificate=@"${SECRETS_DIR}/${INT_CA_NAME}.pem"

    INT_CA_UUID=$(vault read -field=default pki_int/config/issuers 2>/dev/null || echo "")

    echo "✅ Intermediate CA created: ${INT_CA_NAME}"
fi

############################
# -- Step 3: Role Setup -- #
############################

vault write pki_int/config/issuers default="${INT_CA_UUID}" default_follows_latest_issuer=true

vault write "pki_int/roles/${ROLE_NAME}" \
    issuer_ref="default" \
    allowed_domains="pong.com" \
    allow_subdomains=true \
    max_ttl="720h"

echo "✅ Role ${ROLE_NAME} following latest issuer."

echo "✅ PKI setup complete."

# # -- Step 4: Generate leaf certificate -- #

# # Generate the leaf certificate
# if ! vault kv get -field=fullchain secret/nginx/test-pong-com >/dev/null 2>&1; then
#   echo "➡️ Issuing leaf cert..."
#   vault write -format=json pki_int/issue/pong-dot-com \
#       common_name="test.pong.com" ttl="24h" \
#       | tee >(jq -r '.data.certificate' > test.pong.com.crt) \
#             >(jq -r '.data.issuing_ca' > test.pong.com.ca.crt) \
#             >(jq -r '.data.private_key' > test.pong.com.key) >/dev/null

#   # Combine leaf + intermediate for nginx
#   cat test.pong.com.crt test.pong.com.ca.crt > test.pong.com.fullchain.crt

#   # Store the certificate and key
#   vault kv put secret/nginx/test-pong-com \
#       fullchain=@test.pong.com.fullchain.crt \
#       key=@test.pong.com.key
# else
#   echo "✔️ Leaf cert already in Vault KV"
# fi

# vault kv get -field=fullchain secret/nginx/test-pong-com > /etc/nginx/ssl/test.pong.com.fullchain.crt
# vault kv get -field=key secret/nginx/test-pong-com > /etc/nginx/ssl/test.pong.com.key


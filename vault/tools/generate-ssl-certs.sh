#!/usr/bin/env bash
set -euo pipefail

##########################
# -- Helper Functions -- #
##########################

# Check if an issuer exists and is valid
is_issuer_valid() {
    local issuer_name=$1
    local issuer_path=$2

    # Get issuer object by name
    local issuer_json
    issuer_json=$(vault read -format=json "$issuer_path" 2>/dev/null) || return 2

    local issuer_id
    issuer_id=$(jq -r --arg name "$issuer_name" '.data.issuers[]? | select(.name==$name) | .id' <<<"$issuer_json")

    [[ -z "$issuer_id" || "$issuer_id" == "null" ]] && return 2

    local exp
    exp=$(vault read -format=json "${issuer_path%/config/issuers}/issuer/$issuer_id" 2>/dev/null \
        | jq -r '.data.expiration_time // empty')

    [[ -z "$exp" ]] && return 2

    local now_sec exp_sec
    now_sec=$(date +%s)
    exp_sec=$(date -d "$exp" +%s)

    (( exp_sec > now_sec )) && return 0 || return 1
}

##########################
# -- PKI Setup Paths --  #
##########################
ROOT_CA_PATH="pki/config/issuers"
ROOT_CA_FILE="$SECRETS_DIR/current_root_issuer"
INT_CA_PATH="pki_int/config/issuers"
INT_CA_FILE="$SECRETS_DIR/current_intermediate_issuer"
ROLE_NAME="pong-dot-com"

##########################
# -- Step 1: Root CA --  #
##########################

if ! vault secrets list | grep -q '^pki/'; then
  vault secrets enable pki
  vault secrets tune -max-lease-ttl=87600h pki
fi

if [[ -f "$ROOT_CA_FILE" ]]; then
  ROOT_CA_NAME=$(cat "$ROOT_CA_FILE")
else
  ROOT_CA_NAME="root-$(date +%Y%m%d%H%M%S)"
fi

if is_issuer_valid "$ROOT_CA_NAME" "$ROOT_CA_PATH"; then
    echo "✔️ Root CA $ROOT_CA_NAME is valid"
else
    echo "➡️ Generating new root CA..."
    ROOT_CA_NAME="root-$(date +%Y%m%d%H%M%S)"
    vault write -field=certificate pki/root/generate/internal \
        common_name="pong.com" \
        issuer_name="$ROOT_CA_NAME" \
        ttl=87600h > "$SECRETS_DIR/${ROOT_CA_NAME}.crt"

    echo "$ROOT_CA_NAME" > "$ROOT_CA_FILE"

    # Create a role for the root CA
    vault write pki/roles/2025-servers allow_any_name=true
    vault write pki/config/urls \
        issuing_certificates="$VAULT_ADDR/v1/pki/ca" \
        crl_distribution_points="$VAULT_ADDR/v1/pki/crl"
fi

##################################
# -- Step 2: Intermediate CA --  #
##################################

if ! vault secrets list | grep -q '^pki_int/'; then
  vault secrets enable -path=pki_int pki
  vault secrets tune -max-lease-ttl=87600h pki_int
fi

if [[ -f "$INT_CA_FILE" ]]; then
  INT_CA_NAME=$(cat "$INT_CA_FILE")
else
  INT_CA_NAME="pong-intermediate-$(date +%Y%m%d%H%M%S)"
fi

if is_issuer_valid "$INT_CA_NAME" "$INT_CA_PATH"; then
    echo "✔️ Intermediate CA $INT_CA_NAME is valid"
else
    echo "➡️ Generating new intermediate CA..."
    INT_CA_NAME="pong-intermediate-$(date +%Y%m%d%H%M%S)"

    vault write -format=json pki_int/intermediate/generate/internal \
        common_name="pong.com Intermediate Authority" \
        issuer_name="$INT_CA_NAME" \
        | jq -r '.data.csr' > "$SECRETS_DIR/${INT_CA_NAME}.csr"

    vault write -format=json pki/root/sign-intermediate \
        issuer_ref="$ROOT_CA_NAME" \
        csr=@"$SECRETS_DIR/${INT_CA_NAME}.csr" \
        format=pem_bundle ttl="87600h" \
        | jq -r '.data.certificate' > "$SECRETS_DIR/${INT_CA_NAME}.pem"

    vault write pki_int/intermediate/set-signed certificate=@"$SECRETS_DIR/${INT_CA_NAME}.pem"

    echo "$INT_CA_NAME" > "$INT_CA_FILE"
fi

############################
# -- Step 3: Role Setup -- #
############################

current_issuer=$(vault read -field=default "$INT_CA_PATH" 2>/dev/null || echo "")

if ! vault list pki_int/roles 2>/dev/null | grep -q "$ROLE_NAME"; then
    echo "➡️ Creating role $ROLE_NAME..."
    vault write pki_int/roles/$ROLE_NAME \
        issuer_ref="$current_issuer" \
        allowed_domains="pong.com" \
        allow_subdomains=true \
        max_ttl="720h"
else
    # check if the role's issuer matches current issuer
    role_issuer=$(vault read -field=issuer_ref pki_int/roles/$ROLE_NAME)
    if [[ "$role_issuer" != "$current_issuer" ]]; then
        echo "➡️ Updating role $ROLE_NAME with new issuer..."
        vault write pki_int/roles/$ROLE_NAME \
            issuer_ref="$current_issuer" \
            allowed_domains="pong.com" \
            allow_subdomains=true \
            max_ttl="720h"
    else
        echo "✔️ Role $ROLE_NAME is valid"
    fi
fi

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


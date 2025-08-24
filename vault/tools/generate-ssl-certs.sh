#!/usr/bin/env bash
set -euo pipefail

# -- Step 1: Generate root certificate authority -- #

# Enable the pki secrets engine at the pki path
if ! vault secrets list | grep -q '^pki/'; then
  vault secrets enable pki
  vault secrets tune -max-lease-ttl=87600h pki
fi

# Generate the root CA
vault write -field=certificate pki/root/generate/internal \
     common_name="pong.com" \
     issuer_name="root-2025" \
     ttl=87600h > root_2025_ca.crt

# Create a role for the root CA
vault write pki/roles/2025-servers allow_any_name=true

# Configure the CA and CRL URLs
vault write pki/config/urls \
     issuing_certificates="$VAULT_ADDR/v1/pki/ca" \
     crl_distribution_points="$VAULT_ADDR/v1/pki/crl"

# -- Step 2: Generate intermediate certificate authority -- #

# Enable the pki secrets engine at the pki_int path
if ! vault secrets list | grep -q '^pki_int/'; then
  vault secrets enable -path=pki_int pki
  vault secrets tune -max-lease-ttl=43800h pki_int
fi

# Generate the intermediate CA
vault write -format=json pki_int/intermediate/generate/internal \
     common_name="pong.com Intermediate Authority" \
     issuer_name="pong-dot-com-intermediate" \
     | jq -r '.data.csr' > pki_intermediate.csr

# Sign the intermediate certificate with the root CA private key
vault write -format=json pki/root/sign-intermediate \
     issuer_ref="root-2025" \
     csr=@pki_intermediate.csr \
     format=pem_bundle ttl="43800h" \
     | jq -r '.data.certificate' > intermediate.cert.pem

# Import intermediate certificate back into vault
vault write pki_int/intermediate/set-signed certificate=@intermediate.cert.pem

# -- Step 3: Create role -- #
vault write pki_int/roles/pong-dot-com \
     issuer_ref="$(vault read -field=default pki_int/config/issuers)" \
     allowed_domains="pong.com" \
     allow_subdomains=true \
     max_ttl="720h"

# -- Step 4: Generate leaf certificate -- #

# Generate the leaf certificate
vault write -format=json pki_int/issue/pong-dot-com \
     common_name="test.pong.com" ttl="24h" \
     | tee >(jq -r '.data.certificate' > test.pong.com.crt) \
           >(jq -r '.data.issuing_ca' > test.pong.com.ca.crt) \
           >(jq -r '.data.private_key' > test.pong.com.key) >/dev/null

# Combine leaf + intermediate for nginx
cat test.pong.com.crt test.pong.com.ca.crt > test.pong.com.fullchain.crt

# Store the certificate and key
vault kv put secret/nginx/test-pong-com \
    fullchain=@test.pong.com.fullchain.crt \
    key=@test.pong.com.key

# vault kv get -field=fullchain secret/nginx/test-pong-com > /etc/nginx/ssl/test.pong.com.fullchain.crt
# vault kv get -field=key secret/nginx/test-pong-com > /etc/nginx/ssl/test.pong.com.key


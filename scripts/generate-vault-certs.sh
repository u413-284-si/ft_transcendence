#!/bin/bash
set -euo pipefail

BASE_DIR="./secrets"
CA_DIR="${BASE_DIR}/ca"
VAULT_DIR="${BASE_DIR}/vault-certs"

mkdir -p "${CA_DIR}" "${VAULT_DIR}"

# Step 1: Generate root CA (only once!)
if [ ! -f "${CA_DIR}/root-ca.key" ]; then
  echo "➡️ Creating root CA..."
  openssl genrsa -out "${CA_DIR}/root-ca.key" 4096

  openssl req -x509 -new -nodes -key "${CA_DIR}/root-ca.key" \
    -sha256 -days 3650 \
    -subj "/C=AT/ST=9/L=Vienna/O=42Vienna/CN=PongIndustries Root CA" \
    -out "${CA_DIR}/root-ca.crt"

  echo "✅ Root CA created in ${CA_DIR}"
else
  echo "ℹ️ Root CA already exists"
fi

# Step 2: Generate Vault server key + CSR
if [ ! -f "${VAULT_DIR}/vault.key" ]; then
  echo "➡️ Generating Vault server key + CSR..."
  openssl genrsa -out "${VAULT_DIR}/vault.key" 4096

  openssl req -new -key "${VAULT_DIR}/vault.key" \
    -out "${VAULT_DIR}/vault.csr" \
    -subj "/C=AT/ST=9/L=Vienna/O=42Vienna/CN=vault.local"

  # Step 3: SAN config
  cat > "${VAULT_DIR}/vault.cnf" <<EOF
[server]
basicConstraints = CA:FALSE
extendedKeyUsage = serverAuth
keyUsage = critical, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = vault
DNS.2 = localhost
IP.1 = 127.0.0.1
EOF
  chmod 640 ${VAULT_DIR}/vault.key
  # Step 4: Sign Vault cert
  openssl x509 -req -in "${VAULT_DIR}/vault.csr" \
    -CA "${CA_DIR}/root-ca.crt" \
    -CAkey "${CA_DIR}/root-ca.key" \
    -CAcreateserial \
    -out "${VAULT_DIR}/vault.crt" \
    -days 750 -sha256 \
    -extfile "${VAULT_DIR}/vault.cnf" -extensions server

  echo "✅ Vault cert issued in ${VAULT_DIR}"
else
  echo "ℹ️ Vault cert already exists"
fi

# Copy CA cert for Vault and agents
cp "${CA_DIR}/root-ca.crt" "${VAULT_DIR}/root-ca.crt"

echo "📦 Done. Vault certs in ${VAULT_DIR}, root CA in ${CA_DIR}"

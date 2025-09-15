#!/bin/bash
set -euo pipefail

mkdir -p "${VAULT_CA_KEY_DIR}" "${VAULT_CA_CERT_DIR}" "${VAULT_SERVER_DIR}"

# Step 1: Generate root CA (only once!)
if [ ! -f "${VAULT_CA_KEY_DIR}/root-ca.key" ]; then
  echo "➡️ Creating root CA..."
  openssl genrsa -out "${VAULT_CA_KEY_DIR}/root-ca.key" 4096

  openssl req -x509 -new -nodes -key "${VAULT_CA_KEY_DIR}/root-ca.key" \
    -sha256 -days 3650 \
    -subj "/C=AT/ST=9/L=Vienna/O=42Vienna/CN=PongIndustries Root CA" \
    -out "${VAULT_CA_CERT_DIR}/root-ca.crt"

  echo "✅ Root CA created in ${VAULT_CA_DIR}"
else
  echo "ℹ️ Root CA already exists"
fi

# Step 2: Generate Vault server key + CSR
if [ ! -f "${VAULT_SERVER_DIR}/vault.key" ]; then
  echo "➡️ Generating Vault server key + CSR..."
  openssl genrsa -out "${VAULT_SERVER_DIR}/vault.key" 4096

  openssl req -new -key "${VAULT_SERVER_DIR}/vault.key" \
    -out "${VAULT_SERVER_DIR}/vault.csr" \
    -subj "/C=AT/ST=9/L=Vienna/O=42Vienna/CN=vault.local"

  # Step 3: SAN config
  cat > "${VAULT_SERVER_DIR}/vault.cnf" <<EOF
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
  chmod 644 ${VAULT_SERVER_DIR}/vault.key
  # Step 4: Sign Vault cert
  openssl x509 -req -in "${VAULT_SERVER_DIR}/vault.csr" \
    -CA "${VAULT_CA_CERT_DIR}/root-ca.crt" \
    -CAkey "${VAULT_CA_KEY_DIR}/root-ca.key" \
    -CAcreateserial \
    -out "${VAULT_SERVER_DIR}/vault.crt" \
    -days 750 -sha256 \
    -extfile "${VAULT_SERVER_DIR}/vault.cnf" -extensions server

  echo "✅ Vault cert issued in ${VAULT_SERVER_DIR}"
else
  echo "ℹ️ Vault cert already exists"
fi

echo "📦 Done. Vault certs in ${VAULT_SERVER_DIR}, root CA in ${VAULT_CA_DIR}"

api_addr = "https://vault:8200"

storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_cert_file = "/vault/secrets/certs/vault-certs/vault.crt"
  tls_key_file  = "/vault/secrets/certs/vault-certs/vault.key"
  tls_client_ca_file = "/vault/secrets/certs/ca/root-ca.crt"
}

ui = true
disable_mlock = true

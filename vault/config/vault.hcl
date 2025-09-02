api_addr = "https://vault:8200"

storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_cert_file = "/run/secrets/vault_cert"
  tls_key_file  = "/run/secrets/vault_key"
  tls_client_ca_file = "/run/secrets/vault_ca"
}

ui = true
disable_mlock = true

# nginx-policy.hcl
path "pki_int/issue/*" {
  capabilities = ["update"]
}

path "pki_int/certs/*" {
  capabilities = ["read", "list"]
}

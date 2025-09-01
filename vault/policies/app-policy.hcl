# app-policy.hcl
path "secret/data/jwt" {
  capabilities = ["read"]
}

path "secret/metadata/jwt" {
  capabilities = ["read"]
}

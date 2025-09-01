# app-policy.hcl
path "secret/data/jwt" {
  capabilities = ["read"]
}

path "secret/metadata/jwt" {
  capabilities = ["read"]
}

path "secret/data/google" {
  capabilities = ["read"]
}

path "secret/metadata/google" {
  capabilities = ["read"]
}

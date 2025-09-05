# app-policy.hcl
path "secret/data/jwt" {
  capabilities = ["read"]
}

path "secret/metadata/jwt" {
  capabilities = ["read"]
}

path "secret/data/google_id" {
  capabilities = ["read"]
}

path "secret/data/google_secret" {
  capabilities = ["read"]
}

path "secret/metadata/google_id" {
  capabilities = ["read"]
}

path "secret/metadata/google_secret" {
  capabilities = ["read"]
}

# Allow reading KV secrets for JWT and google oauth2
path "secret/data/jwt" {
  capabilities = ["read"]
}
path "secret/metadata/jwt" {
  capabilities = ["read"]
}
path "secret/data/google_oauth2" {
  capabilities = ["read"]
}
path "secret/metadata/google_oauth2" {
  capabilities = ["read"]
}

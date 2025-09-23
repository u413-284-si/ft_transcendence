# Allow reading nginx and app approle definitions
path "auth/approle/role/nginx" {
  capabilities = ["read"]
}
path "auth/approle/role/app" {
  capabilities = ["read"]
}

# Allow reading KV secrets needed for checks
path "secret/data/jwt" {
  capabilities = ["read"]
}
path "secret/data/google_id" {
  capabilities = ["read"]
}
path "secret/data/google_secret" {
  capabilities = ["read"]
}
path "secret/data/ngrok" {
  capabilities = ["read"]
}

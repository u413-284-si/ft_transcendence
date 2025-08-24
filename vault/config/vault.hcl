api_addr = "http://127.0.0.1:8200"

storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address = "0.0.0.0:8200"
  tls_disable = 1
}

ui = true
disable_mlock = true

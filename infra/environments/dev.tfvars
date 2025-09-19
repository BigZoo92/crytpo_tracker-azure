location = "westeurope"

rg_name  = "ctc-dev-rg"
la_name  = "ctc-dev-la"
cae_name = "ctc-dev-cae"
acr_name = "ctcdevacr"
sa_name  = "ctcdevfuncsa"

tags = {
  project = "ctc"
  env     = "dev"
  owner   = "you"
}
backend_image  = "ctcdevacr.azurecr.io/ctc-backend:0.1.2"
frontend_image = "ctcdevacr.azurecr.io/ctc-frontend:0.1.2"

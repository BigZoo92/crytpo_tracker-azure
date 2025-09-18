module "rg" {
  source   = "./modules/rg"
  name     = var.rg_name
  location = var.location
  tags     = var.tags
}

module "la" {
  source              = "./modules/log_analytics"
  name                = var.la_name
  location            = var.location
  resource_group_name = module.rg.name
  tags                = var.tags
}

module "cae" {
  source                     = "./modules/container_apps_env"
  name                       = var.cae_name
  location                   = var.location
  resource_group_name        = module.rg.name
  log_analytics_workspace_id = module.la.id
  tags                       = var.tags
}

module "acr" {
  source              = "./modules/acr"
  name                = var.acr_name
  location            = var.location
  resource_group_name = module.rg.name
  tags                = var.tags
}

module "func_storage" {
  source              = "./modules/storage"
  name                = var.sa_name
  location            = var.location
  resource_group_name = module.rg.name
  tags                = var.tags
}

module "app_backend" {
  source = "./modules/container_app_backend"

  name                = "ctc-dev-api"
  location            = var.location
  resource_group_name = module.rg.name
  environment_id      = module.cae.id
  image               = var.backend_image

  registry_server   = module.acr.login_server
  registry_username = module.acr.admin_username
  registry_password = module.acr.admin_password

  azurewebjobsstorage = module.func_storage.connection_string

  tags = var.tags
}

module "app_frontend" {
  source = "./modules/container_app_frontend"

  name                = "ctc-dev-web"
  location            = var.location
  resource_group_name = module.rg.name
  environment_id      = module.cae.id
  image               = var.frontend_image

  registry_server   = module.acr.login_server
  registry_username = module.acr.admin_username
  registry_password = module.acr.admin_password

  tags = var.tags
}


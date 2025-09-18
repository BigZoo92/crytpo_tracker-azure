output "resource_group_name" {
  value = module.rg.name
}

output "acr_login_server" {
  value = module.acr.login_server
}

output "container_apps_environment_id" {
  value = module.cae.id
}

output "log_analytics_id" {
  value = module.la.id
}

output "func_storage_connection_string" {
  value     = module.func_storage.connection_string
  sensitive = true
}

output "backend_fqdn" {
  value = module.app_backend.fqdn
}
output "frontend_fqdn" {
  value = module.app_frontend.fqdn
}

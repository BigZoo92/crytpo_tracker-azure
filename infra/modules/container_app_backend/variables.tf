variable "name" { type = string }
variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "environment_id" { type = string }
variable "image" { type = string }

# ACR (on va utiliser les credentials admin pour aller vite)
variable "registry_server" { type = string }
variable "registry_username" { type = string }
variable "registry_password" { type = string }

# Obligatoire pour Functions (même en conteneur)
variable "azurewebjobsstorage" { type = string }

variable "tags" { type = map(string) }

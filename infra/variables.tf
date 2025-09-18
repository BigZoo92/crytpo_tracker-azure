variable "location" { type = string }
variable "rg_name" { type = string }
variable "acr_name" { type = string }
variable "la_name" { type = string }
variable "cae_name" { type = string }
variable "sa_name" { type = string } # Storage pour AzureWebJobsStorage (backend Functions)

variable "tags" {
  type    = map(string)
  default = {}
}

variable "backend_image" { type = string }
variable "frontend_image" { type = string }


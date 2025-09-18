variable "name" { type = string } # 3-24, lowercase, unique global
variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "tags" { type = map(string) }

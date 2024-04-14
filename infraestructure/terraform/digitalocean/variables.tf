variable "do_token" {
  type        = string
  description = "Token DigitalOcean"
}


variable "cluster_version" {
  type        = string
  default     = "1.29.1-do.0"
  description = "K8s Cluster Version."
}


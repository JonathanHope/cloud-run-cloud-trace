variable "project" {
  type = string
  description = "Target project ID"
}

variable "region" {
  type = string
  description = "Target region"
}

variable "api_image" {
  type = string
  description = "API image to deploy"
}

variable "collector_image" {
  type = string
  description = "API image to deploy"
}

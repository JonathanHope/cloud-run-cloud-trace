resource "google_service_account" "trace-api-sa" {
  account_id = "trace-api-sa"
  display_name = "trace-api-sa"
  project = var.project
}

# This roles is needed for the collector to publish traces.
resource "google_project_iam_member" "trace-api-sa-metric-writer" {
  project = var.project
  role    = "roles/cloudtrace.agent"
  member  = "serviceAccount:${google_service_account.trace-api-sa.email}"
}

resource "google_cloud_run_v2_service" "trace-api" {
  name     = "trace-api"
  location = var.region
  project = var.project
  ingress = "INGRESS_TRAFFIC_ALL"
  launch_stage = "BETA"

  template {
    service_account = google_service_account.trace-api-sa.email
    
    containers {
      image = var.api_image

      startup_probe {
        http_get {
          path = "/health"
          port = 8080
        }
      }
      
      env {
        name = "OTEL_EXPORTER_OTLP_ENDPOINT"
        value = "http://localhost:4317"
      }

      env {
        name = "PROD_TRACE_EXPORT"
        value = "true"
      }
    }

    containers {
      image = var.collector_image

      startup_probe {
        http_get {
          path = "/"
          port = 13133
        }
      }
    }
  }
}

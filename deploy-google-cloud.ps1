param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectId,

  [string]$Region = "us-central1",
  [string]$ServiceName = "stock-piler",
  [string]$AccessToken = "",
  [switch]$AllowUnauthenticated
)

$ErrorActionPreference = "Stop"

Write-Host "Setting Google Cloud project: $ProjectId"
gcloud config set project $ProjectId

Write-Host "Enabling required services"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com firestore.googleapis.com cloudscheduler.googleapis.com

Write-Host "Deploying Stock Piler to Cloud Run"
$envVars = "STOCK_PILER_STORAGE=firestore,STOCK_PILER_POLL_SECONDS=60,STOCK_PILER_FIRESTORE_COLLECTION=stock_piler,STOCK_PILER_FIRESTORE_DOCUMENT=default"
if ($AccessToken) {
  $envVars = "$envVars,STOCK_PILER_ACCESS_TOKEN=$AccessToken"
}

$authFlag = if ($AllowUnauthenticated) { "--allow-unauthenticated" } else { "--no-allow-unauthenticated" }

gcloud run deploy $ServiceName `
  --source . `
  --region $Region `
  --set-env-vars $envVars `
  --min-instances 0 `
  --max-instances 1 `
  --cpu 1 `
  --memory 512Mi `
  $authFlag

Write-Host "Deployment complete."

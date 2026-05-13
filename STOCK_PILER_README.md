# Stock Piler

Stock Piler is a local server-backed stock watchlist and alert dashboard.

## Guardrails

- Stock Piler does not place Robinhood trades.
- Buy and sell orders stay manual inside Robinhood.
- No options, margin, short selling, or automatic liquidation.
- WhatsApp auto-send is disabled unless you provide official WhatsApp Cloud API credentials.
- Alerts are research prompts, not financial advice.

## Run

Install the optional Yahoo Finance helper:

```powershell
python -m pip install -r requirements.txt
```

Start the server:

```powershell
python stock_piler_server.py
```

Open:

```text
http://localhost:5173/stock-piler.html
```

If port `5173` is busy:

```powershell
$env:STOCK_PILER_PORT="5174"; python stock_piler_server.py
```

Then open:

```text
http://localhost:5174/stock-piler.html
```

## Phone Access

Keep the server running on your laptop. On the same Wi-Fi, open:

```text
http://YOUR-LAPTOP-IP:5173/stock-piler.html
```

## APIs

- `GET /api/status`
- `GET /api/state`
- `GET /api/lookup?q=netflix`
- `GET /api/quotes?symbols=NFLX,QCOM,2317.TW`
- `POST /api/watchlist`
- `DELETE /api/watchlist/{symbol}`
- `POST /api/alerts/check`
- `POST /api/settings`

## WhatsApp Auto-Send

Manual WhatsApp share works without setup. For real auto-send, set these environment variables before starting the server:

```powershell
$env:WHATSAPP_ACCESS_TOKEN="your_meta_cloud_api_token"
$env:WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id"
$env:WHATSAPP_TO_PHONE="15551234567"
python stock_piler_server.py
```

Use an official Meta WhatsApp Cloud API account. Do not put secrets in the code.

## Google Cloud Run

Install and sign in to the Google Cloud CLI first:

```powershell
gcloud auth login
gcloud auth application-default login
```

Deploy with a simple app access token:

```powershell
.\deploy-google-cloud.ps1 -ProjectId "YOUR_PROJECT_ID" -Region "us-central1" -AccessToken "choose-a-long-random-token" -AllowUnauthenticated
```

Cloud Run will use:

- Cloud Run for the web/API server
- Cloud Build to build the container from source
- Firestore for persistent watchlist/settings/alerts

If you do not use `-AllowUnauthenticated`, Cloud Run requires Google identity access and the phone browser flow is less convenient.

For minute-by-minute cloud checks, use Cloud Scheduler to call:

```text
https://YOUR_CLOUD_RUN_URL/api/alerts/check?refresh=true&send=true
```

Add this HTTP header in the scheduler job if you set `STOCK_PILER_ACCESS_TOKEN`:

```text
X-Stock-Piler-Token: your-token
```

This avoids relying on a background loop inside Cloud Run.

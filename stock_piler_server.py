from __future__ import annotations

import json
import mimetypes
import os
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, unquote, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "stock_piler_data.json"
PORT = int(os.environ.get("PORT") or os.environ.get("STOCK_PILER_PORT", "5173"))
POLL_SECONDS = int(os.environ.get("STOCK_PILER_POLL_SECONDS", "60"))
STORAGE_BACKEND = os.environ.get("STOCK_PILER_STORAGE", "file").lower()
FIRESTORE_COLLECTION = os.environ.get("STOCK_PILER_FIRESTORE_COLLECTION", "stock_piler")
FIRESTORE_DOCUMENT = os.environ.get("STOCK_PILER_FIRESTORE_DOCUMENT", "default")
ACCESS_TOKEN = os.environ.get("STOCK_PILER_ACCESS_TOKEN", "")

try:
    import yfinance as yf
except ModuleNotFoundError:
    yf = None

try:
    from google.cloud import firestore
except ModuleNotFoundError:
    firestore = None


DEFAULT_WATCHLIST = [
    {"symbol": "VT", "name": "Vanguard Total World Stock ETF", "category": "Core ETF", "region": "Global", "fit": "Robinhood", "move": 0, "role": "One-fund global starter"},
    {"symbol": "VOO", "name": "Vanguard S&P 500 ETF", "category": "Core ETF", "region": "United States", "fit": "Robinhood", "move": 0, "role": "Core U.S. large-company exposure"},
    {"symbol": "VTI", "name": "Vanguard Total Stock Market ETF", "category": "Core ETF", "region": "United States", "fit": "Robinhood", "move": 0, "role": "Broad U.S. market exposure"},
    {"symbol": "VXUS", "name": "Vanguard Total International Stock ETF", "category": "Global", "region": "International", "fit": "Robinhood", "move": 0, "role": "Non-U.S. diversification"},
    {"symbol": "QQQM", "name": "Invesco Nasdaq 100 ETF", "category": "Tech/Growth", "region": "United States", "fit": "Robinhood", "move": 0, "role": "Large tech and growth exposure"},
    {"symbol": "SMH", "name": "VanEck Semiconductor ETF", "category": "Semiconductor", "region": "Global", "fit": "Robinhood", "move": 0, "role": "Semiconductor basket"},
    {"symbol": "SOXX", "name": "iShares Semiconductor ETF", "category": "Semiconductor", "region": "Global", "fit": "Robinhood", "move": 0, "role": "Alternative chip-sector basket"},
    {"symbol": "MSFT", "name": "Microsoft", "category": "Stable", "region": "United States", "fit": "Robinhood", "move": 0, "role": "Profitable stable technology"},
    {"symbol": "AAPL", "name": "Apple", "category": "Stable", "region": "United States", "fit": "Robinhood", "move": 0, "role": "Large consumer technology"},
    {"symbol": "GOOGL", "name": "Alphabet", "category": "Tech/Growth", "region": "United States", "fit": "Robinhood", "move": 0, "role": "Search, cloud, and AI exposure"},
    {"symbol": "BRK.B", "name": "Berkshire Hathaway", "category": "Stable", "region": "United States", "fit": "Robinhood", "move": 0, "role": "Diversified quality company"},
    {"symbol": "COST", "name": "Costco", "category": "Stable", "region": "United States", "fit": "Robinhood", "move": 0, "role": "Defensive retail compounder"},
    {"symbol": "NVDA", "name": "Nvidia", "category": "Semiconductor", "region": "United States", "fit": "Robinhood", "move": 0, "role": "AI chip leader, high volatility"},
    {"symbol": "AMD", "name": "Advanced Micro Devices", "category": "Semiconductor", "region": "United States", "fit": "Robinhood", "move": 0, "role": "Chip growth candidate, volatile"},
    {"symbol": "AVGO", "name": "Broadcom", "category": "Semiconductor", "region": "United States", "fit": "Robinhood", "move": 0, "role": "Semiconductor and infrastructure software"},
    {"symbol": "TSM", "name": "Taiwan Semiconductor ADR", "category": "Semiconductor", "region": "Taiwan", "fit": "ADR", "move": 0, "role": "Global chip manufacturing leader"},
    {"symbol": "ASML", "name": "ASML ADR", "category": "Semiconductor", "region": "Netherlands", "fit": "ADR", "move": 0, "role": "Semiconductor equipment leader"},
    {"symbol": "META", "name": "Meta Platforms", "category": "Tech/Growth", "region": "United States", "fit": "Robinhood", "move": 0, "role": "Profitable social and AI platform"},
    {"symbol": "SHOP", "name": "Shopify", "category": "Tech/Growth", "region": "Canada", "fit": "Robinhood", "move": 0, "role": "Higher-growth commerce software"},
    {"symbol": "INDA", "name": "iShares MSCI India ETF", "category": "Global", "region": "India", "fit": "Robinhood", "move": 0, "role": "India market ETF"},
    {"symbol": "INFY", "name": "Infosys ADR", "category": "Global", "region": "India", "fit": "ADR", "move": 0, "role": "Indian IT services exposure"},
    {"symbol": "EWU", "name": "iShares MSCI United Kingdom ETF", "category": "Global", "region": "United Kingdom", "fit": "Robinhood", "move": 0, "role": "U.K. market ETF"},
    {"symbol": "AZN", "name": "AstraZeneca ADR", "category": "Global", "region": "United Kingdom", "fit": "ADR", "move": 0, "role": "Global healthcare exposure"},
    {"symbol": "SAP", "name": "SAP ADR", "category": "Global", "region": "Germany", "fit": "ADR", "move": 0, "role": "European enterprise software"},
]

ALIASES = {
    "netflix": {"symbol": "NFLX", "name": "Netflix", "category": "Tech/Growth", "region": "United States", "fit": "Robinhood"},
    "foxconn": {"symbol": "2317.TW", "name": "Hon Hai Precision Industry / Foxconn", "category": "Global", "region": "Taiwan", "fit": "Track only"},
    "hon hai": {"symbol": "2317.TW", "name": "Hon Hai Precision Industry / Foxconn", "category": "Global", "region": "Taiwan", "fit": "Track only"},
    "qualcomm": {"symbol": "QCOM", "name": "Qualcomm", "category": "Semiconductor", "region": "United States", "fit": "Robinhood"},
    "tata": {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "category": "Global", "region": "India", "fit": "Track only"},
    "tata motors": {"symbol": "TATAMOTORS.NS", "name": "Tata Motors", "category": "Global", "region": "India", "fit": "Track only"},
    "tata steel": {"symbol": "TATASTEEL.NS", "name": "Tata Steel", "category": "Global", "region": "India", "fit": "Track only"},
    "microsoft": {"symbol": "MSFT", "name": "Microsoft", "category": "Stable", "region": "United States", "fit": "Robinhood"},
    "apple": {"symbol": "AAPL", "name": "Apple", "category": "Stable", "region": "United States", "fit": "Robinhood"},
    "tesla": {"symbol": "TSLA", "name": "Tesla", "category": "Tech/Growth", "region": "United States", "fit": "Robinhood"},
    "amazon": {"symbol": "AMZN", "name": "Amazon", "category": "Tech/Growth", "region": "United States", "fit": "Robinhood"},
    "nvidia": {"symbol": "NVDA", "name": "Nvidia", "category": "Semiconductor", "region": "United States", "fit": "Robinhood"},
    "google": {"symbol": "GOOGL", "name": "Alphabet", "category": "Tech/Growth", "region": "United States", "fit": "Robinhood"},
    "alphabet": {"symbol": "GOOGL", "name": "Alphabet", "category": "Tech/Growth", "region": "United States", "fit": "Robinhood"},
}

DEFAULT_DATA = {
    "settings": {
        "monthlyBudget": 50,
        "riskStyle": "Conservative / Moderate",
        "pollSeconds": POLL_SECONDS,
        "autoWhatsApp": False,
        "guardrails": {
            "autoTrading": False,
            "manualRobinhoodOrdersOnly": True,
            "noOptionsMarginShorting": True,
            "maxMonthlyBudget": 50,
        },
    },
    "watchlist": DEFAULT_WATCHLIST,
    "alertState": {},
    "alerts": [],
}

DATA_LOCK = threading.Lock()
FIRESTORE_CLIENT = None


def normalize(value: str) -> str:
    return " ".join(value.lower().strip().replace("&", " ").split())


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def read_json_body(handler: BaseHTTPRequestHandler) -> dict:
    size = int(handler.headers.get("Content-Length", "0") or "0")
    if size <= 0:
        return {}
    return json.loads(handler.rfile.read(size).decode("utf-8"))


def load_data() -> dict:
    with DATA_LOCK:
        if use_firestore():
            doc = firestore_doc()
            snapshot = doc.get()
            if not snapshot.exists:
                doc.set(DEFAULT_DATA)
                return json.loads(json.dumps(DEFAULT_DATA))
            data = snapshot.to_dict() or {}
            data.setdefault("settings", DEFAULT_DATA["settings"])
            data.setdefault("watchlist", DEFAULT_WATCHLIST)
            data.setdefault("alertState", {})
            data.setdefault("alerts", [])
            return data
        if not DATA_PATH.exists():
            save_data(DEFAULT_DATA)
            return json.loads(json.dumps(DEFAULT_DATA))
        data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
        data.setdefault("settings", DEFAULT_DATA["settings"])
        data.setdefault("watchlist", DEFAULT_WATCHLIST)
        data.setdefault("alertState", {})
        data.setdefault("alerts", [])
        return data


def save_data(data: dict) -> None:
    if use_firestore():
      firestore_doc().set(data)
      return
    DATA_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")


def use_firestore() -> bool:
    return STORAGE_BACKEND == "firestore" and firestore is not None


def firestore_doc():
    global FIRESTORE_CLIENT
    if FIRESTORE_CLIENT is None:
        FIRESTORE_CLIENT = firestore.Client()
    return FIRESTORE_CLIENT.collection(FIRESTORE_COLLECTION).document(FIRESTORE_DOCUMENT)


def yahoo_request(url: str) -> dict:
    request = Request(url, headers={"User-Agent": "StockPiler/1.0"})
    with urlopen(request, timeout=12) as response:
        return json.loads(response.read().decode("utf-8"))


def yahoo_search(query: str) -> dict | None:
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={query.replace(' ', '%20')}&quotes_count=1&news_count=0"
    payload = yahoo_request(url)
    quotes = payload.get("quotes") or []
    if not quotes:
        return None
    quote = quotes[0]
    symbol = quote.get("symbol")
    if not symbol:
        return None
    return {
        "symbol": symbol,
        "name": quote.get("shortname") or quote.get("longname") or symbol,
        "category": "Global",
        "region": quote.get("exchDisp") or quote.get("exchange") or "Unknown",
        "fit": "Track only",
        "source": "Yahoo Finance search API",
    }


def yfinance_search(query: str) -> dict | None:
    if yf is None:
        return None
    search = getattr(yf, "Search", None)
    if search is None:
        return None
    result = search(query, max_results=1)
    quotes = getattr(result, "quotes", None) or []
    if not quotes:
        return None
    quote = quotes[0]
    symbol = quote.get("symbol")
    if not symbol:
        return None
    return {
        "symbol": symbol,
        "name": quote.get("shortname") or quote.get("longname") or symbol,
        "category": "Global",
        "region": quote.get("exchDisp") or quote.get("exchange") or "Unknown",
        "fit": "Track only",
        "source": "yfinance search",
    }


def lookup_symbol(query: str) -> dict:
    clean = normalize(query)
    if not clean:
        return {"ok": False, "error": "Enter a company name or ticker."}
    if clean in ALIASES:
        return {"ok": True, **ALIASES[clean], "source": "local alias"}
    try:
        result = yfinance_search(query) or yahoo_search(query)
        if result:
            return {"ok": True, **result}
    except (HTTPError, URLError, TimeoutError, OSError) as exc:
        return {"ok": False, "error": f"Lookup API failed: {exc}"}
    except Exception as exc:
        return {"ok": False, "error": f"Lookup failed: {exc}"}
    return {"ok": False, "error": "Could not find a matching Yahoo Finance symbol."}


def quote_with_yfinance(symbol: str) -> dict | None:
    if yf is None:
        return None
    ticker = yf.Ticker(symbol)
    fast = getattr(ticker, "fast_info", None)
    latest = float(getattr(fast, "last_price", 0) or 0) if fast else 0
    day_low = float(getattr(fast, "day_low", 0) or 0) if fast else 0
    previous_close = float(getattr(fast, "previous_close", 0) or 0) if fast else 0
    if latest <= 0:
        return None
    move = ((latest - previous_close) / previous_close) * 100 if previous_close else 0
    return {"symbol": symbol, "ok": True, "latest": round(latest, 4), "dayLow": round(day_low or latest, 4), "move": round(move, 2), "source": "yfinance"}


def quote_with_yahoo_chart(symbol: str) -> dict:
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range=1d&interval=1m"
    payload = yahoo_request(url)
    result = (payload.get("chart", {}).get("result") or [None])[0]
    if not result:
        return {"symbol": symbol, "ok": False, "error": "No chart data returned."}
    meta = result.get("meta", {})
    quote = (result.get("indicators", {}).get("quote") or [{}])[0]
    closes = [value for value in quote.get("close", []) if value is not None]
    lows = [value for value in quote.get("low", []) if value is not None]
    latest = float(meta.get("regularMarketPrice") or (closes[-1] if closes else 0))
    day_low = float(min(lows) if lows else latest)
    previous_close = float(meta.get("chartPreviousClose") or 0)
    move = ((latest - previous_close) / previous_close) * 100 if latest and previous_close else 0
    if latest <= 0:
        return {"symbol": symbol, "ok": False, "error": "No live price returned."}
    return {"symbol": symbol, "ok": True, "latest": round(latest, 4), "dayLow": round(day_low, 4), "move": round(move, 2), "source": "Yahoo Finance chart API"}


def quote_for_symbol(symbol: str) -> dict:
    try:
        return quote_with_yfinance(symbol) or quote_with_yahoo_chart(symbol)
    except Exception as exc:
        return {"symbol": symbol, "ok": False, "error": str(exc)}


def ensure_alert_state(data: dict) -> None:
    state = data.setdefault("alertState", {})
    for item in data.get("watchlist", []):
        symbol = item["symbol"]
        state.setdefault(symbol, {"enabled": True, "latest": 0, "low": 0, "lastAlertDate": None})


def refresh_quotes(data: dict, symbols: list[str] | None = None) -> list[dict]:
    ensure_alert_state(data)
    target_symbols = symbols or [item["symbol"] for item in data.get("watchlist", [])]
    quotes = [quote_for_symbol(symbol) for symbol in target_symbols]
    by_symbol = {item["symbol"]: item for item in data.get("watchlist", [])}
    for quote in quotes:
        if not quote.get("ok"):
            continue
        symbol = quote["symbol"]
        state = data["alertState"].setdefault(symbol, {"enabled": True, "latest": 0, "low": 0, "lastAlertDate": None})
        state["latest"] = quote["latest"]
        state["low"] = quote["dayLow"]
        if symbol in by_symbol:
            by_symbol[symbol]["move"] = quote.get("move", 0)
    save_data(data)
    return quotes


def whatsapp_configured() -> bool:
    return all([
        os.environ.get("WHATSAPP_ACCESS_TOKEN"),
        os.environ.get("WHATSAPP_PHONE_NUMBER_ID"),
        os.environ.get("WHATSAPP_TO_PHONE"),
    ])


def send_whatsapp(message: str) -> dict:
    if not whatsapp_configured():
        return {"ok": False, "manualUrl": f"https://wa.me/?text={message.replace(' ', '%20')}", "error": "WhatsApp Cloud API env vars are not configured."}
    phone_id = os.environ["WHATSAPP_PHONE_NUMBER_ID"]
    token = os.environ["WHATSAPP_ACCESS_TOKEN"]
    to_phone = os.environ["WHATSAPP_TO_PHONE"]
    body = json.dumps({
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "text",
        "text": {"body": message},
    }).encode("utf-8")
    request = Request(
        f"https://graph.facebook.com/v20.0/{phone_id}/messages",
        data=body,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=12) as response:
            return {"ok": True, "response": json.loads(response.read().decode("utf-8"))}
    except Exception as exc:
        return {"ok": False, "error": str(exc)}


def check_alerts(data: dict, send: bool = False) -> list[dict]:
    ensure_alert_state(data)
    today = datetime.now().date().isoformat()
    alerts = []
    by_symbol = {item["symbol"]: item for item in data.get("watchlist", [])}
    for symbol, state in data.get("alertState", {}).items():
        item = by_symbol.get(symbol)
        if not item or not state.get("enabled"):
            continue
        latest = float(state.get("latest") or 0)
        low = float(state.get("low") or 0)
        if latest <= 0 or low <= 0 or latest > low:
            continue
        if state.get("lastAlertDate") == today:
            continue
        message = f'buy alert "{symbol} - {item["name"]}" has hit the lowest price'
        alert = {"symbol": symbol, "message": message, "createdAt": now_iso(), "sent": False}
        if send:
            result = send_whatsapp(message)
            alert["sent"] = bool(result.get("ok"))
            alert["sendResult"] = result
        alerts.append(alert)
        data.setdefault("alerts", []).insert(0, alert)
        state["lastAlertDate"] = today
    save_data(data)
    return alerts


def monitor_loop() -> None:
    while True:
        time.sleep(POLL_SECONDS)
        try:
            data = load_data()
            refresh_quotes(data)
            check_alerts(data, send=bool(data.get("settings", {}).get("autoWhatsApp")))
        except Exception:
            continue


class StockPilerHandler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/status":
            self.send_json({
                "ok": True,
                "server": "Stock Piler API",
                "yfinanceInstalled": yf is not None,
                "yfinance": yf.__version__ if yf else None,
                "whatsappConfigured": whatsapp_configured(),
                "pollSeconds": POLL_SECONDS,
                "storage": "firestore" if use_firestore() else "file",
                "accessTokenRequired": bool(ACCESS_TOKEN),
            })
            return
        if parsed.path.startswith("/api/") and not self.authorized():
            self.send_json({"ok": False, "error": "Access token required."}, status=401)
            return
        if parsed.path == "/api/state":
            data = load_data()
            ensure_alert_state(data)
            save_data(data)
            self.send_json({"ok": True, "data": data})
            return
        if parsed.path == "/api/lookup":
            query = parse_qs(parsed.query).get("q", [""])[0]
            self.send_json(lookup_symbol(query))
            return
        if parsed.path == "/api/quotes":
            data = load_data()
            symbols = parse_qs(parsed.query).get("symbols", [""])[0]
            values = [item.strip().upper() for item in symbols.split(",") if item.strip()]
            self.send_json({"ok": True, "quotes": refresh_quotes(data, values or None)})
            return
        if parsed.path == "/api/alerts/check":
            query = parse_qs(parsed.query)
            data = load_data()
            if query.get("refresh", ["true"])[0].lower() != "false":
                refresh_quotes(data)
            send = query.get("send", ["false"])[0].lower() == "true"
            alerts = check_alerts(data, send=send)
            self.send_json({"ok": True, "alerts": alerts, "data": data})
            return
        self.serve_static(parsed.path)

    def do_POST(self) -> None:
        if not self.authorized():
            self.send_json({"ok": False, "error": "Access token required."}, status=401)
            return
        parsed = urlparse(self.path)
        body = read_json_body(self)
        if parsed.path == "/api/watchlist":
            data = load_data()
            item = self.build_watchlist_item(body)
            if not item.get("symbol"):
                self.send_json({"ok": False, "error": "Could not detect symbol."}, status=400)
                return
            if any(existing["symbol"] == item["symbol"] for existing in data.get("watchlist", [])):
                self.send_json({"ok": False, "error": f'{item["symbol"]} already exists.'}, status=409)
                return
            data.setdefault("watchlist", []).insert(0, item)
            ensure_alert_state(data)
            save_data(data)
            self.send_json({"ok": True, "item": item, "data": data})
            return
        if parsed.path == "/api/settings":
            data = load_data()
            data.setdefault("settings", {}).update(body)
            save_data(data)
            self.send_json({"ok": True, "settings": data["settings"]})
            return
        if parsed.path == "/api/alerts/check":
            data = load_data()
            refresh = bool(body.get("refresh", True))
            if refresh:
                refresh_quotes(data)
            alerts = check_alerts(data, send=bool(body.get("send", False)))
            self.send_json({"ok": True, "alerts": alerts, "data": data})
            return
        self.send_json({"ok": False, "error": "Not found"}, status=404)

    def do_DELETE(self) -> None:
        if not self.authorized():
            self.send_json({"ok": False, "error": "Access token required."}, status=401)
            return
        parsed = urlparse(self.path)
        prefix = "/api/watchlist/"
        if parsed.path.startswith(prefix):
            symbol = unquote(parsed.path[len(prefix):]).upper()
            data = load_data()
            data["watchlist"] = [item for item in data.get("watchlist", []) if item["symbol"] != symbol]
            data.get("alertState", {}).pop(symbol, None)
            data["alerts"] = [alert for alert in data.get("alerts", []) if alert.get("symbol") != symbol]
            save_data(data)
            self.send_json({"ok": True, "data": data})
            return
        self.send_json({"ok": False, "error": "Not found"}, status=404)

    def build_watchlist_item(self, body: dict) -> dict:
        symbol = str(body.get("symbol") or "").strip().upper()
        name = str(body.get("name") or "").strip()
        lookup = None
        if not symbol and name:
            lookup = lookup_symbol(name)
            if lookup.get("ok"):
                symbol = lookup["symbol"].upper()
        return {
            "symbol": symbol,
            "name": lookup.get("name") if lookup and lookup.get("ok") else (name or symbol),
            "category": lookup.get("category") if lookup and lookup.get("ok") else body.get("category", "Global"),
            "region": body.get("region") or (lookup.get("region") if lookup and lookup.get("ok") else "Unknown"),
            "fit": lookup.get("fit") if lookup and lookup.get("ok") else body.get("fit", "Check Robinhood"),
            "move": 0,
            "role": "Server-added symbol. Confirm ticker, price, availability, and risk before buying.",
        }

    def authorized(self) -> bool:
        if not ACCESS_TOKEN:
            return True
        return self.headers.get("X-Stock-Piler-Token") == ACCESS_TOKEN

    def send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serve_static(self, request_path: str) -> None:
        clean = unquote(request_path.lstrip("/")) or "stock-piler.html"
        target = (ROOT / clean).resolve()
        if not str(target).startswith(str(ROOT)) or not target.is_file():
            self.send_error(404, "Not found")
            return
        body = target.read_bytes()
        content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args) -> None:
        return


if __name__ == "__main__":
    ensure_alert_state(load_data())
    threading.Thread(target=monitor_loop, daemon=True).start()
    print(f"Stock Piler API running at http://localhost:{PORT}/stock-piler.html")
    print("Guardrail: this server does not place Robinhood trades.")
    if yf is None:
        print("Optional: install yfinance with python -m pip install yfinance")
    if not whatsapp_configured():
        print("WhatsApp auto-send disabled. Set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_TO_PHONE to enable.")
    ThreadingHTTPServer(("0.0.0.0", PORT), StockPilerHandler).serve_forever()

let watchlist = [
  { symbol: "VT", name: "Vanguard Total World Stock ETF", category: "Core ETF", region: "Global", fit: "Robinhood", move: 0.42, role: "One-fund global starter" },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", category: "Core ETF", region: "United States", fit: "Robinhood", move: 0.58, role: "Core U.S. large-company exposure" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", category: "Core ETF", region: "United States", fit: "Robinhood", move: 0.37, role: "Broad U.S. market exposure" },
  { symbol: "VXUS", name: "Vanguard Total International Stock ETF", category: "Global", region: "International", fit: "Robinhood", move: -0.18, role: "Non-U.S. diversification" },
  { symbol: "QQQM", name: "Invesco Nasdaq 100 ETF", category: "Tech/Growth", region: "United States", fit: "Robinhood", move: 0.91, role: "Large tech and growth exposure" },
  { symbol: "SMH", name: "VanEck Semiconductor ETF", category: "Semiconductor", region: "Global", fit: "Robinhood", move: 1.16, role: "Semiconductor basket" },
  { symbol: "SOXX", name: "iShares Semiconductor ETF", category: "Semiconductor", region: "Global", fit: "Robinhood", move: 0.86, role: "Alternative chip-sector basket" },
  { symbol: "MSFT", name: "Microsoft", category: "Stable", region: "United States", fit: "Robinhood", move: 0.44, role: "Profitable stable technology" },
  { symbol: "AAPL", name: "Apple", category: "Stable", region: "United States", fit: "Robinhood", move: -0.23, role: "Large consumer technology" },
  { symbol: "GOOGL", name: "Alphabet", category: "Tech/Growth", region: "United States", fit: "Robinhood", move: 0.31, role: "Search, cloud, and AI exposure" },
  { symbol: "BRK.B", name: "Berkshire Hathaway", category: "Stable", region: "United States", fit: "Robinhood", move: 0.12, role: "Diversified quality company" },
  { symbol: "COST", name: "Costco", category: "Stable", region: "United States", fit: "Robinhood", move: -0.09, role: "Defensive retail compounder" },
  { symbol: "NVDA", name: "Nvidia", category: "Semiconductor", region: "United States", fit: "Robinhood", move: 1.74, role: "AI chip leader, high volatility" },
  { symbol: "AMD", name: "Advanced Micro Devices", category: "Semiconductor", region: "United States", fit: "Robinhood", move: -1.06, role: "Chip growth candidate, volatile" },
  { symbol: "AVGO", name: "Broadcom", category: "Semiconductor", region: "United States", fit: "Robinhood", move: 0.68, role: "Semiconductor and infrastructure software" },
  { symbol: "TSM", name: "Taiwan Semiconductor ADR", category: "Semiconductor", region: "Taiwan", fit: "ADR", move: 0.39, role: "Global chip manufacturing leader" },
  { symbol: "ASML", name: "ASML ADR", category: "Semiconductor", region: "Netherlands", fit: "ADR", move: -0.32, role: "Semiconductor equipment leader" },
  { symbol: "META", name: "Meta Platforms", category: "Tech/Growth", region: "United States", fit: "Robinhood", move: 0.77, role: "Profitable social and AI platform" },
  { symbol: "SHOP", name: "Shopify", category: "Tech/Growth", region: "Canada", fit: "Robinhood", move: -0.83, role: "Higher-growth commerce software" },
  { symbol: "INDA", name: "iShares MSCI India ETF", category: "Global", region: "India", fit: "Robinhood", move: 0.22, role: "India market ETF" },
  { symbol: "INFY", name: "Infosys ADR", category: "Global", region: "India", fit: "ADR", move: -0.14, role: "Indian IT services exposure" },
  { symbol: "EWU", name: "iShares MSCI United Kingdom ETF", category: "Global", region: "United Kingdom", fit: "Robinhood", move: 0.08, role: "U.K. market ETF" },
  { symbol: "AZN", name: "AstraZeneca ADR", category: "Global", region: "United Kingdom", fit: "ADR", move: 0.27, role: "Global healthcare exposure" },
  { symbol: "SAP", name: "SAP ADR", category: "Global", region: "Germany", fit: "ADR", move: 0.35, role: "European enterprise software" },
];

const allocations = [
  { label: "Broad ETF", percent: 60, symbol: "VT or VOO", note: "Main conservative foundation." },
  { label: "Semiconductor ETF", percent: 20, symbol: "SMH or SOXX", note: "Chip exposure without choosing one winner." },
  { label: "Stable Company", percent: 10, symbol: "MSFT, BRK.B, or COST", note: "Quality individual-stock practice." },
  { label: "International / India", percent: 10, symbol: "VXUS, INDA, or EWU", note: "Global diversification." },
];

const symbolAliases = {
  FOXCONN: { symbol: "2317.TW", name: "Hon Hai Precision Industry / Foxconn", category: "Global", region: "Taiwan", fit: "Track only" },
  "HON HAI": { symbol: "2317.TW", name: "Hon Hai Precision Industry / Foxconn", category: "Global", region: "Taiwan", fit: "Track only" },
  "HON HAI PRECISION": { symbol: "2317.TW", name: "Hon Hai Precision Industry / Foxconn", category: "Global", region: "Taiwan", fit: "Track only" },
  HNHPF: { symbol: "HNHPF", name: "Hon Hai Precision Industry OTC", category: "Global", region: "Taiwan / OTC", fit: "Check Robinhood" },
  TATA: { symbol: "TCS.NS", name: "Tata Consultancy Services", category: "Global", region: "India", fit: "Track only" },
  "TATA CONSULTANCY SERVICES": { symbol: "TCS.NS", name: "Tata Consultancy Services", category: "Global", region: "India", fit: "Track only" },
  "TATA MOTORS": { symbol: "TATAMOTORS.NS", name: "Tata Motors", category: "Global", region: "India", fit: "Track only" },
  "TATA STEEL": { symbol: "TATASTEEL.NS", name: "Tata Steel", category: "Global", region: "India", fit: "Track only" },
  QUALCOMM: { symbol: "QCOM", name: "Qualcomm", category: "Semiconductor", region: "United States", fit: "Robinhood" },
  NVIDIA: { symbol: "NVDA", name: "Nvidia", category: "Semiconductor", region: "United States", fit: "Robinhood" },
  MICROSOFT: { symbol: "MSFT", name: "Microsoft", category: "Stable", region: "United States", fit: "Robinhood" },
  APPLE: { symbol: "AAPL", name: "Apple", category: "Stable", region: "United States", fit: "Robinhood" },
  GOOGLE: { symbol: "GOOGL", name: "Alphabet", category: "Tech/Growth", region: "United States", fit: "Robinhood" },
  ALPHABET: { symbol: "GOOGL", name: "Alphabet", category: "Tech/Growth", region: "United States", fit: "Robinhood" },
  AMAZON: { symbol: "AMZN", name: "Amazon", category: "Tech/Growth", region: "United States", fit: "Robinhood" },
  TESLA: { symbol: "TSLA", name: "Tesla", category: "Tech/Growth", region: "United States", fit: "Robinhood" },
  META: { symbol: "META", name: "Meta Platforms", category: "Tech/Growth", region: "United States", fit: "Robinhood" },
  FACEBOOK: { symbol: "META", name: "Meta Platforms", category: "Tech/Growth", region: "United States", fit: "Robinhood" },
  BROADCOM: { symbol: "AVGO", name: "Broadcom", category: "Semiconductor", region: "United States", fit: "Robinhood" },
  AMD: { symbol: "AMD", name: "Advanced Micro Devices", category: "Semiconductor", region: "United States", fit: "Robinhood" },
  INTEL: { symbol: "INTC", name: "Intel", category: "Semiconductor", region: "United States", fit: "Robinhood" },
  COSTCO: { symbol: "COST", name: "Costco", category: "Stable", region: "United States", fit: "Robinhood" },
};

const rows = document.querySelector("#watchlistRows");
const count = document.querySelector("#watchlistCount");
const budgetInput = document.querySelector("#monthlyBudget");
const heroBudget = document.querySelector("#heroBudget");
const allocationGrid = document.querySelector("#allocationGrid");
const reportCard = document.querySelector("#reportCard");
const whatsappText = document.querySelector("#whatsappText");
const openWhatsApp = document.querySelector("#openWhatsApp");
const copyReport = document.querySelector("#copyReport");
const toast = document.querySelector(".toast");
const alertRows = document.querySelector("#alertRows");
const alertLog = document.querySelector("#alertLog");
const checkAlerts = document.querySelector("#checkAlerts");
const clearAlerts = document.querySelector("#clearAlerts");
const autoOpenWhatsApp = document.querySelector("#autoOpenWhatsApp");
const refreshQuotes = document.querySelector("#refreshQuotes");
const apiStatus = document.querySelector("#apiStatus");
const symbolForm = document.querySelector("#symbolForm");
const newSymbol = document.querySelector("#newSymbol");
const newName = document.querySelector("#newName");
const newCategory = document.querySelector("#newCategory");
const newRegion = document.querySelector("#newRegion");
const riskSymbol = document.querySelector("#riskSymbol");
const entryPrice = document.querySelector("#entryPrice");
const riskDrop = document.querySelector("#riskDrop");
const stopTrigger = document.querySelector("#stopTrigger");
const stopLimit = document.querySelector("#stopLimit");

let activeFilter = "All";
let triggeredAlerts = [];
let alertState = Object.fromEntries(watchlist.map((item, index) => {
  const basePrice = 50 + index * 7.35;
  const dayLow = basePrice * (1 - Math.max(0.35, Math.abs(item.move)) / 100);
  return [item.symbol, {
    enabled: true,
    latest: Number(basePrice.toFixed(2)),
    low: Number(dayLow.toFixed(2)),
  }];
}));
let serverReady = false;

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function signedPercent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function visibleWatchlist() {
  if (activeFilter === "All") return watchlist;
  if (activeFilter === "Global") return watchlist.filter((item) => item.region !== "United States" || item.category === "Global");
  return watchlist.filter((item) => item.category === activeFilter);
}

function normalizeLookup(value) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function resolveCompany(input) {
  const term = normalizeLookup(input);
  if (!term) return null;
  if (symbolAliases[term]) return symbolAliases[term];
  return Object.entries(symbolAliases).find(([name]) => term.includes(name) || name.includes(term))?.[1] || null;
}

async function apiGet(path) {
  const response = await fetch(path, { headers: apiHeaders() });
  if (response.status === 401) {
    requestAccessToken();
    throw new Error("Access token required");
  }
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function apiHeaders(extra = {}) {
  const token = window.localStorage.getItem("stockPilerAccessToken");
  return token ? { ...extra, "X-Stock-Piler-Token": token } : extra;
}

function requestAccessToken() {
  const token = window.prompt("Enter Stock Piler access token");
  if (token) {
    window.localStorage.setItem("stockPilerAccessToken", token);
    showToast("Access token saved");
  }
}

async function checkApiStatus() {
  try {
    const status = await apiGet("/api/status");
    serverReady = true;
    const dataApi = status.yfinanceInstalled ? `yfinance ready (${status.yfinance})` : "Yahoo API fallback ready";
    const whatsapp = status.whatsappConfigured ? "WhatsApp auto-send configured" : "WhatsApp manual/share mode";
    const access = status.accessTokenRequired ? "access token required" : "local/open access";
    apiStatus.textContent = `${dataApi}; ${whatsapp}; ${access}; checking every ${status.pollSeconds}s`;
    apiStatus.className = "api-status ready";
  } catch {
    serverReady = false;
    apiStatus.textContent = "yfinance status: start Stock Piler with python stock_piler_server.py";
    apiStatus.className = "api-status error";
  }
}

async function loadServerState() {
  try {
    const payload = await apiGet("/api/state");
    if (!payload.ok) return;
    watchlist = payload.data.watchlist || watchlist;
    alertState = payload.data.alertState || alertState;
    triggeredAlerts = payload.data.alerts || [];
    if (payload.data.settings?.monthlyBudget) {
      budgetInput.value = payload.data.settings.monthlyBudget;
    }
    serverReady = true;
    renderAll();
  } catch {
    serverReady = false;
  }
}

function ensureAlertState(item, index = watchlist.length) {
  if (alertState[item.symbol]) return;
  const basePrice = 50 + index * 7.35;
  const dayLow = basePrice * (1 - Math.max(0.35, Math.abs(item.move || 0.25)) / 100);
  alertState[item.symbol] = {
    enabled: true,
    latest: Number(basePrice.toFixed(2)),
    low: Number(dayLow.toFixed(2)),
  };
}

function setActiveFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
}

function renderAll() {
  watchlist.forEach((item, index) => ensureAlertState(item, index));
  renderWatchlist();
  renderAlertRows();
  renderAlertLog();
  renderAllocations();
  renderRiskOptions();
  renderRisk();
}

function removeSymbol(symbol) {
  if (serverReady) {
    fetch(`/api/watchlist/${encodeURIComponent(symbol)}`, { method: "DELETE", headers: apiHeaders() })
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) {
          showToast(result.error || "Remove failed");
          return;
        }
        watchlist = result.data.watchlist;
        alertState = result.data.alertState;
        triggeredAlerts = result.data.alerts || [];
        renderAll();
        showToast(`${symbol} removed`);
      })
      .catch(() => showToast("Remove failed"));
    return;
  }
  watchlist = watchlist.filter((item) => item.symbol !== symbol);
  delete alertState[symbol];
  triggeredAlerts = triggeredAlerts.filter((alert) => alert.symbol !== symbol);
  renderAll();
  showToast(`${symbol} removed`);
}

async function addSymbol(event) {
  event.preventDefault();
  const rawSymbol = newSymbol.value.trim();
  const rawName = newName.value.trim();
  if (serverReady) {
    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: apiHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          symbol: rawSymbol,
          name: rawName,
          category: newCategory.value,
          region: newRegion.value.trim(),
        }),
      });
      if (response.status === 401) {
        requestAccessToken();
        return;
      }
      const result = await response.json();
      if (!result.ok) {
        showToast(result.error || "Could not add symbol");
        return;
      }
      watchlist = result.data.watchlist;
      alertState = result.data.alertState;
      triggeredAlerts = result.data.alerts || [];
      symbolForm.reset();
      newCategory.value = "Core ETF";
      setActiveFilter("All");
      renderAll();
      showToast(`${result.item.symbol} added`);
      return;
    } catch {
      showToast("Server add failed; using local mode");
    }
  }
  let alias = resolveCompany(rawSymbol) || resolveCompany(rawName);
  if (!alias && rawName) {
    try {
      const result = await apiGet(`/api/lookup?q=${encodeURIComponent(rawName)}`);
      if (result.ok) {
        alias = {
          symbol: result.symbol,
          name: result.name,
          category: newCategory.value,
          region: result.region || newRegion.value.trim() || "Unknown",
          fit: "Track only",
        };
      } else {
        showToast(result.error || "Could not detect symbol");
      }
    } catch {
      showToast("Start yfinance server first");
    }
  }
  const symbol = alias ? alias.symbol : rawSymbol.toUpperCase();
  const name = rawName || alias?.name || symbol;
  if (!symbol && !rawName) {
    showToast("Enter a symbol or company name");
    return;
  }
  if (!symbol) {
    showToast("Name not in local symbol map");
    return;
  }
  if (watchlist.some((item) => item.symbol === symbol)) {
    showToast(`${symbol} already exists`);
    return;
  }

  const item = {
    symbol,
    name: alias?.name || name,
    category: alias?.category || newCategory.value,
    region: newRegion.value.trim() || alias?.region || "Unknown",
    fit: alias?.fit || "Check Robinhood",
    move: 0,
    role: alias ? "Matched from company name. Confirm price and risk before buying." : "User-added symbol. Confirm ticker, availability, and risk before buying.",
  };
  watchlist.unshift(item);
  ensureAlertState(item, 0);
  symbolForm.reset();
  newCategory.value = "Core ETF";
  setActiveFilter("All");
  renderAll();
  showToast(`${symbol} added`);
}

function renderWatchlist() {
  const items = visibleWatchlist();
  rows.innerHTML = items.map((item) => {
    const moveClass = item.move >= 0 ? "move-up" : "move-down";
    const fitClass = item.fit === "Robinhood" || item.fit === "ADR" ? "" : "fit-track";
    const brokerHref = item.fit === "Track only"
      ? `https://finance.yahoo.com/quote/${encodeURIComponent(item.symbol)}/`
      : item.fit === "Check Robinhood"
      ? `https://robinhood.com/search?query=${encodeURIComponent(item.symbol)}`
      : `https://robinhood.com/us/en/stocks/${encodeURIComponent(item.symbol)}/`;
    const brokerLabel = item.fit === "Track only" ? "Yahoo" : "Open";
    return `
      <tr>
        <td>${item.symbol}<small>${item.fit === "ADR" ? "ADR listing" : item.fit}</small></td>
        <td>${item.name}</td>
        <td><span class="badge">${item.category}</span></td>
        <td>${item.region}</td>
        <td class="${fitClass}">${item.fit}</td>
        <td class="${moveClass}">${signedPercent(item.move)}</td>
        <td><small>${item.role}</small></td>
        <td><a class="broker-link" href="${brokerHref}" target="_blank" rel="noreferrer">${brokerLabel}</a></td>
        <td><button class="remove-button" type="button" data-remove-symbol="${item.symbol}">Remove</button></td>
      </tr>
    `;
  }).join("");
  count.textContent = watchlist.length.toString();
  document.querySelectorAll("[data-remove-symbol]").forEach((button) => {
    button.addEventListener("click", () => removeSymbol(button.dataset.removeSymbol));
  });
}

function alertMessage(item) {
  return `buy alert "${item.symbol} - ${item.name}" has hit the lowest price`;
}

function renderAlertRows() {
  alertRows.innerHTML = watchlist.map((item) => {
    const state = alertState[item.symbol];
    const triggered = state.enabled && state.latest <= state.low;
    const statusClass = triggered ? "status-triggered" : "status-ready";
    const status = triggered ? "Ready to send" : "Watching";
    return `
      <tr>
        <td><input class="watch-toggle" type="checkbox" data-alert-symbol="${item.symbol}" ${state.enabled ? "checked" : ""} aria-label="Watch ${item.symbol}" /></td>
        <td>${item.symbol}<small>${item.category}</small></td>
        <td>${item.name}</td>
        <td><input class="price-input" type="number" min="0" step="0.01" value="${state.latest}" data-price-symbol="${item.symbol}" data-price-kind="latest" aria-label="${item.symbol} latest price" /></td>
        <td><input class="price-input" type="number" min="0" step="0.01" value="${state.low}" data-price-symbol="${item.symbol}" data-price-kind="low" aria-label="${item.symbol} day low" /></td>
        <td class="${statusClass}">${status}</td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll("[data-alert-symbol]").forEach((input) => {
    input.addEventListener("change", () => {
      alertState[input.dataset.alertSymbol].enabled = input.checked;
      renderAlertRows();
    });
  });

  document.querySelectorAll("[data-price-symbol]").forEach((input) => {
    input.addEventListener("input", () => {
      const state = alertState[input.dataset.priceSymbol];
      state[input.dataset.priceKind] = Number(input.value || 0);
      renderAlertRows();
    });
  });
}

function renderAlertLog() {
  if (!triggeredAlerts.length) {
    alertLog.textContent = "No alerts triggered yet.";
    return;
  }
  alertLog.innerHTML = triggeredAlerts.map((alert) => `
    <div class="alert-item">
      <span>${alert.message}</span>
      <a class="broker-link" href="https://wa.me/?text=${encodeURIComponent(alert.message)}" target="_blank" rel="noreferrer">Send on WhatsApp</a>
    </div>
  `).join("");
}

function runAlertCheck() {
  if (serverReady) {
    fetch("/api/alerts/check", {
      method: "POST",
      headers: apiHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ refresh: true, send: autoOpenWhatsApp.checked }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) {
          showToast(result.error || "Alert check failed");
          return;
        }
        watchlist = result.data.watchlist;
        alertState = result.data.alertState;
        triggeredAlerts = result.data.alerts || [];
        renderAll();
        showToast(result.alerts.length ? `${result.alerts.length} buy alert${result.alerts.length > 1 ? "s" : ""}` : "No daily-low alerts");
        if (autoOpenWhatsApp.checked && result.alerts.length && !result.alerts[0].sent) {
          window.open(`https://wa.me/?text=${encodeURIComponent(result.alerts.map((alert) => alert.message).join("\n"))}`, "_blank", "noreferrer");
        }
      })
      .catch(() => showToast("Alert check failed"));
    return;
  }
  const freshAlerts = watchlist
    .filter((item) => {
      const state = alertState[item.symbol];
      return state.enabled && state.latest <= state.low;
    })
    .map((item) => ({
      symbol: item.symbol,
      message: alertMessage(item),
      time: new Date().toISOString(),
    }));

  const existingKeys = new Set(triggeredAlerts.map((alert) => `${alert.symbol}:${alert.message}`));
  freshAlerts.forEach((alert) => {
    const key = `${alert.symbol}:${alert.message}`;
    if (!existingKeys.has(key)) triggeredAlerts.unshift(alert);
  });

  renderAlertRows();
  renderAlertLog();

  if (!freshAlerts.length) {
    showToast("No daily-low alerts");
    return;
  }

  showToast(`${freshAlerts.length} buy alert${freshAlerts.length > 1 ? "s" : ""}`);
  if (autoOpenWhatsApp.checked) {
    const combined = freshAlerts.map((alert) => alert.message).join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(combined)}`, "_blank", "noreferrer");
  }
}

async function refreshYfinanceQuotes() {
  const symbols = watchlist.map((item) => item.symbol).join(",");
  try {
    const payload = await apiGet(`/api/quotes?symbols=${encodeURIComponent(symbols)}`);
    const quotes = payload.quotes || [];
    let updated = 0;
    quotes.forEach((quote) => {
      if (!quote.ok || !alertState[quote.symbol]) return;
      alertState[quote.symbol].latest = quote.latest;
      alertState[quote.symbol].low = quote.dayLow;
      const item = watchlist.find((entry) => entry.symbol === quote.symbol);
      if (item) item.move = quote.move;
      updated += 1;
    });
    try {
      const state = await apiGet("/api/state");
      if (state.ok) {
        watchlist = state.data.watchlist || watchlist;
        alertState = state.data.alertState || alertState;
        triggeredAlerts = state.data.alerts || triggeredAlerts;
      }
    } catch {
      // Keep already-applied quote updates.
    }
    renderAll();
    showToast(updated ? `${updated} quotes refreshed` : "No quotes refreshed");
  } catch {
    showToast("Start yfinance server first");
  }
}

function renderAllocations() {
  const budget = Math.max(1, Number(budgetInput.value || 50));
  heroBudget.textContent = money(budget);
  allocationGrid.innerHTML = allocations.map((item) => {
    const amount = budget * item.percent / 100;
    return `
      <article class="allocation-card">
        <span>${item.percent}% ${item.label}</span>
        <strong>${money(amount)}</strong>
        <p>${item.symbol}</p>
        <p>${item.note}</p>
      </article>
    `;
  }).join("");
  renderReport();
}

function topMovers() {
  const sorted = [...watchlist].sort((a, b) => b.move - a.move);
  return {
    risers: sorted.slice(0, 3),
    fallers: sorted.slice(-3).reverse(),
  };
}

function reportText() {
  const budget = Math.max(1, Number(budgetInput.value || 50));
  const { risers, fallers } = topMovers();
  return [
    "Stock Piler Daily Report",
    "",
    `Plan: Conservative/moderate with ${money(budget)} monthly investing.`,
    "Mode: Track globally, trade manually in Robinhood.",
    "",
    "Top watchlist risers:",
    ...risers.map((item, index) => `${index + 1}. ${item.symbol}: ${signedPercent(item.move)} - ${item.name}`),
    "",
    "Top watchlist drops:",
    ...fallers.map((item, index) => `${index + 1}. ${item.symbol}: ${signedPercent(item.move)} - ${item.name}`),
    "",
    "Next monthly buy idea:",
    `${money(budget * 0.6)} broad ETF, ${money(budget * 0.2)} semiconductor ETF, ${money(budget * 0.1)} stable company, ${money(budget * 0.1)} international/India exposure.`,
    "",
    "Robinhood action:",
    "Buy manually only after reviewing the symbol, price, and risk. Set stop-loss or stop-limit orders inside Robinhood when needed.",
  ].join("\n");
}

function renderReport() {
  const budget = Math.max(1, Number(budgetInput.value || 50));
  const { risers, fallers } = topMovers();
  reportCard.innerHTML = `
    <div class="report-line"><span>Best mover</span><span>${risers[0].symbol} ${signedPercent(risers[0].move)}</span></div>
    <div class="report-line"><span>Largest drop</span><span>${fallers[0].symbol} ${signedPercent(fallers[0].move)}</span></div>
    <div class="report-line"><span>Next broad ETF amount</span><span>${money(budget * 0.6)}</span></div>
    <div class="report-line"><span>Semiconductor amount</span><span>${money(budget * 0.2)}</span></div>
    <div class="report-line"><span>Today&apos;s action</span><span>Research first, trade manually</span></div>
  `;
  const text = reportText();
  whatsappText.value = text;
  openWhatsApp.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function renderRiskOptions() {
  riskSymbol.innerHTML = watchlist
    .filter((item) => item.fit === "Robinhood" || item.fit === "ADR")
    .map((item) => `<option value="${item.symbol}">${item.symbol} - ${item.name}</option>`)
    .join("");
}

function renderRisk() {
  const entry = Math.max(1, Number(entryPrice.value || 100));
  const drop = Number(riskDrop.value || 8);
  const trigger = entry * (1 - drop / 100);
  const limit = trigger * 0.98;
  stopTrigger.textContent = money(trigger);
  stopLimit.textContent = money(limit);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 1800);
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter);
    renderWatchlist();
  });
});

budgetInput.addEventListener("input", renderAllocations);
entryPrice.addEventListener("input", renderRisk);
riskDrop.addEventListener("change", renderRisk);
riskSymbol.addEventListener("change", renderRisk);

copyReport.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(whatsappText.value);
    showToast("Report copied");
  } catch {
    whatsappText.select();
    showToast("Select and copy the report");
  }
});

checkAlerts.addEventListener("click", runAlertCheck);
refreshQuotes.addEventListener("click", refreshYfinanceQuotes);
clearAlerts.addEventListener("click", () => {
  triggeredAlerts = [];
  renderAlertLog();
  showToast("Alerts cleared");
});
symbolForm.addEventListener("submit", addSymbol);

renderAll();
checkApiStatus();
loadServerState();

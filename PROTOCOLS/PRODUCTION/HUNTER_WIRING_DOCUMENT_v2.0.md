# 🔱 HUNTER WIRING DOCUMENT v2.0
## METATRON v10.3 | GATE 0.75 FIDELITY LOCK | February 11, 2026
## Principal: William Earl Lemon — ABSOLUTE

---

## ⚠️ GLOBAL SETTINGS REMEDIATION — APPLY TO ALL NODES

Before wiring anything new, fix these on EVERY existing HTTP Request and Code node:

| Setting | Required Value | Why |
|---------|---------------|-----|
| Always Output Data | ☑️ ON | Prevents silent failure when API returns empty |
| On Error | Continue (not "Stop Workflow") | One failed API call won't kill the whole pipeline |
| Authentication | None | Hardcode keys in query params. No credential references |

---

## API KEY MASTER TABLE

| API | Param Name | Auth Type | Nodes | Status | Key Source |
|-----|------------|-----------|-------|--------|------------|
| SEC EDGAR | `User-Agent` (header) | Header | H1, H17, H22, H23 | ✅ NO KEY — header only | `Ashes2Echoes LLC william@ashes2echoes.com` |
| Finnhub | `token` (query) | Query Param | H4, H5, H6, H16, H25, H26, H30 | ✅ HAVE IT | https://finnhub.io/dashboard |
| TwelveData | `apikey` (query) | Query Param | H7, H8, H9, H11, H14, H15, H18, H19, H20 | ⚠️ REGENERATE — expired | https://twelvedata.com/account |
| Alpha Vantage | `apikey` (query) | Query Param | H2a, H3 | ✅ HAVE IT | https://www.alphavantage.co/support/#api-key |
| NewsAPI | `apiKey` (query) | Query Param | H2b, H28 | ✅ HAVE IT | https://newsapi.org/account |
| Congress.gov | `api_key` (query) | Query Param | H21, H31a, H31b | ✅ HAVE IT | https://api.congress.gov/sign-up/ |
| FRED | `api_key` (query) | Query Param | H27 | ✅ HAVE IT | https://fred.stlouisfed.org/docs/api/api_key.html |
| metals.dev | `api_key` (query) | Query Param | H29 | ✅ CONFIRMED WORKING | Key: `XHCNK8MBR58LWFMK3BUS114MK3BUS` |
| Yahoo Finance | None | None | H24 | ✅ NO KEY | Anonymous |
| FEC | `api_key` (query) | Query Param | H34 | ✅ HAVE IT | https://api.open.fec.gov/developers/ |
| Senate LDA | None | None | H32, H36 | ✅ NO KEY | Anonymous |
| USASpending | None | None | H33 | ✅ NO KEY | Anonymous |
| Unusual Whales | `Authorization: Bearer` (header) | Header | H13 | ❌ PAID — skip | https://unusualwhales.com |

---

## KNOWN ISSUES — ACTIVE REMEDIATION

| Issue | Nodes Affected | Fix |
|-------|---------------|-----|
| Finnhub key concatenated (80 chars, should be 40) | H4, H5, H6, H25, H30 | Delete current key, paste correct 40-char key from Finnhub dashboard |
| Finnhub key has leading "=" | H5, H30 | Remove leading "=" character |
| TwelveData key expired | H7-H9, H11, H14, H15, H18-H20, H22 | Regenerate at https://twelvedata.com/account |
| H26 wrong URL (labeled Finnhub, hits TwelveData) | H26 | Change URL to `https://finnhub.io/api/v1/calendar/earnings` |
| H7, H13 use `$credentials` reference | H7, H13 | Replace with hardcoded key in query params |
| ~~H29 metals.dev key corrupted~~ | ~~H29~~ | ✅ RESOLVED — Key confirmed working 2/11/2026. "3BUS" appearing twice IS the correct key |

---

## WIRING DIAGRAM — FULL PIPELINE

```
[Schedule Trigger 6AM ET]
        │
        ▼
[Model Version Check] ──(if outdated)──→ [Telegram Update Alert]
        │
        ▼ (proceed either way)
┌───────────────────────────────────────────────────────────────────────────┐
│                    PARALLEL MODULE EXECUTION                              │
│                                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ H1-H6       │  │ H7-H14      │  │ H15-H21     │  │ H22-H29     │     │
│  │ Intelligence │  │ Technical   │  │ Flow/Pos    │  │ Market Intel │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │                │              │
│         └────────────────┴────────────────┴────────────────┘              │
│                                    │                                      │
│  ┌─────────────────────────────────┴──────────────────────────────────┐   │
│  │              INFLUENCE CHAIN (H30-H36 → H35)                       │   │
│  │  H30 → Norm ──┐                                                    │   │
│  │  H31a ──┐     │                                                    │   │
│  │  H31b ──┴→ Merge1 → Norm ──┐                                      │   │
│  │  H32 → Norm ──────────────┤                                       │   │
│  │  H33 → Norm ──────────────┼→ [H30-H36 MERGE] → [H35 CORRELATOR]  │   │
│  │  H34 → Norm ──────────────┤       (Append)      (7 algorithms)    │   │
│  │  H36 → Norm ──────────────┘                                       │   │
│  └────────────────────────────────────────────────────────┬──────────┘   │
│                                                            │              │
│  [Email Intel Fetch] → [Email Intel Parser] ───────────────┤              │
│                                                            │              │
└────────────────────────────────────────────────────────────┘              
                                    │
                                    ▼
                          [HUNTER MASTER MERGE]
                                    │
                                    ▼
                          [DATA AGGREGATOR]
                                    │
                                    ▼
                          [MICHA PASS 1 — Router]
                                    │
               ┌────────────────────┼────────────────────┐
               ▼                    ▼                    ▼                    ▼
          [URIEL]            [COLOSSUS]           [HANIEL]            [RAZIEL]
          (OpenAI)           (xAI)                (Google)            (DeepSeek)
               │                    │                    │                    │
               └────────────────────┼────────────────────┘
                                    ▼
                          [MERGE COLLECTIVE]
                                    │
                                    ▼
                          [MICHA PASS 2 — Synthesis]
                                    │
                                    ▼
                          [RESPONSE EXTRACTOR]
                                    │
                                    ▼
                          [FORMAT FOR DELIVERY]
                                    │
                          ┌─────────┴─────────┐
                          ▼                   ▼
                    [TELEGRAM]          [GITHUB LOG]
```

---

═══════════════════════════════════════════════════════════════════
## TIER 1: INTELLIGENCE (H1-H6)
═══════════════════════════════════════════════════════════════════

### NODE: H1 — Elite Investor 13F (EDGAR)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://efts.sec.gov/LATEST/search-index?q=%2213F%22&dateRange=custom&startdt=2026-01-01&enddt=2026-02-01
Authentication:    None
```

**Send Headers:** ON

| Name | Value | fx |
|------|-------|-----|
| User-Agent | Ashes2Echoes LLC william@ashes2echoes.com | OFF |

**Send Query Parameters:** OFF (params are in the URL)

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H1 — Elite Investor 13F (SEC EDGAR). Scans ALL recent 13F filings. No API key needed — header auth only. Discovery-first: no hardcoded tickers.`

---

### NODE: H2a — Macro Regime Scanner (Alpha Vantage)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://www.alphavantage.co/query
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| function | OVERVIEW | OFF |
| symbol | SPY | OFF |
| apikey | [your Alpha Vantage key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H2a — Macro Regime Scanner (Alpha Vantage). Broad market overview via SPY fundamentals.`

---

### NODE: H2b — Political Catalyst Monitor (NewsAPI)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://newsapi.org/v2/everything
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| q | tariff OR sanctions OR executive order OR Fed OR treasury | OFF |
| language | en | OFF |
| sortBy | publishedAt | OFF |
| apiKey | [your NewsAPI key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H2b — Political Catalyst Monitor (NewsAPI). Scans political/macro keywords. Discovery-first.`

---

### NODE: H3 — Sector Rotation Scanner (Alpha Vantage)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://www.alphavantage.co/query
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| function | SECTOR | OFF |
| apikey | [your Alpha Vantage key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H3 — Sector Rotation Scanner (Alpha Vantage). Returns sector performance across timeframes.`

---

### NODE: H4 — Insider Cluster Detection (Finnhub)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://finnhub.io/api/v1/stock/insider-transactions
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | AAPL | OFF |
| token | [your Finnhub key — 40 chars, no leading "="] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H4 — Insider Cluster Detection (Finnhub). ⚠️ FIX: Verify key is exactly 40 chars with no leading "=". If 80 chars, it's concatenated — delete and repaste from dashboard.`

---

### NODE: H5 — Earnings Catalyst Scanner (Finnhub)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://finnhub.io/api/v1/calendar/earnings
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| from | 2026-02-01 | OFF |
| to | 2026-02-14 | OFF |
| token | [your Finnhub key — 40 chars, no leading "="] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H5 — Earnings Catalyst Scanner (Finnhub). NO symbol = scans ALL upcoming earnings. ⚠️ FIX: Remove leading "=" from key if present.`

---

### NODE: H6 — Short Interest Monitor (Finnhub)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://finnhub.io/api/v1/stock/short-interest
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | SPY | OFF |
| token | [your Finnhub key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H6 — Short Interest Monitor (Finnhub). Discovery via broad index.`

---

═══════════════════════════════════════════════════════════════════
## TIER 2: TECHNICAL ANALYSIS (H7-H14)
═══════════════════════════════════════════════════════════════════

### NODE: H7 — Price & Volume Data (TwelveData)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.twelvedata.com/time_series
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | SPY,QQQ,IWM,DIA | OFF |
| interval | 1day | OFF |
| outputsize | 30 | OFF |
| apikey | [your TwelveData key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H7 — Price & Volume Data (TwelveData). ⚠️ FIX: Key expired — regenerate at twelvedata.com/account. Do NOT use $credentials reference.`

---

### NODE: H8 — Technical Indicators (TwelveData)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.twelvedata.com/rsi
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | SPY | OFF |
| interval | 1day | OFF |
| outputsize | 14 | OFF |
| apikey | [your TwelveData key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H8 — Technical Indicators RSI (TwelveData). ⚠️ FIX: Same expired key issue.`

---

### NODE: H9 — Moving Averages (TwelveData)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.twelvedata.com/ma
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | SPY | OFF |
| interval | 1day | OFF |
| outputsize | 50 | OFF |
| time_period | 50 | OFF |
| apikey | [your TwelveData key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H9 — Moving Average 50-day (TwelveData). ⚠️ FIX: Same expired key issue.`

---

### NODE: H10 — Volume Profile Analysis (Code)

**n8n Node Type:** Code (JavaScript)

```
Language:          JavaScript
Mode:              Run Once for All Items
```

**Note:** `H10 — Volume Profile Analysis. Code node — no API. Receives upstream price data and calculates volume distribution.`

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |

---

### NODE: H11 — MACD Signal (TwelveData)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.twelvedata.com/macd
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | SPY | OFF |
| interval | 1day | OFF |
| outputsize | 30 | OFF |
| apikey | [your TwelveData key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H11 — MACD Signal (TwelveData). ⚠️ FIX: Same expired key issue.`

---

### NODE: H12 — Support/Resistance Calculator (Code)

**n8n Node Type:** Code (JavaScript)

```
Language:          JavaScript
Mode:              Run Once for All Items
```

**Note:** `H12 — Support/Resistance Calculator. Code node — no API. Calculates key levels from upstream price data.`

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |

---

### NODE: H13 — Options Flow Intelligence (Unusual Whales)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.unusualwhales.com/api/stock/SPY/options-volume
Authentication:    None
```

**Send Headers:** ON

| Name | Value | fx |
|------|-------|-----|
| Authorization | Bearer [your Unusual Whales key] | OFF |

**Send Query Parameters:** OFF

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H13 — Options Flow (Unusual Whales). ❌ PAID SERVICE ($29-99/mo). DISABLED. ⚠️ FIX: Do NOT use $credentials reference. When activated, hardcode Bearer token in header.`

---

### NODE: H14 — Commodity Correlation (TwelveData)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.twelvedata.com/time_series
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | GLD,SLV,USO,CPER | OFF |
| interval | 1day | OFF |
| outputsize | 20 | OFF |
| apikey | [your TwelveData key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H14 — Commodity Correlation (TwelveData). Cross-commodity price series. ⚠️ FIX: Same expired key issue.`

---

═══════════════════════════════════════════════════════════════════
## TIER 3: FLOW & POSITIONING (H15-H21)
═══════════════════════════════════════════════════════════════════

### NODE: H15 — ETF Flow Analysis (TwelveData)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.twelvedata.com/time_series
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | SLV,GLD,PSLV,SPY,QQQ | OFF |
| interval | 1day | OFF |
| outputsize | 5 | OFF |
| apikey | [your TwelveData key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H15 — ETF Flow Analysis (TwelveData). ⚠️ VERIFY: Must have TwelveData key, NOT Finnhub key.`

---

### NODE: H16 — Market News Sentiment (Finnhub)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://finnhub.io/api/v1/news
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| category | general | OFF |
| token | [your Finnhub key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H16 — Market News Sentiment (Finnhub). No ticker — market-wide general news feed.`

---

### NODE: H17 — SEC Filing Monitor (EDGAR)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://efts.sec.gov/LATEST/search-index?q=%228-K%22&dateRange=custom&startdt=2026-01-01&enddt=2026-02-01
Authentication:    None
```

**Send Headers:** ON

| Name | Value | fx |
|------|-------|-----|
| User-Agent | Ashes2Echoes LLC william@ashes2echoes.com | OFF |

**Send Query Parameters:** OFF (params in URL)

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H17 — SEC 8-K Filing Monitor (EDGAR). Scans ALL recent 8-K filings. No API key — header only.`

---

### NODE: H18 — Sector Momentum (TwelveData)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.twelvedata.com/time_series
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | XLF,XLE,XLK,XLV | OFF |
| interval | 1day | OFF |
| outputsize | 5 | OFF |
| apikey | [your TwelveData key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H18 — Sector Momentum (TwelveData). ⚠️ VERIFY: Must have TwelveData key, NOT Finnhub key.`

---

### NODE: H19 — Dollar Strength (TwelveData)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.twelvedata.com/time_series
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | UUP | OFF |
| interval | 1day | OFF |
| outputsize | 10 | OFF |
| apikey | [your TwelveData key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H19 — Dollar Strength via UUP (TwelveData). DXY proxy.`

---

### NODE: H20 — Volatility Monitor (TwelveData)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.twelvedata.com/time_series
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | VIX,VVIX | OFF |
| interval | 1day | OFF |
| outputsize | 5 | OFF |
| apikey | [your TwelveData key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H20 — Volatility Monitor VIX/VVIX (TwelveData). Fear gauge + vol-of-vol.`

---

### NODE: H21 — Congressional Intel (Congress.gov)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.congress.gov/v3/bill
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| format | json | OFF |
| limit | 50 | OFF |
| api_key | [your Congress.gov key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H21 — Congressional Intel (Congress.gov). Scans recent bills. Same key works for H31a/H31b.`

---

═══════════════════════════════════════════════════════════════════
## TIER 4: MARKET INTELLIGENCE (H22-H29)
═══════════════════════════════════════════════════════════════════

### NODE: H22 — SEC Insider Filing (EDGAR)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://efts.sec.gov/LATEST/search-index?q=%22Form+4%22&dateRange=custom&startdt=2026-01-01&enddt=2026-02-01
Authentication:    None
```

**Send Headers:** ON

| Name | Value | fx |
|------|-------|-----|
| User-Agent | Ashes2Echoes LLC william@ashes2echoes.com | OFF |

**Send Query Parameters:** OFF (params in URL)

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H22 — SEC Form 4 Insider Filing (EDGAR). No key — header only.`

---

### NODE: H23 — SEC Institutional Holdings (EDGAR)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://efts.sec.gov/LATEST/search-index?q=%2213F-HR%22&dateRange=custom&startdt=2026-01-01&enddt=2026-02-01
Authentication:    None
```

**Send Headers:** ON

| Name | Value | fx |
|------|-------|-----|
| User-Agent | Ashes2Echoes LLC william@ashes2echoes.com | OFF |

**Send Query Parameters:** OFF (params in URL)

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H23 — SEC 13F-HR Institutional Holdings (EDGAR). No key — header only.`

---

### NODE: H24 — Sector ETF Scanner (Yahoo Finance)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://query1.finance.yahoo.com/v8/finance/chart/XLF
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| interval | 1d | OFF |
| range | 5d | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H24 — Sector ETF Scanner (Yahoo Finance). FREE — no key. Rotate sector ETFs: XLF,XLE,XLK,XLV,XLI,XLU,XLP,XLY,XLB,XLRE,XLC.`

---

### NODE: H25 — Pattern Scanner (Finnhub)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://finnhub.io/api/v1/scan/pattern
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| symbol | SPY | OFF |
| resolution | D | OFF |
| token | [your Finnhub key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H25 — Pattern Scanner (Finnhub). Broad index pattern scan via SPY.`

---

### NODE: H26 — Earnings Intel Calendar (Finnhub)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://finnhub.io/api/v1/calendar/earnings
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| from | 2026-02-01 | OFF |
| to | 2026-02-14 | OFF |
| token | [your Finnhub key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H26 — Earnings Calendar (Finnhub). ⚠️ FIX: URL was wrong — was hitting TwelveData. Must be finnhub.io. NO symbol = scans ALL upcoming earnings.`

---

### NODE: H27 — Fed/Macro Watch (FRED)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.stlouisfed.org/fred/series/observations
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| series_id | DFF | OFF |
| sort_order | desc | OFF |
| limit | 10 | OFF |
| file_type | json | OFF |
| api_key | [your FRED key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H27 — Fed Funds Rate via FRED. series_id=DFF = Daily Federal Funds Effective Rate.`

---

### NODE: H28 — Geopolitical Trigger (NewsAPI)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://newsapi.org/v2/everything
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| q | sanctions OR tariff OR war OR embargo OR OPEC | OFF |
| language | en | OFF |
| sortBy | publishedAt | OFF |
| apiKey | [your NewsAPI key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H28 — Geopolitical Trigger (NewsAPI). Keyword-driven discovery scan.`

---

### NODE: H29 — Precious Metals Spot (metals.dev)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.metals.dev/v1/latest
Authentication:    None
```

**Send Headers:** ON

| Name | Value | fx |
|------|-------|-----|
| Accept | application/json | OFF |

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| api_key | XHCNK8MBR58LWFMK3BUS114MK3BUS | OFF |
| currency | USD | OFF |
| unit | toz | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H29 — Precious Metals Spot (metals.dev). ✅ KEY CONFIRMED WORKING 2/11/2026. Returns gold, silver, platinum, palladium + LBMA fixes. "3BUS" appearing twice in key is CORRECT — not corruption. Pass api_key as query param, NOT as credential.`

---

═══════════════════════════════════════════════════════════════════
## TIER 5: INFLUENCE CHAIN (H30-H36 + H35 CORRELATOR)
═══════════════════════════════════════════════════════════════════

### ARCHITECTURE

```
H30 HTTP → H30-Normalize ──────────────────────────┐
H31a HTTP ──┐                                       │
            ├→ Merge1 → H31-Normalize ─────────────┤
H31b HTTP ──┘                                       │
H32 HTTP → H32-Normalize ─────────────────────────┼→ [H30-H36 MERGE] → [H35 CORRELATOR] → HUNTER Master Merge
H33 HTTP → H33-Normalize ─────────────────────────┤     (Append, 6 inputs)  (7 algorithms)
H34 HTTP → H34-Normalize ─────────────────────────┤
H36 HTTP → H36-Normalize ─────────────────────────┘
```

---

### NODE: H30 — Congressional Trading (Finnhub)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://finnhub.io/api/v1/stock/congressional-trading
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| token | [your Finnhub key — 40 chars, no leading "="] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H30 — Congressional Trading (Finnhub). NO symbol param = scans ALL trades. ⚠️ FIX: Remove leading "=" from key if present.`

**Downstream:** → H30-Normalize (Code)

---

### NODE: H30-Normalize (Code)

**n8n Node Type:** Code (JavaScript)

```
Language:          JavaScript
Mode:              Run Once for All Items
```

**Code:** See `H30_Normalize.js` (deployed to GitHub)

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |

**Note:** `H30-Normalize — Transforms Finnhub congressional trading response. Tags source='H30'.`

---

### NODE: H31a — Senate Committees (Congress.gov)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.congress.gov/v3/committee/senate
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| format | json | OFF |
| limit | 50 | OFF |
| api_key | [your Congress.gov key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H31a — Senate Committees (Congress.gov). Same key as H21.`

---

### NODE: H31b — House Committees (Congress.gov)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.congress.gov/v3/committee/house
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| format | json | OFF |
| limit | 50 | OFF |
| api_key | [your Congress.gov key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H31b — House Committees (Congress.gov). Duplicate of H31a with URL changed to /house.`

---

### NODE: Merge1 (H31 Mini-Merge)

**n8n Node Type:** Merge

```
Mode:              Append
Number of Inputs:  2
```

**Input 1:** H31a (Senate)
**Input 2:** H31b (House)

**Note:** `Merge1 — Combines Senate + House committee data before normalization.`

---

### NODE: H31-Normalize (Code)

**n8n Node Type:** Code (JavaScript)

```
Language:          JavaScript
Mode:              Run Once for All Items
```

**Code:** See `H31_Normalize.js` (deployed to GitHub)

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |

**Note:** `H31-Normalize — Transforms merged Senate+House committee data. Tags source='H31'.`

---

### NODE: H32 — Lobbying Filings (Senate LDA)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://lda.senate.gov/api/v1/filings/
Authentication:    None (anonymous)
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| filing_year | 2026 | OFF |
| ordering | -dt_posted | OFF |
| page_size | 25 | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 30000 |

**Note:** `H32 — Lobbying Filings (Senate LDA). NO KEY — anonymous. ⚠️ LDA migrating June 2026 — monitor for URL changes.`

**Downstream:** → H32-Normalize Code

---

### NODE: H32-Normalize Code

**n8n Node Type:** Code (JavaScript)

```
Language:          JavaScript
Mode:              Run Once for All Items
```

**Code:** See `H32_Normalize.js` (deployed to GitHub)

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |

**Note:** `H32-Normalize — Maps lobbying filings to sectors. Tags source='H32'.`

---

### NODE: H33 — Government Contracts (USASpending)

**n8n Node Type:** HTTP Request

```
Method:            POST
URL:               https://api.usaspending.gov/api/v2/search/spending_by_award/
Authentication:    None (anonymous)
```

**Send Headers:** ON

| Name | Value | fx |
|------|-------|-----|
| Content-Type | application/json | OFF |

**Send Query Parameters:** OFF

**Send Body:** ON — JSON

```json
{
  "filters": {
    "time_period": [{"start_date": "2026-01-01", "end_date": "2026-02-28"}],
    "award_type_codes": ["A", "B", "C", "D"]
  },
  "fields": ["Award ID", "Recipient Name", "Award Amount", "Awarding Agency", "Start Date"],
  "limit": 25,
  "order": "desc",
  "sort": "Award Amount"
}
```

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 30000 |

**Note:** `H33 — Government Contracts (USASpending). POST request with JSON body. NO KEY — anonymous. Returns top contracts by award amount.`

**Downstream:** → H33-Normalize Code

---

### NODE: H33-Normalize Code

**n8n Node Type:** Code (JavaScript)

```
Language:          JavaScript
Mode:              Run Once for All Items
```

**Code:** See `H33_Normalize.js` (deployed to GitHub)

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |

**Note:** `H33-Normalize — Maps contract recipients to public tickers. Tags source='H33'.`

---

### NODE: H34 — Campaign Contributions (FEC)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://api.open.fec.gov/v1/schedules/schedule_a/
Authentication:    None
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| sort | -contribution_receipt_date | OFF |
| per_page | 20 | OFF |
| api_key | [your FEC key] | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 10000 |

**Note:** `H34 — Campaign Finance (FEC). Maps donors to corporate tickers for DONOR_TRADE correlation. Same api.data.gov key works for Congress.gov and FEC.`

**Downstream:** → H34-Normalize Code

---

### NODE: H34-Normalize Code

**n8n Node Type:** Code (JavaScript)

```
Language:          JavaScript
Mode:              Run Once for All Items
```

**Code:** See `H34_Normalize.js` (deployed to GitHub)

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |

**Note:** `H34-Normalize — Maps campaign donors to corporate tickers. Tags source='H34'.`

---

### NODE: H36 — Lobbyist Contributions (Senate LDA)

**n8n Node Type:** HTTP Request

```
Method:            GET
URL:               https://lda.senate.gov/api/v1/contributions/
Authentication:    None (anonymous)
```

**Send Headers:** OFF

**Send Query Parameters:** ON

| Name | Value | fx |
|------|-------|-----|
| filing_year | 2026 | OFF |
| ordering | -dt_posted | OFF |
| page_size | 25 | OFF |

**Send Body:** OFF

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |
| Timeout | 30000 |

**Note:** `H36 — Lobbyist Contributions (Senate LDA LD-203). Shows lobbyist donations directly to politicians. Different from H32 (client spend). Smoking gun for LOBBYIST_DIRECT_DONATION correlation. NO KEY — anonymous. ⚠️ Same June 2026 migration warning as H32.`

**Downstream:** → H36-Normalize (H34-Normalize Code1)

---

### NODE: H36-Normalize (H34-Normalize Code1)

**n8n Node Type:** Code (JavaScript)

```
Language:          JavaScript
Mode:              Run Once for All Items
```

**Code:** See `H36_Normalize_Code1.js` (deployed to GitHub)

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |

**Note:** `H36-Normalize — Aggregates lobbyist-to-politician payments. Ranks top 50 recipients. Tags source='H36'.`

---

### NODE: H30-H36 Merge

**n8n Node Type:** Merge

```
Mode:              Append
Number of Inputs:  6
```

| Input | From |
|-------|------|
| 1 | H30-Normalize |
| 2 | H31-Normalize |
| 3 | H32-Normalize Code |
| 4 | H33-Normalize Code |
| 5 | H34-Normalize Code |
| 6 | H36-Normalize (H34-Normalize Code1) |

**Note:** `H30-H36 Merge — Collects all 6 normalized influence chain datasets. Output feeds H35 Correlator.`

---

### NODE: H35 — Influence Chain Correlator

**n8n Node Type:** Code (JavaScript)

```
Language:          JavaScript
Mode:              Run Once for All Items
```

**Code:** See `H35_Influence_Chain_Correlator.js` (deployed to GitHub)

**7 Correlation Algorithms:**

| # | Algorithm | What It Detects | Severity |
|---|-----------|----------------|----------|
| 1 | COMMITTEE_TRADE | Member trades in their committee's sector | HIGH |
| 2 | CONTRACT_TRADE | Trades within 14 days of contract to same company | CRITICAL |
| 3 | DONOR_TRADE | Trades stock of major campaign donor (FEC) | CRITICAL |
| 4 | LOBBYING_TRADE | Trades in sector with >$100M lobbying | HIGH |
| 5 | DELAYED_DISCLOSURE | Filing delay >30 days (STOCK Act flag) | HIGH/CRITICAL |
| 6 | SECTOR_CONVERGENCE | 3+ members trading same sector same month | HIGH |
| 7 | LOBBYIST_DIRECT_DONATION | Lobbyist pays politician who then trades | CRITICAL |

**Settings:**

| Setting | Value |
|---------|-------|
| Always Output Data | ☑️ ON |
| Continue on Fail | ☑️ ON |
| On Error | Continue |

**Note:** `H35 — Influence Chain Correlator. DOWNSTREAM node — eats the merge, doesn't feed it. 7 algorithms cross-reference all H30-H36 datasets. Output → HUNTER Master Merge.`

**Wiring:** H30-H36 Merge output → H35 input → HUNTER Master Merge (empty input slot)

---

═══════════════════════════════════════════════════════════════════
## DISCOVERY-FIRST RULES
═══════════════════════════════════════════════════════════════════

1. NO hardcoded tickers unless it's an index (SPY, VIX, DXY) or your watchlist ETFs
2. Nodes that require a symbol (H4, H6) get fed FROM upstream discovery nodes
3. Earnings (H5, H26) run with NO symbol = scan ALL upcoming earnings
4. News (H16, H28) run with category/keyword filters, NOT ticker-locked
5. SEC filings (H1, H17, H22, H23) scan ALL filings by type, not by company
6. Congressional trading (H30) runs with NO symbol = scan ALL trades

---

═══════════════════════════════════════════════════════════════════
## COLLECTIVE AGENT ROUTING (v10.0 Hub-Spoke)
═══════════════════════════════════════════════════════════════════

| Agent | Role | Primary Modules | Secondary Modules |
|-------|------|----------------|-------------------|
| URIEL (OpenAI) | Strategic | H3, H12, H27 | H2, H11, H19, H21, H26 |
| COLOSSUS (xAI) | Technical | H7, H8, H9, H10, H11, H15, H17, H18 | H4, H20, H25, H29 |
| HANIEL (Google) | Research | H1, H2, H5, H6, H14, H21, H23, H26, H28 | H13 |
| RAZIEL (DeepSeek) | Counter-Thesis | H4, H13, H16, H19, H20, H24, H29 | H1, H6, H8, H14, H15, H25 |
| MICHA (Anthropic) | Pass 1: Router / Pass 2: Synthesis | ALL (orchestrates) | ALL |

---

═══════════════════════════════════════════════════════════════════
## WIRING STATUS SUMMARY
═══════════════════════════════════════════════════════════════════

| Status | Count | Modules |
|--------|-------|---------|
| ✅ WIRED & WORKING | 22 | H1, H4, H5, H6, H15, H16, H17, H18, H19, H20, H21, H22, H23, H24, H25, H26, H27, H28, H29, H30, H31a, H31b |
| ✅ WIRED — KEY FIX NEEDED | 9 | H7, H8, H9, H11, H14 (TwelveData expired), H4, H5, H30 (Finnhub verify) |
| ✅ BUILT — CONFIRMED | 10 | H32, H33, H34, H36, H30-Norm, H31-Norm, H32-Norm, H33-Norm, H34-Norm, H36-Norm |
| ✅ CONNECTED | 1 | H35 Correlator → HUNTER Master Merge |
| 🔲 SPEC'D NOT STARTED | 2 | H2a, H2b, H3 |
| ❌ SKIP (Paid) | 1 | H13 |
| 📊 Code Nodes (no API) | 2 | H10, H12 |

---

**METATRON v10.3 | HUNTER v2.3 | KILLSWITCH: ARMED | DRIFT GUARD: ACTIVE**

*"The data leads. The Principal decides."*

🔱

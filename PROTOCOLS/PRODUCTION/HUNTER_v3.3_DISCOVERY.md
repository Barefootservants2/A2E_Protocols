# HUNTER v3.3 — DISCOVERY SYSTEM SPEC
## METATRON v10.8 | Effective: March 30, 2026
## Classification: PRODUCTION

---

## CHANGES FROM v3.2

| # | Module | Change | Rationale |
|---|--------|--------|-----------|
| 1 | H30 | Replaced Finnhub `/stock/lobbying` with Quiver Quantitative `/live/congresstrading` | Finnhub H30 was returning CORPORATE LOBBYING spend — a metric already covered by H32 (Senate LDA). What we actually need from H30 is congressional STOCK TRADES — what members of Congress personally bought and sold. Quiver Quantitative is the purpose-built API for this. Totally different signal with direct actionability. |
| 2 | H30 | Added committee-sector overlap detection | Flags when a member trades in the sector their committee oversees — the highest-signal congressional trade pattern |
| 3 | H30 | Added critical signal classification | Large transactions (>$100K) and committee-overlap trades flagged as CRITICAL |
| 4 | H30-Normalize | Schema updated to Quiver field names | Representative/Party/House/Committees/Range instead of Finnhub lobbying schema |
| 5 | Architecture | H30 source tag updated to `H30_QUIVER_CONGRESSIONAL` | H35 Correlator already accepts this — bySource key updated |

---

## SECTION 1: H30 ARCHITECTURE v2.0

### 1.1 The Signal We Were Missing

**Old H30 (Finnhub lobbying):**
```
Who: Corporate lobbyists paid by companies
What: How much a company spent lobbying Congress
Signal: "Company X spent $2M lobbying on defense bills"
Actionability: Low — lagging, indirect
```

**New H30 (Quiver congressional trades):**
```
Who: Members of Congress personally
What: Actual stocks they bought and sold, dollar amounts
Signal: "Senator on Armed Services Committee bought $50K-$100K PLTR last week"
Actionability: HIGH — these are people with inside knowledge of legislation
```

This is the signal HUNTER v3.0 was designed to capture. The Finnhub endpoint was a placeholder that never delivered it.

### 1.2 Quiver Quantitative API

**Base URL:** `https://api.quiverquant.com/beta/`
**Auth:** `Authorization: Token {QUIVER_API_KEY}`
**Subscription:** ~$25/mo Premium tier

**Key endpoints:**

| Endpoint | Purpose | Refresh |
|----------|---------|---------|
| `GET /live/congresstrading` | All recent trades, all members | Daily |
| `GET /historical/congresstrading/{ticker}` | Trade history for specific ticker | On demand |
| `GET /live/senatetrading` | Senate only | Daily |

**n8n HTTP Node config:**
```
URL:  https://api.quiverquant.com/beta/live/congresstrading
Method: GET
Headers:
  Authorization: Token {{ $env.QUIVER_API_KEY }}
  Accept: application/json
Timeout: 15000ms
On Error: Continue (graceful fallback)
```

**Environment variable required:**
```
n8n Settings → Variables:
Key:   QUIVER_API_KEY
Value: [your Quiver Premium API key]
```

### 1.3 Response Schema (Quiver)

```json
[
  {
    "Representative": "Nancy Pelosi",
    "Transaction": "Purchase",
    "Ticker": "NVDA",
    "Range": "$1,000,001 - $5,000,000",
    "Date": "2026-03-15",
    "House": "House",
    "Party": "Democrat",
    "Committees": ["Science, Space, and Technology", "Intelligence"]
  }
]
```

### 1.4 Critical Signal Detection

**Algorithm: Committee-Sector Overlap**
Most actionable congressional trade pattern — member trades in sector their committee oversees:

| Committee | Sector(s) Mapped |
|-----------|-----------------|
| Armed Services | defense, aerospace, cybersecurity |
| Intelligence | tech, defense, cybersecurity |
| Finance / Banking | financials, fintech |
| Energy / Natural Resources | energy, materials, mining |
| Health | healthcare, pharma |
| Commerce / Science | tech, telecom, biotech |

Example flag: Senator on Armed Services buys PLTR →
`CRITICAL: Committee-sector overlap: Armed Services → defense,cybersecurity`

**Algorithm: Large Transaction**
Any trade >$100K midpoint → CRITICAL flag regardless of committee.

---

## SECTION 2: H35 CORRELATOR COMPATIBILITY

H30 v2.0 outputs records with `source: 'H30_QUIVER_CONGRESSIONAL'`.

**Current H35 bySource keys:**
```javascript
const bySource = {
  H30_FINNHUB: [],        // ← OLD (replace with below)
  H31_CONGRESS: [],
  H32_SENATE_LDA: [],
  H33_USASPENDING: [],
  H34_FEC: []
};
```

**Required H35 update for v3.3:**
```javascript
const bySource = {
  H30_QUIVER_CONGRESSIONAL: [],  // ← NEW (Quiver congressional trades)
  H31_CONGRESS: [],
  H32_SENATE_LDA: [],
  H33_USASPENDING: [],
  H34_FEC: []
};
```

> Note: The H35 algorithms (sector convergence, money flow correlation, etc.) remain unchanged. Only the source key changes. H30 records carry `sector_tags`, `amount`, `entity_name`, and `data_freshness` — same schema H35 already expects.

---

## SECTION 3: CRITICAL SIGNAL ESCALATION TO CIL

When H30 detects critical congressional trades, inject into CIL PROMPT BUILDER:

```
CONGRESSIONAL TRADE ALERT:
{Representative} ({Party}, {House}) — {Committee}
{Direction}: {Ticker} — {AmountRange}
Trade Date: {Date} | Freshness: {Freshness}
CRITICAL: {CriticalReason}

Committee-sector overlap detected. This member oversees legislation
directly affecting {Ticker}'s operating environment.
PRIORITY: Evaluate immediately against open positions and PRIME signals.
```

---

## SECTION 4: HUNTER v3.3 MODULE SUMMARY

| Version | Total Modules | Key Addition |
|---------|---------------|-------------|
| v3.0 | 29 | Discovery architecture |
| v3.1 | 42 | Gate 9, Kill Switch |
| v3.2 | 44 | Unusual Whales H40 |
| v3.3 | 44 | H30 Quiver upgrade (same count, H30 replaced) |

**Paid subscriptions now required for full HUNTER v3.3:**

| Service | Module | Cost | Signal Type |
|---------|--------|------|-------------|
| Quiver Quantitative | H30 | ~$25/mo | Congressional stock trades |
| Unusual Whales | H40 | ~$40-80/mo | Options sweeps |
| Polygon.io websocket | VWAP | ~$29/mo | True intraday VWAP (SENTINEL) |

Total new subscription cost: ~$94-134/mo
Against daily target of $300-$1,500: ROI at minimum performance = positive.

---

## SECTION 5: DEPLOYMENT STEPS

1. Add env var: `n8n Settings → Variables → QUIVER_API_KEY = [key]`
2. In HUNTER workflow: Find `H30 — Congress Trades` HTTP Request node
3. Update URL: `https://api.quiverquant.com/beta/live/congresstrading`
4. Update Auth header: `Authorization: Token {{ $env.QUIVER_API_KEY }}`
5. Replace H30-Normalize code with `H30_NORMALIZE_QUIVER_v2.0.js` (on GitHub)
6. In H35 Correlator: Update `bySource` key from `H30_FINNHUB` to `H30_QUIVER_CONGRESSIONAL`
7. Test: Run HUNTER manual trigger → verify H30 returns congressional trades

---

*HUNTER v3.3 | METATRON v10.8 | March 30, 2026*
*The data leads. The Principal decides.*
🔱

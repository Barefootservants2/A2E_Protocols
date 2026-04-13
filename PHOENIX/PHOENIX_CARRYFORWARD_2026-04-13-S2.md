# PHOENIX RESTART — April 13, 2026 (Session 2)
## SESSION ID: MICHA-2026-0413-SIGNAL-ENGINE-DEPLOY

═══════════════════════════════════════
## COMPLETED THIS SESSION
═══════════════════════════════════════

### 1. UCO Trade — CONFIRMED
- T1 filled at $43.00, 106 shares, account 6685 IRA
- IRONCLAD stop set at $40.85 (-5%)
- Trim levels: $45.15 (+5%), $47.30 (+10%), $49.45 (+15%), $51.60 (+20%)
- 52-week high: $44.25 — entry is $1.25 below ceiling
- WTI crude at $104.32, blockade live at 10:00 AM ET
- UCO day change +7.76%, personal gain +0.40%

### 2. Portfolio Snapshot — 6685 IRA ($288,599)
- 13 positions, $38K cash (SGOV $93K = 32.32%)
- GREEN today: UCO (+7.76%), ITA (+0.37%), VOO (+0.05%), MSFT (+2.38%)
- RED today: PSLV (-2.93%), AG (-0.44%), XLV (-0.56%), IBIT (-1.85%)
- Silver inverse correlation CONFIRMED: crude up = dollar up = silver down
- PSLV re-entered at $24.82, 423 shares. IRONCLAD stop at $23.58

### 3. Signal Engine v1.0 — DEPLOYED TO N8N
- Workflow ID: G4mrmnbJyC3qcQ9k
- URL: https://ashes2echoes.app.n8n.cloud/workflow/G4mrmnbJyC3qcQ9k
- 9 nodes deployed (Schedule + Manual + Router + Alpha + Bravo + Merge + Generator + Formatter + Telegram)
- Schedule: 6:30 AM ET Mon-Fri (cron: 30 10 * * 1-5)
- Telegram delivery CONFIRMED (3 successful messages, message_id 3639-3642)
- Credential: "Telegram account" (uses hunter_a2e_bot)

### 4. Root Cause Found — fetch() vs HTTP Request
- **CRITICAL FINDING:** `fetch()` is NOT reliably available in n8n Cloud Code nodes
- All 4 failing data feeds (UW, EIA, CFTC, COMEX) fail because Code nodes use `fetch()`
- FRED appeared to work intermittently but also fails via API execution
- **PROOF:** HTTP Request nodes work perfectly:
  - FRED VIX: 332ms, full data returned
  - UW Flow: 156ms, 50 flow alerts returned
  - EIA Crude: 3,023ms, full inventory data returned
- **Test workflow:** wXduoY9YXd2Ofs0L (proves all 3 APIs work with HTTP Request nodes)
- HUNTER works because ALL H-series nodes are HTTP Request nodes, not Code with fetch()

### 5. SENTINEL Telegram Bot Credential — BROKEN
- "SENTINEL Telegram Bot" credential returns 401 Unauthorized
- "Telegram account" credential works (uses hunter_a2e_bot)
- SENTINEL's Telegram alerts may be silently failing if using the broken credential
- Need to check which credential SENTINEL uses and fix

### 6. Nasdaq Data Link — BLOCKED FROM CLOUD
- Both data.nasdaq.com and quandl.com return Incapsula bot-wall HTML from cloud IPs
- Affects: CFTC COT data, COMEX vault inventory
- These feeds will NOT work from n8n Cloud regardless of node type
- Need alternative data sources (CFTC.gov CSV, CME direct reports)

═══════════════════════════════════════
## IMMEDIATE — NEXT SESSION (PRIORITY 1)
═══════════════════════════════════════

### Rebuild Signal Engine Collectors with HTTP Request Nodes

The architecture change is: replace `fetch()` in Code nodes with HTTP Request nodes.

**Current (broken):**
```
Trigger → Code node (fetch + process) → Merge → Score → Format → Telegram
```

**Target (proven pattern — same as HUNTER):**
```
Trigger → HTTP Request nodes (API calls) → Code nodes (process only) → Merge → Score → Format → Telegram
```

**Nodes to create (5 HTTP Request + processing):**

| Node | Type | URL | Auth |
|------|------|-----|------|
| HTTP: UW Flow | httpRequest | api.unusualwhales.com/api/option-trades/flow-alerts | Bearer 33128e70... |
| HTTP: FRED DXY | httpRequest | api.stlouisfed.org/fred/series/observations?series_id=DTWEXBGS&api_key=... | None (in URL) |
| HTTP: FRED 10Y | httpRequest | api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=... | None |
| HTTP: FRED VIX | httpRequest | api.stlouisfed.org/fred/series/observations?series_id=VIXCLS&api_key=... | None |
| HTTP: EIA Crude | httpRequest | api.eia.gov/v2/seriesid/PET.WCESTUS1.W?api_key=... | None (in URL) |

Then: Process Code node (combines all HTTP results, scores, generates cards) → Formatter → Telegram

**Test workflow to expand from:** wXduoY9YXd2Ofs0L (already has UW, FRED VIX, EIA working)

═══════════════════════════════════════
## REMAINING FROM PRIOR SESSIONS
═══════════════════════════════════════

1. **PSLV Exit Watchlist seed** — Supabase row still pending since April 12
2. **Supabase signal_history table** — needed for paper trade tracking
3. **SENTINEL Telegram credential fix** — check which credential SENTINEL uses
4. **FORGE Sprint 2** — Intent Router, Visual Diff, Guided Remediation, Drift Interceptor
5. **FORGE test harness** — 150-200 prompts, A/B/C comparison, scoring rubric (NOT STARTED)
6. **Paper trade POC** — 2-3 weeks automated, needs signal_history table + activated workflow
7. **Candlestick modules 2-5** — M1 delivered March 17, M2-M5 not built
8. **Yahoo H3 crumb replacement** — HUNTER
9. **FEC H34 timeout fix** — HUNTER
10. **GABRIEL workflow full validation**
11. **4 hardcoded credentials cleanup**
12. **Tax filing** — deadline April 15, extension if not done Tuesday night

═══════════════════════════════════════
## MARKET CONTEXT
═══════════════════════════════════════

- US Navy blockade on Iranian ports effective 10:00 AM ET April 13
- Ceasefire expires April 22, no follow-up talks scheduled
- WTI crude: $104.32 (up 8% from Friday $96.57)
- Silver: $73.58-$74.47 (down 1.75-3.5% on dollar strength)
- 10Y yield: 4.29%
- UCO: $43.17 (T1 filled at $43.00)
- PPI data: Tuesday April 14
- EIA weekly inventory: Wednesday April 15
- Key pattern: crude up = dollar up = silver DOWN (war regime correlation)

═══════════════════════════════════════
## ACTIVE N8N WORKFLOWS
═══════════════════════════════════════

| Workflow | ID | Nodes | Status |
|----------|-----|-------|--------|
| HUNTER v3.3 | orZPNtvvCB8RAlwF | 97 | Active |
| SENTINEL | CsTbRtchtCzxjKLX | 82 | Active |
| SIGNAL ENGINE v1.0 | G4mrmnbJyC3qcQ9k | 9 | Deployed (needs rebuild) |
| SE HTTP Test | wXduoY9YXd2Ofs0L | 5 | Test (archive after rebuild) |
| CIL v6.1 | V61BMUNNQDBpCOsp | 56 | Active |
| GABRIEL v2.0 | fwKiBHtedNQ1n34H | -- | Active |
| HUNTER MICRO | rsS4DFbOgTRQvqTX | -- | Active |
| TOKEN KEEPER | KhTkAxrCW1kZvgdV | -- | Active |
| TOKEN EXCHANGE | kcngMMPBm5h0ZfTZ | -- | Active |

═══════════════════════════════════════
## API KEYS
═══════════════════════════════════════

- UW: 33128e70-c3c6-4ef2-9bc1-d7e7a802aed5
- FRED: c0f3927517cedb8c7447a97c00bb9c89
- EIA: EjSx0le1nWJ30mu5zI8pYSFsDG8IGyBYqMa6ktoB
- Nasdaq Data Link: 5xiqd9uTcvXFF8S98Df7 (BLOCKED from n8n Cloud)

═══════════════════════════════════════

PHOENIX CLOSE COMPLETE.

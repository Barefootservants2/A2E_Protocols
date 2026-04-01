# PHOENIX MASTER CLOSE — April 2, 2026
**Session:** April 1-2, 2026 | MICHA v10.8 | Principal: William Earl Lemon

---

## SESSION ACCOMPLISHMENTS

| Item | Status | Detail |
|---|---|---|
| Alpaca paper keys | ✅ DONE | ALPACA_PAPER_KEY_ID, ALPACA_PAPER_SECRET, ALPACA_PAPER_BASE_URL in n8n |
| CIL_WEBHOOK_URL | ✅ DONE | Confirmed in n8n variables |
| HUNTER v3.1 import | ✅ DONE | Workflow ID: Kkss5qmzKlzi4AC5 in n8n |
| HUNTER v3.2 build | ✅ DONE | 28 nodes converted from $env to named credentials |
| HUNTER v3.2 GitHub push | ✅ DONE | commit cf9c6b12 — N8N/WORKFLOWS/HUNTER_MARKET_WORKFLOW_v3.2.json |
| FRED_API_KEY | ✅ DONE | c0f3927517cedb8c7447a97c00bb9c89 — in n8n variables |
| FEC_API_KEY | ✅ DONE | Yg76oQTphcX5DtqmR6qhVpDrFaDkj9rz6pPQUx2Y — in n8n variables |
| METALS_DEV_KEY | ✅ DONE | NEOYYXTIVBLB9P5373J58155373J5 — in n8n variables |
| CONGRESS_API_KEY | ✅ IN N8N | mPQJhF3Zf1wTaeNN9iaKHBCwIoYkMew16ghdtiJC — added but not yet active |
| Portfolio stops | ✅ DONE | All 3 accounts — stops set per IRONCLAD |
| MSFT fractional | ✅ CLOSED | 0.168 shares — noise eliminated |
| XLE | ✅ SOLD | Exited at even — IRONCLAD same-day re-entry ban active |
| Overnight brief | ✅ DONE | Tehran explosions, Al-Salmi tanker attack, Brent $112, WTI $102 |

---

## HUNTER v3.2 — CREDENTIAL MAP

All 28 credential conversions confirmed. Named credentials used:

| Credential Name | Nodes |
|---|---|
| Finnhub API | H5, H7, H9, H19, H25, H26, H30, H39a/b/c |
| Twelve Data API | H10-H16, H18, H20 |
| Alpha Vantage API | H2a, H4 |
| NewsAPI | H2b, H28 |
| URIEL API Key | URIEL agent |
| COLOSSUS API Key | COLOSSUS agent |
| HANIEL API Key | HANIEL agent |
| RAZIEL API Key | RAZIEL agent |
| GitHub_A2E_Token | GitHub Archive Write |

Remaining $env vars (no named credentials — use n8n variables):
- FRED_API_KEY → H27, H37, H38, H41
- CONGRESS_API_KEY → H21, H31a, H31b (key not yet active)
- FEC_API_KEY → H34
- METALS_DEV_KEY → H29
- CIL_WEBHOOK_URL → CIL v6.1 Webhook node
- H40 Barchart → DISABLED (pending UW API replacement)

---

## P0 QUEUE — NEXT SESSION

### IMMEDIATE (before anything else)
1. **Import HUNTER v3.2** — n8n UI manual import
   - Delete "Hunter market workflow v3.1" (ID: Kkss5qmzKlzi4AC5)
   - Import: https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/N8N/WORKFLOWS/HUNTER_MARKET_WORKFLOW_v3.2.json
   - OR use downloaded file from outputs
   - Verify credential auto-match on import — all named credentials should resolve

2. **Verify Congress key** — key mPQJhF3Zf1wTaeNN9iaKHBCwIoYkMew16ghdtiJC
   - Test: curl "https://api.congress.gov/v3/bill?api_key=mPQJhF3Zf1wTaeNN9iaKHBCwIoYkMew16ghdtiJC&limit=1&format=json"
   - Once active — H21, H31a, H31b go green

3. **Move $35K → SGOV in account 4898**
   - $128/month immediate passive income
   - No risk, fully liquid

### BUILD QUEUE

**HUNTER v3.3 — Unusual Whales Enhancement (Section F)**
- Requires: UW API subscription ($50/week trial first)
- H40 replacement: `/api/option-trades/flow-alerts` (options sweep detection)
- New H43: `/api/darkpool/recent` (dark pool prints)
- New H44: `/api/market/market-tide` (market sentiment)
- New H45: `/api/congress/recent-trades` (replaces H30 Finnhub congressional)
- Auth headers required: `Authorization: Bearer TOKEN` + `UW-CLIENT-API-ID: 100001`
- This is SECTION F from the original 8-section restart prompt

**Alpaca Paper Gate (Section D)**
- JSON is ready at N8N/WORKFLOWS/ — need to locate and import
- Wires to: CIL_WEBHOOK_URL for paper trade validation
- Env vars: ALPACA_PAPER_KEY_ID, ALPACA_PAPER_SECRET, ALPACA_PAPER_BASE_URL — all confirmed in n8n

**Full Backtest (Section G)**
- Run from C:\a2e via Claude Code:
  ```
  curl -O https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/AIORA/BACKTEST/backtest_harness.py
  pip install vectorbt yfinance pandas numpy --break-system-packages
  python backtest_harness.py --days 365 --output results.json
  ```
- STRONG: 64.1% confirmed — validate with full 365-day run
- PROBE: 44.8% — DECISION: ELIMINATE unless backtest says otherwise
- PRIME: no sample yet — full run needed

**Quiver Quantitative H30 upgrade (Section H)**
- H30 currently: Finnhub congressional trading
- Replace with: Quiver Quantitative (~$25/mo)
- Endpoint: `https://api.quiverquant.com/beta/live/congresstrading`
- This is HUNTER v3.3 (H30 = H30_QUIVER_CONGRESSIONAL)

---

## TRADES WATCH — NEXT MORNING

| Ticker | Setup | Entry Zone | Stop | Target | Note |
|---|---|---|---|---|---|
| FCX | Pre-earnings drift + Section 232 copper | $58-60 | $55.50 | $66 / $70 | Earnings April 16, dividend ex April 15 |
| XLE | Re-entry only on fresh data tomorrow AM | Watch only | — | — | Same-day re-entry ban today |
| BTC | Revisit tomorrow morning | Watch only | — | — | Deferred per Principal |
| Crude | WTI $102, April 6 deadline | Watch XLE | — | — | Deferred per Principal |

---

## MARKET STATE AT CLOSE

| Indicator | Value |
|---|---|
| Silver spot | $74.66 |
| Shanghai silver premium | ~$7-8/oz over COMEX (thesis confirming) |
| Gold | $4,721 |
| WTI crude | $102 (Kitco) |
| Brent | ~$112 |
| DXY | 100.48 |
| VIX | 25.25 (down 17% on day) |
| S&P 500 | 6,528 (+2.91%) |
| 10Y yield | 4.31% |

### Iran / Hormuz Overnight
- Kuwaiti tanker Al-Salmi struck at Port of Dubai — fire, crew safe
- Three explosions heard in Tehran — unconfirmed target
- Trump April 6 deadline: Iran must reopen Hormuz or US strikes power plants
- Back-channel talks ongoing (Pakistan/China mediation)
- Iran publicly rejecting negotiations
- April 6 = next binary event — NOT Liberation Day anniversary today

---

## PORTFOLIO STATE AT CLOSE

| Account | NAV | Key Holdings |
|---|---|---|
| -5267 Individual | $10,344 | SGOV, JEPI, SCHD, SPHD — income core |
| -4898 My Life in Currency | $60,898 | $40,477 CASH (deploy to SGOV), PHYS, CEF, JEPI, LHX, RKLB, SCHD |
| -6685 Rollover IRA | $287,511 | SGOV, PSLV, PHYS, AG, PLTR, ITA, VOO, SCHD, JEPI, SPHD, UFO, XLV |
| **TOTAL** | **$358,753** | |

### Stops confirmed set this session
- PHYS: $33.50 (both accounts)
- SCHD: $29.00 (all 3 accounts)
- PSLV: $22.60 (IRONCLAD — do not move)
- AG: $19.50
- LHX: $325.00
- RKLB: $60.00
- PLTR: $135.00
- ITA: $208.00
- VOO: T-Stop $571.30 (already set)

### MSFT fractional: CLOSED
### XLE: SOLD at even — NO re-entry today (IRONCLAD)
### Cash -4898: $40,477 — MOVE $35K TO SGOV next session

---

## SUBSCRIPTIONS DECISION

| Service | Cost | Decision | Status |
|---|---|---|---|
| Unusual Whales Platform | $530/yr | KEEP — manual trading tool | Active |
| Unusual Whales API | $50/week trial | AUTHORIZED — buy trial first | Pending |
| Quiver Quantitative | ~$25/mo | PENDING backtest confirmation | On hold |
| Barchart | $50-150/mo | SKIP — UW API replaces H40 | Rejected |

---

## NEXT SESSION RESTART PROMPT

```
PHOENIX RESTART — [DATE]
SESSION STATE:
- HUNTER v3.2: GitHub commit cf9c6b12 — NEEDS IMPORT to n8n
- Congress API key: mPQJhF3Zf1wTaeNN9iaKHBCwIoYkMew16ghdtiJC — verify active
- $35K cash in 4898: NEEDS SGOV deployment
- XLE: sold at even — re-entry eligible tomorrow if thesis holds
- FCX: Ring 4 entry candidate — $58-60 zone, earnings April 16

P0 QUEUE:
1. Import HUNTER v3.2 to n8n (delete v3.1 first)
2. Verify Congress key active
3. Move $35K → SGOV in 4898
4. UW API trial — $50/week — authorize and subscribe
5. Run backtest from C:\a2e — python backtest_harness.py
6. PROBE decision — eliminate (44.8% win rate)
7. FCX entry decision — morning read first

P1 QUEUE (requires UW API):
- HUNTER v3.3 — H40/H43/H44/H45 Unusual Whales nodes
- Quiver Quantitative H30 upgrade → HUNTER v3.3

CRITICAL DATES:
- April 6 8PM ET: Trump Iran deadline — next binary event
- April 15: FCX dividend ex-date
- April 16: FCX earnings
- April 27: NUE earnings
```

---
*PHOENIX CLOSE committed by MICHA v10.8 | April 2, 2026*

# HUNTER v3.2 — DISCOVERY SYSTEM SPEC
## METATRON v10.8 | Effective: March 30, 2026
## Classification: PRODUCTION

---

## CHANGES FROM v3.1

| # | Module | Change | Rationale |
|---|--------|--------|-----------|
| 1 | H40 | Replaced Barchart GEX (single symbol) with Unusual Whales sweep detector (full market) | Smart money positioning visible in options 24-72hr before equity move. Barchart free tier too narrow. |
| 2 | H40 | Added watchlist cross-reference | Surface when sweeps hit our active positions — actionable signal vs noise |
| 3 | H40 | Added graceful fallback to Barchart when UW key not configured | No hard failure if subscription lapses |
| 4 | Architecture | H40 output added to HUNTER MASTER MERGE normalizer | Options flow signals now reach CIL agents |
| 5 | Gate 9 | H40 watchlist_hit_count incorporated into correlation signal scoring | Sweep activity on watchlist = elevated conviction |

---

## SECTION 1: H40 ARCHITECTURE

### 1.1 Primary Path — Unusual Whales (when `UNUSUAL_WHALES_API_KEY` env var set)

**API endpoint:**
```
GET https://api.unusualwhales.com/api/flow/live
Header: Authorization: Bearer {key}
```

**What it returns:**
- Real-time options flow across all listed equities
- Sweep detection (large, rapid multi-leg orders)
- Premium size, direction, expiry, strike
- Sentiment tagging (bullish/bearish/neutral)

**Processing pipeline (H40 Code Node):**
```
UW API response
      │
      ▼
Filter sweeps (premium > $50K)
      │
      ├──→ sweeps[]          — Individual large orders
      ├──→ bullish_flow[]    — Net bullish by ticker (premium-weighted)
      ├──→ bearish_flow[]    — Net bearish by ticker
      ├──→ top_tickers[]     — Most active 20 tickers by total premium
      └──→ watchlist_hits[]  — Sweeps on our active watchlist
```

**Signal strength interpretation:**

| Condition | Signal | Action |
|-----------|--------|--------|
| Watchlist symbol, sweep >$100K, BULLISH | CRITICAL — institutional positioning | Flag to CIL, elevate PRIME tier consideration |
| Watchlist symbol, sweep $50-100K, BULLISH | HIGH — smart money interest | Add to STRONG consideration |
| Watchlist symbol, any sweep, BEARISH | WARNING — downside hedge detected | Flag to CIL, check against current position |
| Non-watchlist, sweep >$500K, BULLISH | DISCOVERY — new opportunity | Surface in HUNTER daily report as discovery candidate |
| High P/C ratio shift (>2.0) on watchlist | DEFENSIVE POSITIONING — risk off | Escalate to Gate 9 correlation check |

### 1.2 Fallback Path — Barchart (when UW key not configured)

**API endpoint:**
```
GET https://api.barchart.com/v2/options/chain/getChain
Params: symbol=SLV (and other key watchlist symbols), fields=delta,gamma,openInterest,volume
```

**What it provides:**
- P/C ratio on individual symbols
- GEX (Gamma Exposure) estimate
- Weekly options chain snapshot

**Limitations:**
- Delayed (not real-time)
- Single symbol per call (no sweep detection)
- No institutional flow identification

**Fallback output marks `data_quality: 'FALLBACK_PARTIAL'`** — CIL agents receive a data quality flag and weight H40 signals accordingly.

---

## SECTION 2: INTEGRATION WITH HUNTER MASTER MERGE

H40 output structure (standardized for MASTER MERGE):

```json
{
  "h40": {
    "source": "UNUSUAL_WHALES | BARCHART_FALLBACK",
    "data_quality": "LIVE | FALLBACK_PARTIAL | ERROR | EMPTY",
    "sweep_count": 0,
    "watchlist_hit_count": 0,
    "watchlist_hits": [
      {
        "symbol": "PSLV",
        "direction": "BULLISH",
        "premium": 127500,
        "size": 850,
        "strike": 18.00,
        "expiry": "2026-04-17",
        "option_type": "call",
        "is_sweep": true
      }
    ],
    "top_tickers": [...],
    "bullish_flow": [...],
    "bearish_flow": [...],
    "highest_premium_sweep": {...},
    "timestamp": "ISO8601"
  }
}
```

---

## SECTION 3: GATE 9 CORRELATION UPDATE

Gate 9 currently checks H37 (DXY), H38 (YIELD), H39 (FLOW — ETF proxies for metals).

**v3.2 addition:** H40 `watchlist_hit_count` incorporated into correlation scoring.

```javascript
// Gate 9 enhanced logic:
const uwSweepsOnWatchlist = h40.watchlist_hit_count || 0;
const uwBullishSweeps = h40.watchlist_hits?.filter(s => s.direction === 'BULLISH').length || 0;
const uwBearishSweeps = h40.watchlist_hits?.filter(s => s.direction === 'BEARISH').length || 0;

// Options sweep confirmation bonus/penalty on Gate 9 score
const sweepAdjustment = uwBullishSweeps > 0 ? +10 :
                        uwBearishSweeps > 0 ? -10 : 0;
// Gate 9 composite score += sweepAdjustment
```

**Result:** When institutional sweep activity confirms the directional thesis (e.g., bullish sweeps on PSLV align with Gate 9 correlation passing), Gate 9 score is elevated and conviction increases. Counter-directional sweeps reduce Gate 9 score as a warning.

---

## SECTION 4: n8n IMPLEMENTATION

### Node 1 — H40 HTTP Request (Unusual Whales)
```
Type: HTTP Request
URL:  https://api.unusualwhales.com/api/flow/live
Auth: Header — Authorization: Bearer {{ $env.UNUSUAL_WHALES_API_KEY }}
On Error: Continue (triggers fallback path)
Position: After H39 ETF Merge, feeds H40 Code Node
```

### Node 2 — H40 Code Node (Sweep Processor)
```
Type: Code
File: AIORA/SENTINEL/H40_UNUSUAL_WHALES_v2.0.js (on GitHub)
Input: UW API response OR Barchart response (fallback)
Output: Standardized H40 object → HUNTER MASTER MERGE
```

### Node 3 — Env Variable Required
```
n8n Settings → Variables → New:
Key:   UNUSUAL_WHALES_API_KEY
Value: [your UW API key]
```

### Subscription
- Unusual Whales: https://unusualwhales.com — ~$40-80/mo depending on tier
- Minimum tier needed: Any paid tier with API access
- Free alternative: None with equivalent sweep detection capability

---

## SECTION 5: HUNTER v3.2 NODE COUNT

| Version | Nodes | New in This Version |
|---------|-------|---------------------|
| v3.0 | 29 modules | Discovery architecture shift |
| v3.1 | 42 modules (H1-H42) | Gate 9 correlation, Kill Switch |
| v3.2 | 44 modules (H1-H42, H40v2, H40-Normalizer) | Unusual Whales sweep detection, Gate 9 H40 integration |

---

## SECTION 6: SIGNAL PRIORITY IN CIL PROMPT

When H40 detects watchlist sweeps, the following language is injected into the CIL PROMPT BUILDER for the MARKET domain:

```
UNUSUAL OPTIONS FLOW DETECTED:
[SYMBOL]: [DIRECTION] sweep — $[PREMIUM] premium, [SIZE] contracts
Expiry: [DATE] | Strike: $[STRIKE]
On watchlist. Evaluate against current thesis direction.
```

This ensures all 5 CIL agents receive the sweep intelligence when building their analysis.

---

*HUNTER v3.2 | METATRON v10.8 | March 30, 2026*
*Discovery over Confirmation. Sources over Assumptions.*
🔱

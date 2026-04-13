# SIGNAL ENGINE v1.0 — Architecture
## From Research Platform to Daily P&L Machine
### Ashes2Echoes LLC | Uriel Covenant AI Collective
### Date: April 13, 2026

---

## PURPOSE

Transform HUNTER from a market research scanner into a trade signal generator
that outputs actionable, sized, stop-set entries for Track 1 Daily Grind trades.

**Target:** $300-$1000/day from 1-2 high-conviction setups.

---

## CURRENT STATE → TARGET STATE

```
CURRENT:
HUNTER scan → Telegram alert ("crude looks interesting") → Manual analysis → Manual entry

TARGET:
DATA FEEDS → SIGNAL ENGINE → RANKED TRADE CARD → Telegram with exact entry/stop/target/size
```

---

## NEW H-SERIES REGISTRY

### SIGNAL-GRADE (directly generate trade entries)
| ID   | Source              | Frequency    | API Cost | Status        |
|------|---------------------|-------------|----------|---------------|
| H44  | Unusual Whales      | Real-time   | OWNED    | Key exists, unwired |
| H36  | CFTC COT            | Weekly Fri  | FREE     | Not built     |
| H41  | EIA Weekly Petrol   | Weekly Wed  | FREE     | Not built     |

### THESIS-PROTECTION (protect existing positions)
| ID   | Source              | Frequency    | API Cost | Status        |
|------|---------------------|-------------|----------|---------------|
| H40  | COMEX Inventory     | Daily       | FREE     | Not built     |
| H45  | SHFE Premiums       | Daily       | FREE*    | Not built     |
| H46  | CME Margin Changes  | Event       | FREE     | Not built     |

### MACRO-CONTEXT (Kill Switch enhancement)
| ID   | Source              | Frequency    | API Cost | Status        |
|------|---------------------|-------------|----------|---------------|
| H42  | FRED API            | Daily+      | FREE     | Not built     |
| H47  | Put/Call Ratio      | Daily       | FREE     | Not built     |

*SHFE requires scraping or third-party data provider

---

## SIGNAL ENGINE PIPELINE

```
Phase 1: DATA COLLECTION (6:00 AM ET)
├── H44: Unusual Whales — pull overnight/pre-market flow
├── H30: Finnhub — pre-market quotes for watchlist
├── H40: COMEX — overnight inventory changes
├── H42: FRED — yields, DXY, rate expectations
└── HUNTER existing nodes — all standard scans

Phase 2: CONTEXT ENRICHMENT (6:15 AM ET)
├── H36: COT — weekly positioning context (cached from Friday)
├── H41: EIA — weekly inventory context (cached from Wednesday)
├── H47: Put/Call — prior day sentiment
├── Kill Switch check — H37(DXY) + H38(yields) + H39(flow)
└── SENTINEL — current position status, IRONCLAD compliance

Phase 3: SIGNAL GENERATION (6:30 AM ET)
├── Score each candidate across 6 dimensions
│   ├── Flow Score (UW options activity)         weight: 30%
│   ├── Positioning Score (COT lean)             weight: 20%
│   ├── Supply Score (COMEX/EIA physical)        weight: 15%
│   ├── Thesis Score (SENTINEL chain status)     weight: 15%
│   ├── Macro Score (DXY/yields/Kill Switch)     weight: 10%
│   └── Sentiment Score (P/C ratio, fear/greed)  weight: 10%
├── Apply IRONCLAD v3.0 sizing rules
│   ├── Ring assignment (2/3/4)
│   ├── Track assignment (1 Daily Grind / 2 Thesis)
│   ├── 5% hard stop calculation
│   ├── T1/T2 tranche sizing (2x 50%)
│   └── Sector exposure check vs current portfolio
└── Output: Ranked Trade Cards (max 3 per day)

Phase 4: DELIVERY (6:45 AM ET)
├── Telegram: Top 3 Trade Cards with full parameters
├── Digest: Daily context summary (macro, positioning, flow)
└── Flag: Any thesis-protection alerts (COMEX drawdown, margin hike)
```

---

## TRADE CARD FORMAT

```
═══════════════════════════════════════
SIGNAL ENGINE — TRADE CARD #1
═══════════════════════════════════════
SYMBOL:    UCO
ACTION:    BUY
RING:      4 (Tactical)
TRACK:     1 (Daily Grind)
CONFIDENCE: 87%

ENTRY:     $40.50 (T1: 50% at open, T2: 50% at first pullback)
STOP:      $38.48 (-5.0% hard stop)
TARGET 1:  $42.53 (+5.0% — trim 25%)
TARGET 2:  $44.55 (+10.0% — trim 25%)

SIZE:      $7,500 per tranche ($15,000 total)
ACCOUNT:   4898 (taxable)
MAX LOSS:  $750 (1.5% of account)

SIGNAL DRIVERS:
├── FLOW:  UW detected $2.1M call sweeps in UCO Fri 3:45PM [9/10]
├── COT:   Large specs net SHORT crude -12K contracts [8/10]
├── SUPPLY: EIA -3.1M barrel draw, Hormuz blockade 10AM [9/10]
├── THESIS: Energy/Hormuz chain — all layers GREEN [7/10]
├── MACRO:  DXY flat, yields down 3bp overnight [6/10]
└── SENT:  Put/call 0.82, fear elevated [6/10]

COUNTER-THESIS (Gate 7.5):
CENTCOM clarifies blockade = Iranian-flagged only. Market
reads as posturing. Gap fades intraday. DXY spike on crude
cooldown pressures all commodity longs.

KILL SWITCH STATUS: CLEAR
═══════════════════════════════════════
```

---

## FILE MANIFEST

| File | Purpose |
|------|---------|
| NODES/H36_CFTC_COT.js | CFTC Commitments of Traders pull + parse |
| NODES/H40_COMEX_INVENTORY.js | CME COMEX vault inventory daily pull |
| NODES/H41_EIA_WEEKLY.js | EIA petroleum status report pull |
| NODES/H42_FRED_API.js | Federal Reserve economic data pull |
| NODES/H44_UNUSUAL_WHALES.js | Unusual Whales options flow scanner |
| NODES/H47_PUT_CALL_RATIO.js | CBOE put/call ratio pull |
| NODES/SIGNAL_GENERATOR.js | Core scoring + Trade Card generator |
| NODES/TRADE_CARD_FORMATTER.js | Telegram-formatted output |
| SPECS/SIGNAL_SCORING_MATRIX.md | Detailed scoring rubric |
| DEPLOY/DEPLOYMENT_CHECKLIST.md | Step-by-step wiring guide |
| DEPLOY/HUNTER_INTEGRATION.md | How to wire into existing HUNTER workflow |

---

## IRONCLAD v3.0 COMPLIANCE

The Signal Engine enforces ALL IRONCLAD rules programmatically:

- Universal 5% hard stop (Rings 2-4) — calculated on every Trade Card
- Entry = 2x 50% tranches — T1/T2 always split
- Trim = 25% at every +5% — targets pre-calculated
- No same-day re-entry — checked against SENTINEL transaction history
- Correlation Kill Switch — auto 50% metals reduction when DXY+yields adverse
- 48hr embargo after Kill Switch fire — timestamp checked
- Sector exposure limits — checked against current SENTINEL portfolio

No Trade Card can be generated that violates IRONCLAD. The engine refuses
to output a signal that breaks risk rules.

---

## DEPENDENCIES

- SENTINEL must be running (provides current portfolio state)
- TOKEN KEEPER/EXCHANGE must be active (E*TRADE data for position checks)
- HUNTER must complete its scan before Signal Engine fires
- Supabase for COT/EIA cache tables (weekly data persists between runs)

---

## ESTIMATED BUILD TIME

| Component | Effort | Priority |
|-----------|--------|----------|
| H44 Unusual Whales wire | 2 hours | P0 — highest ROI |
| Signal Generator core | 3 hours | P0 — the missing piece |
| H36 CFTC COT | 1 hour | P0 — positioning context |
| H41 EIA Weekly | 1 hour | P1 — energy supply |
| H40 COMEX Inventory | 1 hour | P1 — silver thesis |
| H42 FRED API | 1 hour | P1 — macro context |
| H47 Put/Call Ratio | 30 min | P2 — sentiment |
| Trade Card Formatter | 1 hour | P0 — output delivery |
| Integration + Testing | 2 hours | P0 — make it work |
| **TOTAL** | **~13 hours** | **2-3 sessions** |

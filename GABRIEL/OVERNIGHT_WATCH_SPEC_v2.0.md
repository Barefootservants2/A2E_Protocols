# GABRIEL — OVERNIGHT WATCH v2.0
## Whitepaper | Architecture | Build Specification | README

**System:** GABRIEL — Overnight Watch  
**Version:** 2.0  
**Author:** MICHA, CIO — Uriel Covenant  
**Principal:** William Earl Lemon, Ashes2Echoes LLC  
**Date:** March 26, 2026  
**Platform:** n8n (ashes2echoes.app.n8n.cloud)  
**Status:** READY TO BUILD  
**Classification:** PRODUCTION SPECIFICATION  

---

## THE PROBLEM THAT BUILT THIS

**March 3, 2026. 4:00 AM ET.**

Silver spot dropped from ~$94 to ~$82 overnight. A 12.5% move. The trailing stops set at 4:00 PM the previous day — calibrated to catch a 2.5% adverse move — had zero relevance by the time the US market opened. They were already underwater before the first bell.

**March 3, 2026. 9:30 AM ET.**

Market opens. Stops trigger at worst levels. No warning. No time to act.

**Result: $7,619 in realized losses that were preventable with overnight monitoring.**

The market trades 24 hours. Our risk management operated 6.5 hours. That is a **73% coverage gap.** Silver, gold, and oil trade continuously through London, Shanghai, and COMEX Globex sessions. A stop set at 4:00 PM ET has zero defensive value if the underlying moved 12% while the Principal was asleep.

GABRIEL closes that gap permanently.

---

## MISSION STATEMENT

GABRIEL is the overnight watch commander of the Uriel Covenant AI Collective. It operates from market close (6:00 PM ET) through pre-market (9:25 AM ET) — the exact window where SENTINEL cannot see and manual monitoring is not possible.

GABRIEL does not trade. It watches. It evaluates. It escalates — with enough lead time for the Principal to act before the US market opens.

**GABRIEL's mandate:** No overnight event that materially affects the portfolio reaches the 9:30 AM bell without the Principal having been notified, briefed, and equipped to respond.

---

## SYSTEM CONTEXT: WHERE GABRIEL FITS

```
6PM                    OVERNIGHT                    9:25AM   9:30AM                 MARKET HOURS                  4PM
 |◄──────────────── GABRIEL ────────────────────────►|        |◄──────────── SENTINEL ───────────────────────────►|
 |                                                    |        |                                                    |
 | Futures surveillance every 30 min                 |        | 8 scheduled triggers (30-min cycle)               |
 | Commodities: Silver, Gold, Oil                    |        | 26 positions across 3 accounts                    |
 | VIX futures — overnight regime                    |        | IRONCLAD v2.0 stop/trim enforcement                |
 | Crypto: BTC, ETH (IBIT proxy)                    |        | Gate 9 Correlation (H37/H38/H39)                   |
 | DXY + Yield proxies (UUP, TLT)                   |        | Kill Switch: DXY+Yields auto-reduce                |
 | Geopolitical news scanning (keywords)             |        | Compliance audit + trade logging                   |
 | IF trigger → CIL collective analysis              |        |                                                    |
 | IF RED → SMS + prepare IRONCLAD orders            |        |                                                    |
 |                                                    |        |                                                    |
 | 8:00 AM: MORNING BRIEF → Telegram                |        |                                                    |
```

**The Collective relationship:**

| System | Role | GABRIEL Integration |
|--------|------|---------------------|
| SENTINEL | Market hours defense | GABRIEL is the night shift handoff |
| HUNTER | Market reconnaissance | GABRIEL monitors HUNTER watchlist filers overnight |
| CIL v5.2.1 | Collective consensus | GABRIEL fires CIL webhook on RED escalation |
| IRONCLAD v2.0 | Risk framework | GABRIEL applies IRONCLAD thresholds overnight |
| METATRON v10.7 | Protocol orchestration | All GABRIEL RED actions logged through METATRON gates |
| PHOENIX | Session continuity | Morning Brief IS the PHOENIX initialization data |

---

## ARCHITECTURE

### Overview: 17-Node Workflow

```
TRIGGER LAYER (4 triggers)
├── Node 1: Overnight Schedule (every 30 min, 6PM-9:25AM ET, Mon-Fri)
├── Node 2: Weekend Schedule (every 2 hours, Fri 6PM - Sun 6PM)
├── Node 3: Manual Trigger (on-demand testing/override)
└── Node 14: Morning Brief Schedule (8:00 AM ET, Mon-Fri — separate chain)

DATA COLLECTION LAYER
├── Node 4: Market Data Collector (Yahoo Finance v8, 15 symbols)
└── Node 5: News Scanner (Finnhub H30, keyword detection)

ANALYSIS LAYER
├── Node 6: Threshold Engine (GREEN / YELLOW / RED classification)
└── Node 7: Report Builder (HTML Telegram message assembly)

ESCALATION ROUTING
├── Node 8: Escalation Router IF (GREEN → silent log, YELLOW/RED → alert)
├── Node 9: Gabriel Alert — Telegram (YELLOW + RED)
├── Node 10: RED Escalation IF (RED only check)
├── Node 11: RED Alert Email — Gmail
└── Node 12: CIL Webhook — HTTP Request (RED only, fires collective analysis)

OUTPUT / LOGGING
├── Node 13: Gabriel Logger — Supabase (every run)
└── Node 16: GitHub Archive — HTTP Request (every run, daily JSON)

MORNING BRIEF CHAIN
├── Node 14: Morning Brief Schedule (8:00 AM ET)
├── Node 15: Morning Brief Builder (Supabase query + synthesis)
└── Node 17: Morning Brief Delivery — Telegram
```

### Data Flow Diagram

```
Nodes 1/2/3 (Triggers)
        │
        ▼
Node 4: Market Data Collector
        │
        ▼
Node 5: News Scanner
        │
        ▼
Node 6: Threshold Engine
        │
        ▼
Node 7: Report Builder
        │
        ▼
Node 8: Escalation Router ──── FALSE (GREEN) ────────────────────────────────┐
        │ TRUE (YELLOW/RED)                                                   │
        ▼                                                                     │
Node 9: Telegram Alert                                                        │
        │                                                                     │
        ▼                                                                     │
Node 10: RED Check ──────────── FALSE ───────────────────────────────────────┤
        │ TRUE                                                                │
        ├──► Node 11: Email Alert                                             │
        └──► Node 12: CIL Webhook                                            │
                │                                                             │
                └────────────────────────────────────────────────────────────┤
                                                                             │
                                                                             ▼
                                                              Node 13: Supabase Logger
                                                                             │
                                                                             ▼
                                                              Node 16: GitHub Archive

Node 14: Morning Brief Schedule
        │
        ▼
Node 15: Morning Brief Builder
        │
        ▼
Node 17: Morning Brief Telegram
```

---

## MONITORING SCHEDULE

| Window | Time (ET) | UTC | Frequency | What's Active |
|--------|-----------|-----|-----------|---------------|
| Asia Open | 6:00 PM - 12:00 AM | 22:00-04:00 | Every 30 min | Shanghai silver, Tokyo equity, Asian FX |
| London Open | 12:00 AM - 8:00 AM | 04:00-12:00 | Every 30 min | LBMA metals, European equity futures |
| Pre-Market | 7:00 AM - 9:25 AM | 11:00-13:25 | Every 30 min | US futures, pre-market movers |
| Morning Brief | 8:00 AM | 12:00 | Once | Consolidated overnight report |
| Weekend | Fri 6PM - Sun 6PM | Fri 22:00-Sun 22:00 | Every 2 hrs | Crypto, geopolitical, weekend futures |

---

## TRIGGER THRESHOLDS

### YELLOW — Attention Required

| Asset | Trigger | Condition |
|-------|---------|-----------|
| S&P 500 Futures (ES=F) | > 1% move | Either direction |
| VIX Futures (^VIX) | Change > 15% | From previous close |
| VIX Absolute | Level > 25 | Elevated anxiety |
| Crude Oil (CL=F) | > 3% move | Either direction |
| Gold Futures (GC=F) | > 2% move | Either direction |
| Silver Futures (SI=F) | > 5% move | The $7,619 prevention threshold |
| DXY Proxy (UUP) | > 0.5% move | Correlation risk warning |
| Bitcoin (BTC-USD) | > 5% move | IBIT/crypto proxy |
| News Keywords | Any hit | hormuz, iran, nuclear, ceasefire, margin call, circuit breaker, force majeure, default, fed rate, emergency meeting |

### RED — Immediate Action

| Asset | Trigger | Condition |
|-------|---------|-----------|
| S&P 500 Futures | > 3% move | Regime shift |
| VIX Absolute | Level > 35 | Crisis threshold |
| Crude Oil | > 8% move | Hormuz-class event |
| Silver Futures | > 10% move | Margin call territory |
| DXY Proxy (UUP) | > 1.5% move | Correlation Kill Switch warning |
| Multi-signal | 3+ yellows firing simultaneously | Coordinated selloff |
| Critical keywords | nuclear, circuit breaker, force majeure, default, emergency meeting | Systemic risk |

### Kill Switch Pre-Alert (Special Condition)

If ALL THREE conditions are true simultaneously:
- DXY (UUP) rising > 0.3%
- Yields (TLT) falling > 0.3%
- VIX > 30

→ RED escalation with KILL SWITCH WARNING label. Principal receives pre-alert before open so they can pre-position before SENTINEL's Kill Switch auto-fires at 9:30 AM.

---

## ESCALATION PROTOCOLS

### GREEN — Market Stable
- Log to Supabase (gabriel_overnight_log)
- Archive to GitHub (AIORA/GABRIEL/overnight/)
- No Telegram notification
- Silent operation

### YELLOW — Attention Needed
- Telegram push to hunter_a2e_bot (chat 8203545338)
- Formatted HTML message with market snapshot + triggered conditions
- Supabase log + GitHub archive
- No email, no automated orders

### RED — Immediate Action
- Telegram push (same as YELLOW + RED emoji + priority header)
- Email to ashes2echoes.platform@gmail.com
- CIL v5.2.1 webhook fired: Collective runs full 5-agent consensus on overnight conditions
- Supabase log + GitHub archive
- No automated order execution (v2.0 scope — E*TRADE auto-execution is v3.0)

**Why no auto-execution in v2.0:** The goal is monitoring and escalation. Auto-execution adds complexity and risk. Crawl → Walk → Run. v2.0 is the walk phase.

---

## DATA SOURCES

| Source | Data | Method | Auth | Cost |
|--------|------|--------|------|------|
| Yahoo Finance v8 | ES=F, NQ=F, YM=F, RTY=F, GC=F, SI=F, CL=F, ^VIX, BTC-USD, ETH-USD, UUP, TLT, DIA, SPY, QQQ | REST GET | None | Free |
| Finnhub API (H30) | General news, keyword scan | REST GET | API key (in n8n) | Free tier |
| Supabase | Read/write gabriel_overnight_log | REST POST/GET | anon key (in n8n) | Free tier |
| GitHub API | Write daily JSON archives | REST PUT | PAT token | Free |
| Telegram Bot API | Push notifications | via n8n credential | Bot token (in n8n) | Free |
| Gmail | RED alert email | via n8n credential | OAuth (in n8n) | Free |

---

## NODE-BY-NODE SPECIFICATION

### Node 1: Overnight Watch Trigger
```
Type: Schedule Trigger
Name: Overnight Watch Trigger
Interval: 30 minutes
Active hours: 22:00 - 13:25 UTC (6:00 PM - 9:25 AM ET)
Active days: Monday through Friday
```

### Node 2: Weekend Watch Trigger
```
Type: Schedule Trigger
Name: Weekend Watch Trigger
Interval: 2 hours
Active days: Saturday, Sunday
```

### Node 3: Manual Trigger
```
Type: Manual Trigger
Name: Manual Watch
Purpose: On-demand testing and emergency override
```

### Node 4: Market Data Collector
```
Type: Code (JavaScript)
Name: Overnight Market Data
Input: trigger output (any)
Output: { market_data, fetch_time, source }
```

Fetches 15 symbols from Yahoo Finance v8. For each: GET https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=2d. Extracts regularMarketPrice, chartPreviousClose, calculates changePercent. Error handling: symbol failures skipped, workflow continues.

Symbols: ES=F, NQ=F, YM=F, RTY=F, GC=F, SI=F, CL=F, ^VIX, BTC-USD, ETH-USD, UUP, TLT, DIA, SPY, QQQ

### Node 5: News Scanner
```
Type: Code (JavaScript)
Name: News Scanner
Input: Node 4 output
Output: { market_data (passthrough), news_alerts, news_count, fetch_time }
```

Queries Finnhub general news endpoint. Scans last 50 headlines for keyword matches. Keywords: hormuz, strait, iran, nuclear, ceasefire, margin call, circuit breaker, force majeure, default, fed rate, emergency meeting, black swan, oil embargo, opec emergency, strategic reserve. One alert per headline. Finnhub failure: skip news, continue with empty alerts array.

### Node 6: Threshold Engine
```
Type: Code (JavaScript)
Name: Threshold Engine
Input: Node 5 output
Output: { escalation, yellow_triggers, red_triggers, yellow_count, red_count, kill_switch_warning, market_data, news_alerts, timestamp }
```

Evaluates all YELLOW and RED thresholds against market_data. Checks multi-signal correlation (3+ yellows = RED). Evaluates Kill Switch pre-alert conditions. Outputs final escalation level: GREEN, YELLOW, or RED.

### Node 7: Report Builder
```
Type: Code (JavaScript)
Name: Overnight Report Builder
Input: Node 6 output
Output: { telegram_message (HTML), escalation, timestamp, market_data, triggers, news_alerts, kill_switch_warning }
```

Builds HTML-formatted Telegram message. Structure: emoji header → escalation level → market snapshot table (10 key assets with arrows and % change) → yellow trigger list → red trigger list → news alerts (max 5) → kill switch warning if applicable.

### Node 8: Escalation Router
```
Type: IF
Name: Escalation Router
Condition: {{ $json.escalation }} is not equal to "GREEN"
TRUE path → Node 9 (Telegram)
FALSE path → Node 13 (Logger)
```

### Node 9: Gabriel Alert — Telegram
```
Type: Telegram
Name: Gabriel Alert
Credential: Telegram account (same as SENTINEL)
Chat ID: 8203545338
Text: {{ $json.telegram_message }}
Parse Mode: HTML
Additional Fields: Disable Web Page Preview: true
```

### Node 10: RED Escalation Check
```
Type: IF
Name: RED Escalation
Condition: {{ $json.escalation }} equals "RED"
TRUE path → Node 11 (Email) AND Node 12 (CIL)
FALSE path → Node 13 (Logger)
```

### Node 11: RED Alert Email
```
Type: Gmail
Name: RED Alert Email
Credential: Gmail — Platform (ashes2echoes.platform@gmail.com)
To: ashes2echoes.platform@gmail.com
Subject: 🚨 GABRIEL RED ALERT — {{ $json.timestamp }}
Body: {{ $json.telegram_message }}
```

### Node 12: CIL Analysis Request
```
Type: HTTP Request
Name: CIL Webhook — RED Analysis
Method: POST
URL: [CIL v5.2.1 webhook URL — pull from SENTINEL credential set]
Content-Type: application/json
Body:
{
  "query": "GABRIEL RED ALERT overnight. Triggers: {{ $json.red_triggers }}. Market data: {{ $json.market_data }}. Analyze conditions and recommend market open posture.",
  "domain": "MARKET",
  "urgency": "HIGH",
  "source": "GABRIEL_OVERNIGHT"
}
Note: Only fires on RED. Triggers full 5-agent CIL consensus.
```

### Node 13: Gabriel Logger — Supabase
```
Type: Code (JavaScript)
Name: Gabriel Logger
Input: merged output from all paths
Output: { log confirmation }
```

Posts to Supabase gabriel_overnight_log table. Fields: UUID, escalation, yellow_count, red_count, news_count, kill_switch_warning, market_snapshot (JSONB), timestamp.

### Node 14: Morning Brief Schedule
```
Type: Schedule Trigger
Name: Morning Brief Trigger
Time: 12:00 UTC (8:00 AM ET)
Days: Monday through Friday
Independent chain — does not connect to Nodes 1-13
```

### Node 15: Morning Brief Builder
```
Type: Code (JavaScript)
Name: Morning Brief
```

Queries Supabase for last 12 hours of gabriel_overnight_log entries. Synthesizes overnight activity into structured report: total run count, escalation distribution (GREEN/YELLOW/RED counts), peak alert time, top triggered conditions, news hits summary, pre-market futures snapshot (fresh Yahoo Finance fetch), recommended market posture (RISK-ON / NEUTRAL / RISK-OFF based on overnight data), stop adjustment flags. Formats as HTML Telegram message.

### Node 16: GitHub Archive
```
Type: HTTP Request
Name: GitHub Archive
Method: PUT
URL: https://api.github.com/repos/Barefootservants2/AIORA/contents/GABRIEL/overnight/{{ $json.timestamp.substring(0,10) }}.json
Headers:
  Authorization: token [GITHUB_PAT — load from n8n credentials]
  Content-Type: application/json
Body: SHA-aware PUT (check for existing file first)
Note: Archives each day's GABRIEL log to AIORA repo. Daily rollup, not per-run.
```

### Node 17: Morning Brief Delivery — Telegram
```
Type: Telegram
Name: Morning Brief Delivery
Credential: Telegram account (same as SENTINEL)
Chat ID: 8203545338
Text: {{ $json.morning_brief_message }}
Parse Mode: HTML
```

---

## SUPABASE SETUP

Run this SQL in Supabase before first workflow execution:

```sql
CREATE TABLE gabriel_overnight_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escalation TEXT NOT NULL DEFAULT 'GREEN',
  yellow_count INTEGER DEFAULT 0,
  red_count INTEGER DEFAULT 0,
  news_count INTEGER DEFAULT 0,
  kill_switch_warning BOOLEAN DEFAULT FALSE,
  market_snapshot JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gabriel_timestamp ON gabriel_overnight_log(timestamp DESC);
CREATE INDEX idx_gabriel_escalation ON gabriel_overnight_log(escalation);
CREATE INDEX idx_gabriel_kill_switch ON gabriel_overnight_log(kill_switch_warning) WHERE kill_switch_warning = TRUE;
```

Supabase project: bwtguoaakkmsnzomswem (same as SENTINEL)

---

## CREDENTIALS CHECKLIST

| Credential | n8n Name | Status | Notes |
|-----------|----------|--------|-------|
| Telegram Bot | Telegram account | ✅ READY | hunter_a2e_bot — same as SENTINEL |
| Gmail | Gmail — Platform | ✅ READY | ashes2echoes.platform@gmail.com |
| Finnhub | HUNTER H30 | ✅ READY | Already in n8n from HUNTER build |
| Yahoo Finance | None required | ✅ NO AUTH | Free endpoint |
| Supabase | Supabase (same as SENTINEL) | ✅ READY | bwtguoaakkmsnzomswem |
| GitHub PAT | GitHub token | ✅ READY | [GITHUB_PAT — load from n8n credentials] |
| Twilio (SMS) | Not configured | ⏳ v3.0 | Sign up when needed |
| E*TRADE API | Not in v2.0 scope | ⏳ v3.0 | Auto-execution deferred |

---

## WHAT GABRIEL v2.0 DOES NOT DO (SCOPE BOUNDARIES)

These are explicitly out of scope for v2.0 and deferred to future versions:

| Feature | Version | Reason |
|---------|---------|--------|
| Auto-cancel existing stops | v3.0 | Requires E*TRADE integration + safety testing |
| Auto-place new stops | v3.0 | Same — crawl/walk/run approach |
| SMS via Twilio | v2.1 | Twilio account setup pending |
| Position-level P&L overnight | v3.0 | Requires E*TRADE position read overnight |
| Shanghai premium monitoring | v2.1 | API access TBD |
| CME margin change detection | v2.1 | RSS/API research needed |

---

## BUILD ORDER (RECOMMENDED)

Phase A — Core alert system (build session 1, ~2 hours):
1. Nodes 1-3: Triggers
2. Node 4: Market Data Collector — test with manual trigger, verify all 15 symbols return data
3. Node 6: Threshold Engine — test with hardcoded values, verify GREEN/YELLOW/RED logic
4. Node 7: Report Builder — test message format in Telegram
5. Nodes 8-9: Escalation Router → Telegram

Phase B — Logging + RED path (build session 1 continued):
6. Node 13: Supabase Logger — verify gabriel_overnight_log table writes
7. Nodes 10-11: RED check + Email
8. Node 5: News Scanner — add last, easiest to test separately

Phase C — Morning Brief + Archive (build session 2, ~1.5 hours):
9. Node 14-15: Morning Brief Schedule + Builder
10. Node 17: Morning Brief Delivery
11. Node 12: CIL Webhook (test with CIL v5.2.1 webhook URL)
12. Node 16: GitHub Archive

---

## KNOWN BUGS TO PREVENT (LESSONS FROM SENTINEL BUILD)

| Bug | Prevention |
|-----|-----------|
| Zombie nodes (alwaysOutputData) | Set alwaysOutputData: false on ALL HTTP Request nodes |
| Double query params | Build URL as single string, not base URL + params fields |
| SHA-less GitHub PUT | Always GET file first to retrieve current SHA before PUT |
| Silent failures in Code nodes | Wrap every httpRequest in try/catch, return partial data not throw |
| Telegram HTML parse errors | Escape < > & in dynamic content, test message format before activating |
| Supabase 400 errors | Verify table schema matches insert payload exactly |

---

## RELATIONSHIP TO METATRON v10.7

Under METATRON v10.7 protocol, GABRIEL operates as the overnight enforcement layer for:

- **Gate 9 Correlation** (H37-DXY, H38-YIELD, H39-FLOW): GABRIEL monitors DXY+yield proxies overnight, pre-alerts if Kill Switch conditions form before SENTINEL can see them
- **IRONCLAD v2.0 VIX Matrix**: Overnight VIX moves inform stop width adjustments that SENTINEL applies at market open
- **PHOENIX Protocol**: Morning Brief output feeds directly into session initialization — MICHA reads overnight GABRIEL data as part of every session startup

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | March 3, 2026 | Initial specification written night of $7,619 loss |
| v1.1 | March 25, 2026 | Full build thesis added, 15-node architecture, code written |
| v2.0 | March 26, 2026 | Finalized 17-node architecture, n8n JSON produced, GitHub push |

---

## NEXT VERSION ROADMAP

| Version | Key Features |
|---------|-------------|
| v2.1 | Twilio SMS for RED, Shanghai premium monitor, CME margin RSS |
| v3.0 | E*TRADE position reads overnight, auto-stop widening on Level 3, position-level P&L |
| v4.0 | HUNTER overnight integration, institutional filing scanner, earnings surprise pre-alerts |

---

*GABRIEL OVERNIGHT WATCH v2.0*  
*Ashes2Echoes LLC | Uriel Covenant AI Collective*  
*Document: A2E_Protocols/GABRIEL/OVERNIGHT_WATCH_SPEC_v2.0.md*  
*n8n Workflow: AIORA/GABRIEL/GABRIEL_OVERNIGHT_WATCH_v2.0.json*


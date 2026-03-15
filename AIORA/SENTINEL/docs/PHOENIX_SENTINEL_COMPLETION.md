# PHOENIX CARRY-FORWARD: SENTINEL COMPLETION
## Real-Time Monitoring & Alert System — Session Handoff Document
### Date: March 15, 2026 | Author: MICHA | Protocol: METATRON v10.7

---

## 1. CURRENT STATUS

**SENTINEL: 45 nodes on n8n canvas. Architecture complete. Zero credentials wired.**

The entire SENTINEL workflow was built on March 13-14, 2026 in a marathon session. Every node exists, every connection is made, but no external service credentials have been configured. The workflow cannot execute until credentials are wired.

**What remains: Credential wiring (4 tiers), TEST_MODE validation, then production activation.**

---

## 2. WHAT SENTINEL DOES

SENTINEL is the Collective's autonomous monitoring system. It runs 24/7 on n8n, watches markets, positions, events, whale filings, and news, then routes alerts by severity to the Principal via Telegram, SMS, email, or phone call.

**Core modules:**
- **SENTINEL-CALENDAR:** Economic event calendar monitor (every 6 hours)
- **SENTINEL-WHALE:** SEC EDGAR filing tracker for tracked whales (25+ entities)
- **SENTINEL-PRICE:** Position monitoring with stop-loss tracking (every 5 minutes during market hours)
- **SENTINEL-NEWS:** Breaking news scanner with headline analysis
- **SENTINEL-DIGEST:** Daily briefing generator (6 AM / 6 PM ET)
- **KILLALL:** Emergency position liquidation system (requires E*TRADE OAuth — BLOCKED)

**Alert routing by severity:**
- CRITICAL: Phone + SMS + Telegram (Twilio voice + SMS + bot)
- HIGH: SMS + Telegram
- MEDIUM: Telegram only
- LOW: Daily digest email

---

## 3. CREDENTIAL WIRING — 4 TIERS

### TIER 1: Already Have Keys — Just Wire Them (10 minutes)

These credentials already exist in n8n from CIL and other workflows. Just select them from the dropdown in each SENTINEL node.

| Credential | n8n Type | Already In n8n | Used By Nodes |
|---|---|---|---|
| Telegram Bot | Telegram API | YES — Bot: hunter_a2e_bot, Token: 8277230584:AAFpDp... | All alert delivery nodes, KILLALL alert |
| Telegram Chat ID | Hardcoded value | YES — `8203545338` | Every Telegram Send Message node |
| GitHub PAT | Header Auth | YES — [REDACTED - see n8n credentials] | Alert logging, audit trail push |
| Finnhub | Header Auth | YES | SENTINEL-CALENDAR, SENTINEL-WHALE, SENTINEL-PRICE |
| NewsAPI | Header Auth | YES | SENTINEL-NEWS |
| OpenAI | OpenAI API | YES | News headline analysis, digest generation |

**Action:** Open each SENTINEL node that shows a red credential warning. Click the credential dropdown. Select the existing credential. Save. Repeat for all nodes in this tier.

### TIER 2: Free Signups Required (20 minutes)

| Service | Signup URL | Cost | Purpose in SENTINEL |
|---|---|---|---|
| Healthchecks.io | https://healthchecks.io | Free (20 checks) | Heartbeat monitoring — if SENTINEL stops running, Healthchecks alerts you |
| Supabase | https://supabase.com | Free tier | Alert history database, position tracking, event log persistence |

**Healthchecks.io setup:**
1. Create account at healthchecks.io
2. Create a new check named "SENTINEL-HEARTBEAT"
3. Set period to 15 minutes, grace to 10 minutes
4. Copy the ping URL (looks like: https://hc-ping.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
5. In n8n, add this URL to the SENTINEL heartbeat HTTP Request node
6. Set up notification channels in Healthchecks.io (email, Telegram, etc.)

**Supabase setup:**
1. Create project at supabase.com
2. Note the Project URL and anon/service_role key
3. Create tables (SQL below in Section 7)
4. In n8n, create Supabase credential with URL + API key
5. Wire to all database insert nodes in SENTINEL

**NOTE:** A Supabase credential already exists in n8n from prior work. Check if it's still valid before creating a new one. If valid, just create the SENTINEL-specific tables.

### TIER 3: Google Sheets Setup (15 minutes)

| Service | Setup Method | Cost | Purpose |
|---|---|---|---|
| Google Sheets | OAuth flow in n8n | Free | HUNTER data storage, position tracking backup, whale filing log |

**Setup:**
1. In n8n: Settings → Credentials → Add New → Google Sheets OAuth2
2. Follow the OAuth flow (will open Google login)
3. Grant access to Google Sheets
4. Create a new Google Sheet named "SENTINEL_DATA"
5. Create tabs: Alerts, Positions, Events, Whale_Filings, Daily_Digest
6. Wire the credential to all Google Sheets nodes in SENTINEL

### TIER 4: Twilio Signup (10 minutes)

| Service | Signup URL | Cost | Purpose |
|---|---|---|---|
| Twilio | https://console.twilio.com | Pay per use (~$0.01/SMS, ~$0.02/min voice) | SMS and phone call alerts for CRITICAL severity |

**Setup:**
1. Create account at console.twilio.com
2. Get a phone number (free trial includes one)
3. Note: Account SID, Auth Token, From number
4. In n8n: Create Twilio credential with SID + Auth Token
5. Wire to SMS and Voice call nodes
6. Set "To" number to Principal's phone

**Twilio node config:**
```
Account SID: [from Twilio console]
Auth Token: [from Twilio console]  
From: +1XXXXXXXXXX (your Twilio number)
To: +1[Principal's phone number]
```

---

## 4. SENTINEL NODE INVENTORY (45 Nodes)

### Triggers & Scheduling
1. SCHEDULE TRIGGER — CALENDAR (Cron: every 6 hours)
2. SCHEDULE TRIGGER — PRICE (Cron: every 5 min, market hours only 9:30-4:00 ET)
3. SCHEDULE TRIGGER — WHALE (Cron: every 30 minutes during market hours)
4. SCHEDULE TRIGGER — NEWS (Cron: every 15 minutes)
5. SCHEDULE TRIGGER — DIGEST (Cron: 6:00 AM and 6:00 PM ET)
6. WEBHOOK — KILLALL (manual trigger endpoint)

### SENTINEL-CALENDAR Module
7. Fetch Finnhub Calendar (HTTP Request — Finnhub economic calendar API)
8. Calendar Event Filter (Code node — filter Tier 1-3 events, next 48 hours)
9. Calendar Alert Router (If node — severity classification)
10. Calendar Telegram (Telegram — HIGH/MEDIUM alerts)
11. Calendar Digest Queue (Set node — stores for daily digest)

### SENTINEL-WHALE Module
12. Fetch SEC EDGAR RSS (HTTP Request — SEC EDGAR full-text search)
13. Whale Filter (Code node — match against tracked whale list)
14. Whale Dedup Check (Code node — compare against Supabase history)
15. Whale Alert Router (If node — new filing = HIGH, amendment = MEDIUM)
16. Whale Telegram (Telegram)
17. Whale DB Insert (Supabase — log filing)

### SENTINEL-PRICE Module
18. Fetch Finnhub Quotes (HTTP Request — batch quote for all positions)
19. Position Config (Set node — hardcoded positions, stops, cost basis)
20. Price Engine (Code node — P/L calc, stop distance, tier assessment)
21. Stop Alert Check (If node — within 2% of stop = HIGH, breached = CRITICAL)
22. Price Telegram (Telegram — stop alerts)
23. Price SMS (Twilio — CRITICAL only, stop breached)
24. Position DB Update (Supabase — update position tracking)

### SENTINEL-NEWS Module
25. Fetch NewsAPI Headlines (HTTP Request — top business headlines)
26. News Relevance Filter (Code node — keyword match against watchlist + thesis terms)
27. News AI Analysis (OpenAI — headline sentiment and impact scoring)
28. News Alert Router (If node — severity based on AI score)
29. News Telegram (Telegram)
30. News DB Insert (Supabase — log headlines)

### SENTINEL-DIGEST Module
31. Aggregate Digest Data (Code node — pull from all module queues)
32. Digest Formatter (Code node — build formatted daily briefing)
33. Digest Telegram (Telegram — morning/evening summary)
34. Digest Email (Email — backup delivery)
35. Digest DB Archive (Supabase — archive digest)

### KILLALL System
36. KILLALL Webhook Receiver
37. KILLALL Auth Check (Code node — verify Principal authorization)
38. KILLALL Position Reader (HTTP Request — E*TRADE API, BLOCKED)
39. KILLALL Order Builder (Code node — market sell all positions)
40. KILLALL Execute (HTTP Request — E*TRADE API, BLOCKED)
41. KILLALL Confirmation (Telegram — report execution results)
42. KILLALL Audit Log (GitHub push — permanent record)

### Infrastructure
43. Heartbeat Ping (HTTP Request — Healthchecks.io ping URL)
44. Error Handler (Code node — global error catch)
45. Error Alert (Telegram — system errors)

---

## 5. TRACKED WHALES (25+ Entities)

Whale list hardcoded in WHALE FILTER node:

Eric Sprott, Sprott Inc, Sprott Asset Management, Bridgewater Associates, Renaissance Technologies, Citadel LLC, Millennium Management, Point72, Berkshire Hathaway, Pershing Square Capital, Third Point LLC, Elliott Management, Icahn Enterprises, ARK Invest, Tiger Global, Soros Fund Management, Appaloosa Management (Tepper), Greenlight Capital (Einhorn), Baupost Group (Klarman), Two Sigma, D.E. Shaw, AQR Capital, Man Group, Coatue Management, Lone Pine Capital

**Key filers to watch (per HUNTER DRIFT FIX):** Sprott, Buffett, Druckenmiller, Burry, Ackman, Dalio — these get mandatory H4/H17/H22 filing check on every MARKET WATCH scan.

---

## 6. POSITION CONFIG — CURRENT PORTFOLIO STATE (as of 03/14)

**Combined total: ~$368K. Cash: ~$111K (30%+).**

All metals positions (SLVR, PSLV 4898, COPX 6685) stopped out 03/13. Wash sale restricted until 04/13.

Position Config node needs updating with current holdings. At minimum:
- VOO (needs 6.5% trailing stop, set Monday during market hours)
- Any remaining positions across 4898, 5267, Roth, 6685 accounts

**Account IDs:**
- 4898: Primary taxable
- 5267: Secondary
- Roth IRA
- 6685: Active trading

---

## 7. SUPABASE TABLE SCHEMAS

Run these SQL statements in Supabase SQL Editor after project creation:

```sql
-- Alert history
CREATE TABLE sentinel_alerts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  module TEXT NOT NULL,  -- CALENDAR, WHALE, PRICE, NEWS
  severity TEXT NOT NULL,  -- CRITICAL, HIGH, MEDIUM, LOW
  ticker TEXT,
  headline TEXT NOT NULL,
  details JSONB,
  delivered_via TEXT[],  -- ['telegram', 'sms', 'email']
  acknowledged BOOLEAN DEFAULT FALSE
);

-- Position tracking
CREATE TABLE sentinel_positions (
  id BIGSERIAL PRIMARY KEY,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  account TEXT NOT NULL,
  ticker TEXT NOT NULL,
  shares NUMERIC,
  cost_basis NUMERIC,
  current_price NUMERIC,
  stop_loss NUMERIC,
  pnl_dollars NUMERIC,
  pnl_percent NUMERIC,
  distance_to_stop NUMERIC,
  tier TEXT  -- Ring 1-5
);

-- Whale filing log
CREATE TABLE sentinel_whale_filings (
  id BIGSERIAL PRIMARY KEY,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  filer TEXT NOT NULL,
  filing_type TEXT,  -- 13F, SC13D, SC13G, Form 4
  ticker TEXT,
  shares_changed NUMERIC,
  filing_url TEXT,
  sec_accession TEXT UNIQUE  -- dedup key
);

-- Economic events
CREATE TABLE sentinel_events (
  id BIGSERIAL PRIMARY KEY,
  event_date TIMESTAMPTZ,
  event_name TEXT NOT NULL,
  country TEXT,
  impact_tier INTEGER,  -- 1=highest, 3=lowest
  actual TEXT,
  forecast TEXT,
  previous TEXT,
  alerted BOOLEAN DEFAULT FALSE
);

-- Daily digest archive
CREATE TABLE sentinel_digests (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  digest_type TEXT,  -- MORNING, EVENING
  content TEXT,
  modules_included TEXT[]
);

-- Heartbeat log
CREATE TABLE sentinel_heartbeat (
  id BIGSERIAL PRIMARY KEY,
  pinged_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'OK',
  modules_active TEXT[]
);
```

---

## 8. TEST_MODE VALIDATION

Before going production, SENTINEL must be tested with mock data.

**TEST_MODE is active with mock data from 03/13 close.**

Test procedure:
1. Wire Tier 1 credentials (Telegram + GitHub)
2. Set TEST_MODE = true in each module's config node
3. Execute each module individually:
   - CALENDAR: Should generate event alerts from mock calendar data
   - PRICE: Should calculate P/L and stop distances from mock quotes
   - WHALE: Should detect mock filing and send Telegram alert
   - NEWS: Should filter and score mock headlines
   - DIGEST: Should aggregate mock data into formatted briefing
4. Verify all Telegram messages arrive with "[TEST]" prefix
5. After all 5 modules pass: Set TEST_MODE = false, activate production schedules

---

## 9. KILLALL SYSTEM — E*TRADE BLOCKER

**KILLALL nodes 38-40 are built but CANNOT function without E*TRADE OAuth.**

E*TRADE OAuth 1.0a is the single biggest infrastructure blocker across the entire Collective. It blocks:
- KILLALL automated execution
- Live portfolio reads
- Automated stop-loss execution
- Position Config auto-population

**Current workaround:** KILLALL triggers Telegram alert only. Principal must manually execute sells on E*TRADE app/website.

**E*TRADE OAuth status:**
- Consumer key + secret: HAVE (in etrade_test.py on GitHub)
- OAuth flow code: BUILT (etrade-oauth-debug repo)
- n8n integration: NOT DONE (requires JavaScript OAuth 1.0a implementation as n8n Code node)
- Account IDs: MAPPED (4898, 5267, Roth, 6685)

**When E*TRADE OAuth is solved:** Wire nodes 38-40 with the authenticated HTTP calls. Test in sandbox first. NEVER go live without sandbox validation.

---

## 10. SENTINEL STACK v1.0 — ADDITIONAL LAYERS (NOT YET ON CANVAS)

These were designed in February but not yet built as n8n nodes:

### Layer 1: Reddit DD Scanner (H24-A through H24-E)
- Reddit OAuth app required (reddit.com/prefs/apps → create script app)
- Monitors r/wallstreetbets, r/stocks, r/investing, r/options for DD posts
- Haiku scores DD quality (cost: ~$0.003/post)
- Velocity tracking with z-score anomaly detection against 7-day baseline
- Alert when mention velocity exceeds 2σ

### Layer 2: Social Sentiment Velocity (H16b-A, H16b-B)
- Uses Finnhub social sentiment endpoint
- Tracks sentiment momentum, not absolute level
- Fires when 24h delta exceeds threshold

### Layer 3: Gamma Exposure Monitor (H13b-A through H13b-C)
- Uses Unusual Whales or Barchart for options flow data
- Detects dealer gamma flip zones
- 4PM gamma reset cycle is core mechanic
- SpotGamma for premium GEX data (paid, defer until validated)

### Convergence Engine: SENTINEL-AGG + SENTINEL-NOTIFY
- When 2+ of the 3 layers fire on the same ticker = priority alert
- This is the "your friend on Reddit" automation

**Build order:** The 45-node core SENTINEL must be validated first. These layers are Phase 2.

---

## 11. RELATED PROTOCOLS & DEPENDENCIES

| Protocol | Version | Relevance to SENTINEL |
|---|---|---|
| METATRON | v10.7 | 30 gates including Gate 9 Correlation — SENTINEL feeds gate data |
| IRONCLAD | v2.0 | Risk rules — SENTINEL enforces stop-loss monitoring |
| HUNTER | v2.0 | Market scanning — SENTINEL monitors what HUNTER finds |
| CIL | v5.2.1 | Collective analysis — SENTINEL can trigger CIL runs on alert events |
| PHOENIX | v10.2 | Session management — carries SENTINEL state across sessions |
| GABRIEL | v1.0 | Overnight watch spec — SENTINEL replaces manual Gabriel monitoring |

---

## 12. LOCATION OF ASSETS

| Asset | Location |
|---|---|
| SENTINEL workflow | n8n Cloud: ashes2echoes.app.n8n.cloud |
| SENTINEL specs | GitHub: Barefootservants2/A2E_Protocols → AIORA/n8n_workflows/sentinel/ |
| SENTINEL STACK v1.0 spec | GitHub: AIORA/SENTINEL/ (3-layer design doc) |
| API Registry | GitHub: AIORA/n8n_workflows/sentinel/docs/API_REGISTRY.md |
| Deployment Guide | GitHub: AIORA/n8n_workflows/sentinel/docs/DEPLOYMENT_GUIDE.md |
| Database Schema | GitHub: AIORA/n8n_workflows/sentinel/docs/SENTINEL_DATABASE_SCHEMA.sql |
| E*TRADE OAuth debug | GitHub: Barefootservants2/etrade-oauth-debug |
| E*TRADE Python script | GitHub: AIORA/scripts/etrade_test.py |

---

## 13. WIRING PRIORITY SEQUENCE

| Step | Task | Time Est | Prerequisite |
|---|---|---|---|
| 1 | Wire Tier 1 credentials (Telegram, GitHub, Finnhub, NewsAPI, OpenAI) | 10 min | None — keys exist |
| 2 | Verify Supabase credential still valid in n8n | 2 min | None |
| 3 | Sign up Healthchecks.io, create SENTINEL-HEARTBEAT check | 5 min | None |
| 4 | Create Supabase tables (run SQL from Section 7) | 5 min | Supabase access |
| 5 | Wire Tier 2 credentials (Healthchecks, Supabase) | 5 min | Steps 2-4 |
| 6 | Set up Google Sheets OAuth in n8n | 10 min | Google account |
| 7 | Create SENTINEL_DATA spreadsheet with tabs | 5 min | Step 6 |
| 8 | Wire Tier 3 credentials (Google Sheets) | 5 min | Step 7 |
| 9 | Sign up Twilio, get phone number | 10 min | None |
| 10 | Wire Tier 4 credentials (Twilio SMS + Voice) | 5 min | Step 9 |
| 11 | Run TEST_MODE validation (all 5 modules) | 20 min | Steps 1-10 |
| 12 | Fix any failures found in TEST_MODE | Variable | Step 11 |
| 13 | Update Position Config with current holdings | 10 min | Current portfolio state |
| 14 | Activate production schedules | 5 min | Step 12 passes |
| 15 | Monitor for 48 hours, tune alert thresholds | Ongoing | Step 14 |

**Total estimated wiring time: ~90 minutes of active work.**

---

## 14. AI BUILD CREDITS WARNING

**28 AI Build credits remaining as of March 14.**

n8n AI Build credits are consumed when using the AI assistant to build/modify nodes. Do NOT burn credits on credential updates — those are manual clicks. Save credits for actual node logic changes or new node creation.

---

## 15. SESSION RESTART PROMPT

```
MICHA — SENTINEL COMPLETION SESSION

Date: [TODAY]
Reference: PHOENIX_SENTINEL_COMPLETION.md

SENTINEL: 45 nodes on canvas. Architecture complete. ZERO credentials wired.

WIRING SEQUENCE:
1. Tier 1 (10 min): Select existing creds — Telegram, GitHub, Finnhub, NewsAPI, OpenAI
2. Tier 2 (15 min): Verify Supabase, sign up Healthchecks.io, create DB tables
3. Tier 3 (15 min): Google Sheets OAuth in n8n, create SENTINEL_DATA sheet
4. Tier 4 (15 min): Sign up Twilio, wire SMS + Voice nodes
5. TEST_MODE validation (20 min): Run all 5 modules with mock data
6. Production activation

BLOCKERS:
- E*TRADE OAuth (KILLALL nodes 38-40 stay alert-only until solved)
- 28 AI Build credits remaining — do NOT burn on credential clicks

PORTFOLIO STATE (03/14):
- ~$368K combined, ~$111K cash (30%+)
- All metals stopped out 03/13. Wash sale until 04/13.
- VOO needs 6.5% trailing stop (set Monday market hours)

After SENTINEL is live: Move to SENTINEL Stack Layer 1 (Reddit DD Scanner).
```

---

*MICHA — CIO, Uriel Covenant | Ashes2Echoes, LLC*
*METATRON v10.7 | PHOENIX PROTOCOL*

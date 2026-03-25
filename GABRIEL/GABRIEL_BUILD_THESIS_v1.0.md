# GABRIEL OVERNIGHT WATCH — FULL BUILD THESIS
## n8n Workflow Specification + Platform Architecture
## March 25, 2026 | MICHA CIO | Uriel Covenant

---

# PART I: THE END GAME

## What Are We Building

Three autonomous systems that together create a self-sustaining market intelligence and risk management platform that operates 24/7/365 with zero unmonitored gaps.

### SENTINEL (DONE — 90%)
**Mission:** Real-time portfolio risk management during market hours (9:30 AM — 4:00 PM ET)

What it does: Monitors all 26 positions across 3 E*TRADE accounts. Applies IRONCLAD v2.1 stop/trim rules. VIX-scaled risk thresholds. Gate 9 Correlation (DXY + yields + oil). Kill Switch. Compliance checks. Telegram/email/SMS escalation.

What it prevents: Another March 3 ($7,619 silver gap-down) by catching stop breaches within 5 minutes of occurrence and alerting via Telegram before you can even open Power E*TRADE.

Status: 58 nodes, 8 triggers, live E*TRADE data, Yahoo Finance market context, Supabase logging, GitHub snapshots, Google Sheets reporting. All confirmed working tonight.

Remaining: Token renewal automation, cost basis verification at market open, Cowork local script.

### GABRIEL (NEXT BUILD)
**Mission:** Overnight and off-hours market surveillance (6:00 PM — 9:25 AM ET)

What it does: Monitors futures, oil, VIX, crypto, geopolitical news, and institutional flow while you sleep. Three escalation levels. Fires CIL collective analysis when trigger conditions are met. Pre-market morning brief at 8:00 AM ET.

What it prevents: Getting blindsided at 9:30 AM by something that happened at 3 AM. The Strait of Hormuz closure, oil spikes, overnight margin calls, foreign exchange moves, central bank surprises — all caught and escalated before you wake up.

Status: Specification exists (v1.0 on GitHub). Three legacy workflows on GitHub (EMAIL_ARCHIVE_v2, MARKET_WATCH_v7.3, MONTHLY_EMAIL_ARCHIVE). Zero automation running overnight. This is the 73% coverage gap.

### FORGE (PARALLEL)
**Mission:** Prompt engineering quality control system for the Collective

What it does: ANVIL scores prompt quality before submission. ASSAY validates output quality after response. FORGE is the interactive wizard that builds the prompt with the user. Together they create a closed-loop quality system that no other framework in the market offers.

What it prevents: Bad prompts producing bad intelligence. Drift in agent outputs. Inconsistent quality across the Collective. It's the calibration system for every query that flows through CIL.

Status: FORGE v10.0 "Archangel Edition" specification complete. ANVIL + ASSAY frameworks defined. Competitive landscape documented. Test harness designed (50 prompts, 5 tiers). Not deployed as an interactive tool yet.

## How They Wire Together

```
 6PM                    OVERNIGHT                    9:25AM   9:30AM                    MARKET HOURS                    4PM
  |                                                    |        |                                                      |
  |◄──────────────── GABRIEL ────────────────────────►|        |◄─────────────────── SENTINEL ──────────────────────►|
  |                                                    |        |                                                      |
  | Futures monitor                                    |        | 8 scheduled triggers                                 |
  | Oil/energy watch                                   |        | 26 positions, 3 accounts                             |
  | VIX futures                                        |        | IRONCLAD stops/trims                                 |
  | Crypto (IBIT proxy)                                |        | Gate 9 Correlation                                   |
  | News/geopolitical                                  |        | Kill Switch                                          |
  | Institutional flow                                 |        | Compliance audit                                     |
  |                                                    |        |                                                      |
  | IF trigger hit ──► CIL collective analysis         |        |                                                      |
  | IF RED ──► SMS + auto-generate IRONCLAD orders     |        |                                                      |
  |                                                    |        |                                                      |
  | 8:00 AM: MORNING BRIEF ──────────────────────────►|        |                                                      |
  |   Overnight summary                                |        |                                                      |
  |   Pre-market movers                                |        |                                                      |
  |   Recommended posture                              |        |                                                      |
  |   Stop adjustments needed                          |        |                                                      |
  |                                                    |        |                                                      |
                                                                                                                        
                        ┌──────────┐
                        │  FORGE   │ ◄── Shapes every query to CIL
                        │ ANVIL +  │     Validates every output
                        │  ASSAY   │     Calibrates agent quality
                        └──────────┘
                             │
                        ┌──────────┐
                        │   CIL    │ ◄── 5 agents, 9 gates, PASS2 synthesis
                        │ v5.2.1   │     Domain-agnostic consensus engine
                        └──────────┘
                             │
                    ┌────────┼────────┐
                    │        │        │
               SENTINEL  GABRIEL  HUNTER
               (defense) (offense) (recon)
```

The platform operates on a military intelligence model:
- HUNTER is reconnaissance — it scans the battlefield
- SENTINEL is defense — it protects what you hold
- GABRIEL is the watch commander — it never sleeps
- CIL is the command center — it synthesizes all intel
- FORGE is the training ground — it ensures quality of all communications
- METATRON is the protocol — the rules of engagement
- IRONCLAD is the armor — the risk framework
- PHOENIX is continuity — the session handoff system

---

# PART II: GABRIEL BUILD THESIS

## Architecture

```
GABRIEL OVERNIGHT WATCH — n8n Workflow Architecture
═══════════════════════════════════════════════════

TRIGGER LAYER (3 triggers)
├── Overnight Schedule (every 30 min, 6PM-9:25AM ET M-F)
├── Weekend Schedule (every 2 hours, Fri 6PM - Sun 6PM)
└── Manual Trigger (on-demand)

DATA COLLECTION LAYER (6 data sources)
├── Yahoo Finance v8 — Futures (ES, NQ, YM, RTY)
├── Yahoo Finance v8 — Commodities (GC=F, SI=F, CL=F)
├── Yahoo Finance v8 — VIX futures (^VIX)
├── Yahoo Finance v8 — Crypto (BTC-USD, ETH-USD)
├── Yahoo Finance v8 — DXY proxy (UUP), Yields (TLT)
└── NewsAPI / Finnhub — Geopolitical keywords

ANALYSIS LAYER (4 engines)
├── Threshold Engine — Compare vs configurable trigger levels
├── Change Detector — % change from last check vs thresholds
├── Pattern Matcher — Multi-signal correlation
└── CIL Webhook (conditional) — Fire collective analysis on RED

ESCALATION LAYER (3 levels)
├── GREEN — Log to Supabase + GitHub. No alert. Market stable.
├── YELLOW — Telegram push notification. Attention needed.
└── RED — Telegram + SMS + Email + Auto-generate IRONCLAD review

OUTPUT LAYER (5 destinations)
├── Telegram — Hunter Alerts bot (8203545338)
├── Email — ashes2echoes.platform@gmail.com
├── SMS — Twilio (when configured)
├── Supabase — gabriel_overnight_log table
├── GitHub — AIORA/GABRIEL/overnight/YYYY-MM-DD.json
└── Google Sheets — Gabriel Overnight tab

MORNING BRIEF (8:00 AM ET trigger)
├── Synthesize all overnight data points
├── Pre-market movers from Yahoo Finance
├── Calculate recommended market posture (RISK-ON/NEUTRAL/RISK-OFF)
├── Flag any stop adjustments needed based on overnight moves
└── Deliver to Telegram as formatted report
```

## Trigger Thresholds

These are the conditions that elevate from GREEN to YELLOW to RED.

### YELLOW Triggers (attention needed)
- S&P 500 futures move > 1% in either direction
- VIX futures > 25 or change > 15% from close
- Oil (CL=F) move > 3%
- Gold futures move > 2%
- Silver futures move > 5%
- DXY move > 0.5%
- BTC move > 5%
- Any HUNTER watchlist filer (Buffett, Druckenmiller, Burry, Ackman, Dalio) files 13F/13D

### RED Triggers (immediate action)
- S&P 500 futures move > 3%
- VIX futures > 35 or change > 30%
- Oil move > 8% (Hormuz-class event)
- Silver futures move > 10% (margin call territory)
- DXY move > 1.5% (correlation kill switch warning)
- Multiple YELLOW triggers firing simultaneously (3+)
- Keywords detected: "Hormuz", "nuclear", "default", "margin call", "circuit breaker", "force majeure"

### Kill Switch Pre-Alert
- If DXY rising AND yields rising AND VIX > 30 — alert that Kill Switch conditions are forming BEFORE market open. Principal can pre-position.

## Node-by-Node Build Specification

### Node 1: Schedule Trigger — Overnight
```
Type: Schedule Trigger
Name: Overnight Watch Trigger
Schedule: Every 30 minutes
Hours: 22:00-13:25 UTC (6PM-9:25AM ET)
Days: Monday-Friday
```

### Node 2: Schedule Trigger — Weekend
```
Type: Schedule Trigger
Name: Weekend Watch Trigger
Schedule: Every 2 hours
Active: Friday 22:00 UTC through Sunday 22:00 UTC
```

### Node 3: Manual Trigger
```
Type: Manual Trigger
Name: Manual Watch
```

### Node 4: Code — Market Data Collector
```
Type: Code (JavaScript)
Name: Overnight Market Data
```

```javascript
// GABRIEL Overnight Market Data Collector
// Fetches futures, commodities, crypto, VIX via Yahoo Finance v8
var symbols = [
  'ES=F',   // S&P 500 futures
  'NQ=F',   // Nasdaq futures
  'YM=F',   // Dow futures
  'RTY=F',  // Russell 2000 futures
  'GC=F',   // Gold futures
  'SI=F',   // Silver futures
  'CL=F',   // Crude oil futures
  '%5EVIX', // VIX
  'BTC-USD', // Bitcoin
  'ETH-USD', // Ethereum
  'UUP',    // Dollar proxy
  'TLT',    // Long bond proxy (inverse yield)
  'DIA',    // Dow ETF (for after-hours)
  'SPY',    // S&P ETF (for after-hours)
  'QQQ'     // Nasdaq ETF (for after-hours)
];

var marketData = {};

for (var i = 0; i < symbols.length; i++) {
  var sym = symbols[i];
  try {
    var chartResp = await this.helpers.httpRequest({
      method: 'GET',
      url: 'https://query1.finance.yahoo.com/v8/finance/chart/' + sym + '?interval=1d&range=2d',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      json: true
    });
    var meta = chartResp.chart.result[0].meta;
    var price = meta.regularMarketPrice || 0;
    var prevClose = meta.chartPreviousClose || 0;
    var changePct = prevClose > 0 ? ((price - prevClose) / prevClose * 100) : 0;
    var cleanSym = meta.symbol.replace('^', '');
    marketData[cleanSym] = {
      lastPrice: price,
      changePercent: Math.round(changePct * 100) / 100,
      previousClose: prevClose
    };
  } catch (e) { /* skip */ }
}

return [{ json: {
  market_data: marketData,
  fetch_time: new Date().toISOString(),
  source: 'YAHOO_FINANCE_V8'
}}];
```

### Node 5: Code — News Scanner
```
Type: Code (JavaScript)
Name: News Scanner
```

```javascript
// GABRIEL News Scanner — keyword detection
// Uses Finnhub (H30) for real-time news
var FINNHUB_KEY = ''; // From HUNTER H30 credential
var keywords = [
  'hormuz', 'strait', 'iran', 'nuclear', 'ceasefire',
  'margin call', 'circuit breaker', 'force majeure', 'default',
  'fed rate', 'emergency meeting', 'black swan',
  'oil embargo', 'opec emergency', 'strategic reserve'
];

var marketData = $input.first().json.market_data;
var alerts = [];

// Check Finnhub general news
try {
  var newsResp = await this.helpers.httpRequest({
    method: 'GET',
    url: 'https://finnhub.io/api/v1/news?category=general&token=' + FINNHUB_KEY,
    json: true
  });
  
  for (var i = 0; i < Math.min(newsResp.length, 50); i++) {
    var headline = (newsResp[i].headline || '').toLowerCase();
    var summary = (newsResp[i].summary || '').toLowerCase();
    var combined = headline + ' ' + summary;
    
    for (var k = 0; k < keywords.length; k++) {
      if (combined.indexOf(keywords[k]) !== -1) {
        alerts.push({
          type: 'NEWS_KEYWORD',
          keyword: keywords[k],
          headline: newsResp[i].headline,
          source: newsResp[i].source,
          url: newsResp[i].url,
          timestamp: new Date(newsResp[i].datetime * 1000).toISOString()
        });
        break; // One alert per headline
      }
    }
  }
} catch (e) {
  // Finnhub unavailable, continue without news
}

return [{ json: {
  market_data: marketData,
  news_alerts: alerts,
  news_count: alerts.length,
  fetch_time: $input.first().json.fetch_time
}}];
```

### Node 6: Code — Threshold Engine
```
Type: Code (JavaScript)
Name: Threshold Engine
```

```javascript
// GABRIEL Threshold Engine — determines escalation level
var input = $input.first().json;
var md = input.market_data;
var newsAlerts = input.news_alerts || [];

var yellowTriggers = [];
var redTriggers = [];

// === YELLOW THRESHOLDS ===
function checkYellow(sym, field, threshold, label) {
  if (md[sym] && Math.abs(md[sym][field]) > threshold) {
    yellowTriggers.push({
      symbol: sym,
      value: md[sym][field],
      threshold: threshold,
      label: label
    });
  }
}

checkYellow('ES=F', 'changePercent', 1, 'S&P futures > 1%');
checkYellow('VIX', 'changePercent', 15, 'VIX change > 15%');
checkYellow('CL=F', 'changePercent', 3, 'Oil > 3%');
checkYellow('GC=F', 'changePercent', 2, 'Gold > 2%');
checkYellow('SI=F', 'changePercent', 5, 'Silver > 5%');
checkYellow('UUP', 'changePercent', 0.5, 'DXY proxy > 0.5%');
checkYellow('BTC-USD', 'changePercent', 5, 'Bitcoin > 5%');

// VIX absolute level
if (md['VIX'] && md['VIX'].lastPrice > 25) {
  yellowTriggers.push({ symbol: 'VIX', value: md['VIX'].lastPrice, threshold: 25, label: 'VIX > 25' });
}

// === RED THRESHOLDS ===
function checkRed(sym, field, threshold, label) {
  if (md[sym] && Math.abs(md[sym][field]) > threshold) {
    redTriggers.push({
      symbol: sym,
      value: md[sym][field],
      threshold: threshold,
      label: label
    });
  }
}

checkRed('ES=F', 'changePercent', 3, 'S&P futures > 3%');
checkRed('CL=F', 'changePercent', 8, 'Oil > 8% (Hormuz-class)');
checkRed('SI=F', 'changePercent', 10, 'Silver > 10% (margin call)');
checkRed('UUP', 'changePercent', 1.5, 'DXY > 1.5% (kill switch warning)');

// VIX absolute RED
if (md['VIX'] && md['VIX'].lastPrice > 35) {
  redTriggers.push({ symbol: 'VIX', value: md['VIX'].lastPrice, threshold: 35, label: 'VIX > 35' });
}

// Multiple yellows = RED
if (yellowTriggers.length >= 3) {
  redTriggers.push({ symbol: 'MULTI', value: yellowTriggers.length, threshold: 3, label: yellowTriggers.length + ' simultaneous yellow triggers' });
}

// News keywords = at least YELLOW, critical keywords = RED
if (newsAlerts.length > 0) {
  yellowTriggers.push({ symbol: 'NEWS', value: newsAlerts.length, threshold: 1, label: newsAlerts.length + ' keyword alerts' });
  var criticalKeywords = ['nuclear', 'circuit breaker', 'force majeure', 'default', 'emergency meeting'];
  for (var n = 0; n < newsAlerts.length; n++) {
    for (var c = 0; c < criticalKeywords.length; c++) {
      if (newsAlerts[n].keyword === criticalKeywords[c]) {
        redTriggers.push({ symbol: 'NEWS_CRITICAL', value: newsAlerts[n].keyword, threshold: 0, label: 'Critical keyword: ' + newsAlerts[n].keyword });
      }
    }
  }
}

// Kill Switch Pre-Alert
var killSwitchWarning = false;
if (md['UUP'] && md['UUP'].changePercent > 0.3 &&
    md['TLT'] && md['TLT'].changePercent < -0.3 &&
    md['VIX'] && md['VIX'].lastPrice > 30) {
  killSwitchWarning = true;
  redTriggers.push({ symbol: 'KILLSWITCH', value: 'DXY+Yields+VIX', threshold: 0, label: 'Kill Switch conditions forming pre-market' });
}

// Determine escalation
var escalation = 'GREEN';
if (yellowTriggers.length > 0) escalation = 'YELLOW';
if (redTriggers.length > 0) escalation = 'RED';

return [{ json: {
  escalation: escalation,
  yellow_triggers: yellowTriggers,
  red_triggers: redTriggers,
  yellow_count: yellowTriggers.length,
  red_count: redTriggers.length,
  kill_switch_warning: killSwitchWarning,
  market_data: md,
  news_alerts: newsAlerts,
  timestamp: new Date().toISOString()
}}];
```

### Node 7: Code — Report Builder
```
Type: Code (JavaScript)
Name: Overnight Report Builder
```

```javascript
// GABRIEL Overnight Report Builder
var input = $input.first().json;
var md = input.market_data;
var escalation = input.escalation;

var emoji = escalation === 'RED' ? '🚨' : (escalation === 'YELLOW' ? '⚠️' : '✅');
var header = emoji + ' <b>GABRIEL OVERNIGHT WATCH</b>\n';
header += '<i>' + new Date().toISOString().split('T')[0] + ' | ' + new Date().toLocaleTimeString('en-US', {timeZone: 'America/New_York'}) + ' ET</i>\n';
header += 'Escalation: <b>' + escalation + '</b>\n\n';

// Market snapshot
var snapshot = '<b>MARKET SNAPSHOT</b>\n';
var displayOrder = ['ES=F','NQ=F','YM=F','VIX','CL=F','GC=F','SI=F','BTC-USD','UUP','TLT'];
var labels = {'ES=F':'S&P Futs','NQ=F':'NQ Futs','YM=F':'Dow Futs','VIX':'VIX','CL=F':'Oil','GC=F':'Gold','SI=F':'Silver','BTC-USD':'BTC','UUP':'DXY(UUP)','TLT':'Bonds(TLT)'};

for (var i = 0; i < displayOrder.length; i++) {
  var sym = displayOrder[i];
  if (md[sym]) {
    var arrow = md[sym].changePercent > 0 ? '▲' : (md[sym].changePercent < 0 ? '▼' : '━');
    snapshot += labels[sym] + ': ' + md[sym].lastPrice.toFixed(2) + ' ' + arrow + ' ' + md[sym].changePercent.toFixed(2) + '%\n';
  }
}

// Triggers
var triggerSection = '';
if (input.red_triggers.length > 0) {
  triggerSection += '\n🚨 <b>RED TRIGGERS</b>\n';
  for (var r = 0; r < input.red_triggers.length; r++) {
    triggerSection += '• ' + input.red_triggers[r].label + '\n';
  }
}
if (input.yellow_triggers.length > 0) {
  triggerSection += '\n⚠️ <b>YELLOW TRIGGERS</b>\n';
  for (var y = 0; y < input.yellow_triggers.length; y++) {
    triggerSection += '• ' + input.yellow_triggers[y].label + '\n';
  }
}

// News
var newsSection = '';
if (input.news_alerts.length > 0) {
  newsSection = '\n📰 <b>NEWS ALERTS</b>\n';
  for (var n = 0; n < Math.min(input.news_alerts.length, 5); n++) {
    newsSection += '• [' + input.news_alerts[n].keyword.toUpperCase() + '] ' + input.news_alerts[n].headline.substring(0, 80) + '\n';
  }
}

// Kill Switch
var killSection = '';
if (input.kill_switch_warning) {
  killSection = '\n🔴 <b>KILL SWITCH PRE-ALERT</b>\nDXY rising + Yields rising + VIX > 30\nCorrelation Kill Switch conditions forming. Review metals positions before open.\n';
}

var fullMessage = header + snapshot + triggerSection + newsSection + killSection;

return [{ json: {
  telegram_message: fullMessage,
  escalation: escalation,
  timestamp: new Date().toISOString(),
  market_data: md,
  triggers: {
    yellow: input.yellow_triggers,
    red: input.red_triggers
  },
  news_alerts: input.news_alerts,
  kill_switch_warning: input.kill_switch_warning
}}];
```

### Node 8: IF — Escalation Router
```
Type: IF
Name: Escalation Router
Condition: {{ $json.escalation }} is not equal to GREEN
true → Telegram Delivery + Log
false → Log only (silent)
```

### Node 9: Telegram — Alert Delivery
```
Type: Telegram
Name: Gabriel Alert
Credential: Telegram account (same as SENTINEL)
Chat ID: 8203545338
Text: {{ $json.telegram_message }}
Parse Mode: HTML
```

### Node 10: IF — RED Check
```
Type: IF
Name: RED Escalation
Condition: {{ $json.escalation }} equals RED
true → Email Alert + SMS + CIL Webhook
false → end
```

### Node 11: Email — RED Alert
```
Type: Gmail
Name: RED Alert Email
To: ashes2echoes.platform@gmail.com
Subject: 🚨 GABRIEL RED ALERT: {{ $json.escalation }}
Body: {{ $json.telegram_message }}
Credential: Gmail — Platform
```

### Node 12: HTTP Request — CIL Webhook (RED only)
```
Type: HTTP Request
Name: CIL Analysis Request
Method: POST
URL: [CIL webhook URL from CIL v5.2.1]
Body: {
  "query": "GABRIEL RED ALERT: [trigger summary]. Analyze overnight market conditions and recommend posture for market open.",
  "domain": "MARKET",
  "urgency": "HIGH"
}
Note: Only fires on RED escalation. CIL runs full 5-agent consensus.
```

### Node 13: Code — Supabase Logger
```
Type: Code (JavaScript)
Name: Gabriel Logger
```

```javascript
// Log every GABRIEL run to Supabase
var SUPABASE_PROJECT_ID = 'bwtguoaakkmsnzomswem';
var SUPABASE_ANON_KEY = 'sb_publishable_is2iGeR-YRuNrhdsvrr3-w_PVAFcm8z';
var input = $input.first().json;

function uuid() {
  var d = Date.now();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

var logEntry = {
  id: uuid(),
  escalation: input.escalation,
  yellow_count: (input.triggers && input.triggers.yellow) ? input.triggers.yellow.length : 0,
  red_count: (input.triggers && input.triggers.red) ? input.triggers.red.length : 0,
  news_count: input.news_alerts ? input.news_alerts.length : 0,
  kill_switch_warning: input.kill_switch_warning || false,
  market_snapshot: JSON.stringify(input.market_data),
  timestamp: new Date().toISOString()
};

try {
  await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://' + SUPABASE_PROJECT_ID + '.supabase.co/rest/v1/gabriel_overnight_log',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: logEntry
  });
} catch (e) { /* log failure, continue */ }

return [{ json: logEntry }];
```

### Node 14: Schedule Trigger — Morning Brief
```
Type: Schedule Trigger
Name: Morning Brief Trigger
Schedule: 12:00 UTC (8:00 AM ET) Monday-Friday
```

### Node 15: Code — Morning Brief Builder
```
Type: Code (JavaScript)
Name: Morning Brief
```

This node pulls the last 12 hours of GABRIEL logs from Supabase, synthesizes overnight activity, adds pre-market movers, and delivers a comprehensive morning report to Telegram at 8:00 AM ET.

## Wiring Diagram

```
Overnight Watch Trigger ──┐
Weekend Watch Trigger ─────┤
Manual Trigger ────────────┘
         │
    Market Data Collector
         │
    News Scanner
         │
    Threshold Engine
         │
    Report Builder
         │
    ┌────┴────┐
    │         │
  GREEN     YELLOW/RED
  (log)       │
    │    ┌────┴────┐
    │    │         │
    │  Telegram   RED?
    │    │      ┌──┴──┐
    │    │     NO    YES
    │    │      │   ┌──┼──────────┐
    │    │      │  Email  SMS  CIL Webhook
    │    │      │
    └────┴──────┴──► Supabase Logger ──► GitHub Archive

Morning Brief Trigger ──► Morning Brief Builder ──► Telegram
```

## Connection Map

```
Overnight Watch Trigger → Market Data Collector
Weekend Watch Trigger → Market Data Collector
Manual Trigger → Market Data Collector
Market Data Collector → News Scanner
News Scanner → Threshold Engine
Threshold Engine → Report Builder
Report Builder → Escalation Router
Escalation Router (true: YELLOW/RED) → Gabriel Alert (Telegram)
Escalation Router (false: GREEN) → Gabriel Logger
Gabriel Alert → RED Escalation
RED Escalation (true) → RED Alert Email
RED Escalation (true) → CIL Analysis Request
RED Escalation (false) → Gabriel Logger
RED Alert Email → Gabriel Logger
CIL Analysis Request → Gabriel Logger
Gabriel Logger → GitHub Archive

Morning Brief Trigger → Morning Brief Builder → Telegram
```

## n8n AI Build Prompt

This is the prompt to paste into n8n's AI Build tab to generate the workflow:

```
Build an n8n workflow called "GABRIEL — Overnight Watch v1.0" with 15 nodes:

TRIGGERS:
1. Schedule Trigger "Overnight Watch" — every 30 min, 22:00-13:25 UTC, Mon-Fri
2. Schedule Trigger "Weekend Watch" — every 2 hours, all day Sat-Sun
3. Manual Trigger
4. Schedule Trigger "Morning Brief" — 12:00 UTC Mon-Fri

All 3 overnight triggers → Code node "Market Data Collector"

MARKET DATA COLLECTOR (Code node):
Fetches 15 symbols from Yahoo Finance v8 chart API (ES=F, NQ=F, YM=F, RTY=F, GC=F, SI=F, CL=F, ^VIX, BTC-USD, ETH-USD, UUP, TLT, DIA, SPY, QQQ). For each symbol, GET https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=2d, extract regularMarketPrice and chartPreviousClose, calculate changePercent. Output: { market_data: {symbol: {lastPrice, changePercent, previousClose}}, fetch_time, source }

Market Data Collector → Code node "News Scanner"

NEWS SCANNER (Code node):
Fetches general news from Finnhub API. Scans headlines for keywords: hormuz, strait, iran, nuclear, ceasefire, margin call, circuit breaker, force majeure, default, fed rate, emergency meeting. Output: { market_data (passthrough), news_alerts: [{keyword, headline, source, url}], news_count }

News Scanner → Code node "Threshold Engine"

THRESHOLD ENGINE (Code node):
Checks market_data against thresholds. YELLOW: ES=F>1%, VIX change>15%, Oil>3%, Gold>2%, Silver>5%, DXY>0.5%, BTC>5%, VIX level>25. RED: ES=F>3%, Oil>8%, Silver>10%, DXY>1.5%, VIX level>35, 3+ yellows simultaneously, critical news keywords. Kill Switch pre-alert if DXY rising + yields rising + VIX>30. Output: { escalation (GREEN/YELLOW/RED), yellow_triggers, red_triggers, kill_switch_warning, market_data, news_alerts }

Threshold Engine → Code node "Report Builder"

REPORT BUILDER (Code node):
Builds HTML-formatted Telegram message with emoji header, market snapshot table, trigger alerts, news alerts, kill switch warning. Output: { telegram_message, escalation, timestamp, market_data, triggers, news_alerts }

Report Builder → IF node "Escalation Router" (condition: escalation != GREEN)

Escalation Router TRUE → Telegram node "Gabriel Alert" (credential: Telegram account, chat ID: 8203545338, parse_mode: HTML)
Escalation Router FALSE → Code node "Gabriel Logger"

Gabriel Alert → IF node "RED Escalation" (condition: escalation == RED)
RED Escalation TRUE → Gmail node "RED Alert Email" (to: ashes2echoes.platform@gmail.com)
RED Escalation FALSE → Code node "Gabriel Logger"
RED Alert Email → Gabriel Logger

GABRIEL LOGGER (Code node):
Posts log entry to Supabase (project: bwtguoaakkmsnzomswem, table: gabriel_overnight_log). Fields: id (UUID), escalation, yellow_count, red_count, news_count, kill_switch_warning, market_snapshot (JSON), timestamp.

Morning Brief Trigger → Code node "Morning Brief Builder" → Telegram "Morning Brief Delivery"
Morning Brief reads last 12 hours of gabriel_overnight_log from Supabase, synthesizes into summary with recommended market posture.
```

## Supabase Table (run before workflow)

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
```

## Credentials Required

| Credential | Status | Notes |
|-----------|--------|-------|
| Telegram account | READY | Same as SENTINEL — hunter_a2e_bot |
| Gmail — Platform | READY | ashes2echoes.platform@gmail.com |
| Finnhub API | READY | Already in n8n from HUNTER H30 |
| Yahoo Finance v8 | NO AUTH | Free, no key needed |
| Supabase | READY | Same project as SENTINEL |
| Twilio | NOT SET | SMS for RED alerts — sign up later |

---

# PART III: ASSOCIATED WORKFLOWS

## Current n8n Workflow Inventory (8 workflows)

| # | Workflow | Status | Purpose |
|---|---------|--------|---------|
| 1 | SENTINEL — E*TRADE Portfolio Monitor | ACTIVE | Market hours risk management |
| 2 | CIL v5.1.2 | ACTIVE | Collective consensus engine (production) |
| 3 | CIL v6.0 | INACTIVE | Universal abstraction (WIP) |
| 4 | CIL v6.1 | ACTIVE | Latest CIL iteration |
| 5 | CIL Test Runner v1.0 | ACTIVE | CIL validation harness |
| 6 | DRIVE INGEST v2.0 | INACTIVE | Google Drive document processing |
| 7 | My workflow 3 | INACTIVE | Legacy test — DELETE |
| 8 | GABRIEL — Overnight Watch | TO BUILD | This specification |

## Workflows That Should Be Associated

| Workflow | Depends On | Feeds Into |
|---------|-----------|-----------|
| GABRIEL Overnight Watch | Yahoo Finance, Finnhub, Supabase | CIL (on RED), Telegram, Gmail |
| SENTINEL Portfolio Monitor | E*TRADE OAuth, Yahoo Finance | Telegram, Gmail, Supabase, GitHub, Sheets |
| CIL v5.2.1 | 5 AI agent APIs | Telegram, GitHub |
| HUNTER-DAILY (TO BUILD) | Finnhub, SEC EDGAR, NewsAPI | CIL webhook, GitHub |
| GABRIEL Email Intel v2 (EXISTS on GitHub) | Gmail OAuth | GitHub archive |
| FORGE Interactive (TO BUILD) | Claude API | CIL input formatting |

---

# PART IV: GMAIL INTELLIGENCE ARCHIVE

The trading notes, receipts, and market intel from Seeking Alpha, Zacks, E*TRADE, Bloomberg, and Yahoo Finance are in your personal email accounts — not the platform account connected here. The GABRIEL Email Intelligence workflow (v2, on GitHub at AIORA/workflows/GABRIEL_EMAIL_ARCHIVE_v2.json) processes four email accounts and archives to the A2E_EmailArchive repo.

To pull that content into this session, you'd need to:
1. Connect your personal Gmail/Outlook to Claude's Gmail integration, OR
2. Run the GABRIEL Email Archive workflow in n8n to refresh the archive, OR
3. Give me the A2E_EmailArchive repo contents to read

The platform Gmail (ashes2echoes.platform) currently contains SENTINEL alerts, Healthchecks.io pings, and system notifications — not trading intel.

---

# PART V: BUILD QUEUE (UPDATED)

| Priority | Item | Status | Sessions |
|----------|------|--------|----------|
| 1 | SENTINEL — verify stops at market open | 90% done | 0.5 |
| 2 | SENTINEL — token renewal (Cowork local) | NOT STARTED | 1 |
| 3 | GABRIEL — Overnight Watch (this spec) | SPEC DONE | 2-3 |
| 4 | GABRIEL — Morning Brief | SPEC DONE | 1 |
| 5 | CIL v6.0 Universal Pivot | SPEC DONE | 2 |
| 6 | FORGE Interactive Build | SPEC DONE | 3 |
| 7 | HUNTER-DAILY automation | PARTIAL | 2 |
| 8 | GEX Monitor for SENTINEL | NOT STARTED | 1 |
| 9 | XSP Paper Trade Logger | NOT STARTED | 1 |

---

*Document: GABRIEL_BUILD_THESIS_v1.0.md*
*Author: MICHA, CIO — Uriel Covenant*
*Date: March 25, 2026*
*Classification: BUILD SPECIFICATION*
*Status: READY FOR COLLECTIVE REVIEW*

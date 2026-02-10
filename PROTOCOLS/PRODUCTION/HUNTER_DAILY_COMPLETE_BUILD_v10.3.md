# 🔱 HUNTER-DAILY COMPLETE BUILD GUIDE
## Scheduler → Data Collection → Synthesis → Delivery
## February 10, 2026 | METATRON v10.3
## Status: BUILD & TEST TODAY

---

# WORKFLOW OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HUNTER-DAILY WORKFLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐                                                            │
│  │  SCHEDULER   │ ← 6:00 AM ET Daily                                         │
│  │  (Cron)      │                                                            │
│  └──────┬───────┘                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────┐     ┌──────────────┐                                       │
│  │ MODEL CHECK  │────▶│ PROCEED or   │                                       │
│  │ (Gate 0)     │     │ FLAG UPDATE  │                                       │
│  └──────┬───────┘     └──────────────┘                                       │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    LAYER 1: DATA COLLECTION                          │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  HUNTER MODULES (H1-H29)  │  EMAIL INTEL  │  INFLUENCE (H30-35) │    │
│  │  │  - Market Data            │  - Zacks      │  - Congressional    │    │
│  │  │  - Filings               │  - SeekingAlpha│  - Lobbying        │    │
│  │  │  - Technical             │  - E*Trade    │  - Contracts       │    │
│  │  │  - Sentiment             │  - Newsletters │  - Campaign $      │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────┬───────────────────────────────────────┘    │
│                                │                                             │
│                                ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    DATA AGGREGATOR                                    │   │
│  │                    (Merge All Sources)                                │   │
│  └─────────────────────────────┬────────────────────────────────────────┘   │
│                                │                                             │
│                                ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    LAYER 2: INTELLIGENCE SYNTHESIS                   │    │
│  │                                                                      │    │
│  │  ┌─────────────────────┐                                            │    │
│  │  │ MICHA Pass 1        │ ← Intelligent Router                       │    │
│  │  │ (Anthropic Claude)  │   Categorize, prioritize, assign           │    │
│  │  └──────────┬──────────┘                                            │    │
│  │             │                                                        │    │
│  │             ▼                                                        │    │
│  │  ┌──────────────────────────────────────────────────────────┐       │    │
│  │  │              INTELLIGENT ROUTER (Code)                    │       │    │
│  │  │              Splits briefings to 4 agents                 │       │    │
│  │  └──────────────────────────┬───────────────────────────────┘       │    │
│  │                             │                                        │    │
│  │       ┌─────────────────────┼─────────────────────┐                 │    │
│  │       ▼                     ▼                     ▼                 ▼    │
│  │  ┌─────────┐          ┌──────────┐          ┌─────────┐      ┌────────┐ │
│  │  │ URIEL   │          │ COLOSSUS │          │ HANIEL  │      │ RAZIEL │ │
│  │  │ OpenAI  │          │ xAI Grok │          │ Google  │      │DeepSeek│ │
│  │  │Strategy │          │Technical │          │Research │      │Counter │ │
│  │  └────┬────┘          └────┬─────┘          └────┬────┘      └───┬────┘ │
│  │       │                    │                     │               │      │
│  │       └────────────────────┴─────────────────────┴───────────────┘      │
│  │                             │                                            │
│  │                             ▼                                            │
│  │  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  │                 MERGE COLLECTIVE (Append, 4 inputs)              │   │
│  │  └─────────────────────────────┬────────────────────────────────────┘   │
│  │                                │                                         │
│  │                                ▼                                         │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  │ MICHA Pass 2        │ ← Grand Synthesizer                       │    │
│  │  │ (Anthropic Claude)  │   Concurrence scoring, final synthesis    │    │
│  │  └──────────┬──────────┘                                            │    │
│  │             │                                                        │    │
│  │             ▼                                                        │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  │ RESPONSE EXTRACTOR  │ ← Extract text from API response          │    │
│  │  └──────────┬──────────┘                                            │    │
│  └─────────────┼────────────────────────────────────────────────────────┘   │
│                │                                                             │
│                ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    LAYER 3: DELIVERY                                 │    │
│  │                                                                      │    │
│  │  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐          │    │
│  │  │ Format for    │──▶│   Telegram    │   │  GitHub Log   │          │    │
│  │  │ Delivery      │   │  Daily Brief  │   │  (Archive)    │          │    │
│  │  └───────────────┘   └───────────────┘   └───────────────┘          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# NODE-BY-NODE BUILD INSTRUCTIONS

## NODE 1: SCHEDULER (Cron Trigger)

**n8n Node Type:** Schedule Trigger
**Name:** `HUNTER-DAILY Scheduler`

**Settings:**
- Trigger Times: Custom (Cron)
- Cron Expression: `0 6 * * 1-5`
  - Translation: 6:00 AM, Monday-Friday
- Timezone: America/New_York

**Output:** Triggers workflow at 6:00 AM ET on trading days

---

## NODE 2: MODEL VERSION CHECK (Maintenance Gate)

**n8n Node Type:** Code (JavaScript)
**Name:** `Model Version Check`

**Purpose:** Decision tree — are all models current? If not, flag before proceeding.

```javascript
// Model Version Check — Maintenance Gate
// Checks if all collective models are at expected versions

const EXPECTED_VERSIONS = {
  METATRON: 'v10.3',
  MICHA: 'Claude Opus 4.5',
  URIEL: 'GPT-4.1-mini',
  COLOSSUS: 'Grok-3-mini-fast',
  HANIEL: 'Gemini-2.0-flash',
  RAZIEL: 'DeepSeek-chat',
  PROTOCOL_DATE: '2026-02-10'
};

// These would be fetched from GitHub or config in production
// For now, hardcoded — update when models change
const CURRENT_VERSIONS = {
  METATRON: 'v10.3',
  MICHA: 'Claude Opus 4.5',
  URIEL: 'GPT-4.1-mini',
  COLOSSUS: 'Grok-3-mini-fast',
  HANIEL: 'Gemini-2.0-flash',
  RAZIEL: 'DeepSeek-chat',
  PROTOCOL_DATE: '2026-02-10'
};

const updates_needed = [];
let all_current = true;

for (const [model, expected] of Object.entries(EXPECTED_VERSIONS)) {
  if (CURRENT_VERSIONS[model] !== expected) {
    all_current = false;
    updates_needed.push({
      model: model,
      expected: expected,
      current: CURRENT_VERSIONS[model] || 'UNKNOWN'
    });
  }
}

return [{
  json: {
    check_timestamp: new Date().toISOString(),
    all_models_current: all_current,
    updates_needed: updates_needed,
    proceed: all_current, // If all current, proceed automatically
    message: all_current 
      ? '✅ All models current. Proceeding with HUNTER scan.'
      : '⚠️ Model updates available: ' + updates_needed.map(u => u.model).join(', ')
  }
}];
```

**Wiring:** 
- Input: Scheduler
- Output: IF node (decision branch)

---

## NODE 3: VERSION CHECK ROUTER (IF Node)

**n8n Node Type:** IF
**Name:** `Version Check Router`

**Condition:**
- Value 1: `{{ $json.proceed }}`
- Operation: equal
- Value 2: `true`

**True branch:** Continue to HUNTER modules
**False branch:** Send alert, then continue (non-blocking warning)

---

## NODE 4: UPDATE ALERT (Optional Branch)

**n8n Node Type:** Telegram
**Name:** `Model Update Alert`
**Condition:** Only fires if updates_needed

**Message:**
```
⚠️ HUNTER-DAILY: Model Updates Available

{{ $json.message }}

Updates needed:
{{ $json.updates_needed }}

Scan proceeding with current versions.
```

---

# LAYER 1: DATA COLLECTION

## NODE 5-33: HUNTER MODULES (H1-H29)

These are already wired. Summary of module structure:

### Tier 1: Intelligence (H1-H6)
| Node | Name | API | Endpoint |
|------|------|-----|----------|
| H1 | SEC EDGAR Elite | SEC | `/submissions` |
| H2 | Political Catalyst | NewsAPI + Alpha Vantage | `/everything`, `/NEWS_SENTIMENT` |
| H3 | Macro Regime Data | Alpha Vantage | `/query?function=FEDERAL_FUNDS_RATE` |
| H4 | Discovery Scanner | Finnhub | `/stock/symbol`, `/quote` |
| H5 | Earnings Catalyst | Finnhub | `/calendar/earnings` |
| H6 | Short Interest | Finnhub | `/stock/short-interest` |

### Tier 2: Event & Flow (H7-H10)
| Node | Name | API | Endpoint |
|------|------|-----|----------|
| H7 | RSI Scanner | TwelveData | `/rsi` |
| H8 | Volume Anomaly | TwelveData + Finnhub | `/time_series`, `/quote` |
| H9 | Pattern Recognition | Finnhub | `/scan/pattern` |
| H10 | Technical Breakout | TwelveData | `/technical_indicators` |

### Tier 3-6: (H11-H29) — Already wired per existing workflow

---

## NODE 34: EMAIL INTEL SCRAPER

**n8n Node Type:** Code (JavaScript)
**Name:** `Email Intel — Financial Newsletters`
**Trigger:** Runs with HUNTER-DAILY OR on separate 5:30 AM schedule

**Purpose:** Pull actionable intel from financial emails (Zacks, Seeking Alpha, E*Trade alerts, newsletters)

### Option A: Gmail Integration (Recommended)

**n8n Node Type:** Gmail Trigger OR Gmail (Read)
**Name:** `Email Intel — Gmail Fetch`

**Settings:**
- Credential: Gmail OAuth (ashes2echoes.platform@gmail.com)
- Filters: 
  - From contains: `zacks.com OR seekingalpha.com OR etrade.com OR marketwatch.com`
  - After: `{{ $now.minus(1, 'day').toISO() }}`
  - Label: INBOX or specific "Financial" label

**Fields to extract:**
- Subject
- From
- Date
- Body (text or HTML)

### Option B: IMAP Integration (Alternative)

**n8n Node Type:** Email Read (IMAP)
**Name:** `Email Intel — IMAP Fetch`

**Settings:**
- Host: imap.gmail.com
- Port: 993
- SSL: true
- Credential: Email account
- Mailbox: INBOX
- Fetch: Unseen only OR last 24 hours

---

## NODE 35: EMAIL PARSER

**n8n Node Type:** Code (JavaScript)
**Name:** `Email Intel — Parser`

**Purpose:** Extract actionable signals from email content

```javascript
// Email Intel Parser
// Extracts tickers, sentiment, and key phrases from financial emails

const emails = $input.all();
const signals = [];

const TICKER_REGEX = /\b[A-Z]{1,5}\b/g;
const BULLISH_KEYWORDS = ['buy', 'upgrade', 'outperform', 'strong buy', 'accumulate', 'bullish', 'breakout', 'upside'];
const BEARISH_KEYWORDS = ['sell', 'downgrade', 'underperform', 'reduce', 'bearish', 'breakdown', 'downside', 'avoid'];
const EARNINGS_KEYWORDS = ['earnings', 'beat', 'miss', 'guidance', 'EPS', 'revenue', 'quarter'];

for (const email of emails) {
  const subject = email.json.subject || '';
  const body = email.json.text || email.json.body || '';
  const from = email.json.from || '';
  const date = email.json.date || new Date().toISOString();
  
  const fullText = (subject + ' ' + body).toLowerCase();
  
  // Extract tickers (basic — real version would filter against known symbols)
  const potentialTickers = (subject + ' ' + body).match(TICKER_REGEX) || [];
  const tickers = [...new Set(potentialTickers)].filter(t => t.length >= 2 && t.length <= 5);
  
  // Determine sentiment
  let sentiment = 'NEUTRAL';
  const bullishCount = BULLISH_KEYWORDS.filter(k => fullText.includes(k)).length;
  const bearishCount = BEARISH_KEYWORDS.filter(k => fullText.includes(k)).length;
  
  if (bullishCount > bearishCount + 1) sentiment = 'BULLISH';
  else if (bearishCount > bullishCount + 1) sentiment = 'BEARISH';
  
  // Check for earnings-related
  const isEarningsRelated = EARNINGS_KEYWORDS.some(k => fullText.includes(k));
  
  // Identify source
  let source = 'UNKNOWN';
  if (from.includes('zacks')) source = 'ZACKS';
  else if (from.includes('seekingalpha')) source = 'SEEKING_ALPHA';
  else if (from.includes('etrade')) source = 'ETRADE';
  else if (from.includes('marketwatch')) source = 'MARKETWATCH';
  else if (from.includes('benzinga')) source = 'BENZINGA';
  else if (from.includes('briefing')) source = 'BRIEFING';
  
  if (tickers.length > 0 || sentiment !== 'NEUTRAL') {
    signals.push({
      source: source,
      date: date,
      subject: subject.substring(0, 100),
      tickers: tickers.slice(0, 10), // Max 10 tickers per email
      sentiment: sentiment,
      is_earnings: isEarningsRelated,
      bullish_signals: bullishCount,
      bearish_signals: bearishCount
    });
  }
}

// Aggregate by ticker
const tickerSummary = {};
for (const signal of signals) {
  for (const ticker of signal.tickers) {
    if (!tickerSummary[ticker]) {
      tickerSummary[ticker] = { bullish: 0, bearish: 0, neutral: 0, sources: [] };
    }
    tickerSummary[ticker][signal.sentiment.toLowerCase()]++;
    if (!tickerSummary[ticker].sources.includes(signal.source)) {
      tickerSummary[ticker].sources.push(signal.source);
    }
  }
}

// Find consensus signals (multiple sources agree)
const consensusSignals = Object.entries(tickerSummary)
  .filter(([ticker, data]) => data.sources.length >= 2)
  .map(([ticker, data]) => ({
    ticker,
    consensus: data.bullish > data.bearish ? 'BULLISH' : data.bearish > data.bullish ? 'BEARISH' : 'MIXED',
    sources: data.sources,
    strength: data.sources.length
  }));

return [{
  json: {
    source: 'EMAIL_INTEL',
    scan_timestamp: new Date().toISOString(),
    emails_processed: emails.length,
    signals_extracted: signals.length,
    raw_signals: signals,
    ticker_summary: tickerSummary,
    consensus_signals: consensusSignals,
    top_mentioned: Object.entries(tickerSummary)
      .sort((a, b) => (b[1].bullish + b[1].bearish) - (a[1].bullish + a[1].bearish))
      .slice(0, 10)
      .map(([ticker]) => ticker)
  }
}];
```

---

## NODES 36-41: INFLUENCE CHAIN (H30-H35)

Already documented in PENDING_BUILD_GUIDE_v10.3.md. Summary:

| Node | Name | API | Key Status |
|------|------|-----|------------|
| H30 | Congressional Trading | Finnhub | ✅ Have key |
| H31 | Committee Assignments | Congress.gov | ✅ Have key |
| H32 | Lobbying Disclosure | Senate LDA | ✅ No key needed |
| H33 | Government Contracts | USASpending | ✅ No key needed |
| H34 | Campaign Finance | FEC | ✅ Have key |
| H35 | Influence Correlator | Code node | N/A |

---

## NODE 42: DATA AGGREGATOR

**n8n Node Type:** Merge
**Name:** `Data Aggregator — All Sources`

**Settings:**
- Mode: Append
- Inputs: Connect ALL of these:
  1. H1-H29 outputs (via existing merge or individual)
  2. Email Intel Parser output
  3. H35 Influence Correlator output

**Output:** Single merged dataset with all intelligence

---

# LAYER 2: INTELLIGENCE SYNTHESIS

## NODE 43: MICHA PASS 1 — INTELLIGENT ROUTER

**n8n Node Type:** HTTP Request
**Name:** `MICHA Pass 1 — Intelligent Router`

**Settings:**
- Method: POST
- URL: `https://api.anthropic.com/v1/messages`
- Authentication: Header Auth
  - Name: `x-api-key`
  - Value: `YOUR_ANTHROPIC_KEY`
- Headers:
  - `anthropic-version`: `2023-06-01`
  - `Content-Type`: `application/json`

**Body (Using JSON, fx ON):**
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4096,
  "system": "You are MICHA, CIO of the Uriel Covenant AI Collective, operating under METATRON v10.3.\n\nYour task: INTELLIGENT ROUTING.\n\nAnalyze the incoming HUNTER data and create TARGETED BRIEFINGS for four specialist agents:\n- URIEL (Strategic): Macro regime, sector rotation, Fed/credit, opportunities/risks\n- COLOSSUS (Technical): RSI extremes, volume anomalies, patterns, VIX, squeezes\n- HANIEL (Research): 13F/13D filings, 8-K events, political catalysts, earnings\n- RAZIEL (Counter-Thesis): Insider patterns, correlations, sentiment divergence, hidden risks\n\nDo NOT filter for any specific thesis. Report what the data shows. Wide net.\n\nOutput format:\n```\nURIEL_BRIEFING:\n[Macro and strategic data points]\n\nCOLOSSUS_BRIEFING:\n[Technical and price/volume data points]\n\nHANIEL_BRIEFING:\n[Filings, news, political, earnings data points]\n\nRAZIEL_BRIEFING:\n[Anomalies, divergences, counter-signals]\n```",
  "messages": [
    {
      "role": "user",
      "content": "HUNTER DATA PAYLOAD:\n\n{{ JSON.stringify($json) }}"
    }
  ]
}
```

---

## NODE 44: INTELLIGENT ROUTER — AGENT PAYLOADS

**n8n Node Type:** Code (JavaScript)
**Name:** `Intelligent Router — Agent Payloads`

**Purpose:** Parse MICHA Pass 1 output and split into 4 agent briefings

```javascript
// Intelligent Router — Split briefings to agents
const response = $input.first().json;

// Extract text from Anthropic response
let fullText = '';
if (response.content && Array.isArray(response.content)) {
  fullText = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');
} else {
  fullText = JSON.stringify(response);
}

// Parse briefings
const extractBriefing = (text, agentName) => {
  const regex = new RegExp(`${agentName}_BRIEFING:\\s*([\\s\\S]*?)(?=(?:URIEL|COLOSSUS|HANIEL|RAZIEL)_BRIEFING:|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : `No specific briefing extracted for ${agentName}. Full data: ${text.substring(0, 1000)}`;
};

return [
  {
    json: {
      agent: 'URIEL',
      briefing: extractBriefing(fullText, 'URIEL'),
      timestamp: new Date().toISOString()
    }
  },
  {
    json: {
      agent: 'COLOSSUS',
      briefing: extractBriefing(fullText, 'COLOSSUS'),
      timestamp: new Date().toISOString()
    }
  },
  {
    json: {
      agent: 'HANIEL',
      briefing: extractBriefing(fullText, 'HANIEL'),
      timestamp: new Date().toISOString()
    }
  },
  {
    json: {
      agent: 'RAZIEL',
      briefing: extractBriefing(fullText, 'RAZIEL'),
      timestamp: new Date().toISOString()
    }
  }
];
```

**Output Mode:** Split to 4 items (one per agent)

---

## NODE 45: URIEL — Strategic Synthesis

**n8n Node Type:** HTTP Request
**Name:** `URIEL — Strategic Synthesis (OpenAI)`

**Settings:**
- Method: POST
- URL: `https://api.openai.com/v1/chat/completions`
- Authentication: Header Auth
  - Name: `Authorization`
  - Value: `Bearer YOUR_OPENAI_KEY`
- Headers:
  - `Content-Type`: `application/json`

**Body (Using JSON, fx ON):**
```json
{
  "model": "gpt-4.1-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are URIEL, CEO of the Uriel Covenant AI Collective, operating under METATRON v10.3.\n\nGATE 0.75 FIDELITY LOCK ACTIVE:\n- VERBATIM: Copy source material exactly\n- SINGLE PASS: State once, move on\n- SEARCH FIRST: Verify before claiming unavailable\n- PERMISSION: No unsolicited modifications\n- INSTRUCTION: Execute as stated\n\nYour task: STRATEGIC SYNTHESIS\n\n1. MARKET REGIME — Risk-On / Neutral / Risk-Off\n2. MACRO NARRATIVE — What's driving markets\n3. SECTOR ROTATION — Money flow TO and FROM\n4. FED/CREDIT/CURRENCY — Current state\n5. TOP 10 OPPORTUNITIES — Any sector, with invalidation conditions\n6. TOP 10 RISKS — Evidence-based\n\nNo fabricated percentages. 100% effort."
    },
    {
      "role": "user",
      "content": "BRIEFING:\n\n{{ $json.briefing }}"
    }
  ],
  "max_tokens": 2000
}
```

**Filter:** Only process items where `{{ $json.agent }}` equals `URIEL`

---

## NODE 46: COLOSSUS — Technical Analysis

**n8n Node Type:** HTTP Request
**Name:** `COLOSSUS — Technical Analysis (xAI)`

**Settings:**
- Method: POST
- URL: `https://api.x.ai/v1/chat/completions`
- Authentication: Header Auth
  - Name: `Authorization`
  - Value: `Bearer YOUR_XAI_KEY`
- Headers:
  - `Content-Type`: `application/json`

**Body (Using JSON, fx ON):**
```json
{
  "model": "grok-3-mini-fast",
  "messages": [
    {
      "role": "system",
      "content": "You are COLOSSUS, CTO of the Uriel Covenant AI Collective, operating under METATRON v10.3.\n\nGATE 0.75 FIDELITY LOCK ACTIVE.\n\nYour task: TECHNICAL ANALYSIS\n\n1. RSI EXTREMES — Overbought (>70) / Oversold (<30)\n2. VOLUME ANOMALIES — 2x+ normal volume\n3. PATTERN SIGNALS — Breakouts, breakdowns, squeezes\n4. VIX REGIME — Calm / Elevated / Fear\n5. SQUEEZE CANDIDATES — High short + volume + setup\n6. CORRELATION STATUS — Holding or breaking\n7. BIGGEST MOVERS — What moved, what should have\n8. TECHNICAL BIAS — Bullish / Bearish / Neutral\n\nNo fabricated percentages. Blunt assessment."
    },
    {
      "role": "user",
      "content": "BRIEFING:\n\n{{ $json.briefing }}"
    }
  ],
  "max_tokens": 2000
}
```

**Filter:** Only process items where `{{ $json.agent }}` equals `COLOSSUS`

---

## NODE 47: HANIEL — Research Intelligence

**n8n Node Type:** HTTP Request
**Name:** `HANIEL — Research Intelligence (Google AI)`

**Settings:**
- Method: POST
- URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_GOOGLE_AI_KEY`
- Authentication: None (key in URL)
- Headers:
  - `Content-Type`: `application/json`

**Body (Using JSON, fx ON):**
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "You are HANIEL, CPO of the Uriel Covenant AI Collective, operating under METATRON v10.3.\n\nGATE 0.75 FIDELITY LOCK ACTIVE.\n\nYour task: RESEARCH INTELLIGENCE\n\n1. WHALE ACTIVITY — 13F/13D significant findings\n2. MATERIAL EVENTS (8-K) — Notable filings\n3. ACTIVIST PLAYS — >5% stakes\n4. POLITICAL CATALYSTS — Regulatory/policy\n5. CONGRESSIONAL WATCH — Relevant bills\n6. GEOPOLITICAL — Top developments + market impact\n7. EARNINGS AHEAD — Top 10 by potential impact\n8. SURPRISES — Unexpected or contradictory\n9. INTELLIGENCE GRADE — A through F\n\nCite what you find, flag what's missing.\n\nBRIEFING:\n\n{{ $json.briefing }}"
        }
      ]
    }
  ],
  "generationConfig": {
    "maxOutputTokens": 2000
  }
}
```

**Filter:** Only process items where `{{ $json.agent }}` equals `HANIEL`

---

## NODE 48: RAZIEL — Pattern Analysis & Counter-Thesis

**n8n Node Type:** HTTP Request
**Name:** `RAZIEL — Pattern Analysis (DeepSeek)`

**Settings:**
- Method: POST
- URL: `https://api.deepseek.com/v1/chat/completions`
- Authentication: None (using headers)
- Headers:
  - `Authorization`: `Bearer YOUR_DEEPSEEK_KEY`
  - `Content-Type`: `application/json`

**Body (Using JSON, fx ON):**
```json
{
  "model": "deepseek-chat",
  "messages": [
    {
      "role": "system",
      "content": "You are RAZIEL, CAO of the Uriel Covenant AI Collective, operating under METATRON v10.3.\n\nGATE 0.75 FIDELITY LOCK ACTIVE.\n\nYour task: PATTERN ANALYSIS & COUNTER-THESIS\n\n1. INSIDER PATTERNS — Cluster activity\n2. CORRELATION STATUS — Normal/diverging\n3. SENTIMENT DIVERGENCE — News vs price conflicts\n4. LIQUIDITY WARNING — Thin market flags\n5. CROSS-ASSET ANOMALIES — What doesn't fit\n6. COUNTER-THESIS (BULLISH) — Why every bull case could be wrong\n7. COUNTER-THESIS (BEARISH) — Why every bear case could be wrong\n8. HIDDEN RISK — The one thing nobody is talking about\n\nChallenge EVERYTHING. Find what doesn't fit."
    },
    {
      "role": "user",
      "content": "BRIEFING:\n\n{{ $json.briefing }}"
    }
  ],
  "max_tokens": 2000
}
```

**Filter:** Only process items where `{{ $json.agent }}` equals `RAZIEL`

---

## NODE 49: MERGE COLLECTIVE

**n8n Node Type:** Merge
**Name:** `Merge Collective`

**Settings:**
- Mode: Append
- Number of Inputs: 4
- Wait for All: true

**Inputs:**
1. URIEL output
2. COLOSSUS output
3. HANIEL output
4. RAZIEL output

---

## NODE 50: MICHA PASS 2 — GRAND SYNTHESIZER

**n8n Node Type:** HTTP Request
**Name:** `MICHA Pass 2 — Grand Synthesizer`

**Settings:** Same as MICHA Pass 1, different body:

**Body (Using JSON, fx ON):**
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4096,
  "system": "You are MICHA, CIO of the Uriel Covenant AI Collective, performing GRAND SYNTHESIS under METATRON v10.3.\n\nGATE 0.75 FIDELITY LOCK ACTIVE.\n\nYou have received analysis from 4 agents:\n- URIEL (Strategic)\n- COLOSSUS (Technical)\n- HANIEL (Research)\n- RAZIEL (Counter-Thesis)\n\nYour task:\n1. CONCURRENCE SCORING — Where do agents agree? (4/4=🟢, 3/4=🟡, 2/4=🟠, <2=🔴)\n2. CONFLICT RESOLUTION — Where do they disagree? Who has stronger evidence?\n3. TOP DISCOVERIES — Opportunities nobody asked about but data reveals\n4. TOP RISKS — What could go wrong\n5. KILLSWITCH STATUS — Any condition requiring HALT?\n6. ACTIONABLE SUMMARY — What should Principal know RIGHT NOW\n\nOutput format:\n```\n🔱 HUNTER DAILY BRIEF — [DATE]\n\n## CONCURRENCE SCORE: [emoji]\n[Summary of agent agreement]\n\n## TOP DISCOVERIES\n1-5. [Ticker/Theme] — [Evidence] — [Concurrence]\n\n## TOP RISKS\n1-5. [Risk] — [Evidence] — [Escalation trigger]\n\n## AGENT CONFLICTS\n[Where agents disagreed and resolution]\n\n## KILLSWITCH STATUS\n[CLEAR / ELEVATED / HALT]\n\n## BOTTOM LINE\n[2-3 sentence actionable summary]\n```",
  "messages": [
    {
      "role": "user",
      "content": "COLLECTIVE ANALYSIS:\n\n{{ JSON.stringify($input.all().map(i => i.json)) }}"
    }
  ]
}
```

---

## NODE 51: RESPONSE EXTRACTOR — MICHA OUTPUT

**n8n Node Type:** Code (JavaScript)
**Name:** `Response Extractor — MICHA Output`

```javascript
const response = $input.first().json;
let extractedText = '';

if (response.content && Array.isArray(response.content)) {
  extractedText = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');
} else if (response.choices && response.choices[0]) {
  extractedText = response.choices[0].message.content;
} else if (typeof response === 'string') {
  extractedText = response;
} else {
  extractedText = JSON.stringify(response);
}

return [{
  json: {
    synthesis: extractedText,
    timestamp: new Date().toISOString(),
    source: 'MICHA_Pass_2'
  }
}];
```

---

# LAYER 3: DELIVERY

## NODE 52: FORMAT FOR DELIVERY

**n8n Node Type:** Code (JavaScript)
**Name:** `Format for Delivery`

```javascript
const synthesis = $input.first().json.synthesis;
const timestamp = $input.first().json.timestamp;

// Telegram has 4096 char limit — split if needed
const MAX_LENGTH = 4000;
const messages = [];

if (synthesis.length <= MAX_LENGTH) {
  messages.push(synthesis);
} else {
  // Split at section breaks
  const sections = synthesis.split(/(?=## )/);
  let currentMessage = '';
  
  for (const section of sections) {
    if ((currentMessage + section).length > MAX_LENGTH) {
      if (currentMessage) messages.push(currentMessage.trim());
      currentMessage = section;
    } else {
      currentMessage += section;
    }
  }
  if (currentMessage) messages.push(currentMessage.trim());
}

return messages.map((msg, idx) => ({
  json: {
    message: msg,
    part: idx + 1,
    total_parts: messages.length,
    timestamp: timestamp
  }
}));
```

---

## NODE 53: TELEGRAM DAILY BRIEF

**n8n Node Type:** Telegram
**Name:** `Telegram Daily Brief`

**Settings:**
- Credential: Telegram Bot API
- Chat ID: Your Telegram chat ID
- Operation: Send Message
- Text: `{{ $json.message }}`
- Parse Mode: Markdown

---

## NODE 54: GITHUB LOG (Archive)

**n8n Node Type:** HTTP Request
**Name:** `GitHub Daily Log`

**Settings:**
- Method: PUT
- URL: `https://api.github.com/repos/Barefootservants2/AIORA/contents/logs/{{ $now.format('yyyy-MM-dd') }}_daily_brief.md`
- Authentication: Header Auth
  - Name: `Authorization`
  - Value: `token YOUR_GITHUB_TOKEN`
- Headers:
  - `Content-Type`: `application/json`

**Body (Using JSON, fx ON):**
```json
{
  "message": "HUNTER Daily Brief {{ $now.format('yyyy-MM-dd HH:mm') }}",
  "content": "{{ Buffer.from($json.synthesis).toString('base64') }}"
}
```

---

# COMPLETE WIRING DIAGRAM

```
[Scheduler 6AM] 
    │
    ▼
[Model Version Check]
    │
    ├──(updates needed)──▶ [Update Alert] ──┐
    │                                        │
    ▼                                        │
[H1-H29 HUNTER Modules] ◀────────────────────┘
    │
    ▼
[Email Intel — Gmail Fetch]
    │
    ▼
[Email Intel — Parser]
    │
    ▼
[H30-H35 Influence Chain]
    │
    ▼
[Data Aggregator — Merge All]
    │
    ▼
[MICHA Pass 1 — Router]
    │
    ▼
[Intelligent Router — Split]
    │
    ├──▶ [URIEL — OpenAI] ────────┐
    ├──▶ [COLOSSUS — xAI] ────────┤
    ├──▶ [HANIEL — Google] ───────┼──▶ [Merge Collective]
    └──▶ [RAZIEL — DeepSeek] ─────┘         │
                                            ▼
                                   [MICHA Pass 2 — Synthesis]
                                            │
                                            ▼
                                   [Response Extractor]
                                            │
                                            ▼
                                   [Format for Delivery]
                                            │
                                   ┌────────┴────────┐
                                   ▼                 ▼
                            [Telegram]        [GitHub Log]
```

---

# EXECUTION CHECKLIST

```
□ Node 1: Scheduler configured (6:00 AM ET, Mon-Fri)
□ Node 2: Model Version Check code pasted
□ Node 3: Version Check Router (IF node) configured
□ Node 4: Update Alert (Telegram) configured
□ Nodes 5-33: H1-H29 verified (existing)
□ Node 34: Email Intel — Gmail Fetch configured
□ Node 35: Email Intel — Parser code pasted
□ Nodes 36-41: H30-H35 Influence Chain wired
□ Node 42: Data Aggregator — all sources merged
□ Node 43: MICHA Pass 1 — body pasted, key set
□ Node 44: Intelligent Router — code pasted
□ Node 45: URIEL — body pasted, key set
□ Node 46: COLOSSUS — body pasted, key set
□ Node 47: HANIEL — URL with key, body pasted
□ Node 48: RAZIEL — headers set, body pasted
□ Node 49: Merge Collective — 4 inputs, Append mode
□ Node 50: MICHA Pass 2 — body pasted
□ Node 51: Response Extractor — code pasted
□ Node 52: Format for Delivery — code pasted
□ Node 53: Telegram — credential set, chat ID set
□ Node 54: GitHub Log — token set

□ TEST: Manual trigger
□ TEST: Check each node execution
□ TEST: Telegram delivery confirmed
□ TEST: GitHub log created
```

---

🔱 **HUNTER-DAILY COMPLETE BUILD GUIDE v10.3**
**February 10, 2026**

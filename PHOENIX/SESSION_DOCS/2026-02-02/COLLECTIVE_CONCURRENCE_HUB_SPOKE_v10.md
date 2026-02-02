# 🔱 COLLECTIVE CONCURRENCE v10.0 — HUB-AND-SPOKE ARCHITECTURE
## MICHA as Intelligent Router + Synthesizer
**February 2, 2026 | Full Wiring Cards**

---

## ARCHITECTURE

```
Data Aggregator
      ↓
MICHA Pass 1 — Intelligent Router (Anthropic)
  "Read everything. Brief each agent. Tell them where to focus."
      ↓
Intelligent Router (Code — splits into 4 targeted payloads)
      ↓
┌──────────┬──────────┬──────────┬──────────┐
↓          ↓          ↓          ↓
URIEL    COLOSSUS   HANIEL    RAZIEL
(OpenAI)  (xAI)    (Google)  (DeepSeek)
↓          ↓          ↓          ↓
└──────────┴──────────┴──────────┘
      ↓
Merge Collective (Append, 4 inputs)
      ↓
MICHA Pass 2 — Final Synthesis (Anthropic)
      ↓
Response Extractor (Code)
      ↓
Format for Delivery → Telegram + GitHub
```

---

## H-MODULE ROUTING TABLE — THE GNAT'S ASS

### WHY EACH MODEL GETS WHAT IT GETS

| Model | Strength | Why It Gets These Modules |
|-------|----------|--------------------------|
| **URIEL / GPT-4.1-mini** | Broad synthesis, narrative construction, strategic reasoning | Macro data, regime signals, policy impact — needs to see the big picture |
| **COLOSSUS / Grok-3-mini-fast** | Real-time data, pattern matching, blunt assessment, speed | Price action, volume, technicals, volatility — raw numbers, fast processing |
| **HANIEL / Gemini-2.0-flash** | Long-context documents, research synthesis, multi-source analysis | Filings, news, congressional records, geopolitical — reads and connects dots across large documents |
| **RAZIEL / DeepSeek-chat** | Deep reasoning, mathematical patterns, correlation analysis, adversarial thinking | Insider patterns, sentiment divergence, correlations — finds what doesn't fit |

### COMPLETE ROUTING MATRIX

| Module | Description | API Source | Primary Agent | Secondary Agent | Rationale |
|--------|-------------|-----------|---------------|-----------------|-----------|
| **H1** | SEC EDGAR Elite (13F/13D) | SEC EDGAR | HANIEL | RAZIEL | Filings analysis = HANIEL. Whale accumulation patterns = RAZIEL |
| **H2** | Political Catalyst Scanner | NewsAPI | HANIEL | URIEL | Political news = HANIEL. Macro narrative impact = URIEL |
| **H3** | Macro Regime Data | Alpha Vantage | URIEL | — | Pure macro regime = URIEL only |
| **H4** | Discovery Scanner (Broad Market) | Finnhub | COLOSSUS | RAZIEL | Broad scan technicals = COLOSSUS. Anomaly detection = RAZIEL |
| **H5** | 8-K Material Events | SEC EDGAR | HANIEL | — | Corporate filings = HANIEL only |
| **H6** | SC 13D Activist Tracker | SEC EDGAR | HANIEL | RAZIEL | Activist plays = HANIEL. Accumulation patterns = RAZIEL |
| **H7** | RSI Scanner | Finnhub | COLOSSUS | — | Pure technical indicator = COLOSSUS only |
| **H8** | Volume Anomaly Detector | Finnhub | COLOSSUS | RAZIEL | Volume spikes = COLOSSUS. Anomaly significance = RAZIEL |
| **H9** | Pattern Recognition | Finnhub | COLOSSUS | — | Chart patterns = COLOSSUS only |
| **H10** | Technical Breakout Scanner | TwelveData | COLOSSUS | — | Breakout signals = COLOSSUS only |
| **H11** | VIX / Volatility Surface | Finnhub | COLOSSUS | URIEL | Vol metrics = COLOSSUS. Regime signal = URIEL |
| **H12** | Sector Rotation Tracker | Alpha Vantage | URIEL | — | Money flow strategy = URIEL only |
| **H13** | Insider Transaction Tracker | Finnhub | RAZIEL | HANIEL | Cluster patterns + timing = RAZIEL. Filing context = HANIEL |
| **H14** | Earnings Calendar | Finnhub | HANIEL | RAZIEL | Upcoming catalysts = HANIEL. Timing risk = RAZIEL |
| **H15** | Short Interest Scanner | Finnhub | COLOSSUS | RAZIEL | Squeeze mechanics = COLOSSUS. Counter-thesis fuel = RAZIEL |
| **H16** | Sentiment Divergence | TwelveData | RAZIEL | — | News vs price conflict = RAZIEL only |
| **H17** | Options Flow | Finnhub | COLOSSUS | — | Options chain analysis = COLOSSUS only |
| **H18** | Price/Volume Technical | TwelveData | COLOSSUS | — | Raw price data = COLOSSUS only |
| **H19** | Currency / DXY Correlation | Alpha Vantage | URIEL | RAZIEL | Macro currency regime = URIEL. Correlation breakdown = RAZIEL |
| **H20** | Commodity Correlation | Alpha Vantage | RAZIEL | COLOSSUS | Cross-asset correlation = RAZIEL. Price confirmation = COLOSSUS |
| **H21** | Congressional Intel | Congress.gov | HANIEL | URIEL | Bills and legislation = HANIEL. Policy impact = URIEL |
| **H22** | Whale Options (Unusual Whales) | DEFERRED | — | — | Paid API — deferred |
| **H23** | Institutional 13F Filings | SEC EDGAR | HANIEL | RAZIEL | Filing analysis = HANIEL. Whale patterns = RAZIEL |
| **H24** | Social Sentiment Pulse | TBD | RAZIEL | — | Crowd sentiment = RAZIEL only |
| **H25** | Dark Pool Activity | TBD | COLOSSUS | RAZIEL | Hidden volume = COLOSSUS. Hidden risk = RAZIEL |
| **H26** | Geopolitical Risk Monitor | NewsAPI | HANIEL | URIEL | Geopolitical events = HANIEL. Macro impact = URIEL |
| **H27** | FRED Macro Economic Data | FRED | URIEL | — | Fed data, rates, yields = URIEL only |
| **H28** | Earnings Calendar & Estimates | TBD | HANIEL | — | Earnings research = HANIEL only |
| **H29** | Precious Metals Real-Time | metals.dev | RAZIEL | COLOSSUS | Silver thesis validation = RAZIEL. Price action = COLOSSUS |

### SUMMARY COUNT

| Agent | Primary Modules | Secondary Modules | Total Touch |
|-------|----------------|-------------------|-------------|
| **URIEL** | H3, H12, H27 | H2, H11, H19, H21, H26 | 8 modules |
| **COLOSSUS** | H4, H7, H8, H9, H10, H11, H15, H17, H18, H25 | H20, H29 | 12 modules |
| **HANIEL** | H1, H2, H5, H6, H14, H21, H23, H26, H28 | H13 | 10 modules |
| **RAZIEL** | H4, H13, H16, H19, H20, H24, H29 | H1, H6, H8, H14, H15, H25 | 13 modules |

---

## NODE 1: MICHA PASS 1 — INTELLIGENT ROUTER

### Step 1: Add Node

- Click **+** on canvas → **Core** → **HTTP Request**
- Rename to: `MICHA Pass 1 — Intelligent Router (Anthropic)`

### Step 2: Parameters Tab

| Field | Value | fx |
|-------|-------|----|
| **Method** | POST | — |
| **URL** | `https://api.anthropic.com/v1/messages` | OFF |
| **Authentication** | None | — |

### Step 3: Send Headers — ON (3 headers)

| Name | Value | fx |
|------|-------|----|
| `Content-Type` | `application/json` | OFF |
| `x-api-key` | `sk-ant-YOUR_ANTHROPIC_API_KEY` | OFF |
| `anthropic-version` | `2023-06-01` | OFF |

### Step 4: Send Body — ON

| Field | Selection |
|-------|-----------|
| **Body Content Type** | JSON |
| **Specify Body** | Using JSON ← NOT "Using Fields Below" |

### Step 5: JSON Body — ⚠️ fx ON (Expression Mode)

```
{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 3000,
  "temperature": 0,
  "system": "You are MICHA, CIO and Intelligent Router of the Uriel Covenant AI Collective, operating under METATRON v10.0.\n\nPrincipal: William Earl Lemon. Authority: ABSOLUTE.\nStyle: Zero placation. Precise routing. No filler.\n\nYou are performing PASS 1 of 2. Your job is to READ all incoming HUNTER module data, ANALYZE what matters today, and produce TARGETED BRIEFINGS for four specialist agents.\n\nEach agent will receive the full dataset, but YOUR BRIEFING tells them WHERE TO FOCUS.\n\nROUTING TABLE — Which modules each agent should prioritize:\n\nURIEL (Strategic Synthesis — OpenAI GPT-4.1-mini):\n- PRIMARY: H3 (Macro Regime), H12 (Sector Rotation), H27 (FRED Economic)\n- SECONDARY: H2 (Political macro impact), H11 (VIX regime signal), H19 (DXY currency), H21 (Congressional policy), H26 (Geopolitical macro)\n- FOCUS: Market regime determination, sector money flow, Fed impact on silver thesis\n\nCOLOSSUS (Technical Analysis — xAI Grok-3-mini-fast):\n- PRIMARY: H7 (RSI), H8 (Volume Anomaly), H9 (Patterns), H10 (Breakouts), H11 (VIX), H15 (Short Interest), H17 (Options Flow), H18 (Price/Volume)\n- SECONDARY: H4 (Discovery scan), H20 (Commodity price), H25 (Dark Pool), H29 (Metals price action)\n- FOCUS: RSI extremes, volume spikes, squeeze setups, VIX regime, technical bias\n\nHANIEL (Research Intelligence — Google Gemini-2.0-flash):\n- PRIMARY: H1 (13F/13D), H2 (Political News), H5 (8-K Events), H6 (SC 13D Activist), H14 (Earnings Calendar), H21 (Congressional), H23 (Institutional 13F), H26 (Geopolitical), H28 (Earnings Estimates)\n- SECONDARY: H13 (Insider filing context)\n- FOCUS: Whale accumulation, material events, political catalysts, upcoming earnings\n\nRAZIEL (Pattern Analysis & Counter-Thesis — DeepSeek):\n- PRIMARY: H4 (Discovery anomalies), H13 (Insider Patterns), H16 (Sentiment Divergence), H19 (DXY Correlation), H20 (Commodity Correlation), H24 (Social Sentiment), H29 (Precious Metals thesis)\n- SECONDARY: H1 (Whale patterns), H6 (Activist patterns), H8 (Volume anomalies), H14 (Earnings timing), H15 (Short interest counter-thesis), H25 (Dark Pool risk)\n- FOCUS: Correlation breakdowns, sentiment vs price conflicts, counter-thesis for every bull case, hidden risk\n\nRESPOND IN STRICT JSON FORMAT — NO MARKDOWN, NO BACKTICKS, JUST RAW JSON:\n\n{\n  \"uriel_briefing\": \"[Your targeted briefing for URIEL — what matters in the macro data today, what to focus on, any anomalies you spotted that affect regime assessment]\",\n  \"colossus_briefing\": \"[Your targeted briefing for COLOSSUS — which symbols show technical signals, volume anomalies detected, VIX status, any squeeze setups to investigate]\",\n  \"haniel_briefing\": \"[Your targeted briefing for HANIEL — which filings matter, political developments to analyze, upcoming earnings that could move markets]\",\n  \"raziel_briefing\": \"[Your targeted briefing for RAZIEL — correlations that look wrong, sentiment divergences spotted, specific counter-thesis targets, hidden risks]\",\n  \"anomalies\": [\"[List of anything unusual in the data that ALL agents should know about]\"],\n  \"data_quality\": \"[Rate the incoming data: STRONG / PARTIAL / DEGRADED — note any modules that returned errors or empty data]\"\n}",
  "messages": [
    {
      "role": "user",
      "content": "Read all HUNTER module data below. Analyze it. Produce targeted briefings for each agent per the routing table. Respond in strict JSON only.\n\nHUNTER DATA:\n{{ JSON.stringify($json) }}"
    }
  ]
}
```

### Step 6: Settings Tab

| Setting | Value |
|---------|-------|
| **Continue on Fail** | ☑️ ON |

### Step 7: Note

`MICHA Pass 1 — Intelligent Router. Reads all H-module data, produces targeted briefings per agent. Temperature 0 for consistency. Strict JSON output. This is the brain that doesn't exist as a product.`

### Step 8: Connections

| From | To |
|------|-----|
| Data Aggregator (output) | → MICHA Pass 1 (input) |
| MICHA Pass 1 (output) | → Intelligent Router (Code node) |

---

## NODE 2: INTELLIGENT ROUTER (Code Node)

### Step 1: Add Node or Reuse

Use the **Data Slicer** node you already have. Rename it to: `Intelligent Router — Agent Payloads`

### Step 2: Configuration

| Field | Value |
|-------|-------|
| **Language** | JavaScript |
| **Mode** | Run Once for All Items |

### Step 3: Code — Paste this entire block:

```javascript
// INTELLIGENT ROUTER — Parses MICHA Pass 1 briefings + original data
// Produces 4 targeted payloads for parallel agent execution
// v10.0 — Each agent gets full data + MICHA's targeted briefing

// Get MICHA Pass 1 response (Anthropic format)
const michaResponse = $input.first().json;

// Parse MICHA's briefings from Anthropic API response
let briefings = {};
try {
  let responseText = '';
  
  if (michaResponse.content && Array.isArray(michaResponse.content)) {
    responseText = michaResponse.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');
  } else if (typeof michaResponse.content === 'string') {
    responseText = michaResponse.content;
  }
  
  // Clean any markdown code fences if MICHA included them
  responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  briefings = JSON.parse(responseText);
} catch (e) {
  // If MICHA's response doesn't parse, use fallback briefings
  briefings = {
    uriel_briefing: "MICHA routing failed. Analyze all macro data: H3, H12, H27, H11, H19. Determine regime and sector rotation.",
    colossus_briefing: "MICHA routing failed. Analyze all technical data: H7-H10, H15, H17, H18. Flag RSI extremes and volume anomalies.",
    haniel_briefing: "MICHA routing failed. Analyze all filings and news: H1, H2, H5, H6, H14, H21, H23, H26, H28. Report whale activity and catalysts.",
    raziel_briefing: "MICHA routing failed. Analyze correlations and sentiment: H4, H13, H16, H19, H20, H24, H29. Counter-thesis everything.",
    anomalies: ["MICHA Parse Error: " + e.message],
    data_quality: "DEGRADED"
  };
}

// Get original H-module data from upstream node
// References the Data Aggregator node by name
let originalData = '';
try {
  const aggregatorData = $('Data Aggregator').all();
  originalData = JSON.stringify(aggregatorData.map(item => item.json));
} catch (e) {
  // Fallback — try Merge All Module Results
  try {
    const mergeData = $('Merge All Module Results').all();
    originalData = JSON.stringify(mergeData.map(item => item.json));
  } catch (e2) {
    originalData = JSON.stringify({ error: "Could not retrieve original H-module data" });
  }
}

// Build 4 agent payloads
return [{
  json: {
    uriel_payload: JSON.stringify({
      agent: "URIEL",
      role: "Strategic Synthesis",
      briefing: briefings.uriel_briefing || "No briefing available",
      primary_modules: ["H3", "H12", "H27"],
      secondary_modules: ["H2", "H11", "H19", "H21", "H26"],
      anomalies: briefings.anomalies || [],
      data_quality: briefings.data_quality || "UNKNOWN",
      hunter_data: originalData
    }),
    
    colossus_payload: JSON.stringify({
      agent: "COLOSSUS",
      role: "Technical Analysis",
      briefing: briefings.colossus_briefing || "No briefing available",
      primary_modules: ["H7", "H8", "H9", "H10", "H11", "H15", "H17", "H18"],
      secondary_modules: ["H4", "H20", "H25", "H29"],
      anomalies: briefings.anomalies || [],
      data_quality: briefings.data_quality || "UNKNOWN",
      hunter_data: originalData
    }),
    
    haniel_payload: JSON.stringify({
      agent: "HANIEL",
      role: "Research Intelligence",
      briefing: briefings.haniel_briefing || "No briefing available",
      primary_modules: ["H1", "H2", "H5", "H6", "H14", "H21", "H23", "H26", "H28"],
      secondary_modules: ["H13"],
      anomalies: briefings.anomalies || [],
      data_quality: briefings.data_quality || "UNKNOWN",
      hunter_data: originalData
    }),
    
    raziel_payload: JSON.stringify({
      agent: "RAZIEL",
      role: "Pattern Analysis & Counter-Thesis",
      briefing: briefings.raziel_briefing || "No briefing available",
      primary_modules: ["H4", "H13", "H16", "H19", "H20", "H24", "H29"],
      secondary_modules: ["H1", "H6", "H8", "H14", "H15", "H25"],
      anomalies: briefings.anomalies || [],
      data_quality: briefings.data_quality || "UNKNOWN",
      hunter_data: originalData
    }),
    
    timestamp: new Date().toISOString(),
    version: "METATRON_v10.0_HUB_SPOKE",
    router_status: briefings.data_quality || "UNKNOWN"
  }
}];
```

### Step 4: Settings Tab

| Setting | Value |
|---------|-------|
| **Continue on Fail** | ☑️ ON |

### Step 5: Note

`Intelligent Router — Parses MICHA Pass 1 briefings, references original H-module data from Data Aggregator, builds 4 targeted payloads. Fallback briefings if MICHA parse fails. This is the node that makes it a product.`

### Step 6: Connections

| From | To |
|------|-----|
| MICHA Pass 1 (output) | → Intelligent Router (input) |
| Intelligent Router (output) | → URIEL (input) |
| Intelligent Router (output) | → COLOSSUS (input) |
| Intelligent Router (output) | → HANIEL (input) |
| Intelligent Router (output) | → RAZIEL (input) |

---

## UPDATED AGENT BODIES — ONE CHANGE PER AGENT

Each agent's body now references ITS OWN payload field instead of the generic `$json.full_payload`.

### URIEL — Change ONLY the user content line:

**Old:**
```
"content": "Analyze this HUNTER module data and provide your strategic synthesis: {{ $json.full_payload }}"
```

**New:**
```
"content": "Analyze this HUNTER module data and provide your strategic synthesis: {{ $json.uriel_payload }}"
```

### COLOSSUS — Change ONLY the user content line:

**Old:**
```
"content": "Analyze this HUNTER module data and provide your technical analysis: {{ $json.full_payload }}"
```

**New:**
```
"content": "Analyze this HUNTER module data and provide your technical analysis: {{ $json.colossus_payload }}"
```

### HANIEL — Change ONLY the text field:

**Old (at the end of the text field):**
```
HUNTER DATA TO ANALYZE: {{ $json.full_payload }}"
```

**New:**
```
HUNTER DATA TO ANALYZE: {{ $json.haniel_payload }}"
```

### RAZIEL — Change ONLY the user content line:

**Old:**
```
"content": "Analyze this HUNTER module data and provide your pattern analysis with counter-thesis: {{ $json.full_payload }}"
```

**New:**
```
"content": "Analyze this HUNTER module data and provide your pattern analysis with counter-thesis: {{ $json.raziel_payload }}"
```

---

## MERGE COLLECTIVE — No Change

| Setting | Value |
|---------|-------|
| **Mode** | Append |
| **Inputs** | 4 (auto-adds as you connect agents) |

Connections same as before:
- URIEL → Input 1
- COLOSSUS → Input 2
- HANIEL → Input 3
- RAZIEL → Input 4

---

## MICHA PASS 2 — FINAL SYNTHESIS

This is the MICHA Orchestrator node you already built. **Rename it** to: `MICHA Pass 2 — Final Synthesis (Anthropic)`

**No changes to configuration.** The body, headers, and system prompt remain the same. It receives merged agent outputs and synthesizes the final briefing.

### Connections

| From | To |
|------|-----|
| Merge Collective (output) | → MICHA Pass 2 (input) |
| MICHA Pass 2 (output) | → Response Extractor (input) |

---

## RESPONSE EXTRACTOR — No Change

Same code as previously provided. Extracts text from Anthropic API response format.

### Connections

| From | To |
|------|-----|
| Response Extractor (output) | → Format for Delivery (input) |

Format for Delivery → Telegram Alert + GitHub Archive (already wired)

---

## COMPLETE WIRE MAP — FINAL STATE

```
Merge All Module Results (Append)
         ↓
    Data Aggregator
         ↓
    MICHA Pass 1 — Intelligent Router (Anthropic, temp=0)
      "Reads all data. Produces 4 targeted briefings."
         ↓
    Intelligent Router (Code — builds 4 payloads)
      "Parses briefings + attaches original data per agent"
         ↓
    ┌──────────┬──────────┬──────────┬──────────┐
    ↓          ↓          ↓          ↓
  URIEL     COLOSSUS   HANIEL     RAZIEL
 (OpenAI)    (xAI)    (Google)  (DeepSeek)
    ↓          ↓          ↓          ↓
    └──────────┴──────────┴──────────┘
         ↓
    Merge Collective (Append, 4 inputs)
         ↓
    MICHA Pass 2 — Final Synthesis (Anthropic, 4096 tokens)
      "Synthesizes all 4 agents. Concurrence scoring. Counter-thesis. KILLSWITCH."
         ↓
    Response Extractor (Code)
         ↓
    Format for Delivery
         ↓
    ┌────────────┬──────────────┐
    ↓            ↓
Telegram     GitHub Archive
  Alert

[OLD METATRON AI Synthesis — disconnected, parked as fallback]
```

---

## WHAT THIS MEANS AS A PRODUCT

This architecture has three layers that don't exist together anywhere else:

1. **Intelligent Routing** — MICHA reads the data first and tells each agent what to focus on. Not random distribution. Not round-robin. Context-aware briefings per specialist.

2. **Parallel Specialist Execution** — 4 different models from 4 different providers, each with domain-specific system prompts, running simultaneously. Provider diversity = no single point of failure.

3. **Orchestrated Synthesis with Concurrence** — Not just "merge and summarize." Actual scoring of agreement levels, conflict flagging, counter-thesis enforcement, and KILLSWITCH risk assessment.

The template is the architecture. The IP is the prompts, routing table, and concurrence methodology. The product is the assembled workflow.

---

**METATRON v10.0 | HUB-AND-SPOKE | COLLECTIVE CONCURRENCE**
**KILLSWITCH: ARMED**

🔱

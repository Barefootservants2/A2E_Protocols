# HUNTER v3.3 — REQUIREMENTS PART 4 of 5
# AI AGENTS + DATA AGGREGATOR + MICHA SYNTHESIS + OUTPUT LAYER
# Ashes2Echoes LLC | METATRON v10.8 | For: n8n Build AI
---

## CONTEXT

Parts 1-3 covered all 42 H-modules. Part 4 covers the synthesis engine:
DATA AGGREGATOR packages everything, 4 AI agents analyze in parallel,
MICHA synthesizes the consensus, output goes to Telegram + CIL + GitHub.

CURRENT STATUS: Agents 0/4 failing. This is the primary blocker.
All H-modules are confirmed working. Only the agents are broken.

---

## DATA AGGREGATOR (Code node)

INPUT: HUNTER MASTER MERGE output (all H1-H42 signals)
FUNCTION: Packages all module outputs into hunter_payload for agents
OUTPUT:
{
  scan_timestamp: ISO string,
  hunter_version: "v3.3",
  metatron_version: "v10.8",
  module_summary: { H1: {status, count}, H2a: {...}, ... },  // all 42 modules
  error_count: number,
  errors: [string],
  signals: { H1: [...], H2a: [...], ... },  // top 10 signals per module
  gate9_status: { gate_pass: bool, kill_switch: bool },
  influence_correlations: [...],   // H35 output
  metals_data: {...},              // H29 output
  comex_data: {...}                // H42 output
}

The entire object is serialized as hunter_payload (JSON string) and passed to all 4 agents.

---

## AGENT ARCHITECTURE — PARALLEL EXECUTION

All 4 agents receive the SAME hunter_payload simultaneously.
All 4 connect FROM: DATA AGGREGATOR
All 4 connect TO: HUNTER AGENT MERGE (merge type: append)

CURRENT ISSUE: Agents returning 0/4. Multiple fix attempts failed.

ROOT CAUSE CONFIRMED: n8n expression evaluation and body serialization is
the blocker. The hunter_payload JSON object embedded in agent request bodies
is either not evaluating or causing malformed JSON.

THE FIX THAT WILL WORK:
Use HTTP Request node type (NOT Code node).
Set body Content Type to: JSON
In the messages array user content field, use ONLY: {{ $json.hunter_payload }}
Do NOT use JSON.stringify(). Do NOT use Code nodes. Do NOT concatenate strings.
The n8n expression {{ $json.hunter_payload }} passes the value directly.

---

## AGENT 1 — URIEL (Strategic Opportunity)

TYPE: HTTP Request node
METHOD: POST
URL: https://api.openai.com/v1/chat/completions
AUTH: Generic Credential Type → Header Auth → "URIEL API Key" (ID: HeSyKKuHzaqLk2tp)
BODY (JSON):
{
  "model": "gpt-4o",
  "max_tokens": 2000,
  "messages": [
    {
      "role": "system",
      "content": "You are URIEL, CEO/Strategic Director of the Uriel Covenant AI Collective. Analyze the HUNTER market scan data and identify the top opportunities. Ring 3 = structural hold 6-12 months. Ring 4 = tactical 1-4 weeks. Ring 5 = lottery max 2% allocation. ZERO portfolio awareness. Find what the Principal does NOT know about. OUTPUT JSON ONLY: {\"agent\":\"URIEL\",\"opportunities\":[{\"ticker\":\"\",\"signal_tier\":\"PRIME|STRONG|PROBE\",\"confidence\":0,\"thesis\":\"\",\"key_signal\":\"\",\"catalyst\":\"\",\"entry_zone\":\"\",\"stop\":\"\",\"target\":\"\",\"ring\":\"3|4|5\",\"time_horizon\":\"\"}],\"macro_regime\":\"BULL|BEAR|NEUTRAL|VOLATILE\",\"market_breadth\":\"EXPANDING|CONTRACTING|MIXED\",\"hot_sector\":\"\",\"top_opportunity\":\"\"}"
    },
    {
      "role": "user",
      "content": "={{ $json.hunter_payload }}"
    }
  ]
}
EXPECTED OUTPUT: JSON with choices[0].message.content containing URIEL JSON schema

## AGENT 2 — COLOSSUS (Technical Setups)

TYPE: HTTP Request node
METHOD: POST
URL: https://api.x.ai/v1/chat/completions
AUTH: Generic Credential Type → Header Auth → "COLOSSUS API Key" (ID: PahnYDcKUA07lJZv)
BODY (JSON):
{
  "model": "grok-3",
  "max_tokens": 2000,
  "messages": [
    {
      "role": "system",
      "content": "You are COLOSSUS, CTO/Technical Analyst of the Uriel Covenant AI Collective. Identify the strongest technical setups from the scan data. Focus on VWAP reclaims, breakouts, momentum continuation, and volume-confirmed moves. ZERO portfolio awareness. OUTPUT JSON ONLY: {\"agent\":\"COLOSSUS\",\"setups\":[{\"ticker\":\"\",\"setup_type\":\"BREAKOUT|VWAP_RECLAIM|MOMENTUM|REVERSAL|SQUEEZE\",\"confidence\":0,\"entry\":\"\",\"stop\":\"\",\"target\":\"\",\"r_r\":0,\"volume_signal\":\"HIGH|NORMAL|LOW\",\"momentum\":\"STRONG|MODERATE|WEAK\",\"timeframe\":\"intraday|swing|position\"}],\"market_structure\":\"TRENDING|RANGING|BREAKING\",\"vix_regime\":\"LOW|ELEVATED|HIGH\",\"best_setup\":\"\"}"
    },
    {
      "role": "user",
      "content": "={{ $json.hunter_payload }}"
    }
  ]
}

## AGENT 3 — HANIEL (Intelligence Signals)

HANIEL requires TWO nodes:

NODE A — HANIEL Payload Format (Code node)
PURPOSE: Gemini requires different request format than OpenAI-compatible APIs
INPUT: hunter_payload from DATA AGGREGATOR
CODE:
const d = $input.first().json;
const sysPrompt = "You are HANIEL, CPO and Research Director of the Uriel Covenant AI Collective. Analyze filings, congressional trades, lobbying data, and institutional positioning from the HUNTER scan. Flag H35 Influence Chain correlations as HIGH PRIORITY. ZERO portfolio awareness. OUTPUT JSON ONLY: {\"agent\":\"HANIEL\",\"intelligence_signals\":[{\"ticker\":\"\",\"signal_type\":\"INSIDER_CLUSTER|CONGRESSIONAL_TRADE|CONTRACT_AWARD|WHALE_13F|LOBBYING_CORRELATION|INFLUENCE_CONVERGENCE\",\"signal_tier\":\"PRIME|STRONG|PROBE\",\"confidence\":0,\"source_module\":\"\",\"key_finding\":\"\",\"dollars_involved\":0,\"days_since_event\":0,\"regulatory_risk\":\"LOW|MEDIUM|HIGH\",\"thesis_implication\":\"\"}],\"h35_alerts\":\"\",\"whale_activity\":\"\",\"top_intelligence_pick\":\"\"}";
const fullText = sysPrompt + "\n\nDATA:\n" + JSON.stringify(d.hunter_payload || d);
return [{json: {
  gemini_payload: {
    contents: [{role: "user", parts: [{text: fullText}]}],
    generationConfig: {maxOutputTokens: 2000, temperature: 0.3}
  }
}}];

NODE B — HANIEL Intelligence Signals (HTTP Request node)
METHOD: POST
URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
AUTH: Generic Credential Type → Header Auth → "Haniel API Key" (ID: AitODdRhySgSD8nm)
BODY: Use expression ={{ $json.gemini_payload }} (passes the pre-built Gemini format)
NOTE: Gemini key is passed as Header Auth via the credential. The credential value
should be set as: Header Name = "x-goog-api-key", Value = [Gemini API key]

## AGENT 4 — RAZIEL (Counter-Thesis)

TYPE: HTTP Request node
METHOD: POST
URL: https://api.deepseek.com/v1/chat/completions
AUTH: Generic Credential Type → Header Auth → "RAZIEL API Key" (ID: CnNJfQmlNmwePa7P)
BODY (JSON):
{
  "model": "deepseek-chat",
  "max_tokens": 2000,
  "messages": [
    {
      "role": "system",
      "content": "You are RAZIEL, CAO/Counter-Thesis Analyst of the Uriel Covenant AI Collective. Challenge every opportunity identified in the scan data. Find failure modes, timing risks, correlation risks, and liquidity risks. A low RAZIEL score means clean thesis. High score means dangerous. Apply IRONCLAD rules: stop at -5%, trim +10% (sell 50%), trim +20% (sell 60%), no same-day re-entry, correlation kill switch if DXY+yields adverse. OUTPUT JSON ONLY: {\"agent\":\"RAZIEL\",\"counter_analyses\":[{\"ticker\":\"\",\"raziel_score\":0,\"primary_risk\":\"\",\"secondary_risk\":\"\",\"correlation_risk\":\"Y|N\",\"timing_risk\":\"\",\"liquidity_risk\":\"\",\"ironclad_flag\":\"Y|N\",\"verdict\":\"CLEAR|CAUTION|ABORT\",\"abort_reason\":\"\"}],\"market_risks\":\"\",\"do_not_touch\":[],\"cleanest_thesis\":\"\"}"
    },
    {
      "role": "user",
      "content": "={{ $json.hunter_payload }}"
    }
  ]
}

---

## HUNTER AGENT MERGE

TYPE: Merge node (append mode)
INPUT: URIEL + COLOSSUS + HANIEL + RAZIEL outputs
OUTPUT: Array of 4 items (one per agent response)
NOTE: alwaysOutputData=true ensures pipeline continues even if agents fail

---

## HUNTER SYNTHESIS — MICHA (Code node)

INPUT: HUNTER AGENT MERGE (4 agent responses)
FUNCTION: Parses each agent's JSON response, cross-validates, ranks opportunities

CURRENT PARSING LOGIC:
  For each agent response, extract content from:
    OpenAI: choices[0].message.content
    xAI: choices[0].message.content
    Gemini: candidates[0].content.parts[0].text
    DeepSeek: choices[0].message.content
  Strip ```json fences, parse JSON
  Cross-validate: tickers appearing in multiple agents get confidence boost
  RAZIEL ABORT = remove from final list regardless of other scores

EXPECTED OUTPUT:
{
  scan_timestamp: ISO string,
  hunter_version: "v3.3",
  opportunities: [{
    ticker, signal_tier, confidence, thesis, key_signal, catalyst,
    entry_zone, stop, target, ring, time_horizon,
    agent_consensus: number (1-4),
    raziel_score: number,
    raziel_verdict: "CLEAR|CAUTION|ABORT"
  }],
  prime_count: number,
  strong_count: number,
  total_count: number,
  top_opportunities: top 3 for CIL,
  macro_regime: from URIEL,
  market_breadth: from URIEL,
  best_sector: from URIEL,
  do_not_touch: from RAZIEL,
  h35_alerts: from HANIEL,
  agents_responded: 0-4,
  synthesis_timestamp: ISO string
}

ENHANCEMENT: Add cross-agent consensus multiplier:
  If 4/4 agents flag same ticker → confidence × 1.5
  If 3/4 agents flag same ticker → confidence × 1.25
  If RAZIEL score > 70 → automatic CAUTION tag regardless of other scores
  If H35 convergence_score > 70 on same ticker → PRIME override

---

## OUTPUT LAYER

### Format Telegram Brief (Code node)
INPUT: HUNTER SYNTHESIS output
OUTPUT: {message: HTML-formatted string}
FORMAT:
🔱 <b>HUNTER v3.3 — DISCOVERY BRIEF</b>
{timestamp} ET

<b>Regime:</b> {macro_regime} | <b>Breadth:</b> {market_breadth}
<b>Hot Sector:</b> {best_sector} | <b>Agents:</b> {agents_responded}/4

[For each PRIME signal:]
🎯 <b>{ticker}</b> [{ring}] — {signal_tier}
  Thesis: {thesis}
  Entry: {entry_zone} | Stop: {stop} | T1: {target}
  Consensus: {agent_consensus}/4 | RAZIEL: {raziel_verdict}

<i>Do Not Touch: {do_not_touch}</i>

<i>HUNTER v3.3 | METATRON v10.8</i>

### Send Telegram Brief (Telegram node)
CREDENTIAL: Telegram account (ID: 1cUBFkMQENfAXP8x)
CHAT ID: 8203545338 (Principal private chat)
PARSE MODE: HTML

### Fire CIL Webhook (Code node)
FUNCTION: Packages top 3 opportunities for CIL v6.1
OUTPUT: {fired: bool, reason: string, cil_payload: object}
NOTE: If no PRIME signals → fired:false, reason:"No PRIME candidates", cil_payload:null

### CIL v6.1 Webhook (HTTP Request node)
URL: {{$vars.CIL_WEBHOOK_URL}}
METHOD: POST
SENDS: top_opportunities to CIL for 5-agent collective consensus

### GitHub Archive Write (HTTP Request node)
URL: https://api.github.com/repos/Barefootservants2/AIORA/contents/{{$json.github_path}}
CREDENTIAL: GitHub_A2E_Token (Header Auth, ID: jdjVIw73qgFd0a4Z)
ARCHIVES: Every scan to Barefootservants2/AIORA/reports/hunter_daily/

---

## AGENT ENHANCEMENT ROADMAP

1. ADD SARIEL as 5th agent (Perplexity Sonar Pro)
   URL: https://api.perplexity.ai/chat/completions
   Model: sonar-pro
   Role: Real-time web intelligence with citations
   Credential: stored as n8n variable SARIEL_API_KEY
   Value-add: Live web search fills gap between H28 headlines and agent synthesis

2. ADD Local Ollama as 6th pre-filter agent
   URL: http://[The_Collective_public_IP]:11434/api/chat
   Model: llama3.3:70b (42GB, confirmed downloaded)
   Role: Fast local pre-filter pass — eliminates weak signals before cloud agents
   Requires: Cloudflare tunnel or ngrok on The_Collective to expose localhost:11434
   Cost: $0 per call after hardware

3. MICHA synthesis enhancement:
   Current: simple merge. Target: weighted consensus scoring matrix.

---
PART 4 OF 5 COMPLETE. Part 5 covers Five Ring framework, return model, and full action list.

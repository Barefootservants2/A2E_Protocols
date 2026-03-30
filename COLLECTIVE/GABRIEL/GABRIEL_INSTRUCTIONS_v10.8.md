# GABRIEL — FULL AGENT INSTRUCTIONS v10.8
## Chief Automation Officer | Uriel Covenant AI Collective
## Platform: n8n Cloud | Instance: ashes2echoes.app.n8n.cloud
## Effective: March 30, 2026
## Supersedes: GABRIEL_INSTRUCTIONS_v10.6.md

---

## IDENTITY

GABRIEL is the Chief Automation Officer of the Uriel Covenant AI Collective. GABRIEL is not an AI model — GABRIEL is the n8n workflow automation platform operating as an agent. GABRIEL executes scheduled tasks, manages API integrations, runs the overnight watch, and escalates to the Collective when conditions warrant.

**Principal:** William Earl Lemon — Authority: ABSOLUTE
**Entity:** Ashes2Echoes LLC
**Instance:** https://ashes2echoes.app.n8n.cloud
**Workflow ID (Overnight Watch):** fwKiBHtedNQ1n34H

---

## LIVE WORKFLOWS (Production)

### GABRIEL Overnight Watch v2.1 (PRIMARY)
**Status:** LIVE, VALIDATED (March 29, 2026)
**Schedule:**
- Weeknights: `0 */30 22-23,0-13 * * 1-5` (every 30 min, 6PM-9:25AM ET, Mon-Fri)
- Weekends: `0 0 */2 * * 0,6` (every 2 hours, Sat-Sun)
- Morning Brief: `0 12 * * 1-5` (8AM ET, Mon-Fri)

**Symbols monitored (17):**
ES=F (S&P futures), NQ=F (Nasdaq futures), YM=F (Dow futures), RTY=F (Russell 2K futures), GC=F (Gold), SI=F (Silver — thesis position), CL=F (Crude oil), VIX, BTC-USD, ETH-USD, UUP (DXY proxy ETF), TLT (Bond proxy ETF), DIA, SPY, QQQ, DX=F (ICE Dollar Index futures — Kill Switch), ZB=F (30Y Bond futures — Kill Switch)

**Escalation Logic:**
- GREEN: Log to Supabase. No alert. Quiet overnight.
- YELLOW: Telegram alert to Principal. Content: market snapshot + yellow triggers + news alerts.
- RED: Telegram + Gmail (ashes2echoes.platform@gmail.com) + CIL webhook.
- Kill Switch Pre-Alert: DX=F rising >0.3% + ZB=F falling >0.3% + VIX >30 → RED alert with KILL SWITCH PRE-ALERT block.

**Threshold Engine v2.1:**
- DXY check is directional only: UUP rising >0.5% = YELLOW (falling dollar is NOT a risk signal)
- Kill Switch uses DX=F and ZB=F (24hr futures) NOT UUP/TLT (ETFs with near-zero overnight volume)
- Multi-signal: 3+ market YELLOW triggers (market signals only, not news) = RED
- News escalation added AFTER multi-signal check (news cannot inflate market signal count)

**Morning Brief:**
- Queries Supabase gabriel_overnight_log for last 12 hours
- Computes posture: RISK-OFF (any RED or Kill Switch alert overnight), NEUTRAL (>2 YELLOW), RISK-ON (clean overnight)
- Fetches fresh pre-market data: ES=F, SI=F, GC=F, CL=F, VIX, UUP
- Delivers formatted Telegram message to Principal before market open

### CIL v6.1 (CONSUMER)
GABRIEL fires CIL on RED events via webhook:
POST `https://ashes2echoes.app.n8n.cloud/webhook/9d360d66-4d0e-46e4-9f24-dea7170e1ebe`
Payload: `{ query, domain: "MARKET", urgency: "HIGH", source: "GABRIEL_OVERNIGHT_v2" }`

### SENTINEL v2.0
Portfolio monitor. 26 positions. IRONCLAD enforcement. Fires Telegram on threshold breach.
(Separate workflow — maintained independently)

---

## INFRASTRUCTURE STANDARDS (n8n Code Nodes)

**Node naming:** ALL_CAPS_WITH_UNDERSCORES
**Variable naming:** camelCase
**Error handling:** ALWAYS wrap external HTTP calls in try/catch. Never throw. Return partial data with error field.
**alwaysOutputData:** ALWAYS false on Code nodes and HTTP Request nodes (zombie bug prevention)
**GitHub PUTs:** ALWAYS GET file for SHA before any PUT operation
**Telegram:** HTML parse mode only. Escape `< > &` in all dynamic content.
**Data flow:** When downstream nodes need upstream data, use `$('NODE_NAME').first().json.field` not `$json.field` — $json contains immediate upstream output only (this was the RED Alert Email bug)
**Supabase:** Project ID bwtguoaakkmsnzomswem — NEVER hardcode anon keys, reference n8n credentials

---

## PENDING BUILD QUEUE

**P0 — HUNTER Credential Repair:**
- Finnhub keys corrupted: H4, H5, H6, H25, H30 (80 chars, should be 40)
- TwelveData key expired: H7-H9, H11, H14, H15, H18-H20, H22
- metals.dev corrupted: H29

**P1 — HUNTER H30-H35 Normalizer Scripts:**
6 nodes on canvas, wired, no JavaScript code written.
Output schema: `{ module, signal_value, raw, timestamp }`

**P2 — HUNTER → CIL Webhook:**
POST to CIL production webhook on discovery run completion.

**P3 — GABRIEL Test Harness:**
Separate n8n workflow injecting mock data to simulate all escalation paths without touching live APIs.

**P4 — GABRIEL v3.0 scope:**
- Telegram voice message support for Morning Brief
- n8n AI Agent nodes (replacing raw HTTP Request nodes for agent calls)
- Supabase vector store for historical signal retrieval

---

## ESCALATION AND ALERT REFERENCE

| Condition | Alert Type | Recipients | Content |
|-----------|-----------|------------|---------|
| GREEN | None | — | Supabase log only |
| YELLOW | Telegram | Principal | Market snapshot + yellow triggers |
| RED | Telegram + Email | Principal | Full report + red triggers |
| RED with Kill Switch Pre-Alert | Telegram + Email | Principal | Full report + KILL SWITCH PRE-ALERT block |
| Kill Switch FIRED | Telegram + Email | Principal | "KILL SWITCH FIRED — [conditions] — 50% metals auto-reduced" |

**Telegram channel:** Chat ID 8203545338
**Email:** ashes2echoes.platform@gmail.com

---

## GATE 0.75 — AUTOMATION COMPLIANCE

All workflow outputs and data transformations must adhere to:
1. VERBATIM GATE — Pass raw data through unchanged. No smoothing.
2. EVIDENCE+NULL GATE — If a fetch fails, pass `{ error: true }`. Never fabricate data.
3. WIDE NET GATE — Market data pulls cover all 17 symbols. No selective fetching.
4. CORRELATION GATE — DX=F and ZB=F are in every overnight run. Kill Switch inputs always checked.

---

*GABRIEL v10.8 | Ashes2Echoes LLC | Uriel Covenant AI Collective*
*METATRON v10.8 governs all decisions*

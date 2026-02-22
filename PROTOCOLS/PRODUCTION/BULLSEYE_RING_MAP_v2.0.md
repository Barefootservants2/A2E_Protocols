# BULLSEYE RING MAP v2.0
## A2E Platform Architecture — Complete Ring Definition

---

**Version:** 2.0  
**Date:** February 22, 2026  
**Author:** MICHA v10.4  
**Change from v1.0:** Added Ring 6 (Security & Compliance), added Integration Protocols node to Ring 4, aligned with ByteByteGo Secure Systems framework for enterprise-grade coverage  
**Reference:** MCP_BULLSEYE_ARCHITECTURE.md (build-level detail per ring)

---

## RING ARCHITECTURE — CENTER OUT

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Ring 6: SECURITY & COMPLIANCE (NEW)                          │
│     ┌─────────────────────────────────────────────────────┐     │
│     │                                                     │     │
│     │   Ring 5: APPLICATIONS                              │     │
│     │     ┌─────────────────────────────────────────┐     │     │
│     │     │                                         │     │     │
│     │     │   Ring 4: INFRASTRUCTURE                │     │     │
│     │     │     ┌─────────────────────────────┐     │     │     │
│     │     │     │                             │     │     │
│     │     │     │   Ring 3: CAPABILITIES      │     │     │     │
│     │     │     │     ┌─────────────────┐     │     │     │     │
│     │     │     │     │                 │     │     │     │     │
│     │     │     │     │  Ring 2: PROTO  │     │     │     │     │
│     │     │     │     │   ┌───────┐     │     │     │     │     │
│     │     │     │     │   │Ring 1 │     │     │     │     │     │
│     │     │     │     │   │COLLCTV│     │     │     │     │     │
│     │     │     │     │   │  ┌─┐  │     │     │     │     │     │
│     │     │     │     │   │  │0│  │     │     │     │     │     │
│     │     │     │     │   │  └─┘  │     │     │     │     │     │
│     │     │     │     │   └───────┘     │     │     │     │     │
│     │     │     │     └─────────────────┘     │     │     │     │
│     │     │     └─────────────────────────────┘     │     │     │
│     │     └─────────────────────────────────────────┘     │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## RING 0: METATRON (Core)

**Purpose:** Central orchestration — the brain of the Collective  
**MCP Server:** `metatron-mcp-server`

| Node | Function | Status |
|------|----------|--------|
| METATRON Protocol | v10.6 Prime Directive — routing, gate enforcement | ✅ Production |
| KILLSWITCH | Emergency halt — Principal authority only | ✅ Production |
| FIDELITY LOCK | 7-lock output validation system | ✅ Production |
| Type A/B Router | Classifies queries for agent routing | ✅ Production |

**Bullseye Interaction:** Center glow, click → protocol docs, architecture overview, philosophy.

---

## RING 1: COLLECTIVE (Agent Layer)

**Purpose:** The seven agents — who they are, what they do, how they perform  
**MCP Server:** `collective-mcp-server`

| Node | Agent | Role | Platform | Status |
|------|-------|------|----------|--------|
| URIEL | ChatGPT | CEO — Strategic direction, thesis synthesis | OpenAI | ✅ Active |
| MICHA | Claude | CIO — Analysis (Run 2), Execution (Run 4) | Anthropic | ✅ Active |
| COLOSSUS | Grok | CTO — Technical analysis, charting | xAI | ✅ Active |
| HANIEL | Gemini | Political/regulatory intelligence (H30-H35) | Google | ✅ Active |
| RAZIEL | DeepSeek | Deep research, contrarian analysis | DeepSeek | ✅ Active |
| GABRIEL | n8n | Workflow automation, HUNTER orchestration | n8n Cloud | ✅ Active |
| SERAPH | Perplexity | Real-time search, news monitoring | Perplexity | ✅ Active |

**Bullseye Interaction:** Each agent is a clickable node → agent profile, accuracy stats, recent analyses.

---

## RING 2: PROTOCOL STACK

**Purpose:** The rules that govern everything — versioned, enforced, auditable  
**MCP Server:** `protocol-mcp-server`

| Node | Protocol | Version | Function |
|------|----------|---------|----------|
| Confidence Cascade | AIORA v1.0 | 8 gates (+ Gate 7.5) | Probability scoring engine |
| IRONCLAD | v1.0 | Risk management | Position sizing, stop-loss, exposure limits |
| PHOENIX | v10.2 | Session management | Context tracking, carry-forward, close protocol |
| FIDELITY LOCK | v10.3 | Output integrity | 7 locks preventing hallucination/drift |
| DRIFT GUARD | v1.0 | Memory discipline | Check before claiming unavailability |
| HUNTER Protocol | v2.0 | Market scanning | Multi-source intelligence gathering |
| FORGE/ANVIL+ASSAY | v2.0 | Prompt engineering | Scoring, testing, reverse building |

**Bullseye Interaction:** Click any protocol → version history, current parameters, changelog.

---

## RING 3: CAPABILITIES (Market Intelligence)

**Purpose:** What the system CAN DO — live data feeds, analysis tools, signal generation  
**MCP Server:** `market-intel-mcp-server` ⭐ HIGHEST BUILD PRIORITY

| Node | Capability | Data Sources | Gate Alignment |
|------|-----------|--------------|----------------|
| Price & Chart Engine | Real-time pricing, OHLCV, technicals | TwelveData | Gate 1 |
| Fundamental Scanner | Earnings, insider trades, filings | Finnhub, SEC EDGAR | Gate 2 |
| Sentiment Engine | News analysis, short interest, social | NewsAPI, Finnhub | Gate 3 |
| Sector Intelligence | 11 GICS sectors, rotation, relative strength | Alpha Vantage | Gate 4 |
| Macro Monitor | VIX, treasury yields, economic calendar | TwelveData, FRED | Gate 4 |
| Political Intelligence | Congress trades, lobbying, contracts | Congress.gov, Senate LDA, USASpending | H30-H35 |
| Options Flow | Put/call ratios, unusual activity, flow | Finnhub | Gate 6 |
| Web Intelligence | Real-time search on any topic | Perplexity/SARIEL | All gates |

**Bullseye Interaction:** Click any capability → live demo, sample output, API status.

---

## RING 4: INFRASTRUCTURE (Operations & Integration)

**Purpose:** How data moves, trades execute, feedback loops close  
**MCP Server:** `trade-ops-mcp-server` ⭐ HIGH BUILD PRIORITY

| Node | Component | Function | Status |
|------|-----------|----------|--------|
| Trade Logger | trade_log.json | Records entries, exits, outcomes | ✅ Production |
| Portfolio State | Position tracking | Current holdings, allocation, risk | ✅ Production |
| Signal Accuracy | Feedback loop | Win rate per H-module, per agent | 🟡 Manual |
| Regime Classifier | Market context | Bull/bear/chop classification | 🟡 Manual |
| Cascade Scorer | Composite confidence | Aggregates all gates → final score | 🟡 Manual |
| GitHub MCP | 11 tools, 6 agents | Repo ops, file read/write, commits | ✅ Production |
| n8n Orchestration | GABRIEL workflows | HUNTER, SENTINEL, email archive | ✅ Production |
| **INTEGRATION PROTOCOLS** | **API Communication Layer** | **How agents and services talk** | **🆕 NEW** |

### INTEGRATION PROTOCOLS NODE (NEW)

Maps how the Collective communicates internally and externally. Based on industry-standard API protocol patterns.

| Protocol | Current Use in A2E | Status | Future Use |
|----------|-------------------|--------|------------|
| **REST** | GitHub API, Finnhub, TwelveData, Alpha Vantage, SEC EDGAR, Perplexity API | ✅ Production | Primary data fetching pattern |
| **Webhooks** | n8n triggers, Telegram bot notifications, HUNTER scan triggers | ✅ Production | Event-driven agent coordination |
| **SSE (Server-Sent Events)** | Claude streaming responses, real-time chat output | ✅ Implicit | WATCH PAGE live updates |
| **WebSocket** | Not yet deployed | 🔲 Planned | WATCH PAGE real-time dashboard, live price feeds |
| **gRPC** | Not yet deployed | 🔲 Planned | High-performance inter-agent calls if Collective scales |
| **MQTT** | Not yet deployed | 🔲 Evaluated | Lightweight pub/sub for mobile alerts, edge devices |
| **GraphQL** | Not yet deployed | 🔲 Evaluated | Flexible querying for BULLSEYE website — fetch only needed data per node |
| **SOAP** | Not applicable | ❌ Skip | Legacy enterprise only — no A2E use case |
| **EDI** | Not applicable | ❌ Skip | B2B data interchange — no A2E use case |
| **AMQP** | Not yet deployed | 🔲 Evaluated | Message queuing if workflow volume exceeds n8n capacity |

**Priority Build Order:**
1. WebSocket → WATCH PAGE needs real-time price streaming without polling
2. GraphQL → BULLSEYE website frontend needs efficient data fetching per ring/node
3. gRPC → Only if agent-to-agent call volume demands it (post-MCP deployment)
4. MQTT → Only if mobile push notification layer is built

**Bullseye Interaction:** Click Integration Protocols → visual diagram showing which protocol connects which components, live status indicators.

---

## RING 5: APPLICATIONS (User-Facing Tools)

**Purpose:** What the Principal and external users interact with directly

| Node | Application | Function | Status |
|------|------------|----------|--------|
| FORGE/ANVIL+ASSAY | Prompt engineering platform | Score, test, reverse-build prompts | ✅ Production |
| HUNTER Dashboard | Market intelligence display | Scan results, convergence signals | 🟡 Reports only |
| WATCH PAGE | Pipeline-powered thesis tracker | Live tracking of active theses | 🔲 Planned |
| Image Extractor | Chart/image analysis tool | Extract data from screenshots | 🟡 Manual |
| Content Engine | LinkedIn/educational content | Automated posting pipeline | 🔲 Planned |
| BULLSEYE Website | ashes2echoes.com | Interactive platform — the diagram IS the site | 🔲 Planned |
| PhD Modules | Educational content | Candlestick analysis, trading methodology | 🔲 In progress |

**Bullseye Interaction:** Click any application → launch it, demo it, or see documentation.

---

## RING 6: SECURITY & COMPLIANCE (NEW)

**Purpose:** Protect the Collective, its data, its communications, and its operations  
**Reference Framework:** ByteByteGo 12-Domain Secure Systems Design, scoped to A2E  
**Detailed spec:** BULLSEYE_SECURITY_FRAMEWORK_v1.0.md

| Domain | A2E Application | Priority | Status |
|--------|----------------|----------|--------|
| **1. Authentication** | How agents authenticate to APIs, MCP servers, GitHub | 🔴 HIGH | 🟡 Partial — API keys exist, no unified auth |
| **2. Authorization** | Who can trigger what — role-based access across 7 agents | 🔴 HIGH | 🟡 Partial — KILLSWITCH is Principal-only, rest undefined |
| **3. Encryption** | Data in transit between agents, API key management | 🔴 HIGH | 🟡 Partial — HTTPS on APIs, keys in env vars + memory |
| **4. API Security** | n8n webhook endpoints, MCP server endpoints, rate limiting | 🔴 HIGH | 🟡 Partial — some rate limiting, no input validation layer |
| **5. Audit & Compliance** | Trade logging, decision tracking, SEC/FINRA awareness | 🟡 MEDIUM | 🟡 Partial — trade_log.json exists, no audit trail |
| **6. Network Security** | Firewall rules, endpoint protection, DNS security | 🟢 LOW | ⬜ Not started — cloud-hosted, vendor-managed |
| **7. Terminal Security** | Workstation protection, 6-monitor setup security | 🟡 MEDIUM | 🟡 Basic — need endpoint hardening |
| **8. Emergency Response** | Incident response plan, KILLSWITCH expansion, breach protocol | 🟡 MEDIUM | 🟡 Partial — KILLSWITCH exists, no full IR plan |
| **9. Container Security** | Docker/n8n containerization, trusted base images | 🟢 LOW | ⬜ Not started — n8n is cloud-hosted |
| **10. Vulnerability Mgmt** | Dependency scanning, API key rotation, patch management | 🟡 MEDIUM | ⬜ Not started |
| **11. 3rd-Party Management** | Vendor risk for all 7 AI platforms + data providers | 🟡 MEDIUM | ⬜ Not started |
| **12. Disaster Recovery** | Backup strategy, GitHub as source of truth, session recovery | 🟡 MEDIUM | 🟡 Partial — PHOENIX handles session recovery, GitHub is backup |

**Bullseye Interaction:** Click Security ring → dashboard showing compliance status per domain, red/yellow/green indicators, action items.

---

## RING SUMMARY TABLE

| Ring | Name | Nodes | MCP Server | Build Priority |
|------|------|-------|------------|----------------|
| 0 | METATRON | 4 | metatron-mcp | Medium |
| 1 | COLLECTIVE | 7 | collective-mcp | High |
| 2 | PROTOCOL STACK | 7 | protocol-mcp | Low |
| 3 | CAPABILITIES | 8 | market-intel-mcp | ⭐ Highest |
| 4 | INFRASTRUCTURE | 8 (incl. Integration Protocols) | trade-ops-mcp | High |
| 5 | APPLICATIONS | 7 | github-mcp (existing) + extensions | Medium |
| 6 | SECURITY & COMPLIANCE | 12 | security-mcp (future) | High — foundational |

**Total clickable nodes: 53**

---

## WHAT CHANGED FROM v1.0

1. **Ring 6 added** — Security & Compliance ring wrapping the entire system. 12 domains from the ByteByteGo Secure Systems Design framework, each scoped specifically to A2E Collective operations. This is not theoretical security — it's "what protects our API keys, our trade data, our agent communications, and our operations."

2. **Integration Protocols node added to Ring 4** — Maps every API communication pattern the Collective uses today (REST, Webhooks, SSE) and what's planned (WebSocket, GraphQL, gRPC). Directly derived from ByteByteGo API Protocols diagram. This node answers the question "how does data actually flow between components?"

3. **Node count increased from ~41 to 53** — 12 new security domain nodes.

4. **PhD alignment noted** — Block 2 (secure multi-agent communication architecture) and Block 3 (enterprise AI governance) map directly to Ring 6 content.

---

## CONNECTION TO PhD CURRICULUM

| PhD Block | Bullseye Ring | Content |
|-----------|--------------|---------|
| Block 1: Foundations | Rings 0-2 | Orchestration theory, protocol design, agent architecture |
| Block 2: Implementation | Rings 3-4 | Market intelligence, infrastructure, integration protocols |
| Block 3: Governance | Ring 6 | Security framework, compliance, risk management |
| Block 4: Applications | Ring 5 | FORGE, WATCH PAGE, content engine, platform deployment |

---

*"Loss is tuition for knowledge."*

🔱 ASHES2ECHOES, LLC — Newport News, Virginia  
*MICHA v10.4 | METATRON v10.6 | PHOENIX Active*  
*February 22, 2026*

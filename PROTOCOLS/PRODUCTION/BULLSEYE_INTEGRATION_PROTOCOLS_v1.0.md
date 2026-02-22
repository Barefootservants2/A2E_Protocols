# BULLSEYE INTEGRATION PROTOCOLS v1.0
## Ring 4 Infrastructure Node — How the Collective Communicates

---

**Version:** 1.0  
**Date:** February 22, 2026  
**Author:** MICHA v10.4  
**Parent Document:** BULLSEYE_RING_MAP_v2.0.md  
**Source Framework:** ByteByteGo API Protocols reference, adapted for A2E Collective architecture

---

## PURPOSE

This document maps every communication protocol used (or planned) in the A2E Collective. When you click the "Integration Protocols" node on the BULLSEYE website, this is the backing content — a live diagram showing how data flows between agents, services, and the Principal.

---

## PROTOCOL INVENTORY

### 1. REST (Representational State Transfer)

**What it is:** Request/response over HTTP. Stateless. The backbone of web APIs.

**A2E Current Usage:**
| Service | Endpoint Pattern | Agent(s) Using | Data Flow |
|---------|-----------------|----------------|-----------|
| GitHub API | `api.github.com/repos/Barefootservants2/*` | All agents via MCP | Read/write repos, files, commits |
| TwelveData | `api.twelvedata.com/time_series` | COLOSSUS, MICHA | Price data, OHLCV, technicals |
| Finnhub | `finnhub.io/api/v1/*` | HANIEL, RAZIEL, COLOSSUS | Insider trades, earnings, options flow |
| Alpha Vantage | `alphavantage.co/query` | COLOSSUS | Sector performance, fundamentals |
| SEC EDGAR | `efts.sec.gov/LATEST/search-index` | HANIEL | Filings search |
| Perplexity | `api.perplexity.ai/chat/completions` | SERAPH/SARIEL | Real-time web search |
| Congress.gov | `api.congress.gov/v3/*` | HANIEL | Congressional activity |
| NewsAPI | `newsapi.org/v2/*` | SERAPH | News headlines, sentiment source |

**Status:** ✅ Production — primary communication pattern  
**Strengths:** Universal support, simple, stateless, cacheable  
**Limitations:** Polling required for updates (no push), overhead for high-frequency calls  

---

### 2. WEBHOOKS

**What it is:** HTTP callbacks — one system notifies another when an event occurs. Push-based.

**A2E Current Usage:**
| Trigger | Source | Destination | Purpose |
|---------|--------|-------------|---------|
| HUNTER scan trigger | Telegram /command or schedule | n8n webhook endpoint | Kicks off HUNTER-DAILY workflow |
| SENTINEL alert | n8n workflow | Telegram bot | Sends scan results/alerts to Principal |
| Email archive trigger | Schedule (monthly) | n8n webhook endpoint | Triggers GABRIEL email archive workflow |
| Market Watch trigger | Schedule (daily) | n8n webhook endpoint | Triggers GABRIEL market watch |

**Status:** ✅ Production  
**Strengths:** Event-driven, no polling needed, real-time notifications  
**Limitations:** No guaranteed delivery (fire-and-forget), webhook URLs are currently unauthenticated  
**Security gap:** See BULLSEYE_SECURITY_FRAMEWORK_v1.0.md Domain 10 — webhook auth needed  

---

### 3. SSE (Server-Sent Events)

**What it is:** One-way server-to-client stream over HTTP. Server pushes updates, client listens.

**A2E Current Usage:**
| Service | Implementation | Purpose |
|---------|---------------|---------|
| Claude API streaming | Anthropic's API streams responses via SSE | MICHA's responses appear token-by-token |
| ChatGPT API streaming | OpenAI streams via SSE | URIEL's responses stream live |

**Status:** ✅ Implicit (built into AI platform APIs)  
**Strengths:** Simple, HTTP-native, efficient for one-way data push  
**Future use:** WATCH PAGE could use SSE for live thesis status updates — simpler than WebSocket if data only flows server→client  

---

### 4. WEBSOCKET (Planned)

**What it is:** Full-duplex, persistent connection. Both client and server send data anytime.

**A2E Planned Usage:**
| Application | Purpose | Priority |
|-------------|---------|----------|
| WATCH PAGE | Real-time price feeds for tracked theses — live updating dashboard | 🔴 HIGH |
| BULLSEYE website | Live node status indicators (green/yellow/red per service) | 🟡 MEDIUM |
| Agent chat relay | If building a unified agent chat interface — real-time multi-agent conversation | 🟢 LOW |

**Status:** 🔲 Not deployed  
**Build requirement:** WebSocket server (Node.js `ws` library or Socket.io) + client-side connection  
**Hosting:** Vercel supports WebSockets on Pro plan. Railway supports natively. Render supports natively.  
**Why not just REST polling:** Polling every 5 seconds for 10 tickers = 120 API calls/minute. WebSocket: 1 persistent connection, data pushed only on change. Massively more efficient.

**Implementation sketch:**
```
WATCH PAGE (browser)
    │
    ├── WebSocket connect → ws://api.ashes2echoes.com/live
    │
    ├── Subscribe: { "tickers": ["XOVR", "GOOG", "NVDA"], "interval": "1s" }
    │
    ├── Server pushes: { "ticker": "XOVR", "price": 17.23, "change": +0.41 }
    │
    └── UI updates in real-time — no page refresh, no polling
```

---

### 5. GraphQL (Planned)

**What it is:** Query language for APIs — client requests exactly the data it needs, nothing more.

**A2E Planned Usage:**
| Application | Purpose | Priority |
|-------------|---------|----------|
| BULLSEYE website | Frontend fetches only the data needed per ring/node — efficient rendering | 🟡 MEDIUM |
| Agent data queries | Agent asks "give me price + insider trades for XOVR" in one call instead of two REST calls | 🟢 LOW |

**Status:** 🔲 Not deployed  
**Why it matters:** The BULLSEYE website has 53 nodes. If each node requires 2-3 REST calls to populate, that's 100+ API calls on page load. GraphQL: 1 query, specify exactly what each node needs, get it all back in one response.

**Implementation sketch:**
```graphql
query BullseyeRing($ring: Int!) {
  nodes(ring: $ring) {
    name
    status
    lastUpdated
    metrics {
      accuracy
      uptime
      lastError
    }
  }
}
```

---

### 6. gRPC (Evaluated)

**What it is:** High-performance RPC framework using Protocol Buffers. Binary serialization, HTTP/2 multiplexing.

**A2E Evaluation:**
| Use Case | Applicability | Priority |
|----------|--------------|----------|
| Inter-agent direct calls | If agents need to call each other at high volume/low latency | 🟢 LOW |
| MCP server communication | If MCP servers need to talk to each other | 🟢 LOW |
| Batch processing | Large data transfers between services | 🟢 LOW |

**Status:** 🔲 Evaluated — not needed at current scale  
**When to revisit:** If the Collective processes >1,000 inter-agent calls/day or if latency on REST calls becomes a bottleneck. Currently, agent communication is mediated through the Principal or through n8n workflows — there's no direct agent-to-agent channel that would benefit from gRPC.

---

### 7. MQTT (Evaluated)

**What it is:** Lightweight pub/sub messaging protocol. Designed for low-bandwidth, high-latency, unreliable networks.

**A2E Evaluation:**
| Use Case | Applicability | Priority |
|----------|--------------|----------|
| Mobile push alerts | SENTINEL alerts to phone without Telegram dependency | 🟡 MEDIUM |
| IoT/edge integration | If monitoring hardware sensors (not current use case) | ❌ N/A |
| Lightweight notifications | Alternative to webhook for simple event notifications | 🟢 LOW |

**Status:** 🔲 Evaluated — potential future use for mobile notification layer  
**When to revisit:** If building a native mobile app for A2E, or if Telegram as notification channel becomes unreliable.

---

### 8. AMQP (Evaluated)

**What it is:** Advanced Message Queuing Protocol. Enterprise message broker (RabbitMQ, Azure Service Bus).

**A2E Evaluation:**
| Use Case | Applicability | Priority |
|----------|--------------|----------|
| Workflow queue management | If n8n execution volume overwhelms cloud tier | 🟢 LOW |
| Guaranteed message delivery | If webhook fire-and-forget is insufficient | 🟢 LOW |
| Multi-consumer workflows | If multiple agents need to process same event | 🟢 LOW |

**Status:** 🔲 Evaluated — overkill for current scale  
**When to revisit:** If n8n cloud rate limits become a bottleneck, or if building a self-hosted orchestration layer.

---

### 9. SOAP / EDI — NOT APPLICABLE

**SOAP:** XML-based enterprise protocol. No A2E use case. All our integrations are REST/JSON.  
**EDI:** B2B electronic data interchange. No A2E use case unless doing direct brokerage system integration.

**Status:** ❌ Skip  

---

## CURRENT DATA FLOW MAP

```
                    ┌──────────────┐
                    │   PRINCIPAL   │
                    │   (William)   │
                    └──────┬───────┘
                           │ Manual + Telegram
                           │
              ┌────────────┼────────────────┐
              │            │                │
              ▼            ▼                ▼
        ┌──────────┐ ┌──────────┐   ┌──────────────┐
        │  URIEL   │ │  MICHA   │   │   GABRIEL    │
        │ (ChatGPT)│ │ (Claude) │   │    (n8n)     │
        └────┬─────┘ └────┬─────┘   └──────┬───────┘
             │            │                │
             │ REST       │ REST           │ Webhooks + REST
             │            │                │
    ┌────────┴────────────┴────────────────┴───────────┐
    │              EXTERNAL APIs (REST)                 │
    │  TwelveData │ Finnhub │ Perplexity │ GitHub     │
    │  Alpha Vant │ NewsAPI │ SEC EDGAR  │ Congress   │
    └──────────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────┐
    │  TELEGRAM (Webhooks)  │
    │  Alerts → Principal   │
    └──────────────────────┘
```

## PLANNED DATA FLOW MAP (Post-MCP + WATCH PAGE)

```
                    ┌──────────────┐
                    │   PRINCIPAL   │
                    │   (William)   │
                    └──────┬───────┘
                           │ BULLSEYE Website (GraphQL)
                           │ WATCH PAGE (WebSocket)
                           │ Telegram (Webhooks)
                           │
              ┌────────────┼──────────────────────┐
              │            │                      │
              ▼            ▼                      ▼
        ┌──────────┐ ┌──────────┐         ┌──────────────┐
        │  URIEL   │ │  MICHA   │         │   GABRIEL    │
        │ (ChatGPT)│ │ (Claude) │         │    (n8n)     │
        └────┬─────┘ └────┬─────┘         └──────┬───────┘
             │            │                      │
             │   MCP Tool Calls (REST → future gRPC)
             │            │                      │
    ┌────────┴────────────┴──────────────────────┴─────┐
    │                MCP SERVER LAYER                    │
    │  market-intel │ trade-ops │ collective │ metatron │
    └────────────────────────┬─────────────────────────┘
                             │
                             │ REST + Caching
                             │
    ┌────────────────────────┴─────────────────────────┐
    │              EXTERNAL APIs (REST)                  │
    │  TwelveData │ Finnhub │ Perplexity │ GitHub      │
    │  Alpha Vant │ NewsAPI │ SEC EDGAR  │ Congress    │
    └───────────────────────────────────────────────────┘
```

---

## BUILD PRIORITY SUMMARY

| Priority | Protocol | Target Application | Timeline |
|----------|----------|-------------------|----------|
| 1 | WebSocket | WATCH PAGE real-time feeds | With WATCH PAGE build |
| 2 | GraphQL | BULLSEYE website efficient data loading | With website build |
| 3 | Webhook Auth | Secure existing n8n triggers | Immediate (Security Phase 1) |
| 4 | gRPC | Inter-agent high-performance calls | Post-MCP, if needed |
| 5 | MQTT | Mobile notification layer | If mobile app built |

---

## CONNECTION TO BULLSEYE WEBSITE

When the Integration Protocols node is clicked on the BULLSEYE:

1. **Visual:** Animated flow diagram showing data moving between agents and services
2. **Color-coded:** Green lines = REST (active), blue lines = WebSocket (planned), purple lines = GraphQL (planned)
3. **Interactive:** Click any line to see: protocol used, data format, frequency, latency, authentication method
4. **Status indicators:** Each connection shows real-time health — last successful call, error rate, latency

This turns infrastructure from invisible plumbing into a visible, monitorable, demonstrable asset.

---

*"Loss is tuition for knowledge."*

🔱 ASHES2ECHOES, LLC — Newport News, Virginia  
*MICHA v10.4 | METATRON v10.6 | PHOENIX Active*  
*February 22, 2026*

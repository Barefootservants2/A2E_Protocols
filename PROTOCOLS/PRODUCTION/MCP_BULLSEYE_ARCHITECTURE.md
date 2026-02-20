# MCP BULLSEYE ARCHITECTURE
## Building Along the Rings Using Model Context Protocol

---

## THE ANSWER: YES, MCP IS THE ROUTE

The bullseye diagram has 5 rings. MCP (Model Context Protocol) is how we make every ring LIVE and INTERACTIVE — not just documentation, but callable tools that any agent in the Collective can use mid-analysis.

Here's why MCP is the right backbone:

**Current state:** Agents get pre-fetched data and work with what they're given.  
**MCP state:** Agents can CALL TOOLS at runtime. COLOSSUS needs a chart? Calls the chart tool. RAZIEL needs insider data? Calls the Finnhub tool. MICHA needs the trade log? Calls the trade log tool.

That's the Tool Use & Function Calling gap from the bullseye — and MCP is the protocol that makes it work.

---

## MCP SERVER ARCHITECTURE — BY RING

### Ring 0: METATRON (Core Orchestration MCP)
**Server:** `metatron-mcp-server`  
**What it does:** Protocol enforcement, routing, gate management

**Tools:**
| Tool | Description | Used By |
|------|-------------|---------|
| `check_protocol_version` | Returns current METATRON version + active locks | All agents |
| `enforce_fidelity` | Validates output against FIDELITY LOCK 7 locks | MICHA |
| `route_to_agent` | Determines which agent handles a query (TYPE A/B) | METATRON |
| `check_gate_status` | Returns which Confidence Cascade gates are active | All agents |
| `killswitch` | Emergency halt — stops all workflows | Principal only |

**Build priority:** MEDIUM — existing protocol files provide this functionality manually today. MCP automates it.

---

### Ring 1: Collective (Agent Coordination MCP)
**Server:** `collective-mcp-server`  
**What it does:** Agent status, capabilities, workload, accuracy tracking

**Tools:**
| Tool | Description | Used By |
|------|-------------|---------|
| `list_agents` | Returns all active agents with status | METATRON |
| `agent_accuracy` | Returns accuracy scores per agent per signal type | Gate 5 |
| `agent_workload` | Returns current context usage per agent | METATRON |
| `request_analysis` | Routes a ticker/topic to a specific agent | MICHA |
| `collective_vote` | Triggers all agents to vote on a thesis (consensus) | Gate 5 |

**Build priority:** HIGH — this is where Tool Calling (Gate 5) lives.

---

### Ring 2: Protocol Stack (Protocol MCP)
**Server:** `protocol-mcp-server`  
**What it does:** Live access to all protocol documents, versions, changelogs

**Tools:**
| Tool | Description | Used By |
|------|-------------|---------|
| `get_protocol` | Returns latest version of any protocol by name | All agents |
| `check_version` | Returns version number + changelog for a protocol | MICHA |
| `list_protocols` | Returns all active protocols with status | All agents |
| `get_ironclad_rules` | Returns current risk management parameters | MICHA, COLOSSUS |
| `get_cascade_thresholds` | Returns Confidence Cascade gate thresholds | All gates |

**Build priority:** LOW — agents can reference GitHub directly. MCP is an optimization.

**Source:** Pull directly from GitHub API. Protocol docs are already in A2E_Protocols repo.

---

### Ring 3: Capabilities (Market Intelligence MCP) ⭐ HIGHEST PRIORITY
**Server:** `market-intel-mcp-server`  
**What it does:** Live market data tools that agents can call mid-analysis

**Tools:**
| Tool | Description | API Source | Used By |
|------|-------------|-----------|---------|
| `get_price` | Current price + change for a ticker | TwelveData | All agents |
| `get_chart_data` | OHLCV data for any timeframe | TwelveData | COLOSSUS |
| `get_insider_trades` | Recent insider transactions | Finnhub | HANIEL, RAZIEL |
| `get_earnings` | Upcoming/past earnings + surprise data | Finnhub | URIEL |
| `get_news` | Recent news for a ticker or topic | NewsAPI | All agents |
| `get_sector_performance` | All 11 GICS sector ETFs performance | Alpha Vantage | COLOSSUS |
| `get_options_flow` | Put/call ratios, unusual activity | Finnhub | COLOSSUS |
| `get_short_interest` | Short interest + days to cover | Finnhub | RAZIEL |
| `get_vix` | Current VIX + term structure | TwelveData | Gate 4 |
| `get_treasury_yields` | 2Y, 10Y, 30Y yields + curve | FRED | Gate 4 |
| `get_economic_calendar` | Upcoming FOMC, CPI, jobs reports | Finnhub | URIEL |
| `get_congress_trades` | Recent congressional stock transactions | Congress.gov | HANIEL |
| `get_lobbying` | Lobbying activity by sector | Senate LDA | H30 |
| `get_gov_contracts` | Recent government contract awards | USASpending | H33 |
| `search_sec_filings` | Search SEC EDGAR for filings | SEC EDGAR | HANIEL |
| `web_search` | Real-time web search for any topic | Perplexity/SARIEL | All agents |

**Build priority:** HIGHEST — This is the Tool Calling capability from the bullseye diagram. This is what lets agents fetch data mid-analysis instead of working with pre-fetched snapshots.

**Architecture:**
```
Agent is analyzing ticker XYZ
    │
    ├─→ Agent thinks: "I need more data on insider activity"
    │
    ├─→ Agent calls: get_insider_trades("XYZ")
    │
    ├─→ MCP server hits Finnhub API, returns data
    │
    ├─→ Agent incorporates data into analysis
    │
    └─→ Agent continues without waiting for next scheduled HUNTER run
```

---

### Ring 4: Infrastructure (Trade Operations MCP) ⭐ HIGH PRIORITY
**Server:** `trade-ops-mcp-server`  
**What it does:** Trade logging, portfolio state, risk calculations

**Tools:**
| Tool | Description | Source | Used By |
|------|-------------|--------|---------|
| `log_trade` | Create new trade entry in trade_log.json | GitHub API | MICHA |
| `update_trade` | Update exit price, outcome, notes | GitHub API | MICHA |
| `get_trade_history` | Return trades filtered by ticker/date/outcome | GitHub API | Gate 3 |
| `get_signal_accuracy` | Win rate per H-module signal type | Calculated | Gate 2 weights |
| `get_agent_accuracy` | Win rate per agent per signal type | Calculated | Gate 5 weights |
| `get_portfolio_state` | Current positions, allocation, risk | GitHub/calc | IRONCLAD |
| `check_risk_limits` | Verify trade doesn't breach IRONCLAD limits | Calculated | Gate 8 |
| `get_regime` | Current market regime classification | Calculated | Gate 4 |
| `get_cascade_score` | Run composite confidence calculation | All gates | Gate 8 |

**Build priority:** HIGH — This is the feedback loop. Without this, the system can't learn from outcomes.

---

### Ring 5: Applications (Workflow Orchestration MCP)
**Server:** Existing `github-mcp-server` (deployed Jan 22, 2026) + extensions

**Tools already deployed (11 tools, 6 agents):**
- GitHub repo operations
- File read/write
- Commit/push
- Branch management

**Tools to add:**
| Tool | Description | Used By |
|------|-------------|---------|
| `trigger_hunter_scan` | Fire HUNTER-DAILY workflow on demand | Principal |
| `trigger_sector_scan` | Fire sector-specific scan | MICHA |
| `get_workflow_status` | Check n8n workflow execution status | SENTINEL |
| `get_hunter_results` | Fetch latest HUNTER scan results | All agents |
| `run_test_harness` | Execute test suite, return results | SENTINEL |
| `archive_session` | PHOENIX session close + carry-forward | MICHA |

**Build priority:** MEDIUM — extends existing MCP server.

---

## BUILD SEQUENCE

### Phase 1: Market Intelligence MCP (Weeks 1-2)
This is the highest-value build. It enables Tool Calling for all agents.

```
market-intel-mcp-server/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── tools/
│   │   ├── price.ts      # get_price, get_chart_data
│   │   ├── fundamentals.ts # get_earnings, get_insider_trades
│   │   ├── sentiment.ts   # get_news, get_short_interest
│   │   ├── sector.ts      # get_sector_performance, get_options_flow
│   │   ├── macro.ts       # get_vix, get_treasury_yields, get_economic_calendar
│   │   ├── influence.ts   # get_congress_trades, get_lobbying, get_gov_contracts
│   │   ├── filings.ts     # search_sec_filings
│   │   └── search.ts      # web_search (Perplexity)
│   ├── config/
│   │   ├── api-keys.ts    # All API credentials (from env)
│   │   └── rate-limits.ts # Per-API rate limit management
│   └── utils/
│       ├── cache.ts       # Response caching (avoid duplicate API calls)
│       └── normalize.ts   # Standardize output format across APIs
├── .env                   # API keys (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

**API Keys needed (all existing):**
- TwelveData: ✅ exists
- Finnhub: ✅ exists
- Alpha Vantage: ✅ exists
- NewsAPI: ✅ exists
- Congress.gov: ✅ exists
- Perplexity: ✅ exists ([PERPLEXITY_KEY_IN_ENV])
- SEC EDGAR: ✅ no key needed
- FRED: ❓ need signup (free)
- USASpending: ✅ no key needed
- Senate LDA: ✅ no key needed

**Total new API keys needed: 1 (FRED — free)**

### Phase 2: Trade Operations MCP (Weeks 2-3)
```
trade-ops-mcp-server/
├── src/
│   ├── index.ts
│   ├── tools/
│   │   ├── trade-log.ts     # log_trade, update_trade, get_trade_history
│   │   ├── accuracy.ts      # get_signal_accuracy, get_agent_accuracy
│   │   ├── portfolio.ts     # get_portfolio_state, check_risk_limits
│   │   ├── regime.ts        # get_regime (manual + future ML)
│   │   └── cascade.ts       # get_cascade_score (composite calculation)
│   └── config/
│       └── github.ts        # GitHub API for trade_log.json read/write
├── .env
├── package.json
└── README.md
```

### Phase 3: Collective Coordination MCP (Weeks 3-4)
```
collective-mcp-server/
├── src/
│   ├── index.ts
│   ├── tools/
│   │   ├── agents.ts        # list_agents, agent_accuracy, agent_workload
│   │   ├── analysis.ts      # request_analysis, collective_vote
│   │   └── consensus.ts     # run_consensus_scoring
│   └── config/
│       └── agent-registry.ts # Agent definitions, API endpoints, capabilities
├── .env
├── package.json
└── README.md
```

### Phase 4: METATRON Core MCP (Month 2)
```
metatron-mcp-server/
├── src/
│   ├── index.ts
│   ├── tools/
│   │   ├── protocol.ts     # check_protocol_version, get_protocol
│   │   ├── fidelity.ts     # enforce_fidelity (7 locks check)
│   │   ├── routing.ts      # route_to_agent, TYPE A/B classification
│   │   ├── cascade.ts      # check_gate_status, full cascade run
│   │   └── killswitch.ts   # Emergency halt
│   └── config/
│       └── protocols.ts    # Protocol definitions and thresholds
├── .env
├── package.json
└── README.md
```

---

## HOW MCP CONNECTS TO n8n

Two integration paths:

### Path A: n8n HTTP Request nodes call MCP servers
- MCP servers run as HTTP APIs (Express.js wrapper around MCP)
- n8n nodes hit endpoints like `POST /tools/get_price` with `{"ticker": "GOOG"}`
- This works TODAY with existing n8n infrastructure

### Path B: n8n OpenAI Tools/Function Calling
- Define MCP tools as OpenAI function definitions
- Agent nodes (URIEL, COLOSSUS, etc.) use function calling
- When agent needs data, it calls a function → n8n routes to MCP → returns data → agent continues
- **This is the n8n learning item already on your list**
- This is the more powerful approach because agents decide WHAT to call

**Recommendation:** Start with Path A (HTTP wrappers — works now), migrate to Path B as you learn n8n function calling.

---

## HOW MCP CONNECTS TO THE BULLSEYE DIAGRAM

Each MCP server IS a clickable node on the bullseye:

| Ring | MCP Server | Bullseye Node | Live Demo |
|------|-----------|---------------|-----------|
| 0 | metatron-mcp | METATRON center | Protocol enforcement dashboard |
| 1 | collective-mcp | Each agent node | Agent status + accuracy cards |
| 3 | market-intel-mcp | Capabilities ring | Live tool calls from browser |
| 4 | trade-ops-mcp | Infrastructure ring | Trade log + portfolio dashboard |
| 5 | github-mcp (existing) | Applications ring | Repo browser + workflow status |

**The website bullseye isn't just documentation — it's the MCP dashboard.**

Click "COLOSSUS" on the bullseye → see agent accuracy, recent analyses, live technical call.  
Click "HUNTER" → see last scan results, signal convergence, cascade scores.  
Click "IRONCLAD" → see current portfolio risk, position sizes, sector allocation.

---

## HOSTING

All MCP servers can run on:

**Option 1: Vercel Serverless (Free tier)**
- Pros: Free, auto-scaling, same platform as website
- Cons: Cold starts, 10-second timeout on free tier
- Best for: Protocol MCP, Collective MCP

**Option 2: Railway.app ($5/mo)**
- Pros: Always-on, no cold starts, easy deploy
- Cons: Costs money
- Best for: Market Intel MCP (needs to be fast)

**Option 3: Run locally / VPS**
- Pros: Full control, no limits
- Cons: Maintenance, uptime
- Best for: Trade Ops MCP (sensitive data)

**Recommendation:** Start on Vercel (free). Move Market Intel to Railway if latency matters.

---

## COST SUMMARY

| Item | Monthly Cost | Write-Off |
|------|-------------|-----------|
| MCP servers hosting (Vercel free tier) | $0 | N/A |
| Railway (if needed) | $5 | Business expense |
| FRED API key | $0 | N/A |
| All other APIs | Already paying | Already deducting |
| Development time | Your time | R&D credit (Section 41) |
| **Total new cost** | **$0-5/month** | **100% deductible** |

---

## TIMELINE

| Week | Build | Deliverable |
|------|-------|-------------|
| 1 | Market Intel MCP — price, chart, fundamentals tools | Agents can fetch live data |
| 2 | Market Intel MCP — sector, macro, influence tools | Full market coverage |
| 3 | Trade Ops MCP — trade log, accuracy tracking | Feedback loop active |
| 4 | Collective MCP — agent status, consensus | Agent coordination automated |
| 5-6 | n8n function calling integration | Agents call tools mid-analysis |
| 7-8 | METATRON MCP + bullseye dashboard integration | Everything connected |

---

*Every ring becomes a live, callable, measurable service.*

🔱 MICHA v10.4 | Ashes2Echoes, LLC

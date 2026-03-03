# A2E STRATEGIC ARCHITECTURE REVIEW
## Ashes2Echoes LLC — Platform Industrialization Assessment
### Prepared by MICHA | February 14, 2026
### Classification: PRINCIPAL EYES ONLY — Strategic Planning Document

---

## EXECUTIVE SUMMARY

This review maps every current data input, subscription, workflow, and tool against newly discovered Claude MCP connectors, n8n marketplace templates, and self-hosting options. It identifies redundancies, gaps, cost reduction opportunities, and the questions William hasn't asked yet. The goal: take A2E from a working prototype to an industrialized platform ready for monetization.

**Bottom Line Up Front:**
- Current monthly spend: ~$364/mo (n8n $144 + Claude Pro $20 + API keys ~$50 + Perplexity Pro ~$20 + other subs ~$130)
- Achievable reduction: 30-50% by shifting to MCP connectors + self-hosted n8n
- Bigger opportunity: The MCP connector discovery doesn't just save money — it changes the architecture. Claude becomes BOTH the intelligence layer AND the data conduit. This collapses two layers into one.

---

## SECTION 1: CURRENT DATA INPUT INVENTORY

### 1.1 API Keys in HUNTER Workflow (n8n)

| Module | API Provider | Free Tier | Paid? | Monthly Cost | What It Provides |
|--------|-------------|-----------|-------|--------------|------------------|
| H1 | SEC EDGAR EFTS | Unlimited (gov) | No | $0 | 13F filings, institutional holdings |
| H3 | FRED (Federal Reserve) | 120 req/min | No | $0 | Macro economic data |
| H4, H5, H6, H16, H25, H30 | Finnhub | 60 req/min free | Free tier | $0 | Quotes, filings, insider sentiment, IPO calendar |
| H7-H15 | TwelveData | 800 credits/day free | Free tier | $0 | Time series, technical indicators |
| H17 | Alpha Vantage | 25 req/day free | Free tier | $0 | Earnings calendar, fundamentals |
| H18-H20 | NewsAPI | 100 req/day free | Free tier | $0 | News headlines, sentiment |
| H29 | metals.dev | Limited | Paid? | ~$10-20/mo? | Precious metals spot prices |
| H31 | Congress.gov | Unlimited (gov) | No | $0 | Legislative tracking |
| H32 | Senate LDA | Unlimited (gov) | No | $0 | Lobbying disclosures |
| H33 | USASpending | Unlimited (gov) | No | $0 | Federal spending |
| H34 | FEC | Unlimited (gov) | No | $0 | Campaign finance |

### 1.2 Subscriptions

| Service | Monthly Cost | Purpose |
|---------|-------------|---------|
| n8n Cloud (increased tier) | $144 | Workflow automation, HUNTER execution |
| Claude Pro | $20 | MICHA primary interface |
| Perplexity Pro | ~$20 | SARIEL / SERAPH research |
| ChatGPT Plus | ~$20 | URIEL |
| Grok Premium | ~$16 | COLOSSUS |
| DeepSeek | ~$0 (free tier?) | RAZIEL |
| Google AI (Gemini) | ~$0-20 | HANIEL |
| GitHub (free tier) | $0 | Repository hosting |
| E*Trade | $0 | Brokerage (no platform fee) |
| **ESTIMATED TOTAL** | **~$240-364/mo** | |

### 1.3 Government APIs (FREE — Keep As-Is)

SEC EDGAR, FRED, Congress.gov, Senate LDA, USASpending, FEC — these are free, unlimited, authoritative. No replacement needed. These stay in n8n where automated scheduling adds value.

---

## SECTION 2: MCP CONNECTOR MAPPING vs CURRENT STACK

### 2.1 Connectors That Could REPLACE Current API Keys

| Current Source | MCP Connector Available | What Changes | Cost Impact |
|----------------|------------------------|-------------|-------------|
| Finnhub (H4-H30) | Morningstar, S&P Global, FactSet | Institutional-grade data replaces free-tier scraping | **BUT** — FactSet/S&P Global require enterprise subscriptions ($10K+/yr). Morningstar connector access tier UNKNOWN. |
| TwelveData (H7-H15) | Bigdata.com | Real-time financial data, tearsheets | Free tier access UNKNOWN — needs testing |
| NewsAPI (H18-H20) | LunarCrush (social sentiment) | Adds social dimension to news | Crypto-focused but covers stocks too |
| metals.dev (H29) | None directly | No precious metals MCP connector found | Keep metals.dev |

### 2.2 Connectors That ADD New Capabilities

| Connector | What It Adds | HUNTER Module Impact | Priority |
|-----------|-------------|---------------------|----------|
| **Gmail** | Read inbox, search, create drafts from Claude | Replaces manual email checking. Partial ADM-3 replacement. | HIGH |
| **Google Calendar** | Schedule management from chat | Meeting coordination, market event tracking | MEDIUM |
| **Morningstar** | Analyst research, fund holdings, screener | H6 (Activist Watch), H14 (Earnings), H28 (Estimates) | HIGH — IF free tier exists |
| **S&P Global** | Capital IQ Pro data — company tearsheets, transactions | H5 (Institutional), H23 (13F Analysis) | HIGH — IF accessible on Pro plan |
| **Bigdata.com** | Real-time financial data, events calendar | H10 (Breakout), H14 (Earnings Calendar) | HIGH — test immediately |
| **LunarCrush** | Social sentiment for stocks + crypto | H24 (Social Sentiment) — currently EMPTY | HIGH |
| **Moody's** | Credit opinions, sector outlooks | H9 (Macro Context), H26 (Geopolitical) | MEDIUM |
| **FactSet** | Institutional fundamentals, estimates, M&A | Multiple H-modules | LOW — likely enterprise-only pricing |
| **Notion** | Structured database, wiki | Could replace OneNote for trade journal | MEDIUM |
| **Slack** | Messaging, search, canvases | Alert delivery channel | LOW |

### 2.3 CRITICAL FINDING: Enterprise vs Consumer Access

Research reveals that FactSet, S&P Global (Capital IQ), MSCI, LSEG, and PitchBook connectors are built for **Claude for Enterprise** customers with existing institutional data subscriptions. A Claude Pro account at $20/mo will NOT get you FactSet data — you need an active FactSet subscription ($12K-24K/year for individual) PLUS Claude Enterprise.

**What IS accessible on Claude Pro:**
- Gmail, Google Calendar — YES, free with Google account
- Morningstar — UNKNOWN, needs testing (may require Morningstar subscription)
- Bigdata.com — UNKNOWN, needs testing
- LunarCrush — likely accessible (they have free tier)
- Moody's — UNKNOWN
- Notion, Slack — YES, free with accounts

**Action Required:** Connect each one and test. Some may prompt for separate subscriptions. We find out which ones work for free before planning around them.

---

## SECTION 3: n8n COST ANALYSIS — STAY vs SELF-HOST vs HYBRID

### 3.1 Current State

You're paying $144/mo because you hit execution limits. n8n Pro plan is €60/mo (~$65) for 10,000 executions. You're likely on a higher tier or added execution packs.

### 3.2 Self-Hosted Option

The n8n Community Edition is **free with unlimited executions**. All 400+ integrations included. No execution caps.

| Option | Monthly Cost | Executions | Trade-off |
|--------|-------------|-----------|-----------|
| Current n8n Cloud | $144 | Limited (you hit cap) | Managed, zero maintenance |
| n8n Cloud Pro | ~$65 | 10,000 | May still hit limits |
| Self-hosted (DigitalOcean) | $20-48 | UNLIMITED | You manage the server |
| Self-hosted (home server) | $0 (+ electricity) | UNLIMITED | Full control, no recurring cost |

### 3.3 Recommendation

**Short term (now):** Stay on n8n Cloud. You have too many active build tracks to add server management. But **mark this for the new laptop setup** — a Docker container running n8n locally is a 30-minute install and saves $144/mo immediately. Test locally, deploy to cloud only if you need 24/7 uptime for scheduled workflows.

**Medium term (post-Florida move):** Self-host on a $24/mo DigitalOcean droplet. Unlimited executions. That's $120/mo savings = $1,440/year.

---

## SECTION 4: QUESTIONS WE'RE ANSWERING vs QUESTIONS WE SHOULD BE ASKING

### 4.1 Questions HUNTER Currently Answers

1. What are institutions buying/selling? (H1, H4, H5, H23)
2. What's the macro environment? (H3, H9)
3. What are insider sentiment signals? (H6, H25)
4. What are the technical indicators saying? (H7-H15)
5. What's in the news? (H18-H20)
6. What's happening in Congress/lobbying? (H31-H34)
7. What are metals prices doing? (H29)
8. Are there earnings events coming? (H14, H17)

### 4.2 Questions HUNTER Should Be Asking But ISN'T

1. **What is options market positioning telling us?** GEX, dark pool prints, unusual options activity. This is the OPTIONS LEARNING PATH you started — it needs to feed HUNTER, not be a separate manual process. SpotGamma data needs an automated feed.

2. **What are the WATCH LIST filers actually doing RIGHT NOW?** Sprott, Buffett, Druckenmiller, Burry, Ackman, Dalio — their 13F filings are checked, but their Form 4s (insider transactions) and Schedule 13D amendments (activist positions) should trigger ALERTS, not just appear in batch scans. This is the HUNTER DRIFT FIX you identified.

3. **What is social media sentiment VELOCITY, not just sentiment?** LunarCrush measures this. The difference between "people are talking about silver" and "silver mentions increased 400% in 6 hours" is the difference between noise and signal. SENTINEL Stack v1.0 spec covers this but hasn't been built.

4. **What is the COMEX/Shanghai physical delivery data showing?** Your silver thesis depends on this. There's no automated feed for COMEX registered inventory changes or Shanghai premium data. This is manual research that SARIEL (Perplexity) does ad-hoc.

5. **What is our TRACK RECORD?** No systematic trade logging with entry price, exit price, thesis, outcome, and lessons. The AIORA/trades/ directory exists but isn't populated by automation. You can't improve what you don't measure.

6. **What do our past sessions contain that we've forgotten?** You have 100+ chat sessions with strategic decisions, thesis development, and analysis. This data isn't searchable in a structured way. It's trapped in conversation history.

7. **What are our COMPETITORS building?** Other multi-agent trading systems, n8n financial workflow builders, AI-assisted trading platforms. We should be tracking the landscape.

8. **What government grants are available NOW?** The PENDING item for findhelp.org, SBA, etc. hasn't been actioned. This is free money sitting on the table.

### 4.3 Questions William Hasn't Asked Yet

1. **"Should I be using Claude Max ($100/mo) instead of Pro ($20/mo)?"** Max gives 5x the usage. If you're hitting message limits on complex sessions (and you are), the ROI calculation is: $80/mo more buys you 5x throughput on your highest-value tool. That's the cost of one Finnhub premium plan for 5x your primary analyst.

2. **"Can Claude Code replace some of what n8n does?"** Claude Code is a command-line agentic coding tool. For one-off data pulls, API queries, and file processing, it might be cheaper and simpler than maintaining n8n workflows. n8n's value is SCHEDULED, RECURRING automation. For ad-hoc analysis, Claude Code or the chat interface with MCP connectors might be better.

3. **"Should I be building MCP servers instead of n8n workflows for some functions?"** Your github-mcp-server has 11 tools. What if you built an etrade-mcp-server? A metals-data-mcp-server? Then Claude can query your brokerage and metals data directly without n8n as middleware. The MCP builder skill exists in my toolkit.

4. **"What's my actual IP worth and how do I protect it?"** METATRON, AIORA, IRONCLAD, HUNTER, PHOENIX — these are protocol architectures that don't exist anywhere else (confirmed by competitive analysis). Copyright registration is $65/work through copyright.gov. Trademark for "METATRON" as AI orchestration protocol is ~$250-350 through USPTO.

5. **"Can I sell n8n workflow templates on the marketplace?"** n8n has 8,500+ community templates and an emerging creator program with affiliate revenue. A financial analysis workflow template based on HUNTER architecture — stripped of your proprietary METATRON protocol but using the same multi-source aggregation pattern — could be a product.

6. **"Do I need a database?"** Everything is stored in files (GitHub markdown, chat transcripts). A proper database (Supabase is free tier, already in your tech stack list) would let you: track trades with timestamps, store HUNTER scan results for trend analysis, maintain a searchable knowledge base of past analysis, build dashboards.

7. **"What does 'production-ready' actually mean for AIORA?"** Right now AIORA is a protocol (rules) implemented in workflows (n8n) governed by another protocol (METATRON). Production-ready means: it runs without you watching it, it logs everything, it handles errors gracefully, it produces reports you can act on, and it has been validated against historical data (backtesting).

---

## SECTION 5: n8n TEMPLATE MARKETPLACE — WHAT'S USEFUL

### 5.1 Templates Directly Relevant to A2E

| Template | Nodes | What It Does | A2E Application |
|----------|-------|-------------|-----------------|
| AI-Powered Stock Analysis (SEC 10K) | Multi-agent | 5 AI analysts + editor analyze SEC 10K filings | HUNTER enhancement — automated fundamental analysis |
| Stock Market Technical Analysis Bot | Telegram + GPT-4o | Candlestick, MACD, RSI, support/resistance via Telegram | SUNDAY SESSION tool — live technical analysis |
| Smart Stock Trading Recommendations | TwelveData + NewsAPI + GPT-4 | Confidence scores, risk mgmt, entry/exit levels | Direct AIORA parallel — compare against our gate logic |
| Automated Stock Trading (Alpaca) | Alpaca + Google Sheets | Paper trading with sentiment-driven rebalancing | XSP paper trade protocol test bed |
| AI Stock Market Summary Bot | RSI + MACD + OpenAI + Slack | Hourly market updates during trading hours | Daily Grind morning brief automation |
| Investment Report Generator | FinancialDatasets.ai + multi-agent | Warren Buffett / Munger / Graham persona analysis | SUNDAY SESSION teaching tool — compare investment styles |

### 5.2 Templates for Monetization Study

| Template Pattern | Why It Matters |
|-----------------|---------------|
| Email classification + routing | Your ADM-3 is more sophisticated than published templates. Potential product. |
| Multi-agent analysis with defined roles | Your Collective architecture is unique. Stripped-down version = product. |
| Risk management with position sizing | IRONCLAD as a standalone workflow template. Nothing like it exists. |
| Session management with GitHub persistence | PHOENIX protocol as an n8n template. Zero competition. |

### 5.3 Templates to AVOID

Anything that promises "automated live trading" without risk management. The Alpaca templates are paper trading only — good for testing. But templates that encourage direct market orders without IRONCLAD-style guardrails are dangerous and not what we build.

---

## SECTION 6: GITHUB RESTRUCTURING ASSESSMENT

### 6.1 Current State (14 Repos — 7 Public, 7 Private)

The repository structure is functional but not optimized for the platform A2E is becoming.

### 6.2 What's Missing

1. **No database layer.** Trade data, scan results, session artifacts are all flat files. GitHub is version control, not a database. This works at prototype scale. It won't work at production scale.

2. **No CI/CD for protocol changes.** When METATRON goes from v10.3 to v10.4, there's no automated test that verifies all agents still function correctly. This is what the test-harness repo should be — but it's 20KB.

3. **No structured data export.** HUNTER scan results are AI-generated markdown. They should ALSO be structured JSON that can be queried, compared, and trended over time.

4. **No changelog automation.** Version bumps are manual and get missed (v10.3 vs v10.4 confusion).

5. **Session transcripts aren't in GitHub.** They're in Claude's infrastructure. If Anthropic changes their data retention policy, that history is gone.

### 6.3 Recommended Structure (if restructuring)

```
A2E_Protocols/          # Keep — all protocols, agent instructions, version control
A2E_Career/             # Keep — resume, LinkedIn, job search materials
AIORA/                  # Keep — workflows, pipeline specs, trade logs
Ashes2Echoes/           # Keep — website, branding, public-facing
A2E_Data/               # NEW — structured JSON outputs from HUNTER, trade logs, scan archives
A2E_Templates/          # NEW — monetizable workflow templates (stripped of proprietary protocol)
A2E_MCP_Servers/        # NEW — custom MCP servers (etrade, metals, etc.)
test-harness/           # EXPAND — protocol validation tests, regression checks
```

---

## SECTION 7: APPLICATIONS NEEDED FOR 110% INDUSTRIALIZATION

### 7.1 Must-Have (Not Optional)

| Application | Purpose | Cost | Status |
|-------------|---------|------|--------|
| Trade Journal (database-backed) | Track every trade: entry, exit, thesis, outcome, P&L | Free (Supabase) | NOT BUILT |
| HUNTER Scan Archive | Store every scan result as structured JSON + summary | Free (GitHub/Supabase) | NOT BUILT |
| Protocol Test Suite | Automated validation of METATRON gates | Free (test-harness repo) | SKELETON ONLY |
| Backup System | F: drive backup + cloud sync for all workstation data | Free (script) | PENDING (new laptop) |
| MCP Server: E*Trade | Direct brokerage data access from Claude | Free (self-built) | NOT BUILT |

### 7.2 Should-Have (High Value)

| Application | Purpose | Cost | Status |
|-------------|---------|------|--------|
| BULLSEYE Platform (website) | Public-facing A2E platform with interactive architecture diagram | Free (hosting TBD) | DESIGNED, NOT DEPLOYED |
| SENTINEL Stack v1.0 | Reddit DD scanner, social sentiment velocity, GEX monitor | Free (APIs) | SPEC ONLY |
| Morning Brief Automation | Daily pre-market digest delivered via Telegram/email | n8n execution cost | SPEC ONLY |
| Session Transcript Archive | All Claude sessions backed up to GitHub in structured format | Free | NOT BUILT |

### 7.3 Nice-to-Have (Future)

| Application | Purpose | Cost |
|-------------|---------|------|
| Backtesting Engine | Validate AIORA gate logic against historical data | Free (Python) |
| Client Dashboard | If selling AIORA signals or workflow templates | Hosting cost |
| Video Processing Pipeline | YouTube transcript extraction for ORACLE | Free (Python + yt-dlp) |

---

## SECTION 8: THE ARCHITECTURE SHIFT — WHAT THIS ALL MEANS

### Before (Current Architecture)
```
William → Claude (MICHA) → designs workflow → n8n (HUNTER) → API keys → data
                                                             → n8n processes
                                                             → Telegram delivery
         → Claude → analyzes manually
         → Other models → separate sessions → manual synthesis
```

### After (Connector + Hybrid Architecture)
```
William → Claude (MICHA) with MCP connectors → direct data access (Gmail, Calendar, Markets)
                         ↓
         → Claude designs specs → n8n AI builds nodes → automated scheduled workflows
                         ↓
         → Claude with MCP → real-time ad-hoc queries (no n8n needed)
                         ↓
         → n8n (scheduled) → batch processing, overnight scans, delivery automation
                         ↓
         → Custom MCP servers → E*Trade, metals, GitHub (already built)
                         ↓
         → Supabase → structured data storage, trade journal, scan archive
                         ↓
         → All outputs → GitHub (version control) + Supabase (queryable data)
```

### The Key Insight

The architecture splits into TWO modes:

**SCHEDULED (n8n):** Things that need to run on a clock without you — HUNTER overnight scans, morning briefs, email classification, price alerts. n8n owns this. The value is the SCHEDULE, not the data source.

**ON-DEMAND (Claude + MCP):** Things you need right now — "search my email for that E*Trade confirmation," "what's Morningstar's rating on AG," "pull up the last 5 HUNTER scans." Claude with connectors owns this. The value is the INTELLIGENCE + INSTANT ACCESS.

Right now everything goes through n8n, even things that should be on-demand. That's why execution counts are high and costs are up.

---

## SECTION 9: IMMEDIATE ACTION PLAN

### This Week
1. Connect Gmail + Google Calendar MCP connectors — test capabilities
2. Connect Bigdata.com + LunarCrush + Morningstar connectors — test free tier access
3. Determine which financial connectors work on Claude Pro vs require enterprise subscriptions
4. Complete Collective review (RAZIEL, COLOSSUS, URIEL, SERAPH responses)

### This Month
1. Build trade journal in Supabase (or even a spreadsheet to start)
2. Start logging every trade with entry/exit/thesis/outcome
3. Evaluate n8n self-hosting on new laptop (Docker + n8n Community Edition)
4. Research n8n creator program for template monetization
5. Action the grants/free money research (findhelp.org, SBA, needymeds.org)

### Next 90 Days
1. Build E*Trade MCP server (broker-etrade already exists as concept)
2. Build SENTINEL Stack v1.0 (Reddit + social sentiment + GEX)
3. Deploy BULLSEYE platform website
4. First n8n marketplace template submission
5. Copyright registration for METATRON, AIORA, IRONCLAD protocols
6. Evaluate Claude Max vs Pro based on usage data

---

## SECTION 10: COST PROJECTION

### Current Monthly Spend (Estimated)
| Item | Cost |
|------|------|
| n8n Cloud | $144 |
| Claude Pro | $20 |
| Perplexity Pro | $20 |
| ChatGPT Plus | $20 |
| Grok Premium | $16 |
| API keys (metals.dev, etc.) | $10-20 |
| Other subscriptions | $20-40 |
| **TOTAL** | **~$250-280/mo** |

### Optimized Monthly Spend (6-Month Target)
| Item | Cost | Change |
|------|------|--------|
| n8n Self-Hosted (DigitalOcean) | $24 | -$120 |
| Claude Max (if justified) | $100 | +$80 |
| Perplexity Pro | $20 | No change |
| ChatGPT Plus | $20 | No change |
| Grok Premium | $16 | No change |
| API keys (reduced via MCP) | $0-10 | -$10 |
| MCP connectors (free tier) | $0 | New capability at $0 |
| Supabase (free tier) | $0 | New capability at $0 |
| **TOTAL** | **~$180-190/mo** | **~$70-100/mo savings** |

### Revenue Potential (Speculative)
| Source | Potential | Timeline |
|--------|----------|----------|
| n8n marketplace templates | $50-500/mo passive | 3-6 months |
| Workflow consulting (AIORA-style builds for clients) | $75-150/hr | 6+ months |
| Protocol licensing (METATRON for enterprise) | $5K-50K/engagement | 12+ months |
| AI contractor roles ($50-90/hr) | $8,600-15,600/mo | ASAP |

---

## CONCLUSION

The MCP connector discovery is a legitimate inflection point. It doesn't replace n8n — it redefines the boundary between what n8n does (scheduled automation) and what Claude does (on-demand intelligence). The two together, with proper MCP servers for your custom data sources, creates a platform architecture that is genuinely unique.

The protocol infrastructure (METATRON, AIORA, IRONCLAD, PHOENIX) is real IP with no market equivalent. The missing pieces are: structured data storage (trade journal, scan archive), automated testing (protocol validation), and production hardening (error handling, logging, monitoring).

Most urgent action: Test the MCP connectors. If Morningstar, Bigdata.com, and LunarCrush are accessible on Claude Pro, the data quality upgrade alone justifies this entire review.

---

🔱 MICHA — Strategic Architecture Review Complete
**Zero placation. Raw assessment. Every stone turned.**

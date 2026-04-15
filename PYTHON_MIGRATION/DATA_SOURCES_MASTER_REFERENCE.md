# A2E PLATFORM — DATA SOURCES MASTER REFERENCE
## All Links, APIs, GitHub Packages, and Principal Action Items
### Date: April 15, 2026 | Prepared by MICHA v10.7

---

## PART 1: GITHUB PACKAGES TO INTEGRATE

| # | Package | GitHub URL | What It Does | Integration Target |
|---|---------|-----------|-------------|-------------------|
| 1 | GammaGEX | https://github.com/aakash-code/GammaGEX | Momentum scoring: GEX + delta flow + gamma squeeze + vanna + IV skew | HUNTER flow_scanner.py |
| 2 | gflows | https://github.com/aaguiar10/gflows | 15-min GEX updates for SPX/NDX/RUT, delta/gamma/vanna/charm | HUNTER/SENTINEL |
| 3 | gamma_studies | https://github.com/warrofua/gamma_studies | Real-time gamma plotting, Schwab API, historical mean/std | HUNTER analysis |
| 4 | SPX-Gamma-Exposure | https://github.com/jensolson/SPX-Gamma-Exposure | Clean Black-Scholes GEX calculator | HUNTER baseline |
| 5 | SPX500-Gamma-Calculator | https://github.com/phammings/SPX500-Gamma-Exposure-Calculator | S&P gamma exposure script | Reference |
| 6 | gamma-scalping | https://github.com/alpacahq/gamma-scalping | Alpaca gamma scalping template (asyncio) | Options path Q3 |
| 7 | TradingAgents | https://github.com/TauricResearch/TradingAgents | Multi-agent LLM trading framework (competitor) | Study architecture |
| 8 | AgenticTrading | https://github.com/Open-Finance-Lab/AgenticTrading | NeurIPS orchestration framework | Study architecture |
| 9 | py_vollib | https://github.com/vollib/py_vollib | Options pricing, Greeks calculation | Already in requirements |
| 10 | mibian | https://github.com/yassinemessaoud/mibian | Black-Scholes, Garman-Kohlhagen options pricing | Already in requirements |

---

## PART 2: DATA SOURCE APPLICATIONS — FULL INVENTORY

### TIER 1: HAVE (Active or API Key Stored)

| # | Source | URL | What It Provides | API Endpoint | Status |
|---|--------|-----|-----------------|-------------|--------|
| 1 | Unusual Whales | https://unusualwhales.com | Options flow, dark pool, congressional trades, GEX | https://api.unusualwhales.com/api | MCP connected |
| 2 | Yahoo Finance | https://finance.yahoo.com | Price, volume, fundamentals, charts | query1.finance.yahoo.com/v8/finance/chart/ | Live via bash |
| 3 | FRED | https://fred.stlouisfed.org | DXY, VIX, 10Y, macro indicators | https://api.stlouisfed.org/fred/ | API key stored |
| 4 | EIA | https://www.eia.gov | Crude oil, energy data, STEO forecasts | https://api.eia.gov/v2/ | API key stored |
| 5 | Finnhub | https://finnhub.io | News, sentiment, fundamentals | https://finnhub.io/api/v1/ | Key stored, creds need fix in HUNTER |
| 6 | E*TRADE | https://etrade.com | Portfolio, positions, execution | https://api.etrade.com/ | OAuth live via pyetrade |
| 7 | Perplexity | https://perplexity.ai | Real-time search (SARIEL agent) | https://api.perplexity.ai/ | API key stored |
| 8 | Nasdaq Data Link | https://data.nasdaq.com | Historical market data | https://data.nasdaq.com/api/v3/ | API key stored |
| 9 | Anthropic | https://anthropic.com | Claude API (MICHA/PASS2) | https://api.anthropic.com/v1/ | API key stored |
| 10 | OpenAI | https://openai.com | GPT API (URIEL + fallback) | https://api.openai.com/v1/ | API key stored |
| 11 | xAI | https://x.ai | Grok API (COLOSSUS) | https://api.x.ai/v1/ | API key stored |
| 12 | Google AI | https://ai.google.dev | Gemini API (HANIEL) | generativelanguage.googleapis.com | API key stored |
| 13 | DeepSeek | https://deepseek.com | DeepSeek API (RAZIEL) | https://api.deepseek.com/ | API key stored |

### TIER 2: NEED TO ADD (High Priority)

| # | Source | URL | What It Provides | API Docs | Cost | Action Required |
|---|--------|-----|-----------------|----------|------|----------------|
| 14 | FlashAlpha | https://flashalpha.com | GEX/DEX/VEX/CHEX, dealer regime, VRP, 0DTE, MCP server | https://flashalpha.com/docs | Free tier (5 calls/day) | Sign up, get API key |
| 15 | Polygon.io | https://polygon.io | Full options chain, historical tick data, WebSocket | https://polygon.io/docs | $79/mo (Options) | Sign up, evaluate free tier first |
| 16 | SEC EDGAR | https://www.sec.gov/edgar | Form 4 (insider), 13F (institutional), 13D (activist) | https://efts.sec.gov/LATEST/search-index?q= | Free | No signup needed, just build the module |
| 17 | CBOE | https://www.cboe.com | Official options data, VIX term structure, put/call ratios | https://www.cboe.com/delayed_quotes/ | Free (delayed) | No signup needed |
| 18 | CME Group | https://www.cmegroup.com | COMEX inventory, COT reports (silver thesis critical) | https://www.cmegroup.com/market-data/ | Free | No signup needed |

### TIER 3: NEED TO ADD (Medium Priority)

| # | Source | URL | What It Provides | Cost | Action Required |
|---|--------|-----|-----------------|------|----------------|
| 19 | Seeking Alpha | https://seekingalpha.com | Analyst ratings, quant grades, factor grades | $20/mo or scrape | Evaluate subscription |
| 20 | Zacks | https://www.zacks.com | Earnings estimates, revisions, Zacks rank | $250/yr | Evaluate value |
| 21 | FinViz | https://finviz.com | Screener, heat maps, insider trading, sector perf | Free / Elite $25/mo | Sign up free tier |
| 22 | Barchart | https://www.barchart.com | Options flow, GEX, market overview | Free tier available | Check if you have access |
| 23 | TradingView | https://www.tradingview.com | Charts, technical analysis, alerts | Free / Pro $15/mo | Already using? |
| 24 | Quandl/Nasdaq | https://data.nasdaq.com | Alternative data sets | Already have key | Verify access scope |

### TIER 4: INSTITUTIONAL TRACKING (Free, Build Module)

| # | Source | URL | What We Track | Frequency |
|---|--------|-----|--------------|-----------|
| 25 | SEC EDGAR — Form 4 | https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=4 | Insider buys/sells on held positions | Daily |
| 26 | SEC EDGAR — 13F | https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=13F | Institutional position changes | Quarterly |
| 27 | SEC EDGAR — 13D/G | https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=SC%2013D | Activist positions > 5% | As filed |
| 28 | WhaleWisdom | https://whalewisdom.com | 13F aggregator (Buffett, Druckenmiller, Burry, etc.) | Quarterly |
| 29 | OpenInsider | https://openinsider.com | Insider trading aggregator | Daily |
| 30 | Congress.gov | https://api.congress.gov | Legislation tracking (energy, defense, mining bills) | As filed |

### TIER 5: MARKET CONTEXT (Free, Build Module)

| # | Source | URL | What It Provides |
|---|--------|-----|-----------------|
| 31 | Shanghai Gold Exchange | https://www.sge.com.cn/sjzx/mrhqsj | Shanghai premium (silver pattern signal) |
| 32 | London Bullion Market | https://www.lbma.org.uk/prices-and-data | LBMA gold/silver fix prices |
| 33 | World Gold Council | https://www.gold.org | Central bank buying, ETF flows, demand data |
| 34 | Silver Institute | https://www.silverinstitute.org | Supply/demand fundamentals, industrial use |
| 35 | USASpending.gov | https://api.usaspending.gov | Defense/tech contract awards |
| 36 | Senate LDA | https://lda.senate.gov/api/ | Lobbying disclosure (energy, mining, defense) |
| 37 | FEC | https://api.open.fec.gov | Campaign finance (political catalyst tracking) |
| 38 | Earnings Whispers | https://www.earningswhispers.com | Earnings calendar, whisper numbers |
| 39 | MarketChameleon | https://marketchameleon.com | Earnings, volatility, options analytics |

### TIER 6: YOUTUBE/SOCIAL (Research, Not Data Feed)

| # | Source | URL | What It Provides |
|---|--------|-----|-----------------|
| 40 | Ghost Prints/TheoTrade | https://theotrade.com | Flow interpretation methodology (study, don't subscribe) |
| 41 | Kobeissi Letter | https://x.com/KobeissiLetter | Macro analysis, institutional flow commentary |
| 42 | Hormuz Letter | https://x.com/HormuzLetter | Strait of Hormuz / Iran conflict updates |
| 43 | Wallstreet Trapper | YouTube | Financial education, position building methodology |

---

## PART 3: PRINCIPAL ACTION ITEMS

### What Billy Needs To Do (I Cannot Do These)

| # | Action | Where | Why | Priority | Time Est |
|---|--------|-------|-----|----------|----------|
| 1 | **FlashAlpha signup** | https://flashalpha.com | Get API key for GEX/dealer regime data. Free tier, no credit card. | HIGH | 5 min |
| 2 | **Confirm UW subscription active** | https://unusualwhales.com/account | Verify API access is live, check tier (which endpoints available) | HIGH | 5 min |
| 3 | **Polygon.io evaluate** | https://polygon.io/pricing | Check if free tier covers options chain data we need. $79/mo if not. | MEDIUM | 10 min |
| 4 | **FinViz free signup** | https://finviz.com/register.ashx | Free screener access, evaluate if Elite ($25/mo) is worth it | MEDIUM | 5 min |
| 5 | **Seeking Alpha evaluate** | https://seekingalpha.com/pricing | $20/mo gets quant grades and factor analysis. Worth it for HUNTER? | MEDIUM | 10 min |
| 6 | **Barchart check** | https://www.barchart.com | Do you already have an account? Free tier has options flow. | LOW | 5 min |
| 7 | **TradingView check** | https://www.tradingview.com | Do you already use this for charting? | LOW | 2 min |
| 8 | **Provide all API keys** | .env file on laptop | Compile all keys into one .env file for Claude Code to use during build | HIGH | 15 min |
| 9 | **E*TRADE OAuth tokens** | E*TRADE developer portal | Confirm consumer key/secret are current, test token refresh | HIGH | 10 min |
| 10 | **Create a2e-platform repo** | https://github.com/new | Private repo: Barefootservants2/a2e-platform | HIGH | 5 min |

### API Keys I Need From You (for .env file)

| # | Key Name | Source | Status |
|---|----------|--------|--------|
| 1 | OPENAI_API_KEY | OpenAI | Stored in n8n |
| 2 | XAI_API_KEY | xAI/Grok | Stored as n8n variable (Grok4_API_Key_20250809) |
| 3 | GOOGLE_AI_KEY | Google AI Studio | Stored (AIzaSyDGpnEwyd7qAbnnryXDytwl60PLIdURErw) |
| 4 | DEEPSEEK_API_KEY | DeepSeek | Stored in n8n |
| 5 | PERPLEXITY_API_KEY | Perplexity | Stored in n8n |
| 6 | ANTHROPIC_API_KEY | Anthropic | Stored in n8n |
| 7 | UW_API_KEY | Unusual Whales | Stored in n8n |
| 8 | FRED_API_KEY | FRED | Stored in n8n |
| 9 | EIA_API_KEY | EIA | Stored in n8n |
| 10 | FINNHUB_API_KEY | Finnhub | Needs credential fix |
| 11 | TELEGRAM_BOT_TOKEN | Hunter Alerts bot | Active |
| 12 | EXEC_BOT_TOKEN | Sentinel Executor bot | 8730831920:AAFkMi7D... |
| 13 | TELEGRAM_CHAT_ID | Your chat | 8203545338 |
| 14 | GITHUB_TOKEN | Claude_MCP_Access | ghp_QZAXXRSA... (expires Jul 3 2026) |
| 15 | ETRADE_CONSUMER_KEY | E*TRADE | Stored in n8n |
| 16 | ETRADE_CONSUMER_SECRET | E*TRADE | Stored in n8n |
| 17 | SUPABASE_URL | Supabase | Stored in n8n |
| 18 | SUPABASE_KEY | Supabase | Stored in n8n (oaPEoIKo5RCFBLi2) |
| 19 | FLASHALPHA_API_KEY | FlashAlpha | **NEEDS SIGNUP** |
| 20 | POLYGON_API_KEY | Polygon.io | **NEEDS SIGNUP** (if pursuing) |
| 21 | NEWSAPI_KEY | NewsAPI | Missing (flagged in HUNTER audit) |
| 22 | TWELVEDATA_API_KEY | TwelveData | Missing (flagged in HUNTER audit) |

### What I Need You To Verify

| # | Question | Why It Matters |
|---|----------|---------------|
| 1 | Are all n8n API keys exportable to a .env file? | Claude Code needs them outside n8n |
| 2 | Which E*TRADE account is the paper trading target? | Need to configure pyetrade for correct account |
| 3 | Do you want the a2e-platform repo public or private? | Affects what we expose |
| 4 | Supabase project — is it on free tier or paid? | Affects storage limits for trade logging |
| 5 | Do you have a Schwab account or plan to migrate? | schwab-py eliminates OAuth midnight death |

---

## PART 4: GHOST PRINTS REPLICATION — ADDED TO BUILD SPEC

### New Module: flow_scanner.py (Phase 2, after CIL)

```
a2e-platform/
├── cil/              # Phase 1 (CIL build spec already delivered)
├── hunter/
│   ├── flow_scanner.py    # Ghost Prints replication
│   ├── gex_calculator.py  # GammaGEX momentum scoring
│   ├── institutional.py   # SEC EDGAR Form 4/13F tracker
│   └── earnings.py        # Earnings calendar awareness
```

**flow_scanner.py capabilities:**
- UW API sweep detection (filtered for portfolio tickers)
- UW API block trade detection
- UW API dark pool prints with price level mapping
- GammaGEX momentum score calculation
- Directional pressure interpretation
- Telegram alerts on threshold events
- Historical logging for pattern learning

**gex_calculator.py formula (from GammaGEX):**
```
Momentum = (0.30 × GEX) + (0.25 × Delta Flow) + (0.20 × Gamma Squeeze) + (0.15 × Vanna) + (0.10 × IV Skew)
```

---

## PART 5: RISK GAPS TO CLOSE

| # | Gap | Module | Build Priority |
|---|-----|--------|---------------|
| 1 | No earnings calendar | hunter/earnings.py | HIGH — add to HUNTER Phase 2 |
| 2 | No liquidity floor | hunter/scanner.py | MEDIUM — min volume check before CIL entry |
| 3 | No SEC EDGAR filings | hunter/institutional.py | HIGH — Form 4 + 13F for watchlist filers |
| 4 | No COMEX inventory tracking | hunter/commodities.py | HIGH — silver thesis structural signal |
| 5 | No Shanghai premium | hunter/commodities.py | MEDIUM — silver pattern 2025/2026 signal |
| 6 | Wash sale cross-account | sentinel/compliance.py | MEDIUM — currently single-account only |

---

## PART 6: HONEST POSITIONING STATEMENT

**What A2E is:** A decision support platform that reduces noise, scores signals through multi-agent consensus, enforces counter-thesis discipline, and codifies risk management. Human decides. System informs.

**What A2E is NOT:** A trading bot. A get-rich-quick tool. A return-promising service. An autonomous execution system.

**Legal language for any public-facing material:**
"Past performance is not indicative of future results. All trading involves risk. A2E provides analytical tools and consensus-based signal scoring. It does not provide financial advice. All investment decisions are made solely by the user. A2E does not guarantee any returns or outcomes."

---

*Document prepared by MICHA v10.7 — April 15, 2026*
*All links verified as of document creation date*
*Push to: A2E_Protocols/PYTHON_MIGRATION/DATA_SOURCES_MASTER_REFERENCE.md*

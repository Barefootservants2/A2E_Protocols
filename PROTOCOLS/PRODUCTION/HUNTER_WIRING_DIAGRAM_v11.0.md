# 🔱 HUNTER WIRING DIAGRAM v11.0
## AIORA HUNTER UNIFIED v1.1 — Full Protocol + Diagnostics
## METATRON v10.4 | February 17, 2026
## 71 Nodes | 61+ Connections | 13 APIs | 5 AI Models
## Principal: William Earl Lemon — ABSOLUTE

---

## MASTER ARCHITECTURE

```
[⏰ SCHEDULE: 5x Daily (6/9/12/3/5 ET)]
        │
        ▼
[📋 WATCHLIST: 50+ Tickers]──── DIAGNOSTIC_MODE toggle
 (8 held, 11 GICS, 8 thematic,    │
  12 IRA, 7 thesis, 6 indices)     │
        │                          │
        ▼                          │
[⚡ SPLIT: Fire All Modules]       │
        │                          │
        ├──→ H1-H14  (Section A: Market Data)
        ├──→ H15-H29 (Section B: Macro & Intel)
        ├──→ H30-H36 (Section C: Influence Chain)
        │
        ▼ (all 33 HTTP + 2 Code modules fire in parallel)
        │
┌───────┴───────────────────────────────────────────┐
│                                                    │
│  H1-H29 ──────→ [🔄 MASTER MERGE] ←── H35 ⚡    │
│  (29 modules)     (Append all)    (Influence       │
│       │              │             Correlator)      │
│       │              │                ↑             │
│       │              │           [🔗 INFLUENCE      │
│       │              │            MERGE (6-in)]     │
│       │              │                ↑             │
│       │              │     H30-Norm, H31-Norm,      │
│       │              │     H32-Norm, H33-Norm,      │
│       │              │     H34-Norm, H36-Norm       │
│       │              │                              │
└───────┴──────────────┼──────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼                         ▼
[📊 DATA AGGREGATOR]    [🏥 DIAGNOSTIC MONITOR]
          │               (parallel path — reports
          ▼                node health when toggled)
[🧠 MICHA Pass 1: Route to Agents]
          │
          ▼
[📦 PAYLOAD BUILDER: Slice for Agents]
          │
    ┌─────┼─────┬─────┬─────┐
    ▼     ▼     ▼     ▼     
 [🔍    [⚙️   [🎯   [🔮
HANIEL] COLOSS] URIEL] RAZIEL]
Gemini  Grok   GPT    DeepSeek
    │     │     │     │
    └─────┼─────┴─────┘
          ▼
[🔗 MERGE: Agent Outputs (4 feeds)]
          │
          ▼
[🧠 MICHA Pass 2: Grand Synthesis]
          │
          ▼
[📤 EXTRACT: Final Report Data]
          │
          ▼
[📝 FORMAT: Telegram + GitHub]
          │
    ┌─────┴─────┐
    ▼           ▼
[📱 TELEGRAM] [📁 GITHUB]
```

---

## SECTION A: MARKET DATA (H1-H14)

All fire from ⚡ SPLIT → output to 🔄 MASTER MERGE

```
⚡ SPLIT ──┬──→ H1 · SEC 13F Elite Filings (EDGAR)      ──→ MASTER MERGE
           ├──→ H2a · Macro Regime (Alpha Vantage)        ──→ MASTER MERGE
           ├──→ H2b · Political News (NewsAPI)             ──→ MASTER MERGE
           ├──→ H3 · Sector Rotation (Alpha Vantage)       ──→ MASTER MERGE
           ├──→ H4 · Insider Trades (Finnhub)              ──→ MASTER MERGE
           ├──→ H5 · Earnings Calendar (Finnhub)           ──→ MASTER MERGE
           ├──→ H6 · Short Interest (Finnhub)              ──→ MASTER MERGE
           ├──→ H7 · Price & Volume OHLCV (TwelveData)    ──→ MASTER MERGE
           ├──→ H8 · RSI + MACD (TwelveData)              ──→ MASTER MERGE
           ├──→ H9 · VIX Fear Gauge (TwelveData)          ──→ MASTER MERGE
           ├──→ H10 · Cross-Asset Correlation (Code)       ──→ MASTER MERGE
           ├──→ H11 · Volume & Liquidity (TwelveData)     ──→ MASTER MERGE
           ├──→ H12 · Short Squeeze Detection (Code)       ──→ MASTER MERGE
           ├──→ H13 · Options Flow (UW) ❌ DISABLED        ──→ MASTER MERGE
           └──→ H14 · Commodity Prices (TwelveData)        ──→ MASTER MERGE
```

## SECTION B: MACRO & INTEL (H15-H29)

```
⚡ SPLIT ──┬──→ H15 · ETF Fund Flows (TwelveData)        ──→ MASTER MERGE
           ├──→ H16 · News Sentiment (Finnhub)            ──→ MASTER MERGE
           ├──→ H17 · SEC EDGAR 8-K Filings               ──→ MASTER MERGE
           ├──→ H18 · Sector Momentum + Credit (TD) [v1.1] ──→ MASTER MERGE
           ├──→ H19 · Dollar Index DXY (TwelveData)       ──→ MASTER MERGE
           ├──→ H20 · Volatility Surface (TwelveData)     ──→ MASTER MERGE
           ├──→ H21 · Congressional Bills (Congress.gov)   ──→ MASTER MERGE
           ├──→ H22 · Whale Watch 13F/13D (SEC)           ──→ MASTER MERGE
           ├──→ H23 · M&A Radar SC13D (SEC)               ──→ MASTER MERGE
           ├──→ H24 · Sector Heatmap (Yahoo)              ──→ MASTER MERGE
           ├──→ H25 · Pattern Scan (Finnhub)              ──→ MASTER MERGE
           ├──→ H26 · Earnings Intel (Finnhub) [v1.1 FIX] ──→ MASTER MERGE
           ├──→ H27 · Fed/FRED Macro Data                  ──→ MASTER MERGE
           ├──→ H28 · Geopolitical News (NewsAPI)          ──→ MASTER MERGE
           └──→ H29 · Shanghai Silver Premium ⚡ [v1.1 FIX] ──→ MASTER MERGE
```

## SECTION C: INFLUENCE CHAIN (H30-H36 → H35)

```
⚡ SPLIT ──┬──→ H30 · Congress Trades (Finnhub) → H30-Normalize ──→ INFLUENCE MERGE [5]
           │
           ├──→ H31a · Senate Committees ──┐
           ├──→ H31b · House Committees  ──┴→ COMMITTEE MERGE → H31-Normalize ──→ INFLUENCE MERGE [4]
           │
           ├──→ H32 · Lobbying Filings (Senate LDA) → H32-Normalize ──→ INFLUENCE MERGE [2]
           │
           ├──→ H33 · Gov Contracts (USASpending) → H33-Normalize ──→ INFLUENCE MERGE [3]
           │
           ├──→ H34 · Campaign Donations (FEC) → H34-Normalize ──→ INFLUENCE MERGE [1]
           │
           └──→ H36 · Lobbyist Donations (Senate LDA) → H36-Normalize ──→ INFLUENCE MERGE [0]

INFLUENCE MERGE (6 inputs) → H35 · INFLUENCE CHAIN CORRELATOR ⚡ → MASTER MERGE [1]
```

### H35 CORRELATOR — 6 ALGORITHMS

| # | Algorithm | Detects | Severity |
|---|-----------|---------|----------|
| 1 | COMMITTEE_TRADE | Member trades in committee's sector | HIGH |
| 2 | CONTRACT_TRADE | Trades within 14 days of contract award | CRITICAL |
| 3 | DONOR_TRADE | Trades stock of campaign donor | CRITICAL |
| 4 | LOBBYING_TRADE | Trades in sector with >$100M lobbying | HIGH |
| 5 | DELAYED_DISCLOSURE | Filing delay >30 days (STOCK Act flag) | CRITICAL |
| 6 | SECTOR_CONVERGENCE | 3+ members trading same sector same month | HIGH |

## SECTION D: AI AGENT ORCHESTRA

```
MASTER MERGE ──→ DATA AGGREGATOR ──→ MICHA Pass 1 ──→ PAYLOAD BUILDER
                                                            │
                      ┌─────────────────────────────────────┼───────────────┐
                      ▼                  ▼                  ▼               ▼
               🔍 HANIEL          ⚙️ COLOSSUS        🎯 URIEL       🔮 RAZIEL
               Gemini 2.0 Flash   Grok-4-1-fast      GPT-4.1-Pro    DeepSeek-R
               Research Intel     Technical Analysis   Strategic      Counter-Thesis
                      │                  │                  │               │
                      └──[0]──→ AGENT MERGE ←──[1]──┘      └──[2]──┘──[3]──┘
                                      │
                                      ▼
                               MICHA Pass 2
                          Claude Sonnet 4.5 (8192 tokens)
                               Grand Synthesis
```

## SECTION E: DELIVERY

```
MICHA Pass 2 ──→ 📤 EXTRACT ──→ 📝 FORMAT ──┬──→ 📱 TELEGRAM (Chat 8203545338)
                                              └──→ 📁 GITHUB (AIORA/reports/hunter_daily/)
```

---

## DIAGNOSTIC SYSTEM (NEW v1.1)

```
MASTER MERGE ──┬──→ DATA AGGREGATOR (normal pipeline)
               │
               └──→ 🏥 DIAGNOSTIC MONITOR (parallel)
                    │
                    └──→ Per-module health report:
                         ✅ OK: Data returned, item count meets threshold
                         ⚠️ EMPTY: Node ran but returned no data
                         ⚠️ LOW_DATA: Returned 1 item when expecting 10+
                         ❌ ERROR: HTTP error, API failure, crash
                         
                         Captures: error messages, HTTP status codes,
                         item counts, data key analysis, timestamps
                         
                         TOGGLE: Set DIAGNOSTIC_MODE = true/false
                         in 📋 WATCHLIST node
```

---

## NODE COUNT SUMMARY

| Category | Count | Nodes |
|----------|-------|-------|
| Schedule Trigger | 2 | Schedule Trigger, ⏰ SCHEDULE |
| Watchlist/Split | 2 | 📋 WATCHLIST, ⚡ SPLIT |
| HTTP Request (Data) | 33 | H1-H29, H30, H31a, H31b, H32-H34, H36 |
| Code (Normalize) | 7 | H30-Norm, H31-Norm, H32-Norm, H33-Norm, H34-Norm, H36-Norm, H35 |
| Code (Utility) | 2 | H10, H12 |
| Merge | 3 | Committee Merge, Influence Merge, Agent Merge |
| Master Merge | 1 | 🔄 MASTER MERGE |
| Pipeline Code | 4 | Data Aggregator, Payload Builder, Extract, Format |
| AI Agents | 6 | MICHA P1, MICHA P2, URIEL, COLOSSUS, HANIEL, RAZIEL |
| Delivery | 2 | Telegram, GitHub |
| Diagnostic | 1 | 🏥 DIAGNOSTIC MONITOR |
| Sticky Notes | 6 | Section labels |
| **TOTAL** | **71** | |

---

## API ROUTING MAP

| API | Auth Method | Nodes |
|-----|-------------|-------|
| SEC EDGAR | Header: User-Agent | H1, H17, H22, H23 |
| Alpha Vantage | Query: apikey | H2a, H3 |
| NewsAPI | Query: apiKey | H2b, H28 |
| Finnhub | Query: token | H4, H5, H6, H16, H25, H26, H30 |
| TwelveData | Query: apikey | H7-H9, H11, H14, H15, H18-H20 |
| Yahoo Finance | None | H24 |
| Congress.gov | Query: api_key | H21, H31a, H31b |
| FEC | Query: api_key | H34 |
| Senate LDA | None (anonymous) | H32, H36 |
| USASpending | None (anonymous) | H33 |
| FRED | Query: api_key/apikey | H27 |
| metals.dev | Query: api_key | H29 |
| Unusual Whales | Header: Bearer (DISABLED) | H13 |
| Anthropic | Header: x-api-key | MICHA P1, P2 |
| OpenAI | Header: Authorization | URIEL |
| xAI | Header: Authorization | COLOSSUS |
| Google AI | Query: key | HANIEL |
| DeepSeek | Header: Authorization | RAZIEL |
| GitHub | Header: Authorization | Delivery |
| Telegram | n8n Credential | Delivery |

---

**METATRON v10.4 | HUNTER v4.0 | KILLSWITCH: ARMED | DRIFT GUARD: ACTIVE**

*"The data leads. The Principal decides."*

🔱

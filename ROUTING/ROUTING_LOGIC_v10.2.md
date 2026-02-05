# ROUTING LOGIC v10.2 — HUB-SPOKE ORCHESTRATION

**Version:** 10.2 | **Owner:** Ashes2Echoes, LLC | **Principal:** William Earl Lemon — ABSOLUTE
**Effective Date:** February 5, 2026
**Classification:** CORE INFRASTRUCTURE — The Brain of METATRON
**Supersedes:** ROUTING_LOGIC v9.0

---

## WHAT IS ROUTING LOGIC?

Routing Logic is the decision engine that determines which agent handles which task. In v10.2, this is the **hub-and-spoke architecture** where MICHA serves as the intelligent router (hub) and specialist agents operate as spokes.

**v9.0:** Dumb broadcast — same data to all agents.
**v10.2:** Intelligent routing — MICHA categorizes, prioritizes, and assigns targeted briefings per agent.

---

## SECTION 1: MASTER FLOW

```
INCOMING REQUEST FROM PRINCIPAL
              │
              ▼
┌─────────────────────────────────────────────┐
│ STEP 0: KILLSWITCH CHECK                    │
│ Keywords: KILLSWITCH, HALT, STOP ALL        │
│ ► DETECTED → IMMEDIATE HALT (no exceptions) │
│ ► NOT DETECTED → Continue                   │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ STEP 1: TRIGGER DETECTION                   │
│ MARKET WATCH → Full 19-gate protocol        │
│ FULL SCAN → H1-H35 all modules              │
│ DISCOVER → Market-wide discovery            │
│ THESIS → HARD HALT gates + analysis         │
│ CLOSE SESSION → PHOENIX close protocol      │
│ Other → Standard routing                    │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ STEP 2: DATA COLLECTION                     │
│ HUNTER modules execute (automated via n8n)  │
│ H1-H35 + HG1-HG8 + HM1-HM16              │
│ Data Aggregator collects all results        │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ STEP 3: MICHA PASS 1 (INTELLIGENT ROUTER)   │
│ Analyze ALL data — what is unusual today?   │
│ Categorize by domain                        │
│ Create TARGETED briefings per agent         │
│ DO NOT filter through any thesis            │
└─────────────────────────────────────────────┘
              │
     ┌────────┼────────┬────────┐
     ▼        ▼        ▼        ▼
  URIEL   COLOSSUS  HANIEL   RAZIEL
  Strat   Technical Research  Counter
     │        │        │        │
     └────────┼────────┴────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ STEP 4: MERGE COLLECTIVE                    │
│ Mode: Append                                │
│ 4 inputs connected                          │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ STEP 5: MICHA PASS 2 (GRAND SYNTHESIZER)    │
│ Score collective concurrence                │
│ Flag disagreements                          │
│ Produce Top 25 consolidated from 4x Top 10  │
│ Enforce Gate 7.5 (counter-thesis)           │
│ Assign KILLSWITCH status                    │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ STEP 6: DELIVERY                            │
│ Response Extractor → Format → Telegram      │
│ GitHub push (session artifacts)             │
└─────────────────────────────────────────────┘
```

---

## SECTION 2: AGENT MODULE ASSIGNMENTS

### URIEL — Strategic Synthesis (CEO)

**Primary Modules:**
| Module | Function | Why URIEL |
|--------|----------|-----------|
| H3 | Macro Regime Data | Pure macro strategy |
| H12 | Sector Rotation | Money flow |
| H27 | FRED Economic Data | Fed/rates/yields |

**Secondary Modules:**
| Module | Function | Why URIEL |
|--------|----------|-----------|
| H2 | Political Catalyst | Macro impact |
| H11 | VIX / Volatility | Regime signal |
| H19 | Currency / DXY | Macro currency |
| H21 | Congressional Intel | Policy impact |
| H26 | Geopolitical Risk | Macro impact |
| H33 | Government Contracts | Strategic impact |

**Output:** Top 10 Opportunities + Top 10 Risks + Regime + Macro Narrative + Sector Rotation

---

### COLOSSUS — Technical Analysis (CTO)

**Primary Modules:**
| Module | Function | Why COLOSSUS |
|--------|----------|--------------|
| H7 | Price/Volume Data | Core technical |
| H8 | RSI/Technical | Indicators |
| H9 | VIX Intraday | Volatility |
| H10 | Volume Anomaly | Technical signal |
| H11 | Market Breadth | Breadth analysis |
| H15 | Short Interest | Squeeze setup |
| H17 | Sector Performance | Relative strength |
| H18 | Market Movers | What moved |
| H25 | Dark Pool Activity | Hidden flow |

**Secondary Modules:**
| Module | Function | Why COLOSSUS |
|--------|----------|--------------|
| H4 | Discovery Scanner | Technical anomaly |
| H20 | Commodity Correlation | Cross-asset technical |
| H29 | Precious Metals Spot | Price action |

**Output:** RSI Alerts + Volume Anomalies + Pattern Signals + VIX Regime + Squeeze Candidates + Biggest Movers + Technical Bias

---

### HANIEL — Research Intelligence (CPO)

**Primary Modules:**
| Module | Function | Why HANIEL |
|--------|----------|------------|
| H1 | SEC EDGAR (13F/13D) | Filing analysis |
| H2 | Political Catalyst | Political synthesis |
| H5 | 8-K Material Events | Corporate filings |
| H6 | SC 13D Activist | Activist plays |
| H14 | Earnings Calendar | Upcoming catalysts |
| H21 | Congressional Intel | Legislation |
| H23 | Institutional 13F | Filing analysis |
| H26 | Geopolitical Risk | Events |
| H28 | Earnings Estimates | Research |
| H30 | Congressional Trading | Trade filings |
| H31 | Committee Assignments | Committee mapping |
| H32 | Lobbying Disclosure | Lobbying filings |
| H33 | Government Contracts | Contract awards |

**Secondary Modules:**
| Module | Function | Why HANIEL |
|--------|----------|------------|
| H13 | Insider Transactions | Filing context |
| H34 | Campaign Finance | Filing context |

**Output:** Whale Activity + Material Events + Activist Plays + Political Catalysts + Congressional Watch + Geopolitical (Top 10) + Earnings Ahead (Top 10) + Surprises + Intelligence Grade

---

### RAZIEL — Counter-Thesis & Pattern Analysis (CAO)

**Primary Modules:**
| Module | Function | Why RAZIEL |
|--------|----------|------------|
| H4 | Discovery Scanner | Anomaly detection |
| H13 | Insider Transactions (FINRA Short Vol) | Pattern analysis |
| H16 | Sentiment Divergence | News vs price conflict |
| H19 | Currency / DXY | Correlation breakdown |
| H20 | Commodity Correlation | Cross-asset analysis |
| H24 | Social Sentiment | Crowd signal |
| H29 | Precious Metals | Thesis validation |
| H34 | Campaign Finance | Donor patterns |
| H35 | Influence Correlator | Cross-signal correlation |

**Secondary Modules:**
| Module | Function | Why RAZIEL |
|--------|----------|------------|
| H1 | SEC EDGAR | Whale accumulation patterns |
| H6 | SC 13D Activist | Activist patterns |
| H8 | Volume Anomaly | Volume significance |
| H14 | Earnings Calendar | Timing risk |
| H15 | Short Interest | Counter-thesis fuel |
| H25 | Dark Pool | Hidden risk |
| H30 | Congressional Trading | Delay patterns |
| H32 | Lobbying Disclosure | Sector correlation |

**Output:** Insider Pattern Analysis + Correlation Breakdown + Sentiment vs Price Divergence + Liquidity Assessment + Cross-Asset Anomalies + Counter-Thesis (Bullish) + Counter-Thesis (Bearish) + The Hidden Risk

---

## SECTION 3: CONCURRENCE SCORING

MICHA Pass 2 scores agent agreement:

| Score | Meaning | Action |
|-------|---------|--------|
| 4/4 🟢 | Full concurrence | High confidence — proceed |
| 3/4 🟡 | Strong concurrence | Proceed with flagged dissent |
| 2/4 🟠 | Split decision | Escalate to Principal with evidence |
| <2/4 🔴 | No concurrence | HARD HALT — do not act without Principal directive |

When agents disagree, MICHA presents:
- What each agent says and why
- Evidence strength per position
- Which agent has the better data for this specific question

---

## SECTION 4: n8n WORKFLOW MAPPING

### Node Sequence in Workflow
```
Manual/Cron Trigger
    → Data Aggregator (H1-H35 parallel HTTP requests)
    → MICHA Pass 1 (Anthropic API — Intelligent Router)
    → Intelligent Router Code Node (categorizes and routes)
    → 4 Agent HTTP Requests (parallel):
        → URIEL (OpenAI API)
        → COLOSSUS (Grok API)
        → HANIEL (Google AI API)
        → RAZIEL (DeepSeek API)
    → Merge Collective (Append mode, 4 inputs)
    → MICHA Pass 2 (Anthropic API — Grand Synthesizer)
    → Response Extractor (Code Node)
    → Format for Delivery
    → Telegram + GitHub Push
```

### Critical Wiring Rules
1. **Merge Collective MUST have 4 inputs connected** — URIEL, COLOSSUS, HANIEL, RAZIEL
2. **Merge mode MUST be Append** — Not merge, not join, not concatenate
3. **All agent nodes use HTTP Request** — Not native AI nodes. Full control.
4. **All agent bodies use "Using JSON" with fx ON** — Expression mode for dynamic data
5. **Response Extractor sits between MICHA Pass 2 and Format** — Extracts text from Anthropic API response format

---

## SECTION 5: QUERY TYPE ROUTING

| Query Type | Route To | Example |
|---|---|---|
| Market analysis / morning scan | Full pipeline (all agents) | "MARKET WATCH" |
| Technical question only | COLOSSUS direct | "What's the RSI on HYMC?" |
| Filing / SEC analysis | HANIEL direct | "Check latest 13F for Sprott" |
| Counter-thesis needed | RAZIEL direct | "What breaks the silver thesis?" |
| Strategy / macro | URIEL direct | "How does the Fed decision affect metals?" |
| Automation / workflow | GABRIEL (n8n) | "Check workflow status" |
| Protocol / compliance | SERAPH check | Automatic — runs in background |
| Everything else | MICHA handles | Default CIO routing |

---

🔱 **ROUTING LOGIC v10.2 — OPERATIONAL**
**Intelligent routing. Hub-spoke concurrence. Data leads, Principal decides.**

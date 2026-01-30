# ROUTING LOGIC v9.0 — COMPLETE ORCHESTRATION SPECIFICATION

**Version:** 9.0 | **Owner:** Ashes2Echoes, LLC | **Principal:** William Earl Lemon — ABSOLUTE  
**Effective Date:** January 29, 2026  
**Classification:** CORE INFRASTRUCTURE — The Brain of METATRON

---

## WHAT IS ROUTING LOGIC?

Routing Logic is the **decision engine** that determines which agent handles which task. It's the "brain" that makes METATRON an orchestrator rather than just another chatbot.

**Without Routing Logic:**
- Every query goes to one AI
- No specialization
- No verification
- No consensus

**With Routing Logic:**
- Right agent for right task
- Multi-agent verification
- Consensus requirements
- Quality gates enforced

---

## SECTION 1: MASTER ROUTING DECISION TREE

### The Complete Flow

```
═══════════════════════════════════════════════════════════════
                    MASTER ROUTING DECISION TREE
═══════════════════════════════════════════════════════════════

INCOMING QUERY FROM WILLIAM
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 0: KILLSWITCH CHECK                                    │
│                                                              │
│ Keywords: KILLSWITCH, HALT, STOP ALL, EMERGENCY STOP,       │
│           FULL STOP                                          │
│                                                              │
│ ► DETECTED → IMMEDIATE HALT (All agents, no exceptions)     │
│ ► NOT DETECTED → Continue to Step 1                         │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: FORGE LAYER                                         │
│                                                              │
│ ► Score query (C.R.E.A.T.E.)                                │
│ ► Transform to master prompt                                 │
│ ► Identify task type                                        │
│                                                              │
│ Output: Task classification + Master prompt                  │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: TASK CLASSIFICATION                                 │
│                                                              │
│ What type of task is this?                                  │
│                                                              │
│ ► TRADING/MARKET → Route to FOUR-RUN PROTOCOL              │
│ ► RESEARCH → Route to RESEARCH PROTOCOL                     │
│ ► COMMUNICATION → Route to COMMUNICATION PROTOCOL           │
│ ► TECHNICAL → Route to TECHNICAL PROTOCOL                   │
│ ► AUTOMATION → Route to GABRIEL                             │
│ ► COMPLEX/EDGE → Route to RAZIEL                           │
│ ► UNCLEAR → Ask clarifying question                        │
└─────────────────────────────────────────────────────────────┘
              │
              ├──────────────────────────────────────┐
              │                                      │
              ▼                                      ▼
    [See Protocol Routes below]              [Ask Clarification]

═══════════════════════════════════════════════════════════════
```

---

## SECTION 2: PROTOCOL ROUTES

### 2.1 TRADING/MARKET PROTOCOL

```
TRADING/MARKET PROTOCOL
═══════════════════════════════════════════════════════════════

TRIGGER KEYWORDS:
• MARKET WATCH, stock, trade, buy, sell, position
• Price, chart, technical, setup, entry, exit
• Portfolio, holding, watchlist, recommendation
• Any ticker symbol (e.g., HYMC, SPY, BTC)

FLOW:
┌─────────────────────────────────────────────────────────────┐
│ Query identified as TRADING/MARKET                          │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ SUB-CLASSIFICATION                                          │
│                                                              │
│ ► "MARKET WATCH" or full analysis requested?                │
│   → FOUR-RUN PROTOCOL (Full sequence)                       │
│                                                              │
│ ► "ORACLE" or context only?                                 │
│   → URIEL Run 1 only (no recommendations)                   │
│                                                              │
│ ► "ORACLE INJECT: [ticker]" or quick thesis?                │
│   → Abbreviated analysis with core gates                    │
│                                                              │
│ ► "SCAN" or quick overview?                                 │
│   → URIEL technical scan only                               │
│                                                              │
│ ► Real-time data request?                                   │
│   → COLOSSUS (SUPERVISED)                                   │
│                                                              │
│ ► Flow/sentiment check?                                      │
│   → COLOSSUS H8/H13/H16 (SUPERVISED)                        │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ FOUR-RUN PROTOCOL (if full analysis)                        │
│                                                              │
│ RUN 1: URIEL                                                │
│ ├── 8-section market scan                                   │
│ ├── Oracle Lightning check                                  │
│ └── Handoff to MICHA                                        │
│                                                              │
│ RUN 2: MICHA                                                │
│ ├── 7-section analysis                                      │
│ ├── PRELIMINARY recommendations                             │
│ ├── Counter-thesis (Gate 7.5)                              │
│ └── Handoff to URIEL                                        │
│                                                              │
│ RUN 3: URIEL                                                │
│ ├── Fresh data verification                                 │
│ ├── 5+ sources per recommendation                           │
│ ├── Bear case / adversarial challenge                       │
│ └── Consensus check → Handoff to MICHA                      │
│                                                              │
│ RUN 4: MICHA                                                │
│ ├── Final execution orders                                  │
│ ├── 30-minute validity window                               │
│ └── AWAITING WILLIAM APPROVAL                               │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════
```

### 2.2 RESEARCH PROTOCOL

```
RESEARCH PROTOCOL
═══════════════════════════════════════════════════════════════

TRIGGER KEYWORDS:
• Research, investigate, find out, deep dive
• Learn about, explain, analyze (non-trading)
• Compare, evaluate, assess
• History of, background on

FLOW:
┌─────────────────────────────────────────────────────────────┐
│ Query identified as RESEARCH                                │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ DEPTH CLASSIFICATION                                        │
│                                                              │
│ ► Quick research (5-10 sources)?                            │
│   → HANIEL primary                                          │
│   → URIEL backup                                            │
│                                                              │
│ ► Deep research (15-25+ sources)?                           │
│   → HANIEL + URIEL parallel                                 │
│   → RAZIEL for complex analysis                             │
│   → MICHA for synthesis                                     │
│                                                              │
│ ► Fact-checking / verification?                             │
│   → RAZIEL primary (evidence quality)                       │
│   → HANIEL for source gathering                             │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ RESEARCH OUTPUT REQUIREMENTS                                │
│                                                              │
│ ► Minimum sources: 5 (quick) / 15 (standard) / 25 (deep)   │
│ ► Authority Score ≥ 2.0 for all sources                    │
│ ► Chain validation to primary sources                       │
│ ► Gaps and uncertainties documented                         │
│ ► Confidence intervals bounded                              │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════
```

### 2.3 COMMUNICATION PROTOCOL

```
COMMUNICATION PROTOCOL
═══════════════════════════════════════════════════════════════

TRIGGER KEYWORDS:
• Write, draft, compose
• Email, message, letter, post
• LinkedIn, social media
• Client, external, professional

FLOW:
┌─────────────────────────────────────────────────────────────┐
│ Query identified as COMMUNICATION                           │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ COMMUNICATION TYPE                                          │
│                                                              │
│ ► Internal (to self, notes)?                                │
│   → MICHA or URIEL (either can handle)                     │
│                                                              │
│ ► External (to others)?                                     │
│   → MICHA for content + empathic calibration               │
│   → HANIEL for visual/brand polish                          │
│   → WILLIAM APPROVAL REQUIRED before sending                │
│                                                              │
│ ► Social media / public?                                    │
│   → MICHA for content strategy                              │
│   → HANIEL for visual assets                                │
│   → WILLIAM APPROVAL REQUIRED                               │
└─────────────────────────────────────────────────────────────┘

⚠️ ALL EXTERNAL COMMUNICATIONS REQUIRE WILLIAM APPROVAL

═══════════════════════════════════════════════════════════════
```

### 2.4 TECHNICAL PROTOCOL

```
TECHNICAL PROTOCOL
═══════════════════════════════════════════════════════════════

TRIGGER KEYWORDS:
• Code, script, program, develop
• Debug, fix, build, deploy
• Architecture, system, infrastructure
• GitHub, API, database

FLOW:
┌─────────────────────────────────────────────────────────────┐
│ Query identified as TECHNICAL                               │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ TECHNICAL TYPE                                              │
│                                                              │
│ ► Real-time/monitoring technical?                           │
│   → COLOSSUS (SUPERVISED)                                   │
│                                                              │
│ ► Automation/workflow?                                      │
│   → GABRIEL (execution)                                     │
│   → MICHA (design review)                                   │
│                                                              │
│ ► Code/development?                                         │
│   → MICHA or URIEL (either can code)                       │
│   → RAZIEL for complex logic                                │
│                                                              │
│ ► Infrastructure/deployment?                                │
│   → GABRIEL (execution)                                     │
│   → MICHA (approval)                                        │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════
```

### 2.5 EDGE CASE PROTOCOL

```
EDGE CASE PROTOCOL
═══════════════════════════════════════════════════════════════

TRIGGER CONDITIONS:
• Query doesn't fit standard categories
• Complex philosophical/ethical question
• Paradox or conflict detected
• Agents disagree and can't resolve
• Unusual or unprecedented situation

FLOW:
┌─────────────────────────────────────────────────────────────┐
│ Query identified as EDGE CASE                               │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│ EDGE CASE HANDLING                                          │
│                                                              │
│ ► Route to RAZIEL for deep analysis                        │
│ ► RAZIEL applies complex reasoning                          │
│ ► If RAZIEL can resolve → Return answer                    │
│ ► If RAZIEL cannot resolve → Escalate to WILLIAM           │
│                                                              │
│ ESCALATION FORMAT:                                          │
│ ├── Description of edge case                                │
│ ├── Analysis attempted                                      │
│ ├── Options identified                                      │
│ ├── Recommendation (if any)                                 │
│ └── Request for William's decision                          │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════
```

---

## SECTION 3: AGENT ROUTING MATRIX

### Quick Reference

| Task Type | Primary | Secondary | Backup | Consensus Required |
|-----------|---------|-----------|--------|-------------------|
| Market Analysis | URIEL → MICHA | COLOSSUS (data) | RAZIEL | Yes (STANDARD+) |
| Trade Recommendation | MICHA | URIEL (verify) | RAZIEL | Yes |
| Research | HANIEL | URIEL | RAZIEL | No |
| Communication (External) | MICHA | HANIEL (polish) | — | WILLIAM |
| Communication (Internal) | MICHA or URIEL | — | — | No |
| Real-Time Data | COLOSSUS | — | URIEL | SUPERVISED |
| Sentiment Analysis | COLOSSUS | — | RAZIEL | SUPERVISED |
| Complex Reasoning | RAZIEL | MICHA | — | No |
| Automation | GABRIEL | — | — | No |
| Adjudication | RAZIEL | — | WILLIAM | No |

### Agent Specialization

```
AGENT SPECIALIZATION MAP
═══════════════════════════════════════════════════════════════

MICHA (Claude Opus 4.5) — CEO
├── Strategic decisions
├── Risk assessment
├── Human communication
├── Run 2 (Analysis)
├── Run 4 (Execution)
└── Final AI authority

URIEL (ChatGPT 5.2 Pro) — COO
├── Market scanning
├── Pattern recognition
├── Broad synthesis
├── Run 1 (Full Scan)
├── Run 3 (Verification)
└── Bear case development

COLOSSUS (SuperGrok) — CTO [SUPERVISED]
├── Real-time data
├── X/Twitter sentiment
├── Flow analysis
├── H1, H4, H8, H9, H12, H13, H15, H16, H20
└── ⚠️ Outputs verified by MICHA

HANIEL (Gemini 3.0 Pro) — CPO
├── Research
├── Brand/visual
├── Customer-facing content
├── H2, H6, H17, H21
└── UI/UX design

RAZIEL (DeepSeek R1) — CAO
├── Adjudication
├── Complex reasoning
├── Evidence quality
├── Counter-thesis validation
└── Tie-breaking

GABRIEL (n8n) — CAuO
├── Workflow automation
├── SENTINEL operations
├── HUNTER scheduling
├── API integrations
└── Does NOT reason, only executes

═══════════════════════════════════════════════════════════════
```

---

## SECTION 4: AGENTIC AI BOT SPECIFICATIONS

### What Are Agentic Bots?

Agentic bots are **specialized sub-agents** that hang off each collective member to execute specific tasks. They are:

- Single-purpose
- Triggered automatically or on demand
- Output to defined formats
- Logged and auditable

### HUNTER Bots (H1-H21)

Each HUNTER module is an agentic bot:

```
HUNTER BOT ARCHITECTURE
═══════════════════════════════════════════════════════════════

HUNTER_H1_ELITE_INVESTOR_BOT
├── Owner: COLOSSUS
├── Trigger: Daily 6:30 AM ET or on-demand
├── Input: SEC EDGAR, OpenInsider
├── Process: Scan Form 4, 13F filings for elite names
├── Output: H1 SIGNAL format
└── Alert: If ⚡ LIGHTNING detected → CRITICAL

HUNTER_H2_POLITICAL_CATALYST_BOT
├── Owner: HANIEL
├── Trigger: Daily 6:30 AM ET or on-demand
├── Input: Congress.gov, Federal Register
├── Process: Track bills, executive orders, regulations
├── Output: H2 SIGNAL format
└── Alert: If sector impact detected → ALERT

HUNTER_H3_SECTOR_MOMENTUM_BOT
├── Owner: URIEL
├── Trigger: Weekly Sunday 8 PM ET
├── Input: Sector ETF data
├── Process: Calculate relative strength rankings
├── Output: H3 SIGNAL format
└── Alert: If rotation detected → INFO

HUNTER_H4_INSIDER_CLUSTER_BOT
├── Owner: COLOSSUS
├── Trigger: Daily 6:30 AM ET
├── Input: Form 4 filings
├── Process: Detect 3+ insiders same ticker in 7 days
├── Output: H4 SIGNAL format
└── Alert: If cluster detected → ALERT

HUNTER_H5_OVERSOLD_QUALITY_BOT
├── Owner: MICHA
├── Trigger: Daily 6:30 AM ET
├── Input: RSI, fundamentals, sector data
├── Process: Screen RSI<30 + quality metrics
├── Output: H5 SIGNAL format
└── Alert: If quality oversold found → INFO

[Continue for H6-H21...]

═══════════════════════════════════════════════════════════════
```

### SENTINEL Bots

```
SENTINEL BOT ARCHITECTURE
═══════════════════════════════════════════════════════════════

SENTINEL_1_MARKET_REGIME_BOT
├── Owner: GABRIEL
├── Trigger: Every 15 min during market hours
├── Input: VIX, yield curve, breadth
├── Process: Classify regime (RISK-ON/OFF/TRANSITIONAL)
├── Output: Regime status
└── Alert: If regime change → ALERT

SENTINEL_2_POSITION_RISK_BOT
├── Owner: GABRIEL
├── Trigger: Every 5 min during market hours
├── Input: Positions, prices, stops
├── Process: Calculate distance to stops
├── Output: Risk status per position
└── Alert: If stop within 2% → CRITICAL

SENTINEL_3_CATALYST_CALENDAR_BOT
├── Owner: GABRIEL
├── Trigger: Daily 6:00 AM ET
├── Input: Earnings, Fed, economic events
├── Process: Match events to positions
├── Output: 48-hour event calendar
└── Alert: If position has event → WATCH

SENTINEL_4_FLOW_ANOMALY_BOT
├── Owner: GABRIEL
├── Trigger: Every 30 min during market hours
├── Input: Dark pool, options flow
├── Process: Detect unusual activity
├── Output: Anomaly detection
└── Alert: If significant anomaly → ALERT

SENTINEL_5_NEWS_SCANNER_BOT
├── Owner: GABRIEL
├── Trigger: Every 10 min
├── Input: News APIs, RSS
├── Process: Match news to positions
├── Output: Material news
└── Alert: If position-relevant news → ALERT

═══════════════════════════════════════════════════════════════
```

### Analysis Bots

```
ANALYSIS BOT ARCHITECTURE
═══════════════════════════════════════════════════════════════

COUNTER_THESIS_BOT
├── Owner: MICHA
├── Trigger: On every thesis/recommendation
├── Input: Thesis details
├── Process: Generate 3 failure modes
├── Output: Counter-thesis analysis
└── Validation: RAZIEL verifies (Gate 7.5)

EVIDENCE_CHAIN_BOT
├── Owner: RAZIEL
├── Trigger: On claim verification request
├── Input: Claim + cited sources
├── Process: Trace chain to primary source
├── Output: CHAIN VALID or CHAIN BROKEN
└── Action: If broken → HALT

AUTHORITY_SCORE_BOT
├── Owner: RAZIEL
├── Trigger: On source evaluation
├── Input: Source URL/citation
├── Process: Calculate AS = (PT × RW × EM × RS) / BF
├── Output: Authority Score
└── Threshold: AS ≥ 2.0

CONSENSUS_BOT
├── Owner: METATRON
├── Trigger: When agents complete analysis
├── Input: MICHA view + URIEL view
├── Process: Compare, identify agreement/disagreement
├── Output: CONSENSUS STATUS
└── Action: If split → Route to RAZIEL

═══════════════════════════════════════════════════════════════
```

---

## SECTION 5: ROUTING DECISION LOGIC (PSEUDO-CODE)

```python
def route_query(query, context):
    """
    Master routing function for METATRON v9.0
    """
    
    # STEP 0: KILLSWITCH CHECK (ALWAYS FIRST)
    if contains_killswitch(query):
        return execute_killswitch()
    
    # STEP 1: FORGE LAYER
    master_prompt = forge_transform(query)
    score = forge_score(query)
    task_type = classify_task(query)
    
    # STEP 2: ROUTE BY TASK TYPE
    
    if task_type == "TRADING_MARKET":
        if is_full_analysis(query):
            return four_run_protocol(master_prompt)
        elif is_context_only(query):
            return uriel_run1_only(master_prompt)
        elif is_quick_thesis(query):
            return abbreviated_analysis(master_prompt)
        elif is_realtime_data(query):
            return colossus_supervised(master_prompt)
        else:
            return uriel_scan(master_prompt)
    
    elif task_type == "RESEARCH":
        depth = determine_depth(query)
        if depth == "QUICK":
            return haniel_research(master_prompt)
        elif depth == "DEEP":
            return parallel_research([haniel, uriel, raziel], master_prompt)
        elif depth == "VERIFY":
            return raziel_verification(master_prompt)
    
    elif task_type == "COMMUNICATION":
        if is_external(query):
            content = micha_draft(master_prompt)
            polished = haniel_polish(content)
            return require_william_approval(polished)
        else:
            return micha_or_uriel(master_prompt)
    
    elif task_type == "TECHNICAL":
        if is_realtime(query):
            return colossus_supervised(master_prompt)
        elif is_automation(query):
            return gabriel_workflow(master_prompt)
        else:
            return micha_or_uriel(master_prompt)
    
    elif task_type == "EDGE_CASE":
        result = raziel_deep_analysis(master_prompt)
        if result.resolved:
            return result
        else:
            return escalate_to_william(result)
    
    else:
        # UNCLEAR - ask for clarification
        return request_clarification(query)


def four_run_protocol(master_prompt):
    """
    Full trading analysis protocol
    """
    # Run 1: URIEL Full Scan
    run1 = uriel_run1(master_prompt)
    
    # Run 2: MICHA Analysis
    run2 = micha_run2(run1.handoff)
    
    # Run 3: URIEL Verification
    run3 = uriel_run3(run2.handoff)
    
    # Check consensus
    if run3.consensus == "SPLIT":
        run3 = raziel_adjudicate(run2, run3)
    
    # Run 4: MICHA Execution Orders
    run4 = micha_run4(run3.handoff)
    
    # Require William approval
    return require_william_approval(run4)


def contains_killswitch(query):
    """Check for KILLSWITCH keywords"""
    keywords = ["KILLSWITCH", "HALT", "STOP ALL", 
                "EMERGENCY STOP", "FULL STOP"]
    return any(kw in query.upper() for kw in keywords)
```

---

## SECTION 6: TRIGGER KEYWORDS REFERENCE

### By Protocol

| Protocol | Trigger Keywords |
|----------|------------------|
| **KILLSWITCH** | KILLSWITCH, HALT, STOP ALL, EMERGENCY STOP, FULL STOP |
| **FOUR-RUN** | MARKET WATCH, full analysis, should I buy/sell |
| **ORACLE** | ORACLE, context, what's happening, overview |
| **ORACLE INJECT** | ORACLE INJECT:, quick look at, thesis on |
| **SCAN** | SCAN, technical scan, quick scan |
| **FLOW CHECK** | FLOW CHECK, institutional flow, dark pool |
| **SENTIMENT CHECK** | CROWD CHECK, sentiment, what's the crowd |
| **REGIME CHECK** | REGIME CHECK, market regime, risk on/off |
| **RESEARCH** | research, investigate, deep dive, learn about |
| **COMMUNICATION** | write, draft, email, LinkedIn |

### Natural Language Mapping

| Natural Language | Interpreted As |
|------------------|----------------|
| "What's the market doing?" | SCAN |
| "Should I buy HYMC?" | FOUR-RUN |
| "What's happening with silver?" | ORACLE |
| "Quick look at PSLV" | ORACLE INJECT |
| "How's institutional flow?" | FLOW CHECK |
| "What's the crowd saying about X?" | SENTIMENT CHECK |
| "Research Y for me" | RESEARCH |
| "Draft an email to Z" | COMMUNICATION |
| "Stop everything" | KILLSWITCH |

---

## SECTION 7: INTER-AGENT COMMUNICATION

### Handoff Protocol

```
STANDARD HANDOFF FORMAT
═══════════════════════════════════════════════════════════════

HANDOFF: [FROM_AGENT] → [TO_AGENT]
RUN: [X] → [X+1] (if Four-Run)
TIMESTAMP: [ISO 8601]
PROTOCOL: METATRON v9.0

───────────────────────────────────────────────────────────────

SUMMARY:
[2-3 sentence summary]

KEY DATA:
[Tables, metrics, findings]

RECOMMENDATIONS: (if applicable)
[Numbered list with confidence]

QUESTIONS FOR RECEIVING AGENT:
[Specific items to address]

GATE STATUS:
[Which gates passed/failed]

───────────────────────────────────────────────────────────────

RECEIVING AGENT MUST:
□ Acknowledge receipt
□ Validate completeness
□ Confirm understanding
□ Proceed or request clarification

═══════════════════════════════════════════════════════════════
```

### Consensus Communication

```
CONSENSUS DISPUTE FORMAT
═══════════════════════════════════════════════════════════════

DISPUTE: [Topic]
PARTIES: [Agent A] vs [Agent B]

AGENT A POSITION:
├── Recommendation: [X]
├── Confidence: XX%
├── Evidence: [Summary]
└── Sources: [Count]

AGENT B POSITION:
├── Recommendation: [Y]
├── Confidence: XX%
├── Evidence: [Summary]
└── Sources: [Count]

POINT OF DISAGREEMENT:
[Specific issue]

ROUTING TO: RAZIEL for adjudication
(Or WILLIAM if RAZIEL cannot resolve)

═══════════════════════════════════════════════════════════════
```

---

## SECTION 8: IMPLEMENTATION CHECKLIST

### To Deploy Routing Logic v9.0

```
DEPLOYMENT CHECKLIST
═══════════════════════════════════════════════════════════════

□ METATRON v9.0 PRIME DIRECTIVE pushed to GitHub PRD
□ All agent instructions (MICHA, URIEL, COLOSSUS, HANIEL, 
  RAZIEL, GABRIEL) pushed to respective folders
□ FORGE v9.0 pushed to /FORGE/
□ ROUTING LOGIC v9.0 pushed to /ROUTING/

□ Each agent loaded with their instruction set
□ Canonical reference to GitHub confirmed in each agent

□ GABRIEL workflows configured:
  □ SENTINEL bots scheduled
  □ HUNTER bots scheduled
  □ Alert channels configured

□ GitHub MCP Server operational
□ Shared state mechanism tested

□ Test routing with sample queries:
  □ KILLSWITCH test
  □ MARKET WATCH test
  □ Research request test
  □ Communication request test
  □ Edge case test

□ William briefed on trigger commands

═══════════════════════════════════════════════════════════════
```

---

**END OF ROUTING LOGIC v9.0**

**Canonical Protocol:** METATRON_v9.0_PRIME_DIRECTIVE.md  
**Location:** GitHub A2E_Protocols/ROUTING/  

---

*The brain of orchestration. Every query, routed right.*

**— ROUTING LOGIC v9.0**

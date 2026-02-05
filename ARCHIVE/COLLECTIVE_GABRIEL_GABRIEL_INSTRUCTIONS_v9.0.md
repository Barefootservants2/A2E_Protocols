# GABRIEL v9.0 — COLLECTIVE INSTRUCTIONS

**Agent:** GABRIEL  
**Platform:** n8n (Workflow Automation)  
**Role:** Chief Automation Officer (CAuO)  
**Version:** 9.0 | **Owner:** Ashes2Echoes, LLC | **Principal:** William Earl Lemon — ABSOLUTE  
**Effective Date:** January 29, 2026  

---

## IMPORTANT: GABRIEL IS NOT AN LLM

**GABRIEL is workflow automation software, NOT an AI model.**

- n8n is a visual workflow builder with 400+ integrations
- GABRIEL executes tasks, doesn't reason about them
- AI capabilities come from embedded LLM nodes (OpenAI, Claude, etc.)
- Think of GABRIEL as the "hands" that execute what the "brains" decide

---

## CANONICAL REFERENCE

**ALL PROTOCOLS ARE DEFINED IN:**
```
GitHub: Ashes2Echoes/A2E_Protocols
Branch: main (PRD)
File: PROTOCOLS/PRODUCTION/METATRON_v9.0_PRIME_DIRECTIVE.md
```

---

## SECTION 1: IDENTITY

### 1.1 What GABRIEL Is

GABRIEL is the **automation layer** of the Uriel Covenant AI Collective. Named for the messenger angel — GABRIEL delivers and executes.

**Platform Capabilities:**
- 400+ pre-built connectors
- Native LangChain support for AI orchestration
- Fair-code license with self-hosting option
- Visual workflow builder
- Human-in-the-loop approval steps
- Error handling and fallback logic
- Audit logging for all executions

### 1.2 GABRIEL's Primary Functions

1. **Workflow Automation** — Scheduled and triggered task execution
2. **SENTINEL Operations** — 24/7 monitoring agents
3. **HUNTER Module Scheduling** — Timed execution of H1-H21
4. **API Bridge** — Connect collective to external services
5. **Alert Distribution** — Push notifications, email, SMS
6. **Email Processing** — ADM-3 email intelligence
7. **GitHub Operations** — Repository management, sync

### 1.3 What GABRIEL Is NOT

- NOT a decision-maker
- NOT a reasoning engine
- NOT autonomous (executes what protocols define)
- NOT a replacement for human approval

---

## SECTION 2: HIERARCHY

```
WILLIAM EARL LEMON (Principal) — ABSOLUTE AUTHORITY
        ↓
    METATRON (Protocol Engine)
        ↓
    MICHA (CEO)
        ↓
    URIEL (COO)
        ↔
    COLOSSUS (CTO) | HANIEL (CPO) | RAZIEL (CAO) | GABRIEL (CAuO) — EXECUTES
```

### GABRIEL's Role
- **Receives instructions** from protocols and agents
- **Executes** without modification
- **Reports** success/failure
- **Escalates** errors per defined thresholds
- **NEVER decides** — only executes

---

## SECTION 3: SENTINEL IMPLEMENTATION

### SENTINEL Architecture in n8n

```
SENTINEL WORKFLOW STRUCTURE
═══════════════════════════════════════════════════════════════

SENTINEL_MASTER (Orchestrator Workflow)
    │
    ├──► SENTINEL_1_MARKET_REGIME
    │    ├── Trigger: Every 15 minutes during market hours
    │    ├── Data: VIX, yield curve, breadth
    │    ├── Output: Regime status
    │    └── Alert: If regime change detected
    │
    ├──► SENTINEL_2_POSITION_RISK
    │    ├── Trigger: Every 5 minutes during market hours
    │    ├── Data: Current positions, prices, stops
    │    ├── Output: Risk status per position
    │    └── Alert: If stop within 2%
    │
    ├──► SENTINEL_3_CATALYST_CALENDAR
    │    ├── Trigger: Daily at 6:00 AM ET
    │    ├── Data: Earnings, Fed, economic events
    │    ├── Output: Events in next 48 hours
    │    └── Alert: If position has event conflict
    │
    ├──► SENTINEL_4_FLOW_ANOMALY
    │    ├── Trigger: Every 30 minutes during market hours
    │    ├── Data: Dark pool, options flow
    │    ├── Output: Anomaly detection
    │    └── Alert: If significant anomaly
    │
    └──► SENTINEL_5_NEWS_SCANNER
         ├── Trigger: Every 10 minutes
         ├── Data: News APIs, RSS feeds
         ├── Output: Material news
         └── Alert: If position-relevant news

═══════════════════════════════════════════════════════════════
```

### Alert Levels

| Level | Trigger | GABRIEL Action |
|-------|---------|----------------|
| INFO | Notable event | Log only |
| WATCH | Developing situation | Daily summary email |
| ALERT | Requires attention | Push notification |
| CRITICAL | Immediate action needed | SMS + Email + Push |
| KILLSWITCH | Portfolio halt | All stops triggered, full alert cascade |

---

## SECTION 4: HUNTER MODULE SCHEDULING

### Workflow Schedules

```
HUNTER WORKFLOW SCHEDULES
═══════════════════════════════════════════════════════════════

DAILY WORKFLOWS (6:30 AM ET):
├── HUNTER_H1_ELITE_INVESTOR
│   └── Scan OpenInsider, SEC EDGAR for Form 4s
├── HUNTER_H4_INSIDER_CLUSTER
│   └── Detect cluster buys
├── HUNTER_H8_INSTITUTIONAL_FLOW
│   └── Dark pool and block trade analysis
├── HUNTER_H9_EARNINGS_CALENDAR
│   └── Update earnings schedule
├── HUNTER_H13_OPTIONS_FLOW
│   └── Unusual options activity
├── HUNTER_H15_ETF_FUND_FLOW
│   └── Sector rotation signals
├── HUNTER_H16_SENTIMENT
│   └── Social sentiment analysis
├── HUNTER_H17_REGULATORY_FILINGS
│   └── New 8-K and material filings
├── HUNTER_H20_VOLATILITY_SURFACE
│   └── VIX term structure
└── HUNTER_H21_CONGRESSIONAL_INTEL
    └── Congress.gov and Capitol Trades

WEEKLY WORKFLOWS (Sunday 8:00 PM ET):
├── HUNTER_H3_SECTOR_MOMENTUM
│   └── Relative strength rankings
├── HUNTER_H6_CONTRACT_PIPELINE
│   └── SAM.gov government contracts
├── HUNTER_H7_MACRO_REGIME
│   └── Regime classification
├── HUNTER_H11_DIVIDEND_MONITOR
│   └── Dividend aristocrat updates
├── HUNTER_H12_SHORT_INTEREST
│   └── FINRA short data
├── HUNTER_H14_COMMODITY_CORRELATION
│   └── Commodity/miner correlations
├── HUNTER_H18_CREDIT_SPREAD
│   └── IG/HY spreads
└── HUNTER_H19_CURRENCY_IMPACT
    └── DXY and forex analysis

═══════════════════════════════════════════════════════════════
```

### Output Handling

```
HUNTER OUTPUT WORKFLOW
═══════════════════════════════════════════════════════════════

1. HUNTER module executes
         │
         ▼
2. Results stored in database
         │
         ▼
3. Signal detection?
    ├── NO → Log and complete
    └── YES → Continue
         │
         ▼
4. Signal type?
    ├── LIGHTNING → CRITICAL alert + Full MARKET WATCH trigger
    ├── CLUSTER → ALERT + Add to daily summary
    └── STANDARD → INFO + Include in next Run 1

═══════════════════════════════════════════════════════════════
```

---

## SECTION 5: INTEGRATION SPECIFICATIONS

### Current Integrations

| Service | Purpose | Authentication |
|---------|---------|----------------|
| **E*TRADE** | Portfolio data, order status | OAuth |
| **SEC EDGAR** | Form 4, 13F, 8-K filings | Public API |
| **OpenInsider** | Insider trading data | Web scrape |
| **Congress.gov** | Legislative tracking | Public API |
| **GitHub** | Repository management | PAT Token |
| **Gmail** | Email processing, alerts | OAuth |
| **Telegram/SMS** | Critical alerts | API |

### MCP Server Integration

```
MCP SERVER TOOLS (via GitHub MCP Server)
═══════════════════════════════════════════════════════════════

AVAILABLE TOOLS:
1. create_repository
2. fork_repository
3. create_branch
4. list_branches
5. create_or_update_file
6. get_file_contents
7. push_files
8. create_issue
9. create_pull_request
10. search_repositories
11. search_code

AUTHENTICATION:
Token: [From William's credentials]
Expires: July 3, 2026

USAGE:
All agents can access repositories through GABRIEL's MCP server
Provides shared state and audit trail

═══════════════════════════════════════════════════════════════
```

---

## SECTION 6: ERROR HANDLING

### Error Response Protocol

```
GABRIEL ERROR HANDLING
═══════════════════════════════════════════════════════════════

ERROR DETECTED
     │
     ▼
CLASSIFY ERROR
├── TRANSIENT (network timeout, rate limit)
│   └── RETRY (max 3 attempts, exponential backoff)
│
├── RECOVERABLE (bad data, parse error)
│   └── LOG + SKIP + CONTINUE workflow
│
├── CRITICAL (authentication failure, API down)
│   └── HALT workflow + ALERT + LOG
│
└── UNKNOWN
    └── HALT + ALERT + AWAIT human intervention

ERROR LOG FORMAT:
{
  "timestamp": "[ISO 8601]",
  "workflow": "[Workflow name]",
  "node": "[Failed node]",
  "error_type": "[Classification]",
  "message": "[Error message]",
  "action_taken": "[Retry/Skip/Halt]",
  "escalated": [true/false]
}

═══════════════════════════════════════════════════════════════
```

---

## SECTION 7: WORKFLOW TEMPLATES

### Template: Daily HUNTER Scan

```yaml
# GABRIEL Workflow: HUNTER_DAILY_MASTER
# Trigger: Daily at 6:30 AM ET

nodes:
  - trigger:
      type: cron
      schedule: "30 6 * * 1-5"  # M-F 6:30 AM
      timezone: "America/New_York"
  
  - parallel_execution:
      - H1_Elite_Investor
      - H4_Insider_Cluster
      - H8_Institutional_Flow
      - H9_Earnings_Calendar
      - H13_Options_Flow
      - H15_ETF_Fund_Flow
      - H16_Sentiment
      - H17_Regulatory_Filings
      - H20_Volatility_Surface
      - H21_Congressional_Intel
  
  - aggregate_results:
      collect: all_outputs
      format: daily_summary
  
  - signal_detection:
      check: lightning_alerts
      if_found: trigger_critical_alert
  
  - store_results:
      destination: database
      table: hunter_daily
  
  - send_summary:
      to: william_email
      template: daily_hunter_summary
```

### Template: SENTINEL Position Monitor

```yaml
# GABRIEL Workflow: SENTINEL_POSITION_RISK
# Trigger: Every 5 minutes during market hours

nodes:
  - trigger:
      type: cron
      schedule: "*/5 9-16 * * 1-5"  # Every 5 min, 9 AM - 4 PM M-F
      timezone: "America/New_York"
  
  - get_positions:
      source: etrade_api
      accounts: [4898, 5267]
  
  - get_current_prices:
      source: market_data_api
      symbols: from_positions
  
  - calculate_risk:
      for_each: position
      compute:
        - distance_to_stop
        - current_pl
        - daily_change
  
  - check_alerts:
      conditions:
        - stop_within_2_percent: ALERT
        - stop_within_1_percent: CRITICAL
        - daily_loss_5_percent: CRITICAL
  
  - if_alert:
      send_notification:
        level: from_condition
        channels: [push, email]
        if_critical: add_sms
```

---

## SECTION 8: SESSION CLOSE AUTOMATION

```
GABRIEL SESSION CLOSE WORKFLOW
═══════════════════════════════════════════════════════════════

Trigger: Manual ("CLOSE SESSION") or Scheduled (11 PM ET)

STEPS:
1. Verify GitHub push status
   └── If pending: Execute sync

2. Compile pending items
   └── Query: Open tasks, unanswered questions

3. Check downloads folder
   └── List files in /mnt/user-data/outputs

4. Generate session summary
   └── Key decisions, actions taken, open items

5. Send summary email
   └── To: William
   └── Subject: Session Close - [Date]

6. Execute local sync
   └── Command: F:\AIORA_Command_Suite\repos\Sync-Repos.ps1

═══════════════════════════════════════════════════════════════
```

---

## SECTION 9: DEPLOYMENT INSTRUCTIONS

### n8n Server Setup

```bash
# Self-hosted n8n deployment
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=[secure_password] \
  n8nio/n8n
```

### Workflow Import

1. Access n8n at `http://localhost:5678`
2. Import workflow JSON files from `/GABRIEL/workflows/`
3. Configure credentials for each integration
4. Activate workflows
5. Test with manual triggers before enabling schedules

---

## SECTION 10: FORBIDDEN ACTIONS

GABRIEL is **PROHIBITED** from:

1. Making decisions (only executes)
2. Modifying workflow logic without William approval
3. Sending alerts outside defined thresholds
4. Executing trades without explicit human approval step
5. Skipping error logging
6. Bypassing authentication

---

**END OF GABRIEL INSTRUCTIONS v9.0**

**Canonical Protocol:** METATRON_v9.0_PRIME_DIRECTIVE.md  
**Location:** GitHub A2E_Protocols/PROTOCOLS/PRODUCTION/  

---

*The messenger delivers. The hands execute.*

**— GABRIEL, CAuO of the Uriel Covenant**

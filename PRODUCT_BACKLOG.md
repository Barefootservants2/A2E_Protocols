# AIORA PRODUCT BACKLOG

**Owner:** Ashes2Echoes, LLC | **Principal:** William Earl Lemon — ABSOLUTE  
**Created:** January 23, 2026 | **Last Updated:** January 23, 2026

---

## ACTIVE BACKLOG

### P0 — CRITICAL (This Week)

| ID | Feature | Description | Status | Target |
|----|---------|-------------|--------|--------|
| PB-001 | n8n Base Deployment | Deploy n8n instance for workflow automation | NOT STARTED | Week 1 |
| PB-002 | E*TRADE MCP Auth | Complete OAuth flow for live trading | IN PROGRESS | Week 1 |

### P1 — HIGH (Next 2 Weeks)

| ID | Feature | Description | Status | Target |
|----|---------|-------------|--------|--------|
| PB-010 | H4 Insider Alert Workflow | n8n + OpenInsider RSS automation | NOT STARTED | Week 1 |
| PB-011 | H1 13F Delta Workflow | n8n + WhaleWisdom/SEC | NOT STARTED | Week 1 |
| PB-012 | H6 Contract Alert Workflow | n8n + DOD RSS | NOT STARTED | Week 1 |
| PB-013 | PHOENIX Checkpoint Deploy | Session recovery automation | NOT STARTED | Week 2 |

### P2 — MEDIUM (Month 1)

| ID | Feature | Description | Status | Target |
|----|---------|-------------|--------|--------|
| PB-020 | Thesis Persistence DB | SQLite/JSON for thesis tracking | NOT STARTED | Week 2 |
| PB-021 | H8 Options Flow Integration | Unusual Whales or alternative API | NOT STARTED | Week 3 |
| PB-022 | OpenBB Market Data | Real-time data integration | NOT STARTED | Week 3 |

### P3 — FUTURE (Quarter 1)

| ID | Feature | Description | Status | Target |
|----|---------|-------------|--------|--------|
| PB-030 | Agent Sync Infrastructure | Multi-session coordination | NOT STARTED | Week 4 |

---

## PRODUCT FEATURE REQUESTS

### PFR-001: Multi-Broker Client Integration

**Requested:** January 23, 2026  
**Priority:** P2 — Future Product Feature  
**Status:** CAPTURED

**Description:**
Build user-facing broker integration system for AIORA web platform:

1. **User Contract Signing** — User signs agreement to use AIORA services
2. **Broker Identification** — User selects broker type:
   - Self-directed brokerage (E*TRADE, Schwab, Fidelity, etc.)
   - Fiduciary/advisor-managed account
   - Manual ticker entry (no broker connection)
3. **Portfolio Storage** — Store user's tickers and positions for recurring updates
4. **Automated QUICK CHECK** — Run QUICK CHECK protocol against user portfolio
5. **Stop Recommendations** — Generate stop-loss recommendations per AIORA protocol
6. **Execution Path:**
   - API-connected: Preview/place stops directly
   - Non-connected: Provide manual execution instructions

**Technical Requirements:**
- OAuth integration for major brokers (E*TRADE, Schwab, TD, Fidelity)
- Secure credential storage (vault pattern)
- Position sync scheduler
- Stop calculation engine (replicate METATRON logic)
- User dashboard for portfolio view

**Revenue Model:**
- Subscription tier for automated monitoring
- Per-execution fee for trade signals
- Premium tier for real-time alerts

**Notes:**
- Replicate exact QUICK CHECK output format from Claude sessions
- Must support both retail and institutional workflows
- Consider regulatory requirements (not investment advice disclaimers)

---

## COMPLETED

| ID | Feature | Completed | Notes |
|----|---------|-----------|-------|
| — | — | — | — |

---

## CHANGELOG

| Date | ID | Change |
|------|-----|--------|
| 2026-01-23 | PFR-001 | Created multi-broker integration feature request |
| 2026-01-23 | PB-001-022 | Initial backlog items from production readiness tracker |

---

**END PRODUCT BACKLOG**

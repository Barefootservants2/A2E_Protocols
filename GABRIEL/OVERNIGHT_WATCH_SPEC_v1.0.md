# GABRIEL OVERNIGHT WATCH — SPECIFICATION v1.0

**Author:** MICHA (CIO, Uriel Covenant)  
**Date:** March 3, 2026  
**Status:** SPECIFICATION — BUILD REQUIRED  
**Priority:** CRITICAL — This is the gap that cost $7,619  
**Target Platform:** n8n (GABRIEL automation layer)  

---

## THE PROBLEM

March 3, 2026, 4:00 AM ET: Silver spot dropped from ~$94 to ~$82 overnight (-12.5%).  
March 3, 2026, 7:30 AM ET: Principal attempted to update trailing stops before open.  
March 3, 2026, 9:30 AM ET: Market opens. Stops already underwater. Filled at worst levels.  
**Result:** $7,619 in realized losses that were preventable with overnight monitoring.

The market trades 24 hours. Our risk management operated 6.5 hours (market open only). That is a 73% coverage gap. Silver, gold, and oil trade continuously through London, Shanghai, and COMEX Globex sessions. A 2.5% trailing stop set at 4:00 PM ET has zero relevance by 9:30 AM ET if the underlying moved 12% overnight.

---

## ARCHITECTURE

### Data Flow
```
OVERNIGHT MARKETS (6PM-9:25AM ET)
    |
    v
GABRIEL n8n Workflow (runs every 15 min)
    |
    ├── Silver spot (Finnhub/Yahoo Finance websocket)
    ├── Gold spot (same)
    ├── VIX futures (CBOE/Yahoo)
    ├── Crude oil futures (for LNG correlation)
    └── E*TRADE API: current positions + open orders
    |
    v
TRIGGER ENGINE (threshold checks)
    |
    ├── LEVEL 1: Alert only (3-5% move)
    ├── LEVEL 2: Alert + prepare orders (5-8% move)
    └── LEVEL 3: Alert + auto-execute protective orders (>8% or VIX>30)
    |
    v
OUTPUT CHANNELS
    ├── Telegram bot: Principal notification
    ├── Email: Detailed alert with positions affected
    ├── E*TRADE API: Order submission (Level 3 only)
    └── Trade log: All actions recorded
```

### Monitoring Schedule
| Window | Time (ET) | Frequency | Market |
|--------|-----------|-----------|--------|
| Asia Open | 6:00 PM - 12:00 AM | Every 15 min | Shanghai, Tokyo, Singapore |
| London Open | 3:00 AM - 8:00 AM | Every 10 min | LBMA, COMEX Globex |
| Pre-Market | 7:00 AM - 9:25 AM | Every 5 min | US pre-market, futures |
| Morning Brief | 8:00 AM | Once | Consolidated report |

---

## TRIGGER CONDITIONS

### Per-Position Triggers
| Trigger | Threshold | Level | Action |
|---------|-----------|-------|--------|
| Silver spot move | > 3% from US close | 1 | Alert |
| Silver spot move | > 5% from US close | 2 | Alert + prepare stop modifications |
| Silver spot move | > 8% from US close | 3 | Alert + auto-protect |
| Gold spot move | > 2% from US close | 1 | Alert |
| Gold spot move | > 4% from US close | 2 | Alert + prepare modifications |
| VIX futures | Cross above 25 | 1 | Alert |
| VIX futures | Cross above 30 | 3 | Auto-reduce ALL thesis 50% |
| Any position | > 5% overnight move | 2 | Alert + prepare orders |
| CME margin hike | Detected | 3 | Immediate alert + de-risk queue |

### Cross-Position Triggers
| Trigger | Condition | Action |
|---------|-----------|--------|
| Correlated selloff | Silver AND gold both > 3% down | Escalate to Level 2 minimum |
| Regime shift | VIX moves 5+ points overnight | Recalculate ALL stop widths per v1.1 matrix |
| Thesis invalidation | Fundamental catalyst reversal (ceasefire, policy shock) | LEVEL 3: prepare full exit orders |

---

## ACTION PROTOCOLS

### Level 1: ALERT (3-5% move)
- Telegram message to Principal with: ticker, move %, current price, stop price, distance to stop
- No automated order changes
- Log alert in trade journal

### Level 2: ALERT + PREPARE (5-8% move)
- Everything in Level 1
- Calculate new stop levels per IRONCLAD v1.1 VIX matrix
- Generate E*TRADE order modification payloads (cancel old stop, place new)
- Queue orders for Principal approval via Telegram bot
- If Principal approves: submit via E*TRADE API
- If no response within 30 min: escalate to Level 3

### Level 3: AUTO-PROTECT (>8% move or VIX >30)
- Everything in Level 1 + 2
- **AUTO-SUBMIT protective orders via E*TRADE API without waiting for approval**
- Actions: widen stops to v1.1 HIGH/CRISIS levels, place protective limit sells
- Principal notified immediately with full order details
- All actions logged with timestamps

### Pre-Market Execution (7:00-9:25 AM ET)
1. GABRIEL reviews all overnight alerts and price changes
2. Recalculates stop distances for every open position against current pre-market prices
3. Identifies stops that are now < 2% from current price (about to trigger at open)
4. Generates morning brief with:
   - Overnight summary (prices, moves, alerts fired)
   - Current stop status for every position
   - Recommended modifications
   - Pre-submitted orders (if Level 3 triggered)
5. Delivers via Telegram by 8:00 AM ET

---

## E*TRADE API INTEGRATION

### Required Endpoints
| Function | Endpoint | Purpose |
|----------|----------|---------|
| Get positions | GET /v1/accounts/{id}/portfolio | Current holdings |
| Get orders | GET /v1/accounts/{id}/orders | Open stops/limits |
| Cancel order | PUT /v1/accounts/{id}/orders/cancel | Remove existing stop |
| Place order | POST /v1/accounts/{id}/orders/place | New stop/limit |
| Preview order | POST /v1/accounts/{id}/orders/preview | Validate before submit |

### Order Modification Flow
```
1. GET current stop order details (price, qty, order ID)
2. Calculate new stop per v1.1 matrix + current VIX + overnight move
3. Preview new order via API
4. Cancel existing stop order
5. Place new stop order
6. Verify new order is OPEN status
7. Log: old stop, new stop, reason, timestamp
```

### Safety Constraints
- NEVER increase position size overnight (buys blocked)
- NEVER remove stops entirely (only widen per v1.1)
- Maximum order value per auto-execution: $50,000
- Daily auto-execution limit: 5 orders
- All auto-executions require post-hoc Principal review within 24hrs

---

## DATA SOURCES

### Primary (Real-time)
| Data | Source | Method | Cost |
|------|--------|--------|------|
| Silver spot | Finnhub API (H30) | WebSocket | Free tier available |
| Gold spot | Finnhub API (H30) | WebSocket | Same |
| VIX futures | Yahoo Finance | REST poll | Free |
| Crude oil | Yahoo Finance | REST poll | Free |

### Secondary (Confirmation)
| Data | Source | Method |
|------|--------|--------|
| Shanghai silver | via web scrape or API | Scheduled poll |
| CME margins | CME Group RSS/API | Scheduled check |
| COMEX inventory | CME reports | Daily check |

---

## n8n WORKFLOW STRUCTURE

### Nodes (Estimated)
| Node | Function | Schedule |
|------|----------|----------|
| CRON Trigger | Fire every 15 min (6PM-9:25AM ET) | Scheduled |
| Data Fetch (Silver) | GET silver spot | On trigger |
| Data Fetch (Gold) | GET gold spot | On trigger |
| Data Fetch (VIX) | GET VIX futures | On trigger |
| E*TRADE Auth | OAuth refresh | On trigger |
| Position Fetch | GET all positions from 3 accounts | On trigger |
| Order Fetch | GET all open stops from 3 accounts | On trigger |
| Close Price Cache | Store yesterday's close prices | 4:05 PM daily |
| Threshold Calculator | Compare current vs close, calc % move | On data |
| Level Router | Route to L1/L2/L3 based on thresholds | On threshold |
| Telegram Alert | Send alert message | L1/L2/L3 |
| Email Alert | Send detailed alert | L2/L3 |
| Order Generator | Build stop modification orders | L2/L3 |
| Approval Gate | Wait for Principal Telegram response | L2 |
| Auto-Execute | Submit orders to E*TRADE | L3 |
| Trade Logger | Write all actions to log | All levels |
| Morning Brief | Compile overnight summary | 8:00 AM |

**Estimated total: ~20 nodes**

---

## BUILD PRIORITY

This is the single most important automation in the Collective. The March 3 loss proved that:
- Manual stop management fails when the market moves overnight
- The Principal cannot monitor 24hr markets manually
- A 73% coverage gap in risk management is unacceptable
- The difference between $7,619 loss and $0 loss was ~4 hours of monitoring

### Build Order
1. **Phase A (Week of Mar 3):** Basic alert system — Finnhub silver + Telegram alerts. No order execution.
2. **Phase B (Week of Mar 10):** Add E*TRADE position/order reads. Morning brief generation.
3. **Phase C (Week of Mar 17):** Add E*TRADE order modification (Level 2, approval required).
4. **Phase D (Week of Mar 24):** Add Level 3 auto-execution with safety constraints.

---

## RELATIONSHIP TO EXISTING SYSTEMS

| System | Role | Integration Point |
|--------|------|-------------------|
| IRONCLAD v1.1 | VIX matrix, stop rules | Overnight Watch uses v1.1 to calculate correct stops |
| HUNTER | Market scanning | Overnight Watch is HUNTER's night shift |
| METATRON | Orchestration | All Level 3 actions logged through METATRON gates |
| PHOENIX | Session management | Morning brief = session initialization data |
| CIL | Collective Intelligence | Overnight alerts feed into CIL consensus |
| E*TRADE MCP | Broker interface | Direct order management |

---

*Specification: A2E_Protocols/GABRIEL/OVERNIGHT_WATCH_SPEC_v1.0.md*

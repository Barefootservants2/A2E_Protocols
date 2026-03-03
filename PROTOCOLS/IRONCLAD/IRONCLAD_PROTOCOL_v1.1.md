# IRONCLAD v1.1 — VOLATILITY-ADJUSTED RISK MANAGEMENT FRAMEWORK

**Version:** 1.1  
**Effective:** March 3, 2026  
**Status:** RATIFIED — LOCKDOWN ACTIVE  
**Author:** MICHA (CIO, Uriel Covenant)  
**Approved:** William Earl Lemon (Principal, Ashes2Echoes LLC)  
**Supersedes:** IRONCLAD v1.0  

---

## CHANGELOG FROM v1.0

| Change | v1.0 | v1.1 | Reason |
|--------|------|------|--------|
| Trailing Stop | Flat 2.5% all conditions | VIX-scaled 2.5%–10.0% | 2.5% triggered on 12% silver gap = $7,619 loss |
| Order Type | Market orders permitted | Limit-only when VIX > 20 | Market orders filled AG at $31.97 (day high) |
| Position Sizing | 20% max | VIX-scaled 5%–20% | Full-size in crisis vol = guaranteed stop-outs |
| Precious Metals | Same rules as equities | Minimum 5% stop floor | PM vol structurally exceeds equity vol |
| Overnight Hold | No restriction | Reduce/exit in VIX > 25 | Overnight gap through stop with no fill protection |
| Entry Staging | Single entry | 50/50 staggered VIX > 20 | Reduces timing risk on volatile opens |
| Circuit Breakers | None | Silver -5% intraday, VIX 30+ | Automated de-risk triggers |

---

## 1. VIX-SCALED TRAILING STOP MATRIX

The flat 2.5% trailing stop is DEAD for all conditions except normal low-vol markets.

| VIX Regime | VIX Range | Trailing Stop % | Max Position Size | Order Type | Overnight Hold |
|------------|-----------|-----------------|-------------------|------------|----------------|
| **NORMAL** | < 18 | 2.5% | 20% of account | Market or Limit | YES |
| **ELEVATED** | 18–22 | 4.0% | 15% of account | Limit only | YES with caution |
| **HIGH** | 22–30 | 5.0–7.0% | 10% of account | Limit only, NO market | REDUCE 50% before close |
| **CRISIS** | 30+ | 8.0–10.0% | 5% of account | Limit only, staggered | NO — cash by close or accept gap |

**Current Status (March 3, 2026):** VIX at 25.16 = **HIGH REGIME**. All positions: 5-7% stops, 10% max, limit only.

### Precious Metals Override
AG, PSLV, SLV, SIL, GLD, HYMC carry a **minimum 5% trailing stop floor** regardless of VIX regime. This overrides NORMAL 2.5% for all PM positions.

**Rationale:** Silver ATR was 8-12% daily. A 2.5% stop on 8%+ ATR = automatic exit on noise.

---

## 2. ENTRY RULES

| Rule | Description | Rationale |
|------|-------------|-----------|
| **E1** | NO market orders when VIX > 20 | Market orders at open = worst fills. AG filled at $31.97 day high |
| **E2** | Limit orders 2-3% BELOW current on gap-up days | Prevents buying intraday highs |
| **E3** | Stagger entries 50/50 when VIX > 20 | Reduces timing risk |
| **E4** | NO new positions after 3:30 PM ET | Prevents overnight gap on fresh entries |
| **E5** | Thesis positions: 48hr cooling period | Prevents FOMO. Principal override with documented rationale only |
| **E6** | Max 3 new positions per day | Prevents spray-and-pray |
| **E7** | PM positions ALWAYS 5%+ stops | PM vol > equity vol structurally |

---

## 3. EXIT / PROFIT-TAKING RULES

| Rule | Trigger | Action | Status |
|------|---------|--------|--------|
| **X1** | +10% gain | Sell 50% | UNCHANGED |
| **X2** | +20% gain | Sell 60% remaining | UNCHANGED |
| **X3** | -5% from entry (hard stop) | EXIT 100% | UNCHANGED |
| **X4** | Binary event | Reduce 25-50% BEFORE | UNCHANGED |
| **X5** | VIX crosses 30 | Reduce ALL thesis 50% | **NEW** |
| **X6** | Silver -5% intraday | EXIT all silver immediately | **NEW** |
| **X7** | Overnight hold, VIX > 25 | Hard stop -5% from close | **NEW** |

---

## 4. POSITION SIZING CAPS

### Per-Account

| Account | Role | Max Single | Max Sector | Thesis Plays |
|---------|------|-----------|------------|-------------|
| 6685 (IRA) | Core + thesis | 20% (VIX-adj) | 35% | 2 concurrent |
| 4898 (Banking) | Weekly ROI | 15% | 30% | 1 concurrent |
| 5267 (Dad) | Dividend ONLY | 20% | 35% | NONE |

### Asset Class Caps (Cross-Account)

| Class | Max % |
|-------|-------|
| Silver complex (AG, PSLV, SLV, SIL) | 15-20% total |
| Gold (GLD) | 10% |
| Energy (LNG, XLE) | 15% |
| Defense (LHX, NOC, RTX) | 15% |
| Speculative (HYMC, 2x ETFs) | 2% per name, 5% total |
| Dividend core (JEPI, SCHD, SPHD) | No cap |
| Cash/SGOV | No cap |

---

## 5. REGIME DETECTION

MICHA monitors:
1. **VIX level** — checked at open, midday, 3:30 PM ET
2. **Silver ATR (14-day)** — ATR > 5% forces HIGH regime minimum for PM
3. **CME margin notices** — any hike triggers immediate position review
4. **Overnight gap magnitude** — >3% gap escalates regime one level for 48hrs

### Transition Rules
- **Upgrade (higher risk):** Immediate. VIX crosses threshold = new rules NOW.
- **Downgrade (lower risk):** 2 consecutive days below threshold required.
- **Manual override:** Principal can escalate but CANNOT downgrade below VIX indication.

---

## 6. OVERNIGHT MONITORING PROTOCOL (NEW — v1.1 CRITICAL)

### The Problem
March 3, 2026: Silver gapped from ~$94 to ~$82 (-12.5%) overnight. Principal attempted to update stops before open. Failed — underwater before the bell.

### The Solution: GABRIEL Overnight Watch

GABRIEL (n8n automation) monitors overnight markets between 6:00 PM ET and 9:25 AM ET:

**Data Sources:**
- Silver spot via futures/Shanghai (continuous)
- Gold spot (continuous)
- VIX futures (continuous)
- E*TRADE position data via API

**Trigger Conditions (any one fires the protocol):**
1. Silver spot moves > 3% from US close in either direction
2. Gold spot moves > 2% from US close
3. VIX futures cross above 30
4. Any held position's underlying moves > 5% overnight

**Actions When Triggered:**
- LEVEL 1 (3-5% move): Alert Principal via Telegram + email. Prepare stop modification orders.
- LEVEL 2 (5-8% move): Alert + auto-generate limit orders to widen/tighten stops per VIX matrix. Queue for Principal approval via Telegram bot.
- LEVEL 3 (>8% move or VIX >30): Alert + auto-submit protective stop orders via E*TRADE API. Notify Principal. No approval wait — market doesn't wait.

**Pre-Market Execution Window (7:00-9:25 AM ET):**
- GABRIEL reviews all overnight alerts
- Generates stop modification recommendations
- Submits via E*TRADE API with Principal notification
- Morning brief delivered to Telegram by 8:00 AM ET

---

## 7. RECOVERY FRAMEWORK

### Phase 0: LOCKDOWN (Active March 3)
- All thesis positions closed or properly stopped
- No new deployments. IRONCLAD v1.1 ratified.

### Phase 1: STABILIZE (March 3-7)
- Monitor LNG/UFO with v1.1 stops
- Collect dividends. Paper trade only.
- Exit: VIX < 22 for 2 consecutive days

### Phase 2: SMALL BITES (March 10-21)
- Max $25K per position. v1.1 stops. Limit only.
- 5% profit target = trim 50%. One thesis at a time.
- Target: first $2,500 recovered

### Phase 3: SCALE (March 21+)
- $50K positions. Max 2 concurrent. METATRON gates.
- Weekly P/L review in Sunday Session.
- Target: full $7,619 recovered

---

## 8. INCIDENT REPORT — MARCH 2-3, 2026

### Event
$55K rotated from SGOV into PM/energy positions on March 2 (Iran war thesis). 2.5% trailing stops per v1.0. Silver crashed 12.5% overnight. Stops triggered at open.

### Losses
- AG (1,550 shares): -$5,464 (overnight gap)
- AG (625 shares): -$544 (same-day)
- PSLV (1,000 shares): -$4,000 (overnight gap)
- PSLV (647 shares): -$459
- AG 4898 (470 shares): -$408
- SIL 4898 (175 shares): -$653
- AG 5267 (50 shares): -$132
- **Total: ~$7,619 realized**

### Root Causes
1. Flat 2.5% stops in wartime vol (ATR 8-12%)
2. Market orders at open (filled at day high)
3. No VIX-adjusted sizing
4. No overnight gap protection
5. Single-session $55K deployment (no staging)

### What Worked
- Thesis correct: Iran, Hormuz, oil +7%, defense +6-20%, LNG +5.25%
- Portfolio -0.68% vs market -1.7-2.1% (outperformed)
- Dividend core intact. LNG executing perfectly.
- Stops fired as designed — just miscalibrated

### Corrective Actions
All 5 root causes addressed by IRONCLAD v1.1.

---

*Version controlled at: A2E_Protocols/PROTOCOLS/IRONCLAD/IRONCLAD_PROTOCOL_v1.1.md*

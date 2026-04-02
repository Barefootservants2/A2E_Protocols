# HUNTER v3.3 — REQUIREMENTS PART 5 of 5
# FIVE RING FRAMEWORK + RETURN MODEL + COMPLETE ACTION LIST
# Ashes2Echoes LLC | METATRON v10.8 | For: n8n Build AI
---

## CONTEXT

Parts 1-4 covered all 42 H-modules, agents, and synthesis layer.
Part 5 is the strategic layer — why we build this, what we're targeting,
and the complete prioritized action list to get there.

---

## THE PHILOSOPHY

We will never compete with Goldman or Citadel on speed, capital, or quant depth.
We beat them on breadth of signal correlation and systematic discipline.

They ignore:
- Congressional stock trades (STOCK Act filings)
- Lobbying spend correlated to legislation
- Federal contract awards as revenue signals
- FEC campaign finance mapping industry → candidate → bill → stock

We capture all of it. We correlate it. H35 Influence Correlator is the moat.

We also cannot afford to be wrong on risk management. One blown-up position
can erase months of gains. IRONCLAD v2.1 exists for this reason.

The goal is not to hit home runs. The goal is 17-20% annual via consistent
singles across four rings while Ring 1 (passive income) runs in the background.

---

## FIVE RING FRAMEWORK — COMPLETE SPECIFICATION

### RING 1 — Core Income (40-50% of NAV)
HOLDINGS: SGOV (T-bills), JEPI (covered calls), SCHD (dividend growth)
HUNTER ROLE: None. Ring 1 is buy-hold. Never sell Ring 1 for Ring 4 plays.
ANNUAL CONTRIBUTION: ~$8,265/yr on $350K NAV
CURRENT STATUS: Held. SCHD stop at $29.00, PHYS stop at $33.50.

### RING 2 — Metals Thesis (10-15% of NAV)
HOLDINGS: PSLV (physical silver), IBIT (Bitcoin ETF proxy)
HUNTER MODULES: H29 (metals spot), H42 (COMEX), H43 (COT), H44 (PSLV premium),
  Gate 9 (correlation kill switch), Shanghai premium calculation
ANNUAL CONTRIBUTION TARGET: $7-14K (thesis completion)
THESIS STATUS: Active. Silver $70.29. Shanghai premium confirming. Thesis intact.
IRONCLAD STOP: PSLV at $22.60 (hard floor, no exceptions)
KILL SWITCH: Gate 9 adverse → auto 50% metals reduction + 48hr embargo

RING 2 SIGNAL HIERARCHY:
  1. CFTC COT: Commercials covering shorts = strongest buy signal (weekly)
  2. Shanghai premium > $5/oz = physical demand confirmed (daily)
  3. PSLV premium > 3% = institutional physical buying (daily)
  4. COMEX inventory falling = supply squeeze developing (daily)
  5. H29 silver spot trend = price confirmation (daily)
  IF all 5 align = maximum Ring 2 allocation
  IF Gate 9 kills = mandatory reduction regardless of thesis

### RING 3 — Structural Trends (15-20% of NAV)
CURRENT HOLDINGS: FCX, PLTR, LHX, RKLB
HUNTER MODULES: URIEL (primary), H21 (legislation), H22 (whale 13F), H33 (contracts), H35 (convergence)
ANNUAL CONTRIBUTION TARGET: $13-21K
ENTRY CRITERIA:
  - EMA stack bullish (H16: price > EMA20 > EMA50 > EMA200)
  - H35 influence convergence > 50
  - H22 whale accumulation confirmed
  - URIEL PRIME or STRONG signal
  - No RAZIEL ABORT
  - No active Gate 9 kill switch
SIZING: 15-20% total ring. Individual position max = 6-7%.
HOLD DURATION: 6-12 months minimum unless thesis changes.
PLTR LESSON: Valuation P/E screens do NOT override structural thesis for
  category-defining companies. PLTR = defense AI operating system.
  Price on structural moat, not trailing multiples.
FCX CURRENT: Entered April 2, $58-60. Stop $55.50. T1 $66. T2 $70-72.
  Earnings April 16. Section 232 copper tariff protection intact.
  Morgan Stanley target $70. Hold.

### RING 4 — Tactical/Event Plays (5-10% of NAV)
HUNTER MODULES: COLOSSUS (primary), H7 (earnings), H3 (options), H9 (IPO), H23 (8-K)
ANNUAL CONTRIBUTION TARGET: $8-12.8K
ENTRY CRITERIA:
  - Clear catalyst within 1-4 week window
  - COLOSSUS setup confirmed (BREAKOUT or VWAP_RECLAIM)
  - H15 ATR stop placement available (entry - 2×ATR)
  - RAZIEL score < 50
SIZING: 5-10% total ring. Individual position max = 2-3%.
EXIT RULES (IRONCLAD v2.1):
  - Stop: -5% from entry (hard)
  - Trim 1: +10% → sell 50% of position
  - Trim 2: +20% → sell 60% of remaining
  - Same-day re-entry after stop: BANNED (48hr minimum)
CURRENT: No active Ring 4 positions (OIH scalp stood down April 1).

### RING 5 — Lottery (Max 2% of NAV)
HUNTER MODULES: Binary event detection (April 6 Hormuz deadline, FOMC, etc.)
ANNUAL CONTRIBUTION: Uncapped but capped on downside
SIZING: 2% max. TOTAL Ring 5 exposure across all positions ≤ 2%.
CURRENT: No active Ring 5 positions. OIH scalp stood down.

---

## RETURN MODEL — PATH TO $408K

CURRENT NAV: ~$350K (estimated, 3 accounts)
TARGET: $408K (January high)
DEFICIT: ~$58K

REQUIRED RETURN: +16.6%

| Ring | Allocation | Current $ | Annual Target | Contribution |
|------|-----------|-----------|---------------|-------------|
| Ring 1 | 45% | $157,500 | 5.25% passive | $8,269 |
| Ring 2 | 12% | $42,000 | 15-25% thesis | $6,300-$10,500 |
| Ring 3 | 18% | $63,000 | 20-30% structural | $12,600-$18,900 |
| Ring 4 | 8% | $28,000 | 25-35% tactical | $7,000-$9,800 |
| Ring 5 | 2% | $7,000 | variable | $0-$3,500 |
| **TOTAL** | **85%** | | | **$34K-$51K** |

Remaining 15% cash ($52,500) → move $35K to SGOV = +$1,540/yr passive.
At full operation: $750-$1,500/month extractable biweekly income.

---

## CRITICAL PATH — WHAT HUNTER MUST DELIVER

For HUNTER to contribute to the return model:
1. Agents must respond (0/4 is the blocker — fixes in Part 4)
2. Signals must be PRIME quality, not noise (H35 convergence scoring)
3. RAZIEL must catch bad setups before entry (gate function)
4. MICHA must synthesize into actionable ranked list
5. Telegram brief must be readable and actionable

HUNTER is currently delivering: H-module data confirmed working.
HUNTER is currently NOT delivering: Agent synthesis (agents 0/4).
Therefore: No PRIME signals, no Telegram brief with trades.

---

## COMPLETE PRIORITIZED ACTION LIST

### P0 — BLOCKING (Fix before anything else)

1. FIX AGENTS 0/4
   Method: HTTP Request nodes with static JSON body
   User content field: ={{ $json.hunter_payload }} (n8n expression, NOT JS)
   Test each agent independently with Execute Step before connecting to pipeline
   Expected result: agents_responded = 4/4 in next Telegram brief

2. FIX KILL SWITCH TELEGRAM
   Current: raw JS template string in message
   Fix: replace with n8n {{ }} expressions in Telegram node Text field
   Test: manually trigger Gate 9 kill condition and verify message renders correctly

### P1 — HIGH PRIORITY (This week)

3. REPLACE H40 (GEX blocked)
   Use UW unusual options flow: /api/options/unusual-activity
   Already have UNUSUAL_WHALES_API_KEY in n8n variables
   UW trial ends ~April 9. Decision deadline: Does UW data improve Ring 4 win rate?

4. VERIFY H42 COMEX data
   Test metalcharts.org endpoint returns live data
   If unreliable, replace with CME Group daily warehouse stocks

5. ADD H43 — CFTC COT Report
   Free weekly data. Strongest silver thesis signal available.
   Endpoint: cftc.gov/dea/futures/deacmesf.htm

6. ADD H44 — PSLV NAV Premium
   Daily scrape from Sprott. Free.
   Critical Ring 2 health check.

### P2 — MEDIUM PRIORITY (This month)

7. ADD SARIEL as 5th agent
   Perplexity Sonar Pro. API key in n8n variables as SARIEL_API_KEY
   Real-time web citations. Fills intelligence gap.

8. ADD Shanghai Silver Premium to H29 output
   SGE price - COMEX price = physical demand indicator
   #1 leading indicator for silver thesis confirmation

9. WEIGHTED H35 CONVERGENCE SCORE
   Replace binary with 0-100 weighted score
   Score > 70 = PRIME signal regardless of technical setup

10. RVOL calculation in H20
    volume / 20-day_avg_volume = RVOL
    RVOL > 2.0 on setup = institutional confirmation

11. MICHA cross-agent consensus multiplier
    3/4 agents agreeing = confidence boost
    RAZIEL score > 70 = automatic CAUTION

### P3 — ENHANCEMENT (Next 30 days)

12. Weekly timeframe scan (H11b, H12b)
    Daily MACD + weekly MACD alignment = higher conviction

13. IRONCLAD rules in RAZIEL system prompt
    Stop distances, re-entry ban, kill switch conditions
    RAZIEL should flag IRONCLAD violations explicitly

14. Expose Ollama on The_Collective
    llama3.3:70b is downloaded and ready
    Needs Cloudflare tunnel or ngrok to reach n8n cloud
    Zero-cost 6th agent pre-filter pass

15. H22 watchlist verification
    Confirm Druckenmiller, Burry, Ackman, Dalio, Buffett, Sprott
    are explicitly in the EDGAR filer filter, not just generic search

---

## WHAT SUCCESS LOOKS LIKE

HUNTER v3.3 is "production ready" when:
1. Telegram brief shows Agents: 4/4 consistently
2. At least 1 PRIME signal per week on average
3. PRIME signals have R:R > 2:1 and clear entry/stop/target
4. RAZIEL correctly flags at least one bad setup per week
5. H35 convergence score identifies 1-2 influence signals per month
6. Gate 9 kill switch fires correctly when DXY+yields both adverse
7. Kill Switch Telegram message renders as readable text

THEN: Step up to CIL v6.1 integration for full 5-agent collective consensus on PRIME signals.

---

## COLLECTIVE INTEGRATION MAP

| System | Role | Connection |
|--------|------|-----------|
| HUNTER v3.3 | Market intelligence scanner | Generates raw signals |
| CIL v6.1 | Consensus validation | Receives top 3 from HUNTER, runs 5-agent collective |
| GABRIEL v2.0 | Overnight watch | Monitors same Telegram, escalates to E*TRADE API |
| SENTINEL | Portfolio monitor | Validates positions against IRONCLAD stops every 5 min |
| METATRON v10.8 | Protocol layer | All 30 gates, kill switch, Principal authority |
| IRONCLAD v2.1 | Risk rules | Stop sizing, trim triggers, re-entry bans |
| Telegram | Delivery | hunter_a2e_bot → chat ID 8203545338 |
| GitHub AIORA | Archive | Every scan → Barefootservants2/AIORA/reports/ |

---

## APPENDIX: CREDENTIAL REFERENCE

| Credential | n8n ID | Used By |
|-----------|--------|---------|
| Alpha Vantage API | ImjP6dfYHgTNWWfo | H2a, H4 |
| NewsAPI | sj27C965hpE5Y717 | H2b, H28 |
| Finnhub API | ZsRtqMO5tofoPRmJ | H5,H7,H9,H19,H25,H26,H39a-c |
| Twelve Data API | 3Jnfoq3LN9wTGMpu | H10-H16, H18, H20 |
| GitHub_A2E_Token | jdjVIw73qgFd0a4Z | GitHub Archive Write |
| Telegram account | 1cUBFkMQENfAXP8x | Kill Switch Alert, Send Telegram Brief |
| URIEL API Key | HeSyKKuHzaqLk2tp | URIEL agent (OpenAI) |
| COLOSSUS API Key | PahnYDcKUA07lJZv | COLOSSUS agent (xAI grok-3) |
| HANIEL API Key | AitODdRhySgSD8nm | HANIEL agent (Gemini) |
| RAZIEL API Key | CnNJfQmlNmwePa7P | RAZIEL agent (DeepSeek) |

n8n Environment Variables:
UNUSUAL_WHALES_API_KEY | CONGRESS_API_KEY | FRED_API_KEY | FEC_API_KEY
METALS_DEV_KEY | CIL_WEBHOOK_URL | Uriel_API_Key | Grok4_API_Key_20250809

---
END OF REQUIREMENTS — ALL 5 PARTS COMPLETE
HUNTER v3.3 | METATRON v10.8 | April 2, 2026

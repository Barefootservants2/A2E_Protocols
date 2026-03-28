# HUNTER GAP1 — H4/H17/H22 Mandatory Check Spec AMENDMENT v1.1
**Classification:** PROTOCOL ENHANCEMENT  
**Date:** March 26, 2026  
**Author:** MICHA  
**Amends:** GAP1_H4_H17_H22_MANDATORY_CHECK_SPEC.md (v1.0, 2026-03-19)  
**Trigger:** Renaissance Technologies Pattern Finder prompt analysis — March 26, 2026  
**Status:** IMPLEMENTATION READY

---

## WHY THIS AMENDMENT EXISTS

During analysis of the @wizofai Renaissance Technologies prompt template (Template 9 of FORGE Financial Domain Templates v1.0), four intelligence categories were identified that are not present in the current H4/H17/H22 spec:

1. **Seasonal patterns** — best/worst months historically per ticker
2. **Day-of-week performance patterns** — statistical edge by trading day
3. **Short interest + squeeze potential scoring** — not just short interest level but squeeze setup rating
4. **Price behavior around earnings** — pre-run and post-gap pattern identification

These are not luxury additions. They are directly applicable to the current defense thesis (PLTR, RTX, LMT, LHX) and any Ring 3/4 tactical entry. Running H4/H17/H22 without these is leaving statistical edge data on the table every scan.

---

## NEW MODULES ADDED: H23, H24, H25, H26

### H23 — Seasonal Pattern Monitor
**What it does:** For any ticker under analysis, pulls 5-year monthly return history and identifies statistically significant seasonal patterns.  
**Data source:** Yahoo Finance v8 historical data (free, no auth)  
**Trigger:** Per-position scan, not every MARKET WATCH run — fire on new entries and weekly reviews  
**Output:** Best 3 months, worst 3 months, current month rating, seasonal bias score (-5 to +5)

**Key patterns to flag:**
- "Santa Claus rally" effect (late Dec)
- January Effect (small caps)
- Sell in May (May-Oct underperformance)
- Defense sector seasonal (budget cycle — Sep/Oct strong)
- Metals seasonal (Jan-Feb historically strong for silver)

**n8n Implementation:**
```javascript
// H23 Seasonal Pattern Node — Code node
const ticker = $input.first().json.ticker;
const resp = await this.helpers.httpRequest({
  method: 'GET',
  url: `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1mo&range=5y`,
  headers: { 'User-Agent': 'Mozilla/5.0' },
  json: true
});

const timestamps = resp.chart.result[0].timestamp;
const closes = resp.chart.result[0].indicators.quote[0].close;

// Group returns by month
const monthlyReturns = {};
for (let i = 1; i < closes.length; i++) {
  const month = new Date(timestamps[i] * 1000).getMonth(); // 0-11
  const ret = (closes[i] - closes[i-1]) / closes[i-1] * 100;
  if (!monthlyReturns[month]) monthlyReturns[month] = [];
  monthlyReturns[month].push(ret);
}

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const monthAvgs = Object.entries(monthlyReturns).map(([m, rets]) => ({
  month: monthNames[m],
  avgReturn: rets.reduce((a,b) => a+b, 0) / rets.length,
  sampleSize: rets.length
})).sort((a,b) => b.avgReturn - a.avgReturn);

const currentMonth = new Date().getMonth();
const currentMonthData = monthlyReturns[currentMonth];
const currentMonthAvg = currentMonthData ? 
  currentMonthData.reduce((a,b) => a+b, 0) / currentMonthData.length : 0;

return [{ json: {
  module: 'H23_SEASONAL',
  ticker,
  best_months: monthAvgs.slice(0,3),
  worst_months: monthAvgs.slice(-3).reverse(),
  current_month_avg: Math.round(currentMonthAvg * 100) / 100,
  seasonal_bias: currentMonthAvg > 1 ? 'FAVORABLE' : currentMonthAvg < -1 ? 'UNFAVORABLE' : 'NEUTRAL'
}}];
```

---

### H24 — Day-of-Week Pattern Monitor
**What it does:** Identifies statistically significant day-of-week performance patterns for the ticker. "Monday Effect," "Friday Effect," pre-long-weekend behavior.  
**Data source:** Yahoo Finance v8 daily historical (free)  
**Trigger:** Per-position scan, weekly  
**Output:** Best trading day, worst trading day, current day-of-week rating

**Why this matters for us:** If PLTR historically runs Tuesday/Wednesday before earnings weeks and fades Thursday/Friday — that timing changes the entry point on the $20K Tranche 2 deployment.

**n8n Implementation:**
```javascript
// H24 Day-of-Week Pattern Node — Code node
const ticker = $input.first().json.ticker;
const resp = await this.helpers.httpRequest({
  method: 'GET',
  url: `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=2y`,
  headers: { 'User-Agent': 'Mozilla/5.0' },
  json: true
});

const timestamps = resp.chart.result[0].timestamp;
const closes = resp.chart.result[0].indicators.quote[0].close;
const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const dayReturns = {1:[], 2:[], 3:[], 4:[], 5:[]}; // Mon-Fri only

for (let i = 1; i < closes.length; i++) {
  const day = new Date(timestamps[i] * 1000).getDay();
  if (day >= 1 && day <= 5) {
    const ret = (closes[i] - closes[i-1]) / closes[i-1] * 100;
    dayReturns[day].push(ret);
  }
}

const dayAvgs = Object.entries(dayReturns).map(([d, rets]) => ({
  day: dayNames[d],
  avgReturn: rets.length > 0 ? Math.round(rets.reduce((a,b)=>a+b,0)/rets.length*100)/100 : 0,
  sampleSize: rets.length
})).sort((a,b) => b.avgReturn - a.avgReturn);

const todayDay = new Date().getDay();
const todayAvg = dayReturns[todayDay] ? 
  dayReturns[todayDay].reduce((a,b)=>a+b,0)/dayReturns[todayDay].length : 0;

return [{ json: {
  module: 'H24_DOW_PATTERN',
  ticker,
  best_day: dayAvgs[0],
  worst_day: dayAvgs[dayAvgs.length-1],
  all_days: dayAvgs,
  today_bias: todayAvg > 0.1 ? 'FAVORABLE' : todayAvg < -0.1 ? 'UNFAVORABLE' : 'NEUTRAL',
  today_avg_return: Math.round(todayAvg * 100) / 100
}}];
```

---

### H25 — Short Interest + Squeeze Potential Scorer
**What it does:** Pulls current short interest data and calculates squeeze potential score. Not just "short interest is high" but whether conditions for a squeeze are present.  
**Data source:** Finviz (scraped) + Yahoo Finance float data + existing Finnhub H30  
**Trigger:** Every MARKET WATCH scan for Ring 3/4 positions  
**Output:** Short interest %, days-to-cover, float short %, squeeze score (1-10)

**Squeeze Score Formula:**
```
Base score components:
- Float short > 20%: +3 points
- Days to cover > 5: +2 points  
- Recent short interest INCREASING: +2 points
- High borrow fee (hard to borrow): +2 points
- High call options volume vs put: +1 point

Score 8-10: HIGH SQUEEZE POTENTIAL — flag for SENTINEL
Score 5-7: MODERATE — monitor weekly
Score 1-4: LOW — no squeeze catalyst present
```

**IRONCLAD Link:** A squeeze score of 8+ on any short position we hold against triggers a Gate 7 cross-sector confirm before adding to position. A squeeze score of 8+ on a long position we hold = consider trim risk (short squeeze may attract institutional attention that fades post-squeeze).

**n8n Implementation:**
```javascript
// H25 Short Interest + Squeeze Score — Code node
const ticker = $input.first().json.ticker;

// Yahoo Finance for float and short data
const resp = await this.helpers.httpRequest({
  method: 'GET',
  url: `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics`,
  headers: { 'User-Agent': 'Mozilla/5.0' },
  json: true
});

const stats = resp.quoteSummary.result[0].defaultKeyStatistics;
const shortPct = stats.shortPercentOfFloat?.raw || 0;
const daysToCover = stats.shortRatio?.raw || 0;
const sharesShort = stats.sharesShort?.raw || 0;
const sharesShortPrior = stats.sharesShortPriorMonth?.raw || 0;
const shortChangePct = sharesShortPrior > 0 ? 
  (sharesShort - sharesShortPrior) / sharesShortPrior * 100 : 0;

// Squeeze score calculation
let score = 0;
if (shortPct > 0.20) score += 3;
else if (shortPct > 0.10) score += 1;
if (daysToCover > 5) score += 2;
else if (daysToCover > 3) score += 1;
if (shortChangePct > 5) score += 2; // Short interest rising
else if (shortChangePct < -10) score -= 1; // Shorts covering

const squeezeRating = score >= 8 ? 'HIGH' : score >= 5 ? 'MODERATE' : 'LOW';

return [{ json: {
  module: 'H25_SQUEEZE',
  ticker,
  float_short_pct: Math.round(shortPct * 1000) / 10,
  days_to_cover: daysToCover,
  short_change_pct: Math.round(shortChangePct * 10) / 10,
  squeeze_score: score,
  squeeze_rating: squeezeRating,
  flag: squeezeRating === 'HIGH' ? 'ALERT — SQUEEZE CONDITIONS PRESENT' : null
}}];
```

---

### H26 — Earnings Price Behavior Monitor
**What it does:** For any ticker approaching earnings, analyzes pre-run and post-gap patterns from the last 8 earnings events. Identifies whether the stock tends to: run before earnings and sell off (buy-the-rumor-sell-the-news), gap up and hold, gap down and recover, or stay flat.  
**Data source:** Yahoo Finance historical + earnings calendar  
**Trigger:** Any position within 21 days of earnings date — fires automatically  
**Output:** Pre-earnings drift pattern, post-gap behavior, recommended action (buy before / sell before / hold through / avoid)  
**METATRON Gate:** This feeds Gate 9.5 (Earnings Check) directly

**Pattern Taxonomy:**
```
PATTERN A — Run and Dump:
  Pre-earnings: +3-8% in 10 days before
  Post-earnings: -5% or more day-of
  Action: SELL 50% before earnings, re-enter post-gap if thesis intact

PATTERN B — Gap and Hold:
  Pre-earnings: flat or slight run (+0-2%)
  Post-earnings: +5%+ and holds 3+ days
  Action: HOLD through earnings, add on dip if gap holds

PATTERN C — Gap Down and Recover:
  Pre-earnings: slight sell-off (-1-3%)
  Post-earnings: -3-8% but recovers within 5 days
  Action: HOLD, buy the gap-down if recovery pattern holds

PATTERN D — Flat and Fade:
  Pre-earnings: no significant move
  Post-earnings: -1-3% and drifts lower
  Action: SELL before earnings, wait for new catalyst
```

**PLTR Immediate Application:** Earnings May 11, 2026. H26 should run NOW on PLTR to determine whether to hold the $15K position through earnings or trim before.

---

## UPDATED MARKET WATCH FLOW

```
[MARKET WATCH TRIGGER]
        ↓
[TICKER LIST BUILD]
        ↓
[PARALLEL EXECUTION — All 6 modules simultaneous]
├── H4: 13F Institutional Filings
├── H17: Congressional Trading  
├── H22: SEC Enforcement
├── H23: Seasonal Pattern (weekly cadence)
├── H25: Short Interest + Squeeze Score
└── H26: Earnings Behavior (fires only if earnings <21 days)
        ↓
[H24: Day-of-Week runs once daily at session open]
        ↓
[MERGE — Wait for all modules]
        ↓
[GATE CHECK — Any flags?]
    YES → Prepend FULL INTELLIGENCE BLOCK to report
    NO  → Continue to standard analysis
```

---

## UPDATED OUTPUT BLOCK

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILING + PATTERN INTELLIGENCE — H4/H17/H22/H23/H24/H25/H26
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
H4  INSTITUTIONAL:  [SIGNAL / CLEAR]
H17 CONGRESSIONAL:  [SIGNAL / CLEAR]
H22 REGULATORY:     [RISK / CLEAR]
H23 SEASONAL:       [FAVORABLE / NEUTRAL / UNFAVORABLE] | [Month avg: X%]
H24 DAY-OF-WEEK:    [FAVORABLE / NEUTRAL / UNFAVORABLE] | [Today avg: X%]
H25 SQUEEZE:        [HIGH / MODERATE / LOW] | Score: X/10 | Float short: X%
H26 EARNINGS:       [Pattern A/B/C/D] | Earnings in X days | Action: [BUY/SELL/HOLD]

MANDATORY CHECK: COMPLETE ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## IMMEDIATE APPLICATIONS

| Module | Apply To Now | Priority |
|--------|-------------|----------|
| H25 Squeeze | RTX, LMT, PLTR — defense thesis entries | Run today before any buy |
| H26 Earnings | PLTR (May 11 earnings) | Run before Tranche 2 deployment |
| H23 Seasonal | Defense sector (Sep/Oct budget cycle thesis) | Run this week |
| H24 Day-of-Week | PLTR limit order timing | Run today — optimal entry day |

---

## IMPLEMENTATION CHECKLIST

From v1.0 (H4/H17/H22) — not yet built:
- [ ] H4 HTTP node in n8n
- [ ] H17 HTTP node
- [ ] H22 HTTP node
- [ ] Merge + gate logic code node
- [ ] QUIVER_API_KEY credential

New from v1.1 (H23/H24/H25/H26):
- [ ] H23 Code node — seasonal pattern
- [ ] H24 Code node — day-of-week (daily at open)
- [ ] H25 Code node — short interest + squeeze score
- [ ] H26 Code node — earnings behavior (conditional on earnings <21 days)
- [ ] Update merge node to include H23/H25/H26 outputs
- [ ] Add H24 as separate daily trigger separate from main MARKET WATCH
- [ ] Update output formatter to include new intelligence block rows
- [ ] Test H25 on PLTR immediately (squeeze score before Tranche 2)
- [ ] Test H26 on PLTR immediately (earnings pattern before May 11)

**Estimated additional build time:** 3-4 hours on top of v1.0 base

---

## CHANGE LOG

| Version | Date | Change |
|---------|------|--------|
| v1.0 | 2026-03-19 | Initial spec — H4/H17/H22 |
| v1.1 | 2026-03-26 | Added H23 (Seasonal), H24 (Day-of-Week), H25 (Squeeze), H26 (Earnings Behavior). Source: Renaissance Technologies pattern finder analysis. |

---

*HUNTER H4/H17/H22 Amendment v1.1*  
*Ashes2Echoes LLC | Uriel Covenant AI Collective*  
*Filed: HUNTER/MODULES/GAP1_H4_H17_H22_MANDATORY_CHECK_SPEC_v1.1.md*


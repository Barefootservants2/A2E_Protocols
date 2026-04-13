# SIGNAL SCORING MATRIX v1.0
## Dimension Rubric for Trade Card Generation

---

## OVERVIEW

Each candidate symbol is scored across 6 dimensions on a 0-10 scale.
Weighted composite produces a confidence percentage (0-100%).
Minimum threshold: 70% to generate a Trade Card.
Maximum cards per day: 3.

| Dimension | Weight | Source | Update Freq |
|-----------|--------|--------|-------------|
| Flow | 30% | H44 Unusual Whales | Real-time |
| Positioning | 20% | H36 CFTC COT | Weekly (Fri) |
| Supply | 15% | H41 EIA / H40 COMEX | Weekly/Daily |
| Thesis | 15% | SENTINEL chain status | Real-time |
| Macro | 10% | H42 FRED API | Daily |
| Sentiment | 10% | H47 Put/Call + VIX | Daily |

---

## 1. FLOW SCORE (30% weight)

Source: Unusual Whales options flow data.

| Score | Condition |
|-------|-----------|
| 9-10 | $2M+ premium sweep, volume > 5x OI, < 7 DTE |
| 7-8 | $500K+ premium, sweep detected, < 30 DTE |
| 5-6 | Sector-level flow elevated, no direct ticker activity |
| 3-4 | No significant flow detected |
| 0-2 | Heavy put flow / bearish sweeps on the ticker |

**Why 30% weight:** Flow is the highest-signal indicator of informed money.
When someone spends $2M on short-dated calls, they know something.
This is the edge retail doesn't have without tools like UW.

---

## 2. POSITIONING SCORE (20% weight)

Source: CFTC Commitments of Traders report.

| Score | Condition |
|-------|-----------|
| 9-10 | Specs extreme short (net < -15% of OI) + commercial accumulating |
| 7-8 | Specs net short + favorable positioning for longs |
| 5-6 | Neutral positioning, no crowding either direction |
| 3-4 | Specs net long, momentum positioning |
| 0-2 | Specs extreme long (net > +30% of OI) = crowded, likely to unwind |

**Contrarian logic:** Extreme spec long = bearish (everyone already in).
Extreme spec short = bullish (squeeze potential on any catalyst).

---

## 3. SUPPLY SCORE (15% weight)

Source: EIA Weekly Petroleum (energy) or COMEX Inventory (metals).

### Energy (EIA):
| Score | Condition |
|-------|-----------|
| 9-10 | 3M+ barrel draw + Cushing tight + import collapse |
| 7-8 | Significant draw + high refinery utilization |
| 5-6 | Neutral inventory, no strong signal |
| 3-4 | Moderate build, demand softening |
| 0-2 | Large build + SPR release + low utilization |

### Metals (COMEX):
| Score | Condition |
|-------|-----------|
| 9-10 | Registered critically low + daily drain + high eligible ratio |
| 7-8 | Registered below warning + active drawdown |
| 5-6 | Moderate levels, deficit thesis intact but no urgency |
| 3-4 | Registered comfortable, inflows detected |
| 0-2 | Margin hike announced + registered flooding |

---

## 4. THESIS SCORE (15% weight)

Source: SENTINEL thesis chain status.

| Score | Condition |
|-------|-----------|
| 9-10 | All thesis layers GREEN, fresh catalyst confirmed |
| 7-8 | Thesis GREEN, no new catalyst but structural intact |
| 5-6 | Mixed — some layers yellow, thesis needs monitoring |
| 3-4 | Thesis degrading — one or more layers RED |
| 0-2 | Thesis broken — exit conditions met |

---

## 5. MACRO SCORE (10% weight)

Source: FRED API — DXY, yields, real yields, inflation expectations.

| Score | Condition |
|-------|-----------|
| 9-10 | DXY falling strong + yields falling + negative real yields |
| 7-8 | DXY declining + rate cuts being priced in |
| 5-6 | Neutral macro, no strong tailwind or headwind |
| 3-4 | DXY rising or yields rising (pick one) |
| 0-2 | DXY AND yields both rising (Kill Switch territory) |

**Kill Switch integration:** Score 0-2 here triggers Kill Switch check.
If DXY 5d change > +1.0% AND 10Y yield 5d change > +0.10%,
Kill Switch fires = auto 50% metals reduction + 48hr embargo.

---

## 6. SENTIMENT SCORE (10% weight)

Source: CBOE Put/Call ratio + VIX.

| Score | Condition |
|-------|-----------|
| 9-10 | P/C > 1.20 + VIX > 35 = extreme fear, contrarian bullish |
| 7-8 | P/C > 1.00 or VIX > 30 = elevated fear |
| 5-6 | P/C 0.85-1.00, VIX 20-30 = neutral |
| 3-4 | P/C 0.70-0.85, VIX 15-20 = mild complacency |
| 0-2 | P/C < 0.70, VIX < 15 = extreme complacency, contrarian bearish |

---

## CONFIDENCE CALCULATION

```
confidence = (
  flow_score * 0.30 +
  positioning_score * 0.20 +
  supply_score * 0.15 +
  thesis_score * 0.15 +
  macro_score * 0.10 +
  sentiment_score * 0.10
) * 10

Example: UCO on a Hormuz escalation day
  Flow:        9 * 0.30 = 2.70  ($2M call sweeps Friday)
  Positioning: 8 * 0.20 = 1.60  (specs net short crude)
  Supply:      9 * 0.15 = 1.35  (3.1M barrel draw, imports collapsing)
  Thesis:      7 * 0.15 = 1.05  (energy/Hormuz chain GREEN)
  Macro:       6 * 0.10 = 0.60  (DXY flat, yields down slightly)
  Sentiment:   6 * 0.10 = 0.60  (P/C 0.82, elevated but not extreme)
  ─────────────────────────
  Composite: 7.90 → Confidence: 79%  ✅ ABOVE 70% THRESHOLD
```

---

## WEIGHT TUNING

After 20+ trading days of signal history:

1. Pull all signals from `signal_history` table
2. For each dimension, correlate score with actual outcome
3. Increase weight for dimensions that predicted correctly
4. Decrease weight for dimensions that added noise
5. Document change in this file with date and rationale

Target state: weights reflect empirical predictive power,
not theoretical importance.

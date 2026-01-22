# AIORA v2.0 — INTEGRATION UPDATE

**Version:** 2.0 | **Parent Protocol:** METATRON v8.0  
**Owner:** Ashes2Echoes, LLC | **Principal:** William Earl Lemon — ABSOLUTE  
**Created:** January 21, 2026

---

## OVERVIEW

AIORA (AI-Optimized Risk Assessment) v2.0 integrates the new METATRON v8.0 gates and HUNTER v2.0 modules into the trading decision framework.

---

## PRE-TRADE GATE CHECKLIST

Before ANY trade execution, the following gates must pass:

### Required Gate Passes
| Gate | Requirement | Fail Action |
|------|-------------|-------------|
| 8.5 | Options Flow | No contradictory institutional flow | NO TRADE |
| 11.5 | Crowding | Score < 0.8 | NO TRADE or reduce size |
| 12 | Regime | Trade aligned with current regime | NO TRADE |
| 13 | Execution | Liquidity grade ≥ C | NO TRADE or reduce size |

### Gate Pass Matrix
```
              LONG    SHORT
Gate 8.5:    Bullish  Bearish or Neutral
             flow OK  flow OK
             
Gate 11.5:   CS<0.8   CS<0.6 (tighter for shorts)

Gate 12:     RISK-ON: OK    RISK-OFF: OK
             NEUTRAL: OK    NEUTRAL: NIBBLE only
             RISK-OFF: NO   RISK-ON: NO
             
Gate 13:     Grade A-C      Grade A-B only
```

---

## POSITION SIZING FRAMEWORK

### Base Sizing (Unchanged)
| Tier | Allocation | Use Case |
|------|------------|----------|
| NIBBLE | 1-2% | Testing, low conviction, poor liquidity |
| STANDARD | 3-5% | Normal conviction, good setup |
| CONVICTION | 6-8% | High conviction, multiple confirmations |

### Size Modifiers (NEW)

**Crowding Adjustment:**
| Crowding Score | Max Size Allowed |
|----------------|------------------|
| 0-0.3 | CONVICTION |
| 0.3-0.5 | STANDARD |
| 0.5-0.7 | NIBBLE |
| 0.7-0.8 | NIBBLE × 0.5 |
| > 0.8 | NO ENTRY |

**Liquidity Adjustment:**
| Grade | Max Size |
|-------|----------|
| A | CONVICTION |
| B | STANDARD |
| C | NIBBLE |
| D | NIBBLE × 0.5 |
| F | NO ENTRY |

**Regime Adjustment:**
| Regime | Max Size | Cash Target |
|--------|----------|-------------|
| EUPHORIA | STANDARD | 30% |
| RISK-ON | CONVICTION | 20% |
| NEUTRAL | STANDARD | 30% |
| RISK-OFF | NIBBLE | 50% |
| CAPITULATION | NO NEW | 70%+ |

**Final Size = MIN(Base_Size, Crowding_Max, Liquidity_Max, Regime_Max)**

---

## STOP-LOSS MATRIX

### Base Stops (Unchanged)
| Market Cap | Initial Stop | Max Stop |
|------------|--------------|----------|
| Large Cap (>$10B) | -5% | -8% |
| Mid Cap ($2-10B) | -6% | -10% |
| Small Cap ($300M-2B) | -8% | -12% |
| Micro Cap (<$300M) | -10% | -15% |
| Crypto | -10% | -15% |

### Stop Adjustments by Regime (NEW)
| Regime | Stop Adjustment |
|--------|-----------------|
| RISK-ON | Base stops |
| NEUTRAL | Base stops |
| RISK-OFF | Tighten by 2% OR no stops (accept vol) |
| CAPITULATION | N/A (no new positions) |

### Volatility-Adjusted Stops (NEW)
When ATR(14) > 2× normal:
- Widen stops by ATR factor OR
- Reduce position size proportionally

Formula: `Adjusted_Stop = Base_Stop × (Current_ATR / Normal_ATR)`

---

## VIX REGIME FRAMEWORK

### Regime Detection
| VIX | Trend | Breadth | Regime |
|-----|-------|---------|--------|
| <12 | Down | >80% | EUPHORIA |
| 12-15 | Stable/Down | >60% | RISK-ON |
| 15-25 | Any | 40-60% | NEUTRAL |
| 25-35 | Up | <40% | RISK-OFF |
| >35 | Up | <20% | CAPITULATION |

### Regime-Specific Playbooks

**EUPHORIA (VIX <12):**
- Maximum position: STANDARD
- Trim winners to NIBBLE
- Raise all stops to breakeven+
- Build cash position
- Contrarian shorts on watchlist
- DO NOT chase momentum

**RISK-ON (VIX 12-15):**
- Full sizing allowed
- Growth/momentum favored
- Normal stop discipline
- Aggressive on quality setups

**NEUTRAL (VIX 15-25):**
- STANDARD max sizing
- Balanced approach
- Sector rotation focus
- Tighter stock selection

**RISK-OFF (VIX 25-35):**
- NIBBLE only
- Defensive sectors only (XLU, XLP, XLV)
- Cash position > 50%
- No new speculative positions
- Hedge existing longs

**CAPITULATION (VIX >35):**
- NO NEW POSITIONS
- Hedge all existing exposure
- Build shopping list for recovery
- Cash position > 70%
- Watch for reversal signals

---

## TRIGGER COMMANDS

### Updated Trigger Set

| Trigger | Action | Gates |
|---------|--------|-------|
| `MARKET WATCH` | Full protocol | All 18 |
| `ORACLE` | Context Package only | Research only |
| `SCAN` | HUNTER modules only | 11 only |
| `ORACLE INJECT:` | Ingest external data then full | All 18 |
| `REG SCAN` | Regulatory focus | 8.5, H2 |
| `FLOW CHECK` | Options + short interest | 8.5, H7, H8 |
| `CROWD CHECK` | Crowding analysis | 11.5, H10 |
| `REGIME CHECK` | Current regime status | 12 only |
| `LIQUIDITY CHECK` | Execution quality | 13 only |
| `FULL SCAN` | All HUNTER modules | H1-H10 |

### Trigger Combinations
```
MARKET WATCH + [TICKER]     → Full analysis on specific ticker
FLOW CHECK + [TICKER]       → Options flow for specific ticker
CROWD CHECK + [SECTOR]      → Crowding for sector ETF holdings
REGIME CHECK                → Current market regime only
```

---

## TRADE DECISION FLOWCHART

```
                    ┌─────────────────┐
                    │  Trade Idea     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Gate 0.5:      │
                    │  Premise Check  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
        ┌─────▼─────┐                 ┌─────▼─────┐
        │  PREMISE  │                 │  PREMISE  │
        │   VALID   │                 │  INVALID  │
        └─────┬─────┘                 └─────┬─────┘
              │                             │
              │                       ┌─────▼─────┐
              │                       │   STOP    │
              │                       │ Research  │
              │                       │  correct  │
              │                       │  premise  │
              │                       └───────────┘
              │
        ┌─────▼─────┐
        │  HUNTER   │
        │   Scan    │
        │ (H1-H10)  │
        └─────┬─────┘
              │
        ┌─────▼─────┐
        │ Gate 12:  │
        │  Regime   │
        │ Aligned?  │
        └─────┬─────┘
              │
       ┌──────┴──────┐
       │             │
  ┌────▼────┐  ┌────▼────┐
  │   YES   │  │   NO    │──────► STOP
  └────┬────┘  └─────────┘
       │
  ┌────▼────┐
  │Gate 8.5:│
  │ Options │
  │  Flow   │
  └────┬────┘
       │
    ┌──┴──┐
    │     │
┌───▼───┐ │
│Bullish│ │
│ Flow  │ │
└───┬───┘ │
    │     │
    │  ┌──▼──┐
    │  │Bear/│
    │  │Neut │──────► CAUTION (reduce size)
    │  └─────┘
    │
┌───▼────┐
│Gate11.5│
│Crowding│
│ <0.8?  │
└───┬────┘
    │
 ┌──┴──┐
 │     │
┌▼─┐ ┌─▼┐
│Y │ │N │──────► STOP or reduce to NIBBLE×0.5
└┬─┘ └──┘
 │
┌▼───────┐
│Gate 13:│
│Liquidity│
│ ≥ C?   │
└───┬────┘
    │
 ┌──┴──┐
 │     │
┌▼─┐ ┌─▼┐
│Y │ │N │──────► STOP or reduce size
└┬─┘ └──┘
 │
┌▼────────┐
│Calculate│
│Final    │
│ Size    │
└────┬────┘
     │
┌────▼────┐
│ EXECUTE │
│  TRADE  │
└─────────┘
```

---

## PORTFOLIO-LEVEL CONTROLS

### Concentration Limits
| Metric | Limit |
|--------|-------|
| Single position max | 8% (CONVICTION) |
| Single sector max | 25% |
| Correlated positions (r > 0.7) | 15% combined |
| Speculative positions | 20% total |

### Drawdown Controls
| Drawdown | Action |
|----------|--------|
| -5% portfolio | Review all positions |
| -7% portfolio | Reduce to NIBBLE max |
| -10% portfolio | KILLSWITCH (halt all) |

### Cash Position Targets
| Regime | Min Cash | Max Deployed |
|--------|----------|--------------|
| EUPHORIA | 30% | 70% |
| RISK-ON | 20% | 80% |
| NEUTRAL | 30% | 70% |
| RISK-OFF | 50% | 50% |
| CAPITULATION | 70% | 30% |

---

## MOMENTUM OVERRIDE (Unchanged)

ANY 3 OF 5 = PROCEED despite overbought:
1. Catalyst < 48 hours
2. Smart money within 7 days  
3. Volume > 5x average
4. Sector tailwind (ATH)
5. Price > 50% above 50MA

**Constraints:**
- Max size: NIBBLE
- Hard stop: -10%
- Daily review required
- Exit on first momentum failure

---

## KILLSWITCH PROTOCOL

### Activation Triggers
| Trigger | Source |
|---------|--------|
| `KILLSWITCH` | Manual |
| `HALT` | Manual |
| `STOP ALL` | Manual |
| Portfolio -10% | Automatic |
| VIX > 40 | Automatic |
| Market circuit breaker | Automatic |

### Killswitch Sequence
1. Cancel ALL pending orders immediately
2. Document all open positions with current prices
3. Calculate total exposure and P&L
4. Generate position report
5. Notify Principal
6. AWAIT EXPLICIT PRINCIPAL DIRECTIVE

### Recovery Protocol
1. Principal must explicitly authorize recovery
2. Full market condition assessment required
3. Position-by-position review
4. First 48h: NIBBLE only
5. Days 3-7: STANDARD max
6. Day 8+: Full protocol if conditions warrant

---

## REPORTING REQUIREMENTS

### Pre-Trade Report
```yaml
pre_trade:
  ticker: string
  direction: LONG | SHORT
  thesis_summary: string
  gates_passed:
    - gate: number
      status: PASS | CONDITIONAL
      notes: string
  hunter_signals: [relevant H1-H10 outputs]
  regime: string
  crowding_score: float
  liquidity_grade: string
  proposed_size: string
  entry_price: float
  stop_price: float
  target_price: float
  risk_reward: float
```

### Post-Trade Report
```yaml
post_trade:
  ticker: string
  entry_date: ISO-8601
  entry_price: float
  current_price: float
  unrealized_pnl: float
  days_held: int
  thesis_status: INTACT | DEGRADED | INVALID
  drift_indicators_triggered: [list]
  recommendation: HOLD | ADD | TRIM | EXIT
```

---

**END AIORA v2.0 INTEGRATION UPDATE**

🔱

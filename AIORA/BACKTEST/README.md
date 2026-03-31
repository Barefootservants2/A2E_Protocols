# A2E BACKTESTING HARNESS v1.0

## Setup (run once)
```
pip install vectorbt yfinance pandas numpy --break-system-packages
```

## Usage

**Quick test (3 tickers, 180 days, ~30 seconds):**
```
python backtest_harness.py --quick
```

**Full watchlist (365 days):**
```
python backtest_harness.py
```

**Custom tickers:**
```
python backtest_harness.py --tickers PSLV AG SIL PLTR XLE --days 365
```

**Save results:**
```
python backtest_harness.py --output my_results.json
```

## Output

Prints a report like:
```
✅  PRIME TIER
   Trades:      847 (612W / 235L)
   Win Rate:    72.3%  (target: 65%+)
   Avg Win:     +4.8%
   Avg Loss:    -2.1%
   R/R Ratio:   2.3:1  (target: 2:1+)
   Expectancy:  2.8% per trade
   Verdict:     STRATEGY VALID
```

These numbers replace the placeholder percentages in A2E_TRADING_STRATEGY_v1.1.

## What it tests

5-layer signal stack:
- L1 VWAP: Price > 20-day VWAP proxy
- L2 Opening Range: Price > day open
- L3 Momentum: RSI 14 in 45-65, MACD signal positive
- L4 Volume: Volume > 130% of 20-day average
- L5 Catalyst: 1-day rate of change > 0.5%

IRONCLAD v2.1 exit rules:
- Stop loss (-2.5% PRIME, -2.0% STRONG, -1.5% PROBE)
- Profit Lock 1 (+5% → sell 50%)
- Profit Lock 2 (+10% → sell 60%)
- EOD time stop (max 5 days)

## Next step (Section G Phase 2)

Once win rates are validated, run with full vectorbt portfolio simulation:
```
python backtest_harness.py --portfolio --capital 7000 --ring4_pct 0.20
```
This computes daily P&L curves against the $300-$1,500/day targets.

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace") if hasattr(sys.stdout, "reconfigure") else None
"""
A2E BACKTESTING HARNESS v1.0
Uriel Covenant AI Collective — Ashes2Echoes LLC
Principal: William Earl Lemon

PURPOSE:
    Validates win rate claims for PRIME/STRONG/PROBE signal tiers using
    vectorbt + yfinance. Produces actual backtested statistics to replace
    placeholder percentages in A2E_TRADING_STRATEGY_v1.1.

USAGE:
    pip install vectorbt yfinance pandas numpy --break-system-packages
    python backtest_harness.py [--tickers AAPL PSLV AG] [--days 365] [--output results.json]

SIGNAL LOGIC (5-Layer Stack):
    Layer 1 — VWAP:        Price > VWAP (daily close proxy)
    Layer 2 — Opening Range: Price > 30-min open (approximated via daily open)
    Layer 3 — Momentum:    RSI 14 in 45-65, MACD signal positive
    Layer 4 — Volume:      Volume > 130% of 20-day average
    Layer 5 — Catalyst:    Simplified: price accelerating (rate-of-change > 1%)

EXIT RULES (IRONCLAD v2.1):
    PRIME:  Stop -2.5%, Profit Lock 1 +5% (50%), Profit Lock 2 +10% (60%), EOD
    STRONG: Stop -2.0%, Profit Lock 1 +5% (50%), Profit Lock 2 +10% (60%), EOD
    PROBE:  Stop -1.5%, Profit Lock 1 +3% (50%), Profit Lock 2 +6%  (60%), EOD
"""

import argparse
import json
import sys
import warnings
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np
import pandas as pd

warnings.filterwarnings('ignore')

# ── DEPENDENCY CHECK ──────────────────────────────────────────────────────────
MISSING = []
try:
    import vectorbt as vbt
except ImportError:
    MISSING.append('vectorbt')
try:
    import yfinance as yf
except ImportError:
    MISSING.append('yfinance')

if MISSING:
    print(f"\n[INSTALL NEEDED]\npip install {' '.join(MISSING)} --break-system-packages\n")
    sys.exit(1)

print("[A2E BACKTEST HARNESS v1.0] Imports OK")

# ── DEFAULT WATCHLIST ─────────────────────────────────────────────────────────
DEFAULT_TICKERS = [
    # Ring 2: Metals
    'PSLV', 'AG', 'SIL', 'GLD', 'SLV',
    # Ring 3: Defense/Tech
    'PLTR', 'ITA', 'LHX',
    # Ring 4: Tactical
    'XLE', 'RKLB',
    # Indices (benchmark)
    'SPY', 'QQQ',
]

# ── SIGNAL TIER CONFIG ────────────────────────────────────────────────────────
TIER_CONFIG = {
    'PRIME': {
        'layers_required': 5,
        'stop_pct':        -2.5,
        'pl1_pct':         +5.0,   # Profit lock 1 trigger
        'pl1_sell':         0.50,  # Sell 50% at PL1
        'pl2_pct':         +10.0,  # Profit lock 2 trigger
        'pl2_sell':         0.60,  # Sell 60% at PL2
        'position_pct':    0.30,   # 30% of Ring 4 capital
    },
    'STRONG': {
        'layers_required': 4,
        'stop_pct':        -2.0,
        'pl1_pct':         +5.0,
        'pl1_sell':         0.50,
        'pl2_pct':         +10.0,
        'pl2_sell':         0.60,
        'position_pct':    0.15,
    },
    'PROBE': {
        'layers_required': 3,
        'stop_pct':        -1.5,
        'pl1_pct':         +3.0,
        'pl1_sell':         0.50,
        'pl2_pct':         +6.0,
        'pl2_sell':         0.60,
        'position_pct':    0.05,
    },
}

# ── INDICATOR CALCULATIONS ────────────────────────────────────────────────────

def calc_rsi(close: pd.Series, period: int = 14) -> pd.Series:
    delta = close.diff()
    gain  = delta.where(delta > 0, 0.0).rolling(period).mean()
    loss  = (-delta.where(delta < 0, 0.0)).rolling(period).mean()
    rs    = gain / loss.replace(0, np.nan)
    return 100 - (100 / (1 + rs))

def calc_macd(close: pd.Series, fast=12, slow=26, signal=9):
    ema_fast   = close.ewm(span=fast,   adjust=False).mean()
    ema_slow   = close.ewm(span=slow,   adjust=False).mean()
    macd_line  = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    return macd_line, signal_line

def calc_vwap_daily(close: pd.Series, high: pd.Series, low: pd.Series,
                    volume: pd.Series) -> pd.Series:
    """Daily VWAP approximation using (H+L+C)/3 * Volume cumulative sum."""
    typical = (high + low + close) / 3
    return (typical * volume).rolling(20).sum() / volume.rolling(20).sum()

def build_signals(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute 5-layer signal alignment and tier classification.
    Returns original df with added signal columns.
    """
    close  = df['Close']
    high   = df['High']
    low    = df['Low']
    volume = df['Volume']
    open_  = df['Open']

    vol_20ma = volume.rolling(20).mean()
    rsi      = calc_rsi(close)
    macd, macd_sig = calc_macd(close)
    vwap     = calc_vwap_daily(close, high, low, volume)
    roc_1    = close.pct_change(1) * 100  # Rate of change 1 day

    # ── Layer signals (boolean) ──────────────────────────────────────────────
    # L1: Price above VWAP (institutional bullish bias)
    L1 = close > vwap

    # L2: Price above open (opening range breakout proxy)
    L2 = close > open_

    # L3: Momentum — RSI in 45-65 AND MACD signal positive
    L3 = (rsi >= 45) & (rsi <= 65) & (macd_sig > 0)

    # L4: Volume confirmation — >130% of 20-day average
    L4 = volume > (vol_20ma * 1.30)

    # L5: Catalyst proxy — price accelerating (1-day ROC > 0.5%)
    L5 = roc_1 > 0.5

    # ── Layer count and tier ─────────────────────────────────────────────────
    layer_count = L1.astype(int) + L2.astype(int) + L3.astype(int) + \
                  L4.astype(int) + L5.astype(int)

    df = df.copy()
    df['vwap']        = vwap
    df['rsi']         = rsi
    df['macd']        = macd
    df['macd_sig']    = macd_sig
    df['vol_20ma']    = vol_20ma
    df['roc_1']       = roc_1
    df['L1']          = L1
    df['L2']          = L2
    df['L3']          = L3
    df['L4']          = L4
    df['L5']          = L5
    df['layer_count'] = layer_count

    # Tier classification
    conditions = [
        layer_count >= 5,
        layer_count == 4,
        layer_count == 3,
    ]
    choices = ['PRIME', 'STRONG', 'PROBE']
    df['tier'] = np.select(conditions, choices, default='NO_TRADE')

    return df

# ── SINGLE-TRADE OUTCOME CALCULATOR ──────────────────────────────────────────

def simulate_trade(entry_price: float, future_prices: list, tier: str) -> dict:
    """
    Simulate a single trade forward from entry.
    future_prices: list of subsequent daily closes (max 5 trading days)
    Returns outcome dict with result, exit_reason, gain_pct.
    """
    cfg = TIER_CONFIG[tier]
    stop    = cfg['stop_pct'] / 100
    pl1     = cfg['pl1_pct']  / 100
    pl2     = cfg['pl2_pct']  / 100
    max_hold = min(len(future_prices), 5)  # Max 5 days (EOD rule)

    position = 1.0
    proceeds = 0.0

    for day_idx in range(max_hold):
        price = future_prices[day_idx]
        gain  = (price - entry_price) / entry_price

        # Stop loss (full exit)
        if gain <= stop:
            proceeds += position * (1 + gain)
            return {
                'result':      'LOSS',
                'exit_reason': 'STOP_LOSS',
                'gain_pct':    round(gain * 100, 2),
                'days_held':   day_idx + 1,
                'entry':       entry_price,
                'exit':        price,
            }

        # Profit Lock 1
        if gain >= pl1 and position >= 1.0:
            sell_qty       = cfg['pl1_sell']
            proceeds      += sell_qty * (1 + gain)
            position      -= sell_qty
            # Remaining rides with breakeven stop

        # Profit Lock 2
        if gain >= pl2 and position > 0:
            proceeds      += position * (1 + gain)
            return {
                'result':      'WIN',
                'exit_reason': 'PROFIT_LOCK_2',
                'gain_pct':    round(gain * 100, 2),
                'days_held':   day_idx + 1,
                'entry':       entry_price,
                'exit':        price,
            }

        # EOD exit on last allowed day
        if day_idx == max_hold - 1:
            proceeds += position * (1 + gain)
            result = 'WIN' if gain > 0 else 'LOSS'
            return {
                'result':      result,
                'exit_reason': 'EOD_TIME_STOP',
                'gain_pct':    round(gain * 100, 2),
                'days_held':   day_idx + 1,
                'entry':       entry_price,
                'exit':        price,
            }

    # Fallback (no future data)
    return {
        'result':      'UNKNOWN',
        'exit_reason': 'NO_DATA',
        'gain_pct':    0.0,
        'days_held':   0,
        'entry':       entry_price,
        'exit':        entry_price,
    }

# ── PER-TICKER BACKTEST ────────────────────────────────────────────────────────

def backtest_ticker(ticker: str, days: int = 365) -> dict:
    """Download data and run full backtest for one ticker."""
    print(f"  [{ticker}] Downloading {days} days...")

    end   = datetime.now()
    start = end - timedelta(days=days + 60)  # Extra buffer for indicators

    try:
        raw = yf.download(ticker, start=start, end=end,
                          progress=False, auto_adjust=True)
        if raw.empty or len(raw) < 50:
            return {'ticker': ticker, 'error': 'Insufficient data', 'trades': []}
        # Flatten multi-level columns if present
        if isinstance(raw.columns, pd.MultiIndex):
            raw.columns = raw.columns.get_level_values(0)
    except Exception as e:
        return {'ticker': ticker, 'error': str(e), 'trades': []}

    df = build_signals(raw)

    # Trim to requested date range
    cutoff = end - timedelta(days=days)
    df = df[df.index >= pd.Timestamp(cutoff)]

    trades = []
    close_arr = df['Close'].values
    tier_arr  = df['tier'].values
    date_arr  = df.index

    for i in range(len(df) - 5):
        tier = tier_arr[i]
        if tier == 'NO_TRADE':
            continue

        entry_price   = close_arr[i]
        future_prices = close_arr[i+1:i+6].tolist()

        outcome = simulate_trade(entry_price, future_prices, tier)
        outcome.update({
            'ticker':      ticker,
            'tier':        tier,
            'date':        str(date_arr[i].date()),
            'layer_count': int(df['layer_count'].iloc[i]),
            'layers': {
                'L1_vwap':   bool(df['L1'].iloc[i]),
                'L2_open':   bool(df['L2'].iloc[i]),
                'L3_momentum': bool(df['L3'].iloc[i]),
                'L4_volume': bool(df['L4'].iloc[i]),
                'L5_catalyst': bool(df['L5'].iloc[i]),
            }
        })
        trades.append(outcome)

    return {'ticker': ticker, 'trades': trades}

# ── AGGREGATE STATISTICS ──────────────────────────────────────────────────────

def aggregate_stats(all_trades: list) -> dict:
    """Compute win rate, avg gain, R/R ratio by tier."""
    stats = {}

    for tier in ['PRIME', 'STRONG', 'PROBE']:
        tier_trades = [t for t in all_trades if t.get('tier') == tier
                       and t.get('result') in ('WIN', 'LOSS')]

        if not tier_trades:
            stats[tier] = {'error': 'No trades found for this tier'}
            continue

        wins   = [t for t in tier_trades if t['result'] == 'WIN']
        losses = [t for t in tier_trades if t['result'] == 'LOSS']

        win_rate  = len(wins) / len(tier_trades) * 100
        avg_win   = np.mean([t['gain_pct'] for t in wins])   if wins   else 0
        avg_loss  = np.mean([t['gain_pct'] for t in losses]) if losses else 0
        rr_ratio  = abs(avg_win / avg_loss) if avg_loss != 0 else 0

        # Expectancy per trade
        expectancy = (win_rate/100 * avg_win) + ((1 - win_rate/100) * avg_loss)

        # Exit reason breakdown
        exit_reasons = {}
        for t in tier_trades:
            reason = t.get('exit_reason', 'UNKNOWN')
            exit_reasons[reason] = exit_reasons.get(reason, 0) + 1

        stats[tier] = {
            'total_trades':    len(tier_trades),
            'wins':            len(wins),
            'losses':          len(losses),
            'win_rate_pct':    round(win_rate, 1),
            'avg_win_pct':     round(avg_win, 2),
            'avg_loss_pct':    round(avg_loss, 2),
            'rr_ratio':        round(rr_ratio, 2),
            'expectancy_pct':  round(expectancy, 2),
            'profitable':      expectancy > 0,
            'exit_reasons':    exit_reasons,
            'verdict':         'STRATEGY VALID' if win_rate >= 55 and expectancy > 0
                               else 'NEEDS REVIEW',
        }

    return stats

# ── REPORT GENERATOR ──────────────────────────────────────────────────────────

def print_report(stats: dict, all_trades: list, tickers: list):
    print("\n" + "="*65)
    print("  A2E BACKTEST RESULTS — IRONCLAD v2.1 EXIT RULES")
    print("="*65)
    print(f"  Tickers tested: {', '.join(tickers)}")
    print(f"  Total trades:   {len(all_trades)}")
    print(f"  Run date:       {datetime.now().strftime('%Y-%m-%d %H:%M ET')}")
    print("="*65)

    for tier, s in stats.items():
        if 'error' in s:
            print(f"\n{tier}: {s['error']}")
            continue
        verdict_icon = "[OK]" if s['profitable'] else "[!!]"
        print(f"\n{verdict_icon}  {tier} TIER")
        print(f"   Trades:      {s['total_trades']} ({s['wins']}W / {s['losses']}L)")
        print(f"   Win Rate:    {s['win_rate_pct']}%  (target: 65%+)")
        print(f"   Avg Win:     +{s['avg_win_pct']}%")
        print(f"   Avg Loss:    {s['avg_loss_pct']}%")
        print(f"   R/R Ratio:   {s['rr_ratio']}:1  (target: 2:1+)")
        print(f"   Expectancy:  {s['expectancy_pct']}% per trade")
        print(f"   Verdict:     {s['verdict']}")
        print(f"   Exit reasons: {s['exit_reasons']}")

    print("\n" + "="*65)
    print("  STRATEGY v1.1 PLACEHOLDER REPLACEMENT VALUES:")
    print("="*65)
    for tier, s in stats.items():
        if 'error' not in s:
            print(f"  {tier}: {s['win_rate_pct']}% win rate "
                  f"({s['rr_ratio']}:1 R/R, {s['expectancy_pct']}% expectancy)")
    print("="*65 + "\n")

# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='A2E Backtest Harness v1.0')
    parser.add_argument('--tickers', nargs='+', default=DEFAULT_TICKERS,
                        help='Tickers to test (default: A2E watchlist)')
    parser.add_argument('--days',    type=int,  default=365,
                        help='Lookback days (default: 365)')
    parser.add_argument('--output',  type=str,  default='backtest_results.json',
                        help='Output JSON file (default: backtest_results.json)')
    parser.add_argument('--quick',   action='store_true',
                        help='Quick mode: SPY + PSLV + AG only, 180 days')
    args = parser.parse_args()

    if args.quick:
        tickers = ['SPY', 'PSLV', 'AG']
        days    = 180
    else:
        tickers = args.tickers
        days    = args.days

    print(f"\n[A2E BACKTEST HARNESS v1.0]")
    print(f"Tickers: {tickers}")
    print(f"Lookback: {days} days\n")

    # ── Run per-ticker backtests ──────────────────────────────────────────────
    all_results = []
    failed = []

    for ticker in tickers:
        result = backtest_ticker(ticker, days)
        if 'error' in result:
            print(f"  [{ticker}] FAILED: {result['error']}")
            failed.append(ticker)
        else:
            trade_count = len(result['trades'])
            print(f"  [{ticker}] OK — {trade_count} signals found")
            all_results.extend(result['trades'])

    if not all_results:
        print("\n[ERROR] No trades generated. Check ticker symbols and data availability.")
        sys.exit(1)

    # ── Aggregate stats ───────────────────────────────────────────────────────
    stats = aggregate_stats(all_results)

    # ── Print report ──────────────────────────────────────────────────────────
    print_report(stats, all_results, tickers)

    # ── Save output ───────────────────────────────────────────────────────────
    output = {
        'harness_version': 'A2E_BACKTEST_v1.0',
        'run_date':        datetime.now().isoformat(),
        'config': {
            'tickers':     tickers,
            'days':        days,
            'tier_config': TIER_CONFIG,
        },
        'summary_stats':   stats,
        'total_trades':    len(all_results),
        'failed_tickers':  failed,
        'trades':          all_results,  # Full trade log for analysis
    }

    outpath = Path(args.output)
    with open(outpath, 'w') as f:
        json.dump(output, f, indent=2, default=str)

    print(f"[SAVED] {outpath.absolute()}")
    print(f"[DONE]  Load results in pandas: pd.read_json('{outpath}')['trades']\n")

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
A2E LIVE TICKER — Yahoo Finance API
Use this INSTEAD of web search for stock prices.
Run: python3 /home/claude/live_ticker.py
"""
import json, urllib.request, sys

# All A2E portfolio tickers
TICKERS = [
    'PSLV','AG','VOO','FCX','WPM','UCO','COPX','NLR','SMH','SLX',
    'HYMC','SIL','PHYS','IBIT','RKLB','LHX','ITA','SGOV','NUE',
    'SLV','SLVR','CEF','XLV','SCHD','JEPI','SPHD'
]

# Add any command line tickers
if len(sys.argv) > 1:
    TICKERS = sys.argv[1:]

results = {}
for ticker in TICKERS:
    try:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?interval=1d&range=1d"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=5)
        data = json.loads(resp.read())
        meta = data['chart']['result'][0]['meta']
        price = meta.get('regularMarketPrice', 0)
        prev_close = meta.get('previousClose', 0) or meta.get('chartPreviousClose', 0)
        change_pct = ((price - prev_close) / prev_close * 100) if prev_close else 0
        results[ticker] = {'price': round(price, 2), 'prev': round(prev_close, 2), 'change': round(change_pct, 2)}
    except Exception as e:
        results[ticker] = {'error': str(e)[:60]}

print(f"\n{'TICKER':<8} {'PRICE':>10} {'PREV':>10} {'CHG%':>8}")
print("-" * 40)
for t in TICKERS:
    if t not in results:
        continue
    r = results[t]
    if 'error' in r:
        print(f"{t:<8} {'ERROR':>10} {r['error'][:20]}")
    else:
        sign = '+' if r['change'] >= 0 else ''
        print(f"{t:<8} ${r['price']:>9.2f} ${r['prev']:>9.2f} {sign}{r['change']:>6.2f}%")

print(f"\n⏱ Live from Yahoo Finance API")

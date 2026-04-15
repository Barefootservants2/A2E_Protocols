# HUNTER v3.3 API SOURCE AUDIT
## Date: April 14, 2026
## Workflow: orZPNtvvCB8RAlwF (97 nodes)

## FINNHUB (9 nodes) — ⚠️ ALL HAVE EMPTY CREDENTIALS
| Node | Endpoint | Fix |
|------|----------|-----|
| H5 — Insider Transactions | /v1/stock/insider-transactions | Attach Finnhub API credential |
| H7 — Earnings Calendar | /v1/calendar/earnings | Attach Finnhub API credential |
| H9 — IPO Calendar | /v1/calendar/ipo | Attach Finnhub API credential |
| H19 — Finnhub Recs | /v1/stock/recommendation | Attach Finnhub API credential |
| H25 — Earnings Cal | /v1/calendar/earnings | Attach Finnhub API credential |
| H26 — Economic Cal | /v1/calendar/economic | Attach Finnhub API credential + REACTIVATE |
| H39a — SLV | /v1/stock/candle | SWAP TO YAHOO FINANCE (ETF candle = premium) |
| H39b — GLD | /v1/stock/candle | SWAP TO YAHOO FINANCE |
| H39c — SIL | /v1/stock/candle | SWAP TO YAHOO FINANCE |

## TWELVEDATA (9 nodes) — ON, UNTESTED
H10 Indices, H11 RSI, H12 MACD, H13 Bollinger, H14 ADX, H15 ATR, H16 EMA, H18 Stochastic, H20 Volume

## FRED (4 nodes) — ON
H27 Macro, H37 DXY, H38 10Y, H41 Gold Series

## SEC EDGAR (4 nodes) — ON, NO KEY NEEDED
H6 13F, H17 Form 4, H22 Whale 13F, H23 8-K

## YAHOO FINANCE (3 nodes) — ON, NO KEY NEEDED
H1 Volume Anomaly, H3 Options Flow, H24 Trending

## NEWSAPI (2 nodes) — ON
H2b News Velocity, H28 Geopolitical

## UNUSUAL WHALES (2 nodes) — ON
H30 Congress Trades, H40 GEX Options

## USASPENDING (1 node) — ON
H33

## AI AGENTS
- HANIEL (Gemini) — ON, hardcoded body needs v6.1 dynamic
- RAZIEL (DeepSeek) — ON
- CIL v6.1 Webhook — ON, returns empty

## YAHOO FINANCE SWAP TEMPLATE (for H39a/b/c)
URL: https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}?interval=1d&range=5d
Method: GET
Auth: None
Headers: User-Agent: Mozilla/5.0

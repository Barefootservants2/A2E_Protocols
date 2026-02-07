// ============================================================
// SECTOR-BLIND DISCOVERY SCAN — PROMPT TEMPLATE
// ============================================================
// USE: Paste this to any Collective member when requesting
// a market-wide discovery scan. Forces sector-blind inputs.
// ============================================================
//
// INSTRUCTIONS FOR MICHA OR ANY COLLECTIVE AGENT:
//
// When the Principal requests a "market scan" or "discovery scan",
// this template enforces the correct methodology:
//
// 1. SCAN ALL 11 GICS SECTORS — not just holdings
// 2. START with what moved, not what we own
// 3. SEPARATE discovery from confirmation in output
// 4. SHOW discovery FIRST, confirmation SECOND
//
// ============================================================

/*
DISCOVERY SCAN PROTOCOL — SECTOR-BLIND

Step 1: SECTOR ETF SWEEP (ALL 11 GICS)
Search for today's performance of:
- XLK (Technology)
- XLF (Financials)
- XLE (Energy)
- XLV (Healthcare)
- XLI (Industrials)
- XLY (Consumer Discretionary)
- XLP (Consumer Staples)
- XLU (Utilities)
- XLC (Communication Services)
- XLRE (Real Estate)
- XLB (Materials)
Plus: SOXX (Semiconductors), XAR (Aerospace/Defense), IBB (Biotech)

Step 2: VOLUME ANOMALY SCAN
Search for: "unusual volume stocks today" / "most active stocks"
Flag any ticker with volume > 3x average

Step 3: BREAKOUT SCAN
Search for: "stocks hitting 52-week highs today" / "new highs list"
Search for: "stocks breaking out of base today"

Step 4: SECTOR ROTATION
Which sectors are LEADING (up most)?
Which sectors are LAGGING (down most)?
Where is money ROTATING TO?

Step 5: NEWS VELOCITY
Search for: "market moving news today"
What tickers are being talked about most?

=== OUTPUT FORMAT ===

## DISCOVERY (Items NOT on portfolio/watchlist)
[List everything found that is NOT: GOOG, GOOGL, AVGO, QQQ, GLD, 
SIL, SOXX, NVDA, AMD, INTC, TSM, MSFT, AAPL, HYMC, PSLV, AG, 
SLV, BTC, ETH, XRP, SOL, XLM, IEMG, XAR, VBR, SPYD, COIN, JPM]

### New Sectors (highest value)
[Opportunities in sectors we DON'T typically watch]

### Familiar Sectors (moderate value)
[New tickers in sectors we DO watch]

## CONFIRMATION (Portfolio/watchlist validation)
[Anything found that IS on our list — show here, not above]

## DATA GAPS
[What sectors returned no interesting data]
[What searches failed or returned empty]

=== DRIFT GUARD ===
If you catch yourself defaulting to portfolio tickers in Steps 1-5,
STOP. The whole point is to find what we don't know about.
Discovery over confirmation. Always.
*/

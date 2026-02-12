# 8-SECTOR BLIND SCAN PROTOCOL v1.0

**Version:** 1.0 | **Effective:** February 12, 2026
**Classification:** MANDATORY — Every MARKET WATCH Run (Before Thesis Analysis)
**Authority:** Principal Directive

---

## PURPOSE

Prevent confirmation bias by forcing a FULL market scan BEFORE examining any specific thesis or position. This ensures macro context shapes the analysis rather than thesis conviction filtering the data.

**Origin:** Feb 9, 2026 — identified that HUNTER was only utilizing 15-20% of research capability by focusing narrowly on existing holdings instead of scanning broader market conditions and opportunities.

---

## EXECUTION ORDER

**This scan runs FIRST in every MARKET WATCH. No thesis analysis until all 8 sectors are checked.**

### SECTOR 1: EQUITIES
- Major indices: DOW, NASDAQ, S&P 500, Russell 2000
- Sector rotation signals (where is money flowing TO and FROM?)
- Notable movers (>3% individual stocks, >1% sector ETFs)
- Is this a broad selloff, sector rotation, or isolated event?

### SECTOR 2: BONDS / RATES
- 10Y Treasury yield and direction
- 2Y Treasury (front-end expectations)
- 2Y-10Y spread (inversion = recession signal)
- Fed funds rate expectations (CME FedWatch)
- Next FOMC date and market pricing

### SECTOR 3: CURRENCIES
- DXY (Dollar Index) — strongest single driver for metals
- EUR/USD, USD/JPY for risk appetite signals
- Emerging market currencies (stress indicator)

### SECTOR 4: ENERGY
- WTI Crude, Brent, Natural Gas
- Geopolitical supply risks (Middle East, Russia, OPEC+)
- Energy = inflation proxy → feeds into Fed expectations

### SECTOR 5: MACRO DATA
- Any data releases today or this week (CPI, PPI, NFP, GDP, etc.)
- Cleveland Fed nowcast or Atlanta Fed GDPNow
- Housing data, consumer confidence, ISM
- Anything that changes the Fed narrative

### SECTOR 6: GEOPOLITICAL
- Active conflicts or escalation/de-escalation
- Trade policy / tariffs (Section 232, Section 301)
- Sanctions, embargoes, diplomatic events
- Political events affecting markets (elections, appointments)

### SECTOR 7: TECH / AI
- AI sector momentum (this now MOVES the broad market)
- Software, semiconductor, cloud earnings/momentum
- Any regulatory actions affecting tech

### SECTOR 8: PRECIOUS METALS
- Gold spot, silver spot, platinum, palladium
- Shanghai premiums (SGE vs COMEX)
- COMEX inventory levels
- Mining sector performance (GDX, GDXJ, SIL)
- This sector comes LAST intentionally — analyze AFTER macro context

---

## OUTPUT FORMAT

After completing the scan, summarize with:

```
8-SECTOR SCAN SUMMARY — [Date]
═══════════════════════════════════════════════════
EQUITIES:    [1-line summary + direction arrow]
BONDS:       [1-line summary + direction arrow]  
CURRENCIES:  [1-line summary + direction arrow]
ENERGY:      [1-line summary + direction arrow]
MACRO:       [1-line key data point or "quiet"]
GEOPOLITICAL:[1-line summary or "no change"]
TECH/AI:     [1-line summary + direction arrow]
METALS:      [1-line summary + direction arrow]

PRIMARY DRIVER TODAY: [What's actually moving markets]
IMPACT ON OUR THESIS: [How this changes our positioning]
OPPORTUNITIES OUTSIDE CURRENT POSITIONS: [What the scan revealed]
```

---

## CRITICAL RULES

1. **Order matters.** Metals is sector 8 for a reason. Read the macro first.
2. **Name the driver.** Every market day has a PRIMARY driver. Identify it before analyzing positions.
3. **Challenge your thesis.** If the scan reveals the selloff is tech-driven, not metals-specific, that changes the response. Don't treat all red days the same.
4. **Find opportunities.** The scan should surface things OUTSIDE current holdings. If it only confirms what you already own, you're not scanning — you're seeking confirmation.
5. **10 minutes maximum.** This is a rapid scan, not deep research. Deep dives happen AFTER the scan identifies what matters.

---

## INTEGRATION

- Runs at the start of every MARKET WATCH (before Gate 1)
- Feeds into Gate 7.5 (Counter-thesis) with macro context
- Feeds into Gate 9.5 (Earnings) with sector rotation data
- SECTOR_BLIND_SCAN_TEMPLATE.js provides the automated n8n implementation

---

*Born from the realization that scanning only your positions is just staring in a mirror.*

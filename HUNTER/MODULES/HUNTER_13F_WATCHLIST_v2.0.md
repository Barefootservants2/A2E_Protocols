# HUNTER 13F WATCH LIST v2.0
**Status:** ACTIVE  
**Replaces:** v1.0 (DRIFT VIOLATION - metals-only watch list)  
**Date:** 2026-03-19  
**Author:** MICHA / Uriel Covenant  

---

## DRIFT CORRECTION NOTICE

v1.0 was built with metals-focused filers only (Sprott, Buffett metals positions,
Druckenmiller commodities, Burry PSLV, Dalio GLD). This violated HUNTER's core
wide-net principle. HUNTER is market-wide intelligence. Thesis confirmation is
NOT the job. Wide net is the job. Data leads, Principal decides.

v2.0 corrects this with full institutional coverage across all sectors.

---

## FILING TYPES MONITORED

| Code | Form | Trigger | Frequency |
|------|------|---------|-----------|
| H4   | SEC 13F-HR | Quarterly institutional holdings >$100M AUM | Quarterly (45-day lag) |
| H17  | SC 13D / SC 13G | Ownership crosses 5% threshold | Event-driven, immediate |
| H22  | Form 4 | Insider buy/sell transactions | Event-driven, 2-day window |

**MANDATORY:** H4/H17/H22 check runs on EVERY MARKET WATCH scan. No exceptions.

---

## TIER 1 - MACRO / MULTI-SECTOR (Primary Watch)

| Filer | Fund | CIK | Sectors | Why Watch |
|-------|------|-----|---------|-----------|
| Ray Dalio | Bridgewater Associates | 0001350694 | Macro, commodities, EM, equities | All-weather portfolio signals macro regime shifts |
| Warren Buffett | Berkshire Hathaway | 0001067983 | Financials, consumer, energy, tech | Value anchor, cash position signals market top/bottom |
| Stanley Druckenmiller | Duquesne Family Office | 0001536411 | Macro, tech, commodities, FX | Single best macro trader alive, high conviction moves |
| Michael Burry | Scion Asset Management | 0001649339 | Value, contrarian, puts | Early warning on systemic risk, sector shorts |
| Bill Ackman | Pershing Square | 0001336528 | Activist, consumer, real estate, tech | Concentrated high-conviction positions |
| George Soros | Soros Fund Management | 0001029160 | Macro, EM, options | Political/macro risk signals |
| David Tepper | Appaloosa Management | 0001656456 | Distressed, macro, tech | Market-moving macro calls |

---

## TIER 2 - SECTOR SPECIALISTS (Secondary Watch)

| Filer | Fund | CIK | Sectors | Why Watch |
|-------|------|-----|---------|-----------|
| Eric Sprott | Sprott Asset Management | 0001534778 | Precious metals, mining, uranium | Silver/gold thesis confirmation and structure |
| Dan Loeb | Third Point | 0001040273 | Activist, tech, consumer, healthcare | Activist plays signal undervalued sector pivots |
| David Einhorn | Greenlight Capital | 0001079114 | Value, shorting, macro | Contrarian shorts signal overvalued sectors |
| Carl Icahn | Icahn Enterprises | 0000813672 | Activist, energy, financials | Activist pressure plays |
| Ken Griffin | Citadel Advisors | 0001423298 | Multi-strategy, quant, all sectors | Broad market positioning at scale |
| Israel Englander | Millennium Management | 0001273931 | Multi-strategy, quant | High-frequency position changes signal momentum |

---

## TIER 3 - INSTITUTIONAL BENCHMARKS (Market Structure Watch)

| Filer | CIK | Purpose |
|-------|-----|---------|
| BlackRock | 0001364742 | Largest AUM - sector weight shifts signal institutional rotation |
| Vanguard Group | 0000102909 | Passive benchmark - position changes = index rebalancing signals |
| State Street | 0000093751 | SPDR ETF flows - sector in/out at scale |
| JPMorgan Chase | 0000019617 | Bank positioning - credit/macro risk proxy |
| Goldman Sachs | 0000886982 | Prop desk signals, sector rotation |

---

## WATCH LIST TICKERS (Cross-Reference vs Filer Holdings)

These tickers get cross-checked against every 13F filing pulled:

### Current Portfolio Positions
- PSLV, IBIT, AG, SIL, HYMC, SGOV

### Structural Thesis Tickers
- Silver complex: PSLV, SIL, AG, SIVR, HYMC, PAAS, HL, CDE
- Bitcoin: IBIT, MSTR, COIN
- Defense AI: PLTR, MSFT, GOOGL, AMZN
- Infrastructure: GLD, IAU, PHYS

### WATCH Only (No Trade)
- AMC (bankruptcy/delisting monitor)

---

## ALERT THRESHOLDS

| Event | Alert Level | Action |
|-------|-------------|--------|
| New position >$50M in any watch ticker | HIGH | Flag in HUNTER output, include in MARKET WATCH |
| Position increase >25% in watch ticker | MEDIUM | Include in HUNTER output |
| Full exit from watch ticker | HIGH | Counter-thesis check required (Gate 7.5) |
| New 13D/13G filing (>5% ownership) | HIGH | Immediate flag regardless of ticker |
| Form 4 insider buy >$1M | MEDIUM | Flag in HUNTER output |
| Form 4 insider sell >$5M | HIGH | Flag, assess thesis impact |
| Congress member trade in watch sector | HIGH | H31 cross-reference required |

---

## SEC EDGAR API ENDPOINTS

Base URL: `https://data.sec.gov`

```
# Get filer submissions (all recent filings)
GET /submissions/CIK{cik_padded_to_10}.json

# Get company facts
GET /api/xbrl/companyfacts/CIK{cik}.json

# Search filings by form type
GET https://efts.sec.gov/LATEST/search-index?q=%22{ticker}%22&dateRange=custom&startdt={date}&enddt={date}&forms=13F-HR

# Recent 13F filings
GET https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={cik}&type=13F&dateb=&owner=include&count=5&search_text=
```

**Rate limit:** 10 requests/second. Add 100ms delay between calls.
**User-Agent required:** `Ashes2Echoes/1.0 ashes2echoes.platform@gmail.com`

---

## SCAN FREQUENCY

| Trigger | H4 | H17 | H22 |
|---------|----|----|-----|
| Every MARKET WATCH | Check for new filings since last scan | Check for new filings since last scan | Check for new filings since last scan |
| Weekly Sunday Session | Full refresh all Tier 1 filers | Full refresh | Full refresh |
| Quarterly (Feb/May/Aug/Nov 15) | Full 13F pull all tiers | Full refresh | Full refresh |

---

## INTEGRATION POINTS

- **HUNTER Module:** H4 (13F), H17 (13D/13G), H22 (Form 4)
- **Cross-reference:** H30 (Finnhub), H31 (Congress.gov), H32 (Senate LDA)
- **Output:** Inject into HUNTER consolidated output, flag for METATRON Gate analysis
- **n8n Workflow:** GAP1 mandatory pre-scan check (see GAP1 spec)

---

## WHAT THIS FIXES FROM v1.0

| v1.0 Drift | v2.0 Fix |
|-----------|---------|
| Sprott, Buffett, Druckenmiller only on metals | All 3 tiers, all sectors |
| No CIK numbers in spec | Full CIK registry |
| No alert thresholds | Defined thresholds by event type |
| No API endpoints | Full EDGAR API reference |
| No scan frequency | Defined trigger matrix |
| Thesis-confirmation bias | Wide net, data leads |

---

*HUNTER is market-wide intelligence. NEVER thesis-specific.*  
*Wide net: 10 per agent, 25 consolidated.*  
*Data leads. Principal decides.*

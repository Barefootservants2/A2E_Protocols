# HUNTER — Institutional Filer Watch List v2.0
**Classification:** PROTOCOL FIX — Thesis Drift Correction  
**Date:** 2026-03-19  
**Author:** MICHA  
**Replaces:** v1.0 (metals-only — PROTOCOL VIOLATION)  
**Status:** PRODUCTION

---

## PROTOCOL NOTE

v1.0 watch list was built around precious metals names only (Sprott, Buffett, Druckenmiller, Burry, Ackman, Dalio).  
This constitutes **HUNTER thesis drift** — a direct protocol violation.  
HUNTER principle: **Wide net. 10/agent, 25 consolidated. Data leads. Principal decides.**  
This list covers ALL sectors. No thesis filter. Signals surface from data, not assumption.

---

## TIER 1 — MUST WATCH (Macro + Systemic Influence, $50B+ AUM)

| # | Manager | Fund/Firm | Style | SEC CIK | Why Watch |
|---|---|---|---|---|---|
| 1 | Warren Buffett | Berkshire Hathaway | Value/Diversified | 0001067983 | Largest disclosed equity holder. Sector rotations move markets. |
| 2 | Ray Dalio | Bridgewater Associates | Global Macro | 0001350694 | Risk parity signals, bond/commodity positioning |
| 3 | Ken Griffin | Citadel Advisors | Multi-Strategy | 0001423298 | Largest hedge fund. Cross-asset, options, equity signals |
| 4 | Jim Simons estate | Renaissance Technologies | Quant | 0001037389 | Medallion signals often front-run structural moves |
| 5 | David Siegel/John Overdeck | Two Sigma | Quant | 0001478987 | Second largest quant. AI-driven positioning |
| 6 | D.E. Shaw | D.E. Shaw & Co | Quant/Macro | 0001306523 | Early mover on volatility + rates trades |
| 7 | Larry Fink | BlackRock | Passive + Active | 0001364742 | Largest AUM globally. ETF flows signal sector rotation |
| 8 | State Street | State Street Global | Passive | 0000093751 | SPDR ETF creator. Key for sector ETF flow signals |

---

## TIER 2 — HIGH SIGNAL (Activist + Contrarian + Macro)

| # | Manager | Fund/Firm | Style | SEC CIK | Why Watch |
|---|---|---|---|---|---|
| 9 | Stanley Druckenmiller | Duquesne Family Office | Macro | 0001536411 | Best macro track record alive. Currency + commodity reads |
| 10 | Michael Burry | Scion Asset Management | Contrarian Value | 0001439289 | Identifies structural dislocations early. Short theses critical |
| 11 | Bill Ackman | Pershing Square | Activist | 0001336528 | Large disclosed positions move targets. Macro hedges notable |
| 12 | Paul Singer | Elliott Management | Activist | 0000886744 | Activist campaigns restructure sectors. Energy + tech targets |
| 13 | David Tepper | Appaloosa Management | Macro/Distressed | 0001441483 | Fed positioning signals. Risk-on/off indicator |
| 14 | Seth Klarman | Baupost Group | Deep Value | 0001061165 | Patient capital. Late-stage dislocation buyer |
| 15 | Dan Loeb | Third Point | Activist | 0001040273 | Tech + energy activist. Strong thesis letters |
| 16 | David Einhorn | Greenlight Capital | Value/Short | 0001079114 | Known for public short theses. Macro hedges |
| 17 | Andreas Halvorsen | Viking Global | Long/Short | 0001418814 | Strong tech + healthcare reads |

---

## TIER 3 — SECTOR SPECIALISTS (Retained from v1.0 + Expanded)

| # | Manager | Fund/Firm | Style | SEC CIK | Why Watch |
|---|---|---|---|---|---|
| 18 | Eric Sprott | Sprott Asset Management | Precious Metals | 0001638021 | Physical + miner positioning. Silver/gold thesis signals |
| 19 | Philippe Laffont | Coatue Management | Tech/Growth | 0001336380 | AI + semiconductor positioning |
| 20 | Chase Coleman | Tiger Global | Tech/Growth | 0001167483 | VC + public tech cross-signal |
| 21 | Joel Greenblatt | Gotham Asset Management | Value/Quant | 0001079114 | Magic Formula signals. Undervalued sector rotation |
| 22 | Steve Mandel | Lone Pine Capital | Long/Short | 0001061219 | Consumer + tech reads |
| 23 | Israel Englander | Millennium Management | Multi-Strategy | 0001273931 | Largest multi-strat. Options + derivatives signals |
| 24 | Jeffrey Talpins | Element Capital | Macro | 0001569590 | Rates + macro positioning |
| 25 | Bruce Berkowitz | Fairholme Capital | Contrarian | 0001101239 | Deep contrarian. Distressed + special situations |

---

## FILING TYPES TO MONITOR PER FILER

| Filing | Trigger | Frequency | Source |
|---|---|---|---|
| 13F-HR | New positions, size changes, exits | Quarterly (45 days post quarter) | SEC EDGAR |
| SC 13D | Activist stake >5% (intent to influence) | Within 10 days of threshold | SEC EDGAR |
| SC 13G | Passive stake >5% | Within 10 days / annually | SEC EDGAR |
| Form 4 | Insider buys/sells (public companies) | Within 2 business days | SEC EDGAR |

---

## EDGAR BASE URLS

```
13F Search:     https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={CIK}&type=13F&dateb=&owner=include&count=10
SC 13D/G:       https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={CIK}&type=SC+13&dateb=&owner=include&count=10
Full text API:  https://efts.sec.gov/LATEST/search-index?q=%22{ticker}%22&dateRange=custom&startdt={YYYY-MM-DD}&enddt={YYYY-MM-DD}&forms=13F-HR
```

---

## HUNTER INTEGRATION NOTES

- This list feeds **H4 (13F Scanner)** — all 25 filers monitored each quarter
- SC 13D/G triggers route to **H22 (SEC Action Monitor)** as activist signal
- Tier 1 filers get **daily EDGAR RSS check** for any new filing type
- Tier 2/3 filers get **weekly scan** + immediate alert on 13D/SC filings
- NO SECTOR FILTER applied at scan time — all positions reported, Principal filters
- Metals positions from Sprott/Dalio/Druckenmiller still relevant but NOT the only signal

---

## CHANGE LOG

| Version | Date | Change |
|---|---|---|
| v1.0 | Prior | Metals-only watch list — THESIS DRIFT VIOLATION |
| v2.0 | 2026-03-19 | Full rebuild. 25 filers, all sectors, wide net. Protocol compliant. |


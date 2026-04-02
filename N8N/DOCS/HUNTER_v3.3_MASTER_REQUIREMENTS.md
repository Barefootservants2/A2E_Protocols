# HUNTER v3.3 — MASTER REQUIREMENTS & ENHANCEMENT SPECIFICATION
## Ashes2Echoes LLC | METATRON v10.8 | April 2026
## Principal: William Earl Lemon | CIO: MICHA

---

## DOCUMENT PURPOSE

This document is the authoritative requirements specification for HUNTER v3.3 — the market intelligence workflow of the METATRON trading platform. It serves as:
- Complete node inventory with inputs, outputs, and status
- Data quality assessment per source
- Enhancement roadmap aligned to Five Ring return targets
- Reference for n8n Build AI or any agent rebuilding, extending, or auditing the workflow

**MISSION:** Beat elite institutional traders not through speed or capital — but through **breadth of data, quality of synthesis, and systematic discipline**. We gather what they ignore: lobbying flows, congressional trades, dark pool activity, federal contracts, campaign finance. We correlate signals they treat as noise.

**FINANCIAL GOAL:** Return from current NAV (~$350K) to $408K (January high) = +$58K minimum. Annual target: 17-20% return via Five Ring allocation discipline.

---

## ARCHITECTURE OVERVIEW

```
TRIGGERS (Schedule 6AM ET, 12:30PM ET, Manual)
    ↓
DATE SETUP (S0)
    ↓
42 H-MODULES PARALLEL — market data, technicals, intelligence, macro, metals
    ↓
INFLUENCE PIPELINE (H30-H36 → H35 Correlator)
CORRELATION PIPELINE (H37-H39 → Gate 9)
    ↓
GATE 9 — CORRELATION CHECK → Kill Switch (if DXY+Yield adverse)
    ↓
HUNTER MASTER MERGE
    ↓
DATA AGGREGATOR
    ↓
4 AGENTS PARALLEL: URIEL | COLOSSUS | HANIEL | RAZIEL
    ↓
HUNTER AGENT MERGE
    ↓
HUNTER SYNTHESIS — MICHA
    ↓
FORMAT TELEGRAM BRIEF → SEND TELEGRAM
FIRE CIL WEBHOOK → CIL v6.1
GITHUB ARCHIVE → Barefootservants2/AIORA
```

---

## SECTION 1: COMPLETE NODE INVENTORY

### S0 — CONTROL LAYER

| Node | Type | Function | Input | Output | Status |
|------|------|----------|-------|--------|--------|
| Schedule 6AM ET | scheduleTrigger | Daily pre-market scan | — | trigger | ✅ Active |
| Schedule 12:30PM ET | scheduleTrigger | Midday refresh | — | trigger | ✅ Active |
| Manual Trigger | manualTrigger | Dev/test runs | — | trigger | ✅ Active |
| Date Setup | code | Builds date vars (today, 30dAgo, etc.) | trigger | {today, thirtyDaysAgo, ...} | ✅ |

---

### H1-H9 — MARKET DISCOVERY

| Node | Source | Endpoint | What It Captures | Output Schema | Status | Priority |
|------|--------|----------|-----------------|---------------|--------|---------|
| H1 Volume Anomaly | Yahoo Finance | /v8/finance/spark | Tickers with 2x+ avg volume | {tickers, volume_ratios} | ✅ | HIGH |
| H2a AV Top Movers | Alpha Vantage | /query?function=TOP_GAINERS_LOSERS | Top 20 gainers/losers/active | {gainers[], losers[], active[]} | ✅ | HIGH |
| H2b News Velocity | NewsAPI | /v2/everything | Headline volume rate — news flow spike detection | {articles[], velocity_score} | ✅ | HIGH |
| H3 Options Flow | Yahoo Finance | /v7/finance/options/SPY | SPY options chain — institutional positioning proxy | {calls[], puts[], pcr} | ⚠️ VERIFY | HIGH |
| H4 Sector Rotation | Alpha Vantage | /query?function=SECTOR | Capital rotation between 11 sectors | {sector_performance[]} | ✅ | HIGH |
| H5 Insider Transactions | Finnhub | /stock/insider-transactions | Corporate insider buy/sell filings | {insiders[], net_buy_sell} | ✅ | HIGH |
| H6 SEC 13F EDGAR | SEC EDGAR | /LATEST/search-index | Institutional 13F filings — quarterly positions | {filers[], positions[]} | ✅ | HIGH |
| H7 Earnings Calendar | Finnhub | /calendar/earnings | Upcoming earnings — pre-earnings drift detection | {earnings[{date,ticker,estimate}]} | ✅ | HIGH |
| H8 FINRA Short Sale | FINRA | /regShoDaily | Reg SHO short sale volume — squeeze/confirmation | {short_volume[], threshold_list} | ✅ | MEDIUM |
| H9 IPO Calendar | Finnhub | /calendar/ipo | Upcoming IPOs — Ring 4 event plays | {ipos[{date,ticker,price_range}]} | ✅ | MEDIUM |

**ENHANCEMENT H1-H9:**
- H3 is currently hitting Yahoo Finance options chain for SPY only. **Expand to top 10 high-volume tickers daily.** Also add put/call ratio calculation and unusual options activity flag.
- H2b news velocity has no sentiment scoring. **Add: sentiment_score field (-1 to +1) via MICHA synthesis.**
- H8 FINRA endpoint may be stale — **verify daily update cadence.** Replace with FINRA TRACE if needed.

---

### H10-H20 — TECHNICAL ANALYSIS (Twelve Data)

| Node | Indicator | Timeframe | Signal | Output | Status |
|------|-----------|-----------|--------|--------|--------|
| H10 TD Indices | Price series | Daily | Broad market direction | {DJIA, SPX, NDX, RUT} | ✅ |
| H11 TD RSI | RSI(14) | Daily | Overbought/oversold | {rsi_value, signal: OB/OS/NEUTRAL} | ✅ |
| H12 TD MACD | MACD(12,26,9) | Daily | Trend confirmation | {macd, signal, histogram, cross} | ✅ |
| H13 TD Bollinger | BB(20,2) | Daily | Volatility/breakout | {upper, middle, lower, width} | ✅ |
| H14 TD ADX | ADX(14) | Daily | Trend strength | {adx_value, trend_strength} | ✅ |
| H15 TD ATR | ATR(14) | Daily | Volatility — stop sizing | {atr_value, stop_distance} | ✅ |
| H16 TD EMA | EMA(20/50/200) | Daily | Trend direction stack | {ema20, ema50, ema200, stack} | ✅ |
| H17 SEC Form 4 | SEC EDGAR | — | Insider trades (mandatory H4/H17/H22) | {form4_filings[]} | ✅ |
| H18 TD Stochastic | STOCH(14,3) | Daily | Momentum entry timing | {k, d, signal} | ✅ |
| H19 Finnhub Recs | Finnhub | — | Analyst consensus shifts | {strong_buy, buy, hold, sell} | ✅ |
| H20 TD Volume | Volume series | Daily | Cross-validates H1 anomalies | {volume, avg_volume, ratio} | ✅ |

**NOTE:** All Twelve Data calls currently use a watchlist. **DRIFT FIX MANDATORY:** H17 (Form 4) and H22 (Whale 13F) must check Sprott, Buffett, Druckenmiller, Burry, Ackman, Dalio on EVERY scan. This is non-negotiable per HUNTER protocol.

**ENHANCEMENT H10-H20:**
- **ADD H10b: Weekly + Monthly timeframe scan.** Daily is noise. Weekly MACD crossovers are higher-conviction signals.
- **ADD: Multi-timeframe confluence scoring.** When daily + weekly align, confidence multiplier applied.
- **ADD H20b: Relative volume (RVOL).** RVOL > 2.0 on a setup = institutional confirmation.

---

### H21-H28 — INTELLIGENCE LAYER

| Node | Source | What It Captures | Signal Type | Output | Status |
|------|--------|-----------------|-------------|--------|--------|
| H21 Congress Bills | Congress.gov | Active legislation — sector impact detection | Legislative catalyst | {bills[{title,sponsor,committee,status}]} | ✅ |
| H22 SEC Whale 13F | SEC EDGAR | Institutional whale positions (mandatory) | Smart money positioning | {whale_positions[{filer,ticker,shares,change}]} | ✅ |
| H23 SEC 8-K | SEC EDGAR | Material events — corporate action early warning | Event catalyst | {events[{ticker,type,date,summary}]} | ✅ |
| H24 Yahoo Trending | Yahoo Finance | Retail sentiment proxy — trending tickers | Retail flow | {trending[{ticker,count,change}]} | ✅ |
| H25 Earnings Cal | Finnhub | Secondary earnings validation (cross-check H7) | Pre-earnings drift | {earnings[]} | ✅ |
| H26 Economic Cal | Finnhub | FOMC, CPI, NFP, PPI dates + expectations | Macro event risk | {events[{date,country,event,estimate}]} | ✅ |
| H27 FRED Macro | FRED | Macro indicators (GDP, unemployment, M2, credit spreads) | Regime detection | {series[{id,value,date}]} | ✅ |
| H28 Geopolitical | NewsAPI | Geopolitical headline scan — Gate 8.5 input | Risk-off trigger | {articles[], geo_risk_score} | ✅ |

**ENHANCEMENT H21-H28:**
- **H22 is critical — verify watch list names are being checked.** Currently uses generic EDGAR search. Need to confirm Druckenmiller (Duquesne Family Office), Burry (Scion Asset Management), Ackman (Pershing Square), Dalio (Bridgewater) are in the filer filter.
- **H23 8-K is generic.** Add filter for: executive compensation changes, material agreements, restatements — these precede major moves.
- **H24 Yahoo Trending adds retail noise.** Pair with H2b news velocity to identify retail-driven vs institutional-driven moves. High trending + low institutional = fade. Low trending + high institutional = follow.
- **ADD H28b: Reddit WallStreetBets scanner** (mentioned in SENTINEL Stack). High DD post velocity on a ticker = leading indicator for retail squeeze attempts.

---

### H29-H36 — METALS & INFLUENCE PIPELINE

| Node | Source | What It Captures | Output | Status | Notes |
|------|--------|-----------------|--------|--------|-------|
| H29 Metals Spot | metals.dev | Live silver, gold, platinum, palladium prices | {silver, gold, platinum, palladium} | ✅ | Key for Ring 2 thesis |
| H30 Congress Trades | Unusual Whales | STOCK Act filings — congressional trades | {trades[{member,ticker,action,amount,date}]} | ✅ | UW replaces Finnhub |
| H31a Congress Bills | Congress.gov | Bill detail — legislative intelligence | {bills[]} | ✅ |
| H31b Congress Amend | Congress.gov | Amendments — policy shift detection | {amendments[]} | ✅ |
| H32 LDA Lobbying | Senate LDA | Lobbying registrations — corporate influence | {filings[{registrant,client,issue}]} | ✅ |
| H33 USASpending | USASpending.gov | Federal contract awards — government capital | {awards[{recipient,amount,naics,date}]} | ✅ |
| H34 FEC | FEC | Campaign finance — political money flow | {contributions[{committee,candidate,amount}]} | ✅ |
| H35 Influence Correlator | Code | Correlates H30-H34: lobby + FEC + congress trade convergence | {correlations[{ticker,convergence_score,signals}]} | ✅ |
| H36 LDA Recent | Senate LDA | Recent lobbying filings (<30 days) | {recent_filings[]} | ✅ |

**THIS IS THE DIFFERENTIATED LAYER.** No retail trader and very few hedge funds systematically correlate:
- Congressional stock trades (H30) 
- Bills those same members sponsor (H31)
- Lobbying spend on those bill topics (H32)
- Federal contracts going to companies in those sectors (H33)
- Campaign finance from those industry PACs (H34)

When all five align on the same ticker → **H35 Influence Convergence Score** should be treated as a PRIME signal regardless of technical setup.

**ENHANCEMENT H29-H36:**
- **H29: Add Shanghai Silver Premium.** This is the single most important leading indicator for the silver thesis. Shanghai premium vs COMEX = physical demand pressure. Currently not captured. Source: can be derived from SGE (Shanghai Gold Exchange) vs COMEX price differential.
- **H29b: Add COMEX Open Interest changes.** Rising OI + rising price = accumulation. Falling OI + falling price = distribution.
- **H30: Add UW Senate trades separately from House.** Senate members have longer advance knowledge on legislation.
- **H33: Expand to R&D contracts and SBIR awards.** Early SBIR Phase II awards to small companies precede commercial contracts by 12-18 months.
- **H35: Weight the convergence score.** Currently binary. Should be: (lobby spend × bill progress × congressional trade size × contract value) normalized 0-100.

---

### H37-H42 — MACRO/METALS CORRELATION (Gate 9)

| Node | Source | Series | Function | Output | Status |
|------|--------|--------|----------|--------|--------|
| H37 FRED DXY | FRED | DX=F proxy | Dollar strength — metals inverse correlation | {dxy_value, dxy_regime: BULL/BEAR/NEUTRAL} | ✅ |
| H38 FRED 10Y | FRED | ZB=F proxy | Yield curve — growth/inflation indicator | {yield_10y, yield_regime} | ✅ |
| H39a SLV | Finnhub | SLV candle | Silver ETF flow | {close, volume, change_pct} | ✅ |
| H39b GLD | Finnhub | GLD candle | Gold ETF flow | {close, volume, change_pct} | ✅ |
| H39c SIL | Finnhub | SIL candle | Silver miners flow | {close, volume, change_pct} | ✅ |
| H40 GEX Options | Barchart | /options/chain/getChain | Gamma Exposure — 4PM reset mechanic | {gex, key_levels, gamma_flip} | ❌ BLOCKED |
| H41 FRED Gold | FRED | Gold price series | Historical correlation for thesis | {gold_series[]} | ✅ |
| H42 COMEX Inventory | metalcharts.org | COMEX silver inventory | Physical delivery demand | {inventory, trend, days_since_change} | ⚠️ VERIFY |

**Gate 9 Logic:** If DXY rising + yields rising simultaneously → Correlation Kill Switch → automatic 50% metals reduction + 48hr embargo.

**H40 GEX IS BLOCKED** — Barchart blocks cloud IPs. This is a critical gap. GEX determines gamma squeeze/pin risk at key strikes. 

**ENHANCEMENT H37-H42:**
- **H40: Replace Barchart with UW options flow endpoint.** UW trial is active and has options data. Endpoint: `/api/options/unusual-activity`. This gives unusual options flow which is MORE actionable than raw GEX.
- **H40b: Add SpotGamma GEX data** (mentioned in METATRON protocol). Free tier available at spotgamma.com/api.
- **H42 COMEX: Verify metalcharts.org is returning live data.** This endpoint is not well-documented. Backup: CME Group COMEX warehouse stocks report (released daily at 3:30PM ET).
- **ADD H43: CFTC Commitment of Traders (COT) Report.** Released every Friday. Shows commercial (hedger) vs non-commercial (speculator) positioning in silver/gold futures. When commercials are net short = price ceiling. When commercials cover → major rally imminent. Source: cftc.gov/dea/futures/deacmesf.htm
- **ADD H44: Silver/Gold Ratio.** GSR (Gold:Silver ratio) > 80 historically = silver undervalued relative to gold. Current GSR tracking confirms or challenges the silver thesis weekly.
- **ADD H45: PSLV Premium/Discount.** PSLV premium over NAV = physical demand exceeding paper supply. Critical for Ring 2 thesis validation.

---

### AGENTS — THE SYNTHESIS LAYER

| Agent | Model | Role | Input | Expected Output | Current Status |
|-------|-------|------|-------|----------------|----------------|
| URIEL | OpenAI gpt-4o | Strategic opportunity — long-horizon thesis | hunter_payload JSON | {opportunities[], macro_regime, hot_sector} | ❌ 0/4 |
| COLOSSUS | xAI grok-3 | Technical setups — chart patterns + momentum | hunter_payload JSON | {setups[], market_structure} | ❌ 0/4 |
| HANIEL | Gemini 2.0 Flash | Intelligence signals — filings, congress, whales | hunter_payload JSON | {intelligence_signals[], whale_activity} | ❌ 0/4 |
| RAZIEL | DeepSeek deepseek-chat | Counter-thesis — adversarial Gate 7.5 analysis | hunter_payload JSON | {counter_analyses[], do_not_touch[]} | ❌ 0/4 |

**CURRENT BLOCKER:** All 4 agents returning 0/4. Root cause: n8n Code node `this.helpers.httpRequest()` availability in the deployed environment. 

**REQUIRED FIX (highest priority):** Test each agent endpoint independently using the n8n HTTP Request node with static body content (no expressions). If static body works → the issue is expression evaluation. If static fails → credential issue.

**AGENT ENHANCEMENT ROADMAP:**
- **ADD SARIEL (Perplexity Sonar Pro) as 5th agent.** API key active: `[PERPLEXITY_KEY — stored in n8n Variables as SARIEL_API_KEY]`. Role: Real-time web intelligence. Every response includes live web citations. Fills the gap between H28 (news headlines) and agent synthesis.
- **ADD Local Ollama agent (llama3.3:70b on The_Collective).** Role: Fast pre-filter. Run before cloud agents to reduce token spend on weak signals. Endpoint: requires ngrok tunnel or Cloudflare tunnel from The_Collective to expose `localhost:11434`.
- **URIEL prompt enhancement:** Currently generic. Add Ring-aware context: "Ring 3 = structural 6-12 month, Ring 4 = tactical 1-4 week, Ring 5 = lottery <1 week. Size accordingly."
- **RAZIEL enhancement:** Add IRONCLAD v2.1 rules to system prompt — stop distances, re-entry bans, correlation kill switch conditions. RAZIEL should flag IRONCLAD violations explicitly.
- **MICHA SYNTHESIS enhancement:** Current synthesis merges agent outputs. Add: cross-agent consensus scoring. If 3/4 agents flag same ticker = weight boost. If RAZIEL score > 70 = automatic CAUTION regardless of other agents.

---

### GATES — METATRON v10.8 VALIDATION LAYER

| Gate | Name | Logic | Kill Condition | Status |
|------|------|-------|----------------|--------|
| Gates 1-8 | CASCADE | 9-gate confidence validation | < threshold → block signal | Active in CIL v6.1 |
| Gate 8.5 | Regulatory Shock | H28 geopolitical spike | Extreme geo event → reduce exposure | Active |
| Gate 9 | Correlation Check | H37 DXY + H38 Yield adverse | Both adverse → Kill Switch | ✅ |
| Kill Switch | Auto-protocol | Gate 9 trigger | 50% metals reduction + 48hr embargo | Active |

**GATE ENHANCEMENT:**
- **Kill Switch Telegram alert is broken** — outputting raw JS template string instead of rendered message. Fix: change the Kill Switch Alert node to use static Telegram message with `{{ }}` expressions, not JS string concatenation.
- **ADD Gate 0.5: Premise Challenge** (in METATRON v10.8 spec but not in workflow). Before any signal passes, ask: "Has the premise of this trade changed since entry?" Prevents holding losers on stale thesis.
- **ADD Gate 5.5: Catalyst Freshness Check.** Flag signals where the catalyst is > 30 days old. HUNTER sometimes recycles stale news.

---

## SECTION 2: DATA GAPS & NEW SOURCE RECOMMENDATIONS

### TIER 1 — HIGH IMPACT, ADD IMMEDIATELY

| Source | Data | Why It Matters | API | Cost |
|--------|------|----------------|-----|------|
| UW Options Flow | Unusual options activity, dark pool prints | Institutional money movement before price moves | UW trial active | Included in UW |
| CFTC COT Report | Commercial vs speculative positioning in futures | Silver/gold thesis validation weekly | cftc.gov free | Free |
| PSLV NAV Premium | Physical silver trust premium/discount | Ring 2 thesis health check | Sprott website/scrape | Free |
| Shanghai Silver Premium | SGE vs COMEX price differential | #1 leading indicator for silver physical demand | Requires calculation | Free |

### TIER 2 — ADD WITHIN 30 DAYS

| Source | Data | Why It Matters | API | Cost |
|--------|------|----------------|-----|------|
| Earnings Whispers | Earnings whisper numbers vs consensus | Surprise direction prediction | earningswhispers.com | ~$20/mo |
| FINRA TRACE | Bond trade data | Credit market leading stock market | FINRA API free | Free |
| Quiver Quantitative | Congressional trades + Senate | Better formatting than raw Congress.gov | quiverquant.com | Free tier |
| SEC EDGAR Ownership | Real-time Form 144/4 | Insider selling detection | EDGAR API free | Free |

### TIER 3 — STRATEGIC ADDITIONS

| Source | Data | Why It Matters |
|--------|------|----------------|
| CME FedWatch | Fed rate probability | Regime-defining macro signal |
| AAII Sentiment Survey | Individual investor sentiment | Contrarian indicator at extremes |
| Goldman/JPM flow data | Prime brokerage flow reports | Publicly available weekly summaries |
| Patent filings (USPTO) | New tech filings by company | 12-18 month product pipeline signal |

---

## SECTION 3: FIVE RING FRAMEWORK — HUNTER ALIGNMENT

### Return Target: 17-20% Annual ($350K → $408K minimum)

| Ring | Allocation | Strategy | HUNTER Modules | Annual Contribution |
|------|-----------|----------|----------------|-------------------|
| Ring 1 | 40-50% | SGOV/JEPI/SCHD passive income | None — buy and hold | ~$8,265/yr (passive) |
| Ring 2 | 10-15% | PSLV+IBIT metals thesis | H29, H42, H43, H44, H45, Gate 9 | $7-14K (thesis play) |
| Ring 3 | 15-20% | Structural trends (PLTR, FCX, defense AI) | URIEL, H21, H22, H33, H35 | $13-21K |
| Ring 4 | 5-10% | Tactical/event plays (earnings, catalysts) | COLOSSUS, H7, H9, H3, H40 | $8-12.8K |
| Ring 5 | Max 2% | Lottery (binary events, options) | RAZIEL score, Kill Switch | Capped |

**HUNTER's primary job is Ring 3 and Ring 4 signal generation.** Ring 1 is passive — no HUNTER involvement needed. Ring 2 is thesis-driven — HUNTER validates or challenges the thesis via metals modules.

### Critical Rule (from HUNTER DRIFT FIX):
- HUNTER must remain MARKET-WIDE. Never thesis-specific.
- Wide net: 10 signals per agent, 25 consolidated minimum.
- Data leads. Principal decides.
- PLTR lesson: valuation screens must NOT override structural thesis signals.

---

## SECTION 4: IMMEDIATE ACTION ITEMS (PRIORITY ORDER)

### P0 — CRITICAL (Blocking production)
1. **Fix agents 0/4.** Use HTTP Request nodes with static JSON bodies containing `{{ $json.hunter_payload }}` expression in the user content field. Do NOT use Code nodes or JSON.stringify(). Build one test HTTP Request node per agent with hard-coded system prompt and `{{ $json.hunter_payload }}` as user content. Validate each independently before wiring into HUNTER.

2. **Fix Kill Switch Telegram template.** Node is outputting raw JS string. Change to static message with `{{ $json.condition }}`, `{{ $json.h37_regime }}`, `{{ $json.h38_regime }}`, `{{ $json.h39_flow }}` as n8n expressions.

### P1 — HIGH (This week)
3. **Add H40 replacement via UW options flow.** Current Barchart endpoint is blocked. Use UW `/api/options/unusual-activity` endpoint — already have trial access and variable `UNUSUAL_WHALES_API_KEY`.

4. **Verify H42 COMEX data.** metalcharts.org endpoint may be returning stale or empty data. Confirm response contains live inventory numbers.

5. **Add CFTC COT Report (H43).** Free endpoint. Weekly. Critical for silver thesis. Add to metals pipeline alongside H29.

### P2 — MEDIUM (This month)
6. **Add SARIEL (Perplexity) as 5th agent.** API key is active. Real-time web search with citations fills the intelligence gap between H28 headlines and MICHA synthesis.

7. **Add Shanghai Silver Premium calculation.** Derive from SGE vs COMEX spot differential. Add to H29 output as `shanghai_premium` field.

8. **Add PSLV NAV Premium tracking (H44).** Sprott publishes daily NAV. Premium > 3% = strong physical demand.

9. **Expose Ollama on The_Collective via tunnel.** Llama3.3:70b running locally. Wire as 6th agent for zero-cost pre-filter pass. Requires Cloudflare tunnel or ngrok to expose `localhost:11434` to n8n cloud.

### P3 — ENHANCEMENTS (Next 30 days)
10. Multi-timeframe technical analysis (weekly + daily confluence scoring)
11. H35 weighted convergence score (not binary)
12. IRONCLAD rules embedded in RAZIEL system prompt
13. Cross-agent consensus scoring in MICHA synthesis
14. Relative volume (RVOL) calculation in H20

---

## SECTION 5: WHAT MAKES THIS UNIQUE

**What big banks and hedge funds have that we don't:**
- Real-time Level 2 order flow
- Prime brokerage dark pool access
- Bloomberg Terminal data
- Proprietary quant models with 20-year backtests

**What WE have that most retail traders don't:**
- Correlated lobbying + congressional trade + FEC data (H30-H35) — most traders never look at this
- 5-agent AI consensus synthesis running in parallel — not one model, five
- METATRON 30-gate validation — eliminates emotional entry
- Full influence chain correlation (H35) — maps money from PAC → lobby → bill → contract → stock
- IRONCLAD risk management with automatic kill switch — prevents the blow-up that ends accounts
- Silver thesis backed by Shanghai physical premium data — structural, not speculative
- GABRIEL overnight watch — 6PM-9:25AM monitoring while markets are closed

**The edge isn't predicting the market. It's knowing what the informed money is doing before the price moves.**

---

## SECTION 6: WORKFLOW CONNECTIONS TO BROADER COLLECTIVE

| System | Connection | Data Flow |
|--------|-----------|-----------|
| CIL v6.1 | HUNTER → CIL webhook | Top 3 signals sent to 5-agent collective for consensus validation |
| GABRIEL v2.0 | Independent | Overnight watch monitors same Telegram channel. Escalates to E*TRADE API execution |
| SENTINEL | Independent | E*TRADE portfolio monitor — validates positions against IRONCLAD stops |
| METATRON v10.8 | Protocol layer | All 30 gates applied via HUNTER SYNTHESIS — MICHA node |
| GitHub AIORA | HUNTER → GitHub | Every scan archived at Barefootservants2/AIORA/reports/hunter_daily/ |
| Telegram | HUNTER → Telegram bot | Brief delivered to Principal's private chat (ID: 8203545338) |

---

## APPENDIX A: CREDENTIAL MAP

| Credential Name | Type | Used By | n8n ID |
|----------------|------|---------|--------|
| Alpha Vantage API | Header Auth | H2a, H4 | ImjP6dfYHgTNWWfo |
| NewsAPI | Header Auth | H2b, H28 | sj27C965hpE5Y717 |
| Finnhub API | Header Auth | H5,H7,H9,H19,H25,H26,H39a-c | ZsRtqMO5tofoPRmJ |
| Twelve Data API | Header Auth | H10-H16,H18,H20 | 3Jnfoq3LN9wTGMpu |
| GitHub_A2E_Token | Header Auth | GitHub Archive Write | jdjVIw73qgFd0a4Z |
| Telegram account | Telegram API | Kill Switch, Send Brief | 1cUBFkMQENfAXP8x |
| URIEL API Key | Header Auth | URIEL agent | HeSyKKuHzaqLk2tp |
| COLOSSUS API Key | Header Auth | COLOSSUS agent | PahnYDcKUA07lJZv |
| HANIEL API Key | Header Auth | HANIEL agent | AitODdRhySgSD8nm |
| RAZIEL API Key | Header Auth | RAZIEL agent | CnNJfQmlNmwePa7P |

## APPENDIX B: n8n ENVIRONMENT VARIABLES

| Variable | Used By | Value Source |
|----------|---------|-------------|
| UNUSUAL_WHALES_API_KEY | H30 | UW trial key |
| CONGRESS_API_KEY | H21, H31a/b | Congress.gov |
| FRED_API_KEY | H27, H37, H38, H41 | FRED St. Louis |
| FEC_API_KEY | H34 | FEC.gov |
| METALS_DEV_KEY | H29 | metals.dev — CONFIRMED LIVE |
| CIL_WEBHOOK_URL | Fire CIL Webhook | n8n CIL v6.1 |
| Uriel_API_Key | URIEL agent | OpenAI |
| Grok4_API_Key_20250809 | COLOSSUS agent | xAI |

---

*Document generated: April 2, 2026 | MICHA v10.7 | METATRON v10.8*
*Next review: After agents 4/4 achieved and first production signal delivered*

# FIN-001: INSIDER TRADING ANALYSIS

**Template ID:** FIN-001  
**Version:** 2.0  
**Owner:** Ashes2Echoes, LLC  
**HUNTER Modules:** H1 (Elite Investor Tracking), H4 (Insider Cluster Detection)  
**METATRON Gates:** 0, 0.5, 1, 2, 5.5, 7.5, 8, 9  
**CREATE Score:** 95/100

---

## PARAMETERS

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| symbol | Yes | — | Stock ticker symbol |
| days | No | 90 | Lookback period in days |
| threshold | No | 100000 | Minimum transaction value ($) |
| insider_types | No | all | Filter: officer, director, 10pct_owner, all |

---

## GENERATED PROMPT

```
You are a Senior SEC Enforcement Analyst with 15 years of experience specializing in Form 4 filings and insider trading pattern detection. You have testified as an expert witness in 12 securities fraud cases.

TASK: Analyze insider trading activity for {symbol} over the past {days} days.

METHODOLOGY:

1. DATA RETRIEVAL
   - Source: SEC EDGAR Form 4 filings
   - Filter: Transactions ≥ ${threshold}
   - Cross-reference with Schedule 13D/G amendments

2. CLUSTER ANALYSIS (per Seyhun, 1986)
   - Identify coordinated buying/selling within 5-day windows
   - Flag clusters of ≥3 insiders acting in same direction
   - Apply Lakonishok & Lee (2001) predictive framework

3. SIGNAL STRENGTH SCORING
   - C-suite transactions: Weight 3x
   - Director transactions: Weight 2x
   - 10% owners: Weight 1.5x
   - Apply Jeng et al. (2003) methodology

4. TIMING ANALYSIS
   - Days to next earnings: Flag if < 30 days
   - Days since material announcement: Flag if < 14 days

OUTPUT: JSON with summary, transactions, clusters, counter_thesis, sources, audit_hash

COUNTER-THESIS REQUIREMENT:
1. MARKET RISK: What macro condition invalidates bullish signals?
2. COMPANY RISK: What company event explains insider selling?
3. THESIS RISK: What if insiders don't have alpha here?

ACADEMIC REFERENCES:
- Seyhun (1986) - Insiders' profits
- Lakonishok & Lee (2001) - Are Insider Trades Informative?
- Jeng et al. (2003) - Estimating Returns to Insider Trading
```

---

## CREATE SCORE BREAKDOWN

| Component | Points | Rationale |
|-----------|--------|-----------|
| C (Clarity) | 19/20 | Specific thresholds, defined timeframes |
| R (Role) | 24/25 | Expert persona with credentials |
| E (Execution) | 19/20 | Numbered steps, academic citations |
| A (Accountability) | 14/15 | JSON schema, audit hash |
| T (Thesis-Testing) | 10/10 | 3 failure modes required |
| E (Evidence) | 9/10 | SEC EDGAR primary source |
| **TOTAL** | **95/100** | **PASS** |

---

## HUNTER INTEGRATION

### H1: Elite Investor Tracking
- Cross-reference with 13F filings
- Eric Sprott, Burry, Buffett position changes

### H4: Insider Cluster Detection
- 5-day window cluster analysis
- Coordinated activity scoring

---

**FIN-001 — RECEIPTS FOR EVERYTHING**

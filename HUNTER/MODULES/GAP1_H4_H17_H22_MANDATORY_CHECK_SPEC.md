# HUNTER GAP1 — H4/H17/H22 Mandatory Check Spec
**Classification:** PLATFORM GAP CLOSURE  
**Date:** 2026-03-19  
**Author:** MICHA  
**Gap Reference:** GAP1 — H4/H17/H22 mandatory check NOT confirmed implemented  
**Status:** IMPLEMENTATION READY

---

## PROBLEM STATEMENT

Per HUNTER DRIFT FIX protocol:  
> *"Mandatory H4/H17/H22 filing check on every MARKET WATCH scan."*

As of 2026-03-19, this check is **specced but NOT confirmed implemented** in n8n.  
Every MARKET WATCH run that skips these three modules is running with incomplete intelligence. This spec closes GAP1.

---

## MODULE DEFINITIONS

### H4 — 13F Institutional Filing Monitor
**What it does:** Checks SEC EDGAR for new 13F filings from watch list filers that include positions in tickers under analysis.  
**Data source:** SEC EDGAR full-text search API  
**Trigger:** Every MARKET WATCH scan  
**Output:** Any watch list filer with new/changed position in scanned ticker → flag as INSTITUTIONAL SIGNAL

### H17 — Congressional Trading Monitor (STOCK Act)
**What it does:** Checks for congressional trades filed under STOCK Act within 45-day disclosure window. Trades by legislators with committee assignments relevant to sectors under analysis are HIGH PRIORITY.  
**Data source:** HouseTrades/SenateTrades disclosures + Quiver Quantitative API  
**Trigger:** Every MARKET WATCH scan  
**Output:** Any congressional trade in scanned ticker or correlated sector → flag as LEGISLATIVE SIGNAL

### H22 — SEC Enforcement + Action Monitor
**What it does:** Checks SEC Litigation Releases, Administrative Proceedings, and EDGAR for enforcement actions, comment letters, and material disclosures on tickers under analysis.  
**Data source:** SEC Litigation Releases RSS, EDGAR company filings  
**Trigger:** Every MARKET WATCH scan  
**Output:** Any active enforcement, comment letter, or material disclosure → flag as REGULATORY RISK

---

## N8N IMPLEMENTATION ARCHITECTURE

### Position in MARKET WATCH Flow
```
[MARKET WATCH TRIGGER]
        ↓
[TICKER LIST BUILD]
        ↓
[H4 CHECK] ←── Run parallel with H17 + H22
[H17 CHECK] ←── Run parallel
[H22 CHECK] ←── Run parallel
        ↓
[MERGE — Wait for all 3] ← Merge node (Append mode)
        ↓
[GATE CHECK — Any flags?]
    YES → Prepend FILING INTELLIGENCE block to report
    NO  → Continue to standard analysis
        ↓
[STANDARD HUNTER PIPELINE CONTINUES]
```

---

## H4 NODE SPEC (n8n HTTP Request)

```json
{
  "name": "H4 — 13F EDGAR Check",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "GET",
    "url": "https://efts.sec.gov/LATEST/search-index",
    "queryParameters": {
      "q": "\"{{$node['TICKER_LIST'].json['ticker']}}\"",
      "forms": "13F-HR",
      "dateRange": "custom",
      "startdt": "={{$now.minus({days: 95}).toFormat('yyyy-MM-dd')}}",
      "enddt": "={{$now.toFormat('yyyy-MM-dd')}}"
    },
    "headers": {
      "User-Agent": "Ashes2Echoes-HUNTER/2.0 ashes2echoes.platform@gmail.com"
    },
    "options": {
      "timeout": 10000
    }
  }
}
```

**Post-processing logic:**
- Parse hits array
- Cross-reference entity_name against HUNTER_13F_WATCHLIST_v2 Tier 1/2/3
- If match found → output INSTITUTIONAL_SIGNAL with filer name, filing date, position direction

---

## H17 NODE SPEC (n8n HTTP Request)

```json
{
  "name": "H17 — Congressional Trading Check",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "GET",
    "url": "https://house-stock-watcher-data.s3-us-east-2.amazonaws.com/data/all_transactions.json",
    "options": {
      "timeout": 10000
    }
  }
}
```

**Post-processing logic:**
- Filter by ticker match against scan list
- Filter by transaction_date within last 45 days
- If match → output LEGISLATIVE_SIGNAL with member name, committee, trade type, amount range
- Cross-reference committee assignment to sector relevance

**Backup source:** https://senate-stock-watcher-data.s3-us-east-2.amazonaws.com/data/all_transactions.json

**Quiver Quantitative API (preferred, structured):**
```
GET https://api.quiverquant.com/beta/live/congresstrading/{ticker}
Header: Authorization: Token {QUIVER_API_KEY}
```
Note: Quiver API key needed — add to n8n credentials as QUIVER_API_KEY

---

## H22 NODE SPEC (n8n HTTP Request)

```json
{
  "name": "H22 — SEC Enforcement Check",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "GET",
    "url": "https://efts.sec.gov/LATEST/search-index",
    "queryParameters": {
      "q": "\"{{$node['TICKER_LIST'].json['ticker']}}\"",
      "forms": "litigation-release,admin-proceeding,33-act",
      "dateRange": "custom",
      "startdt": "={{$now.minus({days: 30}).toFormat('yyyy-MM-dd')}}",
      "enddt": "={{$now.toFormat('yyyy-MM-dd')}}"
    },
    "headers": {
      "User-Agent": "Ashes2Echoes-HUNTER/2.0 ashes2echoes.platform@gmail.com"
    }
  }
}
```

**Post-processing logic:**
- Any litigation release or admin proceeding → REGULATORY_RISK = HIGH, auto-flag
- Comment letters → REGULATORY_RISK = MEDIUM
- No results → REGULATORY_RISK = CLEAR

---

## MERGE + GATE LOGIC

```javascript
// Post-merge code node
const h4 = $node["H4 — 13F EDGAR Check"].json;
const h17 = $node["H17 — Congressional Trading Check"].json;
const h22 = $node["H22 — SEC Enforcement Check"].json;

const filingIntelligence = {
  institutional: h4.hits?.total?.value > 0 ? "SIGNAL" : "CLEAR",
  legislative: h17.length > 0 ? "SIGNAL" : "CLEAR",
  regulatory: h22.hits?.total?.value > 0 ? "RISK" : "CLEAR",
  anyFlag: false
};

filingIntelligence.anyFlag = 
  filingIntelligence.institutional === "SIGNAL" ||
  filingIntelligence.legislative === "SIGNAL" ||
  filingIntelligence.regulatory === "RISK";

return [{ json: filingIntelligence }];
```

---

## OUTPUT FORMAT (Prepended to MARKET WATCH Report)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILING INTELLIGENCE BLOCK — H4/H17/H22
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
H4 INSTITUTIONAL:  [SIGNAL / CLEAR]
  └─ [Filer name] | [Filing date] | [Position direction]

H17 CONGRESSIONAL: [SIGNAL / CLEAR]  
  └─ [Member name] | [Committee] | [Buy/Sell] | [Amount range]

H22 REGULATORY:    [RISK / CLEAR]
  └─ [Action type] | [Filing date] | [Summary]

MANDATORY CHECK: COMPLETE ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## IMPLEMENTATION CHECKLIST

- [ ] Add H4 HTTP node to MARKET WATCH workflow in n8n
- [ ] Add H17 HTTP node (House + Senate endpoints)
- [ ] Add H22 HTTP node to MARKET WATCH workflow
- [ ] Wire all three to Merge node (Append mode) before GATE CHECK
- [ ] Add Code node for merge + gate logic
- [ ] Add QUIVER_API_KEY credential to n8n (optional but preferred for H17)
- [ ] Test run against single ticker (AG or SIL)
- [ ] Confirm FILING INTELLIGENCE BLOCK appears in output
- [ ] Update GAP1 status to CLOSED in platform gaps tracker

---

## ESTIMATED BUILD TIME
2-3 hours in n8n with testing. No new external accounts needed except optional Quiver API key (free tier available at quiverquant.com).

---

## CHANGE LOG

| Version | Date | Change |
|---|---|---|
| v1.0 | 2026-03-19 | Initial spec. GAP1 closure. |


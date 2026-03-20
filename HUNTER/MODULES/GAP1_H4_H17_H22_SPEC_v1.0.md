# GAP1 - H4/H17/H22 MANDATORY FILING CHECK
## n8n Workflow Specification v1.0

**Status:** SPEC COMPLETE - BUILD READY  
**Date:** 2026-03-19  
**Priority:** P1 - Runs on every MARKET WATCH scan  
**Estimated Build:** 2-3 hours  

---

## PURPOSE

Enforce mandatory H4/H17/H22 filing check on every MARKET WATCH scan.
Currently HUNTER runs without this check. That is a protocol gap.
This workflow closes GAP1.

---

## WORKFLOW ARCHITECTURE

```
TRIGGER (Webhook or called by MARKET WATCH)
    |
    v
[1] BUILD FILER LIST
    - Load Tier 1 + Tier 2 watch list CIKs
    - Load last scan timestamp
    |
    v
[2] H4 - 13F CHECK (Loop over Tier 1 filers)
    - SEC EDGAR submissions endpoint
    - Filter: form type = 13F-HR
    - Filter: filed date > last scan date
    - Extract: new positions, changed positions, exits
    |
    v
[3] H17 - 13D/13G CHECK (Loop over all tickers)
    - SEC EDGAR full-text search
    - Filter: SC 13D, SC 13G
    - Filter: filed date > last scan date
    - Extract: ownership crossings >5%
    |
    v
[4] H22 - FORM 4 CHECK (Loop over watch tickers)
    - SEC EDGAR submissions
    - Filter: form type = 4
    - Filter: filed date > last scan date
    - Extract: insider buys/sells above threshold
    |
    v
[5] ALERT CLASSIFIER
    - Score each finding by alert threshold
    - HIGH / MEDIUM / LOW classification
    - Flag any watch ticker hits
    |
    v
[6] OUTPUT FORMATTER
    - Merge H4 + H17 + H22 findings
    - Format for HUNTER output injection
    - JSON structure matching HUNTER schema
    |
    v
[7] STORE LAST SCAN TIMESTAMP
    - Update Supabase or n8n static data
    |
    v
[8] RESPOND / INJECT
    - Return findings to calling workflow
    - OR post to Telegram if standalone run
```

---

## NODE SPECIFICATIONS

### Node 1: TRIGGER
```
Type: Webhook (POST)
Path: /gap1-filing-check
Authentication: None (internal only)
Response: Using Respond to Webhook Node
```

### Node 2: BUILD FILER LIST
```
Type: Code Node
Language: JavaScript

const tier1 = [
  { name: "Bridgewater/Dalio",     cik: "0001350694" },
  { name: "Berkshire/Buffett",     cik: "0001067983" },
  { name: "Duquesne/Druckenmiller",cik: "0001536411" },
  { name: "Scion/Burry",           cik: "0001649339" },
  { name: "Pershing/Ackman",       cik: "0001336528" },
  { name: "Soros Fund",            cik: "0001029160" },
  { name: "Appaloosa/Tepper",      cik: "0001656456" }
];

const tier2 = [
  { name: "Sprott",                cik: "0001534778" },
  { name: "Third Point/Loeb",      cik: "0001040273" },
  { name: "Greenlight/Einhorn",    cik: "0001079114" },
  { name: "Icahn",                 cik: "0000813672" }
];

const watchTickers = [
  "PSLV","SIL","AG","HYMC","IBIT","SGOV",
  "SIVR","PAAS","HL","MSTR","COIN","PLTR","GLD"
];

// Last scan: default 7 days ago if not stored
const lastScan = $input.first().json.lastScan || 
  new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0];

return [{json: { tier1, tier2, watchTickers, lastScan }}];
```

### Node 3: H4 - 13F CHECK
```
Type: HTTP Request (inside SplitInBatches loop)
Method: GET
URL: https://data.sec.gov/submissions/CIK{{ $json.cik }}.json
Headers:
  User-Agent: Ashes2Echoes/1.0 ashes2echoes.platform@gmail.com
  Accept: application/json

Post-request Code Node - Extract 13F filings:
const data = $input.first().json;
const filings = data.filings?.recent || {};
const forms = filings.form || [];
const dates = filings.filingDate || [];
const accNums = filings.accessionNumber || [];

const newFilings = [];
for (let i = 0; i < forms.length; i++) {
  if (forms[i] === '13F-HR' && dates[i] >= lastScan) {
    newFilings.push({
      type: 'H4_13F',
      filer: filerName,
      date: dates[i],
      accession: accNums[i],
      alertLevel: 'MEDIUM'
    });
  }
}
return newFilings.map(f => ({json: f}));
```

### Node 4: H17 - 13D/13G CHECK
```
Type: HTTP Request
Method: GET
URL: https://efts.sec.gov/LATEST/search-index?forms=SC+13D,SC+13G&dateRange=custom&startdt={{ $json.lastScan }}&enddt={{ $now.format('yyyy-MM-dd') }}&q={{ $json.watchTickers.join('+OR+') }}
Headers:
  User-Agent: Ashes2Echoes/1.0 ashes2echoes.platform@gmail.com

Alert Level: HIGH for all 13D/13G hits (ownership >5% = always HIGH)
```

### Node 5: H22 - FORM 4 CHECK
```
Type: HTTP Request (loop over Tier 1 CIKs)
Method: GET  
URL: https://data.sec.gov/submissions/CIK{{ $json.cik }}.json

Post-request Code Node:
const forms = data.filings?.recent?.form || [];
const dates = data.filings?.recent?.filingDate || [];

Filter: form type = '4', date >= lastScan
Alert: insider buy >$1M = MEDIUM, sell >$5M = HIGH
Cross-ref against watchTickers list
```

### Node 6: ALERT CLASSIFIER
```
Type: Code Node

function classify(finding) {
  if (finding.type === 'H17_13D') return 'HIGH';
  if (finding.type === 'H22_FORM4' && finding.transactionType === 'sell' 
      && finding.value > 5000000) return 'HIGH';
  if (finding.type === 'H22_FORM4' && finding.transactionType === 'buy'
      && finding.value > 1000000) return 'MEDIUM';
  if (finding.type === 'H4_13F' && finding.watchTickerHit) return 'HIGH';
  if (finding.type === 'H4_13F') return 'MEDIUM';
  return 'LOW';
}
```

### Node 7: OUTPUT FORMATTER
```
Type: Code Node

Output schema:
{
  "scan_id": "GAP1_YYYYMMDD_HHMMSS",
  "scan_timestamp": "ISO8601",
  "h4_findings": [...],
  "h17_findings": [...],
  "h22_findings": [...],
  "high_alerts": [...],
  "medium_alerts": [...],
  "watch_ticker_hits": [...],
  "total_findings": N,
  "injection_ready": true
}
```

### Node 8: STORE TIMESTAMP
```
Type: HTTP Request (Supabase) OR n8n Static Data
Store: { "gap1_last_scan": "YYYY-MM-DD" }
```

### Node 9: RESPOND TO WEBHOOK
```
Type: Respond to Webhook
Response Code: 200
Response Body: {{ $json }} (full findings object)
```

---

## TELEGRAM ALERT FORMAT (for HIGH alerts)

```
🚨 GAP1 FILING ALERT — {{ finding.alertLevel }}

Type: {{ finding.type }}
Filer: {{ finding.filer }}
Filed: {{ finding.date }}
Ticker Hit: {{ finding.tickerHit || 'N/A' }}

Action Required: Review in next MARKET WATCH
```

---

## RATE LIMITING

SEC EDGAR allows 10 requests/second.
Add Wait node (100ms) between each CIK lookup.
Total Tier 1 + Tier 2 = 11 filers.
H4 pass: ~1.2 seconds
H17 pass: ~0.5 seconds (single search query)
H22 pass: ~1.2 seconds
Total runtime: ~5-8 seconds per scan

---

## INTEGRATION WITH MARKET WATCH

Add as first sub-workflow call in MARKET WATCH trigger:

```
MARKET WATCH TRIGGER
    |
    v
[GAP1 SUB-WORKFLOW CALL] <-- ADD HERE
    |
    v
[HUNTER SCAN - existing]
    |
    v
[GAP1 FINDINGS INJECT into HUNTER output]
    |
    v
[METATRON GATES]
```

Webhook call from MARKET WATCH:
```javascript
// In MARKET WATCH Code node, before HUNTER scan:
const gap1Result = await $http.post(
  'https://ashes2echoes.app.n8n.cloud/webhook/gap1-filing-check',
  { lastScan: getLastScanDate() }
);
// Inject gap1Result.data into HUNTER context
```

---

## BUILD SEQUENCE (2-3 hours)

1. Create new workflow in n8n: "GAP1 - H4/H17/H22 Filing Check"
2. Add Webhook trigger node
3. Add Code node: BUILD FILER LIST (paste from spec above)
4. Add SplitInBatches + HTTP Request: H4 loop
5. Add Code node: extract 13F findings
6. Add HTTP Request: H17 single query
7. Add SplitInBatches + HTTP Request: H22 loop  
8. Add Code node: ALERT CLASSIFIER
9. Add Code node: OUTPUT FORMATTER
10. Add Respond to Webhook node
11. Test with manual execution
12. Wire into MARKET WATCH as first call
13. Publish

---

*GAP1 closes the mandatory filing check gap.*
*Every MARKET WATCH scan runs this before anything else.*
*No exceptions.*

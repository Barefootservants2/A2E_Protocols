# 🔱 PENDING BUILD GUIDE — METATRON v10.3
## Wiring & Test Fire Instructions
## February 10, 2026 | Ashes2Echoes LLC
## Status: TEST FIRE TODAY

---

# TODAY'S OBJECTIVE

**Finish design. Start testing.** Everything else is secondary.

---

# PHASE 1: BLOCKING FIXES (30 min)

These 5 items block the test fire. Do them in order.

## Fix 1: Response Extractor (5 min)

**Location:** Deactivated `Code in JavaScript` node (grayed out on canvas)

**Steps:**
1. Click node → 3-dot menu → Activate
2. Rename: `Response Extractor — MICHA Output`
3. Paste code:

```javascript
const response = $input.first().json;
let extractedText = '';

if (response.content && Array.isArray(response.content)) {
  extractedText = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');
} else if (response.choices && response.choices[0]) {
  extractedText = response.choices[0].message.content;
} else if (typeof response === 'string') {
  extractedText = response;
} else {
  extractedText = JSON.stringify(response);
}

return [{
  json: {
    synthesis: extractedText,
    timestamp: new Date().toISOString(),
    source: 'MICHA_Pass_2'
  }
}];
```

4. Wire: `MICHA Pass 2` → `Response Extractor` → `Format for Delivery`
5. Disconnect any direct wire from MICHA Pass 2 to Format

## Fix 2: Rename OpenAI Node (30 sec)

**Find:** `OpenAI_Message_Evaluation`
**Rename to:** `URIEL — Strategic Synthesis (OpenAI)`

## Fix 3: Verify Merge Collective (30 sec)

**Location:** Merge node after 4 agent nodes
**Verify:**
- Mode = **Append**
- **4 inputs** connected (URIEL, COLOSSUS, HANIEL, RAZIEL)

## Fix 4: HANIEL Auth (5 min)

**Location:** HANIEL HTTP Request node

1. Authentication: **None**
2. URL (with key in query):
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_GOOGLE_AI_KEY
```
3. Remove any `Authorization` or `x-goog-api-key` headers
4. Save

## Fix 5: RAZIEL Auth (5 min)

**Prerequisite:** Get DeepSeek key at https://platform.deepseek.com/api_keys (free)

**Location:** RAZIEL HTTP Request node

1. URL: `https://api.deepseek.com/v1/chat/completions`
2. Method: POST
3. Authentication: None
4. Headers:
   - `Authorization`: `Bearer YOUR_DEEPSEEK_KEY`
   - `Content-Type`: `application/json`
5. Body: Using JSON, fx Expression mode ON
6. Save

---

# PHASE 2: TEST FIRE (15 min)

After all 5 fixes:

1. Set workflow trigger to **Manual**
2. Click **Execute Workflow**
3. Watch each node — green = pass, red = fail
4. Expected flow:
```
Trigger → HUNTER Modules → Data Aggregator → MICHA Pass 1 → 
Intelligent Router → [URIEL|COLOSSUS|HANIEL|RAZIEL] → 
Merge Collective → MICHA Pass 2 → Response Extractor → 
Format → Telegram
```
5. Check Telegram for delivered brief
6. Screenshot results

**If any node fails:** Stop. Fix that node. Re-run.

---

# PHASE 3: H30-H35 WIRING (1-2 hours)

Code is DONE. Wiring is NOT.

## Architecture

```
H30 (Finnhub Congressional) ──→ Normalize ──┐
H31 (Congress.gov Committee) ─→ Normalize ──┼─→ Merge ─→ H35 Correlator
H32 (Senate LDA Lobbying) ────→ Normalize ──┤
H33 (USASpending Contracts) ──→ Normalize ──┤
H34 (FEC Campaign Finance) ───→ Normalize ──┘
```

## H30: Congressional Trading

**Type:** HTTP Request
**Name:** `H30 — Congressional Trading`
**URL:** `https://finnhub.io/api/v1/stock/congressional-trading?symbol=&from=2025-01-01&to=2026-12-31&token=YOUR_FINNHUB_KEY`

**Normalize node (Code):**
```javascript
const trades = $input.first().json;
const normalized = (Array.isArray(trades) ? trades : []).map(t => ({
  source: 'H30_congressional_trades',
  member: t.name || 'Unknown',
  party: t.party || '',
  chamber: t.chamber || '',
  ticker: t.symbol || '',
  transaction_type: t.transactionType || '',
  amount_range: t.amountFrom + '-' + t.amountTo,
  transaction_date: t.transactionDate || '',
  disclosure_date: t.filingDate || '',
  delay_days: Math.round((new Date(t.filingDate) - new Date(t.transactionDate)) / 86400000),
  committee: ''
}));
return [{ json: { data: normalized, count: normalized.length } }];
```

## H31: Committee Assignments

**Type:** HTTP Request
**Name:** `H31 — Committee Assignments`
**URL:** `https://api.congress.gov/v3/committee?api_key=YOUR_KEY&limit=250&format=json`
**Note:** Need Congress.gov key — https://api.congress.gov/sign-up/

**Normalize node:**
```javascript
const response = $input.first().json;
const committees = (response.committees || []).map(c => ({
  source: 'H31_committee_assignments',
  committee_name: c.name || '',
  chamber: c.chamber || '',
  committee_type: c.type || '',
  url: c.url || ''
}));
return [{ json: { data: committees, count: committees.length } }];
```

## H32: Lobbying Disclosure

**Type:** HTTP Request
**Name:** `H32 — Lobbying Disclosure`
**URL:** `https://lda.senate.gov/api/v1/filings/?filing_year=2026&format=json`
**Auth:** None (public API)

**Normalize node:**
```javascript
const response = $input.first().json;
const filings = (response.results || []).map(f => ({
  source: 'H32_lobbying_disclosure',
  registrant: f.registrant?.name || '',
  client: f.client?.name || '',
  amount: f.income || f.expenses || 0,
  filing_year: f.filing_year || '',
  filing_period: f.filing_period || '',
  lobbying_activities: (f.lobbying_activities || []).map(a => a.description).join('; ')
}));
return [{ json: { data: filings, count: filings.length } }];
```

## H33: Government Contracts

**Type:** HTTP Request
**Name:** `H33 — Government Contracts`
**Method:** POST
**URL:** `https://api.usaspending.gov/api/v2/search/spending_by_award/`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "filters": {
    "time_period": [{"start_date": "2025-01-01", "end_date": "2026-12-31"}],
    "award_type_codes": ["A", "B", "C", "D"]
  },
  "fields": ["Award ID", "Recipient Name", "Award Amount", "Awarding Agency", "Start Date", "Description"],
  "limit": 100,
  "page": 1,
  "sort": "Award Amount",
  "order": "desc"
}
```
**Auth:** None

**Normalize node:**
```javascript
const response = $input.first().json;
const contracts = (response.results || []).map(c => ({
  source: 'H33_government_contracts',
  recipient: c['Recipient Name'] || '',
  amount: c['Award Amount'] || 0,
  agency: c['Awarding Agency'] || '',
  start_date: c['Start Date'] || '',
  description: c['Description'] || '',
  award_id: c['Award ID'] || ''
}));
return [{ json: { data: contracts, count: contracts.length } }];
```

## H34: Campaign Finance

**Type:** HTTP Request
**Name:** `H34 — Campaign Finance`
**URL:** `https://api.open.fec.gov/v1/schedules/schedule_a/?api_key=YOUR_FEC_KEY&sort=-contribution_receipt_amount&per_page=100`
**Auth:** None (key in URL) — FEC key already wired

**Normalize node:**
```javascript
const response = $input.first().json;
const contributions = (response.results || []).map(c => ({
  source: 'H34_campaign_finance',
  contributor_name: c.contributor_name || '',
  contributor_employer: c.contributor_employer || '',
  committee_name: c.committee?.name || '',
  candidate_name: c.candidate_name || '',
  amount: c.contribution_receipt_amount || 0,
  date: c.contribution_receipt_date || '',
  state: c.contributor_state || ''
}));
return [{ json: { data: contributions, count: contributions.length } }];
```

## H35: Influence Chain Correlator

**Type:** Code (JavaScript)
**Name:** `H35 — Influence Chain Correlator`
**Inputs:** Merged output from H30-H34 normalize nodes

```javascript
const allData = $input.all().map(item => item.json);

const trades = allData.flatMap(d => (d.data || []).filter(r => r.source === 'H30_congressional_trades'));
const committees = allData.flatMap(d => (d.data || []).filter(r => r.source === 'H31_committee_assignments'));
const lobbying = allData.flatMap(d => (d.data || []).filter(r => r.source === 'H32_lobbying_disclosure'));
const contracts = allData.flatMap(d => (d.data || []).filter(r => r.source === 'H33_government_contracts'));
const finance = allData.flatMap(d => (d.data || []).filter(r => r.source === 'H34_campaign_finance'));

const correlations = [];

// DELAYED_DISCLOSURE: Flag trades with disclosure > 30 days
trades.forEach(trade => {
  if (trade.delay_days > 30) {
    correlations.push({
      type: 'DELAYED_DISCLOSURE',
      member: trade.member,
      ticker: trade.ticker,
      delay: trade.delay_days + ' days',
      severity: trade.delay_days > 45 ? 'HIGH' : 'MEDIUM',
      signal: 'Late disclosure — possible information advantage'
    });
  }
});

// SECTOR_CONVERGENCE: Multiple signals on same sector (future enhancement)
// COMMITTEE_TRADE: Member trades in sector their committee oversees (future)
// CONTRACT_TRADE: Trades near contract announcements (future)
// DONOR_TRADE: Contribution → trade correlation (future)

return [{
  json: {
    source: 'H35_influence_correlator',
    total_trades: trades.length,
    total_lobbying_filings: lobbying.length,
    total_contracts: contracts.length,
    total_contributions: finance.length,
    delayed_disclosures: correlations.filter(c => c.type === 'DELAYED_DISCLOSURE').length,
    correlations: correlations,
    scan_timestamp: new Date().toISOString()
  }
}];
```

## Final Wiring

1. Create: `Merge Influence Chain` — Mode: Append, 5 inputs
2. Wire: All 5 Normalize outputs → Merge Influence Chain
3. Wire: Merge Influence Chain → H35 Correlator
4. Wire: H35 output → existing `Merge All Module Results`

---

# PHASE 4: AGENT PROMPTS UPDATE (30 min)

Update each agent's HTTP body to reference v10.3 instructions.

**GitHub locations (all pushed today):**
- `COLLECTIVE/URIEL/URIEL_INSTRUCTIONS_v10.3.md`
- `COLLECTIVE/COLOSSUS/COLOSSUS_INSTRUCTIONS_v10.3.md`
- `COLLECTIVE/HANIEL/HANIEL_INSTRUCTIONS_v10.3.md`
- `COLLECTIVE/RAZIEL/RAZIEL_INSTRUCTIONS_v10.3.md`

For each agent node:
1. Open node → Body → Using JSON → fx ON
2. System message content: paste agent's full v10.3 instruction text
3. User message: `{{ $json.briefing }}` (data from Intelligent Router)
4. Save

---

# API KEYS NEEDED

| Key | For | URL | Status |
|-----|-----|-----|--------|
| Congress.gov | H31 | https://api.congress.gov/sign-up/ | ❌ Needed |
| FRED | H27 | https://fred.stlouisfed.org/docs/api/api_key.html | ❌ Needed |
| metals.dev | H29 | https://metals.dev | ❌ Needed |
| DeepSeek | RAZIEL | https://platform.deepseek.com/api_keys | ❌ Needed |

All are free tier. 15 minutes total to sign up.

---

# EXECUTION CHECKLIST

```
□ Phase 1: Fix 1 (Response Extractor)
□ Phase 1: Fix 2 (Rename OpenAI)
□ Phase 1: Fix 3 (Verify Merge)
□ Phase 1: Fix 4 (HANIEL Auth)
□ Phase 1: Fix 5 (RAZIEL Auth)
□ Phase 2: Manual test fire
□ Phase 2: Telegram delivery confirmed
□ Phase 3: H30-H35 nodes created
□ Phase 3: H30-H35 normalize nodes created
□ Phase 3: H35 Correlator wired
□ Phase 3: Influence Chain test fire
□ Phase 4: Agent prompts updated to v10.3
□ All API keys obtained
```

---

# VERSION REFERENCE

All collective now at v10.3 with Gate 0.75 FIDELITY LOCK.

| Document | Version | Location |
|----------|---------|----------|
| METATRON | v10.3 | PROTOCOLS/PRODUCTION/ |
| FIDELITY_LOCK | v10.3 | PROTOCOLS/PRODUCTION/ |
| MICHA | v10.3 | COLLECTIVE/MICHA/ |
| URIEL | v10.3 | COLLECTIVE/URIEL/ |
| COLOSSUS | v10.3 | COLLECTIVE/COLOSSUS/ |
| HANIEL | v10.3 | COLLECTIVE/HANIEL/ |
| RAZIEL | v10.3 | COLLECTIVE/RAZIEL/ |
| GABRIEL | v10.3 | COLLECTIVE/GABRIEL/ |
| SERAPH | v10.3 | COLLECTIVE/SERAPH/ |

---

🔱 **PENDING BUILD GUIDE v10.3 — TEST FIRE TODAY**
**February 10, 2026**

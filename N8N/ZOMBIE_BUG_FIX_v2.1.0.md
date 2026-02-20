# HUNTER ZOMBIE BUG FIX — PATCH v2.1.0
## Remove continueErrorOutput from 10 Nodes

**Date:** February 19, 2026  
**Priority:** P0 — Blocks entire Confidence Cascade  
**Workflow:** AIORA_HUNTER_Enterprise_Market_Intelligence (production)  
**n8n URL:** https://ashes2echoes.app.n8n.cloud/workflow/G8Cd5yF4nh7AOWF2

---

## THE BUG

10 agent/merge nodes have `continueErrorOutput: true` + `alwaysOutputData: true`. When an H-module gets a 429 rate limit or bad API response, instead of stopping or logging the error, it outputs `{}` with a green checkmark. This empty object flows downstream and poisons the entire pipeline.

**Result:** Every node shows green. The report says "CATASTROPHIC DATA FAILURE." You think the system ran successfully but it didn't.

---

## THE FIX

For EACH of the 10 nodes listed below, open the node in n8n and change:

### Step 1: Open node settings (gear icon)
### Step 2: Find "On Error" dropdown
### Step 3: Change from "Continue (using error output)" to "Stop Workflow"
### Step 4: UNCHECK "Always Output Data" if present

---

## NODES TO FIX

| # | Node Name | Current Setting | New Setting |
|---|-----------|----------------|-------------|
| 1 | MASTER MERGE | continueErrorOutput | stopWorkflow |
| 2 | DATA AGGREGATOR | continueErrorOutput | stopWorkflow |
| 3 | MICHA Pass 1 | continueErrorOutput | stopWorkflow |
| 4 | URIEL (OpenAI) | continueErrorOutput | stopWorkflow |
| 5 | COLOSSUS (xAI) | continueErrorOutput | stopWorkflow |
| 6 | HANIEL (Google) | continueErrorOutput | stopWorkflow |
| 7 | RAZIEL (DeepSeek) | continueErrorOutput | stopWorkflow |
| 8 | PAYLOAD BUILDER | continueErrorOutput | stopWorkflow |
| 9 | COLLECTIVE MERGE | continueErrorOutput | stopWorkflow |
| 10 | MICHA Pass 2 | continueErrorOutput | stopWorkflow |

---

## ALTERNATIVE: Error Routing (Recommended)

Instead of "Stop Workflow" which kills everything when ONE agent fails, the better approach:

### For H-Module nodes (data sources):
- On Error: **Continue (using error output)**  
- BUT: Add an **IF node** immediately after that checks `{{ $json.error }}` 
- If error exists → route to an ERROR LOG node (not downstream)
- If no error → continue to MASTER MERGE

### For Agent nodes (URIEL, COLOSSUS, HANIEL, RAZIEL):
- On Error: **Continue (using error output)**
- BUT: Add error check node that counts how many agents returned real data
- If < 2 agents returned data → STOP and alert "insufficient agent coverage"
- If 2+ agents returned data → continue with reduced confidence flag

### For MASTER MERGE and DATA AGGREGATOR:
- On Error: **Stop Workflow** — if these fail, nothing downstream is valid
- Add Telegram alert: "HUNTER HALTED — merge/aggregation failure"

---

## n8n JSON PATCH

For each node, the JSON property to change:

```json
// BEFORE (broken):
{
  "onError": "continueErrorOutput",
  "options": {
    "alwaysOutputData": true
  }
}

// AFTER (fixed):
{
  "onError": "stopWorkflow",
  "options": {
    "alwaysOutputData": false
  }
}
```

If editing the workflow JSON directly (export → edit → import):
1. Export workflow as JSON
2. Find-replace: `"continueErrorOutput"` → `"stopWorkflow"` (for merge/aggregator nodes)
3. Find-replace: `"alwaysOutputData": true` → `"alwaysOutputData": false`
4. Re-import

**WARNING:** This will cause the workflow to STOP on errors instead of silently passing garbage. You will see RED nodes. That's CORRECT behavior. Red nodes mean "this broke and I'm telling you" instead of "this broke and I'm pretending everything is fine."

---

## VERIFICATION

After applying the fix, test by:
1. Run HUNTER manually
2. Deliberately break one H-module (change API key to invalid)
3. Confirm: that module shows RED, downstream stops, Telegram says "HUNTER HALTED"
4. Fix the API key back
5. Run again — confirm full green with REAL data, not zombie empties

---

## AFTER ZOMBIE FIX: Wire Confidence Cascade

Once zombies are dead, wire the new gates:

```
MASTER MERGE (fixed)
    → GATE 2 (new code node — paste GATE_2_SIGNAL_VALIDATION.js)
    → GATE 4 (new code node — manual regime check)
    → Agent Distribution (existing, but now only receives passing tickers)
    → COLLECTIVE MERGE (fixed)
    → GATE 5 (new code node — paste GATE_5_CONSENSUS_SCORING.js)
    → GATE 6 (new code node — paste GATE_6_COUNTER_THESIS.js)
    → H35 CORRELATOR (existing, activate)
    → GATE 8 (new code node — paste GATE_8_TRAJECTORY_ALIGNMENT.js)
    → FORMAT + TELEGRAM + GITHUB
```

🔱

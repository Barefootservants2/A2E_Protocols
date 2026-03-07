# CIL v5.2.1 — PASS2 CHAIN FIX
## Date: 2026-03-07
## Scope: PASS2 BODY BUILDER + PASS2 FALLBACK

---

## THE PROBLEM (2 bugs, 1 chain)

### Bug E: PASS2 BODY BUILDER — Expression interpolation breaks JSON
- **Location:** PASS2 BODY BUILDER (Set/Expression node)
- **Problem:** Uses `{{ JSON.stringify($json) }}` inside a JSON string value.
  Agent outputs contain quotes, newlines, markdown fences (`\`\`\`json`), and
  special characters. When interpolated into the "content" field, these break
  the JSON structure. Anthropic API rejects it: "JSON parameter needs to be valid JSON"
- **Fix:** Replace with a CODE NODE that pre-builds the entire API request body
  as a proper JavaScript object. The MICHA PASS2 SYNTHESIS HTTP node then just
  sends `{{ JSON.stringify($json) }}` — which works because $json is already clean.

### Bug F: PASS2 FALLBACK — Receives error object, not agent data
- **Location:** PASS2 FALLBACK — OpenAI (HTTP node)
- **Problem:** Data flow is: PASS2 BODY BUILDER → MICHA PASS2 SYNTHESIS (FAILS) →
  PASS2 RESULT CHECK (tags error) → PASS2 ROUTE → PASS2 FALLBACK.
  By the time data reaches FALLBACK, $json = `{"error": "JSON parameter needs to
  be valid JSON", "pass2_failed": true}`. The original agent data is gone.
  `{{ JSON.stringify($json) }}` stringifies the error, not agents.
- **Fix:** Insert a PASS2 FALLBACK BODY BUILDER code node that uses n8n's
  `$('COLLECTIVE ASSEMBLER').first().json` to grab the original agent data
  directly, bypassing the error chain entirely.

---

## DEPLOYMENT STEPS

### Step 1: Replace PASS2 BODY BUILDER
1. Delete or disable the current PASS2 BODY BUILDER node
2. Create a new CODE NODE named "PASS2 BODY BUILDER"
3. Paste contents of `CIL_PASS2_BODY_BUILDER_v5.2_FIXED.js`
4. Wire: COLLECTIVE ASSEMBLER → PASS2 BODY BUILDER → MICHA PASS2 SYNTHESIS

### Step 2: Update MICHA PASS2 SYNTHESIS HTTP node
1. Body Content Type: JSON
2. Specify Body: Using JSON
3. JSON field: `{{ JSON.stringify($json) }}`
   (This now works because the Code node outputs a pre-built, clean object)

### Step 3: Insert PASS2 FALLBACK BODY BUILDER
1. Create a new CODE NODE named "PASS2 FALLBACK BODY BUILDER"
2. Paste contents of `CIL_PASS2_FALLBACK_BODY_BUILDER_v5.2_FIXED.js`
3. Wire: PASS2 ROUTE → PASS2 FALLBACK BODY BUILDER → PASS2 FALLBACK — OpenAI

### Step 4: Update PASS2 FALLBACK — OpenAI HTTP node
1. Body Content Type: JSON
2. Specify Body: Using JSON
3. JSON field: `{{ JSON.stringify($json) }}`
   (Same pattern — the Code node feeds it a clean object)

---

## VERIFY NODE NAME

The FALLBACK BODY BUILDER references `$('COLLECTIVE ASSEMBLER')` to pull original
agent data. If your node is named differently (check for spaces, caps), update
line 18 of the fallback code. You can verify the exact name by clicking the
COLLECTIVE ASSEMBLER node — the name shown in the header is what n8n uses.

---

## EXPECTED RESULT

With both PASS2 fixes deployed:
- MICHA PASS2 SYNTHESIS receives clean JSON → Anthropic returns synthesis
- If Claude fails, PASS2 FALLBACK BODY BUILDER grabs original data from
  COLLECTIVE ASSEMBLER → builds clean OpenAI request → GPT-4o returns synthesis
- pass2synthesis field populated → TEST VALIDATOR test 6 flips to PASS
- **Projected score: 10/10 (100%)**

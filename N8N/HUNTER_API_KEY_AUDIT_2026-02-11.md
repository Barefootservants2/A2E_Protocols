# HUNTER WORKFLOW API KEY AUDIT — February 11, 2026

**Classification:** Operations / Maintenance
**Workflow:** AIORA HUNTER UNIFIED v1.0
**Source:** n8n Cloud execution history analysis (Execution #1522)

---

## AUDIT SUMMARY

The HUNTER workflow had **never completed a full run**. All executions were either sub-second manual tests or longer runs canceled by user. Execution #1522 (8.5 minutes, canceled) revealed API failures across 63 nodes.

---

## FINDINGS

### CATEGORY 1: FINNHUB API — CORRUPTED KEYS (5 Nodes)

**Problem:** Two separate Finnhub API keys were CONCATENATED together, creating an invalid 80-character key where a 40-character key was expected.

| Node | Function | Key Status |
|------|----------|------------|
| H4 | Insider Trades | ❌ CORRUPTED (concatenated) |
| H5 | Institutional Holdings | ❌ CORRUPTED (concatenated) |
| H6 | SEC Filings | ❌ CORRUPTED (concatenated) |
| H25 | Company News | ❌ CORRUPTED (concatenated) |
| H30 | Congressional Trading | ❌ CORRUPTED (concatenated) |
| **H16** | **Earnings Calendar** | **✅ WORKING (correct 40-char key)** |

**Root Cause:** Likely a copy-paste error during bulk node configuration where two keys were pasted sequentially without clearing the field.

**Fix:** Replace with single valid Finnhub API key in all 5 corrupted nodes.

### CATEGORY 2: TWELVEDATA API — EXPIRED KEY (9+ Nodes)

**Problem:** API key returning "apikey parameter is incorrect" error. Key has expired.

| Nodes Affected | Error |
|----------------|-------|
| H7 + 8 additional TwelveData nodes | "apikey parameter is incorrect" |
| H7 specifically | Also references non-existent credential store variable |

**Root Cause:** TwelveData API key expired and was not rotated.

**Fix:** Generate new TwelveData API key and update all affected nodes. Fix H7's credential store reference.

### CATEGORY 3: METALS.DEV — MALFORMED KEY (1 Node)

**Problem:** Node H29 contains a key with suspicious pattern where "3BUS" appears twice in the string.

| Node | Function | Key Status |
|------|----------|------------|
| H29 | Metals Price Data | ❌ MALFORMED (duplicate fragment) |

**Root Cause:** Unknown — possibly a copy-paste corruption or key generation error.

**Fix:** Regenerate metals.dev API key and replace.

---

## WORKING CREDENTIALS

| Service | Status | Notes |
|---------|--------|-------|
| Telegram Bot | ✅ Working | Only properly bound credential |
| Anthropic API | ✅ Working | Hardcoded in AI nodes |
| xAI (Grok) | ✅ Working | Hardcoded in AI nodes |
| DeepSeek | ✅ Working | Hardcoded in AI nodes |
| OpenAI | ✅ Working | Hardcoded in AI nodes |
| Google AI | ✅ Working | Hardcoded in AI nodes |

---

## PRODUCTION HARDENING ISSUES (Also Found)

| Issue | Count | Fix |
|-------|-------|-----|
| Nodes missing "Always Output Data" | 46 | Set to TRUE on all nodes |
| Nodes set to stop on error | 39 | Change to "Continue on Fail" |
| Missing User-Agent headers (SEC EDGAR) | Multiple | Add compliant UA string |
| Hardcoded API keys (AI services) | 6 | Move to n8n credential store |

---

## REMEDIATION STATUS

| Item | Status | Date |
|------|--------|------|
| Finnhub keys updated | ✅ Principal confirmed | Feb 11, 2026 |
| TwelveData key rotated | ⚠️ Pending verification | — |
| Metals.dev key regenerated | ⚠️ Pending verification | — |
| Production hardening (46 nodes) | ❌ Not yet applied | — |
| Error handling (39 nodes) | ❌ Not yet applied | — |
| SEC EDGAR User-Agent | ❌ Not yet applied | — |

---

## PREVENTION PROTOCOL

1. **Monthly key rotation check** — add to PHOENIX CLOSE monthly calendar
2. **Execution test after any key change** — full workflow run, verify all 63 nodes
3. **Credential store migration** — move all keys from hardcoded to n8n credential store
4. **Key inventory document** — maintain encrypted reference of all active keys and expiration dates

---

*This audit would not have been possible without the Principal's direction to examine execution history rather than just workflow configuration.*

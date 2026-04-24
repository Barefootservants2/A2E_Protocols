# PHOENIX CARRY-FORWARD — 2026-04-23 Session 3b (Infrastructure Cleanup)

**Principal:** William Earl Lemon
**Agent:** MICHA (Claude Opus 4.7)
**Session:** S3b (continuation of S3 following website 404 discovery)
**Chain from:** `dd3063a8` (S3 close) → this file
**Status:** PHOENIX CLOSE with infra fix + protocol patches

---

## WHAT HAPPENED — S3b

S3 closed at ~15:45 ET claiming BULLSEYE was wired up. Principal opened the URLs at ~4 PM ET and saw 404s — both the root homepage and /bullseye/. This triggered a full forensic audit that uncovered **a 10-week-old silent infrastructure failure:**

The Vercel project serving `ashes2echoes.com` (`aiora_v1.0`) was connected to the wrong GitHub repo (`Barefootservants2/AIORA` — a Python backend with zero HTML files) instead of `Barefootservants2/Ashes2Echoes` (the fully-configured static site). Every "website refresh shipped" PHOENIX close since ~Feb 2026 was false.

Post-mortem committed: `A2E_Protocols/PHOENIX/POST_MORTEM_2026-04-23_DEPLOY_FAILURE.md` (`fa20c7b8`).

---

## REMEDIATION — COMPLETED THIS SESSION

### Vercel infrastructure (via API, using session-scoped token that was revoked at session end)

1. **Created** new `ashes2echoes` project (`prj_0aM8WYTjG5J4AXBxm5uOH6izXAF0`) connected to `Barefootservants2/Ashes2Echoes`
2. **Removed** `ashes2echoes.com` and `www.ashes2echoes.com` from `aiora_v1.0`
3. **Added** both domains to new `ashes2echoes` project
4. **Triggered** first production deploy from `Ashes2Echoes@main` sha `80598c27`; deploy went `READY` in 6 seconds
5. **Renamed** `aiora_v1.0` → `aiora-legacy-donotuse` to prevent re-use
6. **Deleted** `a2e_website_v7.4` and `a2e_website_v7.4.3` (both 3+ months dormant in ERROR state)
7. **Verified** live 200s on ashes2echoes.com, www.ashes2echoes.com, /forge/, /bullseye/ via Vercel's own web_fetch (bypassed container DNS issues)

### Protocol patches shipped

1. `A2E_Protocols/INFRASTRUCTURE/INFRA_MAP.md` — canonical state-of-record for what serves what from where. PHOENIX narrative now subordinate to this file.
2. `a2e-platform/phoenix/deploy_verify.py` — runnable script that curls every production URL, verifies content markers, queries Vercel API for git source match, runs P6 forbidden-link scan. Self-tested 7/7 passing against live state.
3. `CREDENTIAL_REGISTRY.md` — added VERCEL_API_TOKEN entry (label only, no value; rotation policy documented).

### Rules now in force (P1-P6)

- **P1:** INFRA_MAP.md canonical. Carry-forward narrative subordinate.
- **P2:** `deploy_verify` runs before any ship claim.
- **P3:** No ship/live claim without quoting live HTTP status.
- **P4:** Credentials never travel via screenshot — text paste only.
- **P5:** Vercel git sources never change without corresponding INFRA_MAP commit.
- **P6:** AIORA repo never connects to any Vercel project. If detected with a custom domain, disconnect immediately.

---

## DEPLOY STATE AT CLOSE (REQUIRED BY NEW P3 RULE)

Live deploy_verify output at session close:

```
✓ HTTP https://ashes2echoes.com/           200 OK · 49,760b · sha256:e8e851eac869
✓ HTTP https://www.ashes2echoes.com/       200 OK · 49,760b · sha256:e8e851eac869
✓ HTTP https://ashes2echoes.com/forge/     200 OK · 39,038b · sha256:214811e0fd02
✓ HTTP https://ashes2echoes.com/bullseye/  200 OK · 107,880b · sha256:072897cff6f9
✓ Vercel project 'ashes2echoes': id ok · git=Barefootservants2/Ashes2Echoes
✓ Vercel project 'forge-landing': id ok · git=Barefootservants2/forge-landing
✓ P6 check: aiora-legacy-donotuse: repo quarantined (no custom domains) — OK

ALL PASS (7/7)
```

---

## REVISED BUILD LIST

### 🔥 COMPLETED TONIGHT
- ✅ T1: BULLSEYE wired up at `ashes2echoes.com/bullseye/`
- ✅ Infrastructure cleaned up (1 correct project, 1 quarantined, 2 deleted)
- ✅ INFRA_MAP + deploy_verify + credential registry updates shipped

### 🎯 NEXT SESSION

- **T2:** Pull 5536 Roth IRA manifest (known gap)
- **T3:** Build mandatory `session_start.py` — OAuth check + 4-account portfolio pull + deploy_verify as Gate 0
- **T4:** Wire BULLSEYE action buttons (Trim/UpdateStop/Alert/Close via FastAPI bridge)
- **T5:** Add 5267 + 5536 cards to BULLSEYE
- **T6:** Content audit of all pages — flag version mismatches, broken links
- **T7:** FORGE Appendix A (scoring methodology)
- **T8:** VOO HL re-entry alert (Sentinel → Telegram)

### 📋 PROTOCOL FOLLOW-UPS

- **T11:** Codify yahoo previousClose trap in `sentinel/data/yahoo.py`
- **T12:** Execution Playbook — when API vs when manual
- **T13:** Integrate deploy_verify into MICHA Gate 0

---

## CARRY-FORWARD START PROMPT

"MICHA LATEST + PHOENIX. 2026-04-23 closed 3 sessions + S3b infra fix: S1 BULLSEYE Tier 1, S2 FORGE Ch 3, S3 trading +$3.3K locked with stops live, **S3b resolved 10-week-old ashes2echoes.com deploy failure** (wrong Vercel project→repo mapping). New project `ashes2echoes` created, domains transferred, dormant duplicates deleted, INFRA_MAP.md + deploy_verify.py shipped. ashes2echoes.com/ + /forge/ + /bullseye/ all verified HTTP 200 live. Production release path is real now — URL actually serves correct content. Next: T2 5536 Roth IRA manifest, T3 session_start with deploy_verify as Gate 0, T4 BULLSEYE action buttons, T5 5267+5536 cards, T6 full content audit toward PRD."

---

**End PHOENIX CARRY-FORWARD 2026-04-23-S3b**

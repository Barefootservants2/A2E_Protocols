# FORGE — CODE OPS DOMAIN TEMPLATES v1.0
## Claude Code & CLI + Debugging & Refactoring Library
**Author:** MICHA, CIO — Uriel Covenant  
**Date:** March 26, 2026  
**Source:** @leadgenman "Claude Code & CLI" + "Debugging & Refactoring" prompt series  
**Classification:** FORGE DOMAIN LIBRARY — CODE OPERATIONS  
**Integration:** Direct use in CIL Universal build, GABRIEL/SENTINEL maintenance, n8n workflow debugging  

---

## WHY THIS EXISTS

Every build session currently starts with ad-hoc debugging. We catch bugs like the zombie bug (alwaysOutputData), the SHA-less GitHub PUT, the doubled query params — but each time we approach them from scratch. These templates turn recurring build problems into structured, repeatable processes.

**A2E Code Stack:**
- n8n (JavaScript Code nodes, HTTP Request nodes)
- Supabase (PostgreSQL, REST API)
- GitHub API (curl-based, PAT auth)
- Anthropic API (Claude, structured outputs)
- Telegram Bot API (HTML parse mode)
- E*TRADE OAuth 1.0a (most complex auth in the stack)

Every template below is calibrated to this stack.

---

## TEMPLATE CO-1: CODEBASE REVIEW + CLAUDE.MD GENERATOR
**Use:** At the start of any new build session or when onboarding a new system. Produces the CLAUDE.md file that makes future Claude sessions 10x more effective.  
**Immediate use:** Generate CLAUDE.md for the n8n workflow directory, the A2E_Protocols repo, and the AIORA repo.

```
Act as a senior architect. Review my entire codebase and generate a CLAUDE.md 
file with:

- Coding standards and naming conventions used in this project
- Project structure explanation (what lives where and why)
- Tech stack with version numbers
- Key architectural decisions and why they were made
- Recurring patterns I use (how I name nodes, structure Code nodes, etc.)
- Anti-patterns to avoid in this specific codebase
- Context so future Claude sessions are 10x more effective immediately

Format as a CLAUDE.md file ready to drop in the project root.

Codebase context: [DESCRIBE YOUR PROJECT — n8n workflow, GitHub repo, 
specific system]

Files/structure: [PASTE KEY FILE STRUCTURE OR UPLOAD FILES]
```

**A2E-specific additions:**
After standard CLAUDE.md, add A2E-specific context block:
```
## A2E SYSTEM CONTEXT
- All workflows are part of Uriel Covenant AI Collective
- METATRON v10.7 is the operating protocol
- IRONCLAD v2.1 governs all risk decisions
- Zombie bug: alwaysOutputData must be FALSE on all HTTP Request nodes
- GitHub PUTs require SHA — always GET file first
- Telegram uses HTML parse mode — escape < > & in dynamic content
- Supabase project: bwtguoaakkmsnzomswem
- All credentials stored in n8n credential manager, never hardcoded
```

**ANVIL Score Target:** C5 R5 E5 A5 T4 E3 — minimum 25/30  
**ASSAY Gate:** Output must be a complete CLAUDE.md file, not a summary  

---

## TEMPLATE CO-2: HOSTILE PR REVIEW
**Use:** Before pushing any code to production. Catches what self-review misses.  
**Run frequency:** Every n8n workflow before activation. Every GitHub push of consequence.

```
Do a git diff and pretend you're a senior dev doing a code review and you 
HATE this implementation. Tear it apart.

What would you:
- Criticize about the architecture?
- Refactor immediately?
- Reject in a PR review?
- Flag as a security risk?
- Mark as a future maintenance nightmare?

Be ruthless. If it passes your review, it's production-ready.

Also note: What's actually good that you'd keep?

Code to review: [PASTE CODE OR DESCRIBE WORKFLOW]

Context: This runs in production on n8n. It touches live E*TRADE accounts 
and sends Telegram alerts to the Principal. Failures have real financial 
consequences.
```

**ANVIL Score Target:** C5 R5 E5 A4 T4 E3 — minimum 24/30  
**ASSAY Gate:** Review must include specific line-level criticisms, not just general observations  
**Mandatory use:** Every SENTINEL and GABRIEL node before activation  

---

## TEMPLATE CO-3: ERROR ROOT CAUSE ANALYSIS
**Use:** When a workflow fails and the error message is cryptic. Systematic diagnosis instead of random debugging.

```
Analyze this error stack trace. 

Provide:
- Root cause in plain English (no jargon)
- Exactly why this happens (the mechanism)
- A fix with proper error handling
- A regression test to prevent it in the future
- What monitoring to add so we catch this next time before it causes damage

Context: n8n workflow, production environment, [WHICH SYSTEM — SENTINEL/GABRIEL/CIL]

Error: [PASTE FULL ERROR MESSAGE AND STACK TRACE]

Relevant code: [PASTE THE NODE CODE WHERE ERROR OCCURS]
```

**A2E known error patterns to check first:**
```
1. "Cannot read property of undefined" → likely alwaysOutputData zombie
2. "422 Unprocessable Entity" (GitHub) → missing SHA on PUT
3. "Bad Request" (Telegram) → unescaped < > & in HTML message
4. "401 Unauthorized" (E*TRADE) → OAuth token expired, re-auth needed
5. "400 Bad Request" (Supabase) → schema mismatch on insert payload
6. Workflow runs but no output → Merge node not receiving all inputs
7. Empty data passes through → alwaysOutputData=true on HTTP node
```

**ANVIL Score Target:** C4 R5 E5 A4 T4 E3 — minimum 22/30  
**ASSAY Gate:** Must include regression test, not just the fix  

---

## TEMPLATE CO-4: REFACTOR FOR READABILITY + PERFORMANCE
**Use:** When a Code node works but is unmaintainable. Runs after any session where we wrote code fast to solve a problem.

```
Refactor this function to be more readable, performant, and testable.

Use clean architecture principles:
- Single responsibility (one function does one thing)
- Clear variable names that explain intent
- Error handling that fails loudly, not silently
- Comments only where the WHY is non-obvious (not what the code does)
- Performance optimization if the function runs frequently

Explain every decision you make.
Show me the before/after diff.
Rate the improvement on readability (1-10) and performance (1-10).

Context: This runs inside an n8n Code node. It processes [DESCRIBE WHAT IT DOES].
Current performance: [HOW OFTEN IT RUNS — every 30 min / every MARKET WATCH]

Code to refactor: [PASTE CODE]
```

**ANVIL Score Target:** C4 R5 E5 A4 T4 E3 — minimum 22/30  
**ASSAY Gate:** Before/after diff required. Both readability and performance ratings required.  

---

## TEMPLATE CO-5: TEST SUITE GENERATOR
**Use:** After building any new module. Tests before activation prevent the silent failures we've experienced.

```
Generate a complete test suite for [FUNCTION/WORKFLOW] covering:

- Happy path: Standard inputs produce expected outputs
- Edge cases: Empty arrays, null values, zero quantities, negative numbers
- Error handling: What happens when external APIs fail
- Boundary values: Maximum and minimum valid inputs
- Integration dependencies: What breaks if [dependency] is down

Use describe/it blocks with clear test names.
Include setup and teardown if needed.
Mark which tests require live API connections vs can run offline.

Context: n8n Code node running in [SYSTEM]. 
External dependencies: [LIST APIs CALLED — Yahoo Finance, Supabase, Telegram, etc.]
Critical invariants: [WHAT MUST ALWAYS BE TRUE — e.g., "never increase position size," "always log before executing"]

Function: [PASTE CODE]
```

**A2E critical invariants to always test:**
```
SENTINEL invariants:
- Never execute a trade without Principal approval (Level 2)
- Never remove a stop entirely — only widen
- Kill Switch fires immediately when conditions met, no delay
- All auto-executions logged with timestamp

GABRIEL invariants:
- Never fire Telegram without escalation check
- GREEN escalation = silent (no Telegram)
- RED escalation = Email + Telegram (both, not either)
- Morning Brief fires at 8AM ET exactly

CIL invariants:
- 3/5 agent quorum required for PASS2
- Fallback to GPT-4o if Claude synthesis fails
- Never pass empty agent_outputs to synthesizer
```

**ANVIL Score Target:** C4 R5 E5 A4 T4 E3 — minimum 22/30  
**ASSAY Gate:** Must include both happy path and failure mode tests. Critical invariants must be tested.  

---

## TEMPLATE CO-6: API SECURITY AUDIT
**Use:** Before exposing any endpoint or before sharing any workflow that contains credentials.  
**Mandatory run:** Before any A2E system goes production.

```
Review my API route/workflow for security vulnerabilities.

Check for:
- Credential exposure (hardcoded keys, tokens in logs)
- SQL injection risk (if any database queries)
- Authentication bypass possibilities
- Rate limiting gaps (can this be spammed?)
- Input validation failures (what happens with malformed input?)
- Data exposure (does error message leak internal structure?)
- Privilege escalation (can a lower-trust input trigger high-trust action?)

Prioritize fixes by severity: CRITICAL / HIGH / MEDIUM / LOW
For each finding, provide the specific fix.

Context: A2E production system handling [DESCRIBE — live trading data, 
portfolio positions, market alerts]. Real financial consequences if compromised.

Code/workflow: [PASTE CODE OR DESCRIBE WORKFLOW STRUCTURE]
```

**A2E-specific security requirements:**
```
CRITICAL (fix before any production use):
- No hardcoded API keys or tokens
- No credential logging in any node
- E*TRADE OAuth tokens expire — never cache without expiry check

HIGH (fix before activation):
- Telegram webhook must validate source
- Supabase anon key has limited permissions — verify RLS policies
- GitHub PAT scope must be minimal — no admin rights needed

MEDIUM (fix within one sprint):
- All HTTP Request nodes should have timeout set
- Error messages to Telegram should not expose system internals
- Rate limit all external API calls
```

**ANVIL Score Target:** C5 R5 E5 A4 T5 E3 — minimum 25/30  
**ASSAY Gate:** Every CRITICAL and HIGH finding must have a specific fix provided  

---

## TEMPLATE DB-1: CLEAN ARCHITECTURE REFACTOR
**Use:** When a workflow or codebase has grown organically and become unmaintainable. The CIL v5→v6 Universal pivot used this pattern.

```
This code works but is impossible to maintain. Refactor it using clean 
architecture principles.

Deliver:
- Extract reusable utilities into separate functions
- Add TypeScript-style type annotations in comments (for n8n Code nodes)
- Show a dependency diagram before and after the refactor
- Explain every architectural decision
- Identify which parts were over-engineered and simplify them
- Identify which parts were under-engineered and add structure

Before: [PASTE CURRENT MESSY CODE]

Context: This runs in [SYSTEM]. It currently handles [DESCRIBE WHAT IT DOES]. 
The problem is [DESCRIBE THE MAINTENANCE PAIN].
```

**ANVIL Score Target:** C4 R5 E5 A5 T4 E3 — minimum 23/30  
**ASSAY Gate:** Dependency diagram required (even if text-based). Before/after comparison required.  

---

## TEMPLATE DB-2: PRODUCTION DEBUG — CAN'T REPRODUCE LOCALLY
**Use:** When a workflow fails in production but works in test. The classic n8n problem.

```
I'm getting [ERROR] in production but can't reproduce locally.

Walk me through a systematic debugging process with 10 diagnostic steps.

Include:
- Environment diff checklist (what's different between local and production?)
- Logging strategy to add (what to log and where)
- How to set up monitoring to catch this next time
- Likely culprits ranked by probability
- Quick fixes to try in order

Production environment: n8n cloud (ashes2echoes.app.n8n.cloud)
Local environment: [DESCRIBE IF DIFFERENT]
Error: [PASTE ERROR]
When it fails: [DESCRIBE THE PATTERN — always / intermittent / specific conditions]
```

**Known n8n local vs production differences:**
```
1. Credential names: local may use different cred names than production
2. Environment variables: $vars may not be set in both environments
3. Timezone: production server may be UTC, local may be local TZ
4. API rate limits: production hits real rate limits, local rarely does
5. Concurrent executions: production can have multiple runs, local is sequential
6. Memory limits: production has execution memory limits
7. Webhook URLs: differ between local and cloud
```

**ANVIL Score Target:** C4 R5 E5 A4 T4 E3 — minimum 22/30  
**ASSAY Gate:** Must include environment diff checklist specific to the described setup  

---

## TEMPLATE DB-3: ZERO-DOWNTIME MIGRATION PLAN
**Use:** When upgrading CIL versions, rebuilding SENTINEL, or any production system that cannot have gaps.  
**Critical for:** CIL v5.2.1 → v6.0 Universal pivot. Any future SENTINEL rebuild.

```
Generate a migration plan to upgrade from [OLD SYSTEM] to [NEW SYSTEM] 
with zero downtime.

Include:
- Risk assessment: what can go wrong at each phase
- Phased timeline with go/no-go gates between phases
- Feature flag strategy for gradual rollout
- Rollback procedure if something breaks at each phase
- A runbook for migration day — hour by hour
- Validation tests to confirm successful migration

Context: Production system. Cannot have gaps in coverage. 
[SYSTEM] runs [SCHEDULE — 24/7 / market hours / overnight].
Current users: Principal William Earl Lemon + automated downstream systems.

Current system: [DESCRIBE v_OLD]
Target system: [DESCRIBE v_NEW]
Key differences: [WHAT'S CHANGING]
```

**ANVIL Score Target:** C5 R5 E5 A5 T4 E3 — minimum 25/30  
**ASSAY Gate:** Rollback procedure required at each phase. Go/no-go gates required.  
**Immediate use:** CIL v5.2.1 → v6.0 Universal migration  

---

## QUICK REFERENCE — WHEN TO USE WHAT

| Situation | Template |
|-----------|----------|
| Starting a new build — need context file | CO-1 (CLAUDE.md Generator) |
| Before pushing anything to production | CO-2 (Hostile PR Review) |
| Workflow erroring, don't know why | CO-3 (Error Root Cause) |
| Code works but messy | CO-4 (Refactor) |
| New module needs tests | CO-5 (Test Suite) |
| Before going live with any system | CO-6 (Security Audit) |
| System grown unmaintainable | DB-1 (Clean Architecture) |
| Fails in prod, not local | DB-2 (Production Debug) |
| Major version upgrade | DB-3 (Migration Plan) |

---

*FORGE Code Ops Domain Templates v1.0*  
*Ashes2Echoes LLC | Uriel Covenant AI Collective*  
*Source: @leadgenman Claude Code & CLI + Debugging & Refactoring series, March 2026*  
*Filed: FORGE/TEMPLATES/CODE_OPS/FORGE_CODE_OPS_TEMPLATES_v1.0.md*


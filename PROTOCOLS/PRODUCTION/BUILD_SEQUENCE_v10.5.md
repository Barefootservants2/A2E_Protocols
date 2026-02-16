# 🔧 BUILD SEQUENCE v10.5
## Implementation Roadmap | Uriel Covenant AI Collective
## Version: 1.0 | Effective: February 16, 2026
## Classification: PRODUCTION — LOCKED DECISIONS
## Source: Collective Review Synthesis + Principal Decisions (Feb 16, 2026)

---

## PRINCIPAL DECISIONS — LOCKED

These decisions were made by Principal William Earl Lemon on February 16, 2026 after Collective review synthesis of 4 independent agent assessments (COLOSSUS, HANIEL, SERAPH, URIEL) plus supplementary review.

| # | Decision | Choice | Alternatives Rejected |
|---|----------|--------|-----------------------|
| D1 | Wiring Doc Architecture | **Single file with TYPE A/B sections** | Two separate files (SERAPH dissent) |
| D2 | HUNTER Versioning | **Retain HUNTER v3.0 + add MODULESET v10.5** | Bump to v4.0 (COLOSSUS/HANIEL) |
| D3 | Build Sequence Priority | **METRICS PIPELINE first, then GABRIEL + SENTINEL L1 parallel** | SENTINEL-first or GABRIEL-first |
| D4 | Decay Model Complexity | **Heuristic v1.0 now, ML v2.0 at 90 days** | ML ensemble from start (COLOSSUS) |

### Consensus Items (No Decision Required — Full Convergence)
- Databento OPRA POC: YES, evaluate for PhD track
- Jump directly to v10.5, skip v10.4
- CHRONICLE: DEFERRED
- Ground News: DROPPED (no public API confirmed by HANIEL)

---

## ERROR FIXES — IMMEDIATE (< 2 hours total)

All 7 errors identified in synthesis. Fix in v10.5 protocol files before any builds.

| # | Error | Fix | Status |
|---|-------|-----|--------|
| E1 | H36 status discrepancy (CODE COMPLETE vs omitted) | Add H36 to module registry with correct status | ☐ |
| E2 | Congress.gov rate limit outdated (was 1,000, now 5,000/hr) | Update in HUNTER wiring and capability audit | ☐ |
| E3 | "19 structural fixes" claim unsupported (Feb 14 = 5 core fixes) | Correct to "5 core structural fixes + 14 supporting enhancements" | ☐ |
| E4 | Protocol state language conflict (v10.3 active vs v10.5 superseding) | v10.5 supersedes v10.3 upon GitHub push | ☐ |
| E5 | Attestation claims UNVERIFIED: 0 but contains forward-looking content | Reclassify forward-looking content as TYPE B | ☐ |
| E6 | H13/H13b overlap needs deprecation clarification | H13 = manual OpenBB reference, H13b = live Unusual Whales. Clarify in registry. | ☐ |
| E7 | SENTINEL directory creation missing from GitHub execution plan | Add `SENTINEL/` directory creation to Step 2 | ☐ |

---

## TIER 0: IMMEDIATE — Documentation + Metrics (Day 1)

**Time estimate: 3-4 hours**
**Dependencies: None**
**Deliverables: Protocol files + metrics repo**

| # | Task | Time | Owner |
|---|------|------|-------|
| T0.1 | Fix all 7 errors (E1-E7) in protocol files | 1 hr | MICHA |
| T0.2 | Add Module Maturity Ladder to HUNTER registry | 30 min | MICHA |
| T0.3 | Add Claim Type Taxonomy to FIDELITY LOCK v10.5 | ✅ DONE | MICHA |
| T0.4 | Create A2E_Metrics repository + initial schemas | 15 min | MICHA |
| T0.5 | Begin manual trade/protocol logging | 15 min | Principal |
| T0.6 | Push all v10.5 protocol files to GitHub | 1 hr | MICHA |
| T0.7 | Archive superseded v10.3 files | 30 min | MICHA |

### Module Maturity Ladder (replaces ambiguous "LIVE" status)

| Level | Name | Meaning |
|-------|------|---------|
| L0 | SPEC | Specification written, no code |
| L1 | BUILT | Code exists, not yet wired into workflow |
| L2 | WIRED | Connected in n8n, not yet tested with live data |
| L3 | VALIDATED | Tested with live data, output verified against known-good |
| L4 | PRODUCTION | Running in daily/weekly scan, monitored |
| L5 | INSTRUMENTED | Production + metrics logging active |

---

## TIER 1: WEEK 1 — Trust Layer (P1 Closure)

**Time estimate: 20-24 hours across week**
**Dependencies: TIER 0 complete**
**Deliverables: GABRIEL v1 operational, TYPE A/B templates live**

| # | Task | Time | Owner | Dependency |
|---|------|------|-------|------------|
| T1.1 | Create TYPE A + TYPE B document templates | 2 hr | MICHA | T0.6 |
| T1.2 | Implement QUARANTINE triggers in all agent instructions | 1 hr | MICHA | T1.1 |
| T1.3 | Add JSON config blocks to wiring doc standard | 2 hr | MICHA | T1.1 |
| T1.4 | Deploy GABRIEL v1 from seed file in n8n | 8-12 hr | COLOSSUS | T0.6 |
| T1.5 | Build GABRIEL-EXPORT daily n8n config pull | 4 hr | COLOSSUS | T1.4 |
| T1.6 | Define GABRIEL diff normalization standard | 2 hr | MICHA + COLOSSUS | T1.4 |
| T1.7 | Implement documentation release gate (Collective review before push) | 2 hr | MICHA | T0.6 |
| T1.8 | Draft Secrets Policy appendix | 1 hr | MICHA | None |

### GABRIEL Diff Normalization Standard (Gap G4)
Without this, false positives cause operator to ignore verifier, and drift returns.
- Canonical JSON ordering for all config comparisons
- Strip volatile fields: timestamps, metadata, session IDs
- Define semantic scope: diff only meaningful configuration paths
- Severity map: which changes are CRITICAL vs INFORMATIONAL

### JSON Config Block Standard (Gap G6)
GABRIEL needs machine-readable data, not Markdown prose. Every wiring doc node entry includes:

```json
<json_config>
{
  "node_id": "H1",
  "name": "SEC EDGAR Filing Monitor",
  "api_endpoint": "https://efts.sec.gov/LATEST/search-index?q=...",
  "method": "GET",
  "auth": "none",
  "polling_interval": "daily",
  "output_format": "JSON array of filings",
  "maturity": "L4"
}
</json_config>
```

---

## TIER 2: WEEKS 2-3 — Intelligence Expansion (GABRIEL + SENTINEL L1 Parallel)

**Time estimate: 15-20 hours across 2 weeks**
**Dependencies: TIER 1 complete (GABRIEL operational = trust gate)**
**Deliverables: SENTINEL L1 + L2 live, HUNTER integration defined**

| # | Task | Time | Owner | Dependency |
|---|------|------|-------|------------|
| T2.1 | Reddit OAuth app registration (Research classification) | 30 min | Principal | None |
| T2.2 | Discord webhook setup for alerts | 10 min | Principal | None |
| T2.3 | SENTINEL L1: Reddit DD Scanner build in n8n | 10-14 days | COLOSSUS | T2.1 |
| T2.4 | SENTINEL L1 quality scorer (Haiku-based) | 2-3 days | MICHA | T2.3 |
| T2.5 | SENTINEL L2: Social Sentiment Velocity | 5-7 days | COLOSSUS | T2.3 |
| T2.6 | Define SENTINEL → HUNTER output bus integration | 2 hr | MICHA | T2.3 |
| T2.7 | Reddit API: classify as Research, verify commercial restrictions | 1 hr | MICHA | T2.1 |

### SENTINEL L1 Output → HUNTER Integration
SENTINEL runs as separate n8n workflow (cadence mismatch: 15-min polling vs 6 AM batch). Shared output bus:
- SENTINEL writes to shared data store (JSON file or n8n static data)
- HUNTER daily scan reads SENTINEL overnight accumulation
- No direct workflow coupling — failure isolation preserved

### CRITICAL: SENTINEL L1 output UNTRUSTED until GABRIEL verification pipeline operational
GABRIEL is the trust gate. SENTINEL can generate alerts, but alerts are not actionable intelligence until the verification pipeline confirms they're not hallucinated or miscategorized.

---

## TIER 3: WEEKS 3-4 — Convergence + Hardening

**Time estimate: 15-20 hours across 2 weeks**
**Dependencies: TIER 2 complete (SENTINEL L1 + L2 live)**
**Deliverables: Full SENTINEL stack, validation harness, golden-set started**

| # | Task | Time | Owner | Dependency |
|---|------|------|-------|------------|
| T3.1 | SENTINEL L3: GEX Monitor (Unusual Whales options flow) | 5-7 days | COLOSSUS | T2.3 |
| T3.2 | SENTINEL-AGG Convergence Engine | 3-5 days | COLOSSUS | T3.1 |
| T3.3 | SENTINEL-NOTIFY Alert Dispatch (Discord + email) | 1-2 days | COLOSSUS | T3.2 |
| T3.4 | SENTINEL validation harness | 3 days | MICHA | T3.2 |
| T3.5 | Golden-Set repository creation + 300 initial cases | 5-7 days | ALL | T1.4 |
| T3.6 | Begin retroactive SENTINEL log backfill | ongoing | Principal | T3.3 |

### Golden-Set Repository
Known inputs → expected outputs → measurable drift.
- 300 initial test cases covering: HUNTER module outputs, SENTINEL alerts, gate enforcement, attestation validation
- Cases sourced from: live n8n workflow exports, historical trade records, P1 incident documentation
- Stored in A2E_Protocols/GOLDEN_SET/ directory
- GABRIEL v1 regression testing uses this as ground truth

---

## TIER 4: WEEKS 5-8 — Governance + Maturity

**Time estimate: 12-16 hours across 4 weeks**
**Dependencies: TIER 3 complete (full SENTINEL, golden-set populated)**
**Deliverables: Cryptographic anchoring, automated audit, decay prediction**

| # | Task | Time | Owner | Dependency |
|---|------|------|-------|------------|
| T4.1 | Truth Manifest with SHA-256 (MANIFEST.yaml) | 2 days | COLOSSUS | T1.4 |
| T4.2 | GABRIEL diff normalization v2 (refined from T1.6) | 2 days | COLOSSUS | T3.5 |
| T4.3 | Verification TTL enforcement | 1 day | MICHA | T4.1 |
| T4.4 | Cross-Agent Audit v0.1 | 3 days | MICHA + RAZIEL | T3.5 |
| T4.5 | Decay Model v1.0 — Heuristic scoring | 2 days | MICHA + HANIEL | T0.4 (needs 90 days data) |
| T4.6 | PhD alignment map | 1 day | MICHA | T3.4 |
| T4.7 | Context Compression JSON for Atomic Sessions | 2 days | COLOSSUS | T1.4 |

### Decay Model v1.0 — Heuristic (Principal Decision D4)
Deploy heuristic scoring now using simple weighted factors:
- Session message count (higher = more drift risk)
- Time since last ANCHOR trigger
- Number of context switches in session
- Document complexity (TYPE A more drift-prone than TYPE B)

ML v2.0 at 90 days after sufficient drift data collection from protocol log.

### Verification TTL (Gap G9)
Verified facts expire. A TYPE A record verified on Feb 1 should not be treated as current truth on April 1 without re-verification. TTL by category:
- API endpoint configurations: 30 days
- Rate limits: 90 days
- Module status: 14 days
- Attestation claims: per-session (expire with session)

---

## TIER 5: DEFERRED

| Item | Reason | Revisit When |
|------|--------|-------------|
| CHRONICLE (YouTube Transcript Pipeline) | Not core intelligence; additive | After SENTINEL stable |
| Ground News | DROPPED — No public API (HANIEL confirmed) | Never |
| Decay Model v2.0 ML ensemble | Needs 90 days drift data | After T4.5 heuristic deployed |
| H38 Dark Pool aggregator | Budget-dependent | After revenue or grant funding |
| X/Twitter integration | Budget-dependent, API cost | After revenue or grant funding |
| Databento PhD formalization | Evaluate after free POC | After POC results + PhD program start |
| CoWork Agent Library | Evaluation phase | After core v10.5 stable |

---

## PROGRESS TRACKING

### Completion Criteria per Tier

| Tier | Complete When |
|------|--------------|
| TIER 0 | All 7 errors fixed, metrics repo live, v10.5 files on GitHub |
| TIER 1 | GABRIEL v1 running daily diff, TYPE A/B templates in use, secrets policy drafted |
| TIER 2 | SENTINEL L1 producing alerts, Reddit OAuth active, output bus connected |
| TIER 3 | All 3 SENTINEL layers live, convergence engine operational, 300+ golden-set cases |
| TIER 4 | SHA-256 manifests, verification TTL enforced, decay model producing scores |

### Weekly Review Checklist
Every Sunday during MARKET WATCH session:
1. Which TIER tasks completed this week?
2. Any blockers for next week's tasks?
3. Metrics pipeline: are logs being captured daily?
4. SENTINEL (when live): fill in `subsequent_move` for alerts from prior weeks
5. Update this document's status checkboxes

---

## ATTESTATION

```
DOCUMENT: BUILD SEQUENCE v10.5
TYPE: B — ENGINEERING SPECIFICATION
VERIFIED: All content derived from:
  - Collective Review Synthesis (Feb 15, 2026)
  - 4 Principal Decisions (Feb 16, 2026)
  - METATRON_v10.5_COMPREHENSIVE_OUTLINE.md (GitHub)
  - SENTINEL_STACK_v1.0.md (GitHub)
  - Gap Inventory (28 items, prioritized)
  - Enhancement Backlog (53 items, tiered)
UNVERIFIED: 0
GENERATED WITHOUT EVIDENCE: 0
MODE: ADMINISTRATIVE
AGENT: MICHA (CIO)
TIMESTAMP: 2026-02-16T02:00:00Z
```

---

🔧 **BUILD SEQUENCE v10.5 — LOCKED**
**Protocols first. Wire second. Ship third.**

🔱 METATRON v10.5 | Uriel Covenant AI Collective | Ashes2Echoes, LLC

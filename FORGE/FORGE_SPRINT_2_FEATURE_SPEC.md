# FORGE Sprint 2 — Feature Specification
## "From Scorecard to Tutor"
### Version 1.0 | April 10, 2026
### Prepared by MICHA, CIO, Uriel Covenant AI Collective

---

## Executive Summary

Sprint 1 delivered the ANVIL scoring engine (12 dimensions), CIL consensus toggle (fully wired, 8-hop chain verified), ASSAY backend on n8n, and the tool.html frontend on Vercel. FORGE now grades prompts. Sprint 2 makes it teach.

The core gap: FORGE tells users their prompt scored 62/100 and that Audience is weak, but it does not help them fix it. Sprint 2 closes this gap with four features: Intent Capture, Guided Remediation, AUTOPSY Mode, and Visual Diff.

---

## Sprint 2 Scope

**Duration:** 2 weeks
**Depends on:** Sprint 1 complete (verified April 10, 2026)
**Delivers:** 4 features across frontend and backend

---

## Feature 1: Intent Capture (Pre-Score Gate)

### Problem

FORGE scores a prompt without knowing what it's supposed to produce. A prompt for a blog post has different quality criteria than a prompt for a trading thesis or a code review. Without intent, scoring is generic.

### Solution

Before ANVIL scoring begins, FORGE presents a single question:

**"What do you need this prompt to produce?"**

Options (single select):

- Analysis / Research
- Decision / Recommendation
- Creative Content (blog, article, narrative)
- Technical Output (code, config, architecture)
- Communication (email, memo, pitch)
- Extraction / Summary
- Custom (free text)

### Backend Changes

- New field in FORGE INTAKE webhook payload: `intent_type`
- ASSAY scorer prompt updated: "The user intends this prompt to produce a {intent_type}. Weight dimensions accordingly."
- Dimension weighting matrix:

| Intent | Boosted Dimensions | Reduced Dimensions |
|--------|-------------------|-------------------|
| Analysis | Evidence, Counter-Thesis, Domain Precision | Audience Cal., Iteration |
| Decision | Counter-Thesis, Verification, Constraints | Role, Output Format |
| Creative | Audience, Role, Output Format | Verification, Evidence |
| Technical | Constraints, Output Format, Domain Precision | Audience, Role |
| Communication | Audience, Audience Cal., Role | Evidence, Counter-Thesis |
| Extraction | Output Format, Constraints, Verification | Role, Counter-Thesis |

### Frontend Changes

- New modal or inline card appears before Execute button is active
- User selects intent type
- Selection displayed as badge next to character count: "54 characters | 11 words | Analysis"
- Execute button disabled until intent selected (or user clicks "Skip — score generically")

### Acceptance Criteria

1. Intent selection appears on first Execute attempt
2. Selected intent is sent to backend in payload
3. ASSAY scorer adjusts dimension weights based on intent
4. Score changes measurably between intent types for the same prompt
5. "Skip" option preserves current generic scoring behavior

---

## Feature 2: Guided Remediation (Post-Score Teaching Loop)

### Problem

After scoring, the coaching panel says "Audience scored 2/8" and provides a definition. It does not help the user fix it. The user must figure out what to add on their own. This is where 95% of users will bounce.

### Solution

For each dimension scoring below threshold (configurable, default 50%), FORGE generates 2-4 multiple choice remediation options specific to the user's prompt and intent. User selects an option, FORGE injects the improvement into the prompt, and rescores.

### Interaction Flow

```
USER PROMPT: "What are the biggest risks to the US economy in 2026?"
ANVIL SCORE: 62/100

REMEDIATION PANEL:

▼ Audience (2/8) — WHO is this for?
  ○ A) Policy analyst (assume economic terminology)
  ○ B) Executive briefing (bottom-line, 2-page max)
  ○ C) General reader (define all terms)
  ○ D) Let me specify: [___________]

▼ Temporal Anchoring (2/10) — WHEN matters
  ○ A) Q2-Q4 2026 only
  ○ B) 2026-2028 medium-term outlook
  ○ C) Historical comparison (2008, 2020, now)
  ○ D) Let me specify: [___________]

▼ Iteration Readiness (0/5) — How will you REFINE?
  ○ A) Add: "After your initial response, I will ask follow-up questions"
  ○ B) Add: "Provide your analysis, then list 3 areas you'd explore deeper"
  ○ C) Add: "Structure your response so I can request expansion on any section"

[APPLY SELECTIONS & RESCORE]
```

### Backend Changes

- New n8n node: REMEDIATION GENERATOR
  - Input: Original prompt, ANVIL scores, intent type
  - Process: For each weak dimension, generate 2-4 context-specific remediation options
  - Output: Array of `{dimension, score, max, options: [{label, injection_text}]}`
- New n8n node: PROMPT REBUILDER
  - Input: Original prompt + selected remediation injections
  - Process: Intelligently merge user selections into original prompt (not just append)
  - Output: Enhanced prompt for rescoring
- ASSAY scorer runs again on enhanced prompt
- Response includes both original and enhanced scores

### Frontend Changes

- Coaching panel redesigned: each weak dimension becomes an expandable card with radio options
- "Apply & Rescore" button at bottom of remediation panel
- After rescore: show score delta (e.g., "62 → 78 (+16)")
- Prompt text area updates with enhanced version, changes highlighted
- User can edit the enhanced prompt manually before accepting
- History rail (left side): shows each iteration as a numbered step (v1: 62, v2: 78, etc.)

### Acceptance Criteria

1. Dimensions below 50% generate remediation options
2. Options are specific to the prompt content, not generic definitions
3. Selecting options and rescoring produces measurably higher scores
4. Enhanced prompt is editable before final acceptance
5. Score history shows all iterations
6. Minimum 2, maximum 4 options per weak dimension
7. "Let me specify" free text option available on every dimension

---

## Feature 3: AUTOPSY Mode

### Problem

Users often know they got a bad response from an AI but don't know why. FORGE currently only evaluates prompts before execution. AUTOPSY evaluates prompt-response pairs after execution to diagnose what went wrong.

### Solution

New mode toggle: ANVIL (pre-score) | ASSAY (pre-score + CIL) | AUTOPSY (post-mortem)

In AUTOPSY mode, user pastes two things:
1. The prompt they used
2. The response they received

FORGE analyzes the gap between what the prompt asked for and what the model produced, then identifies which prompt weaknesses caused the failures in the response.

### Interaction Flow

```
MODE: AUTOPSY

PROMPT FIELD: [paste your prompt]
RESPONSE FIELD: [paste the AI response you got]

[ANALYZE]

AUTOPSY REPORT:

DIAGNOSIS: Response drifted from analytical to promotional tone
ROOT CAUSE: No Role specified (scored 0/11). Model defaulted to
            helpful-assistant persona which biases toward positive framing.
FIX: Add "You are a skeptical economic analyst. Present risks
     without softening or hedging."

DIAGNOSIS: Response listed 5 generic risks (inflation, debt, trade)
ROOT CAUSE: No Domain Precision (scored 1/10). Prompt didn't specify
            which economic frameworks, data sources, or risk categories.
FIX: Add "Focus on: sovereign debt trajectory, labor market structural
     shifts, and energy supply chain disruption. Use CBO and Fed data."

PROMPT QUALITY: 34/100
RESPONSE QUALITY: 41/100
GAP ANALYSIS: Response actually exceeded prompt quality because the model
              compensated with its own structure. A better prompt would have
              produced a significantly better response.

[REBUILD PROMPT] → sends to ANVIL mode with fixes pre-applied
```

### Backend Changes

- New n8n node: AUTOPSY ANALYZER
  - Input: prompt + response pair
  - Process: Score the prompt (standard ANVIL), evaluate response quality, map response failures to prompt weaknesses
  - Output: Diagnosis array with root causes and fixes
- AUTOPSY uses the same 12 dimensions but evaluates them through the lens of "what damage did this weakness cause in the actual response"
- CIL toggle available in AUTOPSY: when enabled, multiple agents evaluate the prompt-response pair independently

### Frontend Changes

- Mode selector: three-position toggle (ANVIL | ASSAY | AUTOPSY)
- AUTOPSY mode shows split text areas: prompt (left), response (right)
- Results panel: diagnosis cards with severity indicators
- "Rebuild Prompt" button transfers diagnosed prompt to ANVIL mode with fixes pre-injected
- Response quality score shown alongside prompt quality score

### Acceptance Criteria

1. AUTOPSY mode accepts prompt + response pair
2. Diagnosis identifies specific response failures
3. Each diagnosis maps to a prompt dimension weakness
4. Fixes are specific and actionable, not generic advice
5. "Rebuild Prompt" transfers to ANVIL with fixes applied
6. CIL toggle works in AUTOPSY mode

---

## Feature 4: Visual Diff

### Problem

After remediation or AUTOPSY rebuild, the user can't easily see what changed in their prompt or how it affected scores. The improvement is invisible.

### Solution

Side-by-side or inline diff showing original vs. enhanced prompt with score overlay.

### Display Modes

**Inline Diff:**
```
What are the biggest risks to the US economy in 2026?
+ You are a skeptical economic analyst presenting to a policy team.
+ Focus on sovereign debt trajectory, labor market structural shifts,
+ and energy supply chain disruption using CBO and Fed data.
+ Provide quantitative evidence for each risk with confidence levels.
+ After your initial analysis, identify the strongest counter-argument
+ to your top risk assessment.
```

**Score Overlay:**
```
BEFORE          AFTER           DELTA
Context    6    Context    8    +2
Role       11   Role       11   —
Audience   2    Audience   7    +5 ▲
Evidence   7    Evidence   9    +2
Counter    10   Counter    10   —
Iteration  0    Iteration  4    +4 ▲
────────────────────────────────────
TOTAL      62   TOTAL      81   +19
```

### Frontend Changes

- Diff panel appears after any rescore event
- Toggle between inline diff and side-by-side views
- Score delta table with arrow indicators for improved dimensions
- Animated score bar transition (old score → new score)
- Copy button for enhanced prompt
- Export button: downloads prompt + scores + diff as markdown

### Backend Changes

- Output formatter includes `original_prompt`, `enhanced_prompt`, `original_scores`, `enhanced_scores` in response JSON
- Diff computation happens client-side (no backend needed)

### Acceptance Criteria

1. Diff shows additions in green, deletions in red
2. Score delta table shows all 12 dimensions
3. Improved dimensions are visually highlighted
4. Copy and export buttons functional
5. Diff renders correctly on mobile

---

## CIL Integration Enhancement

### Current State (Verified April 10, 2026)

The CIL toggle is fully wired across 8 hops. When enabled, the prompt is sent to the CIL v6.1 workflow where multiple agents (URIEL, COLOSSUS, HANIEL, RAZIEL) evaluate it. A consensus score returns and displays in the backend response panel.

### Sprint 2 Enhancement

- Show ANVIL score AND CIL consensus score side-by-side when CIL is enabled
- If CIL consensus diverges from ANVIL by more than 15 points, flag it: "Agents disagree — expand to see why"
- Agent-specific feedback surfaced in coaching panel:
  - URIEL: factual grounding assessment
  - COLOSSUS: structural logic assessment
  - RAZIEL: counter-thesis challenge
  - HANIEL: data quality assessment
- CIL available in all three modes (ANVIL, ASSAY, AUTOPSY)

---

## Technical Architecture

### New n8n Nodes (Sprint 2)

| Node | Input | Output | Trigger |
|------|-------|--------|---------|
| INTENT ROUTER | intent_type from frontend | Weighted dimension config | Before ASSAY scorer |
| REMEDIATION GENERATOR | ANVIL scores + prompt + intent | Remediation options array | After ASSAY scorer, if any dimension < 50% |
| PROMPT REBUILDER | Original prompt + selected options | Enhanced prompt | User selection via webhook callback |
| AUTOPSY ANALYZER | Prompt + response pair | Diagnosis array | AUTOPSY mode Execute |

### Frontend Components (Sprint 2)

| Component | Location | Function |
|-----------|----------|----------|
| Intent Selector | Above prompt area | Pre-score intent capture |
| Mode Toggle | Header bar | ANVIL / ASSAY / AUTOPSY switch |
| Remediation Cards | Coaching panel | Expandable dimension fixers with radio options |
| Response Field | Main area (AUTOPSY only) | Paste field for AI response |
| Diff Panel | Below prompt area | Inline/side-by-side prompt comparison |
| Score History Rail | Left sidebar | Iteration tracking (v1, v2, v3...) |
| Agent Feedback | Coaching panel (CIL on) | Per-agent assessment cards |

### API Contract Changes

**Execute Request (enhanced):**
```json
{
  "prompt": "string",
  "intent_type": "analysis|decision|creative|technical|communication|extraction|custom",
  "execute_via_cil": true,
  "mode": "anvil|assay|autopsy",
  "response_text": "string (AUTOPSY only)",
  "remediation_selections": [
    {"dimension": "audience", "option_index": 2}
  ],
  "iteration": 1
}
```

**Execute Response (enhanced):**
```json
{
  "anvil_score": 62,
  "cil_consensus": 78,
  "cil_divergence": 16,
  "dimensions": [...],
  "remediation_options": [...],
  "agent_feedback": {
    "uriel": "...",
    "colossus": "...",
    "raziel": "...",
    "haniel": "..."
  },
  "enhanced_prompt": "string (after remediation)",
  "original_prompt": "string",
  "original_scores": {...},
  "diagnosis": [...] // AUTOPSY only
}
```

---

## Success Metrics

| Metric | Sprint 1 Baseline | Sprint 2 Target |
|--------|-------------------|-----------------|
| Average score improvement per session | 0 (no remediation) | +15 points |
| Remediation engagement rate | N/A | 60% of users try at least one fix |
| AUTOPSY mode usage | N/A | 20% of sessions |
| CIL toggle usage | Unknown | 30% of sessions |
| Average iterations per session | 1 | 2.5 |
| Prompt reuse (copy/export) | 0 | 40% of sessions |

---

## Implementation Priority

**Week 1:**
1. Intent Capture (frontend + backend) — smallest scope, highest impact on scoring accuracy
2. Visual Diff (frontend only) — no backend changes, immediate UX improvement
3. CIL enhancement — surface agent feedback in existing coaching panel

**Week 2:**
4. Guided Remediation (full stack) — the big build, requires REMEDIATION GENERATOR + PROMPT REBUILDER + frontend cards + rescore loop
5. AUTOPSY Mode (full stack) — new mode, new analyzer node, new frontend layout

---

## Dependencies

- n8n Cloud plan must support additional webhook endpoints (verify node limits)
- CIL v6.1 must remain active and responsive (current latency unknown under load)
- Vercel deployment auto-pulls from forge-landing repo main branch
- No new API keys required
- No new external services required

---

## What This Delivers for A2E

FORGE moves from "prompt grader" to "prompt engineering platform." The competitive moat deepens:

1. **No competitor does pre-execution consensus validation.** CIL toggle is unique.
2. **No competitor does guided remediation with rescore.** Everyone else gives advice. FORGE gives tools.
3. **No competitor does AUTOPSY.** Post-mortem prompt diagnosis is an unserved market.
4. **No competitor teaches.** FORGE makes users better at prompting. Every other tool makes users dependent on the tool.

The teaching loop (score → diagnose → fix → rescore → learn) is the product. Everything else is infrastructure.

---

*© 2026 Ashes2Echoes, LLC. All rights reserved.*
*FORGE, ANVIL, ASSAY, and AUTOPSY are proprietary modes of Ashes2Echoes, LLC.*
*Prepared by MICHA, CIO, Uriel Covenant AI Collective.*

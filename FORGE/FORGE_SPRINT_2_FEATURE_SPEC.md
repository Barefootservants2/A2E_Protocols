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

## Feature 5: Drift Interceptor

### Problem

FORGE watches AI output for quality issues. Nobody watches the USER for drift. A user starts a prompt engineering session for "US Economic Risk Analysis," then asks "what's the wash sale rule?" or "check silver price." That tangent burns context, contaminates the session, and can cause the AI to blend topics in subsequent responses — the exact hallucination vector METATRON's 62 drift indicators are designed to catch on the agent side.

The same discipline we enforce on HUNTER (stay on thesis, park tangents, come back with fresh context) should apply to every FORGE user.

### Solution

Every FORGE session has a declared intent (Feature 1). The Drift Interceptor monitors user input against that intent. When input diverges from the session's purpose, FORGE intercepts before processing:

### Interaction Flow

```
SESSION INTENT: Analysis — US Economic Risks 2026
ITERATION: v2 (score 78/100, remediation in progress)

USER TYPES: "what are wash sale rules for silver ETFs?"

┌─────────────────────────────────────────────────┐
│  ⚡ DRIFT DETECTED                              │
│                                                 │
│  Your current session is focused on:            │
│  "Analysis — US Economic Risks 2026"            │
│                                                 │
│  This question appears unrelated. What do       │
│  you want to do?                                │
│                                                 │
│  ○ A) Park it — save to Inquiry Queue for later │
│  ○ B) Quick answer — respond and return here    │
│  ○ C) Switch focus — abandon current session    │
│  ○ D) It's related — continue (I know what      │
│       I'm doing)                                │
│                                                 │
│  [Your prompt session is preserved either way]  │
└─────────────────────────────────────────────────┘
```

**Option A (Park it):** Question saved to Inquiry Queue sidebar. Session continues undisturbed. User reviews parked questions at session end.

**Option B (Quick answer):** FORGE sends the tangent question to a separate, isolated AI call (not the session context). Returns a brief answer in a dismissible card. Session prompt and scores are untouched.

**Option C (Switch focus):** Current session state saved to Session History. New session starts with the tangent as the prompt. User can return to saved session later.

**Option D (Override):** FORGE accepts the input into the current session. No interception. User maintains control. But FORGE logs it as a user-override drift event for the session report.

### Drift Detection Logic

The interceptor does NOT use keyword matching (too brittle). It uses semantic similarity between the declared intent and the new input:

1. Session intent stored as embedding vector at session start
2. Each user input embedded and compared via cosine similarity
3. Threshold: similarity < 0.4 = DRIFT DETECTED, 0.4-0.6 = BORDERLINE (no intercept, but flag in sidebar), > 0.6 = ON TOPIC

**Lightweight alternative (if embeddings are too expensive):** Use the ASSAY scorer with a single-dimension prompt: "Does this input relate to {intent_type}: {original_prompt}? YES/NO/PARTIAL." One fast API call per input.

### Inquiry Queue

The Inquiry Queue is a persistent sidebar element that accumulates parked questions during a session:

```
INQUIRY QUEUE (3 parked)
─────────────────────────
1. "wash sale rules for silver ETFs"     [→ New Session] [✕]
2. "check PSLV price today"             [→ New Session] [✕]
3. "Naples FL cost of living vs VA"      [→ New Session] [✕]
─────────────────────────
[Export All] [Clear All]
```

Each parked item can be:
- Launched as a new FORGE session (pre-populated in prompt field)
- Dismissed individually
- Exported as a list (markdown or text)
- Cleared in bulk at session end

### Session Report

At session close (or when user exports), FORGE generates a session summary:

```
SESSION REPORT
──────────────
Intent: Analysis — US Economic Risks 2026
Duration: 14 minutes
Iterations: 3 (v1: 62 → v2: 78 → v3: 84)
CIL Consensus: 81
Drift Events: 2 (1 parked, 1 quick-answered)
Parked Inquiries: 1 remaining
Final Prompt: [copy button]
```

### Why This Matters for the Product

This is METATRON for humans. The 62 drift indicators catch AI wandering off thesis. The Drift Interceptor catches the user wandering off thesis. Together, they create a closed loop: user stays focused, AI stays focused, output quality stays high.

No competitor has this. Prompt engineering tools assume the user knows what they're doing. FORGE assumes they're human and will get distracted. That's honest. That's the product.

### Backend Changes

- New n8n node: DRIFT DETECTOR
  - Input: Current session intent + new user input
  - Process: Semantic similarity check (embedding or lightweight classifier)
  - Output: `{drift_detected: boolean, similarity_score: float, classification: "on_topic|borderline|drift"}`
- New n8n node: QUICK ANSWER (isolated)
  - Input: Tangent question only (no session context)
  - Process: Standard AI completion in isolated context
  - Output: Brief answer (max 200 words)
- Inquiry Queue stored client-side (localStorage or React state) — no backend persistence needed for MVP
- Session Report generated client-side from accumulated session data

### Frontend Changes

- Drift Interceptor modal: appears between user input and Execute when drift detected
- Inquiry Queue sidebar: collapsible panel on right side, badge count visible
- Quick Answer card: dismissible overlay, visually distinct from session content
- Session Report: generated on session close or export, downloadable as markdown
- Drift indicator in header: green dot (on topic), yellow dot (borderline detected this session), red dot (multiple drift events)

### Acceptance Criteria

1. Drift detection fires when user input similarity to intent drops below 0.4
2. All four options (Park, Quick Answer, Switch, Override) function correctly
3. Parked items appear in Inquiry Queue sidebar
4. Quick Answer returns response without contaminating session context
5. Session state preserved across all drift interception options
6. Session Report accurately reflects iterations, scores, and drift events
7. Override option logs drift event but does not block the user
8. Drift detection does NOT fire on remediation selections or system interactions

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
| DRIFT DETECTOR | Session intent + new user input | Drift classification + similarity score | Every user input before Execute |
| QUICK ANSWER | Tangent question (isolated) | Brief answer (max 200 words) | User selects "Quick answer" on drift intercept |

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
| Drift Interceptor Modal | Center overlay | Intercept off-topic input with 4 options |
| Inquiry Queue | Right sidebar (collapsible) | Parked questions list with actions |
| Quick Answer Card | Dismissible overlay | Isolated tangent response |
| Session Report | Export/close modal | Summary of session iterations, scores, drift events |
| Drift Indicator | Header bar | Green/yellow/red dot showing session focus status |

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
  "iteration": 1,
  "session_intent_text": "string (original prompt that established intent)",
  "drift_check": true
}
```

**Drift Check Response (pre-Execute):**
```json
{
  "drift_detected": true,
  "similarity_score": 0.23,
  "classification": "drift",
  "session_intent": "Analysis — US Economic Risks 2026",
  "input_summary": "wash sale rules for silver ETFs"
}
```

**Quick Answer Response (isolated):**
```json
{
  "quick_answer": "string (max 200 words)",
  "source_isolated": true,
  "session_contamination": false
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
  "diagnosis": [...],
  "session_meta": {
    "iteration": 2,
    "drift_events": 1,
    "parked_inquiries": 3,
    "focus_status": "on_topic"
  }
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
| Drift interceptions per session | N/A | 0.5 avg (not every session drifts) |
| Park rate (vs dismiss/override) | N/A | 40% of drift events parked |
| Quick Answer usage | N/A | 30% of drift events |
| Session Report exports | N/A | 25% of sessions |

---

## Implementation Priority

**Week 1:**
1. Intent Capture (frontend + backend) — smallest scope, highest impact on scoring accuracy. Also the prerequisite for Drift Interceptor.
2. Visual Diff (frontend only) — no backend changes, immediate UX improvement
3. CIL enhancement — surface agent feedback in existing coaching panel
4. Drift Interceptor MVP (frontend + backend) — drift detection + Inquiry Queue. Build alongside Intent Capture since they share the intent declaration.

**Week 2:**
5. Guided Remediation (full stack) — the big build, requires REMEDIATION GENERATOR + PROMPT REBUILDER + frontend cards + rescore loop
6. AUTOPSY Mode (full stack) — new mode, new analyzer node, new frontend layout
7. Session Report — client-side generation, export functionality
8. Quick Answer isolation — separate AI call path for tangent responses

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
5. **No competitor guards the user against their own drift.** The Drift Interceptor is METATRON for humans. AI drift detection exists (we built it). Human drift detection does not. FORGE is the first tool that keeps BOTH sides focused.

The teaching loop (score → diagnose → fix → rescore → learn) is the product. The Drift Interceptor protects that loop from the most common failure mode: the user's own wandering attention. Everything else is infrastructure.

---

*© 2026 Ashes2Echoes, LLC. All rights reserved.*
*FORGE, ANVIL, ASSAY, and AUTOPSY are proprietary modes of Ashes2Echoes, LLC.*
*Prepared by MICHA, CIO, Uriel Covenant AI Collective.*

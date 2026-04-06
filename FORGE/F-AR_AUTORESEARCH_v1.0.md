# FORGE AUTORESEARCH PROTOCOL v1.0
## Adapted from Karpathy Autoresearch Method (via @godofprompt)
## Application: Systematic prompt/skill optimization for all METATRON protocols

---

## OVERVIEW

Five-phase loop that turns any FORGE prompt or METATRON protocol section from "works sometimes" to "works 90%+ consistently." One change at a time. Score everything. Keep what works, revert what doesn't. Evidence over intuition.

---

## PHASE 1: DIAGNOSE WHY PROMPTS FAIL

**Purpose:** Identify failure patterns before attempting fixes.

**Process:**
1. Take the current prompt/skill/protocol section
2. Run it against 5 different test inputs, score each output
3. Identify failure patterns: vague instructions, missing constraints, weak output format
4. Rank failures by frequency and impact (not by how obvious they are)
5. Deliver plain-language diagnosis BEFORE suggesting any fixes

**Rules:**
- Diagnose before fixing. Never jump to solutions without evidence.
- Every failure pattern must be specific ("output misses stop-loss field" not "output is inconsistent")
- Baseline score must be established before any changes

**Output:** Baseline Score -> Failure Patterns Ranked -> Root Cause per Pattern -> Ready for Optimization

---

## PHASE 2: BUILD SCORING CHECKLIST

**Purpose:** Convert vague "good output" feelings into precise yes/no criteria.

**Process:**
1. Define what skill/prompt to improve
2. Define what a great output looks like - extract specific instincts
3. Convert every vague preference into a specific yes/no question
4. Test each question against 3 sample outputs - does it score consistently?
5. Remove any question that produces different answers on the same output
6. Deliver final 3-6 question checklist

**Rules:**
- Every question must be yes or no. No ratings, no scales.
- 3-6 questions maximum. More than 6 and the skill games the checklist.
- Each question checks one specific thing. No compound questions.
- "Is it good quality?" is BANNED. Be specific.

**Example checklist (for HUNTER output):**
1. Does the output include all 8 required data fields? (Y/N)
2. Does the counter-thesis appear before the recommendation? (Y/N)
3. Is the confidence score between 0-100 with stated basis? (Y/N)
4. Are all cited data points from the current trading week? (Y/N)
5. Does the output flag correlation risk with existing positions? (Y/N)

**Output:** Raw Preferences -> Converted Yes/No Questions -> Consistency Test -> Final Scoring Checklist

---

## PHASE 3: RUN THE AUTORESEARCH LOOP

**Purpose:** Systematically improve through controlled single-variable changes.

**Process:**
1. Take skill prompt + scoring checklist
2. Establish baseline: run the skill, score against checklist
3. Identify lowest-scoring checklist item - that's the first target
4. Make ONE specific change to address it. Nothing else.
5. Re-run and re-score. Keep the change if score improves; revert if it doesn't.
6. Repeat until the skill hits 90%+ three times in a row

**Rules:**
- One change per round. Never fix two things simultaneously.
- Every change must be logged with the reason it was tried.
- Reverted changes must be documented. They are as valuable as kept ones.
- Original skill stays untouched. Save improved version separately.

**Output:** Baseline Score -> Round-by-Round Changes -> Keep/Revert Log -> Final Improved Skill + Changelog

---

## PHASE 4: TURN CHANGELOG INTO RULES

**Purpose:** Extract permanent lessons so every future prompt starts smarter.

**Process:**
1. Take the optimization changelog from Phase 3
2. Identify patterns across KEPT changes - what types consistently improved scores?
3. Identify patterns across REVERTED changes - what consistently hurt?
4. Extract 5-10 universal rules from the patterns
5. Build a personal prompt writing guide usable before writing any new skill
6. Flag which rules are skill-specific vs. universally applicable

**Rules:**
- Rules must come from evidence in the changelog. Not general advice.
- Every rule must have a specific example from optimization history.
- Skill-specific rules kept separate from universal rules.
- Guide must be actionable in under 2 minutes before writing any prompt.

**Output:** Kept Change Patterns -> Reverted Change Patterns -> 5-10 Universal Rules -> Personal Prompt Writing Guide

---

## PHASE 5: AUTORESEARCH ANYTHING REPEATABLE

**Purpose:** Apply the loop to any recurring task, not just prompts.

**Process:**
1. Define the repeatable task to optimize
2. Define success: extract measurable outcomes from vague goals
3. Build a 3-6 question yes/no scoring checklist for this task
4. Design the iteration loop: what changes, what gets tested, what gets scored
5. Run the first 3 rounds manually to establish the pattern
6. Document the system so it runs without Principal involvement after setup

**Rules:**
- Task must be repeatable. One-off tasks cannot be autoresearched.
- Scoring checklist must be consistent across every iteration.
- Changes must be isolated: one variable at a time.
- System must be documentable so anyone or any agent can run it.

**Applicable A2E tasks:**
- HUNTER scan quality
- CIL consensus output formatting
- GABRIEL overnight watch report structure
- SENTINEL alert relevance
- IRONCLAD stop-loss execution accuracy
- METATRON protocol section clarity

**Output:** Task Definition -> Scoring Checklist -> Iteration Loop Design -> First 3 Rounds -> Repeatable System Doc

---

## INTEGRATION WITH METATRON

This protocol becomes FORGE Module F-AR (Autoresearch). Reference path:
`A2E_Protocols/FORGE/F-AR_AUTORESEARCH_v1.0.md`

Every METATRON protocol revision should run through at least Phases 1-3 before deployment.

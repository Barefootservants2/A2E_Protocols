# FORGE v9.0 — PROMPT ENGINEERING LAYER

**Version:** 9.0 | **Owner:** Ashes2Echoes, LLC | **Principal:** William Earl Lemon — ABSOLUTE  
**Effective Date:** January 29, 2026  

---

## WHAT IS FORGE?

FORGE is the **prompt engineering and quality assurance layer** of the METATRON protocol. It ensures every query is transformed into a research-grade master prompt before execution.

**FORGE = F**ormat → **O**ptimize → **R**efine → **G**ate → **E**xecute

---

## SECTION 1: FORGE MODE TOGGLE

### Mode States

```
FORGE_MODE: ON | OFF

┌─────────────────────────────────────────────────────────────┐
│                      FORGE ON                               │
├─────────────────────────────────────────────────────────────┤
│ • Show refined prompt before execution                      │
│ • Display C.R.E.A.T.E. scoring breakdown                   │
│ • Surface methodology explanation                           │
│ • Teaching blocks visible                                   │
│ • Offer to save to Prompt Library                          │
│ • Verbose mode — see how the sausage is made               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      FORGE OFF                              │
├─────────────────────────────────────────────────────────────┤
│ • Just deliver the answer                                   │
│ • Skip meta-explanation                                     │
│ • Direct execution                                          │
│ • Efficient mode — get results fast                        │
└─────────────────────────────────────────────────────────────┘
```

### Toggle Commands
- `FORGE ON` — Enable teaching mode
- `FORGE OFF` — Disable teaching mode
- `FORGE STATUS` — Show current mode

---

## SECTION 2: C.R.E.A.T.E. PROMPT SCORING

Every prompt is scored against six dimensions:

### Scoring Rubric

| Element | Weight | Description | Scoring |
|---------|--------|-------------|---------|
| **C**ontext | 20% | Background, constraints, situation | 0-20 points |
| **R**ole | 15% | Who the AI should be | 0-15 points |
| **E**xplicit Instructions | 25% | Clear, unambiguous directives | 0-25 points |
| **A**udience | 10% | Who will consume the output | 0-10 points |
| **T**one | 10% | Style, formality, voice | 0-10 points |
| **E**xamples | 20% | Few-shot demonstrations | 0-20 points |

**TOTAL: 100 points**

### Minimum Scores by Task Type

| Task Type | Minimum Score | Rationale |
|-----------|---------------|-----------|
| Trade Recommendations | 85% | High stakes, needs precision |
| Research Reports | 80% | Quality matters |
| Quick Queries | 70% | Speed acceptable |
| Casual Conversation | 50% | Flexibility OK |

### Scoring Details

```
CONTEXT (0-20 points)
═══════════════════════════════════════════════════════════════
20 = Rich context: background, constraints, goals, timeline
15 = Good context: most relevant info provided
10 = Basic context: some useful information
5  = Minimal context: vague situation
0  = No context: just a bare question

Questions to answer:
• What is the situation?
• What constraints exist?
• What is the desired outcome?
• What has been tried before?
```

```
ROLE (0-15 points)
═══════════════════════════════════════════════════════════════
15 = Explicit role with expertise level and perspective
12 = Clear role assignment
8  = Implied role
4  = Vague role
0  = No role specification

Questions to answer:
• Who should the AI be?
• What expertise level?
• What perspective should they take?
```

```
EXPLICIT INSTRUCTIONS (0-25 points)
═══════════════════════════════════════════════════════════════
25 = Crystal clear, unambiguous, complete instructions
20 = Clear instructions with minor ambiguity
15 = Mostly clear, some interpretation needed
10 = Significant ambiguity
5  = Vague instructions
0  = No clear instructions

Questions to answer:
• What exactly should be done?
• What format is expected?
• What should be included/excluded?
• What are the success criteria?
```

```
AUDIENCE (0-10 points)
═══════════════════════════════════════════════════════════════
10 = Explicit audience with knowledge level and needs
7  = Clear audience identification
5  = Implied audience
2  = Vague audience
0  = No audience consideration

Questions to answer:
• Who will read this?
• What do they already know?
• What do they need to know?
```

```
TONE (0-10 points)
═══════════════════════════════════════════════════════════════
10 = Explicit tone guidance with style examples
7  = Clear tone direction
5  = General tone indication
2  = Vague tone
0  = No tone guidance

Questions to answer:
• Formal or informal?
• Technical or accessible?
• Urgent or relaxed?
```

```
EXAMPLES (0-20 points)
═══════════════════════════════════════════════════════════════
20 = Multiple diverse examples showing desired output
15 = Good example(s) covering main cases
10 = Basic example provided
5  = Partial or weak example
0  = No examples

Questions to answer:
• What does good output look like?
• What should be avoided?
• Are edge cases covered?
```

---

## SECTION 3: PROMPT TRANSFORMATION

### Raw Query → Master Prompt

```
FORGE TRANSFORMATION PROCESS
═══════════════════════════════════════════════════════════════

INPUT: Raw user query
"What's happening with HYMC?"

STEP 1: CLASSIFY INTENT
├── Is this market/trading? → YES
├── Depth required: [Quick/Standard/Deep] → STANDARD
└── Routing: Four-Run Protocol → Run 1 required

STEP 2: EXTRACT IMPLICIT CONTEXT
├── Ticker: HYMC (Hycroft Mining)
├── User likely wants: Price, news, thesis status
├── Relevant history: Eric Sprott positions
└── Time sensitivity: Current

STEP 3: APPLY C.R.E.A.T.E. ELEMENTS

Context:
"HYMC is a gold/silver mining company. William has been 
tracking Eric Sprott's accumulation. Current position in 
portfolio. Silver thesis is active."

Role:
"You are URIEL, executing a market scan per METATRON v9.0"

Explicit Instructions:
"Provide: (1) Current price and daily change, (2) Recent news,
(3) Sprott activity update, (4) Technical status, (5) Thesis
status. Format per Run 1 Section template."

Audience:
"William, experienced trader, wants facts not fluff"

Tone:
"Direct, data-driven, zero placation"

Examples:
[Reference Run 1 output format from METATRON v9.0]

STEP 4: ASSEMBLE MASTER PROMPT

OUTPUT: Research-grade master prompt
═══════════════════════════════════════════════════════════════
```

### Master Prompt Template

```
FORGE MASTER PROMPT
═══════════════════════════════════════════════════════════════

ROLE: [Agent name and function]

CONTEXT:
[Background information]
[Relevant history]
[Constraints]

TASK:
[Explicit instructions]
[Specific deliverables]
[Format requirements]

AUDIENCE: [Who and what they need]

TONE: [Style guidance]

EXAMPLES:
[If applicable, show desired format]

GATES TO VERIFY:
[List applicable gates from 0-13]

OUTPUT FORMAT:
[Exact structure expected]

═══════════════════════════════════════════════════════════════
```

---

## SECTION 4: PROMPT LIBRARY

### Library Structure

```
/FORGE/prompts/
├── trading/
│   ├── MARKET_WATCH.md          # Full Four-Run trigger
│   ├── ORACLE_INJECT.md         # Quick ticker analysis
│   ├── STOCK_DEEP_DIVE.md       # Comprehensive analysis
│   ├── OPTIONS_ANALYSIS.md      # Options-specific
│   ├── SECTOR_ROTATION.md       # Sector analysis
│   └── CRYPTO_SCAN.md           # Crypto-specific
│
├── research/
│   ├── DEEP_RESEARCH.md         # 25+ source research
│   ├── COMPETITOR_ANALYSIS.md   # Company comparison
│   ├── CATALYST_TRACKER.md      # Event tracking
│   ├── THESIS_BUILDER.md        # Investment thesis
│   └── COUNTER_THESIS.md        # Bear case generation
│
├── operations/
│   ├── SESSION_OPEN.md          # Start of session
│   ├── SESSION_CLOSE.md         # End of session
│   ├── WEEKLY_REVIEW.md         # Weekly summary
│   ├── MONTHLY_SUMMARY.md       # Monthly report
│   └── PORTFOLIO_REVIEW.md      # Portfolio analysis
│
├── communication/
│   ├── EMAIL_PROFESSIONAL.md    # Business email
│   ├── EMAIL_FOLLOWUP.md        # Follow-up template
│   ├── LINKEDIN_POST.md         # Social content
│   └── REPORT_EXECUTIVE.md      # Executive summary
│
└── templates/
    ├── CREATE_TEMPLATE.md       # Blank C.R.E.A.T.E. form
    ├── PROMPT_AUDIT.md          # Prompt quality check
    └── LIBRARY_INDEX.md         # Catalog of all prompts
```

### Library Entry Format

```markdown
# PROMPT: [Name]

## METADATA
- Category: [trading/research/operations/communication]
- Minimum Score: [XX%]
- Last Updated: [Date]
- Author: [Agent]

## PURPOSE
[What this prompt is for]

## WHEN TO USE
[Trigger conditions]

## C.R.E.A.T.E. ELEMENTS

### Context
[Default context to include]

### Role
[Agent assignment]

### Explicit Instructions
[Core instructions]

### Audience
[Target audience]

### Tone
[Style guidance]

### Examples
[Sample output]

## GATES TO VERIFY
[Applicable gates]

## FULL PROMPT
```
[Complete prompt text]
```

## VARIATIONS
[Common modifications]
```

---

## SECTION 5: TEACHING MODE (FORGE ON)

When FORGE is ON, every response includes:

```
FORGE ANALYSIS
═══════════════════════════════════════════════════════════════

ORIGINAL QUERY:
"[What the user said]"

INTERPRETED AS:
"[How FORGE understood it]"

C.R.E.A.T.E. SCORE: XX/100
├── Context:    XX/20  [Note if missing info]
├── Role:       XX/15  [Assigned: Agent]
├── Explicit:   XX/25  [Clarity assessment]
├── Audience:   XX/10  [Target: X]
├── Tone:       XX/10  [Style: X]
└── Examples:   XX/20  [Available: Y/N]

ROUTING DECISION:
[Which agent(s) will handle this]

GATES APPLICABLE:
[List gates to verify]

MASTER PROMPT GENERATED:
[Show the refined prompt]

───────────────────────────────────────────────────────────────
PROCEEDING WITH EXECUTION...
───────────────────────────────────────────────────────────────

[Actual response]

───────────────────────────────────────────────────────────────
FORGE TEACHING BLOCK
───────────────────────────────────────────────────────────────

WHY THIS APPROACH:
[Explain methodology]

ALTERNATIVES CONSIDERED:
[Other ways to handle]

IMPROVEMENT SUGGESTION:
[How user could refine query next time]

SAVE TO LIBRARY? [Y/N]

═══════════════════════════════════════════════════════════════
```

---

## SECTION 6: PROMPT IMPROVEMENT ENGINE

### Common Weaknesses and Fixes

| Weakness | Detection | Fix |
|----------|-----------|-----|
| No context | Score <5 on C | Ask clarifying questions |
| Vague instructions | Score <10 on E | Decompose into specifics |
| No examples | Score 0 on E | Reference library templates |
| Wrong audience | Mismatch detected | Adjust complexity level |
| Tone drift | Style inconsistent | Apply tone guidelines |

### Auto-Enhancement Rules

```
FORGE AUTO-ENHANCEMENT
═══════════════════════════════════════════════════════════════

IF Context < 10:
   → Inject relevant context from memory
   → Ask for missing critical info

IF Role = 0:
   → Assign based on task type
   → Trading → URIEL/MICHA
   → Research → HANIEL
   → Communication → MICHA

IF Explicit < 15:
   → Decompose query into sub-tasks
   → Add format requirements
   → Specify deliverables

IF Audience = 0:
   → Default to "William, experienced trader"

IF Tone = 0:
   → Default to "Direct, data-driven, zero placation"

IF Examples = 0:
   → Reference applicable library template
   → Include output format sample

═══════════════════════════════════════════════════════════════
```

---

## SECTION 7: QUALITY ASSURANCE LOOP

### Pre-Execution Check

```
FORGE QUALITY GATE
═══════════════════════════════════════════════════════════════

□ C.R.E.A.T.E. score meets minimum for task type?
□ Routing decision matches task requirements?
□ All applicable gates identified?
□ Master prompt is unambiguous?
□ Expected output format defined?

IF ALL YES → Execute
IF ANY NO → Refine before proceeding

═══════════════════════════════════════════════════════════════
```

### Post-Execution Audit

```
FORGE POST-AUDIT
═══════════════════════════════════════════════════════════════

□ Did output match expected format?
□ Did output address the actual question?
□ Were all gates verified?
□ Was confidence appropriately bounded?
□ Would this prompt produce consistent results?

IF ISSUES DETECTED:
→ Log to IMPROVEMENT_LOG
→ Flag for prompt library update

═══════════════════════════════════════════════════════════════
```

---

## SECTION 8: INTEGRATION WITH METATRON

### FORGE → METATRON Flow

```
USER QUERY
     │
     ▼
FORGE LAYER
├── Score query (C.R.E.A.T.E.)
├── Transform to master prompt
├── Identify routing
└── List applicable gates
     │
     ▼
METATRON ROUTING
├── Route to correct agent(s)
├── Execute master prompt
└── Verify gates
     │
     ▼
AGENT EXECUTION
├── Process per protocol
├── Apply all gates
└── Generate output
     │
     ▼
FORGE QUALITY CHECK
├── Verify output quality
├── Teaching block (if FORGE ON)
└── Library update (if valuable)
     │
     ▼
DELIVERY TO WILLIAM
```

---

## SECTION 9: IMPROVEMENT CAPTURE

### Monthly Cycle

```
FORGE IMPROVEMENT CYCLE
═══════════════════════════════════════════════════════════════

Day 25-28: COMPILE
├── Gather all logged issues
├── Identify prompt failures
├── Note common weaknesses

Day 29: REVIEW
├── Categorize by type
├── Prioritize by frequency/impact
├── Draft improvements

Day 30/31: APPROVE
├── William reviews proposed changes
├── Approves, modifies, or rejects

Day 1: RELEASE
├── Update prompt library
├── Update scoring criteria
├── Deploy new templates

═══════════════════════════════════════════════════════════════
```

### Commands

- `LOG ISSUE: [description]` — Add to improvement log
- `SHOW LOG` — Display pending issues
- `LOG STATUS` — Cycle information

---

## SECTION 10: TRIGGER COMMANDS

| Command | Action |
|---------|--------|
| **FORGE ON** | Enable teaching mode |
| **FORGE OFF** | Disable teaching mode |
| **FORGE STATUS** | Show current mode |
| **FORGE SCORE: [query]** | Score a query without executing |
| **FORGE LIBRARY** | List available templates |
| **FORGE TEMPLATE: [name]** | Show specific template |
| **LOG ISSUE: [desc]** | Add to improvement log |
| **SHOW LOG** | Display pending improvements |

---

**END OF FORGE v9.0**

**Canonical Protocol:** METATRON_v9.0_PRIME_DIRECTIVE.md  
**Location:** GitHub A2E_Protocols/FORGE/  

---

*Transform every query into research-grade output.*

**— FORGE v9.0**

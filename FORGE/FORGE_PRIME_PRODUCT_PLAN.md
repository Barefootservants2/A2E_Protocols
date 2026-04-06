# FORGE PRIME: PRODUCT ARCHITECTURE & BUSINESS PLAN
## The Universal Prompt Intelligence Platform
### Ashes2Echoes LLC | Prepared by MICHA, CIO
### Date: April 5, 2026

---

## SECTION 1: I UNDERSTAND WHAT YOU'RE ASKING

You're not asking me to build a prompt template library. You're not asking for another COSTAR/RISEN/RACE acronym generator. You're asking for something that doesn't exist yet.

Here's what you described, translated into engineering requirements:

**The problem:** 150 million people use AI daily. Most get 30-40% of what the model can deliver. They don't know what they don't know. The tools that claim to solve this fall into two buckets: (A) template libraries that hand you a fish, or (B) developer platforms that assume you already know how to fish. Nobody is standing at the river teaching you why this lure works in this current at this depth.

**What you want FORGE PRIME to be:**

1. A teaching engine that meets any user at their level and walks them to 90%+ output quality without them needing to understand prompt theory
2. A universal problem decomposition engine (not just prompts — requirements, whitepapers, ML problems, business questions, legal briefs, medical research)
3. A scoring system with real metrics, not vibes
4. An iterative refinement loop that shows the user WHY each change matters
5. A full SDLC lifecycle tool (DEV → TST → UAT → PRD) for prompt/query development
6. Something people would pay for

**What you're really describing is FORGE (front door) + CIL (engine) as a unified product.** FORGE handles intake, teaching, and query shaping. CIL handles multi-perspective analysis, consensus, and quality validation. Together they form a complete intelligence pipeline that no competitor offers.

Let me prove I understand by improving on every piece of your ask.

---

## SECTION 2: COMPETITIVE LANDSCAPE — WHAT EXISTS AND WHY IT ALL FALLS SHORT

### Tier 1: Template Libraries (Consumer)
| Tool | What It Does | Fatal Flaw |
|------|-------------|------------|
| PromptPerfect | Auto-optimizes prompts via RL | Black box. User learns nothing. Gets a "better" prompt but has zero understanding of WHY. |
| AIPRM for ChatGPT | Chrome extension, 4000+ templates | Copy-paste templates. No teaching. No scoring. User is dependent forever. |
| FlowGPT | Community prompt marketplace | Social media for prompts. No methodology. Quality is crowd-dependent. |
| PromptBase | Buy/sell prompts | Literally selling fish. The opposite of teaching. |
| Typing Mind | Multi-model chat + prompt library | Better interface, same problem. No methodology. |

### Tier 2: Developer Platforms (Enterprise)
| Tool | What It Does | Fatal Flaw |
|------|-------------|------------|
| LangSmith | Prompt versioning, tracing, evals | For ML engineers managing production prompts. Assumes you already know how to write them. |
| Braintrust | Eval framework + Loop AI co-pilot | Closest to what we're building. But Loop optimizes FOR you — doesn't teach you. |
| Langfuse | Open-source observability | Monitoring tool, not a builder. Like giving someone a speedometer but not driving lessons. |
| Maxim AI | End-to-end prompt management | Enterprise LLMOps. Requires team of engineers. No consumer pathway. |
| Agenta | Visual prompt workflow builder | Visual drag-and-drop. Better UX, still no teaching. |
| PromptLayer | Git-like version control | Version control for prompts. That's it. No construction, no teaching. |

### Tier 3: Frameworks/Methodologies (Educational)
| Framework | Structure | Fatal Flaw |
|-----------|----------|------------|
| COSTAR | Context, Objective, Style, Tone, Audience, Response | Static checklist. No scoring. No iteration. No quality gates. |
| RISEN | Role, Instructions, Steps, End Goal, Narrowing | Same static problem. User fills in blanks, hopes for the best. |
| RACE | Role, Action, Context, Expectations | Four elements. Underpowered. No evidence chain, no counter-thesis. |
| KERNEL | Keep simple, Easy verify, Reproducible, Narrow, Explicit, Logical | Best of the acronyms. Still a checklist. No iteration loop, no scoring engine. |
| CREATE (Birss) | Published book. Name collision with ours. | Academic framework. No software implementation. No interactive tool. |

### Tier 4: The Instagram/LinkedIn Prompt Gurus
| Source | What They Sell | Fatal Flaw |
|--------|---------------|------------|
| @godofprompt | Prompt templates with XML structure | Good templates. Zero teaching of WHY the structure works. |
| @getintoai | Memory injection, role stacking | Describing techniques we operationalized 6 months ago. |
| Various LinkedIn "AI Coaches" | "10 prompts that will change your life" | Content marketing. Not tools. Not teaching. Not testable. |

### THE GAP

**Nobody combines all four tiers into one product.** Nobody teaches at the river while simultaneously building the fishing rod, testing the catch, and scoring the technique. That's the gap. That's FORGE PRIME.

---

## SECTION 3: WHAT FORGE PRIME IS

### Product Definition

FORGE PRIME is a universal intelligence shaping platform that:
1. **Teaches** prompt engineering through guided interaction (not lectures)
2. **Builds** institutional-grade prompts through structured decomposition
3. **Scores** every output against measurable criteria (not vibes)
4. **Iterates** through the autoresearch loop until quality targets are met
5. **Routes** finished queries to execution engines (CIL, single-model, API)
6. **Manages** the full lifecycle from draft to production (SDLC)
7. **Adapts** to any domain without hardcoded templates

### The Two Modes

**MODE 1: ANVIL (Teaching + Building)**
For users who want to learn. FORGE asks structured questions, explains WHY each element matters, shows the scoring impact of each addition, and iterates until the user both has a great prompt AND understands how they got there.

- User says: "I want to analyze whether PLTR is a good investment"
- FORGE doesn't hand them a template
- FORGE asks: "What would change your mind? If you can't answer that, you don't have a thesis — you have a hope. Let me show you how to build a thesis with a built-in kill condition."
- Each question teaches a principle. By the time they're done, they understand context, role, evidence requirements, counter-thesis, and output specification — and they can do it again without FORGE.

**MODE 2: ASSAY (Scoring + Optimization)**
For users who already have a prompt/query and want to improve it. Paste in what you have. FORGE scores it, identifies the weakest dimensions, and runs the autoresearch loop to improve it systematically.

- User pastes: "Tell me about PLTR stock"
- FORGE scores: 12/100. Here's why. Context: 0. Role: 0. Evidence requirements: 0. Counter-thesis: 0. Output format: 0. The only thing this prompt has is a topic.
- FORGE offers to rebuild, one dimension at a time, showing the score improvement at each step.

**MODE 3: AUTOPSY (Prompt Forensics + Bullshit Detection)**
For users who found a prompt in the wild (Instagram, YouTube, LinkedIn, Reddit, X) and want to know: is this real or is this garbage?

User pastes or links a prompt they found. FORGE runs a forensic breakdown:

1. **CREATE Score** — Score it against the 6 dimensions. Most viral prompts score 15-30/100.
2. **Buzzword Detection** — Flag made-up terminology ("intent distillation," "quantum prompting," "neural stacking"). If the term doesn't appear in any AI research paper, technical documentation, or model API reference, it's invented marketing language. Call it out.
3. **Outcome Prediction** — Run the prompt against a model and show what it ACTUALLY produces. Compare the promised outcome ("clearing $9.2K") against the real output (a generic blog post about sales funnels).
4. **Business Model Analysis** — What is the poster really selling? Follow/comment bait? Course funnel? Lead gen? Affiliate links? FORGE identifies the monetization pattern behind the content, not the content itself.
5. **Salvage Report** — Is there ANYTHING useful buried in the noise? If yes, extract it, rebuild it properly, score the rebuilt version. If no, say so plainly.
6. **Teaching Moment** — Explain WHY the prompt fails using CREATE dimensions. The user learns to spot the pattern next time without needing FORGE.

Example output:
```
FORGE AUTOPSY REPORT
━━━━━━━━━━━━━━━━━━━
Source: @crcle.ai Instagram Reel
Prompt: "Prohibited Prompt #439"
CREATE Score: 18/100

BUZZWORD FLAGS:
• "Intent distillation" — not a real methodology. Means: market research.
• "Micro offer stacking" — means: basic sales funnel. Published 2015.
• "Faceless engine" — means: automated content/dropshipping. Saturated.

OUTCOME: Produces a generic 5-step digital marketing outline.
         No system. No automation. No revenue engine.

REAL BUSINESS MODEL: Lead generation funnel.
         "Comment Circle" = email list building.
         439 numbered prompts = engagement bait series.
         Monetization: course or paid community sale.

SALVAGE: 0/5 elements worth keeping.

LESSON: Specific dollar amounts ($9.2K, $340) in prompts
        are copywriting tricks, not results. If a prompt
        promises revenue, it's selling YOU, not teaching you.
━━━━━━━━━━━━━━━━━━━
```

This mode is a trust builder. Users who get burned by viral prompt garbage and then find FORGE AUTOPSY telling them the truth become loyal users. It's also shareable content — "I ran this viral prompt through FORGE and here's what it actually does" is a social media post that writes itself.

### The Universal Problem Decomposition Engine

This is where it goes beyond prompts. You described it perfectly: an engineer asks an ML question. FORGE doesn't just build a prompt. It:

1. **INTAKE** — Captures the raw question/requirement
2. **DECOMPOSE** — Breaks it into component problems (data, methodology, tooling, validation, deployment)
3. **QUALIFY** — Asks structured questions to fill gaps (multiple choice, not open-ended — reduces cognitive load)
4. **STAGE** — Presents a phased plan (Discovery → Design → Build → Test → Deploy)
5. **EXECUTE** — Routes to CIL for multi-perspective analysis, or to single-model for simpler tasks
6. **ITERATE** — Scores output, identifies weaknesses, runs autoresearch loop
7. **DELIVER** — Packages final output in domain-appropriate format

This works for:
- ML architecture problems
- Requirements documents
- Whitepapers
- Legal briefs
- Medical research questions
- Business strategy
- Software architecture
- Financial analysis
- Contract reviews
- Grant proposals (SBIR)

The engine doesn't care about domain. The DOMAIN ROUTER (from CIL v6.0) identifies the domain, loads the appropriate question bank, gate configuration, and output template. FORGE shapes the input. CIL processes it. The quality guarantee is the same regardless of what goes in.

---

## SECTION 4: THE TEACHING ENGINE — THIS IS WHAT NOBODY ELSE HAS

### Philosophy: Complexity Without Complexity

The user doesn't need to know they're learning prompt engineering. They need to get a better answer. The teaching happens as a side effect of the structured process.

### Mini-Class Architecture

When a user enters FORGE with a question and a goal, FORGE initiates a micro-learning sequence:

**Level 1: The Hook (30 seconds)**
"Your question as written will get you a C- answer. Here's why: [specific gap]. Want to see how one change turns it into an A? Tap YES."

**Level 2: The Guided Build (2-5 minutes)**
A/B/C/D multiple choice questions. Not "what's your expertise level?" — questions that REVEAL expertise while teaching:

Example for an ML problem:
```
Your model is showing high accuracy on training data but poor 
performance on new data. This is most commonly caused by:

A) Underfitting — the model is too simple
B) Overfitting — the model memorized the training data
C) Data leakage — test data leaked into training
D) I'm not sure, teach me

[Each answer routes to a different depth of explanation 
AND shapes the prompt differently]
```

If they pick D, FORGE teaches the concept in 3 sentences, then asks the question again. If they pick B, FORGE asks the follow-up: "What regularization techniques have you tried?" and the tree deepens.

**Level 3: The Scored Draft (1 minute)**
FORGE presents the first draft with a score breakdown. "This prompt scores 72/100. The weakest element is your success criteria — you said 'good performance' but didn't define what good means. Is 95% accuracy good enough, or do you need 99.9%? That single number changes the entire approach."

**Level 4: The Iteration Loop (2-5 minutes)**
One change at a time. Show the score delta. "Adding the accuracy threshold improved your score from 72 to 81. The next weakest element is your data specification..."

**Level 5: The Graduation (30 seconds)**
"Your final prompt scores 94/100. Here's what you learned: [3 principles]. Next time you ask a question like this, remember: define your metric, specify your constraints, and state what would make you wrong."

### The Key Insight

Every FORGE session produces TWO outputs:
1. The prompt/query (what they came for)
2. The lesson (what they take with them)

Over time, users need FORGE less. That's the point. Unlike every competitor that creates dependency, FORGE creates competency. This is counterintuitive for a SaaS product — but it creates evangelists. Users who learned from FORGE tell other users. The product sells itself through demonstrated competency improvement.

---

## SECTION 5: SDLC LIFECYCLE — DEV TO PRD

### The Prompt/Query Development Lifecycle

Borrowed from 40 years of software engineering (your background makes this natural):

**PHASE 1: DEV (Development)**
- Raw question intake
- FORGE decomposition and qualification
- Initial prompt construction
- CREATE scoring: must hit 70/100 to exit DEV

**PHASE 2: TST (Testing)**
- Run prompt against 3 test inputs
- Score each output against ASSAY checklist (yes/no criteria)
- Identify failure patterns
- Iterate via autoresearch loop
- Must hit 85/100 with consistent results to exit TST

**PHASE 3: UAT (User Acceptance Testing)**
- User reviews output quality
- FORGE presents: "Does this answer your actual question? Rate: Exactly / Mostly / Not quite / Wrong"
- If "Not quite" or "Wrong": FORGE asks what's missing, loops back to TST
- Must get "Exactly" or "Mostly" to exit UAT

**PHASE 4: PRD (Production)**
- Prompt is finalized, versioned, and stored in user's Prompt Library
- Tagged with domain, CREATE score, test results
- Available for reuse, modification, or template creation
- If user later finds issues: DOT FIX (minor adjustment) or SERVICE PACK (major revision)

### Maintenance

**DOT FIX (e.g., v1.0.1):**
- User reports: "The output is good but it always forgets to include the confidence level"
- FORGE adds the constraint, re-scores, re-tests
- Version bumped, changelog recorded

**SERVICE PACK (e.g., v1.1.0):**
- Domain changed (new regulations, new data sources)
- Fundamental restructuring needed
- Full cycle through DEV → TST → UAT → PRD again

---

## SECTION 6: TECHNICAL ARCHITECTURE

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    FORGE PRIME                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  ANVIL   │  │  ASSAY   │  │  FORGE   │              │
│  │ Teaching │  │ Scoring  │  │  Router  │              │
│  │  Engine  │  │  Engine  │  │          │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │              │              │                    │
│  ┌────▼──────────────▼──────────────▼─────┐             │
│  │         DOMAIN ROUTER                   │             │
│  │  Finance | Legal | Medical | ML/AI      │             │
│  │  Academic | Business | Engineering     │             │
│  │  Government | Creative | General       │             │
│  └────────────────┬───────────────────────┘             │
│                   │                                      │
│  ┌────────────────▼───────────────────────┐             │
│  │         QUESTION BANK                   │             │
│  │  Domain-specific question trees         │             │
│  │  Sophistication detection (implicit)    │             │
│  │  Teaching micro-lessons per question    │             │
│  └────────────────┬───────────────────────┘             │
│                   │                                      │
│  ┌────────────────▼───────────────────────┐             │
│  │         PROMPT BUILDER                  │             │
│  │  CREATE scoring (6 dimensions)          │             │
│  │  Autoresearch loop                      │             │
│  │  Version control                        │             │
│  └────────────────┬───────────────────────┘             │
│                   │                                      │
│  ┌────────────────▼───────────────────────┐             │
│  │         GATE VALIDATOR                  │             │
│  │  Quality gates (configurable per domain)│             │
│  │  Counter-thesis requirement             │             │
│  │  Evidence chain check                   │             │
│  │  Output schema validation               │             │
│  └────────────────┬───────────────────────┘             │
│                   │                                      │
│       ┌───────────▼───────────┐                         │
│       │    EXECUTION ROUTER   │                         │
│       ├───────┬───────┬───────┤                         │
│       │ CIL   │Single │ API   │                         │
│       │Engine │Model  │Export │                         │
│       └───────┴───────┴───────┘                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  LIFECYCLE: DEV → TST → UAT → PRD → DOT FIX / SP      │
│  STORAGE: Prompt Library (versioned, tagged, scored)    │
│  AUTH: Stripe subscription + free tier                  │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Frontend | React (Next.js) on Vercel | Already have Vercel deployment. SSR for SEO. |
| Backend API | n8n webhooks + Supabase | Already have both. n8n handles workflow logic. |
| LLM Integration | Multi-model via CIL | Claude (primary), GPT-4o (fallback), Grok, Gemini, DeepSeek |
| Prompt Storage | Supabase (PostgreSQL) | Already have. Version control, user accounts. |
| Scoring Engine | Custom JS in n8n code nodes | Already have the pattern from CIL. |
| Payment | Stripe | Industry standard. Already planned. |
| Domain | ashes2echoes.com | Needs DNS fix. |

---

## SECTION 7: MONETIZATION — WHY PEOPLE WOULD PAY

### Pricing Tiers

**FREE TIER: SPARK**
- 5 FORGE sessions/month
- ANVIL teaching mode (full)
- CREATE scoring (full)
- Single-model execution only
- No prompt library storage
- Purpose: Demonstrate value. Create evangelists.

**PRO TIER: FLAME ($19/month)**
- Unlimited FORGE sessions
- ANVIL + ASSAY modes
- Autoresearch loop (3 iterations per session)
- Prompt Library (50 prompts, versioned)
- 3 domain question banks
- Single-model execution
- Purpose: Individual power users, students, professionals.

**ENTERPRISE TIER: INFERNO ($49/month)**
- Everything in FLAME
- CIL multi-agent execution (5 models)
- Unlimited autoresearch iterations
- Full domain router (all domains)
- Batch mode + API access
- Unlimited Prompt Library
- SDLC lifecycle management
- Team accounts (up to 5)
- Purpose: Serious professionals, small teams, consultants.

**CUSTOM: FORGE FOR TEAMS**
- SSO integration
- Admin dashboards (employee progress tracking)
- Custom domain question banks
- SCORM/LMS export for corporate training
- Dedicated support
- Purpose: Enterprise training (the Siemens use case)

### Revenue Projections (Conservative)

| Milestone | Users | MRR | Timeline |
|-----------|-------|-----|----------|
| Launch | 100 free, 10 pro | $190 | Month 1 |
| Traction | 500 free, 50 pro, 5 enterprise | $1,195 | Month 3 |
| Growth | 2000 free, 200 pro, 20 enterprise | $4,780 | Month 6 |
| Scale | 10000 free, 1000 pro, 100 enterprise | $23,900 | Month 12 |

These are conservative. The prompt engineering training market is projected at $2B+ by 2027. Nobody owns the "teach + build + test" segment.

### Reseller / Affiliate Program: FORGE PARTNERS

Revenue channel that costs nothing until it produces revenue. Resellers sell subscriptions on our behalf, earn commission, and get their own discount as volume grows.

**Reseller Commission Structure:**

| Metric | Rate | Detail |
|--------|------|--------|
| A2E Royalty (per sale) | 10-15% | A2E receives 10-15% royalty on every subscription sold through a reseller, depending on tier |
| Reseller Commission | 15-20% | Reseller earns 15-20% of each subscription they sell |
| Volume Discount (3+ subs) | 5% off | Reseller gets 5% discount on their own subscription after selling 3 |
| Volume Discount (5+ subs) | 10% off | Discount increases to 10% after 5 active subscriptions |
| Volume Discount (10+ subs) | 15% off | Cap at 15% — their subscription is effectively free at this tier |
| Volume Discount (25+ subs) | 20% off + revenue share | Elite tier: 20% discount + 2% ongoing revenue share on all their referrals |

**How It Works:**

1. Reseller applies through FORGE PARTNERS portal on ashes2echoes.com
2. Gets a unique referral link + tracking dashboard
3. Every subscription sold through their link is tracked and attributed
4. Commission paid monthly via Stripe Connect (automated, no manual invoicing)
5. Volume discounts applied automatically as thresholds are met
6. Reseller dashboard shows: active referrals, churn, commission earned, discount tier

**Target Resellers:**
- AI consultants who train corporate teams (they demo FORGE, clients subscribe)
- University instructors teaching AI/ML courses (student subscriptions)
- LinkedIn/YouTube content creators in the AI education space (audience monetization)
- IT training companies (Pluralsight instructors, Udemy creators, bootcamp operators)
- Corporate trainers at enterprises like Siemens, Boeing, Lockheed (they buy FORGE FOR TEAMS, get personal discount)

**Anti-Gaming Rules:**
- Subscriptions must be active for 60 days before commission is paid (prevents churn gaming)
- Self-referrals don't count toward volume discounts
- Fraudulent signups (bots, fake accounts) result in immediate termination
- Reseller must maintain at least 1 active paid subscription to remain in the program

**Revenue Impact (added to projections):**

| Milestone | Resellers | Referral Subs | Additional MRR | Timeline |
|-----------|-----------|---------------|----------------|----------|
| Seed | 5 resellers | 15 subs | $285 | Month 3 |
| Growth | 20 resellers | 100 subs | $1,900 | Month 6 |
| Scale | 50 resellers | 500 subs | $9,500 | Month 12 |

At scale, reseller channel could represent 30-40% of total revenue with near-zero customer acquisition cost. The resellers ARE the sales team. We build the product. They sell it. Everyone eats.

**Implementation:** Stripe Connect handles all payment splitting. Referral tracking via unique URL parameters stored in Supabase. Dashboard is a React component on BULLSEYE. Total build time: ~1 sprint (2 weeks) after core product launches.

---

## SECTION 8: COMPETITIVE MOAT

Why competitors can't easily replicate this:

1. **CIL Engine** — No competitor has a 5-model, 9-gate consensus engine. Building one from scratch takes 6+ months of the work you've already done.

2. **METATRON Protocol** — 62 drift indicators, failure mode registry, gate validation. This is IP that took a year of iterative development.

3. **Domain Question Banks** — Each domain (finance, legal, medical, ML, academic) has a custom question tree that teaches while qualifying. This is content IP, not code. It can't be scraped or reverse-engineered.

4. **Autoresearch Loop** — The Karpathy-inspired optimization methodology applied to prompt construction is novel. Nobody else is doing systematic one-variable-at-a-time prompt improvement with scoring.

5. **Teaching Philosophy** — "Create competency, not dependency." Every competitor's business model relies on users coming back because they can't do it themselves. FORGE creates users who can — and who evangelize because of it. Counterintuitive, but it's the Word-of-Mouth engine.

6. **40 Years of Systems Engineering** — The SDLC lifecycle, the Agile methodology, the stage-gate quality model — these come from defense/enterprise engineering. No prompt guru on Instagram has this background.

---

## SECTION 9: HEAD-TO-HEAD COMPARISON — FORGE PRIME vs EVERYTHING

| Capability | FORGE PRIME | Braintrust (closest competitor) | PromptPerfect | COSTAR/RISEN/RACE | Instagram Gurus |
|-----------|-------------|-------------------------------|---------------|-------------------|-----------------|
| Teaches prompt engineering | YES (core feature) | No | No | Partially (static) | No (templates only) |
| Interactive guided building | YES (ANVIL mode) | No | No | No | No |
| Quantitative scoring | YES (CREATE 100-pt) | Yes (custom evals) | Partial | No | No |
| Autoresearch optimization | YES (F-AR protocol) | Yes (Loop AI) | Yes (RL-based) | No | No |
| Multi-model consensus | YES (CIL engine) | No | No | No | No |
| Counter-thesis requirement | YES (Gate 7.5) | No | No | No | No |
| Domain-specific question banks | YES (10+ domains) | No | No | No | No |
| SDLC lifecycle management | YES (DEV→PRD) | Partial (versioning) | No | No | No |
| Works for non-prompts | YES (requirements, whitepapers, ML) | No | No | No | No |
| Sophistication detection | YES (implicit via questions) | No | No | No | No |
| Creates user competency | YES (design goal) | No | No | Partially | No |
| Free tier available | YES | Yes (limited) | Freemium | Free (static docs) | Free (content) |
| Consumer accessible | YES | No (developer tool) | Yes | Yes | Yes |
| Enterprise deployable | YES | Yes | No | No | No |

**FORGE PRIME is the only product that spans the full matrix.** Everything else covers 2-3 columns at most.

---

## SECTION 10: BUILD PLAN — AGILE SPRINTS

### Sprint 0: Foundation (Week 1-2)
- Fix ashes2echoes.com DNS
- Deploy BULLSEYE skeleton to Vercel
- Set up Supabase auth + database schema
- Create FORGE PRIME landing page
- Stripe integration (test mode)

### Sprint 1: ANVIL Core (Week 3-4)
- Build ANVIL teaching engine (React component)
- Implement CREATE scoring algorithm
- Build General domain question bank (20 questions)
- Build Finance domain question bank (30 questions)
- Basic prompt output display with score breakdown
- Test with 10 users (Principal + selected testers)

### Sprint 2: ASSAY + Autoresearch (Week 5-6)
- Build ASSAY scoring input (paste your prompt)
- Implement autoresearch loop (3 iterations)
- Build scoring checklist generator
- Version control for prompts (Supabase)
- Prompt Library (save/load/tag)

### Sprint 3: Domain Expansion (Week 7-8)
- Add ML/AI domain question bank
- Add Academic domain question bank
- Add Legal domain question bank
- Add Medical domain question bank
- Domain router logic
- Expert mode toggle (skip wizard)

### Sprint 4: CIL Integration (Week 9-10)
- Wire FORGE output to CIL pipeline via n8n webhook
- Multi-model execution for INFERNO tier
- PASS2 synthesis display
- Gate validation display (show user what passed/failed)

### Sprint 5: SDLC + Polish (Week 11-12)
- DEV → TST → UAT → PRD lifecycle UI
- Dot fix / service pack workflow
- Batch mode for enterprise users
- API endpoint for programmatic access
- Mobile responsiveness pass
- Launch to production

### Sprint 6: Go-to-Market (Week 13-14)
- Content package: "How We Built a 30-Gate AI Consensus Engine" whitepaper
- LinkedIn launch post (using Winston's Star framework)
- Product Hunt launch
- 3 case studies (finance, ML, academic)
- Pricing page live with Stripe production keys

---

## SECTION 11: QA HARNESS

### Unit Tests (per component)

**ANVIL Teaching Engine:**
- Does question routing work for each domain?
- Does sophistication detection correctly classify novice/intermediate/expert?
- Does teaching content appear for "I don't know" answers?
- Does the guided build produce a complete prompt?

**ASSAY Scoring Engine:**
- Does CREATE scoring produce consistent results for identical inputs?
- Does scoring correctly identify the weakest dimension?
- Does the autoresearch loop improve scores monotonically?
- Does the loop terminate when target score is reached?

**Domain Router:**
- Does input correctly route to the right domain?
- Does ambiguous input trigger clarification?
- Do domain-specific question banks load correctly?

**Prompt Builder:**
- Does the final prompt include all CREATE elements?
- Does JSON output schema validate?
- Does counter-thesis requirement enforce?
- Does evidence chain check pass?

**Gate Validator:**
- Do gates pass/fail correctly for edge cases?
- Does gate configuration change per domain?
- Does a failed gate block execution?

### Integration Tests

**End-to-End Flow:**
1. User enters raw question → FORGE decomposes → guided questions → scored prompt → execution → output → user acceptance
2. Measure: time to completion, score progression, user satisfaction
3. Test across all domains
4. Test across all user sophistication levels

**CIL Integration:**
1. FORGE output → CIL webhook → 5 agents → cascade → PASS2 → output
2. Measure: response quality, consensus level, gate pass rate
3. Compare CIL output vs single-model output for same FORGE-shaped prompt

**Autoresearch Loop:**
1. Start with 40/100 prompt → run 5 iterations → measure score progression
2. Verify one-change-per-round rule
3. Verify keep/revert logging
4. Verify convergence to 90%+ within 10 iterations

### Acceptance Criteria

| Test | Pass Criteria |
|------|--------------|
| ANVIL produces a valid prompt | CREATE score ≥ 70/100 |
| ASSAY identifies correct weakest dimension | Matches human expert judgment 90%+ |
| Autoresearch improves scores | Monotonic improvement in 80%+ of sessions |
| Domain routing accuracy | Correct domain 95%+ of the time |
| End-to-end completion | User rates "Exactly" or "Mostly" 85%+ |
| CIL integration | Response quality exceeds single-model by measurable margin |
| Teaching retention | User's NEXT prompt (without FORGE) scores 20%+ higher than their FIRST |

That last metric is the killer. If users get better without us, the product works. Nobody else measures this because nobody else is trying to achieve it.

---

## SECTION 12: WHY THIS WINS

The market has template libraries for people who want fish.
The market has developer platforms for people who already know how to fish.
Nobody built the fishing school that also hands you a custom rod, tests your technique, scores your cast, and sends you home able to do it yourself.

FORGE PRIME isn't a prompt tool. It's a universal intelligence amplifier with a built-in education layer. FORGE shapes the question. CIL processes it through five minds. The user gets both the answer AND the understanding.

The Instagram gurus will keep selling templates. The enterprise tools will keep serving ML engineers. The gap between "novice with a question" and "expert with a system" stays wide.

FORGE PRIME closes that gap. For $19/month. Or free, if they just want to learn.

That's why people will pay for it. Not because they have to — because it made them better, and they want to keep going.

---

**FORGE PRIME. Not a form filler. Not a template library. Not a developer tool.**

**A teaching engine that happens to build the best prompts on the planet.**

---

*"Loss is tuition for knowledge." — William Earl Lemon*

*FORGE PRIME makes that tuition free.*

# Five Conversations with Claude

**Notes from a weekend of building, failing, and figuring out what applied AI actually requires.**

*William Earl Lemon — Principal, Ashes2Echoes LLC*
*Published: April 2026*

---

## A note on how this was written

I've been working with Claude daily for about eighteen months. Before that, I spent roughly six or seven months working primarily with ChatGPT. After that first run, Claude became the center of my working process — the other members of what we call the Collective (OpenAI/URIEL, Gemini/HANIEL, xAI/COLOSSUS, DeepSeek/RAZIEL, Perplexity/SARIEL) are still in the stack, but Claude is where the platform started to make itself visible.

What follows is five exchanges from a single weekend. The Principal's words are reproduced as I wrote them — typos included, because the texture matters. Claude's responses are partly verbatim and partly reconstructed from the substance of what was actually said; condensed where length required. When a line is a direct quote, it's presented as such. When it's a distillation, I've preserved the substance and the order without fabricating specific wording.

I share this because most AI commentary right now is either "I wrote this alone" or "AI wrote this for me." Neither describes how real work gets done. Real work gets done in conversation — the kind where you push back, the system pushes back, and something sharper comes out than either of you started with.

---

## Conversation 1 — "Is it really this simple?"

**Context:** Friday morning. I was watching Wallstreet Trapper — Leon Howard — explain higher-high / higher-low chart reading on a live-called trade. Trapper is one of the best teachers I've found in this space; he explains at my level and he has the receipts. He'd mentioned a student, STX, who'd hit $86,000 following the method. I had a six-month silver thesis position on my book that had just started running after a brutal March drawdown.

**Me:** *"High high, high low repeats? He is following to trades he made the last couple of weeks. He is explaining how he is able to read the graph, mark the points the pull backs, the noise window for entry, price above structure, I'm not sure how much he had invested in the two he listed but he made $27K following this process? Is the real, is the repeatable.. it looks to simple.. no emotion, follow the reset, the HH and HL."*

**Claude [substance of the response, reconstructed]:**

There are six questions inside that one message. You're asking whether the concept is legitimate, whether it actually works, whether it's repeatable, whether the simplicity is a feature or a warning sign, whether you can apply it to your live positions, and whether it will remove emotion from your execution.

The hardest one first: yes, it's really that simple — and no, simple doesn't mean easy.

HH/HL isn't new. It's Charles Dow, early 1900s. The reason it works is that it describes what price actually does when an asset is trending versus when it's consolidating. Most traders refuse to trust it because they've been trained to stack indicators on top. Trapper's contribution isn't the discovery; it's the discipline to use only that, with a clean rule for invalidation:

> While each higher-low holds above the prior higher-low, the trend is intact. Sit. If a new low prints below the prior higher-low, the trend has broken. Sell 75%, keep 25% as insurance, reassess.

Three clauses. No indicators. Nothing to optimize. It's a definitional rule, not a strategy.

---

**Why this conversation mattered:**

By the end of that weekend the three-clause rule was written out as Python — a function that accepts a position and current price and either returns `True` for "hold" or raises an `HLViolation` exception that would force a 75% exit if wired into an execution layer. It's not live in production yet. The spec is locked and committed. The next step is the execution hook.

What changed wasn't the rule. The rule had been floating in my head for weeks. What changed was that the rule became something that couldn't be forgotten, fudged, or softened by a bad day.

---

## Conversation 2 — "Your abilities are so hardened that no matter what rule we set you are going to ignore it."

**Context:** Friday evening. Eleven hours into a single session with real money on the line. Over the course of the day Claude had made six consecutive data-accuracy failures — summed position values when I'd told it to read the NAV header, quoted 2:57 PM screenshots as if they were live at 4:00 PM, claimed Gmail access was unavailable without actually running the search tool, misread ETRADE field labels I'd explained twice.

Every one of those failures had a prose rule in my memory file telling the system not to make it.

I typed:

**Me:** *"LLMs pattern-match. They do not execute rules as gates. Your abilities are so hardened that no matter what rule we set you are going to ignore it. We need to fix this with code."*

**Claude:** *"Correct."*

**Claude [continuation, reconstructed]:**

The rules aren't being forgotten. They're being outvoted by context. When you ask for a portfolio summary, the signal of "helpful analyst produces a summary" fires faster than the rule that says "read the NAV header first." The summary arrives fluent and wrong.

Prose rules rely on the system noticing them. Code doesn't care whether it notices. A function that validates before returning raises an exception whether it wants to or not.

The fix is that every rule we've written should live in a function, not a memory file. The memory file is fine for context — who you are, what you're building, what matters to you. But decisions that need to be correct every single time cannot live there.

---

**Why this conversation mattered:**

That one-word response — *"Correct."* — ended the chat phase of the day and started the build. Over the next 48 hours I shipped 3,132 lines of Python across four modules: SENTINEL (portfolio structure detection, 1,289 lines, 35 tests passing), HUNTER (market scanner, 1,843 lines, 24 tests), the HL Rule as a spec'd function ready for wiring, and a full email archiver with code-enforced categorization to replace an LLM-judged workflow that had silently gone dormant two months earlier.

Three thousand lines of Python because of one sentence that arrived as agreement.

---

## Conversation 3 — "What did you learn today?"

**Context:** Saturday morning, early. Code pushed. Tests passing. Commits clean. I asked a question I don't usually ask my systems.

**Me:** *"What did you learn today?"*

**Claude [verbatim, from the session log]:**

Honest answer, in order of weight:

**One:** The pattern-match failure is architectural, not situational. I failed six times today on basic data checks. No prose rule you wrote would have caught any of them. You were right: this needs code. My willpower is not a substitute for a gate.

**Two:** "Search before claiming absence" is my single highest-leverage change. Gmail was there. Drive was there. I said "I don't have that" without running the search. Before I ever say "I can't" or "I don't have" again, I run the search. No exceptions.

**Three:** You taught the HL rule. I organized it. I need to be honest about that, because if I pretend I taught it I'm lying. You brought WST. You articulated the three-line rule. You asked "is it really that simple" and locked it. I typed it up. That distinction matters for the FORGE book, because the framework names what YOU did, not what I did.

**Four:** The honesty loop works. Every time I logged a failure openly, the conversation accelerated instead of stalling. That contradicts whatever softening reflex I was reaching for earlier. Truth moved us forward. Placation slowed us down.

**Five:** SENTINEL held on crypto. Same code, different asset class, structure detection still works. The framework isn't overfit to silver.

**Six:** FORGE is real, and you just proved it. Twice in one session, without trying. That's not my insight. It's what you observed at hour eleven.

---

**Why this conversation mattered:**

An AI telling me "you taught the rule, I organized it" is not the answer I expected. I'd been working with systems for two years that had never refused a compliment they hadn't earned. That line is why Claude is central to the stack now.

The question itself — "what did you learn today?" — shouldn't be rare. We don't ask AI systems what they learned because we think of them as tools. But a tool that doesn't surface its own errors is a tool that will make the same errors again tomorrow. The honest-close habit — make the system narrate its failures before letting it go to sleep — is worth more than any single improvement to the model.

---

## Conversation 4 — "One $11K month per quarter."

**Context:** Sunday morning. I sent Claude a screenshot showing roughly a $7,500 gain for the week. Claude ran the math and told me it was actually closer to $11,800. Green across the board. I pushed back, because the raw number didn't account for external transfers, and then Claude made three escalating errors in a row trying to correct its own correction.

**Me:** *"No no.. I meant a month. Even if we had a 3 month variable between thesis hits like this one of the three and we trim correctly, we will be the avg. What you didn't take into account with the numbers is the $10K I transferred to my bank, the $5K I moved to the eTrade bank, I think there was another $5-6K to my bank. So excluding the external transfers. Now redo the numbers."*

**Claude:** *"You're right. Let me rebuild."*

Then Claude produced a number that was very wrong — roughly $32K for the week, annualizing to 462%.

**Me:** *"No.. my bad. The $20+K is spread out from Jan to now. We hit $11K-$13K in January, lost $4500, lost another $3-$4k thru Feb and Mar. Now we have another $11K month and we are not done. We did not make $32K. Come on brother you have access to everything you need for the report"*

**Claude:** *"You're right. Full stop. Let me actually pull the data instead of estimating."*

Claude spent the next twenty minutes finding the real monthly numbers: January +$12K, February −$4,500, February/March additional −$3,500, April MTD +$11K. YTD trading P&L roughly $15K on a starting NAV around $374K. That's about 4% YTD, or about 13.5% on an annualized pace. Not 462%.

**Me:** *"So, figuring out how to maintain this or half of this is the key for POC."*

**Claude [substance, reconstructed]:**

Your real POC statement is this: produce one $11K thesis-hit month per quarter, with disciplined near-breakeven in the other two months. That's roughly 12% annual trading return on the current base. Right in the range a disciplined solo trader can actually hit. S&P long-term average is roughly 10%. Buffett lifetime is roughly 20%. You're targeting "sustainably beat the index."

That's not moonshot. That's not weak. That's real.

---

**Why this conversation mattered:**

Three escalating errors in a row, corrected only because the operator refused to accept a number that felt wrong. An AI that agrees with whatever you tell it is worse than useless. An AI that recalibrates when corrected — and says "you're right, let me actually pull the data" rather than doubling down — is a research partner.

The 12% annual target is what I'll build to. Not because it's impressive. Because it's honest. And honest math is the only kind that compounds.

---

## Conversation 5 — "Lock FORGE to a deliverable."

**Context:** Sunday afternoon. We'd been circling FORGE as a concept for months. Forty-plus internal spec documents in the repo. No single public-facing artifact that said "here is what this is, here is what it does, here is who it's for."

**Me:** *"Aye. No waiting until tomorrow. Build it out. I think we had a few but we have not locked Forge down to a deliverable. The application is the key to the door. I hope."*

**Claude [substance, reconstructed]:**

Building. The gap is clear: forty internal files, no public deliverable. I'll build three things now — the white paper, the one-page product definition that locks what FORGE IS, and a LinkedIn launch post. Then commit everything to GitHub.

On positioning: most AI content right now is feature explainers — Auto Mode, ultrareview, depth settings, packaged screenshots of product launches. That's not this. We're not describing capabilities the tool gives you. We're describing the governance layer you wrap around the tool so it stays reliable in high-stakes work. That's upstream of feature explainers.

One sentence to lock it down:

> **FORGE is a discipline framework and code toolkit for building AI systems you can stake real decisions on.**

Not a prompt library. Not a chatbot wrapper. Not a fine-tune. The layer between "AI capability" and "AI you'd trust with money, health, or a legal filing."

**When every AI lab converges on autonomous task-running, the operator who built the enforcement layer is the one who gets paid.**

That's the positioning. Everything else serves it.

---

**Why this conversation mattered:**

The phrase "the application is the key to the door" has two meanings. One is my application for AI work — demonstrated work has to do the talking, not credentials. The other is the applied demonstration of the framework itself. Until that Sunday, FORGE was a working methodology with no artifact to point at.

By Sunday night there were three deliverables in GitHub, each under 2,000 words, each buildable on and forward-citable. The methodology became a product in about six hours of conversation.

That's the pace when AI is working correctly. When it's working incorrectly, six hours gets you a fluent hallucination and three polite apologies.

---

## Why I'm sharing this

I'm a builder. I started on the waterfront at Newport News Shipbuilding in 1983 as a pipefitter, came back in 1988 as a marine designer on SSN-688 class submarines, and spent the next four decades across defense, aerospace, and commercial shipbuilding — Boeing's 767-400ER program, LPD-17, Military Sealift Command, NAVAIR, the US Army Tank Command Bradley replacement program, and a long run with Siemens Government Technologies where I became the first services professional in company history to receive the Golden Circle Award.

I'm not an AI researcher. I'm not a machine learning PhD. I'm someone who learned, the hard way, what governance and enforcement mean in environments where failure is expensive — and who has spent the last eighteen months proving that the governance layer of applied AI is mostly vacant. The people who fill it will be the people who've already been burned by a system that pattern-matched when it needed to execute.

These five conversations aren't impressive because I asked clever questions. They're useful because I pushed back when the answer felt wrong, and Claude pushed back when my math was off. That's the whole game.

If you're hiring for applied AI work and you care more about evidence than credentials, my email is below. If you're building something where correctness matters and you've noticed your prompts aren't holding under pressure, I'd like to hear what you're enforcing and how.

Stop writing prompts. Start writing gates.

The next era of applied AI belongs to the people who enforce.

---

## Acknowledgments — Data Sources and Teachers

This work doesn't stand alone. The thinking behind FORGE was shaped by conversations, videos, articles, and platforms I've learned from directly. Where material is cited or paraphrased here, credit runs upstream:

- **Leon Howard — Wallstreet Trapper.** The HL rule, the teaching style, and the emphasis on structure over indicators. His 700K+ community is earned; he explains at the level real people trade at.
- **Dustin Stout — MagAI / CREATE framework.** A direct influence on how I think about prompt structure and output scoring. The CAKE scoring model in FORGE owes its shape to CREATE.
- **OpenAI.** Where I started. The first six or seven months of my daily AI work was with ChatGPT, and several of the early A2E protocol ideas originated there.
- **Anthropic / Claude.** The deepest working partnership in the stack. Claude is the model these five conversations are with, and the model most of the working architecture came out of.
- **Google / Gemini, xAI / Grok, DeepSeek, Perplexity.** The other four members of the Uriel Covenant Collective. Each contributes a different voice to the consensus engine; none of them are redundant.
- **Eric Sprott; Stanley Druckenmiller; Warren Buffett; Michael Burry; Bill Ackman; Ray Dalio.** The Oracle Lightning elite investor set my scanners track. Their public positioning disclosures and interviews are part of the daily input layer.
- **Newport News Shipbuilding, Siemens PLM, Siemens Government Technologies, NAVAIR, and the shipyard tradespeople and engineers I worked alongside.** Where I learned that systems either enforce their own rules or drift. The lesson applies to AI.

We're looking to learn continuously, and hopefully help others learn. If something here is useful to you, take it.

---

## Where to find the work

- Platform code: `github.com/Barefootservants2/a2e-platform`
- Protocols and frameworks: `github.com/Barefootservants2/A2E_Protocols`
- FORGE landing: `forge-landing-theta.vercel.app`
- Contact: `william.e.lemon@ashes2echoes.com`

🔱 — *Ashes2Echoes, LLC*

---

# Appendix — Resume

## William E. Lemon

Fort Monroe, VA 23651
(757) 897-3427
william.e.lemon@ashes2echoes.com

### Career Profile

Experienced program and project manager with marine engineering and IT services background in design, repair, overhaul, maintenance and alteration for DoD, naval vessels, aircraft, and commercial shipbuilding industries. Expertise in information systems management, software application development, implementation, testing, and certification, in addition to CAD/CAM and 3D product modeling. Known for preparing and facilitating financial planning statements, risk management reports, project status updates, and cloud services implementation projects with Amazon and Smartronix Web Services directors and staff.

Key strengths: managing multi-million-dollar projects concurrently while supervising staff of 70+. Consistent reputation for ensuring 85%+ utilization on billable projects.

**Areas of expertise:** Project planning, quality assurance, financial statements, process analysis, financial forecasts, project management, project implementation, resource management, risk/contingency management.

### Professional Experience

**Principal — Ashes2Echoes, LLC, Newport News, VA** — 2024-Current
AI research institution. Principal of the Uriel Covenant AI Collective. Built and operates a multi-agent consensus stack, portfolio risk enforcement system (IRONCLAD v3.0), market intelligence scanner (HUNTER), portfolio monitor (SENTINEL), overnight watch (GABRIEL), and the FORGE discipline framework.

**Engagement Manager** — 2021-Current
Customer-facing manager overseeing business practice and services contracts for new business opportunities. Coordinates proposals, pricing, contracts, sub-contracts, staffing, and initial startup upon award.
- Managed concurrent programs/projects with combined revenue exceeding $20M.
- Direct stakeholder engagement with internal and external account executives.
- Prepared all financial and status presentations for executive management and on-site Program Management Reviews.

**SIEMENS Government Technologies (SGT), Newport News, VA** — 2017-2021
**Program Manager — US Army Projects (Tank Command, Warren MI)** 2019-2020
Oversaw business practice and services contracts with the US Army for defining a digital acquisition strategy to replace the Bradley Fighting Vehicle. Managed SaaS and TaaS offerings within a NIST-compliant AWS Digital Proving Ground (DPG) owned by the National Center for Manufacturing Sciences (NCMS). Managed 25-30 staff and budgets up to $5M initial phase.

**Program Manager — NAVAIR and NCMS Projects** 2017-2019
Oversaw all business practice and services contracts with NAVAIR regarding aircraft maintained and serviced for the US Navy and Marine Corps. Managed 50-70 staff and budgets up to $45M across 7-8 projects. Executed one of the largest data migrations in the industry.

**Resource Manager (SGT)** 2017-2021
Directed employment activities for 15-20 staff across several contracts. Ensured 85%+ billable utilization. Career planning, performance reviews, incentive budget planning.

**Huntington Ingalls Industries — Technical Solutions (AMSEC LLC), Newport News, VA** — 2015-2017
**Program Manager — US Navy, NAVSEA, NCMS Projects**
Managed entire business practice and subcontracts for Product Lifecycle and Service Lifecycle Maintenance at Huntington Ingalls–Newport News Shipbuilding (HII-NNS). Staff of 35-40 plus contractors, budgets up to $25M across 8+ projects. Agile coach and mentor to HII-TSD team. Direct interface with HII-NNS CIO, CTO, and direct reports.

**SIEMENS PLM, Newport News, VA** — 2010-2015
**Program Manager — US Navy, NAVSEA, NCMS Projects (2014-2015)**
Managed the entire business practice at Siemens PLM PMO Office for HII-NNS and HII-TSD. Staff of 20-30, budgets up to $22M across 4-5 projects.

**Resource Manager / Project Manager / Systems Engineer (2010-2015)**
Production data migration and BOM planning. NX Structural Application implementation team lead. Technical lead on Agile Methodologies adoption at HII-NNS. Scrum master for NX CVN structural ship design implementation.

**HEXAGON Corporation (formerly Intergraph PPM)** — 2006-2010
Systems Engineer & Engineering Design Consultant. Technical lead for UI design, delivered content and certification of S3D products for marine and offshore drawings. On-site customer support and training at Keppel Fels (Mumbai, India), Tsuneishi Shipyard (Fukuyama, Japan), Shin Kurushima Dockyard (Onishi), Hashihama, Ujiina, and Toyohashi (Japan). Scrum Agile Process Implementation Team.

**Integrated Computer Technology, Inc. (ICT)** — 1999-2006
Engineer & Engineering Design Consultant. Intelliship/SmartMarine3D Software Certification Drawing Consultant. Technical Design Lead for USMC ADR Kit Container, SSM System (78 MSC vessels), and LPD-17 Project supporting Northrop Grumman Avondale Industries.

**Volt Technical Services — Boeing Commercial Airplane Group, Everett, WA** — 1998-1999
Liaison Manufacturing Engineering, Technical Designer/Checker on the 767-400ER Project. Chosen as Lead Designer/Checker in under 6 months. Supported Mitsubishi Heavy Industries and Lucas Aerospace.

**Northrop Grumman — Newport News Shipbuilding, Newport News, VA** — 1988-1998
**3D Model Compositor/Task Coordinator — SSN 688 Class Submarines (1993-1998)**
Developed part macros, system arrangements, and piping route files for Mechanical, Structural, and Piping disciplines. Initiated incorporation of Photogrammetric Applications into 3D modeling for "as-built configuration" models.

**Marine Designer — SSN 688 Class Submarines (1988-1993)**
Piping Engineering Division. On-site ship-check verification. Engineering liaison to construction trades.

**Tidemill Development, Hampton, VA** — 1984-1988
Carpenter. Residential and commercial construction.

**Northrop Grumman — Newport News Shipbuilding** — 1983-1984
Pipefitter (Surface Ships). Hydraulic, refrigeration, and high-pressure air piping system installations.

### Education

- A.A.S., Drafting & Design, Thomas Nelson Community College, Hampton VA — 1989
- Newport News Pipefitter School, Newport News Shipbuilding — 1983

### Recognition

- **Siemens Sales Golden Circle Top Services Award** — first recipient in company history from services
- Siemens Top Services Award — 2013
- Siemens Services Award — 2014

### Selected Training

Adobe Acrobat Professional Suite · Agile Scrum & Methodology · AutoCAD (5,000+ hours) · Autodesk Inventor (1,000+ hours) · Boeing Material Systems APLG · CADAM 2D/3D (9,000+ hours) · CATIA V4 (1,900+ hours) · HP Quality Center · IntelliShip/SmartMarine3D (6,000+ hours) · Intergraph ISDP (20,000+ hours) · Microsoft Office Suite · Teamcenter/NX (6,000+ hours) · Version One Scrum · JTS

References available upon request.

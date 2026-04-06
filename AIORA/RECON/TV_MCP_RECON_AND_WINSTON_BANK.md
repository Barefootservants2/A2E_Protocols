# TRADINGVIEW MCP RECON REPORT
## Date: April 5, 2026

---

## TOP 3 OPTIONS (ranked by A2E fit)

### OPTION A: fiale-plus/tradingview-mcp-server (RECOMMENDED)
- **Repo:** github.com/fiale-plus/tradingview-mcp-server
- **What:** MCP server + CLI for TradingView's public screener API
- **No API key required.** Uses same public data as TradingView website without login.
- **Features:** 100+ screener fields, 18 filter operators, 14 pre-built strategies (value, growth, GARP, breakouts), 9 investor workflow commands (/due-diligence, /macro-dashboard)
- **Install:** npm based, Claude Code compatible, stdio or SSE transport
- **Why best for A2E:** No auth headaches, screener-first approach matches HUNTER's scan methodology, pre-built strategies align with Ring framework, CLI mode works for n8n webhook integration
- **Risk:** Uses public API only (no premium data), TradingView can change API without notice

### OPTION B: atilaahmettaner/tradingview-mcp
- **Repo:** github.com/atilaahmettaner/tradingview-mcp
- **What:** Full trading toolkit with backtesting, live sentiment (Reddit+RSS), Yahoo Finance data, 30+ TA tools
- **Install:** pip install tradingview-mcp-server (Python/UV)
- **Why consider:** Backtesting with Sharpe ratio, sentiment analysis, no API keys needed
- **Integration:** Supports Telegram via OpenClaw (could replace or supplement GABRIEL alerts)
- **Risk:** Newer project, broader scope may mean less depth per feature

### OPTION C: tradesdontlie/tradingview-mcp (from Girsta video)
- **Repo:** github.com/tradesdontlie/tradingview-mcp
- **What:** Connects Claude Code directly to TradingView Desktop app via Chrome DevTools Protocol
- **Requires:** TradingView Desktop running with --remote-debugging-port=9222
- **Features:** Live quote streaming, bar data, indicator values, Pine Script labels/tables, screenshot capture
- **Why consider:** This is the one from the Girsta Instagram post. Most powerful for live chart analysis.
- **Risk:** Uses undocumented internals, may violate TradingView ToS, requires TradingView Desktop (not web), Windows/Mac only (not server-deployable)

## RECOMMENDATION

Start with **Option A** (fiale-plus). It's the cleanest fit:
1. No auth complexity
2. Screener-based approach maps to HUNTER scans
3. npm install + Claude Code config = 5 minute setup
4. CLI mode enables n8n webhook integration for automated scans
5. Pre-built /due-diligence and /macro-dashboard commands ready to use

**Phase 2:** Evaluate Option B for backtesting and sentiment once Option A is proven.
**Phase 3:** Option C only if you want live chart interaction from the workstation (not for automated pipelines).

## NEXT STEPS
- [ ] Clone Option A repo on workstation
- [ ] Add to Claude Code MCP config (~/.claude/.mcp.json)
- [ ] Test with: /run-screener and /macro-dashboard
- [ ] If viable, build n8n workflow to trigger screener via CLI
- [ ] Map screener output fields to HUNTER H1-H5 data requirements

---
---

# WINSTON PITCH FRAMEWORK BANK
## Patrick Winston's MIT Communication Frameworks
## Application: SBIR pitches, investor decks, VP interviews, A2E capability briefs

---

## FRAMEWORK 1: EMPOWERMENT PROMISE (Opening Hook)

**Use for:** First 60 seconds of any presentation

**Structure:**
1. Identify the single most valuable thing the audience will walk away knowing
2. Write the empowerment promise: specific, outcome-driven, impossible to ignore
3. Design the first 60 seconds: promise + context + why this matters NOW
4. Cut everything that doesn't serve the promise (jokes, thank yous, apologies)

**Rules:**
- Never open with a joke (audience isn't ready)
- Never open with "thank you for having me" (weak and forgettable)
- Not "you'll learn about X" but "by the end you'll be able to DO Y"
- First 60 seconds must earn the next 60 minutes

**A2E Application:**
- SBIR pitch: "By the end of this brief, you'll see how a 7-agent AI collective outperforms any single-model trading system by 40% on risk-adjusted returns."
- VP interview: "In the next 5 minutes, I'll show you how 40 years of defense shipbuilding taught me to build AI systems that don't break under pressure."

---

## FRAMEWORK 2: SLIDE CRIME INVESTIGATOR (Deck Audit)

**Use for:** Auditing any presentation before delivery

**The 10 Winston Slide Crimes:**
1. Too many slides
2. Too many words per slide
3. Font size under 40pt
4. Reading slides aloud
5. Laser pointer usage
6. Speaker standing far from slides
7. No white space or air
8. Background clutter and logos
9. Collaborators list as final slide
10. "Thank you" or "Questions?" as final slide

**Rules:**
- Every crime must have a specific fix, not just a flag
- Font minimum 40pt, no exceptions
- Final slide must be CONTRIBUTIONS, never questions or thank you
- White space is breathing room for the audience's brain
- Slides are condiments, not the main event

---

## FRAMEWORK 3: WINSTON'S STAR (Making Ideas Stick)

**Use for:** Core idea development for any presentation or pitch

**Five Elements:**
1. **Symbol** - a visual or object that represents the idea instantly (must be visual and specific, not abstract)
2. **Slogan** - a short phrase that becomes the handle (must be repeatable in a meeting without explanation)
3. **Surprise** - the counterintuitive truth that makes people stop and think (must genuinely challenge an assumption)
4. **Salient Idea** - the ONE idea that sticks out above everything else (never two or three)
5. **Story** - how it works, why it matters, and the journey (personal enough to be specific, universal enough to resonate)

**A2E Application:**
- Symbol: The Metatron cube (sacred geometry = interconnected intelligence)
- Slogan: "Seven minds. One mission. Zero drift."
- Surprise: "A sole operator with no CS degree built a 7-agent AI trading collective that outperforms institutional quant desks"
- Salient Idea: AI agents governed by protocol, not hope
- Story: Transplant recovery -> cognitive rehabilitation via AI -> building the Collective -> loss as tuition -> IRONCLAD

---

## FRAMEWORK 4: JOB TALK (Vision + Proof + Contributions)

**Use for:** VP interviews, funding pitches, capability demonstrations

**Structure:**
1. Build the vision statement: the problem someone cares about + your new approach
2. Design the proof of work: specific steps that prove you've done something real
3. Structure the 5-minute opening that establishes both vision and credibility
4. Build the contributions close: final slide that mirrors the opening promise

**Rules:**
- Vision must be established within 5 minutes, never later
- Proof of work must be specific steps, not vague accomplishments
- Opening and close must mirror each other: promise made, promise kept
- Contributions slide stays up during questions, never replaced with "thank you"
- Every minute must advance either vision or proof. Nothing else.

---

## FRAMEWORK 5: PROP & STORYTELLING (Teaching Complex Ideas)

**Use for:** Sunday education sessions, client explanations, whitepaper concepts

**Structure:**
1. Identify the single most confusing aspect of the idea
2. Design a physical prop or demonstration that makes the confusion disappear
3. Build a story around the prop: tension, demonstration, resolution
4. Write the verbal script guiding attention from confusion to clarity

**Rules:**
- Prop must be physical and demonstrable, not a slide or diagram
- Story must have genuine tension before the resolution
- Script must guide attention: tell them where to look and what to notice
- Demonstration must work even if it fails (the failure itself teaches something)

**A2E Application:**
- For explaining CIL consensus: Use 7 physical cards (one per agent), each with a different "recommendation." Fan them out, show disagreement. Then stack them through the cascade gates. What comes out the other end is consensus. The physical act of filtering makes the abstraction concrete.

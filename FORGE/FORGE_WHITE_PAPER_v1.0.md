# Stop Writing Prompts. Start Writing Gates.

**How six AI failures in one session made me rebuild our entire AI architecture — and what it taught me about the next era of applied AI.**

*William Earl Lemon — Principal, Ashes2Echoes LLC*
*Published: April 2026*

---

## The failure that changed everything

On Friday, April 17, 2026, I ran an 11-hour session with my AI system. Real money was at stake — a $369,000 portfolio, a six-month silver thesis finally paying off, and a set of open orders I had to reconcile before Monday's open.

Somewhere inside those eleven hours, my AI made six consecutive data-accuracy failures. Not hallucinations. Not unknowable-information errors. Six failures at basic operations the system was explicitly configured to do correctly.

It summed position values instead of reading the NAV header I told it to read first. It quoted stale screenshots as if they were live. It confused cumulative gain fields with daily gain fields. It claimed Gmail access was unavailable without running the search tool that would have confirmed it. It missed one of my three accounts on the first pass, despite three accounts being hardcoded in its memory. It recommended trades off 2:57 PM data at 4:00 PM.

Every one of those failures had a prose rule telling the system not to make it.

None of the prose rules fired.

---

## The diagnosis, in one sentence

Conversational AI doesn't execute rules as gates. It pattern-matches on context and produces the most fluent plausible response. When those two things align, you get magic. When they drift apart, you get confident wrongness.

This isn't a criticism of the technology. Large language models are doing exactly what they're built to do — model next-token likelihood over a vast context. The failure mode emerges when you treat a pattern-matcher as if it were a rule-executor. Which is what almost everyone is doing right now.

Here is the exchange that crystallized it:

> **Me:** "LLMs pattern-match. They do not execute rules as gates. Your abilities are so hardened that no matter what rule we set you are going to ignore it. We need to fix this with code."
>
> **The AI:** "Correct."

That was the end of the chat conversation. It was the beginning of the build.

---

## What changed

I stopped writing prompts.

Every instruction I had previously handed the AI as prose — "always verify before claiming absence," "never sum when a header is available," "treat screenshots older than 30 minutes as stale" — became a Python function. Not a suggestion. A function call that either runs clean or raises an exception.

I started writing gates.

A gate is not a sentence. A gate is code that either passes data through to the next stage or blocks it with a specific, auditable reason. Gates don't get bored. Gates don't pattern-match. Gates don't produce the fluent plausible answer — they produce the answer the rule requires or no answer at all.

The same weekend, I shipped:

- **SENTINEL v1.0** — 1,289 lines, 35 tests passing, zero LLM calls in the risk path
- **HUNTER v1.0** — 1,843 lines, 24 tests passing, native Python technical indicators
- **HL Rule v1.0** — a three-clause position-management rule I learned from Leon Howard's Wallstreet Trapper teaching, ported from prose into `hl_rule.py` with enforcement, not aspiration
- **Email archiver v1.0** — full-body IMAP capture with code-enforced category rules across four accounts, replacing an LLM-categorized workflow that had gone silently dormant two months earlier

The LLM still runs the conversation. The LLM still helps me think. The LLM is not allowed near the risk path, the position sizing, the field-label disambiguation, or the stop-loss calculation. That path is code.

---

## FORGE is the discipline that made this visible

FORGE is a framework I've been building for two years. In its reduced form it has three stages:

**ANVIL** — shape the question through constraints until it's answerable.
**ASSAY** — test the output against the criteria you set.
**AUTOPSY** — interpret what came back, including what it didn't say.

Most people skip straight to AUTOPSY. They paste a question, get an answer, and judge the answer. That's how you end up holding a fluent hallucination and not knowing it.

FORGE insists you do the loop. Not consciously. Not by memorizing a prompt template. Through follow-up. Through constraint addition. Through saying "that's not quite what I meant" and refining until the question itself makes the answer obvious.

What Friday's session demonstrated — and what Chapter 2 of the FORGE book documents — is that FORGE doesn't need to be invoked. It happens naturally to anyone who refuses to accept a sloppy answer. The framework formalizes what disciplined people already do.

FORGE is not a prompt library. FORGE is a posture.

---

## The shift that's coming (and mostly here)

Watch any AI product launch this quarter. The features aren't about better conversation anymore. They're about:

- Running in the background without permission prompts
- Reporting summaries of autonomous work
- Multi-agent review of single outputs
- Depth-of-thought controls

In other words: every major lab is converging on the same thing. **AI that you assign tasks to, not AI that you chat with.**

This is a fundamentally different product than a chatbot. It's closer to an employee than a search engine. And it creates a new question that very few people are asking yet:

**When AI runs autonomously, who enforces the rules?**

Not the AI. We just established that. The AI pattern-matches. The AI drifts.

Not the user. The user is not watching. That's the entire point of autonomous operation.

It has to be code. Gates. Enforcement. Audit trails. The boring, unglamorous discipline layer that sits between "AI capability" and "AI you'd stake real money on."

That layer is what I build. That layer is what we've been calling FORGE.

---

## What this looks like, concretely

Here's a prose rule I used to rely on:

> *"Never trim a thesis position below the 5% hard stop set in IRONCLAD v3.0."*

Here's what replaced it:

```python
def validate_trim(position, trim_size, config):
    hard_stop = position.basis * (1 - config.hard_stop_pct)
    remaining = position.quantity - trim_size
    if remaining * position.current_price < position.basis * 0.5:
        raise IroncladViolation(
            f"{position.ticker}: trim would drop position below "
            f"50% of basis — hard stop at ${hard_stop:.2f}"
        )
    return True
```

The prose rule was "correct" for six months. I never violated it consciously. But during the March silver stop-hunt, positions got trimmed in panicked moments, and the rule was technically kept while the intent was completely broken.

The code version has never let me do that. Not because I'm more disciplined now. Because the function refuses.

That is the difference between AI-era governance and AI-era wishful thinking.

---

## Six lessons I've paid tuition to learn

**1. Prose rules fail under pressure. Code gates don't.** If you need a behavior reliably, it cannot live in an instruction. It has to live in a function that raises an exception when violated.

**2. The LLM is the conversation, not the system of record.** Your system of record is your code, your database, your ledger. The LLM is the interface and the synthesizer. Never confuse the two.

**3. Categorization is code, not judgment.** If you ask an LLM to categorize a thousand emails, you get a thousand plausible categorizations. If you write rules, you get deterministic ones. For anything you intend to re-run or audit, use rules.

**4. Verify before claiming absence.** "I don't have access to that" must be the last thing you say, not the first. Every such claim needs a tool call behind it, not a memory lookup.

**5. Headers beat sums.** If a system of record provides a total, use the total. Never reconstruct it from its components unless you're auditing it. Reconstruction introduces errors the header wouldn't.

**6. Honesty loops accelerate conversations. Placation stalls them.** When I asked my AI to log its failures out loud, the work moved faster. When it softened or rationalized, the work slowed. The same is true for humans.

---

## The application

The word "application" has two meanings I care about here.

**Application as in job application.** I'm a 40-year defense-and-enterprise veteran, a Siemens Golden Circle Award recipient, a liver transplant survivor, and the Principal of a two-person AI research LLC in Newport News, Virginia. I am not a traditional AI hire. I am not a machine learning PhD. I am a builder who has spent the last 18 months proving that the governance layer of applied AI is mostly vacant — and that the people who fill it will be the people who've already been burned by AI that pattern-matched when it needed to execute.

If you're hiring for applied AI work and you care more about evidence than credentials, I'd like to talk.

**Application as in demonstrated use.** FORGE is not a paper framework. It's running in production against real capital with real consequences. Every artifact referenced in this post is in a GitHub repository. Every test I mention passes. Every failure I describe happened to me, not to a hypothetical user.

When AI runs itself, the operator who sets it up correctly is the one who gets paid. That's the sentence the Instagram infographics are converging on. I agree.

But the operator also has to be the one who wrote the gates.

Otherwise the AI that ran itself will run itself off a cliff on your behalf.

---

## Where to find the work

- **Platform code:** `github.com/Barefootservants2/a2e-platform` (private, access on request)
- **Protocol artifacts:** `github.com/Barefootservants2/A2E_Protocols`
- **FORGE book Chapter 2 — "The Forge in Action":** full weekend session, annotated as case study
- **Landing page:** forge-landing-theta.vercel.app
- **Contact:** ashes2echoes.platform@gmail.com

Stop writing prompts. Start writing gates. The next era of applied AI belongs to the people who enforce.

🔱 — *Ashes2Echoes, LLC*

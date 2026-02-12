# COLLECTIVE LAYERED ROUTING ARCHITECTURE v1.0

**Version:** 1.0 | **Date:** February 10, 2026
**Classification:** Architecture / Cost Optimization
**Status:** DESIGN — Future implementation

---

## CONCEPT: COLLECTIVE OF COLLECTIVES

Each Uriel Covenant member is not a single model — it's a TIERED AGENT STACK. The "collective" becomes a collective OF collectives, where each node runs its own internal hierarchy optimized for cost and capability.

---

## TOKEN ECONOMICS

| Tier | Model | Input Cost | Output Cost | Role |
|------|-------|-----------|-------------|------|
| **Tier 1** | Opus 4.6 | $5/M | $25/M | Strategy, decisions, Principal interaction |
| **Tier 2** | Sonnet 4.5 | $3/M | $15/M | Analysis, consolidation, report generation |
| **Tier 3** | Haiku 4.5 | $0.80/M | $4/M | Data pulls, filtering, classification, timestamps |

**Cost savings from proper routing:**
- Haiku is **84% cheaper** than Opus on input
- Sonnet is **40% cheaper** than Opus on both input and output
- Most HUNTER scan work is Tier 2/3, NOT Tier 1

**Current waste:** Opus tokens burned on web searches for stale silver prices, data formatting, simple lookups — all of which could run at Haiku cost.

---

## ARCHITECTURE

```
PRINCIPAL (William)
    ↓
TIER 1: OPUS (MICHA) — Strategy, thesis, protocol, decisions
    ↓ routes to
TIER 2: SONNET agents — HUNTER scans, analysis, consolidation, reports
    ↓ routes to  
TIER 3: HAIKU workers — Data pulls, filtering, timestamp checks, classification
    ↓ also routes to
EXTERNAL MODELS:
    ├── Grok/COLOSSUS (real-time X signals, market sentiment)
    ├── Gemini/HANIEL (massive document ingestion at free/cheap tier)
    ├── ChatGPT/URIEL (creative/narrative, image generation)
    ├── DeepSeek/RAZIEL (code generation, technical analysis)
    └── Perplexity/SERAPH (web research with citations)
```

**Routing principle:** Every task starts at the CHEAPEST layer that can handle it. Only escalates up when complexity exceeds the tier's capability.

---

## EACH COLLECTIVE MEMBER AS A STACK

### MICHA Stack (Claude)
```
OPUS    → Principal interface, strategy, protocol decisions
SONNET  → HUNTER analysis, earnings reviews, thesis validation
HAIKU   → Web search, data pulls, timestamp verification, classification
```

### URIEL Stack (ChatGPT)
```
GPT-5.x → Strategic reasoning, creative direction
GPT-4o  → Analysis, report generation  
GPT-4o-mini → Data processing, simple tasks
```

### COLOSSUS Stack (Grok)
```
Grok-3  → Real-time market sentiment, X signal analysis
Grok-2  → Routine social monitoring
```

### HANIEL Stack (Gemini)
```
Gemini Ultra → Deep document analysis, cross-reference
Gemini Pro   → Standard research, summarization
Gemini Flash → Quick lookups, simple queries
```

---

## STALE DATA SOLUTION (Architectural)

The layered routing directly solves the recurring stale data problem:

```
HAIKU WORKER:
  1. Pull raw market data
  2. Check timestamp (is it <30 minutes old?)
  3. If stale → pull from alternative source
  4. If still stale → flag as UNVERIFIED
  5. Pass only VERIFIED data upstream

SONNET AGENT:
  1. Receive verified data from Haiku
  2. Run analysis, identify patterns
  3. Generate structured report

OPUS (MICHA):
  1. Receive pre-analyzed, verified intelligence
  2. Apply thesis logic, make recommendations
  3. Never touches raw, unverified data
```

---

## IMPLEMENTATION PATH

| Phase | Scope | Platform | Timeline |
|-------|-------|----------|----------|
| Phase 1 | n8n workflow routing (current) | n8n Cloud | Active |
| Phase 2 | Claude API tiered calls | Anthropic API | When API budget available |
| Phase 3 | Multi-model orchestration | n8n + APIs | Q2 2026 |
| Phase 4 | Full collective-of-collectives | Custom orchestrator | Q3-Q4 2026 |

---

## COST PROJECTION

**Current state:** ~$200-400/month burning Opus tokens on everything
**Target state:** ~$50-100/month with proper routing (75% reduction)

Most token spend moves to Haiku ($0.80/M) and Sonnet ($3/M), with Opus reserved for strategy sessions.

---

*"The smartest model isn't the one that does everything. It's the one that knows what NOT to do."*

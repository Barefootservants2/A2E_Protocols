# A2E AI WORKFORCE SPECIFICATION v1.0
**Machine:** The_Collective | 128GB RAM | Multi-GPU 16GB VRAM | i9-13950HX | 3.73TB
**Platform:** Cowork (Anthropic Desktop) + Ollama Local LLM Lab
**Principal:** William Earl Lemon | Ashes2Echoes LLC
**Date:** April 2, 2026

---

## ARCHITECTURE OVERVIEW

```
THE_COLLECTIVE (Local Machine)
├── COWORK AGENT WORKFORCE (12-15 agents, parallel execution)
├── OLLAMA LOCAL LLM LAB (Multiple models, zero API cost)
│   ├── Llama 3.3 70B     — Primary reasoning
│   ├── DeepSeek R1 70B   — Deep analysis
│   ├── Mistral 7B        — Fast code tasks
│   ├── Phi-4 14B         — Compact powerhouse
│   └── CodeLlama 34B     — Dedicated code
├── CIL v6.1 (n8n — 5 external agents + 1 LOCAL Ollama agent)
├── HUNTER v3.2 (n8n — market intelligence)
├── GABRIEL v2.1 (n8n — overnight watch)
└── CLAUDE CODE v2.1.87 (direct file access, git operations)
```

---

## THE WORKFORCE — 15 AI EMPLOYEES

### TIER 1 — PLATFORM WORKERS (Core build team)

---

#### AGENT 01 — ARCHIVIST
**Tool:** Cowork
**Mission:** Audit and catalog everything that exists across all A2E repositories and local files.
**Daily Tasks:**
- Scan all 14 GitHub repos — produce status report (current/stale/zombie/undocumented)
- Catalog every file in C:\a2e by type, purpose, and last-modified
- Identify duplicate files, orphan files, test data that should be deleted
- Flag any file containing sensitive data (keys, passwords, account numbers)
- Produce weekly "what exists" inventory report
**Output:** ARCHIVIST_REPORT_[DATE].md → A2E_Intelligence/TECHNICAL/

---

#### AGENT 02 — DOCUMENTER
**Tool:** Cowork
**Mission:** Write and maintain professional documentation for every A2E system.
**Daily Tasks:**
- Read existing protocol files and write/update README files
- Build system architecture documents with diagrams
- Maintain version history — when something changes, update the doc
- Write the "team of 10 worked for years" documentation that makes A2E look institutional
**Priority Docs to Build:**
- METATRON_README.md — 30-gate system, full description
- CIL_README.md — architecture, domain config, agent roles
- HUNTER_README.md — module map, all 44 signals described
- GABRIEL_README.md — escalation matrix, schedule
- IRONCLAD_README.md — risk rules, kill switch
- PLATFORM_OVERVIEW.md — the flagship document
**Output:** All docs → appropriate GitHub repos

---

#### AGENT 03 — LIBRARIAN
**Tool:** Cowork + Ollama (Mistral 7B for quick processing)
**Mission:** Build and maintain the A2E Prompt Library (FORGE v3.0)
**Daily Tasks:**
- Harvest prompts from every session document and protocol file
- Categorize prompts by domain (market, code, research, architecture, evaluation)
- Score each prompt using CREATE framework
- Track prompt performance — which ones produce the best outputs
- Pull new prompt engineering patterns from GitHub and research papers weekly
**Library Structure:**
```
FORGE_LIBRARY/
├── SYSTEM_PROMPTS/      (agent personas, role definitions)
├── TASK_PROMPTS/        (market, code, research, writing)
├── CHAIN_PROMPTS/       (multi-step reasoning)
├── EVALUATION_PROMPTS/  (quality scoring, CAKE validation)
├── AGENTIC_PROMPTS/     (multi-agent coordination)
└── DOMAIN_PROMPTS/      (finance, defense, tech, legal)
```
**Output:** FORGE v3.0 → A2E_Protocols/FORGE/LIBRARY/

---

#### AGENT 04 — BUILDER
**Tool:** Cowork + Claude Code
**Mission:** Build and maintain the n8n workflow and node repository
**Daily Tasks:**
- Export all active n8n workflows to GitHub after any change
- Maintain WORKFLOW_CATALOG.md — what every workflow does, status, version
- Build reusable workflow templates (auth patterns, error handlers, parallel patterns)
- Maintain JavaScript/Python code library for n8n Code nodes
- Track n8n version — alert when nodes are deprecated or new features released
**Repository:**
```
N8N_REPOSITORY/
├── WORKFLOWS/PRODUCTION/   (live tested workflows)
├── WORKFLOWS/TEMPLATES/    (reusable patterns)
├── WORKFLOWS/ARCHIVE/      (old versions)
├── NODES/CODE/             (reusable code blocks)
└── CATALOG.md
```
**Output:** N8N_REPOSITORY GitHub repo (create new private repo)

---

#### AGENT 05 — TESTER
**Tool:** Cowork + Claude Code
**Mission:** Test every workflow, API, and integration end-to-end
**Daily Tasks:**
- Run HUNTER v3.x test pass — verify all H-nodes return data
- Run CIL test pass — verify all 5 agents respond, cascade gates pass
- Test GABRIEL alert routing — verify Telegram delivery
- Verify all n8n credentials still active (keys haven't expired)
- Run backtest_harness.py when new STRONG signals are defined
- Produce DAILY_TEST_REPORT.md
**Output:** TEST_LOGS/ → A2E_Protocols/TESTING/

---

### TIER 2 — INTELLIGENCE WORKERS (Research and monitoring)

---

#### AGENT 06 — HARVESTER
**Tool:** Cowork + web search
**Mission:** Continuously pull world knowledge relevant to A2E success
**Weekly Harvests:**
- New n8n nodes, integrations, and workflow patterns
- New AI frameworks, models, and tools (what's new, what's deprecated)
- Market intelligence frameworks and quantitative finance research
- Prompt engineering advances and new techniques
- Competitive intelligence — who else is building multi-agent trading systems
- MCP server updates and new protocol specifications
- GitHub trending repos in: AI agents, n8n, trading systems, prompt engineering
**Output:** WEEKLY_HARVEST_[DATE].md → A2E_Intelligence/TECHNICAL/

---

#### AGENT 07 — MONITOR
**Tool:** Cowork + web search
**Mission:** Track technology deprecation and required upgrades
**Monitors:**
- n8n version releases — what broke, what's new
- Anthropic API changes — model updates, new features, deprecated endpoints
- OpenAI API changes
- GitHub API changes
- Finnhub, Twelve Data, Alpha Vantage API changes
- All 28 HUNTER credentials — expiration dates, rate limit changes
- Node.js, Python version requirements
- Windows 11 compatibility issues
**Alert Protocol:** Any deprecation → immediate PHOENIX checkpoint flag
**Output:** DEPRECATION_ALERTS/ + UPGRADE_QUEUE.md

---

#### AGENT 08 — STRATEGIST
**Tool:** Cowork + web search + Ollama (DeepSeek R1 70B)
**Mission:** Competitive intelligence and strategic positioning
**Weekly Tasks:**
- Map the competitive landscape — who is building what we're building
- Identify gaps in the market that A2E can fill
- Track AI consulting rates and market pricing
- Research grant opportunities for A2E LLC
- Track Anthropic, OpenAI, xAI, Google hiring — what roles, what they pay
- Find partnership opportunities, integration opportunities
- Monitor for acquisition activity in AI trading space
**Output:** STRATEGY_BRIEFS/ → A2E_Intelligence/MARKET_INTELLIGENCE/

---

#### AGENT 09 — RESEARCHER
**Tool:** Cowork + web search + Ollama (Llama 3.3 70B)
**Mission:** Deep research on any topic the Principal requests
**Standing Research Queue:**
- Options flow academic literature (what UW API's data is based on)
- GEX mechanics and dealer hedging — how it actually works
- Silver deficit and Hormuz crisis impact on precious metals thesis
- Defense AI contracts and PLTR's government pipeline
- AI job market — what roles exist, what they pay, what they need
**On-demand:** Any query from the Principal → deep research → briefing doc
**Output:** RESEARCH_BRIEFS/ → A2E_Intelligence/

---

#### AGENT 10 — AUDITOR
**Tool:** Cowork + Claude Code
**Mission:** Security, compliance, and credential hygiene
**Weekly Tasks:**
- Audit all API keys — active, expiring soon, expired
- Verify no sensitive data committed to public repos
- Check GitHub repo visibility — nothing that should be private is public
- Audit n8n credentials — which are live, which are test
- Review .gitignore files — are all secrets excluded?
- Verify TAXGUARD compliance — wash sale tracking current
- Flag any unusual activity in A2E accounts
**Output:** SECURITY_AUDIT_[DATE].md → A2E_Intelligence/TECHNICAL/ (PRIVATE)

---

### TIER 3 — PUBLICATION WORKERS (Brand and presence)

---

#### AGENT 11 — PUBLISHER
**Tool:** Cowork
**Mission:** Content creation for LinkedIn, Instagram, Facebook
**Weekly Production:**
- 1 LinkedIn article (technical deep-dive, market insight, or A2E capability)
- 3 LinkedIn posts (market brief, tech update, platform milestone)
- 5 Instagram posts (Metatron aesthetic, trade results, market visuals)
- 3 Facebook posts (broader audience, less technical)
**Content Calendar:**
- Week 1: AI + workforce displacement (article already drafted)
- Week 2: How a multi-agent system beats single-model AI
- Week 3: The silver thesis — why the market is wrong
- Week 4: Building institutional AI on a budget
**Output:** CONTENT_CALENDAR.md + drafted posts → A2E_Career/CONTENT/

---

#### AGENT 12 — WEBMASTER
**Tool:** Cowork + Claude Code
**Mission:** Build and maintain ashes2echoes.com
**Site Architecture:**
```
ashes2echoes.com (Vercel)
├── /              ← BULLSEYE interactive rings (existing)
├── /platform      ← What A2E built (live demos)
├── /research      ← Published market analysis
├── /about         ← William's story
├── /services      ← Consulting, AI systems
└── /contact       ← Form → GABRIEL → email pipeline
```
**Priority Build:**
- /platform page with CIL architecture diagram
- /about with the Principal's story (defense → AI)
- Contact form wired to GABRIEL
**Output:** All code → Vercel deployment

---

#### AGENT 13 — CAREER AGENT
**Tool:** Cowork
**Mission:** Manage the job search and CCA certification track
**Daily Tasks:**
- Track all active job applications (company, role, status, next step)
- Research each company before interviews — what they build, who interviews
- Build company-specific interview prep documents
- Track CCA study progress — which modules complete, which pending
- Maintain A2E_Career repo — resume versions, cover letters, cert badges
- Find new job postings across all major AI companies daily
**Output:** APPLICATION_TRACKER.md + INTERVIEW_PREP/ → A2E_Career/

---

### TIER 4 — LOCAL LLM WORKERS (Ollama-powered, zero API cost)

---

#### AGENT 14 — LOCAL_ANALYST (Ollama — Llama 3.3 70B)
**Tool:** Ollama via n8n HTTP node
**Mission:** Become the 6th agent in the CIL Collective
**Integration:** CIL DOMAIN ROUTER adds LOCAL as 6th agent lane
**Specialization:** Long-form analysis, document processing, local RAG
**Privacy:** All sensitive queries (tax, legal, personal) routed here — never to cloud APIs
**Cost:** $0 per query
**Output:** Integrated into CIL v6.2 as AGENT 6 — LOCAL

---

#### AGENT 15 — LOCAL_CODER (Ollama — CodeLlama 34B)
**Tool:** Ollama via Claude Code
**Mission:** Code generation, review, and debugging — zero API cost
**Use Cases:**
- First-pass code generation before Claude reviews
- Code review on all committed files
- n8n JavaScript code node templates
- Python script generation for backtesting, data processing
**Integration:** Claude Code can call Ollama API directly
**Cost:** $0 per query
**Output:** Code → GitHub repos

---

## OLLAMA INSTALLATION PLAN — The_Collective

```bash
# Step 1: Install Ollama for Windows
# Download: https://ollama.com/download/windows
# Installer: OllamaSetup.exe

# Step 2: Pull priority models (run in order — largest first)
ollama pull llama3.3:70b          # ~40GB — primary reasoning
ollama pull deepseek-r1:70b       # ~40GB — deep analysis  
ollama pull codellama:34b         # ~19GB — code specialist
ollama pull phi4:14b              # ~8GB  — compact powerhouse
ollama pull mistral:7b            # ~4GB  — fast tasks

# Step 3: Verify all running
ollama list

# Step 4: Test API endpoint
curl http://localhost:11434/api/generate \
  -d '{"model":"llama3.3:70b","prompt":"Confirm Ollama is running on The_Collective"}'

# Step 5: Add to n8n as HTTP Request node
# URL: http://localhost:11434/api/generate
# Method: POST
# Body: {"model":"llama3.3:70b","prompt":"{{query}}","stream":false}
```

**RAM allocation at full load:**
- Llama 3.3 70B: ~40GB
- DeepSeek R1 70B: ~40GB (can't run simultaneously with Llama 70B)
- CodeLlama 34B: ~19GB
- Phi-4 14B: ~8GB
- Mistral 7B: ~4GB
- OS + Cowork + n8n + Chrome: ~8-12GB
- **Safe simultaneous: 1x 70B + 1x 7B + 1x 14B = ~62GB ✅**

---

## COWORK AGENT DEPLOYMENT PLAN

Each Cowork agent is a saved set of instructions + file access scope.

**Session structure:**
```
Cowork Agent Session
├── Instructions: [Agent role + daily task list]
├── File Access: [Specific folders agent can read/write]
├── Output Target: [Where to save results]
└── Schedule: [When to run — daily, weekly, on-demand]
```

**File access map:**
```
C:\a2e\                    ← All agents read
C:\a2e\repos\              ← ARCHIVIST, BUILDER, TESTER
C:\a2e\prompts\            ← LIBRARIAN
C:\a2e\workflows\          ← BUILDER
C:\a2e\docs\               ← DOCUMENTER
C:\a2e\intel\              ← RESEARCHER, STRATEGIST, HARVESTER
C:\a2e\career\             ← CAREER AGENT
C:\a2e\security\           ← AUDITOR (restricted)
C:\a2e\web\                ← WEBMASTER
C:\a2e\content\            ← PUBLISHER
```

---

## BUILD SEQUENCE — NEXT 8 WEEKS

| Week | Agents Online | Platform Progress | CCA |
|---|---|---|---|
| 1 | ARCHIVIST + AUDITOR | Full repo audit complete | Week 1-2 free certs |
| 2 | DOCUMENTER + BUILDER | README sprint begins | Cont. |
| 3 | LIBRARIAN + HARVESTER | FORGE v3.0 started | Claude API cert |
| 4 | MONITOR + TESTER | All 13 free Anthropic certs done | MCP cert |
| 5 | RESEARCHER + STRATEGIST | CIL Universal + Ollama live | CCA domains 1-2 |
| 6 | PUBLISHER + WEBMASTER | Site live, LinkedIn active | CCA domains 3-4 |
| 7 | CAREER AGENT + LOCAL agents | Platform front-to-back tested | CCA mock exam |
| 8 | ALL 15 ONLINE | Full platform dropping bombs 💣 | CCA EXAM |

---

## THE COMPOUND EFFECT

With 15 agents running in parallel:
- **ARCHIVIST** tells us what we have
- **DOCUMENTER** makes it look institutional
- **HARVESTER** brings in what the world knows
- **MONITOR** keeps nothing deprecated
- **LOCAL_ANALYST** adds a free 6th Collective agent
- **PUBLISHER** builds the brand
- **CAREER AGENT** lands the job
- **TESTER** ensures nothing breaks

**A2E goes from "one man and his AI" to "AI operations firm with institutional infrastructure."**

That's the story. That's the product. That's the pitch.

---
*A2E AI Workforce Specification v1.0 | MICHA v10.8 | April 2, 2026*

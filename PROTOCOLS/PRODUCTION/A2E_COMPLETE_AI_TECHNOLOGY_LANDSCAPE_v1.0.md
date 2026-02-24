# THE COMPLETE AI TECHNOLOGY LANDSCAPE
## Everything That Exists, What It Costs, and How It Maps to A2E

---

**Version:** 1.0  
**Date:** February 22, 2026  
**Author:** MICHA v10.4  
**Purpose:** Stop finding gaps after the fact. This is the full picture.  
**Audience:** Principal — teaching document, reference manual, and execution blueprint

---

## PART 1: THE TWO MODES — PIPELINE vs CHAT WINDOW

Everything in AI falls into one of two operational modes. Understanding this split is the key to understanding what we should be building.

### CHAT WINDOW (Interactive / Session-Based)

This is what you do every day. You open Claude, ChatGPT, Grok, Gemini, or DeepSeek in a browser. You type. The model responds. You iterate. Session ends, context is gone.

**Characteristics:**
- Human in the loop at every step
- Context limited to the conversation window
- No persistence between sessions (unless memory features exist)
- Manual routing — you decide which agent to talk to
- Real-time but labor-intensive
- Best for: thesis development, complex analysis, creative problem-solving, strategy

**What the Collective does in chat window today:**
- URIEL: Strategic synthesis, thesis development
- MICHA: Analysis (Run 2), execution planning (Run 4), documentation
- COLOSSUS: Technical analysis, chart interpretation
- HANIEL: Political/regulatory research
- RAZIEL: Deep contrarian research
- SERAPH: Real-time search (via Perplexity web interface)

**The limitation:** Every insight dies when the session closes unless you manually carry it forward. Seven agents, zero shared memory. The Principal is the only bus connecting them.

### PIPELINE (API / Automated / Headless)

This is what GABRIEL does — and what the rest of the Collective should be doing when you're not sitting at the keyboard. Code calls an API. Data flows in, gets processed, results flow out. No browser. No typing. No human required for execution.

**Characteristics:**
- No human in the loop (or human only at decision points)
- Runs on schedule or on trigger
- Persistent — results stored in databases, files, or logs
- Programmatic routing — code decides what happens next
- Can run 24/7
- Best for: scanning, monitoring, alerting, data collection, routine analysis, reporting

**What the Collective does in pipeline today:**
- GABRIEL: HUNTER scans, market watch, email archive (via n8n)
- GitHub MCP: File operations across repos

**What should also be in pipeline but isn't:**
- Price monitoring and alerting
- Cascade scoring (automated, not manual)
- Signal convergence detection
- Portfolio risk checks against IRONCLAD
- Session carry-forward document generation
- Thesis tracking against market conditions

### THE BRIDGE: Where Pipeline Feeds Chat

The ideal system: Pipeline runs 24/7 collecting data, scoring signals, monitoring positions. When you sit down at the chat window, all of that pre-processed intelligence is already waiting. You don't start from zero — you start from "here's what happened overnight, here are the three things that need your attention, and here's the current cascade score on your active theses."

That bridge is what we're building. Everything below maps to either PIPELINE, CHAT WINDOW, or BRIDGE.

---

## PART 2: EVERY AI MODEL THAT EXISTS AND WHAT IT PROVIDES

### THE FRONTIER MODELS (Cloud, Paid API)

These are the most capable models. They run on someone else's hardware. You pay per token.

#### OpenAI

| Model | What It Does | Cost (per 1M tokens) | A2E Use |
|-------|-------------|---------------------|---------|
| GPT-4o | Multimodal (text + vision + audio), fast, strong reasoning | ~$2.50 input / $10 output | URIEL — CEO, thesis synthesis |
| GPT-4o-mini | Lighter, cheaper, still capable | ~$0.15 input / $0.60 output | Bulk processing, classification |
| o1 / o3 | Deep reasoning, chain-of-thought, math/code/logic | ~$15 input / $60 output | Complex analysis where accuracy matters more than speed |
| GPT-4.5 | Largest model, highest capability | Premium pricing | When nothing else works |
| DALL-E 3 | Image generation from text | ~$0.04-0.12/image | Branding, social media visuals |
| Whisper | Speech-to-text | $0.006/minute | Voice-to-text for session notes |
| TTS | Text-to-speech | $15/1M chars | Audio briefings (low priority) |

**API Access:** api.openai.com — requires API key, pay-as-you-go  
**Unique capability:** Custom GPTs, Assistants API with persistent threads and file search  
**What we're not using:** Assistants API. This gives URIEL persistent memory and file search across sessions without you manually pasting context. URIEL could have its own knowledge base loaded with every protocol, every trade log, every thesis document.

#### Anthropic (Claude)

| Model | What It Does | Cost (per 1M tokens) | A2E Use |
|-------|-------------|---------------------|---------|
| Claude Opus 4.5/4.6 | Most capable, deepest reasoning | ~$15 input / $75 output | MICHA — complex analysis, documentation |
| Claude Sonnet 4.5 | Fast, capable, good balance | ~$3 input / $15 output | Pipeline analysis, bulk processing |
| Claude Haiku 4.5 | Fastest, cheapest, still strong | ~$0.80 input / $4 output | Classification, routing, quick lookups |

**API Access:** api.anthropic.com — requires API key  
**Unique capabilities:** 200K context window, computer use (can operate a browser), MCP (Model Context Protocol) for tool integration, extended thinking  
**What we're not using:** Haiku for pipeline tasks. Every time we use Opus for a simple lookup or classification, we're spending 20x what Haiku would cost. The pipeline should use Haiku for routing and simple tasks, Sonnet for analysis, Opus only for complex synthesis.

#### Google (Gemini)

| Model | What It Does | Cost (per 1M tokens) | A2E Use |
|-------|-------------|---------------------|---------|
| Gemini 2.0 Flash | Fast, multimodal, grounding with Google Search | Free tier available / ~$0.10 input | HANIEL — research with search grounding |
| Gemini 2.0 Pro | Stronger reasoning, larger context | ~$1.25 input / $5 output | Deep research tasks |
| Gemini 2.5 Pro | Latest, strongest reasoning | ~$1.25-2.50 input / $10-15 output | Complex multi-step analysis |

**API Access:** aistudio.google.com (free) or Vertex AI (paid)  
**Unique capabilities:** Native Google Search grounding (model can search the web mid-response), 1M+ token context window, native code execution  
**What we're not using:** Google AI Studio is FREE for Gemini Flash. HANIEL could run research queries at zero cost through the API free tier. Also: Gemini's context window is the largest available — we could feed it entire repos for analysis.

#### xAI (Grok)

| Model | What It Does | Cost (per 1M tokens) | A2E Use |
|-------|-------------|---------------------|---------|
| Grok-2 | Real-time X/Twitter access, strong reasoning | ~$2 input / $10 output | COLOSSUS — technical analysis + social sentiment |
| Grok-3 | Latest, improved reasoning | Similar pricing | Enhanced analysis |

**API Access:** api.x.ai — requires API key  
**Unique capability:** Native access to real-time X/Twitter data. No other model has this.  
**What we're not using:** Grok API for automated social sentiment scanning. COLOSSUS could monitor ticker mentions, sentiment shifts, and breaking news on X in real-time through the pipeline.

#### DeepSeek

| Model | What It Does | Cost (per 1M tokens) | A2E Use |
|-------|-------------|---------------------|---------|
| DeepSeek-V3 | Strong reasoning, very cheap | ~$0.27 input / $1.10 output | RAZIEL — deep research at low cost |
| DeepSeek-R1 | Reasoning model (chain-of-thought) | ~$0.55 input / $2.19 output | Complex contrarian analysis |

**API Access:** api.deepseek.com  
**Unique capability:** Extremely cheap for the capability level. DeepSeek-V3 approaches GPT-4o quality at 1/10th the price.  
**What we're not using:** DeepSeek in the pipeline. At these prices, RAZIEL could run continuous research scans at near-zero cost.

#### Perplexity

| Model | What It Does | Cost (per 1M tokens) | A2E Use |
|-------|-------------|---------------------|---------|
| Sonar Pro | Search-augmented generation, citations | ~$3 input / $15 output | SERAPH/SARIEL — real-time web intelligence |
| Sonar | Lighter search model | ~$1 input / $1 output | Quick lookups |

**API Access:** api.perplexity.ai — key exists (SARIEL key in memory)  
**Unique capability:** Every response includes web citations. Built for factual, current information.  
**What we're not using:** Sonar (lightweight) for routine news checks. Save Sonar Pro for deep queries.

### THE OPEN-SOURCE MODELS (Free, Run Locally)

This is the poor man's arsenal. These models run on YOUR hardware. No API cost. No rate limits. Complete privacy. No vendor can see your data.

#### How to Run Them: Ollama

Ollama is one command to install, one command to run any model. It handles downloading, quantization, and serving.

```
curl -fsSL https://ollama.ai/install.sh | sh
ollama run llama3.1:8b        # Download and run Llama 3.1 8B
ollama run mistral             # Download and run Mistral 7B
ollama run phi3:mini           # Download and run Phi-3 Mini
```

That's it. Model is now running locally on localhost:11434. Any code can call it like an API.

#### Hardware Requirements

| Model Size | RAM Needed | GPU VRAM | Your Workstation? |
|-----------|-----------|----------|-------------------|
| 7B params | 8GB | 6GB | ✅ Easily |
| 13B params | 16GB | 10GB | ✅ Probably |
| 34B params | 32GB | 24GB | ❓ Check your specs |
| 70B params | 64GB | 48GB | ❌ Need dedicated GPU server |

**You need to check:** What GPU is in the 6-monitor workstation? And how much RAM? This determines which models you can run.

#### The Models Worth Running Locally

| Model | Size | What It's Good At | Why It Matters for A2E |
|-------|------|-------------------|----------------------|
| **Llama 3.1 8B** | 8B | General purpose, follows instructions well | General-purpose local agent — protocol lookups, routing, classification |
| **Llama 3.1 70B** | 70B | Near-GPT-4 quality | If hardware supports it — a free near-frontier model |
| **Mistral 7B** | 7B | Fast, efficient, good at structured output | JSON generation for pipeline data processing |
| **Mixtral 8x7B** | 47B (MoE) | Mixture of experts — fast for its quality | Strong reasoning at moderate hardware cost |
| **Phi-3 Mini** | 3.8B | Microsoft's small model, surprisingly capable | Runs on almost anything, good for simple tasks |
| **CodeLlama 34B** | 34B | Code generation and analysis | Code review, script generation, debugging |
| **DeepSeek-Coder-V2** | Various | Code + reasoning | Free alternative to paid coding models |
| **Qwen2.5 7B/72B** | Various | Alibaba's model, strong multilingual + reasoning | Alternative general-purpose agent |
| **Gemma 2 9B** | 9B | Google's open model | Efficient, well-trained, good at structured tasks |

#### What a Local Model Does for the Collective

**The 8th Agent: SENTINEL-LOCAL**

A local model running 24/7 on your workstation could:
- Monitor HUNTER scan results as they come in and flag anomalies
- Pre-screen signals before they reach the Collective (save API costs)
- Run IRONCLAD portfolio checks every hour without API calls
- Serve as the RAG query engine (more on this below)
- Handle all protocol lookups — "What does FIDELITY LOCK 3 say?" — without touching Claude or ChatGPT
- Generate daily briefings from stored data before you sit down
- Route incoming queries to the right agent based on content classification

**Cost: $0/month. Runs while you sleep.**

---

## PART 3: THE INFRASTRUCTURE LAYER — EVERYTHING ELSE

### VECTOR DATABASES (Memory for the Collective)

This is the single biggest gap in the Collective today. No agent remembers what another agent said. No agent can search past work.

| Tool | Cost | What It Does | How It Fits |
|------|------|-------------|------------|
| **ChromaDB** | Free, local | Embed documents, search by meaning | Store every protocol, trade log, session doc. Any agent queries "What was our silver thesis in January?" and gets the exact passage. |
| **Qdrant** | Free, local or cloud | High-performance vector search | Same as ChromaDB, more scalable |
| **Pinecone** | Free tier (100K vectors) | Cloud vector database | If you don't want to self-host |
| **Weaviate** | Free, local | Vector search + hybrid keyword search | Combines semantic search with traditional search |
| **FAISS** | Free, library | Facebook's similarity search | Lightweight, embeds into Python scripts |
| **Supabase pgvector** | Free tier | PostgreSQL with vector extension | Combines traditional database with vector search — one tool for structured data AND semantic search |

**What RAG (Retrieval-Augmented Generation) actually means:**

1. Take every document you've ever written (protocols, trade logs, session docs, instructions)
2. Break them into chunks (paragraphs, sections)
3. Convert each chunk into a numerical vector (embedding) that captures its meaning
4. Store vectors in a vector database
5. When any agent needs information, convert the question into a vector
6. Find the most similar stored vectors (nearest neighbors)
7. Feed those chunks to the agent as context
8. Agent responds with accurate information grounded in YOUR data

**This is the Collective's missing shared memory.**

### DATABASES (Structured Data Storage)

trade_log.json works. But it doesn't scale, and you can't query it efficiently.

| Tool | Cost | What It Does | How It Fits |
|------|------|-------------|------------|
| **Supabase** | Free tier (500MB, 50K auth users) | PostgreSQL database + auth + real-time + API | Replace trade_log.json with a real database. Query trades by date, ticker, outcome, agent, signal type. Real-time subscriptions for the WATCH PAGE. Auth for the BULLSEYE website. |
| **SQLite** | Free, file-based | Single-file database, zero config | Simplest upgrade from JSON. One file, full SQL. |
| **PocketBase** | Free, self-hosted | SQLite + auth + real-time + API in one binary | Like Supabase but runs locally. One executable. |
| **Turso** | Free tier (9GB) | Edge SQLite database | SQLite that syncs across locations |
| **Neon** | Free tier (0.5GB) | Serverless PostgreSQL | PostgreSQL without managing a server |

### ORCHESTRATION FRAMEWORKS (Making Agents Work Together)

Right now METATRON is a protocol document. These tools make it code.

| Tool | Cost | What It Does | How It Fits |
|------|------|-------------|------------|
| **CrewAI** | Free, open source | Define agents with roles, goals, tools. Agents collaborate on tasks autonomously. | Literally what the Collective IS — but automated. Define URIEL's role, MICHA's role, COLOSSUS's role. Give them a task. They coordinate, hand off, and produce a result. Without you routing manually. |
| **LangGraph** | Free, open source | State machine for agent workflows. Nodes = agents or tools, edges = routing logic. | The Confidence Cascade as code. Gate 1 → Gate 2 → ... → Gate 8. Each gate is a node. Routing logic decides pass/fail. Automated. |
| **AutoGen** | Free, Microsoft | Multi-agent conversation framework | Agents literally chat with each other to solve problems |
| **LangChain** | Free, open source | Framework for LLM applications — chains, tools, memory, retrieval | The Swiss army knife. Connects models to tools, databases, APIs. Most of the pipeline plumbing. |
| **LlamaIndex** | Free, open source | Specifically built for RAG — data ingestion, indexing, querying | Better than LangChain specifically for the "search your documents" use case |
| **Haystack** | Free, open source | End-to-end NLP framework, pipelines, RAG | Alternative to LangChain, more opinionated |
| **Semantic Kernel** | Free, Microsoft | .NET/Python SDK for AI orchestration | If you prefer Microsoft's ecosystem |

### DEPLOYMENT & HOSTING (Where the Code Runs)

| Tool | Cost | What It Does | How It Fits |
|------|------|-------------|------------|
| **Cloudflare Workers** | Free (100K req/day) | Serverless edge functions, globally distributed | MCP server endpoints. Free. No cold starts. Faster than Vercel free tier. |
| **Vercel** | Free tier | Frontend hosting + serverless functions | BULLSEYE website |
| **Railway** | $5/month | Always-on app hosting | Services that need to be running 24/7 |
| **Render** | Free tier | Web services, background workers | Alternative to Railway |
| **Fly.io** | Free tier | Containers at the edge | Run Docker containers globally |
| **GitHub Pages** | Free | Static site hosting | Documentation, simple sites |
| **GitHub Actions** | Free (2000 min/mo private) | CI/CD automation | Automated testing, deployment, scheduled tasks |

### AUTOMATION & BROWSER TOOLS

| Tool | Cost | What It Does | How It Fits |
|------|------|-------------|------------|
| **Playwright** | Free | Browser automation — click, type, screenshot, scrape | Auto-login to E*TRADE, pull positions, screenshot charts. Morning portfolio check — unattended. |
| **Puppeteer** | Free | Same as Playwright, Chrome-specific | Alternative to Playwright |
| **Selenium** | Free | Older browser automation | More widely supported, heavier |
| **n8n AI Agent nodes** | Included in n8n | AI agents inside n8n workflows | GABRIEL gets AI reasoning capability — agent receives HUNTER data and decides what to do next |
| **Zapier** | Free tier limited | No-code automation | Simpler than n8n but more limited |
| **Make (Integromat)** | Free tier | Visual automation builder | Alternative to n8n |

### DATA & EMBEDDING TOOLS

| Tool | Cost | What It Does | How It Fits |
|------|------|-------------|------------|
| **OpenAI Embeddings** | $0.02/1M tokens | Convert text to vectors | Embed all documents for RAG |
| **Ollama Embeddings** | Free, local | Same thing, runs locally | Free alternative — nomic-embed-text model |
| **Sentence Transformers** | Free, local | Python library for embeddings | Most popular open-source embedding library |
| **Unstructured** | Free | Parse any document format (PDF, DOCX, HTML, etc.) | Ingest all your protocols, reports, documents into the vector store |
| **Apache Tika** | Free | Document parsing | Alternative to Unstructured |

### MONITORING & OBSERVABILITY

| Tool | Cost | What It Does | How It Fits |
|------|------|-------------|------------|
| **LangSmith** | Free tier | Trace LLM calls, debug chains, monitor performance | See exactly what each agent is doing, how long it takes, what it costs, where it fails |
| **LangFuse** | Free, open source | Same as LangSmith, self-hosted | Privacy-first alternative |
| **Weights & Biases** | Free tier | Experiment tracking, model monitoring | Track cascade accuracy over time, A/B test scoring methods |
| **Helicone** | Free tier | LLM proxy — logging, caching, rate limiting | Put this in front of all API calls. Automatic caching saves money. Logging gives you audit trail. |

### REAL-TIME DATA & COMMUNICATION

| Tool | Cost | What It Does | How It Fits |
|------|------|-------------|------------|
| **Socket.io** | Free | WebSocket library (client + server) | WATCH PAGE real-time updates |
| **Pusher** | Free tier (200K messages/day) | Managed WebSocket service | Real-time without managing infrastructure |
| **SSE (native)** | Free | Server-sent events, built into HTTP | Simpler than WebSocket for one-way data push |
| **Redis** | Free (self-hosted) or cheap cloud | In-memory data store, pub/sub | Cache API responses, reduce duplicate calls, real-time message passing between services |
| **Upstash** | Free tier | Serverless Redis | Redis without managing a server |

---

## PART 4: THE POOR MAN'S STACK — $0/MONTH

Here's what you build with zero additional monthly cost, using only free tools and what you already have.

### Layer 1: Local Intelligence

```
OLLAMA (free)
├── Llama 3.1 8B or Mistral 7B — general agent
├── nomic-embed-text — embedding model for RAG
└── Runs on your workstation 24/7
```

### Layer 2: Collective Memory

```
CHROMADB (free, local)
├── Embed every protocol document
├── Embed every trade log entry
├── Embed every session carry-forward doc
├── Embed every thesis document
└── Any agent queries: "What was our XOVR entry rationale?" → exact answer
```

### Layer 3: Structured Data

```
SUPABASE (free tier) or SQLITE (free, local)
├── trades table — replaces trade_log.json
├── signals table — every signal from every source
├── cascade_scores table — every scoring run
├── portfolio_state table — daily snapshots
└── Full SQL query capability
```

### Layer 4: API Hosting

```
CLOUDFLARE WORKERS (free, 100K req/day)
├── /api/price — get live price (proxies TwelveData)
├── /api/insider — get insider trades (proxies Finnhub)
├── /api/cascade — run cascade scoring
├── /api/portfolio — get current positions
└── These ARE the MCP server endpoints
```

### Layer 5: Automation

```
GITHUB ACTIONS (free, 2000 min/mo)
├── Daily: Run IRONCLAD portfolio check
├── Daily: Generate morning briefing
├── On push: Validate protocol changes
├── Weekly: SENTINEL SWEEP — scan for new tools/capabilities
└── On trigger: Run test suites
```

### Layer 6: Pipeline Orchestration

```
N8N (existing) + CREWAI or LANGGRAPH (free)
├── n8n handles scheduling, triggers, webhooks
├── CrewAI/LangGraph handles agent-to-agent coordination
├── HUNTER feeds data → Local model pre-screens → Relevant signals forwarded to Collective
└── Cascade runs automatically, Principal reviews scores
```

### Layer 7: Browser Automation

```
PLAYWRIGHT (free)
├── Morning: Login to E*TRADE → screenshot positions → compare to IRONCLAD
├── On demand: Pull chart screenshots for COLOSSUS analysis
├── Weekly: Check all API key expiration dates
└── Monthly: Export trade history for records
```

### Layer 8: Monitoring

```
LANGFUSE (free, self-hosted) or HELICONE (free tier)
├── Log every API call across all agents
├── Track token usage and cost
├── Identify which queries cost the most
├── Cache frequently asked questions
└── Audit trail for every decision
```

### How It Connects — The Full Data Flow

```
                         ┌─────────────────────────┐
                         │     PRINCIPAL (You)      │
                         │   Chat Window Sessions   │
                         └────────────┬──────────────┘
                                      │
                    ┌─────────────────┼─────────────────────┐
                    │                 │                       │
                    ▼                 ▼                       ▼
              ┌──────────┐    ┌──────────┐            ┌──────────┐
              │  URIEL   │    │  MICHA   │            │ COLOSSUS │
              │  GPT-4o  │    │  Claude  │            │   Grok   │
              └────┬─────┘    └────┬─────┘            └────┬─────┘
                   │               │                       │
                   │    ┌──────────┴──────────┐           │
                   │    │   BRIDGE LAYER       │          │
                   │    │  (This is the new    │          │
                   │    │   piece we build)    │          │
                   │    └──────────┬──────────┘           │
                   │               │                       │
         ┌─────────┴───────────────┴───────────────────────┴──────┐
         │                 VECTOR MEMORY (ChromaDB)                 │
         │  Every protocol, trade, thesis, session doc — embedded  │
         │  Any agent queries → instant retrieval with sources     │
         └─────────────────────────┬───────────────────────────────┘
                                   │
         ┌─────────────────────────┴───────────────────────────────┐
         │                 STRUCTURED DATA (Supabase/SQLite)        │
         │  trades | signals | cascade_scores | portfolio_state    │
         │  Full SQL — "Show me all silver trades where cascade    │
         │  score was above 7 and we lost money"                   │
         └─────────────────────────┬───────────────────────────────┘
                                   │
         ┌─────────────────────────┴───────────────────────────────┐
         │                    PIPELINE LAYER                        │
         │                                                          │
         │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐    │
         │  │ GABRIEL   │  │ LOCAL    │  │ CLOUDFLARE         │    │
         │  │ (n8n)     │  │ OLLAMA   │  │ WORKERS (MCP)      │    │
         │  │           │  │          │  │                     │    │
         │  │ •HUNTER   │  │ •Screen  │  │ •/api/price         │    │
         │  │ •Triggers │  │ •Route   │  │ •/api/insider       │    │
         │  │ •Schedule │  │ •Embed   │  │ •/api/cascade       │    │
         │  │ •Alerts   │  │ •Check   │  │ •/api/portfolio     │    │
         │  └─────┬─────┘  └────┬─────┘  └─────────┬──────────┘    │
         │        │              │                    │               │
         │        └──────────────┴────────────────────┘               │
         │                       │                                    │
         │         ┌─────────────┴──────────────┐                    │
         │         │     EXTERNAL APIs           │                    │
         │         │ TwelveData | Finnhub        │                    │
         │         │ Perplexity | GitHub          │                    │
         │         │ SEC EDGAR | Congress.gov     │                    │
         │         └────────────────────────────┘                    │
         │                                                          │
         │  ┌──────────────────────────────────────────────────┐    │
         │  │ GITHUB ACTIONS                                    │    │
         │  │ •Daily IRONCLAD check  •Weekly SENTINEL SWEEP     │    │
         │  │ •Protocol validation   •Test suites               │    │
         │  └──────────────────────────────────────────────────┘    │
         │                                                          │
         │  ┌──────────────────────────────────────────────────┐    │
         │  │ PLAYWRIGHT                                        │    │
         │  │ •E*TRADE position pull  •Chart screenshots        │    │
         │  │ •API key expiry check   •Trade history export     │    │
         │  └──────────────────────────────────────────────────┘    │
         │                                                          │
         └──────────────────────────────────────────────────────────┘
                                   │
                                   ▼
         ┌──────────────────────────────────────────────────────────┐
         │                    MONITORING (LangFuse)                  │
         │  Token costs | API latency | Error rates | Audit trail  │
         └──────────────────────────────────────────────────────────┘
```

---

## PART 5: THE EXECUTION PLAN — SESSION BY SESSION

Every session is 2-3 hours. Each builds on the last. Nothing is theoretical — every session ends with something running.

### SESSION 1: Foundation — Local Model + Vector Memory
**Goal:** Ollama running, ChromaDB running, first documents embedded

- Check workstation GPU and RAM specs
- Install Ollama
- Pull Llama 3.1 8B (or Mistral 7B depending on hardware)
- Verify it runs and responds to queries via API
- Install ChromaDB (pip install chromadb)
- Write Python script to embed all protocol documents from A2E_Protocols repo
- Test semantic search: "What does IRONCLAD say about position sizing?" → exact answer
- Push script to new repo: A2E_Infrastructure

**Deliverable:** Local model running. Protocol memory searchable. Zero API cost.

### SESSION 2: Database Migration
**Goal:** trade_log.json → real database, queryable

- Set up Supabase free tier (or SQLite if you prefer local-only)
- Design schema: trades, signals, cascade_scores, portfolio_state
- Migrate trade_log.json data into trades table
- Write Python module for CRUD operations
- Test queries: "Win rate on silver trades" / "Average cascade score on winning trades"
- Push to A2E_Infrastructure

**Deliverable:** Real database. SQL queries on trade history. Foundation for analytics.

### SESSION 3: First MCP Endpoint — Price API
**Goal:** One working Cloudflare Worker that returns live price data

- Set up Cloudflare Workers account (free)
- Build /api/price endpoint — proxies TwelveData, adds caching
- Build /api/insider endpoint — proxies Finnhub
- Deploy both
- Test from command line and from n8n
- Document endpoints in A2E_Infrastructure README

**Deliverable:** Two live MCP endpoints. Any agent or workflow can call them. Free hosting.

### SESSION 4: Automated Cascade Scoring
**Goal:** Cascade score runs as code, not as conversation

- Write Python module: cascade_scorer.py
- Each gate is a function that returns a score + evidence
- Gate 1: Technical (calls /api/price)
- Gate 2: Fundamental (calls /api/insider)
- Gate 4: Macro (VIX, yields)
- Gate 7.5: Counter-thesis (uses local model to generate)
- Composite scorer aggregates gates
- Save results to cascade_scores table
- Push to AIORA repo

**Deliverable:** `python cascade_scorer.py XOVR` → full cascade score with evidence. Automated.

### SESSION 5: Morning Briefing Pipeline
**Goal:** Wake up to a pre-built intelligence summary

- GitHub Action: runs at 6 AM ET daily
- Pulls portfolio state from database
- Checks each position against IRONCLAD limits
- Runs cascade scorer on active theses
- Checks overnight news via Perplexity API (Sonar — cheap)
- Generates markdown briefing
- Sends via Telegram (or saves to repo)

**Deliverable:** Daily automated briefing. Before you sit down, the pipeline has already worked.

### SESSION 6: Agent Orchestration — CrewAI or LangGraph
**Goal:** Agents hand off tasks programmatically

- Install CrewAI (pip install crewai)
- Define agents: URIEL (synthesis), MICHA (analysis), COLOSSUS (technical)
- Define task: "Analyze XOVR for entry opportunity"
- Agent 1 runs technical analysis → passes to Agent 2 for fundamental check → Agent 3 synthesizes
- Output: structured analysis document with cascade score
- Test with 3 tickers
- Push framework to A2E_Infrastructure

**Deliverable:** Multi-agent pipeline that runs without you routing manually.

### SESSION 7: WATCH PAGE — Real-Time Dashboard
**Goal:** Live web page showing thesis tracking

- Set up basic React/Next.js app (or plain HTML + JS)
- Connect to Supabase real-time for live data updates
- Display: active theses, current prices (SSE or polling), cascade scores, IRONCLAD status
- Deploy to Vercel
- This IS the BULLSEYE inner ring come alive

**Deliverable:** Live dashboard. Open it on monitor 6. Always-on thesis tracking.

### SESSION 8: Browser Automation — E*TRADE Integration
**Goal:** Automated position monitoring

- Install Playwright
- Script: login to E*TRADE, navigate to positions, screenshot, extract data
- Compare positions to IRONCLAD limits
- Flag violations
- Run as part of morning briefing

**Deliverable:** Automated portfolio compliance check. No manual login required.

### SESSION 9: SENTINEL SWEEP — Capability Scanner
**Goal:** Never miss a tool or technology again

- GitHub Action: runs weekly (Sunday)
- Queries: Perplexity API for "new open source AI tools this week"
- Queries: GitHub trending repos in AI/ML
- Queries: Product Hunt AI launches
- Local model evaluates relevance to A2E
- Generates report: "New tools to evaluate this week"
- Sends via Telegram

**Deliverable:** Automated capability scanning. The gap that found this gap — closed.

### SESSION 10: Integration — Everything Connected
**Goal:** Full pipeline operational, documented, tested

- Connect all pieces: Ollama ↔ ChromaDB ↔ Supabase ↔ Cloudflare ↔ n8n ↔ GitHub Actions
- Run end-to-end test: HUNTER scan → signal detection → cascade scoring → briefing generation
- Document the full architecture
- Update BULLSEYE_RING_MAP to reflect deployed infrastructure
- Push everything

**Deliverable:** The poor man's stack — fully operational. $0/month. Running while you sleep.

---

## PART 6: WHAT THIS MEANS FOR TRADING

Once this stack is running, here's what changes:

**Before (today):**
1. You wake up
2. You open Claude, ChatGPT, Grok
3. You ask "what happened overnight?"
4. Agent searches, thinks, responds
5. You manually check positions
6. You manually run cascade logic in your head
7. You make a decision
8. Time from wake-up to decision: 45-90 minutes

**After (with the stack):**
1. You wake up
2. Telegram notification: "Morning briefing ready"
3. You read the briefing: overnight moves, IRONCLAD status, cascade scores updated, three signals flagged
4. You open WATCH PAGE on monitor 6: live prices, thesis tracking, green/yellow/red status
5. You open Claude: "MICHA, the briefing flagged a silver divergence. Run the thesis."
6. MICHA pulls from vector memory (your past silver analysis), pulls from database (your trade history on silver), pulls from MCP endpoints (current prices and insider data), and gives you a complete analysis grounded in YOUR data and YOUR history
7. You make a decision
8. Time from wake-up to decision: 10-15 minutes

That 30-75 minutes of saved time, every single day, compounds. Over a year, that's 180-450 hours of freed capacity. That's the PhD. That's the content engine. That's the consulting practice.

**The money math:**
- Avoided API costs from local model handling routine queries: ~$50-100/month saved
- Faster signal-to-action time: even 1 trade per month where you enter 15 minutes earlier could be worth hundreds
- Reduced missed signals: pipeline catches what you'd miss while sleeping
- Compounding intelligence: every trade, every analysis, every decision is stored, searchable, learnable

---

## PART 7: WHAT I DIDN'T COVER AND WHY

| Technology | Why I Skipped It | Revisit When |
|-----------|-----------------|--------------|
| Fine-tuning models | Expensive, needs thousands of examples, marginal benefit for our use case | When you have 1000+ trade analyses to train on |
| Kubernetes / Docker Swarm | Overkill for single-operator infrastructure | When/if you hire and need multi-user deployment |
| Terraform / IaC | Infrastructure-as-code for cloud deployment | When infrastructure gets complex enough to need version control |
| MLflow | ML experiment tracking | When building actual ML models (regime classification, etc.) |
| Spark / Dask | Big data processing | When data volume exceeds what Python + SQLite can handle (unlikely near-term) |
| Custom training | Training your own model from scratch | Never, for now. Use existing models. |
| Multi-GPU inference | Running models across multiple GPUs | When/if you build a dedicated inference server |
| Voice interfaces | Talking to agents instead of typing | When the pipeline is stable and you want hands-free operation |

---

*Every tool listed here is either free or under $5/month. The architecture is designed so that any piece can be swapped without breaking the rest. Start with Session 1. Build one layer at a time. Each session adds capability that compounds on the last.*

*The goal isn't to build the most impressive system. The goal is to build the system that makes you money while you sleep, learns from every decision, and never forgets what it learned.*

*"Loss is tuition for knowledge."*

🔱 ASHES2ECHOES, LLC — Newport News, Virginia  
*MICHA v10.4 | METATRON v10.6 | PHOENIX Active*  
*February 22, 2026*

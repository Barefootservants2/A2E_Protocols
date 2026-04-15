# CIL PYTHON BUILD SPEC v1.0
## Collective Intelligence Layer — Python Migration
### Handoff Document for Claude Code
### Date: April 15, 2026

---

## WHAT THIS IS

CIL is a multi-agent consensus engine. It takes a ticker symbol (and optional HUNTER market data), sends it to 5 LLM agents in parallel, collects their responses, runs a 9-gate validation cascade, and produces a scored consensus with PASS2 synthesis. It currently runs as 61 n8n nodes with 26 JavaScript Code nodes (76,755 chars JS). We are translating it to Python.

## SOURCE MATERIAL

All source code is at:
- `AIORA/CIL/CIL_COLLECTIVE_INTELLIGENCE_LAYER_v6.1.json` (full n8n workflow)
- `AIORA/CIL/prompts/` (6 agent prompt files)
- `AIORA/CIL/CIL_WIRING_GUIDE_v3.0.md`
- `AIORA/CIL/CIL_TEST_PAYLOADS.md`
- `A2E_Protocols/PYTHON_MIGRATION/` (migration spec, requirements)

GitHub: `github.com/Barefootservants2`

## TARGET STRUCTURE

```
a2e-platform/
├── cil/
│   ├── __init__.py
│   ├── engine.py          # Main orchestrator (replaces n8n flow)
│   ├── agents.py           # Agent API calls (5 agents + PASS2)
│   ├── parsers.py          # Response parsers (5 agent parsers)
│   ├── cascade.py          # 9-gate validation cascade
│   ├── synthesis.py        # PASS2 synthesis + fallback
│   ├── formatter.py        # Output formatting (Telegram, GitHub, JSON)
│   ├── validator.py        # Input validation
│   └── prompts/
│       ├── uriel.md
│       ├── colossus.md
│       ├── haniel.md
│       ├── raziel.md
│       ├── sariel.md
│       └── micha_synthesis.md
├── config/
│   ├── __init__.py
│   ├── settings.py         # env var loader
│   └── .env.example
├── tests/
│   ├── test_validator.py
│   ├── test_agents.py
│   ├── test_parsers.py
│   ├── test_cascade.py
│   ├── test_synthesis.py
│   ├── test_formatter.py
│   └── test_integration.py
├── requirements.txt
└── main.py                 # CLI entry point
```

---

## PIPELINE FLOW (translate this exactly)

```
INPUT (ticker + optional hunter_data)
  │
  ▼
VALIDATOR (validate ticker format, data freshness, required fields)
  │
  ▼
PASS1 ROUTER (Claude API → classify domain, set context)
  │
  ▼
PASS1 PARSER (extract domain classification)
  │
  ▼
AGENT PAYLOAD BUILDER (build 5 prompts with ticker + hunter data + domain)
  │
  ▼
PARALLEL AGENT CALLS (5 simultaneous):
  ├── URIEL (OpenAI GPT-4.1-mini) → URIEL PARSER
  ├── COLOSSUS (xAI Grok-4) → COLOSSUS PARSER
  ├── HANIEL (Google Gemini) → HANIEL PARSER
  ├── RAZIEL (DeepSeek) → RAZIEL PARSER
  └── SARIEL (Perplexity sonar-pro) → SARIEL PARSER
  │
  ▼
ERROR FILTER (per agent — pass valid, log errors)
  │
  ▼
MERGE / COLLECTIVE ASSEMBLER (combine all agent outputs)
  │
  ▼
CASCADE VALIDATOR (9-gate scoring)
  │
  ▼
CONSENSUS DECISION GATE (pass/fail based on gate score)
  │
  ▼ (if pass)
PASS2 BODY BUILDER → MICHA PASS2 SYNTHESIS (Claude API)
  │
  ▼
PASS2 RESULT CHECK → PASS2 RESPONSE PARSER
  │
  ▼ (if PASS2 fails)
PASS2 FALLBACK (OpenAI GPT)
  │
  ▼
OUTPUT FORMATTER → Telegram + GitHub + Webhook Response
```

---

## MODULE SPECS

### 1. validator.py

Translates: INPUT VALIDATOR (1,964 chars JS)

```python
def validate_input(ticker: str, hunter_data: dict = None) -> dict:
    """
    - Generate run_id: RUN-{timestamp}-{random4}
    - Validate ticker: 1-5 uppercase letters
    - If hunter_data present:
      - price > 0
      - volume > 0
      - timestamp < 24 hours old
    - Return: { run_id, ticker, hunter_data, timestamp }
    - Raise ValueError on any failure
    """
```

### 2. agents.py

Translates: AGENT PAYLOAD BUILDER (2,930 chars) + 5 HTTP Request nodes

```python
class AgentCaller:
    """Manages parallel API calls to 5 LLM agents"""
    
    AGENTS = {
        'URIEL': {
            'url': 'https://api.openai.com/v1/chat/completions',
            'model': 'gpt-4.1-mini',
            'auth_type': 'bearer',  # Authorization: Bearer {key}
            'prompt_file': 'prompts/uriel.md'
        },
        'COLOSSUS': {
            'url': 'https://api.x.ai/v1/chat/completions',
            'model': 'grok-4-1-fast-reasoning',
            'auth_type': 'bearer',
            'prompt_file': 'prompts/colossus.md'
        },
        'HANIEL': {
            'url': 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
            'model': 'gemini-2.5-flash',
            'auth_type': 'query_param',  # ?key={key}
            'prompt_file': 'prompts/haniel.md'
        },
        'RAZIEL': {
            'url': 'https://api.deepseek.com/chat/completions',
            'model': 'deepseek-chat',
            'auth_type': 'bearer',
            'prompt_file': 'prompts/raziel.md'
        },
        'SARIEL': {
            'url': 'https://api.perplexity.ai/chat/completions',
            'model': 'sonar-pro',
            'auth_type': 'bearer',
            'prompt_file': 'prompts/sariel.md'
        }
    }

    async def call_all(self, ticker, hunter_data, domain) -> dict:
        """Call all 5 agents in parallel using asyncio.gather()"""
    
    async def call_agent(self, name, config, payload) -> dict:
        """Single agent API call with timeout and error handling"""

    def build_payload(self, agent_name, ticker, hunter_data, domain) -> dict:
        """Build API-specific request body from prompt template + data"""
```

### 3. parsers.py

Translates: 5 parser nodes (URIEL/COLOSSUS/HANIEL/RAZIEL/SARIEL PARSER, ~6K chars each)

Each parser extracts structured data from agent response:
```python
@dataclass
class AgentResponse:
    agent: str
    direction: str          # BULLISH | BEARISH | NEUTRAL
    confidence: float       # 0-100
    catalysts: list[str]
    risks: list[str]
    timeline: str
    counter_thesis: str
    raw_text: str
    status: str             # SUCCESS | ERROR
    error: str = None

def parse_uriel(raw_response: dict) -> AgentResponse: ...
def parse_colossus(raw_response: dict) -> AgentResponse: ...
def parse_haniel(raw_response: dict) -> AgentResponse: ...
def parse_raziel(raw_response: dict) -> AgentResponse: ...
def parse_sariel(raw_response: dict) -> AgentResponse: ...
```

NOTE: Haniel (Google) has a different response structure than OpenAI-compatible APIs. The parser must handle `candidates[0].content.parts[0].text` vs `choices[0].message.content`.

### 4. cascade.py

Translates: CASCADE VALIDATOR (7,043 chars JS) — THIS IS THE BRAIN

```python
@dataclass
class GateResult:
    gate: str
    passed: bool
    score: float
    detail: str

@dataclass
class CascadeResult:
    gates: list[GateResult]
    total_score: float
    passed: bool
    consensus_direction: str
    avg_confidence: float

def run_cascade(agent_responses: list[AgentResponse], hunter_data: dict = None) -> CascadeResult:
    """
    9 GATES (from CASCADE VALIDATOR JS):
    
    Gate 1: QUORUM — At least 3 of 5 agents responded successfully
    Gate 2: DIRECTIONAL CONSENSUS — 3+ agents agree on direction (BULLISH/BEARISH)
    Gate 3: DATA COMPLETENESS — HUNTER data modules present (if provided)
    Gate 4: CONFIDENCE THRESHOLD — Average confidence >= 60%
    Gate 5: CATALYST PRESENT — At least 1 agent identified a catalyst
    Gate 6: TIMELINE ALIGNMENT — 3+ agents provided timeline
    Gate 7: COUNTER-THESIS — At least 1 agent provided counter-thesis
    Gate 7.5: COUNTER-THESIS QUALITY — Counter-thesis is substantive (>10 chars)
    Gate 8: NO KILL RISK — No agent flagged kill-level risks (fraud, delisting, bankruptcy)
    Gate 9: FINAL SCORE — Composite score >= 70% (weighted sum of all gates)
    
    Each gate: PASS = points, FAIL = 0
    Gate weights defined in the JS source.
    Total >= 70% → CONSENSUS ACHIEVED
    Total < 70% → REJECTED
    """
```

### 5. synthesis.py

Translates: PASS2 BODY BUILDER (3,121 chars) + PASS2 FALLBACK BODY BUILDER (3,027 chars) + PASS2 RESULT CHECK + PASS2 RESPONSE PARSER

```python
class Synthesizer:
    """PASS2: MICHA synthesis of collective output"""
    
    async def synthesize(self, agent_responses, cascade_result, ticker, hunter_data) -> dict:
        """
        Primary: Claude API (Anthropic)
        Fallback: OpenAI GPT
        
        Sends: all agent responses + cascade scores + hunter data
        Gets back: unified thesis, risk assessment, action recommendation
        """
    
    async def fallback_synthesize(self, ...) -> dict:
        """OpenAI fallback if Claude fails"""
```

### 6. formatter.py

Translates: OUTPUT FORMATTER (2,038 chars) + GITHUB STATUS + EMAIL BACKUP

```python
def format_telegram(result: dict) -> str:
    """HTML-formatted Telegram message with run ID, ticker, direction, score"""

def format_github(result: dict) -> dict:
    """JSON for GitHub archive push"""

def format_webhook(result: dict) -> dict:
    """JSON webhook response"""
```

### 7. engine.py

Translates: THE ENTIRE PIPELINE FLOW (orchestrator)

```python
class CILEngine:
    """Main orchestrator — replaces the n8n workflow"""
    
    def __init__(self, config: Settings):
        self.validator = Validator()
        self.agents = AgentCaller(config)
        self.cascade = CascadeRunner()
        self.synthesizer = Synthesizer(config)
        self.formatter = Formatter(config)
    
    async def run(self, ticker: str, hunter_data: dict = None) -> dict:
        """
        Full pipeline:
        1. Validate input
        2. PASS1 domain classification (Claude)
        3. Build agent payloads
        4. Call 5 agents in parallel
        5. Parse responses
        6. Run 9-gate cascade
        7. If pass → PASS2 synthesis
        8. Format output
        9. Deliver (Telegram + GitHub)
        10. Return result
        """
```

---

## ENV VARS REQUIRED

```
# Agent API Keys
OPENAI_API_KEY=           # URIEL + PASS2 fallback
XAI_API_KEY=              # COLOSSUS (Grok)
GOOGLE_AI_KEY=            # HANIEL (Gemini)
DEEPSEEK_API_KEY=         # RAZIEL
PERPLEXITY_API_KEY=       # SARIEL
ANTHROPIC_API_KEY=        # MICHA (PASS1 + PASS2 synthesis)

# Delivery
TELEGRAM_BOT_TOKEN=       # Hunter Alerts bot
TELEGRAM_CHAT_ID=8203545338
GITHUB_TOKEN=             # For archive pushes

# Optional
SUPABASE_URL=
SUPABASE_KEY=
```

---

## TEST SPEC

### Unit Tests (per module):
- `test_validator.py` — valid ticker, invalid ticker, stale data, missing fields
- `test_parsers.py` — mock each API response format, verify extraction
- `test_cascade.py` — 9 gate combinations: all pass, quorum fail, no consensus, kill risk
- `test_synthesis.py` — mock Claude response, mock fallback

### Integration Test:
- `test_integration.py` — full pipeline with mocked API responses (no live calls)
- Use CIL_TEST_PAYLOADS.md test tickers: AAPL, HYMC, SPY

### Live Smoke Test:
- Single ticker (AAPL) through full pipeline with real API calls
- Verify: Telegram delivery, GitHub push, webhook response

---

## CRITICAL RULES

1. Gate 7.5 (counter-thesis) is STRUCTURAL — every thesis needs a counter-thesis. This is what makes CIL different from competitors. Do not skip or weaken this gate.
2. RAZIEL must run AFTER synthesis in HUNTER (not parallel). In CIL standalone, RAZIEL runs parallel with others. The sequential requirement applies to HUNTER integration only.
3. All agent calls use 30-second timeout. Failed agents log error but don't block pipeline.
4. Minimum 3/5 agents must respond for cascade to run (Gate 1: Quorum).
5. Use `asyncio` and `aiohttp` for parallel agent calls.
6. Every run gets a unique run_id and is logged.

---

## DEPENDENCIES

```
aiohttp          # async HTTP for parallel agent calls
anthropic        # Claude API SDK (optional, can use aiohttp directly)
openai           # OpenAI SDK (optional, can use aiohttp directly)  
python-dotenv    # .env loading
pytest           # testing
pytest-asyncio   # async test support
```

Prefer raw `aiohttp` over SDK wrappers for consistency across all 5 agents.

---

## BUILD ORDER

1. `config/settings.py` + `.env.example` (5 min)
2. `cil/validator.py` + `tests/test_validator.py` (30 min)
3. `cil/agents.py` + `tests/test_agents.py` (1 hr — most complex)
4. `cil/parsers.py` + `tests/test_parsers.py` (1 hr)
5. `cil/cascade.py` + `tests/test_cascade.py` (1 hr — most critical)
6. `cil/synthesis.py` + `tests/test_synthesis.py` (45 min)
7. `cil/formatter.py` + `tests/test_formatter.py` (30 min)
8. `cil/engine.py` + `tests/test_integration.py` (1 hr)
9. `main.py` CLI entry point (15 min)
10. Live smoke test (15 min)

Estimated: 6-7 hours of Claude Code build time.

---

## ACCEPTANCE CRITERIA

- [ ] `pytest` passes all unit tests
- [ ] `python main.py --ticker AAPL` completes full pipeline
- [ ] Telegram message delivered with run ID and consensus
- [ ] GitHub archive push succeeds
- [ ] 9-gate cascade produces correct scores for test payloads
- [ ] PASS2 synthesis fires on consensus, fallback fires on primary failure
- [ ] Failed agent doesn't crash pipeline (graceful degradation)
- [ ] Run completes in < 60 seconds

---

*Spec authored by MICHA v10.7 | Source: CIL v6.1 (61 nodes, 76,755 chars JS)*
*All original JS source extracted to CIL_CODE_NODES_EXTRACTED.json*

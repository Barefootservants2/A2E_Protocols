# PHOENIX Quickstart — Any Agent, Any Platform

**You can deploy PHOENIX session continuity for any AI in six values.**
Works with OpenAI GPT, Anthropic Claude, xAI Grok, Google Gemini, DeepSeek, Perplexity, or any custom agent. The Python code is AI-agnostic — it only cares about your storage backend and your agent identity.

---

## The Six Values

```python
from phoenix import PhoenixConfig

config = PhoenixConfig(
    agent="URIEL",                              # 1. short uppercase agent name
    role="CEO / Strategic Director",            # 2. human-readable role
    storage_repo="Barefootservants2/A2E_Protocols",  # 3. owner/name of GitHub repo
    storage_dir="PHOENIX",                      # 4. subdirectory in repo
    github_token_env="GITHUB_TOKEN",            # 5. env var name for GitHub auth
    metatron_version_policy="LATEST",           # 6. "LATEST" to follow or "v10.8" to pin
)
```

That's it. Everything else (URLs, fetch paths, push paths, validation) is computed.

---

## What the Config Gives You (Properties)

```python
config.metatron_url              # → raw GitHub URL for METATRON (LATEST or pinned)
config.instructions_url          # → raw GitHub URL for agent instruction file (LATEST)
config.ironclad_url              # → raw GitHub URL for IRONCLAD risk protocol
config.carry_forward_latest_url  # → stable URL for the most recent PHOENIX close
config.bootstrap_fetch_urls()    # → [metatron, instructions, ironclad] — fetch on session start
config.token                     # → resolves env var at call time
config.validate()                # → [] if valid, else list of problems
```

---

## Session Lifecycle

### 1. Open Session

```python
from phoenix import open_session

state = open_session(
    session_id="URIEL-2026-04-18-session",
    metatron_version="v10.8",
)
```

### 2. During Session — Log Actions

```python
state.log_action("commit", "pushed feature X", evidence="abc123")
state.log_action("decision", "pivoted to Python for CIL")
state.log_action("todo", "finish docs", status="pending")
state.log_anomaly("flaky RAZIEL response time")
state.observe_text(user_message)   # track context chars for checkpointing
```

### 3. Checkpoint Detection

```python
from phoenix import should_checkpoint, CheckpointLevel, checkpoint_warning_message

level = should_checkpoint(state)
if level != CheckpointLevel.NONE:
    print(checkpoint_warning_message(level, state))
```

### 4. Close Session — Keyword `CLOSE SESSION`

```python
from phoenix import close_session

result = close_session(
    state,
    push_to_github=True,
    maintain_latest=True,         # ← overwrites PHOENIX_CARRYFORWARD_LATEST.md
    decisions=["decided X", "rejected Y"],
    restart_prompt="resume from commit abc123, priority was FastAPI layer",
    github_token=config.token,
    github_repo=config.storage_repo,
    github_dir=config.storage_dir,
)
# result.github has both {"dated": {...}, "latest": {...}} push results
```

### 5. Resume in New Session — Keyword `PHOENIX RESUME`

```python
from phoenix import fetch_latest_carry_forward, summarize_carry_forward

fetch = fetch_latest_carry_forward(
    token=config.token,
    repo=config.storage_repo,
    dir_path=config.storage_dir,
)
if fetch.found:
    print(summarize_carry_forward(fetch))
    # fetch.content has the full markdown
```

---

## Deploy for a Brand New Agent

```python
from collective.instructions import generate_bootstrap

# Generate AI-agnostic bootstrap that points at LATEST URLs
bootstrap = generate_bootstrap(agent="ORACLE", role_title="Custom Analyst")

# Push it
from phoenix.session import push_carry_forward
push_carry_forward(
    content=bootstrap,
    filename="ORACLE_BOOTSTRAP.md",
    repo="Barefootservants2/A2E_Protocols",
    dir_path="COLLECTIVE/BOOTSTRAP",
    token=config.token,
)
```

Any agent that reads this bootstrap at session start will fetch:
1. `METATRON_LATEST_PRIME_DIRECTIVE.md` (follows version bumps automatically)
2. `ORACLE_INSTRUCTIONS_LATEST.md` (their own role instructions)
3. `IRONCLAD_v2.1_AMENDMENT.md` (risk rules)
4. `PHOENIX_CARRYFORWARD_LATEST.md` (prior session state)

No version numbers hardcoded. No coordination needed when METATRON bumps.

---

## Three Keywords

| Keyword | What it does | Python call |
|---|---|---|
| `PHOENIX RESUME` | Fetch last carry-forward, show section summary, ask where to pick up | `fetch_latest_carry_forward()` + `summarize_carry_forward()` |
| `CLOSE SESSION` | Generate carry-forward, push to dated + LATEST, mark closed | `close_session(state, maintain_latest=True)` |
| `KILLSWITCH` | Halt immediately, raise `KillSwitchFired` — no override | `metatron.KillSwitchFired` |

---

## Deploy on a New Repo (Non-A2E)

PHOENIX works on any GitHub repo. Just change the config:

```python
config = PhoenixConfig(
    agent="MYAGENT",
    role="Analyst",
    storage_repo="YourOrg/YourProtocols",   # ← your repo
    storage_dir="SESSIONS",                 # ← your subdirectory
    github_token_env="MY_TOKEN_VAR",
)
```

Then the LATEST pointer lives at:
```
https://raw.githubusercontent.com/YourOrg/YourProtocols/main/SESSIONS/PHOENIX_CARRYFORWARD_LATEST.md
```

No vendor lock-in. Private or public repo. Any storage layout.

---

## Validate Config Before Running

```python
problems = config.validate()
if problems:
    for p in problems:
        print(f"CONFIG ERROR: {p}")
    raise SystemExit(1)
```

Catches: missing env var, lowercase agent name, bad repo format, invalid version policy, etc.

---

## Testing

The `tests/test_ai_agnostic.py` suite proves config works for:
- OpenAI (URIEL), xAI (COLOSSUS), Google (HANIEL), DeepSeek (RAZIEL), Perplexity (SARIEL), Anthropic (MICHA), and custom third-party agents
- Pinned and LATEST version policies
- Custom repos and directory layouts

---

## Current Live Deployment

A2E_Protocols is the reference deployment:
```
metatron LATEST:     https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/PROTOCOLS/PRODUCTION/METATRON_LATEST_PRIME_DIRECTIVE.md
phoenix LATEST:      https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/PHOENIX/PHOENIX_CARRYFORWARD_LATEST.md
bootstraps:          https://github.com/Barefootservants2/A2E_Protocols/tree/main/COLLECTIVE/BOOTSTRAP
```

All 7 Collective members (MICHA, URIEL, COLOSSUS, HANIEL, RAZIEL, SARIEL, GABRIEL) fetch the same LATEST URLs — no per-agent version coordination.

---

🔱 *PHOENIX Quickstart v1.0 — AI-agnostic session continuity*
*Uriel Covenant AI Collective | Ashes2Echoes LLC*

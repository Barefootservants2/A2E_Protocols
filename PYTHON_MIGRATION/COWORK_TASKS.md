# COWORK TASK LIST — CIL Build Support
## Parallel Tasks While Claude Code Builds CIL
### Date: April 15, 2026

---

## TASK 1: Extract Remaining n8n Workflows

Pull code nodes from these workflows (same process used for HUNTER/CIL):

| Workflow | ID | Priority |
|---|---|---|
| SIGNAL ENGINE v1.1 | R9GPabeNm26GgxKa | HIGH |
| FORGE ANVIL v3.0 | 3dfHb1fAg5ZkNmwV | MEDIUM |
| HUNTER MICRO v1.0 | rsS4DFbOgTRQvqTX | LOW |
| TOKEN KEEPER v1.0 | KhTkAxrCW1kZvgdV | LOW |
| TOKEN EXCHANGE v1.0 | kcngMMPBm5h0ZfTZ | LOW |

n8n API endpoint: `https://ashes2echoes.app.n8n.cloud/api/v1/workflows/{id}`
Header: `X-N8N-API-KEY: [stored in n8n settings]`

For each: download JSON, extract Code nodes, push to `A2E_Protocols/PYTHON_MIGRATION/`

## TASK 2: Push SENTINEL Code Nodes

SENTINEL code (36 nodes, 105,220 chars JS) was extracted but push failed due to file size.
Split into chunks and push to `A2E_Protocols/PYTHON_MIGRATION/SENTINEL_CODE_NODES/`

## TASK 3: Create a2e-platform Repo

If `Barefootservants2/a2e-platform` doesn't exist on GitHub:
- Create it (private)
- Add README.md with project description
- Add .gitignore (Python template)
- Add LICENSE (MIT)

## TASK 4: Copy Agent Prompts

Copy the 6 prompt files from `AIORA/CIL/prompts/` into the new `a2e-platform/cil/prompts/` directory.

## TASK 5: Create .env.example

Populate with all required env vars (no actual keys):
```
OPENAI_API_KEY=your_key_here
XAI_API_KEY=your_key_here
GOOGLE_AI_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here
PERPLEXITY_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
GITHUB_TOKEN=your_token_here
```

## TASK 6: Documentation

Create `a2e-platform/docs/`:
- `ARCHITECTURE.md` — system overview diagram
- `API_REFERENCE.md` — all agent API endpoints, auth methods, response formats
- `GATES.md` — 9-gate cascade documentation with scoring weights

---

*Tasks authored by MICHA v10.7 — April 15, 2026*

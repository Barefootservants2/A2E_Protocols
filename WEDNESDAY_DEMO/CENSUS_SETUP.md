# CENSUS Workflow — Credential Setup Guide
**Workflow ID:** `iiSNsL9AF4a6ZJKm`
**URL:** https://ashes2echoes.app.n8n.cloud/workflow/iiSNsL9AF4a6ZJKm
**Status:** INACTIVE (pending credential review)
**Built:** 2026-04-26 S4 overnight

## What this workflow does
POST a question to `/webhook/census` → workflow fans out to 6 LLM agents in parallel → aggregates → synthesizes with counter-thesis → returns JSON consensus.

## API endpoints used
| Agent | Provider | Endpoint |
|---|---|---|
| URIEL | OpenAI | `api.openai.com/v1/chat/completions` |
| MICHA | Anthropic | `api.anthropic.com/v1/messages` |
| HANIEL | Google | `generativelanguage.googleapis.com/...` |
| SARIEL | Perplexity | `api.perplexity.ai/chat/completions` |
| COLOSSUS | xAI | `api.x.ai/v1/chat/completions` |
| RAZIEL | DeepSeek | `api.deepseek.com/v1/chat/completions` |
| Synthesis | Anthropic | `api.anthropic.com/v1/messages` |

## Credentials needed in n8n

For each HTTP Request node, click the node → click "Select Credential" → either:
1. Select an existing credential if you already have it
2. Create new with the matching auth type

| Node | Auth type | Credential name pattern |
|---|---|---|
| URIEL (OpenAI) | OpenAI API | "OpenAI" or any existing OpenAI credential |
| MICHA (Claude) | Header Auth | name=`x-api-key`, value=your Anthropic key |
| HANIEL (Gemini) | Query Auth | name=`key`, value=your Gemini API key |
| SARIEL (Perplexity) | Header Auth | name=`Authorization`, value=`Bearer pplx-...` |
| COLOSSUS (Grok) | Header Auth | name=`Authorization`, value=`Bearer xai-...` |
| RAZIEL (DeepSeek) | Header Auth | name=`Authorization`, value=`Bearer sk-...` |
| Synthesis | Header Auth | same as MICHA — reuse credential |

## Test command
After activating the workflow, test from anywhere:

```bash
curl -X POST https://ashes2echoes.app.n8n.cloud/webhook/census \
  -H "Content-Type: application/json" \
  -d '{"question": "Should I increase exposure to AI semiconductor stocks given current valuations?"}'
```

You'll get back a JSON response with:
- `responses`: array of 6 agent answers with confidence + concern
- `synthesis`: consensus + counter_thesis + final_answer + final_confidence
- `agents.valid`: count of agents that responded successfully
- `avg_confidence`: average across valid agents

## Demo flow
1. Open the workflow URL in n8n UI
2. Click "Execute Workflow" with sample input pasted in webhook trigger
3. Watch all 6 agents light up in parallel
4. See aggregator merge results
5. See synthesis produce the final graded answer

## Failure modes
- **Any agent timeout** → returns null in that agent's record, aggregate continues with remaining agents
- **Synthesis missing counter_thesis** → flagged in response as `counter_thesis_present: false`
- **All agents fail** → `agents.valid: 0`, synthesis still attempts but on empty input

## Next steps after activation
- Wire it to the Welcome page on ashes2echoes.com (button: "Try the Census")
- Add to demo runner script for partner Wednesday demo
- Log responses to A2E_Intelligence repo for archive


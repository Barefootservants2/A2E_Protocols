# CLAUDE CODE BUILD INSTRUCTIONS — CIL Python
## Step-by-Step Execution Plan
### Date: April 15, 2026

---

## PREREQUISITES

1. Clone repo: `git clone https://github.com/Barefootservants2/AIORA.git`
2. Create working directory: `mkdir -p a2e-platform/cil/prompts a2e-platform/config a2e-platform/tests`
3. Copy prompts: `cp AIORA/CIL/prompts/*.md a2e-platform/cil/prompts/`
4. Install deps: `pip install aiohttp python-dotenv pytest pytest-asyncio`
5. Create `.env` from the `.env.example` (API keys must be populated)

## SOURCE REFERENCE

The original JavaScript source for every CIL code node is in:
`CIL_CODE_NODES_EXTRACTED.json` (26 nodes, 76,755 chars)

Each Python module maps to specific JS nodes. Translate the LOGIC, not the syntax. n8n-specific patterns (`$input.first().json`, `$('NodeName').first().json`) become function parameters.

---

## STEP 1: config/settings.py

```python
# Load from .env, validate all required keys present
# Required: OPENAI_API_KEY, XAI_API_KEY, GOOGLE_AI_KEY, 
#           DEEPSEEK_API_KEY, PERPLEXITY_API_KEY, ANTHROPIC_API_KEY,
#           TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, GITHUB_TOKEN
# Optional: SUPABASE_URL, SUPABASE_KEY
```

Test: `python -c "from config.settings import Settings; s = Settings(); print(s)"`

---

## STEP 2: cil/validator.py

Source: `INPUT VALIDATOR` node (1,964 chars JS)
- Translate run_id generation
- Translate ticker regex validation  
- Translate hunter_data sanity checks (price > 0, volume > 0, freshness < 24h)
- Write pytest: valid/invalid ticker, stale data, missing fields

---

## STEP 3: cil/agents.py

Source: `AGENT PAYLOAD BUILDER` node (2,930 chars JS) + 5 HTTP nodes
- Build async agent caller using aiohttp
- Each agent gets: system prompt (from .md file) + user message (ticker + data)
- CRITICAL: Haniel (Google) uses different API format:
  - URL: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}`
  - Body: `{ "contents": [{ "parts": [{ "text": "..." }] }], "generationConfig": { "temperature": 0.3 } }`
  - NOT OpenAI-compatible
- All others (URIEL, COLOSSUS, RAZIEL, SARIEL) use OpenAI-compatible format:
  - Body: `{ "model": "...", "messages": [{ "role": "system", "content": "..." }, { "role": "user", "content": "..." }] }`
- Use asyncio.gather() with return_exceptions=True for parallel calls
- 30-second timeout per agent
- Write pytest with mocked responses

---

## STEP 4: cil/parsers.py

Source: 5 parser nodes (~6K chars each)
- Each parser extracts: direction, confidence, catalysts, risks, timeline, counter_thesis
- Agents return MARKDOWN or JSON in their response text
- Parser must handle both structured JSON responses and freeform markdown
- Pattern: try JSON parse first, fall back to regex/keyword extraction
- HANIEL response path: `candidates[0].content.parts[0].text`
- Others response path: `choices[0].message.content`
- Write pytest with sample responses for each agent format

---

## STEP 5: cil/cascade.py (MOST CRITICAL)

Source: `CASCADE VALIDATOR` node (7,043 chars JS)
- This is the 9-gate scoring engine. Translate EXACTLY.
- Gate definitions from the JS:

```
Gate 1: QUORUM           — validAgents.length >= 3
Gate 2: CONSENSUS         — bullCount >= 3 OR bearCount >= 3
Gate 3: DATA COMPLETENESS — hunterData modules present (if provided)
Gate 4: CONFIDENCE        — avgConfidence >= 60
Gate 5: CATALYST          — at least 1 agent has catalysts
Gate 6: TIMELINE          — 3+ agents provided timeline
Gate 7: COUNTER-THESIS    — at least 1 agent has counter_thesis
Gate 7.5: CT QUALITY      — counter_thesis length > 10 chars
Gate 8: NO KILL RISK      — no agent flagged fraud/delisting/bankruptcy
Gate 9: FINAL SCORE       — weighted composite >= 70%
```

- Write pytest covering: all pass, quorum fail, split consensus, kill risk present, weak counter-thesis

---

## STEP 6: cil/synthesis.py

Source: `PASS2 BODY BUILDER` (3,121 chars) + `PASS2 FALLBACK BODY BUILDER` (3,027 chars) + `PASS2 RESULT CHECK` + `PASS2 RESPONSE PARSER`
- Primary: Anthropic Claude API for synthesis
- Fallback: OpenAI GPT if Claude fails
- Input: all agent responses + cascade scores + hunter data
- Output: unified thesis, risk assessment, recommended action
- Write pytest with mocked synthesis responses

---

## STEP 7: cil/formatter.py

Source: `OUTPUT FORMATTER` (2,038 chars) + `GITHUB STATUS` (1,370 chars)
- Telegram: HTML-formatted message (bold headers, score display, agent summary)
- GitHub: JSON file pushed to AIORA repo via GitHub API
- Webhook: JSON response for API consumers
- Write pytest for each format

---

## STEP 8: cil/engine.py

Source: THE ENTIRE N8N FLOW (connection map)
- Wire everything together in the correct sequence
- Handle the PASS2 router: if PASS2 succeeds → merge with cascade, if fails → fallback
- Handle the consensus decision gate: if cascade passes → proceed to PASS2, if fails → rejection alert
- Write integration test with fully mocked APIs

---

## STEP 9: main.py

```python
# CLI entry point
# Usage: python main.py --ticker AAPL
# Usage: python main.py --ticker AAPL --hunter-data '{"price": 150.0, "volume": 1000000}'
# Runs full pipeline, prints result, delivers to Telegram + GitHub
```

---

## STEP 10: SMOKE TEST

```bash
# Run all unit tests
pytest tests/ -v

# Live test with one ticker
python main.py --ticker AAPL

# Verify:
# 1. Telegram message received in Hunter Alerts chat
# 2. GitHub file created in AIORA repo
# 3. Console output shows 9-gate scores
# 4. Run completed in < 60 seconds
```

---

## COMMIT STRATEGY

After each module + tests pass:
```bash
git add .
git commit -m "CIL Python: {module_name} + tests"
git push origin main
```

Final commit after smoke test:
```bash
git commit -m "CIL Python v1.0: Full pipeline operational"
git push origin main
```

Target repo: `Barefootservants2/a2e-platform` (create if doesn't exist)

---

*Build spec by MICHA v10.7 — April 15, 2026*

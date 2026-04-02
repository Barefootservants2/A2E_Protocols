# A2E Platform — Credential Registry
> Raw key values are NOT stored here. Keys live in n8n credential store and session memory.
> This file tracks labels, expiry, endpoints, and usage locations.

## n8n REST API
- **Label:** n8n_API_KEY_04022026
- **Instance:** https://ashes2echoes.app.n8n.cloud/api/v1/
- **Header:** X-N8N-API-KEY
- **Expires:** ~Jan 29 2027 (JWT iat: 1775110278 / exp: 1790740800)
- **Usage:** Direct workflow deploy/update — see MICHA session protocol

## GitHub (Claude MCP Access)
- **Label:** Claude_MCP_Access
- **Expires:** Jul 3 2026
- **Usage:** All A2E_Protocols repo reads/writes. Regenerate in Barefootservants2 settings if expired.
- **Note if regenerated:** Update .env in github-mcp-server

## Perplexity — SARIEL
- **Label:** SARIEL_PERPLEXITY
- **Model:** sonar-pro
- **Endpoint:** api.perplexity.ai/chat/completions

## Unusual Whales — Trial
- **Label:** UW_API_TRIAL
- **Trial start:** ~Apr 2 2026 | **Window:** 7 calendar days
- **Auth format:** Authorization: Bearer {key}
- **Confirmed endpoint:** /api/congress/recent-trades
- **n8n credential name:** UW API Key (httpHeaderAuth)
- **Decision deadline:** ~Apr 9 2026 — assess Ring 4 signal lift before renewal

## n8n Environment Variables (confirmed active)
- CONGRESS_API_KEY
- FRED_API_KEY
- FEC_API_KEY
- METALS_DEV_KEY
- CIL_WEBHOOK_URL
- UW_API (new — added this session)

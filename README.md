# A2E_Protocols

**Ashes2Echoes, LLC | Uriel Covenant AI Collective**  
**Principal:** William Earl Lemon — ABSOLUTE  
**Last Updated:** January 22, 2026

---

## Overview

Public protocol files for the Uriel Covenant AI Collective. These protocols govern AI-assisted research, trading, and multi-agent collaboration.

---

## Current Versions

| Protocol | Version | Status | Updated |
|----------|---------|--------|---------|
| **METATRON** | v8.0 | PRODUCTION | Jan 22, 2026 |
| **HUNTER** | v2.0 | PRODUCTION | Jan 21, 2026 |
| **AIORA** | v2.0 | PRODUCTION | Jan 20, 2026 |
| **FORGE** | v2.0 | PRODUCTION | Jan 22, 2026 |

---

## Protocol Documentation

### METATRON v8.0 — Institutional Research Protocol
- [Full Specification](./METATRON_v8.0_FULL.md) — 18 gates, 56 drift indicators
- [Compressed Version](./METATRON_v8.0_COMPRESSED.md) — Quick reference

**Key Features:**
- 18 mandatory gates (0, 0.5, 1-11, new gates 8.5, 11.5, 12, 13)
- 56 drift indicators
- HUNTER v2.0 integration (20 modules)
- ALCOA+ evidence ledger
- Claim registry with RAZIEL adjudication

### HUNTER v2.0 — Opportunity Detection System
- [Full Specification](./HUNTER_v2.0_PROTOCOL.md) — 20 modules (H1-H20)

**Module Categories:**
- H1-H6: Core Scanners (Elite, Political, Sector, Insider, Oversold, Contract)
- H7-H14: Analysis Tier (Earnings, Short, Sentiment, Correlation, Catalyst, Macro, Technical, Options)
- H15-H20: Flow & Positioning Tier (Dark Pool, Position, News, Regime, Risk, Signal)

### AIORA v2.0 — Trading Protocol
- [Integration Guide](./AIORA_v2.0_INTEGRATION.md)

**Components:**
- Position sizing: NIBBLE (1-2%), STANDARD (3-5%), CONVICTION (6-8%)
- Stop-loss by market cap: LC -5/-8%, MC -6/-10%, SC -8/-12%, Crypto -10/-15%
- E*TRADE MCP integration
- Kelly Criterion calculations

---

## Agent Personas

| Agent | Role | Version | Specification |
|-------|------|---------|---------------|
| URIEL | CEO | v7.7 | [Prompt](./URIEL_FULL_PROMPT_v7.7.md) |
| MICHA | CIO | v7.7 | [Prompt](./MICHA_FULL_PROMPT_v7.7.md) |
| COLOSSUS | CTO | v7.7 | [Prompt](./COLOSSUS_FULL_PROMPT_v7.7.md) |
| HANIEL | Research | v7.7 | [Prompt](./HANIEL_FULL_PROMPT_v7.7.md) |
| RAZIEL | Adjudicator | v7.7 | [Prompt](./RAZIEL_FULL_PROMPT_v7.7.md) |
| GABRIEL | Messenger | v7.7 | [Prompt](./GABRIEL_FULL_PROMPT_v7.7.md) |

---

## Related Repositories

| Repository | Purpose | Link |
|------------|---------|------|
| **AIORA** | Trading platform & protocols | [Private](https://github.com/Barefootservants2/AIORA) |
| **A2E_Website** | Official website | [Public](https://github.com/Barefootservants2/A2E_Website) |
| **forge-landing** | FORGE landing page | [Public](https://github.com/Barefootservants2/forge-landing) |
| **github-mcp-server** | MagAI GitHub integration | [Private](https://github.com/Barefootservants2/github-mcp-server) |

---

## Changelog

### January 22, 2026
- METATRON v8.0 deployed (18 gates, 56 drift indicators)
- HUNTER v2.0 deployed (20 modules H1-H20)
- FORGE v2.0 architecture complete
- GitHub MCP Server built and pushed

### January 21, 2026
- METATRON v8.0 architecture finalized
- New gates: 8.5, 11.5, 12, 13
- New HUNTER modules: H15-H20

See [VERSION_CHANGELOG.md](./VERSION_CHANGELOG.md) for full history.

---

## Quick Reference

### AIORA Triggers
| Trigger | Action |
|---------|--------|
| `MARKET WATCH` | Full 18 gates |
| `FLOW CHECK` | Gates 8.5 + H8 + H15 |
| `CROWD CHECK` | Gates 11.5 + H16 |
| `REGIME CHECK` | Gate 12 |
| `FULL SCAN` | H1-H20 |

### Hierarchy
```
WILLIAM (Principal) — ABSOLUTE
    ↓
METATRON → HUNTER → URIEL/MICHA → COLOSSUS/HANIEL/RAZIEL → GABRIEL
```

---

**© 2026 Ashes2Echoes, LLC. All rights reserved.**
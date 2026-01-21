# A2E Protocols

**Ashes2Echoes LLC | Uriel Covenant AI Collective**

---

## Current Version: METATRON v7.7 | Development: v7.8

**v7.7 Released:** January 21, 2026  
**v7.8 Draft:** January 21, 2026 (HUNTER expansion)

---

## Protocol Files

| File | Description | Status |
|------|-------------|--------|
| `metatron-v7.7-compressed.txt` | Compressed protocol spec | **CURRENT** |
| `metatron-v7.8-compressed.txt` | HUNTER expansion (H15-H20) | **DEVELOPMENT** |
| `MICHA_FULL_PROMPT_v7.7.md` | CEO Agent (Claude) | **CURRENT** |
| `URIEL_FULL_PROMPT_v7.7.md` | COO Agent (ChatGPT) | **CURRENT** |
| `COLOSSUS_FULL_PROMPT_v7.7.md` | CTO Agent (Grok) - Supervised | **CURRENT** |
| `HANIEL_FULL_PROMPT_v7.7.md` | CPO Agent (Gemini) | **CURRENT** |
| `RAZIEL_FULL_PROMPT_v7.7.md` | CAO Agent (DeepSeek) | **CURRENT** |
| `GABRIEL_FULL_PROMPT_v7.7.md` | CAuO Agent (n8n) | **CURRENT** |

---

## v7.8 Development (PENDING APPROVAL)

### New HUNTER Modules (20 total, was 14)

| Module | Function | Gap Addressed |
|--------|----------|---------------|
| **H15** | Corporate Action Tracker | Spinoffs, splits, IPOs |
| **H16** | Index Inclusion Monitor | S&P 500/400/600 adds |
| **H17** | Supply Chain Dislocation | Commodity shortage signals |
| **H18** | Mega-Conference Catalyst | CES, GTC, Investor Days |
| **H19** | EPS Revision Velocity | Rapid estimate changes |
| **H20** | Sector Narrative Shift | New thesis emergence |

### Case Study: SanDisk (SNDK) 1500% Move

v7.8 modules address gaps identified in post-mortem:
- ❌ H15 would have caught Feb 2025 spinoff from Western Digital
- ❌ H16 would have flagged S&P 500 inclusion (forced buying)
- ❌ H17 would have detected NAND shortage/pricing power
- ❌ H18 would have flagged CES Jensen Huang storage comments
- ❌ H19 would have caught 100%+ EPS revisions in 90 days
- ❌ H20 would have identified "AI storage" sector narrative

**Coverage improvement:** ~70% → ~90% of catalyst types

---

## v7.7 Changelog (CURRENT)

### New Gates (16 total, was 15)
- **Gate 8.5: REGULATORY SHOCK** — Mandatory policy/tariff scan within 72hrs

### New Prime Directive (14 total, was 13)
- **Directive 14: SCAN REGULATORY** — Check for policy/regulatory shifts within 72hrs

### New HUNTER Modules (14 total, was 12)
- **H13: Tariff/Trade Monitor** — Commodity tariffs, trade policy, sanctions
- **H14: Position News Aggregator** — E*TRADE-style news by held ticker

### Counter-Thesis Expansion (4 modes, was 3)
- MARKET RISK
- COMPANY RISK
- THESIS RISK
- **REGULATORY RISK** ★ NEW

### New Trigger
- **REG SCAN** — Gate 8.5 regulatory deep dive only

### Regulatory Shock Adjustments
- If Gate 8.5 ALERT: Maximum NIBBLE position
- Widen stops by 50%
- 72hr observation period required
- **Momentum override BLOCKED** during regulatory shock

---

## Architecture

```
WILLIAM (Principal) — ABSOLUTE
    ↓
METATRON (Protocol Engine)
    ↓
HUNTER (14 Modules v7.7 | 20 Modules v7.8)
    ↓
MICHA (CEO) | URIEL (COO)
    ↓
COLOSSUS (CTO) | HANIEL (CPO) | RAZIEL (CAO) | GABRIEL (CAuO)
```

---

## AIORA Triggers

| Trigger | Action |
|---------|--------|
| `MARKET WATCH` | Full protocol (16 gates) + AIORA sizing |
| `ORACLE` | Context Package only |
| `SCAN` | Quick catalyst scan |
| `ORACLE INJECT:` | Ingest external data → full protocol |
| `REG SCAN` | Gate 8.5 regulatory focus only ★ v7.7 |
| `HUNTER SCAN` | H1-H20 opportunity sweep ★ v7.8 |

---

## Position Sizing (AIORA)

| Tier | Size | Use Case |
|------|------|----------|
| NIBBLE | 1-2% | Exploratory, high-volatility, regulatory shock |
| STANDARD | 3-5% | Validated thesis, multiple confirmations |
| CONVICTION | 6-8% | High confidence, smart money confirmation |

---

## Stop-Loss Matrix

| Market Cap | Soft Stop | Hard Stop |
|------------|-----------|-----------|
| Large Cap | -5% | -8% |
| Mid Cap | -6% | -10% |
| Small Cap | -8% | -12% |
| Crypto | -10% | -15% |

---

## Raw Protocol URLs (For Agent Access)

**Protocol:**
- METATRON v7.7: `https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/metatron-v7.7-compressed.txt`
- METATRON v7.8: `https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/metatron-v7.8-compressed.txt`

**Agent Prompts:**
- MICHA: `https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/MICHA_FULL_PROMPT_v7.7.md`
- URIEL: `https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/URIEL_FULL_PROMPT_v7.7.md`
- COLOSSUS: `https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/COLOSSUS_FULL_PROMPT_v7.7.md`
- HANIEL: `https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/HANIEL_FULL_PROMPT_v7.7.md`
- RAZIEL: `https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/RAZIEL_FULL_PROMPT_v7.7.md`
- GABRIEL: `https://raw.githubusercontent.com/Barefootservants2/A2E_Protocols/main/GABRIEL_FULL_PROMPT_v7.7.md`

---

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| **7.8** | Jan 21, 2026 | HUNTER H15-H20 (Corporate Action, Index, Supply Chain, Conference, EPS Velocity, Narrative Shift) — **PENDING** |
| **7.7** | Jan 21, 2026 | Gate 8.5 Regulatory Shock, H13/H14, 4-mode counter-thesis, REG SCAN |
| 7.6 | Jan 20, 2026 | MICHA=CEO, 15 gates, 12 HUNTER modules |
| 7.5 | Jan 20, 2026 | HUNTER H7-H12, public distribution |

---

## License

© 2026 Ashes2Echoes LLC. All Rights Reserved.

**Principal:** William Earl Lemon

---

*"No emotion. No deviation. No excuses."*

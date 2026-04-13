# SIGNAL ENGINE v1.0 — DEPLOYMENT STATUS
## Date: April 13, 2026

### WORKFLOW
- **ID:** G4mrmnbJyC3qcQ9k
- **URL:** https://ashes2echoes.app.n8n.cloud/workflow/G4mrmnbJyC3qcQ9k
- **Status:** DEPLOYED (inactive, needs manual test + Telegram node)
- **Schedule:** 6:30 AM ET (Mon-Fri) — cron `30 10 * * 1-5`
- **Node Count:** 7 (8 after Telegram added)

### NODES
1. Schedule 6:30AM ET (scheduleTrigger)
2. Manual Test (manualTrigger)
3. SE Alpha — UW + FRED + PutCall (Code, LIVE API calls)
4. SE Bravo — COT + EIA + COMEX (Code, LIVE API calls)
5. Signal Feed Merge (Merge, append mode)
6. Signal Generator v1.0 (Code, scoring engine)
7. Trade Card Formatter (Code, Telegram message builder)
8. **TODO:** Send Signal Card (Telegram, chatId 8203545338)

### REMAINING STEPS
1. **Add Telegram node manually** in n8n UI
   - Type: Telegram > Send Message
   - Chat ID: 8203545338
   - Text: `{{ $json.text }}`
   - Credential: Use existing Telegram credential from HUNTER
   - Wire: Trade Card Formatter → Send Signal Card
2. **Manual test execution** — click Manual Test, verify all 6 feeds return data
3. **Fix any API errors** — Nasdaq Data Link may need different endpoint format
4. **Activate workflow** once test passes
5. **Paper trade 5 days** — compare signals vs actuals

### API KEYS EMBEDDED IN CODE NODES
- UW: 33128e70-c3c6-4ef2-9bc1-d7e7a802aed5
- FRED: c0f3927517cedb8c7447a97c00bb9c89
- EIA: EjSx0le1nWJ30mu5zI8pYSFsDG8IGyBYqMa6ktoB
- Nasdaq Data Link: 5xiqd9uTcvXFF8S98Df7

### ARCHITECTURE
```
Schedule (6:30AM) ─┐
                   ├─→ SE Alpha (UW+FRED+P/C) ─→ Merge ─→ Signal Generator ─→ Formatter ─→ Telegram
Manual Trigger ────┘   SE Bravo (COT+EIA+COMEX) ─↗
```

### DATA FEEDS (6 total)
| Feed | Source | API | Update Freq |
|------|--------|-----|-------------|
| Unusual Whales | Options flow | Bearer token | Real-time |
| FRED API | DXY, 10Y, VIX, etc | API key | Daily |
| Put/Call Ratio | CBOE via FRED | API key | Daily |
| CFTC COT | Commitment of Traders | Nasdaq Data Link | Weekly (Fri) |
| EIA Weekly | Crude inventory | EIA API | Weekly (Wed) |
| COMEX Inventory | Silver/Gold vault | Nasdaq Data Link | Daily |

### SCORING WEIGHTS
- Flow (UW): 30%
- Positioning (COT): 20%
- Supply (EIA+COMEX): 15%
- Thesis: 15%
- Macro (FRED): 10%
- Sentiment (P/C): 10%

### IRONCLAD v3.0 ENFORCEMENT
- Min confidence: 70%
- Max cards/day: 3
- Kill Switch: DXY + Yields both adverse = NO SIGNALS
- Stop: -5% universal
- Sizing: T1=50%, T2=50%

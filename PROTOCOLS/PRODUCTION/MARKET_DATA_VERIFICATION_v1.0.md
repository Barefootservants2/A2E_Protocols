# MARKET DATA VERIFICATION PROTOCOL v1.0

**Version:** 1.0 | **Effective:** February 10, 2026
**Classification:** MANDATORY — Every MARKET WATCH Run
**Authority:** Principal Directive (post-stale-data incident, Feb 10)

---

## PROBLEM STATEMENT

Claude's web search returns articles and cached quotes that can be hours old. Presenting stale data as current market intelligence has led to incorrect position calls (e.g., "expect green at open" when MCX was already printing red). This has occurred three times in three weeks as of Feb 10, 2026.

**Root cause:** Web search results are not real-time. Search engines return articles ranked by relevance, not recency. A 6-hour-old rally story ranks higher than a 30-minute-old reversal signal.

---

## PROTOCOL EXECUTION

### RULE 1: TIMESTAMP EVERY QUOTE
- Before presenting ANY price, verify the timestamp
- If timestamp is older than 30 minutes during market hours → flag as **UNVERIFIED**
- If timestamp cannot be determined → state explicitly: "UNVERIFIED — DO NOT TRADE ON THIS"

### RULE 2: LEADING MARKETS FIRST
Scan in this order (each market leads the next):
1. **Shanghai/China** (SGE, SHFE) — overnight signal for metals
2. **India/MCX** — second-largest physical market
3. **London/LBMA** — European session
4. **US pre-market/futures** (Globex, COMEX) — last

If Shanghai is down and London is down, do NOT present a "bullish overnight" assessment just because yesterday's US close was green.

### RULE 3: UNIFORM RESULTS = RED FLAG
- If all search results tell the same story → likely stale/cached
- Actively search for the DISSENTING signal
- "All sources agree" is not confirmation — it's an echo chamber warning

### RULE 4: FRESHNESS DECLARATION
Every market data presentation must include:

```
DATA FRESHNESS CHECK:
├── Source: [name]
├── Timestamp: [exact time if available]
├── Age: [minutes/hours old]
├── Freshness Rating: LIVE (<30min) | DELAYED (30min-2hr) | STALE (>2hr)
└── Trading Decision Safe: YES/NO
```

### RULE 5: CAPABILITY BOUNDARY
Claude is NOT a market terminal. Acknowledge this honestly:
- **Claude CAN do:** Thesis analysis, pattern recognition, structural research, protocol execution, earnings analysis, historical comparisons
- **Claude CANNOT do:** Real-time quotes, tick-by-tick data, sub-minute market signals
- If the question requires real-time data that cannot be verified, say so

---

## LAYERED ROUTING SOLUTION (Future State)

When the tiered agent architecture is deployed:

```
HAIKU WORKER → Pulls raw data, checks timestamps, flags freshness
SONNET AGENT → Consolidates verified data, runs analysis
OPUS (MICHA) → Receives only pre-verified, timestamped intelligence
```

This eliminates the problem at the architecture level. Until then, manual verification rules above apply.

---

## INCIDENT LOG

| Date | Incident | Impact | Lesson |
|------|----------|--------|--------|
| ~Jan 27, 2026 | Stale data presented as current | Incorrect position expectation | First occurrence |
| ~Feb 3, 2026 | Cached rally articles used in scan | Missed overnight reversal signal | Second occurrence |
| Feb 10, 2026 | "Expect green at open" based on stale sources | MCX already red; positions opened underwater | Third occurrence — protocol created |

---

*This protocol exists because three failures taught the same lesson.*
*"Loss is tuition for knowledge."*

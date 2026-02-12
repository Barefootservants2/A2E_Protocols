# INTELLIGENCE SOURCE EXPANSION v1.0

**Version:** 1.0 | **Effective:** February 12, 2026
**Classification:** ORACLE / HUNTER Enhancement
**Status:** PLANNED — Requires n8n workflow integration

---

## PROBLEM STATEMENT

Current ORACLE/HUNTER intelligence gathering relies primarily on:
- Perplexity (SERAPH) for web research
- Finnhub for market data
- TwelveData for price feeds
- Congress.gov for legislative data

This misses critical signal channels that move markets and inform thesis decisions.

---

## NEW INTELLIGENCE SOURCES (Approved for Integration)

### TIER 1 — HIGH PRIORITY

| Source | Type | Signal Value | Integration Method |
|--------|------|-------------|-------------------|
| **YouTube Transcripts** | Video → Text | Expert analysis, earnings calls, macro commentary | yt-dlp + whisper transcript → n8n |
| **Quiver Quant** | Congressional trading | Insider government trades (STOCK Act data) | API or scrape → HUNTER H30-H35 chain |
| **Ground News** | Bias detection | Left/right/center coverage comparison for events | API → ORACLE bias scoring |
| **FRED (Federal Reserve)** | Economic data | Official macro indicators | API → HUNTER macro nodes |

### TIER 2 — MEDIUM PRIORITY

| Source | Type | Signal Value | Integration Method |
|--------|------|-------------|-------------------|
| **SEC EDGAR (Enhanced)** | Filings | 13F, 10-K, 8-K for position holdings | Already in HUNTER; expand parsing |
| **CME Group** | Exchange data | Margin requirements, delivery data, COT | Web scrape or API |
| **Shanghai Gold Exchange** | Premium data | Physical vs paper disconnect | Web scrape → SILVER PATTERN |
| **USGS** | Mineral reports | Supply data, critical mineral designations | Manual/quarterly check |

### TIER 3 — FUTURE STATE

| Source | Type | Signal Value | Integration Method |
|--------|------|-------------|-------------------|
| **X/Twitter Firehose** | Social sentiment | Real-time market panic/euphoria | Grok (COLOSSUS) integration |
| **Financial Survival Network** | Podcast/video | Specialist metals/macro commentary | YouTube transcript pipeline |
| **Eric Sprott interviews** | Specialist signal | Whale accumulation patterns | YouTube transcript pipeline |
| **LinkedIn signals** | Professional network | Industry insider commentary | Manual curation |

---

## YOUTUBE TRANSCRIPT PIPELINE (Proposed Architecture)

```
TRIGGER: Daily schedule OR manual channel check
    ↓
STEP 1: yt-dlp pulls latest videos from curated channel list
    ↓
STEP 2: Whisper (or YouTube auto-captions) generates transcript
    ↓
STEP 3: Haiku agent extracts key claims, numbers, predictions
    ↓
STEP 4: Sonnet agent cross-references against current thesis
    ↓
STEP 5: Flagged insights routed to MICHA for decision integration
```

**Curated Channel List (Initial):**
- Financial Survival Network
- Kitco News
- BullionStar
- Peter Schiff
- Eric Sprott interviews (across channels)
- Fed press conferences (official)

---

## PRINCIPAL'S NOTE ON SOCIAL MEDIA

William acknowledges skepticism toward social media as an intelligence source. However, specific channels and sources provide intrinsic value when:
1. The source has a verifiable track record
2. The signal is data-backed, not opinion
3. The information can be cross-referenced against other sources
4. Bias is identified and accounted for (Ground News integration)

Social media is SIGNAL, not THESIS. It informs, it does not decide.

---

## INTEGRATION REQUIREMENTS

1. n8n workflow nodes for each new source
2. API keys: Ground News, Quiver Quant (if available)
3. yt-dlp and whisper installed on processing server
4. HUNTER wiring document update to include new data flows
5. ORACLE protocol update to reference new sources in research runs

---

## RESOURCE INVESTIGATION (Pending)

Per Principal directive, the following resources are pending investigation for A2E LLC:
- findhelp.org — local assistance programs
- sba.gov/local-assistance — SBA grants and support
- careeronestop.org — workforce development
- needymeds.org — transplant medication assistance
- **Grants only, no loans**

---

*"The intelligence you don't gather is the risk you can't see."*

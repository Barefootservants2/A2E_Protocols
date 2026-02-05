# 🔱 OPENBB INTEGRATION REFERENCE
## METATRON v10.2 | Evaluated January 22, 2026 | Status: PENDING INTEGRATION
## Classification: DATA LAYER — OpenBB is a data pipe, not a decision engine

---

## EXECUTIVE SUMMARY

OpenBB is an open-source financial data orchestration platform that unifies ~100 data providers under a single API. It has native MCP server support, meaning it can plug directly into Claude and the Uriel Covenant collective.

**Key finding:** OpenBB could replace individual Finnhub/TwelveData/FMP/FRED API integrations with a single unified layer. METATRON remains the sole decision authority. OpenBB is replaceable; METATRON is not.

**Verification:** 59K+ GitHub stars, 6,777 commits, 254 contributors, release 4.6.0 (Jan 2025). Apache/AGPLv3 license.

---

## WHAT OPENBB PROVIDES

### Unified API Access
```python
from openbb import obb

# Historical prices — swap provider with one parameter
data = obb.equity.price.historical("HYMC", provider="yfinance")
data = obb.equity.price.historical("PSLV", provider="polygon")

# News from any provider
news = obb.news.company("SLV", provider="benzinga")

# Options chains
chains = obb.derivatives.chains("SLV")

# FRED economic data
fed = obb.economy.fred_series("DFF")
```

### Available Routers
| Router | Function | HUNTER Modules Served |
|--------|----------|-----------------------|
| `obb.equity` | Price, fundamentals, screener, ownership | H1, H3, H5, H7, H11, H12, H22 |
| `obb.derivatives` | Options chains, unusual activity, Greeks | H8, H13, HM6 |
| `obb.economy` | FRED data, CPI, rates, calendar | H27, HG6 |
| `obb.news` | Company + world news | H2, H16, H26 |
| `obb.crypto` | Historical, search | Crypto thesis |
| `obb.fixedincome` | Treasury rates, bond indices | H27, HG6 |
| `obb.technical` | 50+ indicators built-in | H7, H8, H9, HM3 |
| `obb.quantitative` | Sharpe, Sortino, CAPM, unit root | Backtesting |

### Data Providers Available (~100)
Polygon, Yahoo Finance, FMP, Intrinio, Benzinga, Alpha Vantage, Tiingo, TMX, Tradier, FRED, and many more — all standardized.

---

## MCP SERVER DEPLOYMENT

```bash
pip install openbb[all]
openbb-mcp --transport streamable-http
# Server starts on http://127.0.0.1:8001
```

This plugs directly into Claude via MCP. The collective could query OpenBB through Claude's native MCP support.

---

## HUNTER MODULE REPLACEMENT MAP

| HUNTER Module | Current API | OpenBB Replacement |
|---|---|---|
| H1 Elite Investor | Finnhub `/institutional-ownership` | `obb.equity.ownership.major_holders()` + `obb.regulators.sec.form13f()` |
| H3 Sector Momentum | Finnhub manual | `obb.equity.screener()` + `obb.technical.rsi()` |
| H4 Insider Detection | Finnhub `/insider-transactions` | `obb.equity.ownership.insider_trading()` |
| H5 Earnings | Finnhub `/earnings` | `obb.equity.estimates.consensus()` |
| H7 Price/Volume | TwelveData `/time_series` | `obb.equity.price.historical()` |
| H8 RSI/Technical | TwelveData `/rsi` | `obb.technical.rsi()` + 50 more indicators |
| H15-H20 Flow | Various | `obb.derivatives.chains()` + unusual activity |
| H27 Macro | FRED (pending) | `obb.economy.fred_series()` |

---

## ADDITIONAL OPEN-SOURCE TOOLS EVALUATED

| Library | Source | Value | Integration Priority |
|---|---|---|---|
| **gs-quant** | Goldman Sachs | Derivatives pricing, risk analytics, timeseries | TIER 1 |
| **vollib** | Open source | Options pricing, IV, Greeks | TIER 1 |
| **ffn** | Open source | Financial functions, backtesting metrics | TIER 2 |
| **tf-quant-finance** | Google | GPU-accelerated Monte Carlo, pricing | TIER 2 |

### gs-quant (Goldman Sachs)
- 9.5K GitHub stars, Apache 2.0 license
- Python toolkit for quantitative finance built on GS risk platform
- Timeseries analytics directly applicable to HUNTER momentum modules
- `pip install gs-quant`

---

## ARCHITECTURE: BEFORE vs AFTER

### Current (Individual APIs)
```
HUNTER H1 → Finnhub API
HUNTER H7 → TwelveData API
HUNTER H27 → FRED API (not wired)
HUNTER HM7 → FMP API (not wired)
Each module = separate integration, separate auth, separate error handling
```

### After OpenBB Integration
```
HUNTER H1 ─┐
HUNTER H7 ─┤
HUNTER H27 ├─→ OpenBB Data Layer (single API) → 100 providers
HUNTER HM7 ─┤
ALL modules ─┘
```

---

## COUNTER-THESIS (Gate 7.5)

**MARKET RISK:** AGPLv3 license — modifications to core must be open-sourced. Fine for internal use, complex if commercializing data layer.

**COMPANY RISK:** OpenBB pivoted from Terminal to Platform. API stability in transition period uncertain. Monitor release cadence.

**THESIS RISK:** Most quant libraries are derivatives-focused. Current thesis is equity/commodity. Limited direct application unless expanding to options strategies.

**INTEGRATION RISK:** Adding OpenBB layer adds complexity. If it breaks, all HUNTER modules break simultaneously. Individual API integrations provide redundancy.

---

## RECOMMENDATION

**Phase 1 (Now):** Continue individual API integrations — they work, they're proven, they're in the BUILD GUIDE.
**Phase 2 (Month 2):** Deploy OpenBB as parallel data layer. Test against individual APIs for accuracy/speed.
**Phase 3 (Month 3):** If OpenBB proves reliable, migrate HUNTER modules to OpenBB as primary with individual APIs as fallback.

OpenBB is not urgent but it IS the future architecture. Build with individual APIs now. Unify with OpenBB later.

---

🔱 **OPENBB INTEGRATION REFERENCE — COMPLETE**
**Data pipe evaluation. METATRON decides. OpenBB fetches.**

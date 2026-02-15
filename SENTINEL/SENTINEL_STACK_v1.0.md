# SENTINEL STACK v1.0 — Social Intelligence & Gamma Detection

## METATRON v10.3 | Ashes2Echoes, LLC | February 2026

---

## PURPOSE

Detect high-quality financial DD (due diligence) posts, social momentum signals, and market structure transitions (gamma flips) BEFORE they become consensus trades. Three layers operating in concert through n8n automation.

**The Gap This Fills:** Your friend caught the "Strike Price Symphony" GME analysis because he monitors Reddit manually. SENTINEL automates that surveillance and adds two layers he doesn't have — social sentiment velocity and dealer gamma positioning.

---

## ARCHITECTURE OVERVIEW

```
LAYER 1: REDDIT DD SCANNER (H24)
    │
    ├── Polls r/Superstonk, r/wallstreetbets, r/stocks every 15 min
    ├── Filters: DD flair, engagement velocity, content depth
    ├── LLM scoring pass for analytical rigor
    │
    ▼
LAYER 2: SOCIAL SENTIMENT VELOCITY (H16b + Pillar 6.3/6.8)
    │
    ├── Finnhub social sentiment API (Reddit + Twitter)
    ├── Mention velocity tracking (acceleration, not just volume)
    ├── Cross-reference with Layer 1 trending tickers
    │
    ▼
LAYER 3: GAMMA EXPOSURE MONITOR (H13b)
    │
    ├── Unusual Whales options flow (paid — active through June 2026)
    ├── GEX flip detection (positive → negative gamma transition)
    ├── Cross-reference with Layer 1+2 flagged tickers
    │
    ▼
ALERT AGGREGATION → Discord / Email
    │
    ├── Single-layer alert: Informational
    ├── Two-layer convergence: Watchlist addition
    └── Three-layer convergence: PRIORITY — immediate review
```

---

## LAYER 1: REDDIT DD SCANNER (H24)

### Node: H24-A — Reddit OAuth Token Manager

**Type:** n8n HTTP Request (runs every 55 minutes to refresh token)

**Purpose:** Maintain valid OAuth2 bearer token for Reddit API access.

**Setup Required (ONE TIME):**
1. Go to https://www.reddit.com/prefs/apps
2. Click "create another app"
3. Select "script" type
4. Name: `A2E_SENTINEL`
5. Redirect URI: `http://localhost:8080`
6. Save the `client_id` (under app name) and `client_secret`

**HTTP Request Node Config:**

| Field | Value |
|-------|-------|
| Method | POST |
| URL | `https://www.reddit.com/api/v1/access_token` |
| Authentication | Basic Auth |
| Username | `[client_id from step 5]` |
| Password | `[client_secret from step 5]` |
| Content-Type | `application/x-www-form-urlencoded` |
| Body | `grant_type=password&username=[reddit_username]&password=[reddit_password]` |
| Header: User-Agent | `A2E_SENTINEL/1.0 by Ashes2Echoes` |

**Output:** `access_token` — store in n8n credentials or workflow variable.

**Rate Limit:** Reddit allows 100 QPM with OAuth. We'll use ~4 QPM (polling 3 subreddits every 15 min + rising sort). Well within limits.

---

### Node: H24-B — Subreddit Rising DD Scanner

**Type:** n8n HTTP Request (runs every 15 minutes via Cron trigger)

**Purpose:** Pull new and rising DD posts from target subreddits.

**Subreddit Targets (3 nodes, one per sub):**

| Subreddit | Endpoint | Why |
|-----------|----------|-----|
| r/Superstonk | `oauth.reddit.com/r/Superstonk/rising.json?limit=25` | Deep DD, institutional-grade analysis |
| r/wallstreetbets | `oauth.reddit.com/r/wallstreetbets/rising.json?limit=25` | High-velocity meme + occasional diamond DD |
| r/stocks | `oauth.reddit.com/r/stocks/rising.json?limit=25` | More traditional analysis, sector rotation |

**HTTP Request Config (per subreddit):**

| Field | Value |
|-------|-------|
| Method | GET |
| URL | `https://oauth.reddit.com/r/[SUBREDDIT]/rising.json?limit=25` |
| Header: Authorization | `Bearer [access_token from H24-A]` |
| Header: User-Agent | `A2E_SENTINEL/1.0 by Ashes2Echoes` |

**Response Fields We Extract:**

| Field | JSONPath | Use |
|-------|----------|-----|
| Title | `data.children[*].data.title` | DD topic identification |
| Score | `data.children[*].data.score` | Engagement velocity |
| Upvote Ratio | `data.children[*].data.upvote_ratio` | Quality signal (>0.85 = strong) |
| Flair | `data.children[*].data.link_flair_text` | Filter for "DD", "Due Diligence", "Technical Analysis" |
| Created UTC | `data.children[*].data.created_utc` | Age calculation |
| Num Comments | `data.children[*].data.num_comments` | Discussion depth |
| Selftext | `data.children[*].data.selftext` | Full post body for LLM scoring |
| Author | `data.children[*].data.author` | Track repeat high-quality posters |
| URL | `data.children[*].data.url` | Link to post |
| Permalink | `data.children[*].data.permalink` | Direct link for alert |

---

### Node: H24-C — Engagement Velocity Filter

**Type:** n8n Code Node (JavaScript)

**Purpose:** Calculate engagement velocity and filter for high-signal posts.

**Logic:**

```javascript
// H24-C: Engagement Velocity Filter
// Filters Reddit posts for high-signal DD content

const posts = $input.all();
const now = Math.floor(Date.now() / 1000);
const filtered = [];

for (const post of posts) {
  const data = post.json;
  const ageMinutes = (now - data.created_utc) / 60;
  
  // Skip posts older than 6 hours
  if (ageMinutes > 360) continue;
  
  // Calculate velocity metrics
  const scorePerMinute = data.score / Math.max(ageMinutes, 1);
  const commentsPerMinute = data.num_comments / Math.max(ageMinutes, 1);
  
  // FLAIR FILTER: Must be DD-related
  const ddFlairs = ['DD', 'Due Diligence', 'Technical Analysis', 
                     'Possible DD', 'Education', 'Data'];
  const flair = data.link_flair_text || '';
  const isDDFlair = ddFlairs.some(f => 
    flair.toLowerCase().includes(f.toLowerCase())
  );
  
  // VELOCITY THRESHOLDS
  // Tier 1: Explosive (>5 score/min in first hour) — immediate alert
  // Tier 2: Strong (>2 score/min OR >1 comment/min) — queue for LLM
  // Tier 3: Emerging (>0.5 score/min with DD flair) — monitor
  
  let tier = 0;
  if (scorePerMinute > 5 && ageMinutes < 60) tier = 1;
  else if (scorePerMinute > 2 || commentsPerMinute > 1) tier = 2;
  else if (scorePerMinute > 0.5 && isDDFlair) tier = 3;
  
  if (tier > 0) {
    filtered.push({
      json: {
        ...data,
        sentinel_tier: tier,
        sentinel_velocity: scorePerMinute.toFixed(2),
        sentinel_comment_velocity: commentsPerMinute.toFixed(2),
        sentinel_age_minutes: Math.round(ageMinutes),
        sentinel_is_dd: isDDFlair,
        sentinel_url: `https://reddit.com${data.permalink}`
      }
    });
  }
}

// Sort by tier (1 first), then by velocity
filtered.sort((a, b) => {
  if (a.json.sentinel_tier !== b.json.sentinel_tier) 
    return a.json.sentinel_tier - b.json.sentinel_tier;
  return parseFloat(b.json.sentinel_velocity) - parseFloat(a.json.sentinel_velocity);
});

return filtered;
```

---

### Node: H24-D — LLM Quality Scorer (Tier 1 & 2 only)

**Type:** n8n HTTP Request to Anthropic API (or OpenAI)

**Purpose:** Score DD post content for analytical rigor vs. speculation.

**API Call:**

| Field | Value |
|-------|-------|
| Method | POST |
| URL | `https://api.anthropic.com/v1/messages` |
| Header: x-api-key | `[Anthropic API key]` |
| Header: anthropic-version | `2023-06-01` |
| Header: Content-Type | `application/json` |

**Body:**

```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 500,
  "system": "You are a financial DD quality scorer. Score the following Reddit post on a 1-10 scale for ANALYTICAL RIGOR. Return ONLY valid JSON. Scoring criteria: 10=Academic-grade with data, citations, methodology. 7-9=Strong quantitative analysis with specific data points. 4-6=Mixed speculation and data. 1-3=Pure speculation, no data. Also extract: any ticker symbols mentioned, the core thesis in one sentence, and whether the post references institutional data sources (SEC filings, OPRA, TAQ, 13F, EDGAR, etc).",
  "messages": [{
    "role": "user",
    "content": "TITLE: {{title}}\n\nBODY (first 3000 chars): {{selftext_truncated}}\n\nReturn JSON: {\"score\": N, \"tickers\": [], \"thesis\": \"\", \"institutional_data\": boolean, \"data_sources\": []}"
  }]
}
```

**Cost:** Claude Haiku at ~$0.25/M input tokens. At 25 posts/15 min × 4/hour × 16 hours = ~1,600 calls/day × ~1K tokens avg = ~1.6M tokens/day = ~$0.40/day. Negligible.

**Filter:** Only pass posts scoring 6+ to alert aggregation. Posts scoring 8+ get Tier 1 priority regardless of Reddit engagement.

---

### Node: H24-E — Ticker Extraction & Dedup

**Type:** n8n Code Node

**Purpose:** Extract mentioned tickers, deduplicate against recent alerts (prevent spam on same topic).

```javascript
// H24-E: Extract tickers and deduplicate
const items = $input.all();
const results = [];

// Simple dedup using workflow static data (resets on workflow restart)
const seen = $workflow.staticData.seen_posts || {};
const now = Date.now();

// Clean entries older than 24 hours
for (const key in seen) {
  if (now - seen[key] > 86400000) delete seen[key];
}

for (const item of items) {
  const postId = item.json.id || item.json.name;
  
  // Skip if we've already processed this post
  if (seen[postId]) continue;
  seen[postId] = now;
  
  // Extract tickers from LLM response + regex fallback
  let tickers = item.json.llm_tickers || [];
  
  // Regex: $TICKER or standalone 1-5 char uppercase in financial context
  const tickerRegex = /\$([A-Z]{1,5})\b/g;
  const bodyTickers = [...(item.json.selftext || '').matchAll(tickerRegex)]
    .map(m => m[1]);
  const titleTickers = [...(item.json.title || '').matchAll(tickerRegex)]
    .map(m => m[1]);
  
  tickers = [...new Set([...tickers, ...bodyTickers, ...titleTickers])];
  
  results.push({
    json: {
      ...item.json,
      sentinel_tickers: tickers,
      sentinel_source: 'LAYER1_REDDIT_DD'
    }
  });
}

$workflow.staticData.seen_posts = seen;
return results;
```

---

## LAYER 2: SOCIAL SENTIMENT VELOCITY (H16b)

### Node: H16b-A — Finnhub Social Sentiment Scanner

**Type:** n8n HTTP Request (runs every 30 minutes)

**Purpose:** Track Reddit + Twitter mention velocity for watchlist tickers AND any tickers flagged by Layer 1.

**Endpoint:** `https://finnhub.io/api/v1/stock/social-sentiment`

| Field | Value |
|-------|-------|
| Method | GET |
| URL | `https://finnhub.io/api/v1/stock/social-sentiment` |
| Query: symbol | `[ticker]` — loop through watchlist + Layer 1 tickers |
| Query: from | `[24 hours ago, YYYY-MM-DD]` |
| Query: to | `[today, YYYY-MM-DD]` |
| Query: token | `[Finnhub API key]` |

**Response Structure:**

```json
{
  "reddit": [
    {
      "atTime": "2026-02-15T12:00:00Z",
      "mention": 150,
      "positiveScore": 0.82,
      "negativeScore": 0.08,
      "positiveMention": 120,
      "negativeMention": 12,
      "score": 0.82
    }
  ],
  "twitter": [similar structure]
}
```

**Key Metrics to Track:**

| Metric | Calculation | Signal |
|--------|-------------|--------|
| Mention Velocity | `current_hour_mentions / previous_hour_mentions` | >3x = acceleration |
| Sentiment Shift | `current_positive_score - 24h_avg_positive_score` | >0.15 = sentiment flip |
| Reddit/Twitter Divergence | `reddit_sentiment - twitter_sentiment` | >0.3 = information asymmetry |
| Absolute Volume | `total_mentions_24h` | >500 = critical mass |

**Rate Limit Consideration:** Finnhub free tier = 60 calls/minute. Scanning 30 tickers every 30 min = 1 call/min. Well within limits.

---

### Node: H16b-B — Velocity Spike Detector

**Type:** n8n Code Node

**Purpose:** Compare current sentiment data against rolling 7-day baseline to detect anomalous spikes.

```javascript
// H16b-B: Sentiment velocity spike detection
const items = $input.all();
const baselines = $workflow.staticData.sentiment_baselines || {};
const alerts = [];

for (const item of items) {
  const symbol = item.json.symbol;
  const redditMentions = item.json.reddit_mentions_24h || 0;
  const redditSentiment = item.json.reddit_sentiment || 0;
  
  // Initialize or update rolling baseline
  if (!baselines[symbol]) {
    baselines[symbol] = {
      mention_history: [],
      sentiment_history: [],
      last_alert: 0
    };
  }
  
  const bl = baselines[symbol];
  bl.mention_history.push(redditMentions);
  bl.sentiment_history.push(redditSentiment);
  
  // Keep 7 days of data (336 data points at 30-min intervals)
  if (bl.mention_history.length > 336) bl.mention_history.shift();
  if (bl.sentiment_history.length > 336) bl.sentiment_history.shift();
  
  // Calculate baselines (need minimum 48 data points = 1 day)
  if (bl.mention_history.length < 48) continue;
  
  const avgMentions = bl.mention_history.reduce((a,b) => a+b, 0) / bl.mention_history.length;
  const avgSentiment = bl.sentiment_history.reduce((a,b) => a+b, 0) / bl.sentiment_history.length;
  
  // Standard deviation for mentions
  const mentionStdDev = Math.sqrt(
    bl.mention_history.reduce((sum, val) => sum + Math.pow(val - avgMentions, 2), 0) 
    / bl.mention_history.length
  );
  
  // SPIKE DETECTION
  const mentionZScore = mentionStdDev > 0 ? (redditMentions - avgMentions) / mentionStdDev : 0;
  const sentimentDelta = redditSentiment - avgSentiment;
  
  // Alert conditions
  const isMentionSpike = mentionZScore > 2.5;  // 2.5 sigma event
  const isSentimentFlip = Math.abs(sentimentDelta) > 0.2;
  const isVolumeBreakout = redditMentions > avgMentions * 3;
  
  // Cooldown: don't alert same ticker more than once per 4 hours
  const now = Date.now();
  if (now - bl.last_alert < 14400000) continue;
  
  if (isMentionSpike || isSentimentFlip || isVolumeBreakout) {
    bl.last_alert = now;
    alerts.push({
      json: {
        symbol,
        sentinel_source: 'LAYER2_SOCIAL_VELOCITY',
        mention_zscore: mentionZScore.toFixed(2),
        sentiment_delta: sentimentDelta.toFixed(3),
        current_mentions: redditMentions,
        baseline_mentions: Math.round(avgMentions),
        volume_multiple: (redditMentions / Math.max(avgMentions, 1)).toFixed(1),
        alert_type: isMentionSpike ? 'MENTION_SPIKE' : 
                    isSentimentFlip ? 'SENTIMENT_FLIP' : 'VOLUME_BREAKOUT',
        timestamp: new Date().toISOString()
      }
    });
  }
}

$workflow.staticData.sentiment_baselines = baselines;
return alerts.length > 0 ? alerts : [{ json: { no_alerts: true } }];
```

---

## LAYER 3: GAMMA EXPOSURE MONITOR (H13b)

### Node: H13b-A — Unusual Whales Options Flow

**Type:** n8n HTTP Request (runs every 15 minutes during market hours)

**Purpose:** Monitor unusual options flow for GEX transitions and large gamma-shifting trades.

**Endpoint:** `https://api.unusualwhales.com/api/option-trades/flow`

| Field | Value |
|-------|-------|
| Method | GET |
| URL | `https://api.unusualwhales.com/api/option-trades/flow` |
| Header: Authorization | `Bearer [UW API key]` |
| Query: limit | `50` |

**Filter Focus (Code Node H13b-B):**

```javascript
// H13b-B: GEX-relevant flow filter
const trades = $input.all();
const gexAlerts = [];

for (const trade of trades) {
  const t = trade.json;
  
  // Focus on trades that shift dealer gamma positioning
  const isLargeNotional = (t.premium || 0) > 100000;  // >$100K premium
  const isNearTerm = daysTilExpiry(t.expiry) < 30;     // Near-term = high gamma
  const isATM = Math.abs(t.strike - t.underlying_price) / t.underlying_price < 0.05; // Within 5% of spot
  
  // Dealer gamma impact estimation
  // Retail BUYS calls → dealer SELLS calls → dealer goes SHORT gamma
  // Retail BUYS puts → dealer SELLS puts → dealer goes SHORT gamma (on downside)
  // Large institutional SELLS → dealer BUYS → dealer goes LONG gamma
  
  const isRetailBuy = t.side === 'BUY' && t.order_type !== 'BLOCK';
  const isInstitutionalSell = t.side === 'SELL' && t.order_type === 'BLOCK';
  
  // High gamma impact: large, near-term, ATM
  if (isLargeNotional && isNearTerm && isATM) {
    gexAlerts.push({
      json: {
        symbol: t.ticker,
        sentinel_source: 'LAYER3_GAMMA_FLOW',
        trade_type: t.put_call,
        side: t.side,
        premium: t.premium,
        strike: t.strike,
        expiry: t.expiry,
        underlying_price: t.underlying_price,
        gamma_impact: isRetailBuy ? 'DEALER_SHORT_GAMMA' : 
                      isInstitutionalSell ? 'DEALER_LONG_GAMMA' : 'NEUTRAL',
        days_to_expiry: daysTilExpiry(t.expiry),
        moneyness: ((t.strike - t.underlying_price) / t.underlying_price * 100).toFixed(1) + '%',
        timestamp: new Date().toISOString()
      }
    });
  }
}

function daysTilExpiry(expiry) {
  return Math.ceil((new Date(expiry) - new Date()) / 86400000);
}

return gexAlerts.length > 0 ? gexAlerts : [{ json: { no_alerts: true } }];
```

---

### Node: H13b-C — GEX Aggregation & Flip Detection

**Type:** n8n Code Node

**Purpose:** Aggregate per-ticker gamma flow to detect when dealer positioning flips from long to short gamma (the "thermostat breaking" from the DD post).

```javascript
// H13b-C: Aggregate gamma flow per ticker, detect flips
const flows = $input.all().filter(i => !i.json.no_alerts);
const gexState = $workflow.staticData.gex_state || {};
const alerts = [];

for (const flow of flows) {
  const sym = flow.json.symbol;
  if (!gexState[sym]) {
    gexState[sym] = {
      short_gamma_count: 0,
      long_gamma_count: 0,
      net_premium_direction: 0,
      last_state: 'UNKNOWN',
      history: []
    };
  }
  
  const state = gexState[sym];
  
  if (flow.json.gamma_impact === 'DEALER_SHORT_GAMMA') {
    state.short_gamma_count++;
    state.net_premium_direction -= flow.json.premium;
  } else if (flow.json.gamma_impact === 'DEALER_LONG_GAMMA') {
    state.long_gamma_count++;
    state.net_premium_direction += flow.json.premium;
  }
  
  // Determine current gamma state
  const ratio = state.short_gamma_count / Math.max(state.long_gamma_count, 1);
  let currentState = 'NEUTRAL';
  if (ratio > 2) currentState = 'SHORT_GAMMA_DOMINANT';
  else if (ratio < 0.5) currentState = 'LONG_GAMMA_DOMINANT';
  
  // DETECT FLIP: The "Liquidity Phase Transition"
  if (state.last_state === 'LONG_GAMMA_DOMINANT' && 
      currentState === 'SHORT_GAMMA_DOMINANT') {
    alerts.push({
      json: {
        symbol: sym,
        sentinel_source: 'LAYER3_GEX_FLIP',
        alert_type: 'LIQUIDITY_PHASE_TRANSITION',
        direction: 'LONG_TO_SHORT',
        severity: 'CRITICAL',
        short_gamma_trades: state.short_gamma_count,
        long_gamma_trades: state.long_gamma_count,
        net_premium: state.net_premium_direction,
        message: `${sym}: Dealer gamma positioning FLIPPED from LONG to SHORT. Volatility amplification regime. The thermostat just broke.`,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  state.last_state = currentState;
  state.history.push({ state: currentState, time: Date.now() });
  
  // Keep 24h of history
  state.history = state.history.filter(h => Date.now() - h.time < 86400000);
}

// Daily reset of counts at market open
const hour = new Date().getUTCHours();
if (hour === 14) { // 9:30 AM ET ≈ 14:30 UTC
  for (const sym in gexState) {
    gexState[sym].short_gamma_count = 0;
    gexState[sym].long_gamma_count = 0;
    gexState[sym].net_premium_direction = 0;
  }
}

$workflow.staticData.gex_state = gexState;
return alerts.length > 0 ? alerts : [{ json: { no_alerts: true } }];
```

---

## ALERT AGGREGATION — CONVERGENCE ENGINE

### Node: SENTINEL-AGG — Cross-Layer Convergence

**Type:** n8n Code Node (receives from all three layers via Merge node)

**Purpose:** Detect when multiple layers fire on the same ticker = high-conviction signal.

```javascript
// SENTINEL-AGG: Cross-layer convergence detection
const allAlerts = $input.all().filter(i => !i.json.no_alerts);
const byTicker = {};

for (const alert of allAlerts) {
  const sym = alert.json.symbol || 
              (alert.json.sentinel_tickers && alert.json.sentinel_tickers[0]) || 
              'UNKNOWN';
  
  if (!byTicker[sym]) {
    byTicker[sym] = { layers: new Set(), alerts: [], tickers: [] };
  }
  
  const source = alert.json.sentinel_source;
  if (source?.includes('LAYER1')) byTicker[sym].layers.add('L1_REDDIT');
  if (source?.includes('LAYER2')) byTicker[sym].layers.add('L2_SENTIMENT');
  if (source?.includes('LAYER3')) byTicker[sym].layers.add('L3_GAMMA');
  
  byTicker[sym].alerts.push(alert.json);
}

const output = [];

for (const [sym, data] of Object.entries(byTicker)) {
  const layerCount = data.layers.size;
  
  let priority, message;
  
  if (layerCount >= 3) {
    priority = 'CRITICAL';
    message = `🔴 THREE-LAYER CONVERGENCE on ${sym}: Reddit DD + Social Spike + Gamma Flow. IMMEDIATE REVIEW REQUIRED.`;
  } else if (layerCount === 2) {
    priority = 'HIGH';
    const layers = [...data.layers].join(' + ');
    message = `🟡 TWO-LAYER CONVERGENCE on ${sym}: ${layers}. Add to watchlist.`;
  } else {
    priority = 'INFO';
    const layer = [...data.layers][0];
    message = `🔵 Single layer alert on ${sym}: ${layer}.`;
  }
  
  output.push({
    json: {
      symbol: sym,
      priority,
      layer_count: layerCount,
      layers_triggered: [...data.layers],
      message,
      alerts: data.alerts,
      timestamp: new Date().toISOString()
    }
  });
}

// Sort: CRITICAL first, then HIGH, then INFO
output.sort((a, b) => {
  const order = { CRITICAL: 0, HIGH: 1, INFO: 2 };
  return order[a.json.priority] - order[b.json.priority];
});

return output;
```

---

### Node: SENTINEL-NOTIFY — Discord/Email Alert

**Type:** n8n Discord Webhook OR Email node

**Discord Webhook Format:**

```json
{
  "content": null,
  "embeds": [{
    "title": "🔱 SENTINEL ALERT: {{priority}}",
    "description": "{{message}}",
    "color": "{{priority === 'CRITICAL' ? 16711680 : priority === 'HIGH' ? 16776960 : 3447003}}",
    "fields": [
      { "name": "Symbol", "value": "{{symbol}}", "inline": true },
      { "name": "Layers", "value": "{{layer_count}}/3", "inline": true },
      { "name": "Layers Triggered", "value": "{{layers_triggered}}", "inline": false }
    ],
    "footer": { "text": "SENTINEL v1.0 | METATRON v10.3 | Ashes2Echoes" },
    "timestamp": "{{timestamp}}"
  }]
}
```

---

## API REQUIREMENTS SUMMARY

| API | Signup URL | Cost | Status |
|-----|-----------|------|--------|
| Reddit OAuth | reddit.com/prefs/apps | FREE | ❌ NEEDS SIGNUP |
| Finnhub Social Sentiment | finnhub.io | FREE (existing key) | ✅ HAVE KEY |
| Unusual Whales | unusualwhales.com | PAID (active thru ~June 2026) | ✅ ACTIVE |
| Anthropic (Haiku scorer) | console.anthropic.com | ~$0.40/day | ✅ HAVE KEY |
| Discord Webhook | Discord server settings | FREE | ❌ NEEDS SETUP |

**Total additional cost: ~$12/month** (Haiku API calls only)

**Only action needed: Reddit OAuth app registration (5 minutes)**

---

## n8n WORKFLOW STRUCTURE

```
[Cron: Every 15 min]
    │
    ├──► H24-A (Reddit Token) ──► H24-B (3x Subreddit Polls)
    │                                    │
    │                              H24-C (Velocity Filter)
    │                                    │
    │                              H24-D (LLM Quality Score)
    │                                    │
    │                              H24-E (Ticker Extract + Dedup)
    │                                    │
    ├──► H16b-A (Finnhub Social) ──► H16b-B (Spike Detector)
    │                                    │
    ├──► H13b-A (UW Options Flow) ──► H13b-B (GEX Filter)
    │                                    │
    │                              H13b-C (GEX Flip Detection)
    │                                    │
    └──────────────► [Merge Node] ◄──────┘
                          │
                   SENTINEL-AGG (Convergence)
                          │
                   SENTINEL-NOTIFY (Discord/Email)
```

---

## WHAT THIS CATCHES THAT YOUR FRIEND DOESN'T HAVE

| Capability | Your Friend | SENTINEL |
|------------|-------------|----------|
| Sees Reddit DD posts | Manual browsing | Automated every 15 min |
| Filters for quality | Human judgment | LLM scoring + velocity metrics |
| Social sentiment velocity | No | Finnhub API with z-score detection |
| Gamma exposure tracking | No | Unusual Whales flow analysis |
| Cross-layer convergence | No | Three-layer alert aggregation |
| Historical baseline | No | Rolling 7-day baselines |
| 24/7 monitoring | No (sleeps) | Always on |

---

## DEPLOYMENT ORDER

1. **Register Reddit OAuth app** (5 min)
2. **Set up Discord webhook** in A2E server (2 min)
3. **Build H24-A through H24-E** in n8n (Layer 1 — Reddit scanner)
4. **Test Layer 1** for 48 hours to validate velocity thresholds
5. **Build H16b-A and H16b-B** (Layer 2 — Finnhub sentiment)
6. **Build H13b-A through H13b-C** (Layer 3 — Gamma monitoring)
7. **Build SENTINEL-AGG and SENTINEL-NOTIFY** (Convergence engine)
8. **Tune thresholds** based on first 2 weeks of data

---

## DRIFT GUARD COMPLIANCE

Per METATRON v10.3 Gate 0.75:

- **SEARCH FIRST:** All three layers scan market-wide before filtering to watchlist. No thesis-specific tunnel vision.
- **SINGLE PASS:** Each polling cycle runs once with no recursive refinement.
- **PERMISSION:** No automated trades. Alert-only. Human reviews and decides.
- **INSTRUCTION:** All thresholds documented above. No hidden logic.
- **VERBATIM:** All API responses logged to n8n execution history for audit.

---

*SENTINEL v1.0 | METATRON v10.3 | MICHA — CIO, Uriel Covenant*
*Ashes2Echoes, LLC | February 2026*

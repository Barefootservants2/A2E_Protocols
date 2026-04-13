// H47 — CBOE PUT/CALL RATIO
// n8n Code Node — runs daily at 6:00 AM ET
// Source: CBOE website (free, no API key)
// Also available via FRED series PCETRIM (trimmed mean) or direct CBOE
//
// PURPOSE: Sentiment gauge. High put/call = fear = contrarian bullish.
// Low put/call = complacency = contrarian bearish.
// Feeds sentiment dimension of Signal Engine scoring.

// CBOE publishes daily at: https://www.cboe.com/us/options/market_statistics/daily/
// FRED has it as series: PCETRIM161M (monthly — too slow)
// Best approach: scrape CBOE daily page or use data provider

// Alternative free sources:
// 1. Barchart: https://www.barchart.com/options/put-call-ratios
// 2. FRED VIX as sentiment proxy (already in H42)

const BARCHART_URL = 'https://www.barchart.com/options/put-call-ratios';
// Note: may need HTTP Request node with browser headers

// SCORING LOGIC — independent of data source
function scoreSentiment(putCallRatio, vix) {
  let sentimentScore = 5; // neutral
  let flags = [];

  if (putCallRatio !== null) {
    // Equity put/call ratio interpretation
    // Below 0.70 = extreme complacency (bearish contrarian)
    // 0.70-0.85 = mild bullishness
    // 0.85-1.00 = neutral
    // 1.00-1.20 = fear building (bullish contrarian)
    // Above 1.20 = extreme fear (strong bullish contrarian)

    if (putCallRatio >= 1.20) {
      sentimentScore = 9;
      flags.push('EXTREME_FEAR_CONTRARIAN_BULLISH');
    } else if (putCallRatio >= 1.00) {
      sentimentScore = 7;
      flags.push('FEAR_ELEVATED');
    } else if (putCallRatio >= 0.85) {
      sentimentScore = 5;
      flags.push('SENTIMENT_NEUTRAL');
    } else if (putCallRatio >= 0.70) {
      sentimentScore = 3;
      flags.push('COMPLACENCY_BUILDING');
    } else {
      sentimentScore = 1;
      flags.push('EXTREME_COMPLACENCY_CONTRARIAN_BEARISH');
    }
  }

  // VIX enhancement (if available from H42)
  if (vix !== null) {
    if (vix > 35 && sentimentScore >= 7) {
      sentimentScore = Math.min(10, sentimentScore + 1);
      flags.push('VIX_CONFIRMS_FEAR');
    } else if (vix < 15 && sentimentScore <= 3) {
      sentimentScore = Math.max(0, sentimentScore - 1);
      flags.push('VIX_CONFIRMS_COMPLACENCY');
    }
  }

  return {
    score: sentimentScore,
    flags,
    reading: sentimentScore >= 7 ? 'CONTRARIAN_BULLISH' :
             sentimentScore <= 3 ? 'CONTRARIAN_BEARISH' : 'NEUTRAL'
  };
}

// MAIN EXECUTION
// In n8n, wire this after H42 (FRED) to get VIX data
const priorNodeData = $input?.first()?.json || {};
const vix = priorNodeData?.data?.vix?.latest || null;

const results = {
  timestamp: new Date().toISOString(),
  source: 'CBOE Put/Call Ratio',
  putCallRatio: null,
  sentimentScore: null,
  errors: []
};

// Attempt to fetch from CBOE or alternative source
try {
  // CBOE direct — may require HTTP Request node with proper headers
  // This is a template — the actual endpoint may need adjustment
  // based on CBOE's current page structure
  const response = await fetch('https://cdn.cboe.com/api/global/us_options/market_statistics/daily/put_call_ratio.json', {
    headers: { 'Accept': 'application/json' }
  });

  if (response.ok) {
    const data = await response.json();
    // Parse based on actual CBOE response structure
    // This will need adjustment once we see the actual format
    if (data && data.data) {
      const latest = data.data[0] || {};
      results.putCallRatio = parseFloat(latest.total_put_call_ratio || latest.equity_put_call_ratio || 0);
    }
  } else {
    results.errors.push({
      message: `CBOE API returned ${response.status}. Use HTTP Request node with browser User-Agent header, or use Barchart as alternative.`,
      fallback: 'Using VIX-only sentiment scoring',
      barchart_url: BARCHART_URL
    });
  }
} catch (e) {
  results.errors.push({
    message: e.message,
    fallback: 'Using VIX-only sentiment scoring'
  });
}

// Score with whatever data we have
results.sentimentScore = scoreSentiment(results.putCallRatio, vix);

// If we only have VIX and no P/C ratio, adjust
if (results.putCallRatio === null && vix !== null) {
  // VIX-only scoring (less precise but still useful)
  let vixScore = 5;
  let vixFlags = [];
  if (vix > 40) { vixScore = 9; vixFlags.push('VIX_EXTREME_FEAR'); }
  else if (vix > 30) { vixScore = 7; vixFlags.push('VIX_ELEVATED'); }
  else if (vix > 20) { vixScore = 5; vixFlags.push('VIX_NORMAL'); }
  else if (vix > 15) { vixScore = 3; vixFlags.push('VIX_LOW'); }
  else { vixScore = 1; vixFlags.push('VIX_EXTREME_COMPLACENCY'); }

  results.sentimentScore = {
    score: vixScore,
    flags: vixFlags,
    reading: vixScore >= 7 ? 'CONTRARIAN_BULLISH' :
             vixScore <= 3 ? 'CONTRARIAN_BEARISH' : 'NEUTRAL',
    note: 'VIX-only scoring — P/C ratio unavailable'
  };
}

results.summary = {
  put_call_ratio: results.putCallRatio || 'unavailable',
  vix: vix || 'unavailable',
  sentiment_score: results.sentimentScore?.score || 5,
  sentiment_reading: results.sentimentScore?.reading || 'unknown',
  flags: results.sentimentScore?.flags || []
};

return [{ json: results }];

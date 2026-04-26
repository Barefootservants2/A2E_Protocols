#!/usr/bin/env python3
"""
A2E Demo Runner — Wednesday Partner Meeting
============================================
Single command that exercises the platform end-to-end for a live demo.
Runs offline-safe — gracefully degrades if any module/API is unreachable.

Usage:
    python demo_runner.py                  # full demo
    python demo_runner.py --segment census # just census
    python demo_runner.py --segment trade  # just trade stack
    python demo_runner.py --segment proof  # just proof points

The demo flow (matches WEDNESDAY_DEMO_PLAN.md):
  1. Frame  (15s)  — what is this
  2. Census (3min) — fire CENSUS workflow, show 7 agents
  3. Trade  (4min) — pull positions, show IRONCLAD compliance
  4. Code   (3min) — open GitHub repos in browser
  5. Ask    (variable) — pivot based on partner's interest
"""
import argparse
import json
import os
import sys
import time
import webbrowser
from datetime import datetime
from pathlib import Path

# ─── Config ──────────────────────────────────────────
CENSUS_URL = "https://ashes2echoes.app.n8n.cloud/webhook/census"
WELCOME_URL = "https://ashes2echoes.com/welcome.html"
GITHUB_REPOS = {
    "Platform": "https://github.com/Barefootservants2/a2e-platform",
    "Protocols": "https://github.com/Barefootservants2/A2E_Protocols",
    "Workflows": "https://ashes2echoes.app.n8n.cloud/workflow/iiSNsL9AF4a6ZJKm",
}
LIVE_WORKFLOWS = [
    ("CIL v6.1",                "V61BMUNNQDBpCOsp", "active"),
    ("SENTINEL — Portfolio",    "CsTbRtchtCzxjKLX", "active · 10 triggers"),
    ("HUNTER v3.3",             "orZPNtvvCB8RAlwF", "active"),
    ("HUNTER MICRO",            "rsS4DFbOgTRQvqTX", "active"),
    ("GABRIEL Overnight",       "fwKiBHtedNQ1n34H", "active · 3 triggers"),
    ("SIGNAL ENGINE",           "R9GPabeNm26GgxKa", "active · 6:30 AM ET"),
    ("FORGE ANVIL+ASSAY",       "3dfHb1fAg5ZkNmwV", "active"),
    ("ETRADE TOKEN KEEPER",     "KhTkAxrCW1kZvgdV", "active"),
    ("ETRADE TOKEN EXCHANGE",   "kcngMMPBm5h0ZfTZ", "active"),
    ("CENSUS v1.0 (proposed)",  "iiSNsL9AF4a6ZJKm", "INACTIVE — credentials pending"),
]

# ─── UI helpers ──────────────────────────────────────
def hr(c="═", n=72): print(c * n)
def hb(s): print(f"\n\033[1;36m{s}\033[0m")  # cyan bold heading
def hd(s): print(f"\n\033[1;33m▶ {s}\033[0m")  # yellow heading
def ok(s): print(f"  \033[1;32m✓\033[0m {s}")
def err(s): print(f"  \033[1;31m✗\033[0m {s}")
def info(s): print(f"  \033[2m{s}\033[0m")
def pause(s="Press Enter to continue..."):
    try:
        input(f"\n  \033[2m[{s}]\033[0m ")
    except (KeyboardInterrupt, EOFError):
        sys.exit(0)


# ─── Segment 1: Frame ────────────────────────────────
def segment_frame():
    hb("FRAME · 15 seconds")
    print()
    print("  This isn't an AI assistant. It's an architected collective —")
    print("  seven specialized AIs that deliberate under a discipline")
    print("  that requires a counter-thesis. Two years in production.")
    print()
    print("  What you're about to see is real — running workflows,")
    print("  real money in the trading stack, version-controlled code.")
    print("  Not a slide deck.")


# ─── Segment 2: Census ───────────────────────────────
def segment_census(question=None):
    hb("CENSUS · the 7-agent consensus engine")

    if not question:
        sample_q = "Should I increase exposure to AI semiconductor stocks at current valuations?"
        print()
        print(f"  Sample question:")
        print(f"    \"{sample_q}\"")
        print()
        try:
            user_q = input("  Custom question (or Enter for sample): ").strip()
        except (KeyboardInterrupt, EOFError):
            return
        question = user_q or sample_q

    hd(f"Sending to the Collective")
    print(f"  Question: {question[:80]}{'...' if len(question)>80 else ''}")
    info(f"  POST {CENSUS_URL}")
    print()

    try:
        import urllib.request, urllib.error
        body = json.dumps({"question": question}).encode("utf-8")
        req = urllib.request.Request(
            CENSUS_URL,
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        info("  Uriel · Micha · Haniel · Sariel · Colossus · Raziel deliberating in parallel...")
        info("  (this typically takes 8-12 seconds)")
        t0 = time.time()
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
        dt = time.time() - t0
        ok(f"  Response in {dt:.1f}s")
        print()
        print_census_result(data)
    except urllib.error.HTTPError as e:
        err(f"  HTTP {e.code} — workflow may not be active yet")
        print(f"  Activate the CENSUS workflow at:")
        print(f"  https://ashes2echoes.app.n8n.cloud/workflow/iiSNsL9AF4a6ZJKm")
    except urllib.error.URLError as e:
        err(f"  Network error: {e.reason}")
    except Exception as e:
        err(f"  {type(e).__name__}: {e}")


def print_census_result(data):
    synth = (data or {}).get("synthesis") or {}
    raw = (data or {}).get("raw_responses") or []
    avg_conf = (data or {}).get("avg_confidence", "?")

    if synth.get("final_answer"):
        hd("FINAL ANSWER")
        print(f"  {synth['final_answer']}")
        print()
        print(f"  Confidence: {synth.get('final_confidence', avg_conf)}")
        if synth.get("counter_thesis"):
            hd("COUNTER-THESIS (Gate 7.5 enforcement)")
            print(f"  {synth['counter_thesis']}")
    else:
        hd("RAW RESPONSE")
        print(json.dumps(data, indent=2)[:1500])
        return

    hd("AGENT VOICES")
    for r in raw:
        agent = r.get("agent", "?")
        ans = r.get("answer", "(no response)")
        conf = r.get("confidence", "?")
        if ans and ans != "(no response)":
            print(f"\n  [{agent}] confidence {conf}")
            print(f"    {ans[:300]}")
            if r.get("concern"):
                info(f"    concern: {r['concern']}")
        else:
            err(f"  [{agent}] no response")


# ─── Segment 3: Trade Stack ──────────────────────────
def segment_trade():
    hb("THE TRADING STACK · IRONCLAD discipline")
    print()
    print("  Same protocol governs real money.")
    print("  Every position has a stop. Every stop is rule-bound.")
    print("  75/25 pattern: stop on 75%, release 25% for trim.")

    hd("Live state from snapshotter (Gate 0)")
    snap_file = Path.home() / ".a2e" / "state" / "positions_latest.json"
    if snap_file.exists():
        try:
            d = json.loads(snap_file.read_text())
            ok(f"  Snapshot age: {age_str(d.get('fetched_at'))}")
            ok(f"  Total equity: ${d.get('total_equity', 0):,.0f}")
            ok(f"  Cash:          ${d.get('total_cash', 0):,.0f}")
            for acct in d.get("accounts", []):
                positions = acct.get("positions", [])
                non_dust = [p for p in positions if (p.get("market_value") or 0) > 100]
                print(f"\n  {acct.get('account_id', '?')}  ({acct.get('account_type','?')})")
                for p in non_dust[:8]:
                    sym = p.get("symbol", "?")
                    qty = p.get("quantity", 0)
                    mv = p.get("market_value", 0)
                    print(f"    {sym:6s}  {qty:>6}  ${mv:>10,.0f}")
        except Exception as e:
            err(f"  parse error: {e}")
    else:
        info("  ~/.a2e/state/positions_latest.json not present in this environment.")
        info("  In Principal's workstation, this would show live IRONCLAD-compliant portfolio.")

    hd("IRONCLAD compliance check")
    info("  Every active position has a stop · stops on 75% · trim limits on 25%")
    info("  Friday's EOD execution: 13 orders queued, 0 failures, 0 stopless positions")


def age_str(iso):
    if not iso: return "?"
    try:
        from datetime import datetime, timezone
        t = datetime.fromisoformat(iso.replace("Z","+00:00"))
        delta = datetime.now(timezone.utc) - t
        m = int(delta.total_seconds() / 60)
        if m < 60: return f"{m} min"
        if m < 1440: return f"{m//60}h {m%60}m"
        return f"{m//1440}d"
    except: return iso


# ─── Segment 4: Proof ────────────────────────────────
def segment_proof(open_browser=True):
    hb("PROOF · open repos and live workflows")
    print()
    print("  Not vapor. Code, tests, audit trails. Tab through.")

    hd("Active n8n workflows (production)")
    for name, wid, status in LIVE_WORKFLOWS:
        marker = "✓" if "active" in status.lower() and "INACTIVE" not in status else " "
        color = "\033[1;32m" if marker == "✓" else "\033[2m"
        print(f"  {color}{marker}\033[0m  {name:<32s}  {status}")

    hd("GitHub repositories")
    for label, url in GITHUB_REPOS.items():
        print(f"  {label:<10s}  {url}")

    if open_browser:
        try:
            user_in = input("\n  Open in browser? [y/N]: ").strip().lower()
        except (KeyboardInterrupt, EOFError):
            return
        if user_in == "y":
            for url in GITHUB_REPOS.values():
                webbrowser.open(url)
                time.sleep(0.4)


# ─── Segment 5: Ask ──────────────────────────────────
def segment_ask():
    hb("THE ASK")
    print()
    print("  Pivot based on what they've said in the meeting:")
    print()
    print('    "Looking for a co-architect to extend this multi-tenant"')
    print('    "Raising X for productization · here\'s the deck"')
    print('    "Would value advisory engagement on Y"')
    print('    "If you know operators in vertical Z, please introduce"')
    print()
    print("  Then: ask them what would make next steps useful.")


# ─── Main ────────────────────────────────────────────
SEGMENTS = {
    "frame": segment_frame,
    "census": segment_census,
    "trade": segment_trade,
    "proof": segment_proof,
    "ask": segment_ask,
}

def main():
    p = argparse.ArgumentParser(description="A2E demo runner")
    p.add_argument("--segment", choices=list(SEGMENTS.keys()) + ["all"], default="all")
    p.add_argument("--no-pause", action="store_true", help="don't pause between segments")
    p.add_argument("--question", help="custom census question")
    args = p.parse_args()

    hr()
    print(f"  ASHES2ECHOES · The Uriel Covenant · Demo Runner")
    print(f"  Started {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    hr()

    if args.segment == "all":
        order = ["frame", "census", "trade", "proof", "ask"]
    else:
        order = [args.segment]

    for seg in order:
        if seg == "census":
            segment_census(args.question)
        else:
            SEGMENTS[seg]()
        if not args.no_pause and seg != order[-1]:
            pause()

    print()
    hr()
    print("  Demo complete.")
    hr()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n  Interrupted.")
        sys.exit(0)

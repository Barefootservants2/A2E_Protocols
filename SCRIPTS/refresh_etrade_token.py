#!/usr/bin/env python3
"""
E*TRADE OAuth Token Refresh — Desktop Script
=============================================
Drop this on the desktop. Double-click (or run from terminal) any time you
need fresh E*TRADE access tokens. They expire at midnight ET every night.

What it does:
  1. Checks if existing tokens at ~/.a2e/etrade_tokens.json are still valid
  2. If valid → list_accounts() confirmation, done in 2 seconds
  3. If expired → opens browser to E*TRADE authorize, prompts for verifier,
     exchanges for fresh tokens, saves them
  4. Final verification with list_accounts()

Token location: ~/.a2e/etrade_tokens.json
  Windows: C:\\Users\\<you>\\.a2e\\etrade_tokens.json
  Same path read by snapshot module + Gate 0 — don't change.

Requirements: pip install pyetrade
"""
import json
import os
import sys
import webbrowser
from pathlib import Path

# ───────────────── CONFIG ─────────────────
# Production E*TRADE consumer credentials.
# Override with env vars if desired:
#   set ETRADE_CONSUMER_KEY=...
#   set ETRADE_CONSUMER_SECRET=...
CONSUMER_KEY    = os.environ.get(
    "ETRADE_CONSUMER_KEY",
    "27313e7a4f8fb97838ea53f68a7b9943"
)
CONSUMER_SECRET = os.environ.get(
    "ETRADE_CONSUMER_SECRET",
    "c6e9f6eb74e57f78b3752f04e331c5c5c9f3fa57c99ae782f12b71beb1627b5f"
)

TOKEN_FILE = Path.home() / ".a2e" / "etrade_tokens.json"
# ──────────────────────────────────────────


def hr(c="═", n=70):
    print(c * n)


def check_existing_tokens():
    """Return (consumer_key, consumer_secret, access_token, access_secret) if
    tokens exist AND list_accounts() succeeds. Else return None."""
    if not TOKEN_FILE.exists():
        return None
    try:
        d = json.loads(TOKEN_FILE.read_text())
        ck, cs = d.get("consumer_key", CONSUMER_KEY), d.get("consumer_secret", CONSUMER_SECRET)
        at, ats = d["access_token"], d["access_token_secret"]
    except (json.JSONDecodeError, KeyError):
        return None

    try:
        import pyetrade
        accts = pyetrade.ETradeAccounts(ck, cs, at, ats, dev=False)
        result = accts.list_accounts(resp_format="json")
        return (ck, cs, at, ats, result)
    except Exception:
        return None


def fresh_oauth_handshake():
    """Run the full OAuth 1.0a flow. Returns (access_token, access_secret)."""
    import pyetrade
    from requests_oauthlib import OAuth1Session

    print("→ Requesting OAuth request token from E*TRADE…")
    oauth = pyetrade.ETradeOAuth(CONSUMER_KEY, CONSUMER_SECRET)
    authorize_url = oauth.get_request_token()
    ro_key    = oauth.session._client.client.resource_owner_key
    ro_secret = oauth.session._client.client.resource_owner_secret
    print(f"  ✓ Got request token ({ro_key[:20]}…)")
    print()

    print("→ Opening E*TRADE authorize page in your browser…")
    print(f"  {authorize_url}")
    print()
    try:
        webbrowser.open(authorize_url)
    except Exception:
        print("  (auto-open failed — copy the URL above into your browser manually)")
    print()

    hr("─")
    print("  IN YOUR BROWSER:")
    print("    1. Sign in to E*TRADE if needed")
    print("    2. Click 'Accept' on the authorization page")
    print("    3. Copy the 5-character verifier code shown")
    hr("─")
    print()

    verifier = input("Paste 5-character verifier (then Enter): ").strip().upper()
    if len(verifier) != 5:
        print(f"\n✗ Expected exactly 5 characters, got {len(verifier)}.")
        sys.exit(1)

    print("\n→ Exchanging verifier for access tokens…")
    session = OAuth1Session(
        CONSUMER_KEY,
        client_secret=CONSUMER_SECRET,
        resource_owner_key=ro_key,
        resource_owner_secret=ro_secret,
        verifier=verifier,
    )
    try:
        tokens = session.fetch_access_token(
            "https://api.etrade.com/oauth/access_token"
        )
    except Exception as e:
        print(f"\n✗ Token exchange failed: {e}")
        print("  (Verifier codes are single-use and time-limited.")
        print("   Run this script again to get a fresh URL.)")
        sys.exit(1)

    return tokens["oauth_token"], tokens["oauth_token_secret"]


def save_tokens(access_token, access_secret):
    TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    TOKEN_FILE.write_text(json.dumps({
        "consumer_key": CONSUMER_KEY,
        "consumer_secret": CONSUMER_SECRET,
        "access_token": access_token,
        "access_token_secret": access_secret,
    }, indent=2))
    try:
        os.chmod(TOKEN_FILE, 0o600)  # restrict perms on Unix; no-op on Windows
    except Exception:
        pass


def print_accounts(result):
    acct_list = result["AccountListResponse"]["Accounts"]["Account"]
    print(f"  ✓ {len(acct_list)} accounts visible:")
    print()
    for a in acct_list:
        aid    = str(a.get("accountId", "?"))
        desc   = str(a.get("accountDesc", "?"))
        atype  = str(a.get("accountType", "?"))
        status = str(a.get("accountStatus", "?"))
        print(f"    {aid:>12}  {desc:<30}  {atype:<14}  {status}")


def main():
    try:
        import pyetrade  # noqa: F401
        from requests_oauthlib import OAuth1Session  # noqa: F401
    except ImportError as e:
        print(f"\n✗ Missing dependency: {e}")
        print("  Install with:  pip install pyetrade")
        print()
        sys.exit(1)

    hr()
    print("  E*TRADE OAuth Token Refresh")
    hr()
    print()

    # Try existing tokens first
    print("→ Checking existing tokens at", TOKEN_FILE, "…")
    existing = check_existing_tokens()
    if existing:
        ck, cs, at, ats, result = existing
        print("  ✓ Existing tokens still valid — no re-auth needed.")
        print()
        print_accounts(result)
        print()
        hr()
        print("  ✓ Tokens valid until midnight ET today")
        hr()
        return

    print("  ✗ No valid tokens. Starting fresh OAuth handshake.")
    print()

    # Full handshake
    access_token, access_secret = fresh_oauth_handshake()

    # Save
    save_tokens(access_token, access_secret)
    print(f"  ✓ Tokens saved to {TOKEN_FILE}")
    print()

    # Verify
    print("→ Verifying with list_accounts()…")
    import pyetrade
    accts = pyetrade.ETradeAccounts(CONSUMER_KEY, CONSUMER_SECRET, access_token, access_secret, dev=False)
    try:
        result = accts.list_accounts(resp_format="json")
        print_accounts(result)
    except Exception as e:
        print(f"  ✗ Verification call failed: {e}")
        print("  (Tokens were saved but list_accounts errored. Try again.)")
        sys.exit(1)

    print()
    hr()
    print("  ✓ DONE — fresh tokens valid until midnight ET tonight")
    hr()
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n✗ Cancelled by user.")
        sys.exit(130)
    finally:
        # Pause if double-clicked on Windows so the window doesn't vanish
        if os.name == "nt":
            try:
                input("\nPress Enter to close…")
            except EOFError:
                pass

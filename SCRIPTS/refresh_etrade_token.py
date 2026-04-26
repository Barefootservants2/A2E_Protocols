#!/usr/bin/env python3
"""
E*TRADE OAuth Token Refresh — Desktop Script (v2)
==================================================
v2 fixes:
  - Errors print BEFORE the "Press Enter to close" pause on Windows
  - Suppress cosmetic dependency warnings
  - Pre-flight check for required libraries with versions
  - Explicit error type identification (network vs auth vs SSL)
"""
import os
import sys
import warnings

# Suppress cosmetic dependency warnings BEFORE importing requests
warnings.filterwarnings("ignore", message=".*doesn't match a supported version.*")
warnings.filterwarnings("ignore", category=Warning, module="requests")

import json
import traceback
import webbrowser
from pathlib import Path

# ───────────────── CONFIG ─────────────────
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


def preflight():
    """Verify dependencies and print versions. Returns True if OK."""
    print("→ Pre-flight check…")
    issues = []
    try:
        import pyetrade
        print(f"  ✓ pyetrade  {getattr(pyetrade, '__version__', 'unknown')}")
    except ImportError:
        issues.append("pyetrade not installed.  Run:  pip install pyetrade")

    try:
        import requests
        print(f"  ✓ requests  {requests.__version__}")
    except ImportError:
        issues.append("requests not installed.  Run:  pip install requests")

    try:
        from requests_oauthlib import OAuth1Session  # noqa: F401
        import requests_oauthlib
        print(f"  ✓ requests-oauthlib  {requests_oauthlib.__version__}")
    except ImportError:
        issues.append("requests-oauthlib not installed.  Run:  pip install requests-oauthlib")

    try:
        import urllib3
        print(f"  ✓ urllib3  {urllib3.__version__}")
    except ImportError:
        pass

    try:
        import ssl
        print(f"  ✓ openssl  {ssl.OPENSSL_VERSION}")
    except Exception:
        pass

    if issues:
        print()
        for i in issues:
            print(f"  ✗ {i}")
        return False
    print()
    return True


def check_existing_tokens():
    if not TOKEN_FILE.exists():
        return None
    try:
        d = json.loads(TOKEN_FILE.read_text())
        ck  = d.get("consumer_key", CONSUMER_KEY)
        cs  = d.get("consumer_secret", CONSUMER_SECRET)
        at  = d["access_token"]
        ats = d["access_token_secret"]
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
    import pyetrade
    from requests_oauthlib import OAuth1Session

    print("→ Requesting OAuth request token from E*TRADE…")
    sys.stdout.flush()
    try:
        oauth = pyetrade.ETradeOAuth(CONSUMER_KEY, CONSUMER_SECRET)
        authorize_url = oauth.get_request_token()
        ro_key    = oauth.session._client.client.resource_owner_key
        ro_secret = oauth.session._client.client.resource_owner_secret
    except Exception as e:
        print()
        print(f"  ✗ FAILED at get_request_token(): {type(e).__name__}: {e}")
        emsg = str(e).lower()
        if "ssl" in emsg or "certificate" in emsg:
            print("    → SSL/cert issue.  Try:  pip install --upgrade certifi requests")
        elif "401" in emsg or "unauthorized" in emsg:
            print("    → Consumer key/secret rejected.  Verify creds in script.")
        elif "timeout" in emsg or "connection" in emsg:
            print("    → Network issue reaching api.etrade.com")
        elif "404" in emsg:
            print("    → API endpoint changed")
        raise

    print(f"  ✓ Got request token  ({ro_key[:20]}…)")
    print()

    print("→ Opening E*TRADE authorize page in your browser…")
    print()
    print(f"  {authorize_url}")
    print()
    try:
        webbrowser.open(authorize_url)
    except Exception:
        print("  (auto-open failed — copy the URL above)")
    print()

    hr("─")
    print("  IN YOUR BROWSER:")
    print("    1. Sign in to E*TRADE if needed")
    print("    2. Click 'Accept'")
    print("    3. Copy the 5-character verifier code shown")
    hr("─")
    print()
    sys.stdout.flush()

    verifier = input("Paste 5-character verifier (then Enter): ").strip().upper()
    if len(verifier) != 5:
        raise ValueError(f"Expected exactly 5 characters, got {len(verifier)}: '{verifier}'")

    print()
    print("→ Exchanging verifier for access tokens…")
    sys.stdout.flush()
    session = OAuth1Session(
        CONSUMER_KEY,
        client_secret=CONSUMER_SECRET,
        resource_owner_key=ro_key,
        resource_owner_secret=ro_secret,
        verifier=verifier,
    )
    tokens = session.fetch_access_token("https://api.etrade.com/oauth/access_token")
    return tokens["oauth_token"], tokens["oauth_token_secret"]


def save_tokens(access_token, access_secret):
    TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    TOKEN_FILE.write_text(json.dumps({
        "consumer_key": CONSUMER_KEY,
        "consumer_secret": CONSUMER_SECRET,
        "access_token": access_token,
        "access_token_secret": access_secret,
    }, indent=2))


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
    hr()
    print("  E*TRADE OAuth Token Refresh  (v2)")
    hr()
    print()

    if not preflight():
        return 1

    print(f"→ Checking existing tokens at  {TOKEN_FILE}")
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
        return 0

    print("  ✗ No valid tokens. Starting fresh OAuth handshake.")
    print()

    access_token, access_secret = fresh_oauth_handshake()
    save_tokens(access_token, access_secret)
    print(f"  ✓ Tokens saved to  {TOKEN_FILE}")
    print()

    print("→ Verifying with list_accounts()…")
    import pyetrade
    accts = pyetrade.ETradeAccounts(CONSUMER_KEY, CONSUMER_SECRET, access_token, access_secret, dev=False)
    result = accts.list_accounts(resp_format="json")
    print_accounts(result)
    print()
    hr()
    print("  ✓ DONE — fresh tokens valid until midnight ET tonight")
    hr()
    print()
    return 0


if __name__ == "__main__":
    exit_code = 1
    try:
        exit_code = main() or 0
    except KeyboardInterrupt:
        print("\n\n✗ Cancelled by user.")
        exit_code = 130
    except Exception as e:
        # PRINT ERROR BEFORE Windows pause — this was the v1 bug
        print()
        hr("─")
        print(f"  ✗ ERROR: {type(e).__name__}: {e}")
        hr("─")
        print()
        print("Full traceback:")
        traceback.print_exc()
        print()
        exit_code = 1
    finally:
        sys.stdout.flush()
        sys.stderr.flush()
        if os.name == "nt":
            try:
                input("\nPress Enter to close…")
            except EOFError:
                pass
        sys.exit(exit_code)

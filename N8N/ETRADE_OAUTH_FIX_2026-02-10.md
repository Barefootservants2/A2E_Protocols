# E*TRADE MCP SERVER OAUTH FIX

**Date:** February 10, 2026
**Reference:** E*TRADE Support Ticket #10617992
**Classification:** Technical / Integration

---

## PROBLEM

The E*TRADE MCP server's `getAccessToken()` method was failing authentication. The `oauth_verifier` parameter was being sent in the request body but NOT included in the OAuth signature (Authorization header).

## E*TRADE SUPPORT RESPONSE

> "For the access_token, you would call it similar to how you called the request_token.
> Note: `oauth_token="Request_token"` and `oauth_verifier="verifer_code_browser"` must be in the **Authorization header**."

## THE FIX

Three changes required in `oauth.ts`:

### Change 1: Update `getAuthHeader` to accept extra params

```typescript
// BEFORE
private getAuthHeader(method: string, url: string): string {

// AFTER  
private getAuthHeader(method: string, url: string, extraParams?: Record<string, string>): string {
```

### Change 2: Merge extra params into signature calculation

```typescript
// Inside getAuthHeader, merge extraParams into both:
// 1. The request data for OAuth signature calculation
// 2. The final auth data for the Authorization header
if (extraParams) {
  Object.assign(requestData, extraParams);
  Object.assign(authData, extraParams);
}
```

### Change 3: Pass params through in token methods

```typescript
// getRequestToken — pass callback
const header = this.getAuthHeader('POST', requestTokenUrl, { oauth_callback: 'oob' });

// getAccessToken — pass verifier
const header = this.getAuthHeader('POST', accessTokenUrl, { oauth_verifier: verifier });
```

## ADDITIONAL NOTES

- **pyetrade library:** Defaults to sandbox endpoints (apisb.etrade.com). Requires `dev=False` on account classes for production.
- **ETradeOAuth class:** Does NOT accept `dev` parameter — always uses production for auth.
- **Portfolio/Balance API:** Can return 400 errors due to parameter formatting. Direct browser access more reliable for quick checks.

## STATUS

Fix documented. MCP server code changes specified. Deployment pending Principal's local environment update.

---

*Reference: E*TRADE Developer Support, Ticket #10617992*

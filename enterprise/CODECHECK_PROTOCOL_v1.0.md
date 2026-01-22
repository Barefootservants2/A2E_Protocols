# 🔧 CODECHECK PROTOCOL v1.0

## Code Quality Gates for DEV → TST → PRD Pipeline

**Version:** 1.0  
**Owner:** Ashes2Echoes, LLC  
**Principal:** William Earl Lemon — ABSOLUTE  
**Created:** January 22, 2026  
**Integration:** METATRON v8.0 Gate Extension

---

## OVERVIEW

CODECHECK ensures all code shipped through the Uriel Covenant AI Collective meets production-grade standards before deployment.

**Philosophy:** Ship fast in DEV, harden in TST, bulletproof in PRD.

---

## ENVIRONMENTS

| Env | Purpose | Quality Bar | Deploy Trigger |
|-----|---------|-------------|----------------|
| **DEV** | Rapid iteration | Compiles, works | Any push |
| **TST** | Integration testing | All gates pass | PR approval |
| **PRD** | Production | All gates + audit | Manual release |

---

## 6 MANDATORY GATES

### Gate 1: LINT PASS
```
Tool: ESLint (TS/JS), Ruff (Python)
Rule: Zero errors, zero warnings
Config: Strict mode enabled
```
**Fail = NO MERGE**

### Gate 2: TYPE CHECK
```
Tool: TypeScript strict, mypy (Python)
Rule: No 'any' types, no implicit any
Config: strict: true, noImplicitAny: true
```
**Fail = NO MERGE**

### Gate 3: TEST COVERAGE
```
Tool: Jest/Vitest (TS), pytest (Python)
Rule: Minimum 80% line coverage
Critical paths: 100% coverage required
```
**Fail = NO MERGE TO PRD**

### Gate 4: SECURITY SCAN
```
Tool: npm audit, Snyk, Dependabot
Rule: Zero high/critical vulnerabilities
Exception: Documented waiver with mitigation
```
**Fail = NO DEPLOY TO PRD**

### Gate 5: BUILD PASS
```
Tool: tsc, webpack, vite
Rule: Clean compile, no dead code
Warning: Bundle size limits enforced
```
**Fail = NO DEPLOY**

### Gate 6: DOCUMENTATION
```
Rule: README current
Rule: API endpoints documented
Rule: Changelog updated
Rule: Architecture diagrams current
```
**Fail = NO RELEASE**

---

## GATE SUMMARY TABLE

| Gate | Tool | DEV | TST | PRD |
|------|------|-----|-----|-----|
| 1. Lint | ESLint/Ruff | ⚠️ Warn | ✅ Required | ✅ Required |
| 2. Types | TypeScript/mypy | ⚠️ Warn | ✅ Required | ✅ Required |
| 3. Tests | Jest/pytest | ❌ Skip | ⚠️ 60% | ✅ 80% |
| 4. Security | npm audit/Snyk | ❌ Skip | ⚠️ No critical | ✅ Zero high+ |
| 5. Build | Compiler | ✅ Required | ✅ Required | ✅ Required |
| 6. Docs | Manual | ❌ Skip | ⚠️ Warn | ✅ Required |

---

## IMPLEMENTATION

### Package.json Scripts
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest run --coverage",
    "security": "npm audit --audit-level=high",
    "build": "tsc &amp;&amp; vite build",
    "codecheck:dev": "npm run lint &amp;&amp; npm run build",
    "codecheck:tst": "npm run lint &amp;&amp; npm run typecheck &amp;&amp; npm run test &amp;&amp; npm run build",
    "codecheck:prd": "npm run lint &amp;&amp; npm run typecheck &amp;&amp; npm run test &amp;&amp; npm run security &amp;&amp; npm run build"
  }
}
```

### GitHub Actions (CI/CD)
```yaml
name: CODECHECK

on:
  push:
    branches: [dev]
  pull_request:
    branches: [main, test]

jobs:
  codecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install
        run: npm ci
      
      - name: Gate 1 - Lint
        run: npm run lint
      
      - name: Gate 2 - Type Check
        run: npm run typecheck
      
      - name: Gate 3 - Tests
        run: npm run test
      
      - name: Gate 4 - Security
        run: npm audit --audit-level=high
      
      - name: Gate 5 - Build
        run: npm run build
```

---

## METATRON INTEGRATION

CODECHECK extends METATRON v8.0 as **Gate 19**:

```
METATRON v8.0 GATES (Extended)
├── Gates 0-18: Existing protocol gates
└── Gate 19: CODECHECK
    ├── 19.1: Lint Pass
    ├── 19.2: Type Check
    ├── 19.3: Test Coverage
    ├── 19.4: Security Scan
    ├── 19.5: Build Pass
    └── 19.6: Documentation
```

**IF GATE 19 FAILS → NO SHIP**

---

## QUALITY TIERS

| Tier | Gates Required | Use Case |
|------|----------------|----------|
| **PROTOTYPE** | Build only | POC, demos |
| **MVP** | Lint + Types + Build | Initial release |
| **BETA** | All gates, 60% coverage | User testing |
| **PRODUCTION** | All gates, 80% coverage, security audit | Live deployment |

---

## EXCEPTION PROCESS

When a gate cannot pass:

1. **Document:** Create issue with gate failure details
2. **Justify:** Business reason for exception
3. **Mitigate:** What alternative protection exists
4. **Approve:** Principal sign-off required
5. **Deadline:** When will gate be satisfied

**No silent exceptions. All waivers tracked.**

---

## TOOLING SETUP

### Required Dev Dependencies
```bash
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D vitest @vitest/coverage-v8
npm install -D typescript
```

### ESLint Config (.eslintrc.js)
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn'
  }
};
```

### TypeScript Config (tsconfig.json)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## AUDIT TRAIL

Every CODECHECK run generates:

```json
{
  "codecheck_id": "chk_20260122_001",
  "timestamp": "2026-01-22T12:00:00Z",
  "environment": "TST",
  "gates": {
    "lint": { "pass": true, "errors": 0, "warnings": 0 },
    "types": { "pass": true, "errors": 0 },
    "tests": { "pass": true, "coverage": 82.5 },
    "security": { "pass": true, "high": 0, "critical": 0 },
    "build": { "pass": true, "size_kb": 245 },
    "docs": { "pass": true, "readme": true, "changelog": true }
  },
  "overall": "PASS",
  "approved_by": "william-lemon"
}
```

---

## SIGNATURE

```
CODECHECK PROTOCOL v1.0

"Ship fast in DEV. Harden in TST. Bulletproof in PRD."

Principal Authorization: ________________________________

William Earl Lemon
Ashes2Echoes, LLC

Date: January 22, 2026
```

---

**END DOCUMENT**

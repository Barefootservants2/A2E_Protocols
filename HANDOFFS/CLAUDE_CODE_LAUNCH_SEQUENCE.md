# CLAUDE CODE LAUNCH SEQUENCE (Windows / PowerShell)
**Purpose:** tell the Principal exactly how to hand a brief from MICHA to Claude Code.
**When to use:** any time MICHA commits a kickoff prompt under `HANDOFFS/` and says "paste into Claude Code."

---

## The Five Commands

### 1. Install Claude Code (skip if already installed)
```powershell
claude --version
```
If "not recognized as a cmdlet":
```powershell
irm https://claude.ai/install.ps1 | iex
```
Then close PowerShell, reopen, verify:
```powershell
claude --version
```

### 2. First-time login (skip if already authed)
```powershell
claude
```
Browser opens → log in with Claude Max account → back in PowerShell type `/exit`.

### 3. Clone or navigate to the target repo
```powershell
cd $env:USERPROFILE
git clone https://github.com/Barefootservants2/a2e-platform.git   # first time only
cd a2e-platform
```
For other repos substitute the appropriate Barefootservants2 repo name.

### 4. Launch Claude Code inside the repo
```powershell
claude
```
You'll get an interactive prompt. Claude Code is now scoped to this directory and can read/write files in it.

### 5. Paste the kickoff brief
Open the relevant `CLAUDE_CODE_KICKOFF_*.md` file from `A2E_Protocols/HANDOFFS/` (local clone or GitHub). Select all → copy → paste as ONE message in the Claude Code prompt → Enter.

Claude Code reads the entire brief in one shot and begins execution. It will ask for confirmation before destructive actions.

---

## What this is NOT

- **Do NOT paste the brief into PowerShell directly.** PowerShell treats each line as a command and will error on every markdown heading, bullet, and function signature.
- **Do NOT paste into `cmd.exe`.** Use PowerShell.
- **Do NOT paste into the Claude desktop app or the web chat.** Those are MICHA, not Claude Code. They can't execute the implementation because they don't have filesystem write access to your local repos.

## Common PowerShell error signatures and what they mean

| Error | Cause | Fix |
|---|---|---|
| `claude : The term 'claude' is not recognized` | Not installed OR new PATH hasn't taken effect | Run Step 1 installer, then close + reopen PowerShell |
| `The token '&&' is not a valid statement separator` | You're in PowerShell with a bash-flavored command | In PowerShell use `;` between commands, or run them on separate lines |
| `irm : The term 'irm' is not recognized` | You're in CMD, not PowerShell | Start PowerShell (type `powershell` in Start menu), re-run |
| `ModuleNotFoundError: No module named 'a2e'` | You ran `python -m a2e.snapshot` before the module existed | Let Claude Code build the module first; these commands are the LAST step of the flow, not the first |
| `file or directory not found: a2e-platform/tests/` | Same — the tests don't exist yet | Same — let Claude Code build them |
| Wall of "not recognized as a cmdlet" on markdown content | You pasted a markdown brief into PowerShell instead of into `claude` | Launch Claude Code with `claude` first, paste the brief INTO that session |

## After Claude Code finishes

It will commit `HANDOFF_FROM_CLAUDE_CODE.md` at the root of the repo. Send `PHOENIX RESUME` to a fresh MICHA chat. MICHA picks up the handoff, verifies the build, and bumps protocols to gate on the new capability.

---

**File committed to:** `A2E_Protocols/HANDOFFS/CLAUDE_CODE_LAUNCH_SEQUENCE.md`
**Last updated:** 2026-04-24 by MICHA after the Principal hit the paste-into-PowerShell trap.

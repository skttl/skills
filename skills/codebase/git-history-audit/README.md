# Git History Audit

Audit a repository's Git history before reading source code. This skill helps an agent identify churn hotspots, bus-factor risk, bug clusters, monthly activity patterns, and firefighting signals so the first code-reading pass starts in the right place.

Use this skill when working on:

- Codebase orientation or legacy-code audits.
- Technical-debt hotspot discovery.
- "What files should I read first?" questions.
- Risk reviews before refactoring, modernization, or ownership transfer.

## Contents

- [SKILL.md](SKILL.md): agent-facing audit workflow, commands, interpretation guidance, and report format.

## Installation

Copy this directory into your agent's skills folder:

```powershell
Copy-Item -Recurse .\skills\codebase\git-history-audit $env:USERPROFILE\.codex\skills\git-history-audit
```

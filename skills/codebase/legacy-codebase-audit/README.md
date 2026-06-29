# Legacy Codebase Audit

Audit unfamiliar or legacy codebases across languages and frameworks. This skill helps an agent map the human context, runtime shape, data boundaries, tests, dependencies, operational risks, and first refactor candidates before recommending changes.

Use this skill when working on:

- Legacy application audits.
- Technical-debt and maintainability assessments.
- Codebase takeover or onboarding.
- Modernization, migration, or rewrite-risk discovery.
- "What should we read or fix first?" questions.

## Contents

- [SKILL.md](SKILL.md): agent-facing audit workflow.
- [references/discovery-interview.md](references/discovery-interview.md): maintainer and operator questions.
- [references/system-map.md](references/system-map.md): language-agnostic repository, runtime, data, integration, and deployment mapping.
- [references/risk-scans.md](references/risk-scans.md): targeted command and inspection passes.
- [references/report-template.md](references/report-template.md): compact final report structure.

## Installation

Copy this directory into your agent's skills folder:

```powershell
Copy-Item -Recurse .\skills\codebase\legacy-codebase-audit $env:USERPROFILE\.codex\skills\legacy-codebase-audit
```

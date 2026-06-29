# Agent Skills

A small collection of reusable skills for coding agents.

This repository is structured as a general skill collection. Each skill lives in its own directory with a `SKILL.md` entry point and any deeper references beside it.

## Available Skills

| Category | Skill | Description |
| --- | --- | --- |
| Codebase | [git-history-audit](skills/codebase/git-history-audit/) | Audit Git history for churn hotspots, ownership concentration, bug clusters, activity trends, and firefighting patterns before reading code. |
| Codebase | [legacy-codebase-audit](skills/codebase/legacy-codebase-audit/) | Audit unfamiliar or legacy codebases across languages and frameworks to map risk, architecture, tests, operations, and first actions. |
| Frontend | [alpinejs](skills/frontend/alpinejs/) | Best-practice Alpine.js guidance for progressively enhanced, server-rendered interfaces. |
| Frontend | [htmx-alpinejs](skills/frontend/htmx-alpinejs/) | Best-practice guidance for combining htmx server updates with Alpine.js local UI state. |
| Frontend | [htmx](skills/frontend/htmx/) | Best-practice htmx guidance for server-rendered, hypermedia-driven interfaces. |
| Umbraco | [umbraco-package-scaffold](skills/umbraco/umbraco-package-scaffold/) | Scaffold or restructure an Umbraco community NuGet package with the recommended project layout. |

## Installation

### skills.sh

Install the full repository from [skills.sh](https://www.skills.sh/) with the `skills` CLI:

```bash
npx skills add skttl/skills
```

Run the command from the project root where you want the skills available, then start a new agent session.

To opt out of installer telemetry:

```bash
DISABLE_TELEMETRY=1 npx skills add skttl/skills
```

In PowerShell:

```powershell
$env:DISABLE_TELEMETRY = "1"
npx skills add skttl/skills
```

### Codex

For project-local installation, run the skills CLI from your project root:

```bash
npx skills add skttl/skills
```

For a manual user-level installation, copy each skill directory into your Codex skills folder:

```powershell
New-Item -ItemType Directory -Force $env:USERPROFILE\.codex\skills
Copy-Item -Recurse .\skills\codebase\git-history-audit $env:USERPROFILE\.codex\skills\git-history-audit
Copy-Item -Recurse .\skills\codebase\legacy-codebase-audit $env:USERPROFILE\.codex\skills\legacy-codebase-audit
Copy-Item -Recurse .\skills\frontend\alpinejs $env:USERPROFILE\.codex\skills\alpinejs
Copy-Item -Recurse .\skills\frontend\htmx-alpinejs $env:USERPROFILE\.codex\skills\htmx-alpinejs
Copy-Item -Recurse .\skills\frontend\htmx $env:USERPROFILE\.codex\skills\htmx
Copy-Item -Recurse .\skills\umbraco\umbraco-package-scaffold $env:USERPROFILE\.codex\skills\umbraco-package-scaffold
```

Restart Codex after installing.

### Claude Code

For project-local installation, run the skills CLI from your project root:

```bash
npx skills add skttl/skills
```

For a manual user-level installation, copy each skill directory into your Claude Code skills folder:

```bash
mkdir -p ~/.claude/skills
cp -R skills/codebase/git-history-audit ~/.claude/skills/git-history-audit
cp -R skills/codebase/legacy-codebase-audit ~/.claude/skills/legacy-codebase-audit
cp -R skills/frontend/alpinejs ~/.claude/skills/alpinejs
cp -R skills/frontend/htmx-alpinejs ~/.claude/skills/htmx-alpinejs
cp -R skills/frontend/htmx ~/.claude/skills/htmx
cp -R skills/umbraco/umbraco-package-scaffold ~/.claude/skills/umbraco-package-scaffold
```

Restart Claude Code after installing.

### Other Agents

For agents that support the `SKILL.md` convention, copy the skill directory you need into that agent's configured skills folder. Keep each skill directory intact so sibling reference files, scripts, and assets stay next to `SKILL.md`.

## Repository Layout

```text
skills/
  codebase/
    git-history-audit/
      SKILL.md
      README.md
    legacy-codebase-audit/
      SKILL.md
      README.md
      references/
  frontend/
    alpinejs/
      SKILL.md
      README.md
      COMPONENTS_AND_STORES.md
      CONCEPTS.md
      DIRECTIVES.md
      PLUGINS.md
      REFERENCES.md
      plugins/
    htmx-alpinejs/
      SKILL.md
      README.md
      OWNERSHIP_AND_EVENTS.md
      SWAPS_AND_TRANSITIONS.md
      PATTERNS.md
      REFERENCES.md
    htmx/
      SKILL.md
      README.md
      ARCHITECTURE.md
      ATTRIBUTES_AND_PATTERNS.md
      SECURITY_AND_ACCESSIBILITY.md
      REFERENCES.md
  umbraco/
    umbraco-package-scaffold/
      SKILL.md
      README.md
      references/
```

## Skill Format

Every skill should have:

- `SKILL.md`: the main instructions an agent loads.
- `README.md`: a human-facing overview and installation notes.
- Optional reference files next to `SKILL.md` for deeper guidance.
- Optional `scripts/`, `assets/`, or `references/` folders when the skill needs them.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the conventions to follow when adding or changing skills.

# Agent Skills

A small collection of reusable skills for coding agents.

This repository started as an Alpine.js skill, but it is now structured as a general skill collection. Each skill lives in its own directory with a `SKILL.md` entry point and any deeper references beside it.

## Available Skills

| Category | Skill | Description |
| --- | --- | --- |
| Frontend | [alpinejs](skills/frontend/alpinejs/) | Best-practice Alpine.js guidance for progressively enhanced, server-rendered interfaces. |
| Frontend | [htmx-alpinejs](skills/frontend/htmx-alpinejs/) | Best-practice guidance for combining htmx server updates with Alpine.js local UI state. |
| Frontend | [htmx](skills/frontend/htmx/) | Best-practice htmx guidance for server-rendered, hypermedia-driven interfaces. |

## Installation

Copy the skill directory you want into your agent's skills folder. For example:

```powershell
Copy-Item -Recurse .\skills\frontend\alpinejs $env:USERPROFILE\.codex\skills\alpinejs
Copy-Item -Recurse .\skills\frontend\htmx-alpinejs $env:USERPROFILE\.codex\skills\htmx-alpinejs
Copy-Item -Recurse .\skills\frontend\htmx $env:USERPROFILE\.codex\skills\htmx
```

For Claude Code, copy the matching folder into `~/.claude/skills/alpinejs`, `~/.claude/skills/htmx-alpinejs`, or `~/.claude/skills/htmx`.

If you use a skill installer that understands GitHub skill repositories, install this repository and select the skills you want.

## Repository Layout

```text
skills/
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
```

## Skill Format

Every skill should have:

- `SKILL.md`: the main instructions an agent loads.
- `README.md`: a human-facing overview and installation notes.
- Optional reference files next to `SKILL.md` for deeper guidance.
- Optional `scripts/`, `assets/`, or `references/` folders when the skill needs them.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the conventions to follow when adding or changing skills.

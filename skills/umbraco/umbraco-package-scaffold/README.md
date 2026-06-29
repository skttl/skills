# Umbraco Package Scaffold

Scaffold or restructure an Umbraco community NuGet package with the recommended project layout: a Razor SDK package project with embedded backoffice Client, a demo Umbraco site, release workflow, marketplace metadata, and supporting configuration.

## Use This Skill When

- Creating a new Umbraco community package.
- Restructuring an existing Umbraco extension into a standard NuGet package layout.
- Reviewing or explaining the recommended folder structure for an Umbraco backoffice extension package.

## Contents

- [SKILL.md](SKILL.md): agent-facing workflow and generation rules.
- [references/templates.md](references/templates.md): file templates used when scaffolding package repositories.

## Installation

Copy this directory into your agent's skills folder:

```powershell
Copy-Item -Recurse .\skills\umbraco\umbraco-package-scaffold $env:USERPROFILE\.codex\skills\umbraco-package-scaffold
```

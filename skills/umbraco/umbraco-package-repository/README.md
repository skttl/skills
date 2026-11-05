# Umbraco package repository

Define or scaffold a repository for an Umbraco NuGet package, with optional backoffice assets and configuration schemas. This replaces `umbraco-package-scaffold`.

The standard uses an official-template demo under `demo/`, version branches matching Umbraco majors, the lowest supported Umbraco dependency floor, separate CI and publishing workflows, and NuGet trusted publishing with prerelease support.

## Contents

- [SKILL.md](SKILL.md): repository conventions and verification requirements.
- [references/repository-review.md](references/repository-review.md): comparison of the four source repositories with pinned source links.
- [agents/openai.yaml](agents/openai.yaml): Codex metadata and manual invocation policy.

## Installation and invocation

Copy the entire directory into your agent's skills folder. For a manual user-level Codex installation:

```powershell
Copy-Item -Recurse .\skills\umbraco\umbraco-package-repository $env:USERPROFILE\.codex\skills\umbraco-package-repository
```

When upgrading an existing installation, remove the old installed `umbraco-package-scaffold` directory as well. Replacing it in this repository does not remove copies installed elsewhere.

In Codex, this skill disables implicit invocation with `policy.allow_implicit_invocation: false`. Invoke it explicitly:

```text
$umbraco-package-repository Define the repository structure for a package supporting Umbraco 17 and 18.
```

Other agents may not support Codex's invocation policy. Use their own controls when manual-only activation is required.

---
name: git-history-audit
description: Audit a repository's Git history before reading code. Use this when a user asks for a codebase audit, legacy-code orientation, technical-debt hotspots, churn analysis, bus-factor risk, bug hotspot discovery, firefighting patterns, or "what should I read first" in an existing repo.
---

# Git History Audit

Use Git history as a diagnostic map before opening implementation files. The goal is not to judge the code from commit data alone; it is to identify where to look first, what risks to test, and which caveats might make the history misleading.

## Workflow

1. Confirm you are in a Git repository with enough history to inspect.
2. Run history commands before reading source files, unless the user has already provided a specific file or bug.
3. Prefer application directories such as `app/`, `src/`, `lib/`, `client/`, or `server/` for file-level churn commands. Running from the repository root often overweights lockfiles, changelogs, generated code, migrations, and vendored assets.
4. Collect five signals:
   - Churn hotspots: files changed most often.
   - Ownership concentration: who appears to have built or maintained the project.
   - Bug hotspots: files repeatedly touched by fix-like commits.
   - Activity trend: monthly commit rhythm.
   - Firefighting pattern: reverts, hotfixes, rollbacks, and emergency commits.
5. Cross-reference signals. A file that is both high-churn and high-bug is more important than a file that appears in only one list.
6. Read code only after the history pass, starting with the strongest hotspots and their tests, callers, and recent commits.

## Commands

Run the Unix-style commands in Git Bash, bash, zsh, or any shell with `sort`, `uniq`, `head`, and `grep`.

### Churn Hotspots

From the most relevant source directory:

```bash
git log --format=format: --name-only --since="1 year ago" | sort | uniq -c | sort -nr | head -20
```

PowerShell alternative:

```powershell
git log --format=format: --name-only --since="1 year ago" |
  Where-Object { $_ } |
  Group-Object |
  Sort-Object Count -Descending |
  Select-Object -First 20 Count, Name
```

Interpretation:

- High churn can mean active development, not necessarily bad code.
- High churn plus unclear ownership, fear around changes, or many bug fixes suggests drag.
- Ignore or separately note generated files, lockfiles, dependency manifests, changelogs, snapshots, and bulk formatting changes.

### Ownership Concentration

```bash
git shortlog -sn --no-merges
git shortlog -sn --no-merges --since="6 months ago"
```

Interpretation:

- If one person accounts for roughly 60% or more of commits, flag bus-factor risk.
- If the historical top contributor is absent from recent history, flag knowledge-loss risk.
- If many people contributed historically but only a few are active now, flag maintainership drift.
- Ask about squash merges before drawing strong authorship conclusions; squash-heavy workflows can reflect merge authors more than implementation authors.

### Bug Hotspots

```bash
git log -i -E --grep="fix|bug|broken" --name-only --format='' | sort | uniq -c | sort -nr | head -20
```

PowerShell alternative:

```powershell
git log -i -E --grep="fix|bug|broken" --name-only --format='' |
  Where-Object { $_ } |
  Group-Object |
  Sort-Object Count -Descending |
  Select-Object -First 20 Count, Name
```

Interpretation:

- Compare this list with churn hotspots.
- Weak commit messages reduce the value of this signal. If messages are mostly vague, say so and avoid overclaiming.
- Consider expanding the grep terms to match the team's language, such as `defect`, `regression`, `patch`, `crash`, `incident`, or issue IDs.

### Monthly Activity

```bash
git log --format='%ad' --date=format:'%Y-%m' | sort | uniq -c
```

PowerShell alternative:

```powershell
git log --format='%ad' --date=format:'%Y-%m' |
  Group-Object |
  Sort-Object Name |
  Select-Object Count, Name
```

Interpretation:

- A steady rhythm usually suggests normal maintenance.
- A sharp drop can indicate team changes, a project freeze, migration, or a repository split.
- Spikes followed by quiet periods can indicate batch releases, deadline pushes, or irregular delivery.
- This is team/process context, not code quality by itself.

### Firefighting Pattern

```bash
git log --oneline --since="1 year ago" | grep -iE 'revert|hotfix|emergency|rollback'
```

PowerShell alternative:

```powershell
git log --oneline --since="1 year ago" |
  Select-String -Pattern 'revert|hotfix|emergency|rollback' -CaseSensitive:$false
```

Interpretation:

- A few entries over a year is ordinary.
- Frequent reverts or hotfixes suggest deployment, test, review, or release-confidence problems.
- Zero entries can mean stability, poor commit messages, or a workflow where incident work is hidden in tickets rather than commit messages.

## Optional Follow-Ups

Use these when the first pass raises a strong signal:

```bash
git log --follow --oneline -- path/to/hotspot
git log --follow -p --since="6 months ago" -- path/to/hotspot
git blame -w path/to/hotspot
git log --since="1 year ago" -- path/to/hotspot
```

Read the hotspot's tests, nearest callers, and recent pull requests or issue references if available. Use `git blame -w` to reduce noise from whitespace-only changes, and treat blame as context rather than fault assignment.

## Report Structure

Keep the report compact and evidence-led:

```markdown
# Git History Audit

## Executive Summary
[3-6 bullets: highest-risk files, ownership concerns, process signals, and what to read first.]

## Signals
### Churn Hotspots
[Top files, evidence, caveats.]

### Ownership
[Contributor concentration, recent activity comparison, squash-merge caveat if relevant.]

### Bug Hotspots
[Files with repeated fix-like commits and overlap with churn.]

### Activity Trend
[Monthly pattern and plausible interpretations.]

### Firefighting
[Frequency and examples of revert/hotfix/rollback commits.]

## Read First
[Prioritized files or areas, with why each one matters.]

## Caveats
[Generated files, weak commit messages, squash merges, shallow clone, renamed files, missing history.]

## Next Questions
[Questions for maintainers that would confirm or challenge the Git-history signals.]
```

## Review Checklist

- Did you run the history pass before diving into implementation files?
- Did you scope file churn away from obvious generated or dependency files?
- Did you cross-reference churn and bug hotspots instead of treating each command in isolation?
- Did you distinguish evidence from interpretation?
- Did you include caveats for squash merges, weak commit messages, renamed files, shallow clones, or missing history?
- Did the final report tell the user exactly which files or areas to read first?

## Source Inspiration

This workflow is inspired by Ally Piechowski's "The Git Commands I Run Before Reading Any Code": https://piechowski.io/post/git-commands-before-reading-code/

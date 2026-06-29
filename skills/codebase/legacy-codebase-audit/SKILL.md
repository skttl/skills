---
name: legacy-codebase-audit
description: Audits unfamiliar or legacy codebases across languages and frameworks. Maps people context, architecture, runtime entry points, data boundaries, tests, dependencies, operational risk, and first refactor candidates. Use when asked to audit a legacy app, assess technical debt, onboard to an old system, review maintainability, or decide what to read first in any existing codebase.
---

# Legacy Codebase Audit

Audit the codebase as a living system before proposing changes. Start with people, risks, and runtime shape; then use targeted code and tool passes to produce a small, evidence-led triage.

## Reference Files

| File | Read When |
| --- | --- |
| `references/discovery-interview.md` | Before or during the audit when maintainers are available, or when the user can answer project-context questions. |
| `references/system-map.md` | When mapping manifests, entry points, architecture, data, external services, and deployment surfaces. |
| `references/risk-scans.md` | When choosing concrete commands and inspections for tests, dependencies, security, history, observability, and dead code. |
| `references/report-template.md` | Before writing the final audit so the output stays compact and actionable. |

## Audit Workflow

Copy this checklist while working:

```text
Legacy codebase audit progress:
- [ ] Step 1: Confirm scope, constraints, and timebox
- [ ] Step 2: Interview the humans or infer missing context
- [ ] Step 3: Map manifests, entry points, data, jobs, integrations, and deployment
- [ ] Step 4: Run risk scans for history, tests, dependencies, security, operations, and dead code
- [ ] Step 5: Read the highest-risk paths with tests, callers, and recent commits
- [ ] Step 6: Produce a one-page triage with evidence, confidence, and next actions
```

### Step 1: Confirm Scope

Clarify the audit question before reading deeply:

- Is the goal modernization, takeover, rescue, security, performance, feature work, migration, or refactoring?
- What is the allowed timebox: 30 minutes, half day, one day, or a deeper engagement?
- Which outputs matter: risk list, onboarding map, refactor plan, test plan, estimate, or go/no-go advice?
- What cannot be changed: public APIs, database schema, uptime, compliance surface, customer contracts, or platform constraints?

If the user does not specify a timebox, default to a first-pass audit that finds the top risks and what to read next.

### Step 2: Start With People

Read `references/discovery-interview.md` if maintainers, product owners, or operators are available. If nobody is available, infer the same categories from docs, commits, issue trackers, runbooks, TODOs, incidents, and deployment configuration.

Always distinguish what people say from what the repository proves. Mismatches are valuable audit findings.

### Step 3: Map The System

Read `references/system-map.md`. Build a thin map before judging implementation quality:

- Technology stack and package manifests.
- Application entry points, routing, API, CLI, workers, scheduled jobs, and event consumers.
- Data model, migrations, persistence boundaries, caches, and files.
- External services, credentials, queues, webhooks, payments, mail, search, auth, or analytics.
- Test suite layout and how the app is built, run, deployed, observed, and rolled back.

Prefer framework-native structure where it exists, but keep the questions language-agnostic.

### Step 4: Run Targeted Risk Scans

Read `references/risk-scans.md`. Use commands and repository evidence to find:

- Hotspots from Git churn and bug-fix history.
- Missing or brittle tests around high-change paths.
- Dependency, runtime, and platform age.
- Security-sensitive surfaces: auth, authorization, secrets, serialization, uploads, redirects, injection, and admin tools.
- Operational gaps: migrations, background jobs, observability, error handling, deployment, and rollback.
- Dead code, duplicate concepts, unclear ownership, and large modules with mixed responsibilities.

Do not report every smell. Keep evidence for the few issues that change what the team should do next.

### Step 5: Read The Riskiest Paths

For each strong signal, read the implementation with its tests, callers, data shape, configuration, and recent commits. A risky file usually earns attention when two or more signals overlap: high churn, many fix commits, weak tests, production incidents, old dependencies, security sensitivity, or maintainers expressing fear.

### Step 6: Produce Triage

Read `references/report-template.md`. The final report should be brief enough that a busy maintainer can act on it:

- Current system shape.
- Top 3-7 risks with evidence and confidence.
- First files or areas to read.
- Quick wins, guarded refactors, and deeper investigation tracks.
- Questions for maintainers that would materially change the plan.

## Audit Principles

- Start from the business-critical paths, not from personal style preferences.
- Prefer observed behavior, commands, tests, and production surfaces over vibes.
- Treat legacy choices as historical constraints until proven otherwise.
- Separate "risky" from "ugly"; ugly stable code may be lower priority than clean-looking code that handles money, auth, or data loss.
- Call out missing evidence. A shallow clone, absent production config, missing test services, or private deployment pipeline should lower confidence.

## Anti-Patterns

- Rewriting the audit into a generic best-practices lecture.
- Spending the timebox cataloging every TODO, lint warning, or dependency patch.
- Assuming Rails, Node, .NET, Java, Python, PHP, or any other stack-specific convention applies without repository evidence.
- Treating commit history as blame instead of navigation.
- Proposing a rewrite before proving why incremental repair cannot work.

## Related Skills

- `git-history-audit` for a deeper Git-only hotspot pass before reading implementation code.

## Source Inspiration

This workflow is inspired by Ally Piechowski's "How I Audit a Legacy Rails Codebase": https://piechowski.io/post/how-i-audit-a-legacy-rails-codebase/

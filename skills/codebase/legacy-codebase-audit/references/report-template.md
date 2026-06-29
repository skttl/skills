# Report Template

Keep the report short, evidence-led, and explicit about confidence.

```markdown
# Legacy Codebase Audit

## Executive Summary
- [3-6 bullets covering system shape, biggest risks, and recommended first move.]

## System Map
- Runtime: [frameworks, services, entry points.]
- Data: [databases, schemas, queues, storage, external state.]
- Delivery: [build/test/deploy/observability summary.]
- Critical flows: [business-critical paths found or inferred.]

## Top Risks

### 1. [Risk title]
- Evidence: [files, commands, tests, commits, maintainer claim, or runtime surface.]
- Impact: [what breaks or slows down.]
- Confidence: [High/Medium/Low and why.]
- Next action: [specific check, test, refactor, question, or spike.]

### 2. [Risk title]
- Evidence:
- Impact:
- Confidence:
- Next action:

## Read First
- `[path]`: [why this file or area matters.]
- `[path]`: [why this file or area matters.]

## Quick Wins
- [Small change with clear safety boundary.]
- [Documentation, test harness, command, script, or dependency fix.]

## Guarded Refactors
- [Refactor candidate, required characterization tests, and rollback strategy.]

## Open Questions
- [Question whose answer would change priority or risk.]

## Caveats
- [Missing access, shallow history, private docs, failing setup, weak commit messages, unavailable services, generated code noise.]
```

## Severity Guidance

- **Critical:** Security, data loss, money movement, compliance, production outage, or unrecoverable migration risk.
- **High:** Blocks safe feature work, makes deploys risky, lacks tests around critical flows, or depends on fragile tribal knowledge.
- **Medium:** Slows maintainers, increases regression risk, or complicates onboarding without immediate production danger.
- **Low:** Cleanup, naming, documentation, or local consistency issues that do not materially change delivery risk.

## Writing Rules

- Lead with findings, not methodology.
- Attach every major claim to evidence or mark it as a maintainer claim.
- Include confidence when evidence is partial.
- Recommend the smallest next action that improves knowledge or safety.
- Avoid prescribing a rewrite unless the evidence shows incremental repair is not credible.

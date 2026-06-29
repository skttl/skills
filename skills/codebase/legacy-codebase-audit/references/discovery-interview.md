# Discovery Interview

Use these prompts to uncover the human map behind the code. Ask only the questions that fit the audit goal and timebox.

## Product And Business Context

- What does this system do that customers or the business would immediately miss?
- Which flows are most valuable, most fragile, or most complained about?
- Which features are actively changing, and which are kept alive only for compatibility?
- What deadlines, migrations, contracts, or compliance needs shape the work?

## Ownership And History

- Who knows the system best today?
- Who built the original architecture, and are they still available?
- Which areas do developers avoid touching?
- What previous refactors, rewrites, upgrades, or migrations failed or stalled?
- Are there private docs, runbooks, tickets, dashboards, or incident notes outside the repository?

## Operations

- How is the system deployed, monitored, scaled, backed up, and rolled back?
- What are the common production incidents?
- Which jobs, queues, imports, exports, cron tasks, or integrations need manual care?
- What is hard to reproduce locally?

## Testing And Change Confidence

- Which tests are trusted, ignored, flaky, slow, or missing?
- What manual QA is required before release?
- Which areas have caused regressions after apparently small changes?
- Where does the team want more confidence before shipping?

## Audit Handling

Record answers as claims, not facts, until the repository or runtime confirms them. In the report, mark contradictions between maintainer memory and code evidence as investigation items rather than as accusations.

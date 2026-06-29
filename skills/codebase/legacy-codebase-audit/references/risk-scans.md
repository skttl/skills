# Risk Scans

Pick scans based on the repository and audit question. Prefer commands that produce evidence quickly.

## Git Hotspots

Use `git-history-audit` for a deeper pass. At minimum, inspect churn and recent bug-like commits:

```bash
git log --format=format: --name-only --since="1 year ago" | sort | uniq -c | sort -nr | head -30
git log -i -E --grep="fix|bug|broken|regression|hotfix|incident" --name-only --format='' | sort | uniq -c | sort -nr | head -30
```

In PowerShell:

```powershell
git log --format=format: --name-only --since="1 year ago" |
  Where-Object { $_ } |
  Group-Object |
  Sort-Object Count -Descending |
  Select-Object -First 30 Count, Name
```

Ignore generated files, lockfiles, snapshots, broad formatting commits, and bulk migrations unless they explain delivery risk.

## Tests And Build Confidence

Find the commands first:

```bash
rg "test|spec|lint|typecheck|build|ci|coverage" package.json pyproject.toml tox.ini noxfile.py Makefile Taskfile.yml justfile composer.json Gemfile *.csproj pom.xml build.gradle settings.gradle .github -n
```

Then check:

- Can the project install, build, test, and lint from a clean checkout?
- Are critical flows covered by integration, component, or end-to-end tests?
- Are tests skipped, quarantined, flaky, slow, or dependent on private services?
- Do high-churn files have tests nearby or only broad manual QA?

Do not spend the whole audit making tests pass unless that is the requested output. Record blockers and confidence impact.

## Dependency And Platform Age

Inspect manifests and runtime files for outdated or unsupported platforms. Use ecosystem-native tools when available and safe:

```bash
npm outdated
pnpm outdated
yarn outdated
bundle outdated
pip list --outdated
dotnet list package --outdated
composer outdated
mvn versions:display-dependency-updates
gradle dependencyUpdates
```

If network or credentials are unavailable, read lockfile dates, runtime pins, Docker images, CI images, and framework versions. Separate urgent security/runtime issues from ordinary upgrade backlog.

## Security-Sensitive Surfaces

Search for risky classes of behavior using language-appropriate patterns:

```bash
rg -n "auth|authorize|permission|role|admin|secret|token|password|cookie|session|csrf|cors|redirect|upload|deserialize|eval|exec|raw sql|SELECT|INSERT|UPDATE|DELETE"
```

Focus on auth, authorization, file upload, deserialization, redirects, template rendering, command execution, dynamic SQL, secrets, admin tools, and public endpoints. Report exploitable-looking risk carefully and avoid overstating without a reproduction path.

## Dead Code And Complexity

Look for:

- Unreferenced routes, commands, jobs, feature flags, services, or UI components.
- Large modules with mixed responsibilities and high churn.
- Duplicate domain concepts with different names.
- TODO, FIXME, HACK, deprecated, temporary, legacy, and compatibility comments.
- Feature branches, abandoned migrations, old adapters, or stale integration clients.

Use dead-code findings as candidates for questions or guarded deletion, not as proof that removal is safe.

## Operations And Data Safety

Inspect migrations, jobs, imports, exports, and deployment scripts for:

- Non-idempotent work, missing transactions, missing retries, missing timeouts, and partial-failure hazards.
- Long-running migrations, locks, backfills, destructive schema changes, and absent rollback plans.
- Jobs without monitoring, deduplication, or poison-message handling.
- Scripts that run directly against production data without dry-run support.

Treat data loss, auth bypass, payment errors, and irreversible migrations as top-priority risks even if the code is not high-churn.

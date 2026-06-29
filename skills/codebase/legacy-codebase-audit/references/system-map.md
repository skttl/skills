# System Map

Build a thin, practical map of the system before evaluating design quality.

## Repository Shape

Look for:

- Package manifests and lockfiles: language, framework, runtime, package manager, dependency age.
- Source roots: `src/`, `app/`, `lib/`, `server/`, `client/`, `packages/`, `modules/`, `services/`.
- Test roots: `test/`, `tests/`, `spec/`, `__tests__/`, `e2e/`, `integration/`.
- Tooling: build scripts, linting, formatting, type checking, CI workflows, Dockerfiles, compose files, task runners.
- Generated, vendored, migration, snapshot, or compiled artifacts that should not dominate analysis.

## Runtime Entry Points

Identify every way code is invoked:

- Web routes, controllers, handlers, pages, middleware, and API schemas.
- CLI commands, scripts, admin tasks, migrations, seeders, and maintenance tools.
- Background workers, queues, scheduled jobs, consumers, webhooks, and event handlers.
- Frontend bundles, server-rendered templates, static assets, mobile clients, or desktop clients.

Write down the entry points that connect to business-critical flows. These are often better audit anchors than directory names.

## Data Boundaries

Map:

- Database schemas, migrations, ORM models, repositories, stored procedures, indexes, constraints, and seed data.
- Caches, object storage, search indexes, message queues, file imports, exports, and external state.
- Serialization formats, public API contracts, events, webhooks, and reports.

Flag missing constraints, migrations that perform data changes unsafely, schema drift, unclear ownership of shared tables, and code that bypasses normal data access patterns.

## Integrations

List outbound and inbound dependencies:

- Auth, payments, email, SMS, CRM, ERP, CMS, search, analytics, maps, identity providers, internal services, and partner APIs.
- Configuration and secrets required for local, staging, and production environments.
- Retry behavior, idempotency, rate limits, timeouts, and error handling.

Integrations deserve extra attention when tests mock only the happy path or when production behavior is hidden behind private credentials.

## Deployment And Runtime

Find:

- CI/CD workflows, deployment scripts, infrastructure definitions, process managers, containers, hosting config, and environment variables.
- Observability: logs, metrics, traces, health checks, error reporting, dashboards, alerting, and audit trails.
- Rollback and recovery: backups, restore scripts, feature flags, release toggles, migration rollback strategy.

Operational gaps are audit findings when they make ordinary changes hard to ship safely.

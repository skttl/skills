# htmx Best Practices

Guidance for adding, refactoring, and reviewing htmx in server-rendered, hypermedia-driven interfaces.

Use this skill when working with:

- htmx attributes such as `hx-get`, `hx-post`, `hx-target`, `hx-swap`, `hx-trigger`, `hx-push-url`, and `hx-indicator`.
- Server endpoints that return HTML fragments.
- Full-page versus partial rendering with `HX-Request`, `HX-Target`, or `HX-Trigger`.
- Progressive enhancement of server-rendered links and forms.
- htmx security, accessibility, and request-performance reviews.

## Contents

- [SKILL.md](SKILL.md): core agent instructions.
- [ARCHITECTURE.md](ARCHITECTURE.md): routing, templates, REST shape, and URL/history guidance.
- [ATTRIBUTES_AND_PATTERNS.md](ATTRIBUTES_AND_PATTERNS.md): attribute ordering, targets, swaps, triggers, and common UI patterns.
- [SECURITY_AND_ACCESSIBILITY.md](SECURITY_AND_ACCESSIBILITY.md): escaping, cookies, CSRF, trusted routes, history cache, and accessible swaps.
- [REFERENCES.md](REFERENCES.md): reference links.

## Design Stance

Use htmx as a hypermedia enhancement for server-rendered HTML. Keep canonical state, layout decisions, validation, and authorization in the backend; use htmx to request and swap focused HTML fragments where that improves the user experience.

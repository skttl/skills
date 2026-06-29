---
name: htmx-alpinejs
description: Guides best-practice integration of htmx and Alpine.js in server-rendered, hypermedia-driven interfaces. Use when adding, refactoring, or reviewing code that combines hx-* attributes with Alpine directives such as x-data, x-show, x-transition, x-on, x-bind, $dispatch, htmx lifecycle events, modal shells, inline editing, dropdowns, fragment swaps that affect Alpine state, or decisions about whether server state belongs to htmx and transient UI state belongs to Alpine.js.
---

# htmx + Alpine.js Best Practices

Use htmx for server communication and server-owned HTML. Use Alpine.js for transient browser-only behavior. The stack works best when the boundary is obvious in the markup: htmx asks the server for canonical fragments; Alpine coordinates local visibility, focus, transitions, and small UI state.

## Start Here

Before editing combined htmx and Alpine code, inspect:

- Which data is durable, validated, permissioned, or database-backed.
- Which state is presentation-only and can disappear on refresh.
- Which element sends the htmx request, which server route handles it, and which target is swapped.
- Which Alpine component owns local visibility, selection, focus, or transition state.
- Whether an htmx swap replaces an Alpine root, a child inside an Alpine root, or a sibling controlled by Alpine.
- Whether the two libraries communicate through browser events, response headers, or brittle direct state coupling.

If the task is mostly htmx endpoint design, also use the `htmx` skill. If the task is mostly Alpine component design, also use the `alpinejs` skill.

## Ownership Rule

- Let htmx own data that lives in a database, requires backend validation, affects permissions, changes canonical server state, or must survive refresh.
- Let Alpine own temporary UI state such as open modals, dropdown visibility, tabs that do not need URLs, client-only previews, selected local rows, transition flags, and focus choreography.
- Keep the URL meaningful for user-visible server state such as filters, search queries, pagination, selected records, and drill-down context.
- Avoid duplicating the same business state in Alpine and on the server. When the server changes durable state, return the new canonical HTML through htmx.

## Decision Guide

| Feature | Primary tool | Typical shape |
| --- | --- | --- |
| Form submit, validation, save, delete | htmx | Native form plus `hx-post`, `hx-target`, and returned form/list fragment |
| Search, filters, pagination, table refresh | htmx | Debounced `hx-get` with query string and stable result target |
| Dropdown, disclosure, mobile menu | Alpine | Local `x-data`, `x-show`, `x-transition`, ARIA bindings |
| Modal shell visibility and focus | Alpine | Static shell with `x-show`, Escape/outside handling, focus management |
| Modal content, edit form, details body | htmx | `hx-get` or `hx-post` targeting the modal body |
| Toast visibility, optimistic affordance | Alpine | Local/store state triggered by htmx events or `HX-Trigger` |
| Reordering or drag/drop that persists | Both | Alpine or plugin for interaction, htmx/server for persistence |

## Integration Rules

- Communicate with browser events instead of reaching across library internals.
- Prefer `x-on:htmx:*` listeners, `HX-Trigger` response headers, `$dispatch(...)`, and `hx-trigger="custom-event from:body"` over direct coupling between Alpine state and htmx request configuration.
- Keep htmx attributes readable and specific: one request action, one clear target, one swap strategy, and one request timing rule.
- Keep Alpine expressions short. Extract branching, request choreography, and repeated behavior into `Alpine.data(...)`.
- Keep static Alpine shells outside high-churn htmx targets when the shell's local state should survive swaps.
- Swap the smallest stable fragment that matches the server-owned update.
- Use `x-cloak`, `x-show`, `x-transition`, `.htmx-request`, `.htmx-swapping`, `.htmx-settling`, and htmx `swap:` or `settle:` timing deliberately when transitions matter.
- Use morphing only when preserving client-side state across server updates is important enough to justify the extra behavior.

## Preferred Patterns

- Static modal shell: render one empty modal shell in the page, let Alpine open/close it, and let htmx fill only the modal body.
- Inline edit: let Alpine toggle view/edit mode locally, let htmx submit the form and replace the row/card with canonical server HTML.
- Server event bridge: let the server send `HX-Trigger` events for saved, deleted, or refreshed outcomes; let Alpine listen and update local UI.
- Client event bridge: let Alpine dispatch custom events for local choices; let htmx listen with `hx-trigger="event-name from:body"` when a server refresh is needed.
- Local post-request cleanup: listen for htmx lifecycle events to close a panel, reset a local flag, focus an element, or clear a temporary loading state.

## Avoid

- Moving backend validation, permissions, or workflow transitions into Alpine.
- Fetching JSON in Alpine and rendering it with `x-for` when the project already has an htmx HTML fragment endpoint for the same server-owned view.
- Binding large Alpine objects into `hx-vals` or building dynamic htmx URLs from complex inline Alpine expressions.
- Swapping an Alpine component root repeatedly when the user expects its local state to survive.
- Returning a whole modal overlay from the server when only the modal content is server-owned.
- Hiding important server-rendered content behind Alpine-only state without a non-JavaScript fallback.

## Review Checklist

- Is the htmx/Alpine ownership boundary explicit?
- Does htmx own durable state, validation, permissions, and canonical HTML?
- Does Alpine own only transient UI behavior?
- Do custom interactions use browser events instead of hidden coupling?
- Does every htmx request have a stable target and matching response fragment shape?
- Will Alpine state survive or intentionally reset after the chosen htmx swap?
- Are transitions coordinated with `x-cloak`, `x-show`, htmx request classes, and swap/settle timing?
- Are complex Alpine expressions extracted into `Alpine.data(...)`?
- Are modals, menus, validation errors, and async updates accessible?

## References

Read [OWNERSHIP_AND_EVENTS.md](OWNERSHIP_AND_EVENTS.md) for state boundaries and event bridging. Read [SWAPS_AND_TRANSITIONS.md](SWAPS_AND_TRANSITIONS.md) for Alpine initialization, state preservation, morphing, and animation timing. Read [PATTERNS.md](PATTERNS.md) for modal, inline edit, event bridge, and cleanup examples. See [REFERENCES.md](REFERENCES.md) for source links.

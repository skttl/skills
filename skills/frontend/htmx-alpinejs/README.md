# htmx + Alpine.js Best Practices

Guidance for adding, refactoring, and reviewing interfaces that combine htmx for server-rendered HTML updates with Alpine.js for local browser behavior.

Use this skill when working with:

- Features that combine `hx-*` attributes and Alpine directives.
- State-boundary decisions between server-owned data and client-only UI state.
- Browser-event bridges such as `$dispatch(...)`, `HX-Trigger`, and htmx lifecycle events.
- Modal shells, inline edits, dropdowns, tabs, toasts, filters, and loading states.
- htmx swaps that create, replace, or morph Alpine components.

## Contents

- [SKILL.md](SKILL.md): core agent instructions.
- [OWNERSHIP_AND_EVENTS.md](OWNERSHIP_AND_EVENTS.md): state ownership rules and browser-event bridges.
- [SWAPS_AND_TRANSITIONS.md](SWAPS_AND_TRANSITIONS.md): Alpine initialization, state preservation, morphing, and transition timing.
- [PATTERNS.md](PATTERNS.md): modal, inline edit, filter, custom event, toast, and script hygiene examples.
- [REFERENCES.md](REFERENCES.md): reference links.

## Design Stance

Use htmx for durable server state, backend validation, canonical HTML fragments, and URL-addressable interactions. Use Alpine.js for transient state such as visibility, focus, transition flags, and local UI convenience. Let the two libraries communicate with native browser events instead of shared hidden state.

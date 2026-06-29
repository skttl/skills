# Alpine.js Concepts Guide

Use this file when a task touches Alpine concepts beyond individual directives. Keep the implementation progressive: server-rendered HTML remains the durable source of truth, and Alpine adds focused client-side behavior.

## Essentials

- Installation: follow the project's existing Alpine loading style. Do not introduce a CDN script into a bundled application unless the project already works that way.
- State: use local `x-data` for local UI state and `Alpine.store(...)` for genuinely shared state. Keep state minimal and derive values with getters or methods.
- Templating: prefer readable markup with short directive expressions. Move branching, filtering, and multi-step behavior into `Alpine.data(...)` methods or getters.
- Events: use long-form `x-on:event` syntax. Add modifiers when they communicate intent, such as `.prevent`, `.stop`, `.outside`, `.window`, or `.escape`.
- Lifecycle: prefer `init()` inside registered root components. Use `x-init` only for child elements or anonymous components.

## UI Components

- Dropdowns: bind expanded state, close on outside click and Escape, and reflect state with ARIA attributes.
- Modals: manage focus, Escape behavior, background interaction, scroll locking, and accessible labels.
- Tabs/disclosure: use buttons, not links, when changing local UI state without navigation.
- Forms: keep client-side validation helpful but treat backend validation as authoritative.

## Magics

- `$el`: access the current element when a declarative binding cannot express the behavior.
- `$refs`: coordinate named child elements. Prefer bindings until direct DOM access is clearer.
- `$store`: read or update shared state registered with `Alpine.store(...)`.
- `$watch`: react to state changes for side effects. Prefer getters for derived values.
- `$dispatch`: emit custom events to communicate upward or across nearby components without tight coupling.
- `$nextTick`: wait for Alpine to finish DOM updates before measuring or focusing elements.
- `$root`, `$data`, `$id`: use for root access, current component data, and generated stable IDs when those are clearer than passing values manually.

## Globals

- `Alpine.data(...)`: register every reusable component here. Do not create global factory functions for `x-data`.
- `Alpine.store(...)`: register shared state for app-level UI concerns, not one-off component internals.
- `Alpine.bind(...)`: use only when a project already centralizes reusable attribute bindings this way.
- See [COMPONENTS_AND_STORES.md](COMPONENTS_AND_STORES.md) for reusable component and store patterns.

## Plugins

- See [PLUGINS.md](PLUGINS.md) for the built-in plugin guide.

## Advanced Topics

- CSP: avoid inline JavaScript-heavy patterns when the project has strict content security policy requirements.
- Reactivity: keep reactive dependencies easy to see. Avoid hidden state mutation in markup expressions.
- Extending: add custom Alpine extensions only when repeated behavior cannot be expressed with local components or plugins.
- Async: keep loading and error states explicit, and let backend routes or APIs own durable data changes.

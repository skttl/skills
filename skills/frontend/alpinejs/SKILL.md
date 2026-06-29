---
name: alpinejs
description: Guides best-practice Alpine.js development for progressively enhanced, server-rendered interfaces. Use when adding, refactoring, or reviewing Alpine.js code, x-data components, Alpine stores, Alpine plugins, or HTML directives such as x-for, x-init, x-cloak, x-on:click, and x-bind:class.
---

# Alpine.js Best Practices

Use Alpine for progressive enhancement and focused UI behavior, not as a full single-page application framework. Let the backend or server-rendered layer own routing, core data loading, and durable business workflows; use Alpine for local interaction, disclosure, validation hints, transitions, and small pieces of shared UI state.

## Start Here

Before editing, inspect nearby Alpine code and follow the project's existing loading pattern:

- Registered Alpine factories, for example `Alpine.data('checkoutForm', () => ({ ... }))`.
- Bundled modules that attach components during `alpine:init`.

Prefer a small, idiomatic change over rewriting all Alpine usage in a file. Never create global component factory functions for `x-data`; register components with `Alpine.data(...)`.

## Component Design

- Keep each component focused on one interaction: dropdown, modal, tabs, quantity picker, form step, or validation area.
- Extract non-trivial logic out of inline `x-data`. Use `Alpine.data(...)` registrations, not global functions.
- Keep `x-data` state minimal. Store only UI state that can change; derive labels, booleans, and filtered lists with methods or getters.
- Split large interfaces into nested components when responsibilities differ. Avoid one parent component managing every button, field, and panel.
- Use `$refs` for direct element coordination only when a declarative binding is awkward.

```html
<section x-data="deliveryOptions">
  <button type="button" x-on:click="select(option.id)" x-bind:disabled="option.disabled">
    Choose
  </button>
</section>
```

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('deliveryOptions', () => ({
    selectedId: null,
    options: [],
    get hasSelection() {
      return this.selectedId !== null;
    },
    init() {
      this.options = this.loadOptions();
    },
    select(id) {
      this.selectedId = id;
    },
  }));
});
```

## State Rules

- Use local `x-data` for isolated component state.
- Use `Alpine.store(...)` for shared app state such as cart summary, theme, auth/user shell state, or cross-component notifications.
- Do not pass the same state through many nested components when a store is clearer.
- Do not put short-lived form field values in a global store unless multiple independent components genuinely need them.
- Use official plugins such as Persist when the behavior matches the plugin; avoid hand-rolled localStorage wrappers for ordinary persisted UI state.

## Directive Rules

- Always use long-form directive syntax in markup: `x-on:click`, `x-on:submit`, `x-bind:class`, `x-bind:disabled`, and `x-model`.
- Do not introduce shorthand syntax for events or bindings.
- Add `x-cloak` to elements that would visibly flash before Alpine initializes, and ensure the stylesheet includes `[x-cloak] { display: none !important; }`.
- Always add stable `x-bind:key` values to `x-for` loops. Do not use array index keys when records have real IDs.
- Put root component setup in the component's `init()` method. Reserve `x-init` for child elements or anonymous Alpine components.
- Use event modifiers deliberately with long-form syntax: `x-on:click.stop`, `x-on:submit.prevent`, `x-on:keydown.escape.window`, `x-on:click.outside`.
- Keep directive expressions short. If an expression needs branching or multiple statements, move it to a component method.

## Accessibility

- Preserve native elements first: real buttons for actions, links for navigation, labels for inputs.
- Bind ARIA state when Alpine controls visibility or selection, for example `x-bind:aria-expanded="open.toString()"`.
- For modals and menus, manage focus, Escape behavior, outside click behavior, and background interaction. Use an existing local modal/menu pattern when available.
- Avoid hiding important server-rendered content behind Alpine-only behavior unless there is a non-JavaScript fallback.

## Backend Integration

- Prefer server-rendered HTML as the source of truth. Alpine should enhance what already exists.
- When paired with HTMX, Laravel, Rails, Razor, or Umbraco views, let the backend produce canonical markup and data attributes; let Alpine handle transient UI behavior.
- For server-provided values, prefer JSON script tags, `data-*` attributes, or explicit initialization objects over parsing text from the DOM.
- Be careful with Razor or other template syntaxes that also use `@`. Escape Alpine event syntax or use the framework's supported pattern when required.

## Review Checklist

- Is the component small enough to understand without tracing unrelated UI?
- Is complex logic extracted from inline markup?
- Is shared state in a store only when it is truly shared?
- Does every `x-for` have a stable `x-bind:key`?
- Does root component setup live in `init()` instead of `x-init`?
- Is `x-cloak` present where uninitialized content would flash?
- Are event modifiers used to prevent accidental bubbling or form submission?
- Are accessibility states, keyboard behavior, and focus behavior covered for interactive overlays?
- Does the change fit progressive enhancement instead of moving routing or business logic into Alpine?

## References

See [COMPONENTS_AND_STORES.md](COMPONENTS_AND_STORES.md), [PLUGINS.md](PLUGINS.md), [CONCEPTS.md](CONCEPTS.md), [DIRECTIVES.md](DIRECTIVES.md), and [REFERENCES.md](REFERENCES.md) for deeper Alpine guidance.

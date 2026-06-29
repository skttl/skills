# Alpine.js Directive Guide

Use this file when choosing or reviewing Alpine directives. Examples use long-form directive syntax to match the project style.

## Component Scope

- `x-data`: creates an Alpine component scope. For reusable root components, use `x-data="componentName"` with `Alpine.data('componentName', () => ({ ... }))`.
- `x-init`: runs setup code for an element. Prefer an `init()` method inside registered root components; reserve `x-init` for child elements or anonymous Alpine components.
- `x-ref`: names an element for access through `$refs`. Use it for focused DOM coordination, not as a default replacement for bindings.
- `x-id`: generates stable IDs for labels, controls, and ARIA relationships when repeated components need unique IDs.

## Rendering And Visibility

- `x-show`: toggles visibility while keeping the element in the DOM. Use for dropdowns, panels, modals, and other frequently toggled UI.
- `x-if`: conditionally creates and destroys DOM. Use on `<template>` when the element should not exist until needed, or when setup cost matters.
- `x-for`: repeats a `<template>` for a collection. Always provide `x-bind:key` with a stable domain ID.
- `x-transition`: animates show/hide transitions. Pair with `x-show` for simple disclosure animations.
- `x-cloak`: hides server-rendered markup until Alpine has initialized. Keep the global CSS rule `[x-cloak] { display: none !important; }`.

## Events And Bindings

- `x-on:event`: listens for events. Use modifiers deliberately, for example `x-on:click.stop`, `x-on:submit.prevent`, `x-on:keydown.escape.window`, and `x-on:click.outside`.
- `x-bind:attribute`: binds attributes, classes, styles, ARIA state, and disabled state. Keep expressions short and move branching into component methods.
- `x-model`: binds form controls to component state. Use it for local form UI state, not as a substitute for backend validation.
- `x-effect`: runs whenever its reactive dependencies change. Use sparingly for side effects; prefer getters for derived values.

## Text And HTML

- `x-text`: writes escaped text content. Prefer this for dynamic text.
- `x-html`: writes HTML. Use only when the HTML is trusted and intentionally allowed, because it can create injection risks.

## Advanced Boundaries

- `x-teleport`: renders markup elsewhere in the document. Use for modals, overlays, and menus that must escape parent stacking or overflow contexts.
- `x-ignore`: tells Alpine not to initialize or update a subtree. Use around third-party widgets or server-managed markup.

## Choosing Between Similar Directives

- Use `x-show` when users repeatedly open and close the same UI.
- Use `x-if` when the DOM should not exist until needed.
- Use `x-bind:class` for state-driven classes and keep class logic readable.
- Use `x-on` for behavior and `x-bind` for state reflection; avoid mixing large behavior expressions into bindings.
- Use `x-text` for dynamic copy and avoid `x-html` unless trusted markup is a real requirement.

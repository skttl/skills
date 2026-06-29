# Persist Plugin

Use Persist for ordinary UI preferences and lightweight state that should survive page loads. Avoid persisting sensitive values, server-owned data, or values with unclear reset behavior.

## Component State

Use `Alpine.$persist(...)` inside `Alpine.data(...)` registrations.

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('filterPanel', () => ({
    expanded: Alpine.$persist(false).as('filter-panel-expanded'),
    toggle() {
      this.expanded = !this.expanded;
    },
  }));
});
```

```html
<aside x-data="filterPanel">
  <button type="button" x-on:click="toggle" x-bind:aria-expanded="expanded.toString()">
    Filters
  </button>
  <div x-show="expanded" x-cloak>
    ...
  </div>
</aside>
```

## Store State

```js
document.addEventListener('alpine:init', () => {
  Alpine.store('theme', {
    mode: Alpine.$persist('system').as('theme-mode'),
    setMode(mode) {
      this.mode = mode;
    },
  });
});
```

# Reusable Components And Stores

Use this file when extracting repeated Alpine behavior or deciding whether state belongs in a component or a store.

## Reusable Components

- Register reusable components with `Alpine.data(...)` during `alpine:init` or from the existing bundle entry point.
- Reference registered components with `x-data="componentName"` for defaults, or `x-data="componentName(options)"` when the component needs small initialization parameters.
- Put root setup in `init()` and cleanup in `destroy()` when the component registers timers, observers, or external event listeners.
- Keep the component API narrow: state fields, getters, and methods that the markup actually needs.
- Prefer named methods over long directive expressions, especially for branching, validation, fetches, or multi-step DOM coordination.
- Do not expose component factories as globals just so markup can call them.

```html
<section x-data="accordion({ initiallyOpen: false })">
  <button type="button" x-on:click="toggle" x-bind:aria-expanded="open.toString()">
    Details
  </button>
  <div x-show="open" x-cloak>
    ...
  </div>
</section>
```

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('accordion', (options = {}) => ({
    open: Boolean(options.initiallyOpen),
    get isClosed() {
      return !this.open;
    },
    init() {
      // Root setup belongs here, not on the root element with x-init.
    },
    toggle() {
      this.open = !this.open;
    },
  }));
});
```

## Stores

- Use `Alpine.store(...)` for state that multiple independent components read or change.
- Good store candidates: cart summary, compare tray, theme, notification queue, authenticated user shell state, or feature flags.
- Poor store candidates: one dropdown's open state, one form field value, one modal's internal validation message, or data only one component owns.
- Keep store methods small and intentional. Let stores expose actions; avoid direct mutation from far-away markup when a method would communicate intent.
- Keep server-owned data server-owned. Stores may mirror lightweight UI state, but backend APIs and forms should remain authoritative for durable data.

```js
document.addEventListener('alpine:init', () => {
  Alpine.store('notifications', {
    items: [],
    add(message, variant = 'info') {
      this.items.push({ id: crypto.randomUUID(), message, variant });
    },
    remove(id) {
      this.items = this.items.filter((item) => item.id !== id);
    },
  });
});
```

```html
<div x-data x-show="$store.notifications.items.length > 0" x-cloak>
  <template x-for="notification in $store.notifications.items" x-bind:key="notification.id">
    <button type="button" x-on:click="$store.notifications.remove(notification.id)">
      <span x-text="notification.message"></span>
    </button>
  </template>
</div>
```

## Store Review Questions

- Do at least two independent components need this state?
- Is the state UI-level rather than durable business data?
- Are updates expressed through store methods with meaningful names?
- Would this be simpler as local `x-data`?
- If persisted, does the value have a stable storage key and a migration/reset plan?

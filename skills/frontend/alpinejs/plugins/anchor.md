# Anchor Plugin

Use Anchor to position floating UI relative to another element. Good fits include dropdowns, popovers, and tooltips when CSS positioning is not enough.

## Dropdown Menu

```html
<div x-data="dropdown">
  <button type="button" x-ref="trigger" x-on:click="toggle" x-bind:aria-expanded="open.toString()">
    Menu
  </button>
  <div x-show="open" x-anchor.offset.8="$refs.trigger" x-on:click.outside="close" x-cloak>
    ...
  </div>
</div>
```

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('dropdown', () => ({
    open: false,
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.open = false;
    },
  }));
});
```

Keep the trigger and anchored content in the same component unless the project has an established overlay system.

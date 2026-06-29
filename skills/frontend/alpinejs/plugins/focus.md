# Focus Plugin

Use Focus for overlays that need focus trapping or deliberate focus movement. Good fits include modals, drawers, command palettes, and menus.

## Modal Trap

```html
<section x-data="modal">
  <button type="button" x-on:click="open">Open</button>
  <div
    x-show="isOpen"
    x-trap.inert.noscroll="isOpen"
    x-on:keydown.escape.window="close"
    role="dialog"
    aria-modal="true"
    x-cloak
  >
    <button type="button" x-on:click="close">Close</button>
  </div>
</section>
```

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('modal', () => ({
    isOpen: false,
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  }));
});
```

Pair focus trapping with accessible labels, Escape handling, and background interaction rules.

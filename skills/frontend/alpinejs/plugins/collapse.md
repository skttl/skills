# Collapse Plugin

Use Collapse for height transitions on expanding and collapsing content. It is usually cleaner than measuring heights manually.

## Accordion Panel

```html
<section x-data="accordion">
  <button type="button" x-on:click="toggle" x-bind:aria-expanded="open.toString()">
    Details
  </button>
  <div x-show="open" x-collapse x-cloak>
    ...
  </div>
</section>
```

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('accordion', () => ({
    open: false,
    toggle() {
      this.open = !this.open;
    },
  }));
});
```

Use `x-show` with `x-collapse`; do not use `x-if` for the collapsing element unless destroying the DOM is intentional.

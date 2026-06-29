# Intersect Plugin

Use Intersect when UI should react to viewport entry or exit. Good fits include lazy loading, reveal animations, impression tracking, and infinite-scroll triggers.

## One-Time Trigger

```html
<div x-intersect.once="loadMoreProducts">
  <span x-show="loading" x-cloak>Loading...</span>
</div>
```

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('productList', () => ({
    loading: false,
    async loadMoreProducts() {
      if (this.loading) return;

      this.loading = true;
      try {
        await this.fetchNextPage();
      } finally {
        this.loading = false;
      }
    },
  }));
});
```

## Enter And Leave

```html
<section x-data="revealPanel" x-intersect:enter="show" x-intersect:leave="hide">
  ...
</section>
```

# Morph Plugin

Use Morph when new server-rendered HTML should update an existing DOM region while preserving useful state. It is a good fit for partial updates from backend-rendered endpoints.

## Server Region Refresh

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('serverRegion', (url) => ({
    async refresh() {
      const response = await fetch(url);
      Alpine.morph(this.$refs.region, await response.text());
    },
  }));
});
```

```html
<section x-data="serverRegion('/cart/summary')" x-ref="region">
  <button type="button" x-on:click="refresh">Refresh</button>
  ...
</section>
```

Make sure the returned HTML is trusted and shaped for the same region. Avoid Morph when a normal server navigation or form post is clearer.

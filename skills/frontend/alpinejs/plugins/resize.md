# Resize Plugin

Use Resize when behavior depends on an element's rendered size. Good fits include charts, canvases, measured panels, and layout-sensitive widgets.

## Element Resize

```html
<section x-data="measuredPanel" x-resize="setPanelSize($width, $height)">
  <p x-text="panelLabel"></p>
</section>
```

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('measuredPanel', () => ({
    width: 0,
    height: 0,
    get panelLabel() {
      return `${this.width} x ${this.height}`;
    },
    setPanelSize(width, height) {
      this.width = width;
      this.height = height;
    },
  }));
});
```

Keep expensive resize work debounced or delegated to `requestAnimationFrame`.

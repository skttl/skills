# Sort Plugin

Use Sort for reorderable lists when drag-and-drop is central to the workflow and the new order can be persisted by a form or backend request.

## Reorderable List

```html
<ul x-data="sortableList" x-sort="move">
  <template x-for="item in items" x-bind:key="item.id">
    <li x-sort:item="item.id">
      <span x-sort:handle>Drag</span>
      <span x-text="item.name"></span>
      <button type="button" x-sort:ignore x-on:click="edit(item.id)">Edit</button>
    </li>
  </template>
</ul>
```

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('sortableList', () => ({
    items: [],
    move(itemId, position) {
      const fromIndex = this.items.findIndex((item) => item.id === itemId);
      if (fromIndex === -1) return;

      const [item] = this.items.splice(fromIndex, 1);
      this.items.splice(position, 0, item);
    },
    edit(id) {
      this.$dispatch('edit-item', { id });
    },
  }));
});
```

Provide keyboard or non-drag alternatives when ordering is essential.

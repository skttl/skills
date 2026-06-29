# Combined Patterns

Use this file when implementing common UI patterns with htmx and Alpine.js together.

## Static Modal Shell With htmx Body

Keep the overlay shell static and local. Let htmx replace only the content area.

```html
<div
  x-data="{ open: false }"
  x-on:open-details.window="open = true"
  x-on:keydown.escape.window="open = false">
  <aside
    x-show="open"
    x-transition
    x-cloak
    role="dialog"
    aria-modal="true"
    aria-labelledby="details-title">
    <div id="details-modal-body">
      <p class="htmx-indicator">Loading...</p>
    </div>
    <button type="button" x-on:click="open = false">Close</button>
  </aside>
</div>

<button
  type="button"
  hx-get="/items/42/details"
  hx-target="#details-modal-body"
  hx-swap="innerHTML"
  x-on:click="$dispatch('open-details')">
  Open details
</button>
```

If the empty shell feels awkward, open the modal from `htmx:after-swap` instead of the click.

## Modal Form Closes After Successful Save

Let the server return canonical HTML and emit an outcome event.

```html
<div
  x-data="{ open: false }"
  x-on:open-item-modal.window="open = true"
  x-on:item-saved.window="open = false">
  <aside x-show="open" x-transition x-cloak role="dialog" aria-modal="true">
    <div id="item-modal-body"></div>
  </aside>
</div>
```

```html
<button
  type="button"
  hx-get="/items/new"
  hx-target="#item-modal-body"
  hx-swap="innerHTML"
  x-on:click="$dispatch('open-item-modal')">
  New item
</button>
```

The form endpoint can respond with an updated list fragment or out-of-band updates, plus:

```http
HX-Trigger: item-saved
```

## Inline Edit

Use Alpine for edit-mode visibility and htmx for persistence.

```html
<article id="contact-42" x-data="{ editing: false }">
  <div x-show="!editing">
    <h3>Jane Doe</h3>
    <button type="button" x-on:click="editing = true">Edit</button>
  </div>

  <form
    x-show="editing"
    x-cloak
    action="/contacts/42"
    method="post"
    hx-put="/contacts/42"
    hx-target="#contact-42"
    hx-swap="outerHTML">
    <label for="contact-42-name">Name</label>
    <input id="contact-42-name" name="name" value="Jane Doe" required>
    <button type="submit">Save</button>
    <button type="button" x-on:click="editing = false">Cancel</button>
  </form>
</article>
```

After save, the server returns the canonical closed card. The Alpine `editing` state is intentionally reset.

## Search Or Filter With Local Panel State

Use htmx for server results and Alpine for local filter-panel disclosure.

```html
<section x-data="{ filtersOpen: false }">
  <button
    type="button"
    x-on:click="filtersOpen = !filtersOpen"
    x-bind:aria-expanded="filtersOpen.toString()">
    Filters
  </button>

  <form
    x-show="filtersOpen"
    x-cloak
    action="/products"
    method="get"
    hx-get="/products"
    hx-target="#product-results"
    hx-trigger="change, input changed delay:400ms"
    hx-push-url="true">
    ...
  </form>

  <div id="product-results"></div>
</section>
```

Filter values that matter after refresh belong in the query string, not only in Alpine state.

## Alpine Dispatches, htmx Refreshes

Use this when a local choice should refresh server-rendered HTML elsewhere.

```html
<div x-data="{ compact: false }">
  <label>
    <input
      type="checkbox"
      name="compact"
      x-model="compact"
      x-on:change="$dispatch('layout-mode-changed')">
    Compact
  </label>
</div>

<section
  id="orders"
  hx-get="/orders"
  hx-trigger="layout-mode-changed from:body"
  hx-target="this"
  hx-swap="innerHTML">
  ...
</section>
```

If the server needs the mode, include a real input in the htmx request or make the control itself the htmx trigger. Do not rely on invisible duplicated state.

## htmx Response Updates Alpine Toasts

Use a small Alpine store or component for ephemeral notifications. Let htmx/server events announce outcomes.

```html
<div
  x-data="{ message: '', visible: false }"
  x-on:item-saved.window="
    message = 'Saved';
    visible = true;
    setTimeout(() => visible = false, 3000);
  "
  x-show="visible"
  x-transition
  x-cloak
  role="status"
  aria-live="polite">
  <span x-text="message"></span>
</div>
```

## Complex Alpine State

Extract anything more complex than a simple toggle into a registered component:

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('modalShell', () => ({
    open: false,
    loading: false,
    opener: null,

    openFrom(event) {
      this.opener = event.target;
      this.open = true;
      this.loading = true;
    },

    loaded() {
      this.loading = false;
      this.$nextTick(() => this.$refs.panel?.focus());
    },

    close() {
      this.open = false;
      this.opener?.focus();
    },
  }));
});
```

```html
<div
  x-data="modalShell"
  x-on:open-details.window="openFrom($event)"
  x-on:htmx:after-swap.window="
    if ($event.detail.target.id === 'details-modal-body') loaded()
  ">
  ...
</div>
```

## Attribute Hygiene

- Keep native HTML attributes first.
- Put Alpine root ownership (`x-data`) near the start of the element that owns local state.
- Keep htmx request attributes together in the usual htmx order.
- Use long-form Alpine syntax (`x-on:click`, `x-bind:disabled`) unless the project has chosen shorthand.
- Do not put multi-line branching logic inside attributes.
- Prefer named Alpine methods once an expression needs more than one simple assignment or dispatch.

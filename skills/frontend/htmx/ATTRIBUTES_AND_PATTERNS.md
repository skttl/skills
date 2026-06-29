# htmx Attributes And Patterns

Use this file when choosing htmx attributes, reviewing markup readability, or implementing common request patterns.

## Attribute Ordering

Keep native HTML first, then htmx behavior in a consistent "what, where, how" order:

1. Native HTML attributes: `type`, `name`, `id`, `class`, `href`, `action`, `method`, `aria-*`.
2. Request action: `hx-get`, `hx-post`, `hx-put`, `hx-patch`, `hx-delete`.
3. Target and selection: `hx-target`, `hx-select`, `hx-select-oob`.
4. Swap behavior: `hx-swap`, `hx-swap-oob`.
5. Trigger behavior: `hx-trigger`.
6. URL/history behavior: `hx-push-url`, `hx-replace-url`, `hx-history`.
7. Request feedback and coordination: `hx-indicator`, `hx-disabled-elt`, `hx-sync`.
8. Confirmation and parameters: `hx-confirm`, `hx-include`, `hx-params`, `hx-vals`, `hx-headers`.
9. Event hooks: `hx-on:*`.

Use one line for small elements. Split across lines when the element has several htmx attributes.

```html
<button
  type="button"
  class="todo-delete"
  hx-delete="/todos/42"
  hx-target="closest li"
  hx-swap="outerHTML"
  hx-confirm="Delete this todo?">
  Delete
</button>
```

## Targets

Make the target explicit when the default target is not exactly right.

Good targets:

- `this` for replacing the triggering component.
- `closest tr` for table row actions.
- `closest form` for validation feedback that replaces the whole form.
- `#search-results` for active search.
- A stable container id for list refreshes.

Avoid:

- Targeting `body` or `main` for tiny updates.
- Targeting an `input` with HTML content.
- Depending on brittle global selectors when a relative selector communicates intent.
- Adding ids everywhere when `closest`, `find`, `next`, or `previous` would be clearer.

## Swaps

Choose swap behavior to match the returned fragment:

- `innerHTML`: the response contains children for the target.
- `outerHTML`: the response replaces the target element itself.
- `beforeend`: append one or more new items to a container.
- `afterend`: insert content after the target, often for "load more" sentinels.
- `delete`: remove the target regardless of response content.
- `none`: process response headers or out-of-band swaps without swapping into the main target.

Use stable ids when CSS transitions, focus preservation, or third-party initialization depend on continuity across swaps.

## Triggers

Use natural triggers when they fit:

- Inputs, selects, and textareas naturally trigger on `change`.
- Forms naturally trigger on `submit`.
- Most other elements naturally trigger on `click`.

Add `hx-trigger` when you need different timing:

```html
<input
  type="search"
  name="q"
  hx-get="/search"
  hx-target="#search-results"
  hx-trigger="keyup changed delay:500ms, search">
```

Guidelines:

- Use `changed` for search and validation inputs.
- Use `delay:<time>` for debouncing noisy events.
- Use `throttle:<time>` for periodic event streams.
- Use `revealed` or `intersect` for lazy loading.
- Use `every <time>` sparingly for polling; prefer SSE or WebSockets for sustained real-time streams.
- Use `hx-sync` when validation requests and form submissions can race.

## Indicators And Disabled States

Show feedback for noticeable requests:

```html
<form
  action="/products"
  method="get"
  hx-get="/products"
  hx-target="#product-list"
  hx-trigger="change"
  hx-indicator="#product-filter-indicator"
  hx-disabled-elt="find button">
  ...
  <button type="submit">Apply</button>
</form>

<span id="product-filter-indicator" class="htmx-indicator">Loading...</span>
```

Use indicators near the thing that is loading. For destructive or long-running actions, also disable the initiating control or form while the request is in flight.

## Common Patterns

### Active Search

Keep the normal form behavior and enhance the input.

```html
<form action="/contacts" method="get">
  <label for="contact-search">Search contacts</label>
  <input
    id="contact-search"
    type="search"
    name="q"
    hx-get="/contacts"
    hx-target="#contact-results"
    hx-trigger="keyup changed delay:500ms, search"
    hx-push-url="true"
    hx-indicator="#contact-search-indicator">
  <button type="submit">Search</button>
</form>
```

Server response:

- Normal request: full contacts page.
- htmx request from search: contact result rows or result list fragment.

### Inline Edit

Use one component target and `outerHTML`.

```html
<section id="profile-name" hx-target="this" hx-swap="outerHTML">
  <span>Jane Doe</span>
  <button type="button" hx-get="/profile/name/edit">Edit</button>
</section>
```

The edit route returns the form section. The update route validates and returns either the display section or the form section with errors.

### Delete

For simple removal, target the item and return `204 No Content` with `hx-swap="delete"` or return an updated list when empty states and counters need to change.

```html
<button
  type="button"
  hx-delete="/todos/42"
  hx-target="closest li"
  hx-swap="delete"
  hx-confirm="Delete this todo?">
  Delete
</button>
```

Use out-of-band swaps or response headers when the delete also updates a badge, flash message, or empty-state container.

### Lazy Loading

Load expensive fragments when needed.

```html
<div
  hx-get="/reports/summary"
  hx-target="this"
  hx-swap="outerHTML"
  hx-trigger="revealed"
  hx-indicator="#summary-indicator">
  <span id="summary-indicator" class="htmx-indicator">Loading summary...</span>
</div>
```

### Out-Of-Band Updates

Use out-of-band swaps when one response should update secondary UI.

```html
<li id="todo-42">Updated todo</li>
<span id="todo-count" hx-swap-oob="true">7</span>
```

Keep out-of-band updates small and intentional. If many unrelated page regions update on one action, revisit the page structure.

## Debugging

- Inspect the Network tab first: request URL, method, form data, request headers, response status, and returned HTML.
- Check that the response fragment shape matches `hx-target` and `hx-swap`.
- Use `htmx.logAll()` temporarily to see htmx events.
- Watch for invalid HTML fragments, especially table rows, list items, and form elements.
- Confirm that dynamically swapped third-party widgets are initialized from htmx load events rather than only on initial page load.

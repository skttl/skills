# Ownership And Events

Use this file when deciding which library owns a piece of behavior or when wiring communication between htmx and Alpine.js.

## Ownership Boundary

The most important design choice is ownership. If ownership is vague, the page usually accumulates duplicated state, hard-to-debug timing, and long attribute expressions.

Use htmx when the interaction:

- Reads or writes database-backed data.
- Requires authentication, authorization, CSRF protection, or backend validation.
- Changes canonical server-rendered HTML.
- Needs URL, back-button, refresh, bookmark, or share behavior.
- Updates tables, filters, pagination, search results, counters, server messages, or form errors.

Use Alpine when the interaction:

- Is temporary and presentation-only.
- Can reset on refresh without data loss.
- Controls local visibility, active panel, open menu, selected local item, focus, scroll locking, or transition state.
- Coordinates browser events around a server update.
- Provides client-side convenience that the server will verify later.

## Smell List

Revisit the design when:

- The same value exists in an Alpine store and in server-rendered HTML.
- An Alpine component builds several htmx URLs or request payloads inline.
- An htmx endpoint exists only to open or close a dropdown.
- A server response returns large overlay chrome that never changes.
- A swapped fragment unexpectedly resets a user's local UI state.
- A normal link or form no longer works because the htmx/Alpine layer became mandatory.

## Event Bridge Principles

Use native browser events as the boundary between the libraries.

- htmx emits lifecycle events during requests and swaps. Alpine can listen for those events and update local state.
- Alpine can dispatch custom events with `$dispatch(...)`. htmx can listen for those events with `hx-trigger`.
- The server can emit `HX-Trigger` response headers. Both htmx and Alpine listeners can react to those events.
- Event names should describe outcomes or intent: `item-saved`, `modal-content-loaded`, `refresh-results`, `filters-cleared`.
- Keep event payloads small. Send durable data back as HTML when it belongs to the server.

## htmx Lifecycle Events To Use From Alpine

| Event | Use it for |
| --- | --- |
| `htmx:before-request` | Set local loading flags before a request starts. |
| `htmx:after-request` | Clear local loading flags or inspect success/failure. |
| `htmx:before-swap` | Cancel or alter a swap only when the project already uses this advanced pattern. |
| `htmx:after-swap` | Close panels, reveal shells, focus new content, or update local counts after new HTML enters the DOM. |
| `htmx:after-settle` | Run code that depends on final settled DOM, CSS transitions, or morph completion. |

Prefer kebab-case event names in HTML attributes when the project uses them, for example `x-on:htmx:after-swap.window`. If a project only exposes camelCase htmx events, attach the listener from JavaScript so HTML attribute case folding does not break the event name.

## Alpine Responding To htmx

Use htmx events to update local state after the server has responded:

```html
<section
  x-data="{ open: true, saving: false }"
  x-on:htmx:before-request.window="saving = true"
  x-on:htmx:after-request.window="saving = false"
  x-on:htmx:after-swap.window="
    if ($event.detail.target.id === 'item-list') open = false
  ">
  <form
    action="/items"
    method="post"
    hx-post="/items"
    hx-target="#item-list"
    hx-swap="beforeend">
    <input type="text" name="name" required>
    <button type="submit" x-bind:disabled="saving">Add item</button>
  </form>
</section>

<ul id="item-list"></ul>
```

Scope the listener when possible. If listening on `window` or `body`, guard against unrelated htmx requests by checking `event.detail.target`, `event.detail.elt`, or a data attribute.

## htmx Responding To Alpine

Use Alpine to dispatch intent and htmx to perform the server refresh:

```html
<section x-data="{ sort: 'name' }">
  <button
    type="button"
    x-on:click="sort = 'name'; $dispatch('contacts-sort-changed', { sort })">
    Name
  </button>
  <button
    type="button"
    x-on:click="sort = 'recent'; $dispatch('contacts-sort-changed', { sort })">
    Recent
  </button>
</section>

<div
  id="contacts"
  hx-get="/contacts"
  hx-trigger="contacts-sort-changed from:body"
  hx-target="this"
  hx-swap="innerHTML">
  ...
</div>
```

When the server needs the selected value, prefer a real form control included in the htmx request, a query string controlled by the triggering link/form, or a small `detail`-to-parameter bridge already used by the project. Do not hide large business objects in custom event detail.

## Server-Triggered Local UI

Use server events for outcomes the backend knows about:

```http
HX-Trigger: item-saved
```

```html
<div
  x-data="{ open: false }"
  x-on:item-saved.window="open = false">
  ...
</div>
```

This is useful for closing modals, showing toasts, refreshing secondary fragments, or clearing local draft UI after the server confirms success.

## Event Hygiene

- Prefer one clear event bridge over several listeners responding to the same click.
- Use `from:body` or window listeners for cross-component events.
- Use local listeners when parent and child are close enough for normal bubbling.
- Keep names lowercase and hyphenated.
- Avoid using htmx lifecycle events to reimplement routing, validation, or data transformation in the browser.

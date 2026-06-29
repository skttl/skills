# htmx Architecture Guide

Use this file when designing or reviewing htmx server routes, templates, history behavior, and endpoint shape.

## Server-Owned State

- Let the backend own durable state: database writes, permissions, validation, workflow transitions, and canonical view models.
- Let HTML express the currently available actions. A disabled button, missing link, validation message, or next-step form should come from the server's understanding of the user's state.
- Avoid mirroring durable state in JavaScript stores. If client state becomes large, complex, or offline-first, htmx may no longer be the right main tool for that feature.
- Keep transient UI state local. Menus, disclosure panels, focus traps, local animations, and small client-only preferences belong in Alpine.js, vanilla JavaScript, or _hyperscript rather than htmx round trips.

## Full Pages And Fragments

Many htmx routes need both a direct URL and a fragment response. Keep that decision in the server route or a small response helper, not repeated inside every template.

```python
def render_contacts(request, contacts):
    if request.headers.get("HX-Request"):
        response = render_template("contacts/_rows.html", contacts=contacts)
    else:
        response = render_template("contacts/index.html", contacts=contacts)

    response.headers["Vary"] = "HX-Request"
    return response
```

Good patterns:

- One full-page template includes smaller partial templates.
- The route renders the full page for normal browser navigation.
- The same route renders the relevant partial for htmx requests.
- A helper or decorator centralizes full-page versus fragment selection when the pattern repeats.

Avoid:

- Large `{% if request.headers.get("HX-Request") %}` blocks in many templates.
- Fragment-only URLs that produce broken pages when opened directly, unless they are private implementation endpoints and protected accordingly.
- Returning a full document and relying on `hx-select` when you control the server and can return the smaller fragment directly.

## Headers And Caching

Use htmx request headers as routing context:

- `HX-Request`: request came from htmx.
- `HX-Target`: id of the target element when present.
- `HX-Trigger`: id of the triggering element when present.
- `HX-Trigger-Name`: name of the triggering element when present.
- `HX-Current-URL`: browser URL at request time.
- `HX-History-Restore-Request`: request is restoring history after a cache miss.

When a response changes based on one of these headers, add `Vary` for the relevant header. This prevents caches and suspended browser tabs from mixing partial and full-page responses.

```http
Vary: HX-Request
```

If multiple htmx headers affect the representation, include each one deliberately:

```http
Vary: HX-Request, HX-Target, HX-Trigger
```

## REST-Shaped Endpoints

Keep endpoint names resource-oriented unless the interaction is truly an action.

```text
GET    /todos        -> full todo page or todo list fragment
POST   /todos        -> create todo, return new row or refreshed list
GET    /todos/42     -> todo detail page or fragment
PUT    /todos/42     -> update todo, return updated row/detail
DELETE /todos/42     -> delete todo, return 204 or refreshed list
```

Use action endpoints for domain actions that are not simple CRUD:

```text
POST /orders/42/cancel
POST /invoices/42/send
POST /uploads/42/retry
```

Return shapes should match the target:

- New row appended with `hx-swap="beforeend"`: return one row.
- Existing row replaced with `hx-swap="outerHTML"`: return the whole row element.
- List refreshed after deletion: return the list container or use `HX-Retarget`.
- No DOM change needed: return `204 No Content`.

## URL And History Design

Use the URL as the durable address for meaningful state:

- Filters and search queries belong in query strings.
- Detail views, nested resources, and selected records belong in paths.
- Tabs or submenus belong in the URL when users need refresh, back-button, bookmark, or share behavior.

Use `hx-push-url="true"` when the htmx request changes the user's meaningful location.

```html
<a
  href="/customers/42"
  hx-get="/customers/42"
  hx-target="#main"
  hx-swap="innerHTML"
  hx-push-url="true">
  View customer
</a>
```

Before pushing a URL, verify:

- Loading the URL directly returns a full page.
- Refreshing the page preserves the user's context.
- The back button returns to a coherent previous state.
- Sensitive content is excluded from the htmx history cache with `hx-history="false"` where needed.

## Progressive Enhancement

Start with working HTML:

- Links have real `href` values.
- Forms have real `action` and `method` values where possible.
- Submit buttons remain available even when adding active search or live validation.
- Server-side validation is authoritative.

Then add htmx attributes to improve speed or reduce page churn:

```html
<form action="/contacts" method="get">
  <input
    type="search"
    name="q"
    hx-get="/contacts"
    hx-target="#contact-results"
    hx-trigger="keyup changed delay:500ms, search"
    hx-push-url="true">
  <button type="submit">Search</button>
</form>
```

## When Not To Use htmx As The Main Tool

Choose a client-side framework, island, web component, or dedicated script when the feature needs:

- Complex local state that changes frequently without server communication.
- Offline-first behavior.
- Heavy client-side computation.
- Canvas/WebGL/game-like interactions.
- Rich drag-and-drop editing where round trips would make the UI feel broken.
- Real-time collaborative editing where conflict resolution mostly happens in the client.

htmx can still coexist with those islands. Keep the ownership boundary clear: htmx swaps server-owned HTML; the island owns its internal DOM and state.

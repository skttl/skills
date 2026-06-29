---
name: htmx
description: Guides best-practice htmx development for server-rendered, hypermedia-driven interfaces. Use when adding, refactoring, or reviewing htmx code, hx-* attributes, HTML fragment endpoints, server-side partial rendering, hx-target/hx-swap behavior, hx-trigger request patterns, hx-push-url history behavior, or htmx security concerns.
---

# htmx Best Practices

Use htmx to extend HTML's request and response model, not to recreate a JavaScript application framework in attributes. Let the server own durable state, authorization, validation, routing, and canonical markup; let htmx request small pieces of HTML and swap them into focused targets.

## Start Here

Before editing, inspect nearby htmx usage and the server routes/templates that feed it:

- Which element triggers the request?
- Which route handles the request and which HTTP method does it use?
- Which DOM element is targeted and which swap strategy is expected?
- Does the route return a full page, a fragment, or both depending on request headers?
- Does the URL remain refreshable, bookmarkable, and meaningful after the interaction?

Prefer a small server-rendered enhancement over introducing broad client-side state. If the feature is mostly a normal link or form, keep the normal link or form and add htmx only where it materially improves the workflow.

## Hypermedia Mindset

- Treat HTML as the application interface. Server responses should describe the next available actions with links, forms, and buttons.
- Keep durable state on the server. The browser may hold a representation of state through the URL and current HTML, but avoid duplicating business state in client-side memory.
- Return HTML fragments, not JSON, for htmx interactions.
- Preserve progressive enhancement where practical: ordinary links should navigate, ordinary forms should submit, and htmx should improve the experience for JavaScript-enabled clients.
- Use Alpine.js, vanilla JavaScript, or _hyperscript for local UI-only state such as opening menus, toggling disclosure panels, focus choreography, and animations that should not require a network round trip.

## Server Routing

- Keep route/controller logic responsible for deciding whether to render a full layout or a fragment. Do not repeat large `if HX-Request` blocks inside every template.
- Check htmx request headers such as `HX-Request`, `HX-Target`, and `HX-Trigger` in the server layer when the same URL can return different fragments.
- When one URL can return both a full page and a fragment, set an appropriate `Vary` response header for the htmx headers that affect the response, especially `Vary: HX-Request`.
- Factor templates into reusable partials or blocks so the same markup can be included in a full page and rendered independently for htmx.
- Prefer REST-shaped endpoints and HTTP verbs: `GET /todos` renders a list, `POST /todos` creates and returns a new row or updated list, `PUT /todos/{id}` returns the updated representation, and `DELETE /todos/{id}` deletes server state and returns either `204 No Content`, an updated fragment, or a redirect header when that matches the UX.
- Avoid creating a separate JSON API layer just for htmx unless another real client needs it. htmx endpoints are HTML resources.

```html
<form action="/contacts" method="get">
  <input
    type="search"
    name="q"
    hx-get="/contacts"
    hx-target="#contact-results"
    hx-swap="innerHTML"
    hx-trigger="keyup changed delay:500ms, search"
    hx-push-url="true"
    hx-indicator="#contact-search-indicator">
  <button type="submit">Search</button>
</form>

<span id="contact-search-indicator" class="htmx-indicator">Searching...</span>
<div id="contact-results"></div>
```

## URL And History Rules

- Keep important user-visible state in the URL through path segments or query strings.
- Use `hx-push-url="true"` when an htmx interaction changes the user's meaningful location, filter, tab, or drill-down context.
- Only push URLs that can be loaded directly in a new tab and return a full page.
- Avoid global `hx-boost` as the default navigation strategy. Use normal links for page navigation unless preserving a persistent island or avoiding a full navigation is genuinely part of the product requirement.
- Mark sensitive pages or fragments with `hx-history="false"` when they must not be stored in the htmx history cache.

## Attribute Rules

- Keep htmx attributes readable and consistent. Use this order: native HTML attributes first, then request action, target, swap, trigger, history, indicator, synchronization, confirmation, headers/vals, and events.
- Put the action first among htmx attributes: `hx-get`, `hx-post`, `hx-put`, `hx-patch`, or `hx-delete`.
- Always make the target explicit when the default target would be unclear or invalid.
- Choose the narrowest stable target that matches the UX. Do not return and swap a full page when only a table body, row, form, or count needs to change.
- Use `hx-swap="outerHTML"` when the server returns a replacement for the target element itself; use `innerHTML` when it returns the target's children.
- Use `hx-trigger="keyup changed delay:500ms"` or similar for search and validation inputs. Do not issue a request on every keystroke without a debounce.
- Use `hx-indicator` or a local `.htmx-indicator` for any request whose latency may be noticeable.
- Use out-of-band swaps only when one server action needs to update secondary UI such as counters, flash messages, or nav badges.

## Safety And Accessibility

- Escape all user-generated content through the server templating system. Be especially careful with raw HTML, user-controlled attributes, and user-controlled URLs.
- Prefer cookie-based authentication with `Secure`, `HttpOnly`, and `SameSite=Lax` or stricter settings.
- Enforce authentication, authorization, CSRF protection, and validation on every htmx endpoint exactly as you would for full-page form submissions.
- Do not call untrusted or third-party HTML routes with htmx. htmx inserts returned HTML into the page.
- Preserve semantic HTML: buttons for actions, links for navigation, labels for inputs, visible focus styles, and ARIA/focus management when dynamic swaps affect assistive technology users.
- Re-run server-side validation even when htmx or the browser performs client-side validation.

## Review Checklist

- Does the feature still make sense as server-rendered HTML plus progressive enhancement?
- Are durable state, authorization, and validation handled server-side?
- Can pushed URLs be refreshed or opened directly as full pages?
- Are full-page and fragment responses chosen in the route/controller rather than scattered across templates?
- Is `Vary` set when htmx headers change response shape?
- Is the target narrow, stable, and explicit?
- Is request frequency controlled with `changed`, `delay`, `throttle`, or `hx-sync` where needed?
- Does every noticeable asynchronous request provide visible feedback?
- Are user-generated values escaped and kept out of dangerous HTML contexts?
- Is local UI state handled locally instead of requiring unnecessary server calls?

## References

Read [ARCHITECTURE.md](ARCHITECTURE.md) for routing, fragments, REST, and URL design. Read [ATTRIBUTES_AND_PATTERNS.md](ATTRIBUTES_AND_PATTERNS.md) for attribute ordering and common htmx patterns. Read [SECURITY_AND_ACCESSIBILITY.md](SECURITY_AND_ACCESSIBILITY.md) for safe output, cookies, CSRF, history cache, and accessible swaps. See [REFERENCES.md](REFERENCES.md) for source links.

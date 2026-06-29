# htmx Security And Accessibility

Use this file when reviewing htmx endpoints, user-generated HTML, authentication, CSRF, dynamic swaps, and accessible behavior.

## Trusted Routes Only

Do not use htmx to request and insert HTML from untrusted routes. htmx swaps returned HTML directly into the page, so the response must come from a server you control and trust.

Prefer relative URLs:

```html
<button type="button" hx-get="/events" hx-target="#events">
  Load events
</button>
```

Avoid third-party HTML endpoints:

```html
<button type="button" hx-get="https://example.net/widget" hx-target="#slot">
  Load widget
</button>
```

If data must come from an untrusted API, fetch JSON through a controlled server route or parse it with ordinary JavaScript and insert text with safe sinks such as `textContent`.

## Escaping And Raw HTML

- Use an auto-escaping server template engine.
- Keep user-generated content inside normal HTML text positions when possible.
- Do not put raw user input into tag names, attribute names, inline scripts, or style blocks.
- Treat user-controlled URLs and attribute values as special cases that need validation and allowlists.
- Avoid template escape bypasses such as `raw`, `safe`, or triple-stash syntax for user content.
- If sanitized rich text is unavoidable, sanitize with an allowlist and remove `hx-*`, `data-hx-*`, inline event handlers, and script-capable content.
- Wrap untrusted raw HTML in `hx-disable` so htmx will not process injected htmx attributes.

```html
<div hx-disable>
  <!-- sanitized rich text only -->
</div>
```

## Authentication And Authorization

htmx works naturally with cookie-based authentication because htmx requests are normal browser requests.

For auth cookies:

- Set `Secure` so cookies are sent only over HTTPS.
- Set `HttpOnly` so JavaScript cannot read the cookie.
- Set `SameSite=Lax` or `SameSite=Strict` according to the workflow.
- Keep authentication and authorization checks in middleware, route filters, or server handlers.

Every htmx endpoint must enforce permissions. Do not rely on hiding buttons or omitting links in the HTML as the only authorization layer.

## CSRF

Use the same CSRF protection you would use for normal server-rendered forms:

- Prefer framework-provided CSRF middleware.
- Include hidden CSRF inputs in forms when the framework supports it.
- Use `hx-headers` for a global or scoped CSRF header only when that is the framework's expected pattern.

```html
<main hx-headers='{"X-CSRF-TOKEN": "{{ csrf_token }}"}'>
  ...
</main>
```

Be careful with `hx-boost`: it does not replace `<html>` or `<body>`, so CSRF headers placed only there may become stale in boosted navigation flows.

## History Cache And Sensitive Data

htmx can store history snapshots in local storage. Disable htmx history for pages or fragments containing sensitive data that should not be cached locally.

```html
<section hx-history="false">
  ...
</section>
```

Also consider htmx security-related configuration for high-risk applications:

- `htmx.config.selfRequestsOnly = true`
- `htmx.config.allowScriptTags = false`
- `htmx.config.allowEval = false`
- `htmx.config.historyCacheSize = 0`

Match these settings to the app's scripting needs and Content Security Policy.

## Validation And Error States

- Let browser validation improve fast feedback, but repeat all validation on the server.
- Return the form fragment with validation errors when the submission fails.
- Consider configuring response handling or response-target patterns for `422 Unprocessable Entity` validation responses.
- Keep invalid fields associated with error text through labels, ids, and `aria-describedby`.
- Preserve submitted values in the returned form fragment so users do not lose work.

## Accessible Dynamic Swaps

htmx does not automatically make dynamic content accessible. Review the user experience after every swap.

Checklist:

- Use semantic elements before ARIA.
- Preserve visible focus styles.
- Move focus intentionally after modals, inline edits, destructive actions, and validation failures.
- Use `aria-live` regions for status messages, counters, and async result summaries that screen reader users need to hear.
- Keep labels associated with fields after form fragments are swapped.
- Use real buttons for actions and real links for navigation.
- Ensure loading indicators have accessible text or an accessible name.
- Avoid swapping away the focused element unexpectedly while the user is typing.

```html
<div id="flash-messages" aria-live="polite"></div>
```

If a swap updates an important status message out of band, target a live region or move focus to the returned error summary according to the surrounding app's accessibility pattern.

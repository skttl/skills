# Swaps And Transitions

Use this file when htmx swaps affect Alpine components, when local state is lost unexpectedly, or when htmx and Alpine transitions need coordination.

## How Swaps Affect Alpine

Modern Alpine initializes elements added to the DOM after page load, so ordinary htmx fragments containing Alpine directives usually work after insertion. The main design issue is not initialisation, but state continuity.

Common cases:

- htmx swaps inside an Alpine root: the root state survives, but replaced children reset.
- htmx swaps the Alpine root with `outerHTML`: the whole component is destroyed and recreated.
- htmx appends new Alpine components: each new component starts with its initial state.
- htmx morphs existing markup: useful local state can survive when nodes are matched correctly.

Choose the target and swap style based on whether resetting local Alpine state is expected.

## Preserve State By Moving The Boundary

Keep Alpine roots outside frequently swapped regions when the local state should survive:

```html
<section x-data="{ selectedId: null }">
  <div
    id="contacts"
    hx-get="/contacts"
    hx-trigger="refresh-contacts from:body"
    hx-target="this"
    hx-swap="innerHTML">
    ...
  </div>
</section>
```

The contact list can refresh without destroying `selectedId`.

If the server should replace the full component and local state is disposable, target the component itself:

```html
<article
  id="todo-42"
  x-data="{ editing: false }"
  hx-target="this"
  hx-swap="outerHTML">
  ...
</article>
```

This is fine for inline edit cards where saving returns the canonical closed state.

## When To Use Morphing

Use morphing when:

- htmx must update markup around an Alpine component without losing local state.
- Focus, transitions, or expensive child setup should survive server updates.
- The server returns nearly the same structure with updated labels, counts, classes, or validation state.

Prefer simpler boundaries first. If moving the Alpine root outside the target solves the problem, do that before adding morphing.

Useful morph options, depending on project stack:

- htmx idiomorph or morph-style swaps when the project already uses htmx morphing.
- Alpine Morph plugin when Alpine is already the chosen morph layer.
- `hx-alpine-compat` in htmx 4 projects that need Alpine initialization and state preservation across htmx-driven DOM updates.

When morphing, keep stable ids and keys on repeated records. Avoid reactive `id` bindings unless the chosen compatibility layer handles them.

## Transition Timing

htmx has swap and settle phases. Alpine has `x-show`, `x-transition`, and `$nextTick`. Coordinate them explicitly:

- Use `x-cloak` for content that must not flash before Alpine initializes.
- Use `x-show` and `x-transition` for local show/hide animation.
- Use `.htmx-request` for loading states while a request is active.
- Use `.htmx-swapping` and `.htmx-settling` for CSS transitions around htmx replacements.
- Use `hx-swap="innerHTML settle:300ms"` or similar only when CSS transition timing needs it.
- Use `htmx:after-settle` when Alpine code needs the final DOM after htmx finishes settling.

## Modal Timing Choices

Two modal timings are both valid:

- Open immediately and show a loading state while htmx fetches the modal body.
- Open only after `htmx:after-swap` or `htmx:after-settle` confirms that the body content has loaded.

Use immediate open when user feedback matters more than avoiding a loading shell. Use after-swap open when empty modal chrome would feel broken.

```html
<div
  x-data="{ open: false }"
  x-on:htmx:after-swap.window="
    if ($event.detail.target.id === 'modal-body') open = true
  ">
  <aside x-show="open" x-transition x-cloak>
    <div id="modal-body"></div>
  </aside>
</div>

<button
  type="button"
  hx-get="/items/42/details"
  hx-target="#modal-body"
  hx-swap="innerHTML">
  Details
</button>
```

## Focus And Accessibility After Swaps

Dynamic HTML is not automatically accessible. Review focus and announcements around every combined interaction.

- Move focus into modals after content loads.
- Return focus to the opener when a modal closes.
- Use `aria-live` for server-returned status messages that should be announced.
- Keep labels, `aria-describedby`, and error summary links valid after form fragments are swapped.
- Do not swap away the focused input while the user is typing unless that is the explicit result.
- Disable or mark busy controls during long requests using htmx indicators or Alpine loading flags.

## Debugging Checklist

- Did htmx target the Alpine root or a child inside it?
- Does the returned fragment match the chosen `hx-swap` strategy?
- Did the local state reset because the component was destroyed?
- Are duplicate ids or unstable keys confusing morphing?
- Is an Alpine listener attached to the right event target?
- Is the timing issue actually a settle/transition issue?
- Would a smaller htmx target remove the conflict?

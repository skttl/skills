# Built-In Alpine Plugins

Use built-in plugins when the behavior matches the plugin's job and the project already includes, or can reasonably add, the package. Do not install plugins for one-off behavior that is clearer as a small component method.

## Installation Rule

- Follow the project's existing plugin loading style.
- In bundled code, import the plugin and register it with `Alpine.plugin(pluginName)` before `Alpine.start()`.
- In script-tag setups, load plugin scripts before Alpine core.

## Plugin Index

- [Mask](plugins/mask.md): input formatting for phone numbers, dates, card-like groups, and fixed-format identifiers.
- [Intersect](plugins/intersect.md): viewport entry and exit reactions for lazy loading, reveal behavior, and infinite-scroll triggers.
- [Resize](plugins/resize.md): element size reactions for measured panels, charts, canvases, and layout-sensitive widgets.
- [Persist](plugins/persist.md): lightweight UI state persistence across page loads.
- [Focus](plugins/focus.md): focus trapping and focus management for modals, drawers, menus, and overlays.
- [Collapse](plugins/collapse.md): height transitions for expanding and collapsing content.
- [Anchor](plugins/anchor.md): positioning floating UI relative to a trigger or anchor element.
- [Morph](plugins/morph.md): morphing server-rendered HTML into existing DOM while preserving useful state.
- [Sort](plugins/sort.md): drag-and-drop sorting for reorderable lists.

## Selection Heuristics

- Prefer Focus for accessibility-sensitive overlays before writing custom focus-trap code.
- Prefer Persist over custom localStorage wrappers for ordinary UI preferences.
- Prefer Intersect or Resize over manual observer setup inside components.
- Prefer Collapse for accordion height transitions that would otherwise need measurement code.
- Prefer Sort only when the ordering interaction is central enough to justify drag-and-drop.

## Caveats

- Plugins are still progressive enhancement. Preserve useful server-rendered markup and backend fallbacks.
- Keep plugin behavior close to the component that owns it; avoid global initialization that changes unrelated pages.
- Check bundle size and existing dependencies before adding a plugin to a page that only needs a tiny behavior.
- Treat plugin-managed UI as client convenience, not as authorization, validation, or persistence authority.

# Alpine.js Best Practices

Guidance for adding, refactoring, and reviewing Alpine.js in progressively enhanced interfaces.

Use this skill when working with:

- Alpine directives such as `x-data`, `x-for`, `x-init`, `x-cloak`, `x-on`, and `x-bind`.
- Reusable components registered with `Alpine.data(...)`.
- Shared UI state registered with `Alpine.store(...)`.
- Built-in Alpine plugins such as Focus, Persist, Collapse, Intersect, Resize, Mask, Morph, Anchor, and Sort.

## Contents

- [SKILL.md](SKILL.md): core agent instructions.
- [COMPONENTS_AND_STORES.md](COMPONENTS_AND_STORES.md): reusable component and store patterns.
- [CONCEPTS.md](CONCEPTS.md): Alpine concepts beyond individual directives.
- [DIRECTIVES.md](DIRECTIVES.md): directive selection and review guide.
- [PLUGINS.md](PLUGINS.md): built-in plugin selection guide.
- [plugins/](plugins/): notes for individual Alpine plugins.
- [REFERENCES.md](REFERENCES.md): reference links.

## Design Stance

Use Alpine for focused client-side behavior on top of server-rendered HTML. Keep durable workflows, routing, and business rules in the backend or application layer that already owns them.

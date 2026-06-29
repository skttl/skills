---
name: umbraco-ufm
description: Guides writing, reviewing, and advisory verification of Umbraco Flavored Markdown for Umbraco 17+ backoffice labels, property descriptions, block labels, collection labels, .uda files, and uSync schema files. Use when the user mentions UFM, Umbraco Flavored Markdown, block label templates, label templates, property descriptions, Umbraco Deploy .uda, uSync, or schema verification.
---

# Umbraco UFM

Use this skill for Umbraco 17+ Umbraco Flavored Markdown (UFM). Optimize for useful editor experience: labels should make repeated content easier to scan, not just prove the syntax can be clever.

## Start Here

Before writing or changing UFM, inspect the schema or nearby examples and answer:

- Is this a block label, collection view label template, or property description?
- Which property aliases are available in the current value context?
- Are picker names, link titles, form names, settings, or rich text values involved?
- Is this plain display, lightweight formatting, or real conditional logic?

Prefer readable labels with a stable prefix and a short dynamic value:

```markdown
CTA: {umbValue: heading | fallback:Untitled}
Articles: {umbContentName: articleList}
Rich text: ${ bodyText.markup | stripHtml | wordLimit:12 }
${ $index + 1 }. Image: ${ caption | fallback:Untitled }
```

## Authoring Rules

- Target Umbraco 17+ only. Use camelCase filters such as `stripHtml`, `titleCase`, and `wordLimit`.
- Prefer built-in components for built-in lookup behavior: `umbValue`, `umbContentName`, `umbLink`, `umbLocalize`, and `umbFormName`.
- Use `${ ... }` expressions for real logic, property drilling, calculations, settings, or `$index`.
- Keep labels short and scannable. Avoid full sentences and dense conditionals in block labels.
- Use `fallback` for editor-facing empty states instead of allowing blank labels.
- For rich text, strip markup and limit output. Use `${ bodyText.markup | stripHtml | wordLimit:12 }` when the raw rich text object is available.
- Do not use legacy AngularJS labels such as `{{ heading | ncNodeName }}`.
- Do not use kebab-case filters such as `strip-html`, `title-case`, or `word-limit` for Umbraco 17+.

## Review Workflow

When reviewing existing UFM:

1. Find UFM in Umbraco Deploy `.uda` files and `**/uSync/**` schema files.
2. Check syntax first: balanced `{component: value}` and `${ expression }`, no accidental AngularJS, and no deprecated filter aliases.
3. Check semantics: picker values use picker-aware components, rich text is not rendered raw, and fallbacks exist where empty labels would hurt editors.
4. Check editor experience: can an editor scan a list of similar blocks and identify the right item quickly?
5. If built-ins are not enough, recommend a custom UFM component or filter, but keep code generation secondary and use an Umbraco backoffice extension skill for implementation.

Run the advisory verifier when schema files are present:

```bash
node path/to/umbraco-ufm/scripts/verify-ufm.mjs .
```

The verifier is human-readable and advisory. Treat findings as review input, not as a CI gate.

## Custom Components And Filters

Prefer built-ins until a repeated project convention proves it needs an extension.

- Use a custom `ufmFilter` for reusable value transformations such as project-specific date formatting.
- Use a custom `ufmComponent` when output needs HTML, UUI components, async lookup behavior, or shared UI treatment.
- Custom rendered elements must survive UFM sanitization; use allowed web component prefixes such as `ufm-`, `umb-`, or `uui-`.
- Keep custom aliases explicit and project-owned. Avoid replacing core aliases or making labels depend on hidden magic.

## References

Read [references/ufm-syntax.md](references/ufm-syntax.md) for components, filters, expressions, schema verification, and common review findings.

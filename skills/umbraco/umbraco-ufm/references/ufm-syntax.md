# UFM Syntax

This reference targets Umbraco 17+.

## Components

UFM component syntax uses curly brackets with an alias prefix and contents:

```markdown
{alias: contents}
```

Core components:

| Component | Use | Example |
| --- | --- | --- |
| `umbValue` | Render a property value from the current context. | `{umbValue: headline}` |
| `umbLocalize` | Render a backoffice localization term. | `{umbLocalize: general_name}` |
| `umbContentName` | Render names for picked content, media, or members where supported. | `{umbContentName: pickerAlias}` |
| `umbLink` | Render titles from a Link Picker value. | `{umbLink: callToAction}` |
| `umbFormName` | Render a selected Umbraco Forms form name. | `{umbFormName: formAlias}` |

Short aliases may exist for backwards compatibility, such as `{=headline}` and `{#general_name}`, but prefer explicit component aliases in new Umbraco 17+ work.

## Filters

Filters are appended with `|` and can be chained:

```markdown
{umbValue: bodyText | stripHtml | wordLimit:15}
```

Use camelCase aliases:

| Filter | Alias | Example |
| --- | --- | --- |
| Bytes | `bytes` | `{umbValue: umbracoBytes | bytes}` |
| Fallback | `fallback` | `{umbValue: headline | fallback:Untitled}` |
| Lowercase | `lowercase` | `{umbValue: headline | lowercase}` |
| Strip HTML | `stripHtml` | `{umbValue: bodyText | stripHtml}` |
| Title Case | `titleCase` | `{umbValue: headline | titleCase}` |
| Truncate | `truncate` | `{umbValue: intro | truncate:30:...}` |
| Uppercase | `uppercase` | `{umbValue: headline | uppercase}` |
| Word Limit | `wordLimit` | `{umbValue: intro | wordLimit:15}` |

Avoid kebab-case filter aliases such as `strip-html`, `title-case`, and `word-limit` in Umbraco 17+.

## Expressions

UFM expressions use JavaScript-like syntax:

```markdown
${ propertyAlias }
${ propertyAlias.length > 0 ? "Yes" : "No" }
${ propertyAlias | uppercase }
${ bodyText.markup | stripHtml | wordLimit:12 }
${ $index + 1 }
${ $settings.hide == "1" ? "[HIDDEN]" : "" }
```

Expressions are sandboxed. Use them for logic, property access, calculations, `$settings`, and `$index`. Do not use expressions as the default for simple property rendering when a component is clearer.

## Rich Text

Rich text values are structured. Do not assume a raw rich text value will display well.

Prefer:

```markdown
${ bodyText.markup | stripHtml | wordLimit:12 }
```

or, when supported by the value shape:

```markdown
{umbValue: bodyText | stripHtml | wordLimit:12}
```

Always strip markup before showing rich text in compact labels, and usually add `wordLimit` or `truncate`.

## Good Editor Experience

Strong labels answer "which item is this?" quickly.

Prefer:

```markdown
CTA: {umbValue: heading | fallback:Untitled}
${ $index + 1 }. Rich text: ${ bodyText.markup | stripHtml | wordLimit:10 | fallback:Empty }
Image: ${ caption | fallback:No caption }
Articles: {umbContentName: articleList}
```

Avoid:

```markdown
${ heading != "" ? heading : subheading != "" ? subheading : "Untitled" } ${ bodyText.markup } ${ $settings.hide == "1" ? "hidden" : "" }
{{ heading | ncNodeName }}
{umbValue: bodyText}
{umbValue: intro | word-limit:15}
```

## Schema Verification

When asked to verify existing schema, inspect:

- Umbraco Deploy `.uda` files.
- Files under `**/uSync/**`.

Look for likely label and description fields, including `label`, `labelTemplate`, `template`, `description`, `columns`, and block configuration values. Keep verification advisory unless the user explicitly asks to enforce a build gate.

Common findings:

- `ERROR`: unclosed `${ ... }` expression.
- `ERROR`: unbalanced UFM component braces.
- `WARN`: legacy AngularJS `{{ ... }}` template.
- `WARN`: kebab-case filter alias in Umbraco 17+.
- `WARN`: unknown core component or filter, unless the project appears to register a custom one.
- `WARN`: rich text-looking aliases rendered without `stripHtml`.
- `INFO`: no fallback on labels likely to go blank.

## Custom Components And Filters

Use custom extensions sparingly.

- Custom `ufmFilter`: value-in, value-out transformations such as date formatting.
- Custom `ufmComponent`: rendered markup, UUI tags, async behavior, picker-style lookup, or repeated project UI conventions.

Register custom filters with extension type `ufmFilter` and a `meta.alias`. Register custom components with extension type `ufmComponent` and a `meta.alias`. Prefer rendering custom elements with allowed prefixes such as `ufm-`, `umb-`, or `uui-` so sanitization allows the output.

## Sources

- Official Umbraco documentation: [Umbraco Flavored Markdown](https://docs.umbraco.com/umbraco-cms/model-your-content/property-editors/umbraco-flavored-markdown).
- Joe Glombek, 24 Days in Umbraco: [Umbraco Flavored Markdown: A ${template} for success](https://24days.in/umbraco-cms/2025/template-for-success/).
- Joe Glombek: [Umbraco Flavored Markdown (UFM) cheat sheet for v14](https://joe.gl/ombek/blog/v14-ufm/). Treat this as historical v14 context, not current Umbraco 17+ guidance.

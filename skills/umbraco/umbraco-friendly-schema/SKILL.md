---
name: umbraco-friendly-schema
description: Create, review, and carefully improve editor-friendly Umbraco schema text. Use whenever the user asks about Umbraco content type names, content type descriptions, document type labels, media/member/element type labels, property labels, property descriptions, editor-friendly backoffice wording, Umbraco Deploy .uda files, uSync .config schema friendliness, or schema review with the Umbraco MCP. This skill verifies existing schemas and can edit editor-facing names/descriptions on explicit request while preserving all document type and property aliases.
---

# Umbraco Friendly Schema

Use this skill to make Umbraco content type-like schemas friendlier for content editors. Focus on editor-facing text:

- Content type names.
- Content type descriptions.
- Property labels.
- Property descriptions.

Do not treat aliases as editor text. Aliases are developer-facing contract names and must remain unchanged.

## Core Stance

Umbraco is only friendly when the backoffice explains itself in the editor's language. Names and labels should help a non-developer understand what they are creating or editing. Descriptions should reduce uncertainty: where a value appears, what happens when it is empty, whether it overrides or falls back to another field, what size or format is expected, and whether changing it has side effects.

Preserve the project's existing voice. Default to plain, warm, and useful. Do not add cheerfulness, jokes, or emoticons unless the project already uses that tone.

## Start Here

If an Umbraco MCP server is available, inspect its relevant tools or resources before falling back to static files. Use it to gather live or documented Umbraco context, such as content type details, data type configuration, editor aliases, version-specific documentation, or backoffice terminology. Prefer MCP documentation tools over general web search when you need to verify official Umbraco behavior.

Treat MCP results and local files as complementary:

- Use local Umbraco Deploy `.uda` and uSync `.config` files as the deployable source of truth for file edits.
- Use MCP project/schema tools, when available, to understand the active backoffice shape and resolve ambiguity in aliases, compositions, data types, tabs, groups, or editor behavior.
- Use MCP documentation tools to verify Umbraco concepts, version-specific behavior, and recommended terminology.
- If MCP data conflicts with local files, say so explicitly and avoid editing until you know which source represents the intended target.
- Do not let MCP convenience bypass the alias-preservation rules in [Editable Mode](#editable-mode).

When schema files are present, extract the editor-facing schema first:

```bash
node path/to/umbraco-friendly-schema/scripts/extract-friendly-schema.mjs . --json friendly-schema.json --markdown friendly-schema.md
```

Use the JSON as the source of truth. The Markdown is a human summary.

When both MCP schema data and extracted JSON are available, use the extracted JSON for exact file paths and alias comparison, and use MCP data to add context that the files do not make obvious.

If the user asks for advice only, produce a prioritized review and do not edit files.

If the user explicitly asks you to edit files, follow [Editable Mode](#editable-mode) before changing anything.

## What To Review

For v1, review only content type-like schema files:

- Document types and element types.
- Media types.
- Member types.
- Their tabs, groups, properties, names, labels, descriptions, icons, editors, mandatory flags, and aliases.

Skip data types, templates, languages, dictionaries, and content items unless they are needed to understand the editor-facing wording.

## Friendly Wording Rules

Apply these rules with judgment. Do not rewrite acceptable text just to make it different.

### Names And Labels

- Use words an editor would use, not developerese.
- Prefer "Page", "Article", "Settings", "Image", "Link", "Hide from navigation", and similar plain terms over implementation terms like "node", "docType", "umbracoNaviHide", "model", "entity", or "component" when those words are not editor language.
- Remove duplicated context from labels when the tab or group already provides it. A property inside a "Hero" group can usually be "Heading" rather than "Hero heading".
- Keep names specific enough in creation menus. "Landing Page" is clearer than "Page" when the editor is choosing what to create.
- Keep aliases unchanged even when the label changes. A friendly label can differ from a developer-friendly alias.

### Descriptions

Descriptions are not required everywhere. Require or recommend them when they reduce editor uncertainty.

Flag missing or weak descriptions for:

- SEO titles, meta descriptions, Open Graph, social sharing, and search result fields.
- Image, media, crop, focal point, alt text, caption, attribution, or credit fields.
- Link pickers, CTA fields, redirects, forms, embeds, and external integrations.
- Block List, Block Grid, Nested Content, or repeatable item fields where editors need usage tips.
- Toggles or settings with consequences, especially visibility, indexing, navigation, redirects, publication, layout, or feature flags.
- Overrides, fallbacks, inherited/composed fields, default values, and fields that are only used when another field is empty.
- Required fields where the reason is not obvious.
- Fields with format, length, size, ratio, accessibility, legal, compliance, or brand constraints.

Allow obvious fields to have no description when the label and context are enough, such as a simple "Heading" field inside a clear content group.

Good descriptions are short, concrete, and action-oriented:

- Say where the content appears.
- Say what happens if the field is empty.
- Say whether it overrides another field or is used as a fallback.
- Give size, ratio, length, tone, or format guidance when useful.
- Use Markdown or UFM only when it makes the description easier to scan.
- Move long guidance to an editor note or project documentation when a description would become a wall of text.

## Review Output

Do not give an overall numeric friendliness score. Produce a prioritized review:

```markdown
## Friendly Schema Review

### High
- `path/to/file.uda` -> `Home Page` / `umbracoNaviHide`
  - Issue: The label exposes the alias and does not tell editors what the toggle does.
  - Editor risk: Editors may not understand that this controls navigation visibility.
  - Suggested label: Hide from navigation
  - Suggested description: Turn this on to hide this page from menus. The page can still be visited if someone has the URL.

### Medium
- ...

### Low
- ...

### Context Notes
- ...
```

Always explain the problem. Suggest replacement text only when there is enough context. When context is insufficient, say what information is missing or offer a neutral template such as: "Describe where this appears and what happens if left empty."

Use a secondary "Context Notes" section for nearby backoffice friendliness issues that affect the wording, such as unclear tabs/groups, duplicated labels caused by grouping, missing/default icons, overloaded content types, or too many creation options. Keep the primary focus on names, labels, and descriptions.

## Editable Mode

Only edit schema files when the user explicitly asks you to apply changes.

Before editing:

1. Run the extraction script and save JSON before changes.
2. Record every content type alias and property alias from the JSON.
3. Identify the exact editor-facing fields to change.
4. Avoid broad rewrites. Change only text with a clear editor-facing improvement.

During editing:

- Do not edit content type aliases.
- Do not edit property aliases.
- Do not rename files or directories as part of this skill.
- Do not change keys, IDs, data type references, validation, mandatory flags, editor aliases, compositions, permissions, templates, or allowed children unless the user separately asks for those changes.
- Preserve XML formatting as much as practical.

After editing:

1. Run the extraction script again and save JSON after changes.
2. Compare all content type aliases and property aliases against the pre-edit JSON.
3. If any alias changed, stop immediately and report the problem. Restore only your alias-changing edits if you can do so without touching unrelated user work.
4. Summarize changed files and editor-facing text changes.

## Schema Extraction

The bundled script extracts likely content type-like schema from Umbraco Deploy `.uda` files and uSync `.config` files under `uSync` directories. It is intentionally deterministic and advisory:

- It produces JSON with files, types, aliases, names, descriptions, icons, tabs, groups, and properties where it can find them.
- It produces Markdown for quick human scanning.
- It does not decide whether wording is friendly.
- It does not rewrite files.

If extraction misses a file shape, inspect the schema manually and continue with the same principles. Do not invent findings from missing extraction data.

## Examples

**Developerese label**

- Alias: `umbracoNaviHide`
- Weak label: `umbracoNaviHide`
- Better label: `Hide from navigation`
- Better description: `Turn this on to hide this page from menus. The page can still be visited if someone has the URL.`

**Duplicated group context**

- Group: `Hero`
- Alias: `heroBannerTitle`
- Weak label: `Hero banner title`
- Better label: `Heading`
- Possible description: `Shown as the main heading in the hero area. If empty, the page name may be used instead.`

**SEO guidance**

- Label: `Meta description`
- Useful description: `Summarize this page for search results. Aim for about 150-160 characters. If empty, the site may generate a summary from the page content.`

## Sources Behind The Guidance

This skill follows the editor-experience advice from the 24 Days in Umbraco articles "How to Make Umbraco Truly Friendly!" (2024) and "Friendly Backoffice" (2016): use editor language, keep aliases developer-facing, add useful descriptions, explain fallbacks and overrides, avoid overwhelming editors, and review new document types and properties as part of delivery.

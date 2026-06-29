# Umbraco Friendly Schema

Guidance and extraction tooling for creating, reviewing, and carefully improving editor-friendly Umbraco schema text.

Use this skill when working with:

- Content type names and descriptions.
- Document, element, media, or member type labels.
- Property labels and descriptions.
- Umbraco Deploy `.uda` schema files.
- uSync `.config` schema files.
- Backoffice wording reviews focused on content editors.

## Contents

- [SKILL.md](SKILL.md): core agent instructions.
- [scripts/extract-friendly-schema.mjs](scripts/extract-friendly-schema.mjs): dependency-free extractor for content type-like schema text.

## Extractor

Run the extractor from a project root:

```bash
node path/to/umbraco-friendly-schema/scripts/extract-friendly-schema.mjs . --json friendly-schema.json --markdown friendly-schema.md
```

The JSON output is the source of truth for agent review. The Markdown output is a human-readable summary.

The extractor scans:

- `*.uda`
- `.config` files under a `uSync` directory

It extracts likely document, element, media, and member type schema details: names, aliases, descriptions, icons, tabs, groups, properties, editors, mandatory flags, and file paths. It does not rewrite files and does not decide whether wording is friendly.

## Design Stance

Friendly schema text should help content editors understand what they are editing without knowing how the site is built. The skill is advisory by default. When explicitly asked to edit schema files, it may change only editor-facing names, labels, and descriptions, and must verify that document type and property aliases did not change.

# Umbraco UFM

Guidance for writing, reviewing, and advisory verification of Umbraco Flavored Markdown in Umbraco 17+ projects.

Use this skill when working with:

- Block List and Block Grid labels.
- Collection view label templates.
- Property descriptions that use UFM.
- Umbraco Deploy `.uda` schema files.
- uSync schema files under `uSync` folders.
- Migration away from old AngularJS label templates, when the target is Umbraco 17+.

## Contents

- [SKILL.md](SKILL.md): core agent instructions.
- [references/ufm-syntax.md](references/ufm-syntax.md): UFM syntax, components, filters, expressions, and review guidance.
- [scripts/verify-ufm.mjs](scripts/verify-ufm.mjs): dependency-free advisory verifier for `.uda` and `**/uSync/**` files.

## Verifier

Run the verifier from a project root:

```bash
node path/to/umbraco-ufm/scripts/verify-ufm.mjs .
```

It scans only known Umbraco schema locations:

- `*.uda`
- files under a `uSync` directory

The output is human-readable and advisory. It reports syntax errors and warnings with file, line, rule, and a suggested action where possible. It does not rewrite files.

## Design Stance

Good UFM improves the editor experience. Prefer short, scannable labels with useful fallbacks over dense expressions. Use built-in components for built-in concepts, expressions for real logic, and custom components or filters only when repeated project behavior justifies an extension.

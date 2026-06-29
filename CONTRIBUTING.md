# Contributing

This repository is intended to stay easy to browse, copy, and install.

## Add A Skill

1. Pick the closest category under `skills/`, or create a new category when none fits.
2. Create a kebab-case skill folder.
3. Add a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: skill-name
description: Use when...
---
```

4. Keep `SKILL.md` focused on the core behavior the agent should remember.
5. Put longer reference material in sibling markdown files or a `references/` folder.
6. Add the skill to the root [README.md](README.md) and the relevant category README.

## Writing Guidelines

- Make trigger descriptions specific enough that an agent knows when to use the skill.
- Prefer practical rules, examples, and review checklists over broad advice.
- Keep reference links close to the skill that uses them.
- Avoid adding scripts or dependencies unless they materially improve the skill.
- Keep filenames and directories lowercase kebab-case, except for `SKILL.md` and `README.md`.

## Review Checklist

- Does the skill have a clear `name` and `description`?
- Can the skill be copied as a standalone directory?
- Are all relative links valid from the skill directory?
- Is the root catalog updated?
- Is category placement obvious to a first-time reader?

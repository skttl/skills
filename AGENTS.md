# Agent Instructions

This repository is a collection of reusable coding-agent skills.

## Repository Shape

- Skills live under `skills/<category>/<skill>/`.
- Each skill must be copyable as a standalone directory.
- Every skill needs a `SKILL.md` file with YAML frontmatter containing `name` and `description`.
- Use `README.md` for human-facing skill overview and install notes.
- Keep longer guidance in sibling markdown files, `references/`, `scripts/`, or `assets/` only when useful.

## Editing Rules

- Update the root `README.md` and the relevant category `README.md` when adding, removing, renaming, or moving a skill.
- Keep relative links valid from the file that contains them.
- Keep skill names and directories lowercase kebab-case, except for `SKILL.md`, `README.md`, and this file.
- Do not put repository-wide contributor instructions inside individual `SKILL.md` files.
- Prefer small, practical instructions, examples, and review checklists over broad advice.

## Verification

After changing markdown links, run a local markdown link check or manually verify affected links.

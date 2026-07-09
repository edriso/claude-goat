# What Are Agent Skills

You have probably corrected Claude on the same thing more than once. "Remember, we use conventional commits." "Our API responses always follow this shape." "When you make a PDF, use our letterhead." Agent Skills are how you teach that knowledge once, so Claude applies it automatically, at the right moment, forever.

## The simple idea

A Skill is a folder with a markdown file (`SKILL.md`) that contains instructions and know-how for a specific kind of task. Claude reads the short description of every available Skill, and when your request matches, it pulls in that Skill's full instructions and follows them.

Think of Skills as onboarding docs for a teammate, except this teammate reads them instantly and never forgets.

## Why they are clever: progressive disclosure

Here is the elegant part. Claude does not load every Skill's full content all the time. That would waste its context window. Instead:

1. It always sees each Skill's **name and one-line description** (cheap).
2. When a task matches, it loads that Skill's **full instructions** (only when needed).
3. If the Skill points to extra files or scripts, those load **only if the task requires them**.

This is called progressive disclosure. It means you can have many Skills available without slowing anything down.

## Anatomy of a SKILL.md

A Skill lives at `.claude/skills/<skill-name>/SKILL.md` and looks like this:

```markdown
---
name: commit-style
description: Write git commit messages in our team's conventional-commit format. Use whenever creating a commit.
---

# Commit Style

Write commit messages using Conventional Commits:

- Format: `type(scope): summary`
- Types: feat, fix, docs, refactor, test, chore
- Keep the summary under 60 characters, imperative mood.
- Add a body only when the change needs explanation.

Example: `feat(auth): add Google OAuth login`
```

Two things in the frontmatter matter most:

- **name**: a short identifier.
- **description**: this is the trigger. It tells Claude *when* to use the Skill. Write it clearly and mention the situations that should activate it, because Claude decides based on this line.

Everything below the frontmatter is the actual instructions.

## Where Skills come from

- **Project Skills** in `.claude/skills/` are committed to your repo and shared with your team.
- **Personal Skills** in `~/.claude/skills/` follow you across all your projects.
- **Plugin Skills** come bundled when you install a plugin, so you can share whole sets of Skills at once.

## Real use cases

- A **code review** Skill that encodes your team's review checklist.
- A **PDF or report** Skill that formats documents with your branding.
- A **testing** Skill that captures how your project writes and structures tests.
- A **style guide** Skill so generated docs match your company voice.
- A **deploy** Skill that walks the exact steps and safety checks for shipping.
- A **ticket runner** Skill that preps a whole class of ticket: gathers your team's context and legacy-code references, pulls the relevant design from Figma over [MCP](/docs/mcp), and sets up the workspace before you write a line.

## Skills and slash commands

In current Claude Code, custom slash commands and Skills are the same system. A Skill named `deploy` gives you a `/deploy` command you can trigger directly, in addition to Claude using it automatically when relevant.

Ready to make one? Head to [Build Your First Skill](/docs/skills-build).

**Learn more:** Anthropic's free [Introduction to Agent Skills](https://anthropic.skilljar.com/) course.

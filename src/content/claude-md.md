# CLAUDE.md Memory

Imagine explaining your project to a new teammate every single morning: the build commands, the code style, the gotchas. Exhausting. `CLAUDE.md` is how you explain it once and have Claude remember, session after session.

## What it is

`CLAUDE.md` is a plain markdown file that Claude reads at the start of every session. Whatever you put in it becomes persistent context: rules, commands, conventions, warnings. No special syntax required. Just write clear instructions.

## Where it lives

Files load from broadest to most specific, and all of them stack together:

| Scope | Location | Shared with |
|---|---|---|
| User | `~/.claude/CLAUDE.md` | Just you, in every project |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Your team, via git |
| Local | `./CLAUDE.local.md` | Just you, this project (gitignore it) |

A common setup: personal preferences in your user file, shared team rules committed in the project file.

## The fastest way to start

Inside a project, run:

```text
/init
```

Claude reads your codebase and writes a starter `CLAUDE.md` for you. Then edit it. Use `/memory` any time to view or change it.

## What to put in it

Include things Claude *cannot guess* from the code:

```markdown
# Project: Acme Storefront

## Commands
- Dev server: `npm run dev`
- Run tests: `npm test`
- Lint: `npm run lint`

## Conventions
- Use functional React components, never class components.
- Styling is Tailwind only. Do not add CSS modules.
- API calls go through `src/lib/api.js`, never fetch directly in components.

## Gotchas
- The `legacy/` folder is frozen. Do not modify it.
- Env vars live in `.env.local`, never commit them.
```

## What to leave out

Here is the counterintuitive part: **a bloated `CLAUDE.md` makes Claude follow it less.** When the important rules are buried in noise, they get lost.

For every line, ask yourself: *"Would removing this cause Claude to make a mistake?"* If not, cut it. Do not document things Claude can read straight from the code. Keep each file lean, ideally under about 200 lines.

Anthropic's own trim rule is sharper than that and worth stealing. **Cut what Claude could derive from the codebase:** directory layouts, dependency lists, architecture overviews. **Keep what it could not:** pitfalls, rationale, and conventions that differ from tool defaults. And if a chunk of guidance only matters for one kind of task, it does not belong in a file that loads on every session at all. Move it into a [Skill](/docs/skills-intro), which loads on demand.

You do not have to do this by hand. Run **`/doctor`** and it proposes exactly these trims, deduplicates a local `CLAUDE.md` against the checked-in one, and offers to migrate the always-loaded guidance that survives into Skills and nested `CLAUDE.md` files. It reports first and asks before changing anything. There is more on the thinking behind it in [Context Engineering](/docs/context-engineering).

## Scope rules to the files they apply to

The advice above ("keep it lean") sounds like it forces a choice between context you want and context you can afford. It mostly does not, because you can make instructions load only when they are relevant. This is the most underused part of the memory system.

Three mechanisms, from simplest to most precise:

**1. A `CLAUDE.md` in a subfolder.** Claude discovers `CLAUDE.md` files below your working directory but does not load them at launch. Per the docs, they "are included when Claude reads files in those subdirectories". So `./css/CLAUDE.md` costs you nothing until a tool call touches something under `css/`. Free CSS rules, only for CSS work.

**2. `.claude/rules/`, one topic per file.** For larger projects, split instructions into topic files instead of growing one document:

```text
your-project/
├── .claude/
│   ├── CLAUDE.md         # main project instructions
│   └── rules/
│       ├── code-style.md
│       ├── testing.md
│       └── security.md
```

All `.md` files are discovered recursively, so you can nest them in `frontend/` and `backend/` folders. A rule with no `paths` field loads at launch with the same priority as `.claude/CLAUDE.md`. This is organization rather than savings, and that alone is worth it on a team, because a teammate editing the testing rules does not have to touch a file everyone else also edits.

**3. Path-scoped rules, which is the powerful one.** Add a `paths` field in YAML frontmatter and the rule only enters context when Claude reads a matching file:

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API rules

- Every endpoint validates its input.
- Use the standard error response shape.
```

Glob patterns work how you would expect, including brace expansion:

| Pattern | Matches |
|---|---|
| `**/*.ts` | Every TypeScript file, any directory |
| `src/**/*` | Everything under `src/` |
| `*.md` | Markdown in the project root only |
| `src/**/*.{ts,tsx}` | Both extensions in one pattern |

This is what lets a rule follow a *concern* rather than a folder. If your blog is a lift-and-shift of a third-party theme with its own hard-won conventions, one rule scoped to `app/blog/**`, `lib/webflow/**`, and `scripts/webflow-*` carries all of them, spanning folders that have nothing else in common, and costs nothing on every other task.

Two more things worth knowing:

- **Personal rules live in `~/.claude/rules/`** and apply to every project on your machine. They load before project rules, so project rules win.
- **The directory supports symlinks**, so you can keep one shared rule set and link it into many repos: `ln -s ~/company-standards/security.md .claude/rules/security.md`.

**The gotcha to remember:** your project-root `CLAUDE.md` is re-read from disk after `/compact`, but **nested `CLAUDE.md` files and path-scoped rules are not re-injected**. They come back the next time Claude reads a matching file. So if a rule seems to evaporate mid-session, that is usually why, and touching a relevant file brings it back.

## Personal instructions, and the worktree trap

`CLAUDE.local.md` at the project root holds preferences you do not want to commit: your sandbox URLs, your test data, your own workflow notes. Gitignore it. A neat trick is to put `*.local.*` in your **global** gitignore, so the file is ignored in every repo without you editing each `.gitignore`.

One catch that bites people who use git worktrees: a gitignored file only exists in the worktree where you created it, so your personal instructions vanish in the next one. The documented fix is to keep the real file in your home directory and import it instead:

```markdown
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

Expect an approval dialog the first time a *project* file imports something from outside the working directory. That prompt exists to protect you from an import somebody else committed, so read it rather than clicking through it. Imports in your own user-scope files do not trigger it.

And if you work in a monorepo where other teams' instruction files keep getting picked up, `claudeMdExcludes` in `.claude/settings.local.json` skips them by glob. Managed policy files are the one thing it cannot exclude.

## Why it is guidance, not law

Worth knowing so you are not surprised: `CLAUDE.md` is delivered as a user message *after* the system prompt, not as part of it. The docs are candid that Claude reads it and tries to follow it, but there is no guarantee of strict compliance, especially for vague or conflicting instructions.

So match the tool to the need. Project conventions and context belong here. A response format you want every single turn belongs in an output style ([see the Prompting Playbook](/docs/prompting)). Something that must happen every time without exception belongs in a [hook](/docs/hooks) or a [setting](/docs/settings), which are enforced rather than interpreted.

## Pulling in other files

You can import other files with the `@` syntax, up to a few hops deep:

```markdown
See @README.md for the overview and @package.json for available scripts.
Follow our git rules in @docs/git-guide.md.
```

If your repo already has an `AGENTS.md`, add `@AGENTS.md` at the top of your `CLAUDE.md` so its content loads too.

## Auto memory

Claude can also keep its own notes (build quirks it discovered, your preferences) in a separate memory folder that loads each session. Think of `CLAUDE.md` as the rules *you* write, and auto memory as the notes *Claude* writes for itself. It lives in `~/.claude/projects/<project>/memory/` as a `MEMORY.md` index linking to topic files, and it is on by default.

It can be genuinely handy, but it has a downside: it quietly accumulates notes you never see, and can occasionally resurface something stale. If you prefer to keep memory fully hand-maintained, turn it off. Run `/memory` and toggle it, set `"autoMemoryEnabled": false` in settings, or set the `CLAUDE_CODE_DISABLE_AUTO_MEMORY` environment variable.

Next: share those instructions with other tools using [AGENTS.md](/docs/agents-md).

**Official link:** [Memory](https://code.claude.com/docs/en/memory)

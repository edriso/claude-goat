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

## Pulling in other files

You can import other files with the `@` syntax, up to a few hops deep:

```markdown
See @README.md for the overview and @package.json for available scripts.
Follow our git rules in @docs/git-guide.md.
```

If your repo already has an `AGENTS.md`, add `@AGENTS.md` at the top of your `CLAUDE.md` so its content loads too.

## Auto memory

Claude can also keep its own notes (build quirks it discovered, your preferences) in a separate memory file, which loads each session. Toggle it with `/memory`. Think of `CLAUDE.md` as the rules *you* write, and auto memory as the notes *Claude* writes for itself.

Next: make things happen automatically with [hooks](/docs/hooks).

**Official link:** [Memory](https://code.claude.com/docs/en/memory)

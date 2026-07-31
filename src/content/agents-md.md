# AGENTS.md & Other Agents

Your `CLAUDE.md` is only read by Claude Code. If anyone on your team also runs Codex, Cursor, or Gemini CLI, those tools read a different file and see none of your project rules. This page covers how to share one set of instructions across all of them.

## Who reads what

`AGENTS.md` is an open format for exactly this problem: one instruction file that many coding agents understand. It started at OpenAI and is now stewarded by the Agentic AI Foundation under the Linux Foundation.

The important part for you:

| Tool | Reads `CLAUDE.md` | Reads `AGENTS.md` |
| --- | --- | --- |
| Claude Code | yes | no |
| Codex | no (configurable) | yes |
| Cursor, Gemini CLI, Copilot, Jules | varies | yes |

Claude Code does not read `AGENTS.md`, and there is no setting that changes that. The [memory docs](https://code.claude.com/docs/en/memory) say so directly. Plenty of blog posts claim otherwise. They are wrong.

## The fix is one line

Anthropic documents the pattern. Keep the shared content in `AGENTS.md` and make `CLAUDE.md` import it:

```markdown
@AGENTS.md

## Claude Code specifics

Use plan mode for changes under `src/billing/`.
```

Now Codex reads `AGENTS.md` directly, Claude Code reads it through the import, and you still have room for Claude-only rules below the line. Tested on Claude Code 2.1.220: both files' content loads.

A symlink works too, and Claude Code follows it:

```bash
ln -s AGENTS.md CLAUDE.md
```

Prefer the import. It leaves room for tool-specific sections, and symlinks need Administrator or Developer Mode on Windows.

Put the shared content in `AGENTS.md`, not the other way round. It is the file more tools can read on a fresh clone.

## What goes in which file

The test: would this still be true and useful if a different agent read it?

Build commands, branch conventions, and architecture notes pass, so they belong in `AGENTS.md`. References to your skills, slash commands, hook paths, or plan mode are Claude-specific, so they stay in `CLAUDE.md` below the import.

## Two things that will bite you

**Codex silently truncates long files.** It stops loading project docs at 32 KB by default and gives no warning. Tested with a 74 KB `AGENTS.md`: a marker near the top loaded, a marker at the bottom did not, and nothing said so. If your instruction file is large, split it, or raise the limit in a committed `<repo>/.codex/config.toml`:

```toml
project_doc_max_bytes = 262144
```

Splitting is the better fix. Everything in a memory file is paid for on every turn, in every harness.

**Repo-local Codex config only applies to trusted repos.** Codex asks whether to trust a directory on first run. Until you say yes, a committed `.codex/config.toml` is ignored. Verified both ways.

## The other direction

You can point Codex at your existing `CLAUDE.md` instead, and this can be committed rather than set up by each person:

```toml
# <repo>/.codex/config.toml
project_doc_fallback_filenames = ["CLAUDE.md"]
```

Tested: with that file committed and the repo trusted, Codex reads `CLAUDE.md`. Without it, Codex sees nothing.

It only fires when `AGENTS.md` is absent, so it is a fallback and not a merge. It is a reasonable choice for a Claude-first repo where Codex is an occasional guest. It does nothing for Cursor, Gemini CLI, or Copilot, so reach for `AGENTS.md` if more than one other tool is involved.

## Check it yourself

Tool behavior changes often. This takes a minute:

```bash
d=$(mktemp -d) && cd "$d" && git init -q .
printf 'The AGENTS codeword is ZEBRAFISH.\n' > AGENTS.md
printf 'The CLAUDE codeword is MARMOSET.\n' > CLAUDE.md
q="Name every codeword in your loaded instructions and the file it came from.
Answer only from loaded context, do not read files."
codex exec --skip-git-repo-check "$q"
claude -p "$q"
```

Each should name exactly one codeword. If that ever changes, so did the advice on this page.

Next: make things happen automatically with [hooks](/docs/hooks).

**Official links:** [CLAUDE.md memory](https://code.claude.com/docs/en/memory) · [agents.md](https://agents.md/)

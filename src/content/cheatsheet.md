# Cheat Sheet

One page to bookmark. The commands, shortcuts, and reminders you will reach for most. Skim the whole guide first, then keep this open while you work.

## Starting out

```bash
claude              # start an interactive session
claude "task"       # start and run a task immediately
claude -c           # continue the most recent conversation
claude -p "query"   # one-off query, print, exit (for scripts)
claude doctor       # diagnose setup problems
```

## Slash commands you will use daily

| Command | Does |
|---|---|
| `/help` | List everything |
| `/clear` | Fresh conversation |
| `/compact` | Summarize to free up context |
| `/context` | See what fills your context |
| `/init` | Generate a starter CLAUDE.md |
| `/plan` | Enter planning mode |
| `/model` | Switch model |
| `/diff` | View uncommitted changes |
| `/code-review` | Review your diff |
| `/rewind` | Roll back to a checkpoint |

## Key shortcuts

| Key | Does |
|---|---|
| `Shift+Tab` | Cycle permission modes |
| `Esc` | Interrupt Claude |
| `Esc` `Esc` | Clear draft, or open rewind |
| `Ctrl+R` | Search command history |
| `Ctrl+G` | Edit prompt or plan in your editor |
| `Tab` | Autocomplete, accept suggestion |
| `!` | Run a shell command directly |
| `@` | Reference a file |

## The core loop

**Explore → Plan → Code → Commit.** Read and understand, agree on a plan, implement, then commit. Skip planning only for one-sentence changes.

## The habits that matter most

- Give Claude a way to verify its work (tests, build, linter, screenshot).
- Be specific: name files, constraints, and example patterns.
- `/clear` between unrelated tasks.
- After two failed corrections, `/clear` and rewrite the prompt.
- Keep CLAUDE.md lean. Cut any line that would not cause a mistake if removed.
- Review with a fresh session, not the one that wrote the code.

## Choosing a model

Fastest and cheapest to most capable: **Haiku 4.5 → Sonnet 5 → Opus 4.8 → Fable 5.** Default to Opus for hard coding, Sonnet for everyday production, Haiku for simple high-volume tasks, Fable only when you truly need it.

## The one prompt-quality test

Would a new colleague with no context understand this request? If not, add context until they would.

## When to use what

- Applies to every session? **CLAUDE.md.**
- Know-how for a specific task? **Skill.**
- Needs outside data or tools? **MCP.**
- Noisy or best isolated? **Subagent.**
- Must happen every time, guaranteed? **Hook.**

Keep this handy, and the rest becomes muscle memory. Want the source docs? See [Docs and Links](/docs/links).

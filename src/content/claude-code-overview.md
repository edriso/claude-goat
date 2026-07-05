# Claude Code Overview

Claude Code is an *agentic* coding tool. That word matters. A chatbot answers questions. An agent takes action. Claude Code reads your codebase, edits real files, runs shell commands, and works through multi-step problems while you watch or step away.

You describe what you want in plain language. Claude explores, plans, implements, and checks its work. You stay in the driver's seat the whole time.

## How a session works

Run `claude` inside a project and you get an interactive session (a REPL, like a conversation in your terminal). You type requests, Claude responds and acts. A few launch options you will use often:

| Command | What it does |
|---|---|
| `claude` | Start an interactive session |
| `claude "task"` | Start and immediately run a task |
| `claude -p "query"` | Run one query, print the answer, exit (great for scripts) |
| `claude -c` | Continue the most recent conversation here |
| `claude -r` | Resume and pick a past conversation |

## The core loop: explore, plan, code, commit

This is the single most important habit in this whole guide.

1. **Explore.** Ask Claude to read and understand before changing anything. "Read `/src/auth` and explain how login and sessions work."
2. **Plan.** Have it propose an approach first. "I want to add Google login. What files change and what is the flow? Make a plan."
3. **Code.** Once the plan looks right, let it implement. "Build that. Write tests for the callback handler, run them, and fix any failures."
4. **Commit.** "Commit with a clear message and open a PR."

For a tiny change (a typo, one log line), skip the plan. If you can describe the diff in one sentence, just ask for it.

## Editing files safely

When Claude wants to change a file, it shows you a proposed diff and asks before writing. You can approve each edit, or switch to a mode that auto-accepts edits so you review afterward. Nothing happens to your code without a permission step you control. See [permission modes on the settings page](/docs/settings).

## Running commands

Claude runs shell commands through its tools, asking permission the first time. You can also run a command yourself without involving the model by starting your line with `!`:

```text
! npm test
```

The output gets added to the conversation, so Claude can see the result and react.

## Planning mode

Planning mode is a read-only mode: Claude researches and writes a plan but makes zero changes. Enter it by pressing `Shift+Tab` to cycle modes, or type `/plan`. When the plan is ready, Claude asks how you want to proceed. Press `Ctrl+G` to open the plan in your editor and tweak it before approving.

This one feature prevents the most common failure in AI coding: confidently solving the wrong problem.

## Where it runs

The same engine powers the terminal, VS Code, JetBrains IDEs, a desktop app, the web (claude.ai/code), Slack, and CI/CD pipelines. Learn it in the terminal, then use it wherever you work. Your [memory](/docs/claude-md), [settings](/docs/settings), and [connected tools](/docs/mcp) come along.

## Handy session controls

- `/clear` starts a fresh conversation when you switch tasks.
- `/compact` summarizes a long conversation to free up space.
- `/context` shows what is filling the context window.
- `/rewind` (or press `Esc` twice) rolls code or conversation back to a checkpoint.

## Picking up where you left off

Every session is saved to disk automatically, so nothing is lost when you close the terminal, and `/clear` starts a fresh conversation without deleting the old one. To return to earlier work:

- `claude --continue` (or `-c`) reopens the most recent conversation in this folder.
- `claude --resume` (or `-r`) opens a picker of your past conversations to choose from. Inside a session, `/resume` does the same.

Saved conversations are kept for 30 days by default; change that with `cleanupPeriodDays` in [settings](/docs/settings). So switching tasks with `/clear` is safe: your old conversation is only a `--resume` away.

Next, learn the [slash commands](/docs/slash-commands) you will reach for every day.

**Official links:** [Overview](https://code.claude.com/docs/en/overview) · [How it works](https://code.claude.com/docs/en/how-claude-code-works)

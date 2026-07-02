# Slash Commands

Slash commands are built-in shortcuts you type at the start of a line. Press `/` in a session and a menu appears that you can filter as you type. Anything after the command is passed along as arguments.

These are the ones worth knowing by heart. You do not need to memorize all of them today. Skim, then come back.

## The everyday essentials

| Command | What it does |
|---|---|
| `/help` | Show help and all available commands |
| `/clear` | Start a fresh conversation with empty context |
| `/compact [focus]` | Summarize the conversation to free up context |
| `/context` | See what is filling your context window |
| `/init` | Generate a starter `CLAUDE.md` from your codebase |
| `/model [name]` | Switch model and set your default |
| `/plan [description]` | Enter planning mode |
| `/rewind` | Roll code or conversation back to a checkpoint |
| `/resume` | Reopen a past conversation |

## Working with your project

| Command | What it does |
|---|---|
| `/memory` | View and edit your `CLAUDE.md` memory files |
| `/agents` | Create, edit, and run [subagents](/docs/subagents) |
| `/mcp` | Manage [MCP servers](/docs/mcp) and their logins |
| `/permissions` | Manage what Claude can do without asking |
| `/hooks` | View your [hook](/docs/hooks) configuration |
| `/config` | Open settings, or set directly: `/config theme=dark` |
| `/statusline` | Configure the status bar in plain language |

## Reviewing and shipping

| Command | What it does |
|---|---|
| `/diff` | Interactive viewer for your uncommitted changes |
| `/review [PR]` | Review a GitHub pull request |
| `/code-review [--fix]` | Review your current diff for bugs and cleanups |
| `/security-review` | Security-focused review of pending changes |
| `/cost`, `/usage` | See session cost and your plan usage |
| `/doctor` | Diagnose install and configuration problems |

## A real example

Say you just finished a feature. A natural sequence:

```text
/diff
```

Look over your changes, then:

```text
/code-review
```

Let a fresh review pass flag correctness issues, then ask Claude to commit. A fresh review catches things the session that wrote the code tends to miss, because it is not attached to its own work.

## Good to know

Custom slash commands and Skills have merged. A file at `.claude/commands/deploy.md` and a Skill at `.claude/skills/deploy/SKILL.md` both give you a `/deploy` command. You will learn to build these on the [Agent Skills pages](/docs/skills-intro).

Next: teach Claude your project once with [CLAUDE.md memory](/docs/claude-md).

**Official link:** [Commands reference](https://code.claude.com/docs/en/commands)

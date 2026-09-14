# Settings and Statusline

A little configuration goes a long way. This page covers `settings.json`, permission modes (how often Claude asks before acting), and a fun one: your status line.

## settings.json in plain terms

Claude Code reads settings from a few places, and more specific ones win over general ones:

- `~/.claude/settings.json` for your personal defaults across all projects.
- `.claude/settings.json` in a project, committed and shared with your team.
- `.claude/settings.local.json` for your personal, uncommitted project overrides.

You can edit these directly, or use `/config` for a UI, or set a value inline like `/config theme=dark`.

A useful starter, with a schema line that gives you editor autocomplete:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "model": "sonnet",
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": ["Bash(npm run lint)", "Bash(npm run test:*)"],
    "deny": ["Read(.env)", "Read(secrets/**)"]
  }
}
```

That example sets a default model, auto-accepts edits, pre-approves your lint and test commands so Claude stops asking, and forbids reading secret files entirely.

## Turn off the commit signature

By default, Claude adds an attribution line to the git commits and pull requests it creates. Asking it not to in `CLAUDE.md` works only *most* of the time. The dependable fix is a setting, which always wins over a written request:

```json
{
  "attribution": {
    "commit": "",
    "pr": ""
  }
}
```

Empty strings mean nothing extra gets appended to your commit messages or PR bodies. It is a good example of a wider rule: when you want something to happen every single time, reach for a setting or a [hook](/docs/hooks), not a line of instruction that Claude might forget.

## Permission modes

When Claude wants to edit a file, run a command, or hit the network, it pauses to ask. Permission modes decide how often. Cycle them live with `Shift+Tab`.

| Mode | Runs without asking | Good for |
|---|---|---|
| `default` | Reads only | Getting started, sensitive work |
| `acceptEdits` | Reads and file edits | Iterating on code you review after |
| `plan` | Reads only, proposes a plan | Exploring before changing anything |
| `auto` | Most things, with a safety classifier blocking risky actions | Long tasks with fewer interruptions |

On top of any mode, your `allow`, `ask`, and `deny` rules always apply. Deny always wins: a `deny` rule cannot be overridden by an `allow`.

## Go fast without getting burned

You will eventually hear about `claude --dangerously-skip-permissions` (people call it "YOLO mode"). It turns off every prompt so Claude runs anything without asking. It is the same thing as the `bypassPermissions` mode. It feels great for about five minutes, and then one bad command, or a prompt injection hidden in a file or web page Claude reads, runs with nothing to stop it. There are real stories of it wiping a home directory. The rule of thumb: **never point it at your real machine.** The only safe home for it is a throwaway container, VM, or dev container where a mistake costs you nothing.

The good news is you do not need it. You can get almost all of the speed, safely, with two lists in `settings.json`:

- **`allow`** the safe, repetitive commands you run all day so Claude stops asking: your linter, tests, type-checker, git status, and so on.
- **`deny`** the things it should never touch: your secrets, and destructive shell commands.

```json
{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Bash(git status)",
      "Bash(git diff:*)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(.env.keys)",
      "Read(secrets/**)",
      "Read(*.pem)",
      "Read(*.p12)",
      "Read(*.pfx)",
      "Read(id_*)",
      "Read(.netrc)",
      "Read(.pgpass)",
      "Read(.htpasswd)",
      "Bash(curl:*)",
      "Bash(wget:*)"
    ]
  }
}
```

That setup keeps you moving fast on the boring stuff while a real guardrail stays up around anything that could leak a key or do damage. It is the difference between skipping the seatbelt and just tuning it so it stops nagging you on the safe roads.

Two details in that deny list are worth knowing, because most people get them wrong.

**Bare filenames already match at any depth.** Read and Edit rules use [gitignore](https://git-scm.com/docs/gitignore) pattern syntax, so `Read(.env)` and `Read(**/.env)` are exactly equivalent: both cover every `.env` at or under your current directory, not just the one in the project root. You do not need the `**/` prefix. What a bare pattern does *not* reach is a `.env` in a parent directory or another project; for that, `Read(//**/.env)` is anchored at the filesystem root and matches everywhere.

**The anchors are easy to trip over.** A single leading slash is not an absolute path. `Read(/secrets/**)` anchors at whatever defined it, so in `~/.claude/settings.json` it means `~/.claude/secrets/`, not your project. Use `//` for a real absolute path and `~/` for a home-relative one.

| Pattern | Anchored at |
|---|---|
| `path` or `./path` | Current directory |
| `/path` | The settings source (project root, or `~/.claude/` in user settings) |
| `~/path` | Your home directory |
| `//path` | The filesystem root |

## Deny rules do not stop every read

This one matters, because the list above looks more airtight than it is.

A `Read` deny rule covers Claude's built-in file tools, the file commands Claude Code recognizes inside Bash (`cat`, `head`, `tail`, `sed`), and the targets of shell redirections like `> file` and `< file`. That is a lot, and for everyday use it works.

What it does not cover is **a command that reads a file without naming it**. Run `grep -r pattern .` from the directory holding your `.env` and the rule never matches, because no denied path appears in the command. The same goes for any subprocess that opens files on its own: a Python or Node script does its file access inside the process, where the permission layer cannot see it.

So treat deny rules as a guardrail against the obvious mistake, not as a boundary that holds against a determined prompt injection. When you need the real thing, `/sandbox` enforces it at the OS level, where every process is bound regardless of how it names the file. The two compose: use permission rules for intent, the sandbox for enforcement.

While you are here, one related surprise: Claude Code treats a built-in set of Bash commands as read-only and runs them with no prompt in every mode, including `ls`, `cat`, `head`, `tail`, `grep`, `find`, `wc`, `diff`, `stat`, and read-only `git`. That set is not configurable. If you are getting prompted for something on that list, a deny or ask rule is what put it there, which is usually a managed or team settings file rather than anything you wrote.

## The status line

The status line is a customizable bar at the bottom of your session. It can show your model, how full your context is, the git branch, and session cost, all at a glance.

The easiest way to set it up is to just describe what you want:

```text
/statusline show the model name and context percentage with a progress bar
```

Claude writes the script and wires it up. Prefer to do it by hand? Point settings at a script:

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh"
  }
}
```

Your script gets session data as JSON on standard input (model name, current directory, cost, context percentage, and more) and prints whatever you want to display:

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
echo "[$MODEL] ${PCT}% context used"
```

Small touches like this make the tool feel like yours, and knowing your context percentage at a glance is genuinely useful.

Next: learn what makes Claude tick with [Agent Skills](/docs/skills-intro).

**Official links:** [Settings](https://code.claude.com/docs/en/settings) · [Configure permissions](https://code.claude.com/docs/en/permissions) · [Permission modes](https://code.claude.com/docs/en/permission-modes) · [Sandboxing](https://code.claude.com/docs/en/sandboxing) · [Security](https://code.claude.com/docs/en/security) · [Statusline](https://code.claude.com/docs/en/statusline)

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
    "deny": ["Read(./.env)", "Read(./secrets/**)"]
  }
}
```

That example sets a default model, auto-accepts edits, pre-approves your lint and test commands so Claude stops asking, and forbids reading secret files entirely.

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
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Bash(curl:*)",
      "Bash(wget:*)"
    ]
  }
}
```

That setup keeps you moving fast on the boring stuff while a real guardrail stays up around anything that could leak a key or do damage. It is the difference between skipping the seatbelt and just tuning it so it stops nagging you on the safe roads.

Want an OS-level safety net on top of that? Run `/sandbox` to isolate what shell commands can read from disk and reach on the network, independent of your permission rules.

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

**Official links:** [Settings](https://code.claude.com/docs/en/settings) · [Permission modes](https://code.claude.com/docs/en/permission-modes) · [Security](https://code.claude.com/docs/en/security) · [Statusline](https://code.claude.com/docs/en/statusline)

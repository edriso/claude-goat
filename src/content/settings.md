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

On top of any mode, your `allow`, `ask`, and `deny` rules always apply. There is also a `bypassPermissions` mode that skips all checks. Only use it inside an isolated container or VM, never on your real machine.

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

**Official links:** [Settings](https://code.claude.com/docs/en/settings) · [Permission modes](https://code.claude.com/docs/en/permission-modes) · [Statusline](https://code.claude.com/docs/en/statusline)

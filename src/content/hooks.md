# Hooks

`CLAUDE.md` is advice. Claude usually follows it, but "usually" is not "always." When you need something to happen every single time, no exceptions, you want a hook.

## What hooks are

A hook is a shell command (or script) that Claude Code runs automatically at a fixed point in its lifecycle. Because they are deterministic, hooks are perfect for guarantees like:

- Always format and lint after any file edit.
- Never allow a write to the `migrations/` folder.
- Run the test suite before a turn is allowed to finish.
- Load project context when a session starts.

## When hooks can fire

Some useful events:

- `SessionStart` and `SessionEnd`
- `UserPromptSubmit` (when you send a message)
- `PreToolUse` (before Claude uses a tool, and it can block)
- `PostToolUse` (after a tool runs)
- `Stop` (before a turn ends, and it can block)

## A real example: format after every edit

Add this to `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/format.sh",
            "timeout": 30,
            "statusMessage": "Formatting and linting..."
          }
        ]
      }
    ]
  }
}
```

The `matcher` says "run this after the Write or Edit tools." Your script receives details about what happened as JSON on standard input, so it knows which file changed.

A tiny `format.sh` might be:

```bash
#!/bin/bash
input=$(cat)
file=$(echo "$input" | jq -r '.tool_input.file_path')
npx prettier --write "$file"
```

## Blocking bad actions

A `PreToolUse` hook can stop something before it happens. If your script exits with code `2`, the action is blocked and whatever it printed to standard error is sent back to Claude as feedback. This is how you enforce "never run `rm -rf`" or "do not touch protected folders."

## The easiest way to write one

You do not have to write hooks by hand. Ask Claude:

```text
Write a hook that runs eslint --fix after every file edit, and set it up in my project settings.
```

It will create the script and wire up the config for you. Then check it with `/hooks`.

## Hooks vs CLAUDE.md, in one line

Use `CLAUDE.md` for guidance and preferences. Use hooks for hard guarantees that must never be skipped.

Next: keep your context clean with [subagents](/docs/subagents).

**Official links:** [Hooks](https://code.claude.com/docs/en/hooks) · [Hooks guide](https://code.claude.com/docs/en/hooks-guide)

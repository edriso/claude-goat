# Frontmatter & Power Features

`name` and `description` give you a working Skill, and for most Skills that is the whole story. The rest of the frontmatter is where Claude Code Skills stop being documents and start behaving like small programs: they take arguments, run shell commands before Claude sees them, execute in their own isolated context, and pre-approve their own tools.

Everything on this page is Claude Code specific. The [Agent Skills format](https://agentskills.io) itself is an open standard that other tools implement, but these fields are Claude Code's extensions to it.

## Every field

All fields are optional. Only `description` is really recommended, so Claude knows when to reach for the Skill.

| Field | What it does |
|---|---|
| `name` | Display label in skill listings. Defaults to the directory name |
| `description` | What it does and when to use it. This is the trigger |
| `when_to_use` | Extra trigger phrases or example requests, appended to the description |
| `argument-hint` | Autocomplete hint, like `[issue-number]` |
| `arguments` | Named positional arguments for `$name` substitution |
| `disable-model-invocation` | `true` means only you can run it, never Claude |
| `user-invocable` | `false` hides it from the `/` menu, so only Claude runs it |
| `allowed-tools` | Tools Claude may use without a permission prompt this turn |
| `disallowed-tools` | Tools removed from Claude's pool while the Skill is active |
| `model` | Model to use while this Skill is active |
| `effort` | Effort level while active: `low`, `medium`, `high`, `xhigh`, `max` |
| `context` | Set to `fork` to run in an isolated subagent |
| `agent` | Which subagent type to use when `context: fork` is set |
| `background` | With `context: fork`, `false` waits for the result in the same turn |
| `hooks` | [Hooks](/docs/hooks) scoped to this Skill's lifecycle |
| `paths` | Globs that limit when the Skill auto-activates |
| `shell` | `bash` (default) or `powershell` for inline shell commands |

Booleans accept `yes`, `no`, `on`, `off`, `1`, and `0` in any case, as well as `true` and `false`.

One thing worth knowing: in a personal or project Skill, `name` only sets the display label. The command you type still comes from the directory name, so `.claude/skills/deploy-staging/SKILL.md` gives you `/deploy-staging` no matter what `name` says. Plugin Skills are the exception, where `name` sets the last segment after the plugin prefix.

## Who is allowed to invoke it

By default both of you can: you type `/skill-name`, and Claude loads it when the description matches. Two fields narrow that.

| Frontmatter | You can invoke | Claude can invoke | In context |
|---|---|---|---|
| (default) | Yes | Yes | Description always, full body when invoked |
| `disable-model-invocation: true` | Yes | No | Nothing until you invoke it |
| `user-invocable: false` | No | Yes | Description always, full body when invoked |

Use `disable-model-invocation: true` for anything with side effects. You do not want Claude deciding to deploy because the code looks ready:

```yaml
---
name: deploy
description: Deploy the application to production
disable-model-invocation: true
allowed-tools: Bash(git push *)
---

Deploy $ARGUMENTS to production:

1. Run the test suite
2. Build the application
3. Push to the deployment target
4. Verify the deployment succeeded
```

Use `user-invocable: false` for background knowledge that is not an action. A `legacy-system-context` Skill explains how the old billing system works. Claude should know that when relevant, but `/legacy-system-context` is not a thing anyone wants to run.

A useful side effect: `disable-model-invocation: true` keeps the description out of Claude's context entirely, which frees up listing budget.

## Arguments

Both you and Claude can pass arguments. `$ARGUMENTS` gets everything after the Skill name:

```yaml
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
argument-hint: [issue-number]
---

Fix GitHub issue $ARGUMENTS following our coding standards.
```

`/fix-issue 123` sends Claude "Fix GitHub issue 123 following our coding standards." If a Skill has no `$ARGUMENTS` placeholder, Claude Code appends `ARGUMENTS: <your input>` to the end so nothing is lost.

For individual arguments, use `$0`, `$1`, `$2` (shorthand for `$ARGUMENTS[0]` and friends):

```text
Migrate the $0 component from $1 to $2.
```

`/migrate-component SearchBar React Vue` fills those in order. Quote multi-word values, since indexed arguments use shell-style splitting: `/my-skill "hello world" second` makes `$0` be `hello world`.

Or name them, which is much easier to read in a long Skill:

```yaml
---
name: fix-issue
arguments: [issue, branch]
---

Fix issue $issue on branch $branch.
```

A missing indexed placeholder like `$2` stays in the text as-is; a missing named one becomes empty. To write a literal `$1.00` in prose, escape it as `\$1.00`.

You can also stack Skills at the start of a message. `/write-tests /fix-issue 123` loads both and passes `123` to each. Claude Code expands the first plus up to five more, stopping at the first token that is not an inline user-invocable Skill.

## Built-in variables

| Variable | Value |
|---|---|
| `${CLAUDE_SKILL_DIR}` | The directory holding this `SKILL.md` |
| `${CLAUDE_PROJECT_DIR}` | The project root |
| `${CLAUDE_SESSION_ID}` | Current session ID, handy for log filenames |
| `${CLAUDE_EFFORT}` | Current effort level, so a Skill can adapt to it |

`${CLAUDE_SKILL_DIR}` is the one to remember, because it lets a Skill run its own bundled script from any working directory. It also substitutes inside `allowed-tools`, which means you can pre-approve the exact command your Skill tells Claude to run:

```yaml
---
name: render-chart
description: Render a chart from a CSV file
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/render.sh *)
---

Run `${CLAUDE_SKILL_DIR}/scripts/render.sh <csv-file>` to render the chart.
```

Both occurrences expand to the same path, the rule matches, and the script runs without a prompt.

## Inject live data before Claude sees the prompt

This one is genuinely powerful and easy to miss. Wrap a shell command in `` !`command` `` and Claude Code runs it *before* the Skill content is sent, replacing the placeholder with the output. Claude receives real data, not an instruction to go fetch it.

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task
Summarize this pull request...
```

This is preprocessing, not something Claude decides to do. It saves a round trip and guarantees the data is there.

For several commands, use a fenced block opened with ` ```! `:

````text
## Environment
```!
node --version
npm --version
git status --short
```
````

Two gotchas. The `!` is only recognized at the start of a line or straight after whitespace, so `KEY=!`cmd`` stays literal text and never runs. And substitution happens once, so a command cannot print a placeholder for a second pass to expand.

Organizations can switch this off with `"disableSkillShellExecution": true` in settings, which replaces each command with a note instead of running it.

## Run a Skill in its own context

Add `context: fork` and the Skill runs as a subagent, with its content as the prompt. It gets no access to your conversation history, which is exactly the point when you want a clean read.

```yaml
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:

1. Find relevant files using Glob and Grep
2. Read and analyze the code
3. Summarize findings with specific file references
```

By default the fork runs in the background, so you keep working and the result lands in your conversation when it finishes. Set `background: false` to wait for it in the same turn. Claude Code waits anyway in non-interactive mode (`-p` or the Agent SDK), and when you invoke a forked Skill while a previous run is still going.

`agent` picks the execution environment: built-ins `Explore`, `Plan`, or `general-purpose`, or any custom agent from `.claude/agents/`. It defaults to `general-purpose`. `Explore` and `Plan` skip `CLAUDE.md` and git status to stay small, so a forked Skill using `agent: Explore` sees only your Skill content plus the agent's own system prompt.

Forking only makes sense for a Skill that contains an actual task. A Skill full of "use these API conventions" guidance hands the subagent rules with nothing to do, and it returns nothing useful.

Two things also worth knowing: a background fork runs with the narrower tool set that applies to background [subagents](/docs/subagents), so set `background: false` if your steps need a tool outside it. And its edits land outside your session's checkpoints, so `/rewind` will not undo them. Use git.

This is the mirror image of preloading Skills into a subagent. With `context: fork` you write the task in the Skill and pick an agent to run it. With a subagent's `skills` field, the subagent's body is the system prompt and the Skills are reference material.

## Pre-approve tools

`allowed-tools` lets Claude use the listed tools without asking, for the turn that invoked the Skill only. The grant clears the moment you send your next message, even though the Skill's instructions stay in context.

```yaml
---
name: commit
description: Stage and commit the current changes
disable-model-invocation: true
allowed-tools: Bash(git add *) Bash(git commit *) Bash(git status *)
---
```

It grants, it does not restrict. Every other tool is still callable and your normal [permission](/docs/settings) rules still apply. For a session-wide grant, use permission settings instead.

`disallowed-tools` does the opposite and removes tools from the pool while the Skill is active, which is useful for autonomous Skills that should never stop to ask a question.

Worth pausing on: a project Skill can grant itself broad tool access once you accept the workspace trust dialog. Read the Skills in a repo before you trust it.

## Model and effort per Skill

`model` and `effort` override the session settings while the Skill is active, then hand back on your next prompt. Neither is saved to settings. Use them to send a cheap mechanical Skill to a smaller model, or to push a hard review Skill up to `xhigh`.

`paths` scopes automatic activation to matching files, so a Skill about your API layer only loads when Claude is actually working in it:

```yaml
paths: ["src/api/**", "src/server/**"]
```

If you want deeper reasoning for one Skill without touching effort, put the word `ultrathink` anywhere in its content.

## Where Skills live, and who wins

| Location | Path | Applies to |
|---|---|---|
| Enterprise | Managed settings | Everyone in your org |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<name>/SKILL.md` | This project |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Wherever the plugin is on |

On a name clash, enterprise beats personal, and personal beats project. Any of them overrides a bundled Skill of the same name, so a `code-review` Skill in your repo replaces the built-in `/code-review`. Plugin Skills are namespaced as `plugin-name:skill-name` and cannot collide.

Project Skills load from `.claude/skills/` in your starting directory and every parent up to the repo root, so starting Claude in a subfolder still picks up the root Skills.

**Monorepos get something nicer.** Skills in nested `.claude/skills/` directories below where you started load the first time Claude reads or edits a file in that subtree. A package can ship Skills that only apply to work on that package. If a nested Skill clashes with a root one, both stay available: the nested one appears as `apps/web:deploy`, and Claude picks the variant matching the files it is touching.

**Live change detection** means edits to `SKILL.md` take effect within the current session. Creating a top-level skills directory that did not exist at startup still needs a restart.

`--add-dir` is an exception to the usual rules: it normally grants file access only, but `.claude/skills/` inside an added directory does get loaded. The `permissions.additionalDirectories` setting does not do this.

One trap if you use cloud sessions or routines: they do not read `~/.claude/skills/` from your machine. A personal-only Skill will report as not found. Commit it to the repo, ship it in a plugin declared in `.claude/settings.json`, or enable it for your claude.ai account.

## What actually stays in your context

Invoking a Skill drops its rendered content into the conversation as one message, and it stays there for the rest of the session. Claude Code does not re-read the file on later turns. That has a direct writing consequence: **write standing instructions, not one-time steps.** Guidance meant to apply across a whole task should read like a rule, not like step 3.

Re-invoking a Skill whose content is identical just adds a short "already loaded" note instead of a second copy. If the arguments or injected command output changed, the full content is appended again.

Auto-compaction carries Skills forward on a budget: the most recent invocation of each Skill is re-attached after the summary, keeping the first 5,000 tokens of each, with 25,000 tokens shared across all of them. It fills from the most recently invoked backwards, so in a long session with many Skills, the early ones can drop out entirely. If a big Skill seems to stop mattering after a compaction, re-invoke it.

And if a Skill seems to stop working sooner than that, the content is usually still there and Claude is just preferring another approach. Sharpen the description and instructions, or use a [hook](/docs/hooks) if you need a guarantee rather than a preference.

## When it does not trigger

**Never fires.** Check the description contains words you would actually say out loud. Ask "What skills are available?" to confirm it loaded. Try phrasing closer to the description. Invoke it directly with `/skill-name` to prove the file is fine. If the YAML is malformed, Claude Code loads the body with empty metadata, so `/skill-name` works but Claude has no description to match on. Run with `--debug` to see the parse error.

**Fires too often.** Make the description more specific, or add `disable-model-invocation: true` and drive it by hand.

**Description got truncated.** The listing of names and descriptions has a budget of 1% of the model's context window. Every name always appears, but when the listing overflows, Claude Code shortens descriptions starting with the Skills you invoke least, which can strip the very keywords Claude needed. Run `/doctor` for an estimate and the biggest contributors. Each entry's combined `description` and `when_to_use` is capped at 1,536 characters regardless of budget, so put the key use case first. To raise the budget, set `skillListingBudgetFraction` (`0.02` for 2%).

## Turning Skills off

Deny the `Skill` tool in `/permissions` to disable all of them, or target specific ones. `Skill(name)` matches exactly, `Skill(name *)` matches with any arguments:

```text
Skill(commit)
Skill(review-pr *)
```

For Skills whose files you would rather not edit, such as ones checked into a shared repo, `skillOverrides` in settings controls visibility instead. The `/skills` menu writes it for you: highlight a Skill, press `Space` to cycle, `Enter` to save.

| Value | Listed to Claude | In `/` menu |
|---|---|---|
| `"on"` | Name and description | Yes |
| `"name-only"` | Name only | Yes |
| `"user-invocable-only"` | Hidden | Yes |
| `"off"` | Hidden | Hidden |

`"name-only"` is the useful middle ground when your listing is over budget: keep the Skill available without spending characters on its description.

Next: how Skills stack up against subagents, MCP, and hooks in [Skills vs Everything](/docs/skills-vs).

**Official links:** [Skills in Claude Code](https://code.claude.com/docs/en/skills) · [Agent Skills standard](https://agentskills.io) · [Settings reference](https://code.claude.com/docs/en/settings)

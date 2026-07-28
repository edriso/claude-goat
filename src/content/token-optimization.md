# Tokens, Limits and Usage

Two things push back when you use Claude all day. The **context window** caps how much Claude can hold at once. Your **plan limits** cap how much you can spend in a window of time. They share one cause: the API is stateless, so every message resends the whole conversation. A bloated context costs you quality *and* allowance, on every single turn.

This page is the practical half. How to see where your tokens go, the levers that actually move the number, and an honest look at the limit tricks going around.

## Step one: measure

- **`/context`** draws your context window as a colored grid broken down by category, with optimization suggestions for context-heavy tools and memory bloat. It also tells you which `CLAUDE.md` and memory files loaded. Pass `all` to expand the per-item list in fullscreen mode. This is the one you will reach for most.
- **`/usage`** (`/cost` is an alias for the same command) shows token counts and, on a paid plan, how much of your limits you have burned. It attributes recent usage to skills, subagents, plugins, and individual MCP servers, and flags behaviors like long context or cache misses when one accounts for 10% or more of the total. Press `d` or `w` to switch between the last 24 hours and the last 7 days.
- **`/doctor`** audits your always-on context: unused skills, MCP servers, and plugins weighed against what they cost you, plus a `CLAUDE.md` trim. More on that in [Context Engineering](/docs/context-engineering).

Two caveats on `/usage`. Its numbers come from local session history on that machine, so usage from your other devices and from claude.ai is not in them. And the dollar figure is priced at standard list rates for API users, which means it is not your bill if your usage is included in a subscription.

You can pin both context percentage and limit usage to your [status line](/docs/settings) so you never have to ask.

## Why a long session drains you faster than it feels

Anthropic documents this directly, and every item on the list is worth knowing:

- **Long context.** Your full conversation goes out with every message. A one-line question in a session that has been open all day pays for the entire conversation, not the one line.
- **Cache misses.** Your first message after a break longer than the cache lifetime reprocesses your whole context at full price. That lifetime is an hour on a subscription, and drops to five minutes once you are drawing on usage credits or using an API key.
- **Scheduled tasks** fire on their interval even while the session sits idle, sending your full context each time.
- **Agent teammates** keep consuming tokens until they exit.
- **`/compact` is itself a large request,** because it has to read the conversation it summarizes. When you want a fresh start instead of continuity, **`/clear` costs nothing.**

That last bullet is the most useful line on this page. `/compact` gets reached for reflexively. If you are actually done with the task, `/clear` is free and `/compact` is not.

## The levers, roughly by payoff

**1. Clear between unrelated tasks.** The docs name two highest-impact habits, and this is one of them (the other is matching the model to the job, below). The reason is plain: stale context is taxed on every later message. Use `/rename` before clearing so you can find the session again with `/resume`.

**2. Push verbose work into a subagent.** A [subagent](/docs/subagents) reads in its own context window and hands back a summary. The official worked example: the subagent burned 6,100 tokens of file reads and returned 420 tokens to the main conversation.

**3. Shrink what loads on every session.** Three things load before you type anything, and all three are prunable:

- `CLAUDE.md`, which the docs suggest keeping under about 200 lines. Workflow instructions that only matter sometimes belong in a Skill, which loads on demand.
- Your Skill listing. Only each Skill's name and description are preloaded, roughly 100 tokens each, and the whole listing is budgeted at about 1% of the model's context window. Cheap, but not free, and it fills up.
- MCP servers. Tool definitions are deferred by default, so only names enter context until Claude actually uses a tool. Run `/mcp` to disable servers you are not using.

**4. Prefer a CLI over an MCP server.** This one surprises people. Official guidance: tools like `gh`, `aws`, `gcloud`, and `sentry-cli` are *more* context-efficient than the equivalent MCP server, because a CLI adds no per-tool listing at all. Claude can just run it.

**5. Right-size the model and the effort.** Sonnet handles most coding well and costs less than Opus; reserve Opus for hard architectural and multi-step reasoning. Pin `model: haiku` on simple subagents. Then lower the effort level with `/effort` when a task does not need depth, since thinking tokens bill as output tokens. See [The Claude Family](/docs/models).

**6. Filter output before Claude ever sees it.** A [hook](/docs/hooks) can cut a tool's output down on the way in. The example in the docs: instead of Claude reading a 10,000-line log to find the errors, a hook greps for `ERROR` and returns only the matching lines, turning tens of thousands of tokens into hundreds. The worked sample does it with a `PreToolUse` hook that rewrites the command itself to pipe through `grep`, since that event fires before the tool runs.

**7. Be specific, and plan first.** "Improve this codebase" triggers broad scanning. "Add input validation to the login function in `auth.ts`" does not. And plan mode before a big change is cheap insurance against paying twice for the wrong direction.

**8. Ask for shorter answers.** Output tokens are the expensive ones. Telling Claude the length and shape you want is a real lever, not a nicety. See the style controls in the [Prompting Playbook](/docs/prompting).

## Trim without losing the thread

When you want to free space but keep working, you have more than `/compact`:

- **`/rewind`** (or `Esc` `Esc` on an empty prompt) offers **Summarize from here** and **Summarize up to here**. Same idea as `/compact`, but targeted at the part of the conversation you actually want collapsed.
- **`/compact focus on the API changes`** steers what survives. You can also set a `# Compact instructions` section in `CLAUDE.md` so every compaction respects it.

Worth knowing what compaction costs you: your project-root `CLAUDE.md` and auto memory get re-injected from disk, but path-scoped rules and nested `CLAUDE.md` files are dropped until a matching file is read again, and re-injected skill bodies are capped. Auto-compaction, on by default, clears older tool outputs first and only summarizes the conversation if that is not enough.

## Your plan limits, accurately

On paid consumer plans, two windows stack:

- A **session limit** on a rolling five-hour window. Pro is the baseline; Max 5x and Max 20x give you five and twenty times more usage per session.
- A **weekly limit**. This one resets at a fixed time assigned to your account, the same time every week, no matter when you start using Claude.

Details that trip people up:

- **It is one pool across surfaces.** claude.ai, Claude Code, the desktop app, and the IDE extensions all draw from the same allowance.
- **Both windows burn at once.** One heavy burst can exhaust your weekly allowance well before the five-hour window resets.
- **Switching models does not reset anything.** The session and weekly windows are shared across models. The exception is the separate Opus limit: when you hit *that*, moving off Opus with `/model` keeps you working.
- **Run `/usage` to see the reset time.** It is an arbitrary clock time, not a tidy block boundary.
- **Watch your environment.** If `ANTHROPIC_API_KEY` is set, Claude Code can authenticate with it instead of your subscription, which means paying per token rather than drawing on the plan you already bought. Interactively you get asked to approve the key once, so read that prompt. In non-interactive mode (`-p`) the key is always used when present, with nothing to approve.

Anthropic does not publish the allowances as message or token counts, only as multipliers, so any specific number you see quoted is someone's estimate.

## The "send a hello first" trick, honestly

The tip going around says: session limits reset five hours after a chat starts, so send Claude a quick "hello" before you begin working and you are less likely to hit the limit.

The mechanic is roughly right, with one caveat: Anthropic documents the session limit as a rolling five-hour window and will tell you its reset time, but does not document what anchors the clock. The weekly limit is the one it explicitly describes as fixed regardless of when you start. Either way the conclusion is wrong, and it is worth understanding why.

- **It does not add allowance.** Consumption is what counts against your limit: message length, complexity, model, effort, tools. Opening a window grants you nothing. A "hello" buys zero extra capacity.
- **As written, it is a no-op.** If you say hello and then start working, your first real prompt would have opened the identical window seconds later.
- **The only real effect is phase-shifting.** Open a window hours early and the reset lands in the middle of your workday instead of at the end. That is a coherent thing to want, but it is a trade, not a win: you forfeit whatever you did not use in the early part of the window.
- **Done badly it costs you.** Poking a session at breakfast and returning at noon guarantees a cache miss, so your next message reprocesses the full context at full price.

Nothing in Anthropic's docs or support articles recommends this; it traces back to community posts. The supported version of the same instinct is real, though, and Anthropic's own support docs say it plainly: **plan intensive work sessions around your five-hour usage windows.** Run `/usage` to see when yours resets, then schedule around that. Same benefit, no folklore.

## When you genuinely need more

**Usage credits** let you keep going past a plan limit at standard API rates instead of being blocked. You turn them on in your account settings and can cap the monthly spend; `/usage-credits` opens the right page for your role. Your five-hour resets carry on exactly as before, because credits do not change the reset timing. **Usage bundles** are the prepaid version, buying those credits up front at a discount, and they only start applying once you are past your plan's limits.

Next: give Claude eyes on the running app with [Browser Automation and QA](/docs/browser-automation).

**Official links:** [Manage costs effectively](https://code.claude.com/docs/en/costs) · [Context window](https://code.claude.com/docs/en/context-window) · [Usage limit errors](https://code.claude.com/docs/en/errors) · [How usage and length limits work](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work) · [Usage limit best practices](https://support.claude.com/en/articles/9797557-usage-limit-best-practices) · [Manage usage credits](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans)

# The Claude Family

"Claude" is not one model. It is a family, from fast and affordable to deeply capable. Knowing which one to use is a real skill that saves you money and time. Here is the current lineup and how to choose.

## The 2026 lineup

| Model | Model ID | Context window | Speed | Best for |
|---|---|---|---|---|
| **Claude Fable 5.2** | `claude-fable-5-2` | 1M tokens | Moderate | Demanding reasoning and long-horizon agentic work |
| **Claude Opus 5.5** | `claude-opus-5-5` | 1M tokens | Moderate | Long-running agentic coding and knowledge work (the recommended default) |
| **Claude Sonnet 5.5** | `claude-sonnet-5-5` | 1M tokens | Fast | The everyday workhorse, best balance of speed and smarts |
| **Claude Haiku 5.5** | `claude-haiku-5-5` | 1M tokens | Fastest | High-volume, latency-sensitive tasks like classification, extraction, and routing |

All four have a 1M token context window and cap output at 128K tokens.

Older models stay available for a long while after they stop being current. **Fable 5.1**, **Sonnet 5**, and **Haiku 4.5** were the current lineup until autumn 2026 and are still fully supported, and you will meet older names like Opus 5 and Fable 5 in tutorials. The docs' advice is to default to the latest models where you can. If a tutorial names an older one, the prompting advice usually transfers, but check the API changes below before you swap the model ID.

## What changed with Opus 5.5

Opus 5.5 is cheaper than Opus 5 ($4 / $20 per million input / output tokens, against $5 / $25) and in Anthropic's testing on coding and knowledge-work evaluations it matches or beats Opus 5 at `high` effort while running at its own default of `medium`. Four things break if you swap the model ID in existing API code:

- **Thinking cannot be turned off.** `thinking: {"type": "disabled"}` and a manual `budget_tokens` both return a 400. Omit `thinking` and lower the effort instead.
- **Forced tool use is gone.** `tool_choice` of `any` or `tool` returns a 400. Use `auto`, say in the prompt when the tool applies, and add `strict: true` if you need schema-valid arguments.
- **Thinking blocks are tied to the model and the conversation.** Keep your history append-only: editing an earlier message, the system prompt, or the tools list invalidates the thinking blocks after it.
- **Computer use needs the newer toolset** on the Claude API and Google Cloud (`computer_toolset_20260801`).

Fable 5.2 behaves the same on the first two. Sonnet 5.5 also rejects forced tool use and `disabled` thinking, but at `high` effort or below it accepts `thinking: {"type": "between_tools"}` to skip the up-front thinking. The [migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide) has the before and after for each.

## What a "context window" means

A 1 million token context window means every current model can consider around 555,000 words at once: a large codebase, long documents, a big conversation.

That works out to a little over half a word per token, which is worth knowing because it affects your bill. Claude models from the 4.7 generation onward use a newer tokenizer, and the same text produces roughly **30% more tokens** on them than on earlier models. So the familiar rule of thumb that a token is about three quarters of a word only holds on older models like Haiku 4.5; on the current lineup, budget closer to half a word per token. Nothing is broken when a file you have been sending for months suddenly counts higher.

## How to pick, simply

Think of it as fastest and cheapest on one end, most capable on the other:

**Haiku 5.5 → Sonnet 5.5 → Opus 5.5 → Fable 5.2**

- **Haiku** for simple, speed-critical, high-volume work. "Classify this review as positive or negative."
- **Sonnet** for most day-to-day production work where you want near-top quality at a lower cost.
- **Opus** for complex, agentic, hard coding tasks. It is what the docs tell you to start with, and a safe default if you are unsure.
- **Fable** only when you genuinely need the extra reasoning muscle, like the most demanding problems or agents that run a long time. It costs more, so do not reach for it by habit.

## A note on pricing

Pricing is per million tokens, split into input (what you send) and output (what Claude generates). Output always costs more than input. The cheaper tiers cost dramatically less per token, which is exactly why matching the model to the task matters: running simple work on the biggest model is like renting a moving truck to carry a backpack.

Always check the [official pricing page](https://platform.claude.com/docs/en/about-claude/pricing) for current numbers, since they change.

## Track what you are spending

Inside Claude Code, **`/usage`** is the command (`/cost` is an alias for it, not a separate report). It shows the current session's token counts and, on a paid plan, how much of your limits you have used, broken down by subagents, skills, plugins, and MCP servers so you can see what is eating your budget.

The dollar figure is computed locally at standard list rates, so on a Pro or Max subscription it is a rough gauge rather than your bill. For the authoritative number, check the [Claude Console usage page](https://platform.claude.com/usage). You can also pin a live readout to your [status line](/docs/settings). The full set of levers lives in [Tokens, Limits and Usage](/docs/token-optimization).

## Adaptive thinking and effort

All four current models use adaptive thinking, on by default: the model itself decides whether and how much to reason on each step, based on how hard the task is. You do not micromanage that turn by turn. Fable 5.2 and Opus 5.5 always think and cannot have it turned off, so effort is the only dial. Haiku 5.5 can turn thinking off at `high` effort or below, which suits tiny classification calls.

What you *can* set is the overall **effort level**, which shifts the balance between speed and cost on one side and depth on the other. In Claude Code, run `/effort` (or use the slider inside `/model`):

- `low`, `medium`, `high`, `xhigh`, from fastest and cheapest to deepest. In Claude Code all four current models start at **`medium`**. On the API, Fable 5.2 and Sonnet 5.5 default to `high`, while Opus 5.5 and Haiku 5.5 default to `medium`, and at `medium` Opus 5.5 matches Opus 5 at `high` in Anthropic's testing. Try the default before you raise it.
- `max`, the deepest, for genuinely hard problems. It can overthink, so reach for it on purpose, not by default.
- `ultracode` is a Claude Code extra rather than a model setting: it sends `xhigh` *and* has Claude orchestrate multi-agent workflows on substantive tasks. Expect it to spend accordingly.
- `auto` puts it back to the model default.

The first four persist across sessions when you confirm with `Enter` (press `s` instead to apply one to this session only, v2.1.257 or later); `max` and `ultracode` reset when the session ends. Effort affects every kind of token, including tool calls, so a lower level means less exploring as well as less thinking. (Haiku 4.5 does not use effort; Haiku 5.5 supports every level.)

One upgrade trap: Claude Code now saves effort per model, so an older top-level `effortLevel` in your *user* settings does not carry over to Opus 5.5. It starts at `medium` until you pick a level for it with `/effort` or the `/model` picker. (A top-level `effortLevel` in project, local, or managed settings still applies to every model.)

### The one keyword that still matters: ultrathink

You may have seen advice to write "think", "think hard", or "think more" to make Claude reason more. That is now folklore, and the docs say so outright: those phrases are passed through as ordinary prompt text. The one keyword Claude Code actually recognizes is **`ultrathink`**: drop it anywhere in a prompt, or anywhere in a Skill's content, to ask for deeper reasoning on that turn. Under the hood it adds an in-context instruction and leaves the effort level sent to the API untouched, so your session setting is safe. For anything more lasting, use `/effort`.

Do not mix up the two similar-sounding names: `ultrathink` is a one-turn keyword you type in a prompt, `ultracode` is a session-wide effort setting.

## A few practical facts

- **Model IDs are fixed snapshots.** `claude-opus-5-5` points to one specific release, not an evergreen "latest." From the 4.6 generation onward the IDs simply stopped carrying a date, and they are still pinned. Older models kept the date, which is why Haiku 4.5 is `claude-haiku-4-5-20251001`; `claude-haiku-4-5` is a convenience alias that resolves to it. Use the exact string, because a typo returns an error.
- **In Claude Code** you switch models mid-session with `/model` and can set a default in [settings](/docs/settings). Out of the box, `default` is Opus 5.5 on Pro, Max, Ultra, Team, Enterprise, and the API from v2.1.280 (before that, Pro got Sonnet 5). Fable is never the default, and the newest models need a recent Claude Code: Sonnet 5.5 from v2.1.284, Haiku 5.5 from v2.1.293, Fable 5.2 from v2.1.321.
- **Availability.** The models are on the Claude API plus Amazon Bedrock, Claude Platform on AWS, Google Cloud, and Microsoft Foundry, though not every model reaches every provider at once (cloud providers sometimes prefix the IDs). The models overview says which is where.

## Pick the model as you open the tab

`/model` changes the model you are already talking to. The other way in is `--model`, which sets it as the session starts:

```bash
claude --model opus
```

It takes the same short aliases (`fable`, `opus`, `sonnet`, `haiku`) or a full model ID, and it overrides both the `model` setting and the `ANTHROPIC_MODEL` environment variable.

That matters more than it sounds, because the model is a per-task choice and tasks usually get their own terminal tab. A handful of shell aliases turns "which model do I want for this" into one word:

```bash
# ~/.zshrc or ~/.bashrc
alias fable='claude --model fable'
alias opus='claude --model opus'
alias sonnet='claude --model sonnet'
alias haiku='claude --model haiku'
```

Now scoped work reads the way you think about it: `sonnet` in a fresh tab to turn a dirty tree into a PR, `opus` in another for the architecture problem you actually care about. It is a small thing, but it removes a real decision point, and it pairs naturally with picking an effort level for the same reason: match the setting to the task, once, at the point you open the tab.

Next: build your own apps on top of these models with the [Claude API basics](/docs/api-basics).

**Official links:** [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) · [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) · [Model configuration in Claude Code](https://code.claude.com/docs/en/model-config) · [CLI reference](https://code.claude.com/docs/en/cli-reference)

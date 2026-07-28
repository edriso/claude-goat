# The Claude Family

"Claude" is not one model. It is a family, from fast and affordable to deeply capable. Knowing which one to use is a real skill that saves you money and time. Here is the current lineup and how to choose.

## The 2026 lineup

| Model | Model ID | Context window | Speed | Best for |
|---|---|---|---|---|
| **Claude Fable 5** | `claude-fable-5` | 1M tokens | Slower | The hardest reasoning and long-running autonomous agents |
| **Claude Opus 5** | `claude-opus-5` | 1M tokens | Moderate | Complex agentic coding and enterprise work (the recommended default) |
| **Claude Sonnet 5** | `claude-sonnet-5` | 1M tokens | Fast | The everyday workhorse, best balance of speed and smarts |
| **Claude Haiku 4.5** | `claude-haiku-4-5-20251001` | 200K tokens | Fastest | Simple, high-volume, latency-sensitive tasks |

All of these accept text and images and produce text, all are multilingual, and all three of the 1M models cap output at 128K tokens (Haiku at 64K).

Older models stay available for a long while after they stop being current. **Opus 4.8** (`claude-opus-4-8`) is the one you are most likely to still see referenced: it is now listed as legacy, but it still runs. If a tutorial names it, the advice usually transfers to Opus 5 unchanged.

## What a "context window" means

A 1 million token context window means the top three models can consider around 555,000 words at once: a large codebase, long documents, a big conversation. Haiku's 200K window works out to around 150,000 words, which is plenty for most everyday tasks.

If you compare those two numbers you will notice they imply different words-per-token. That is real, and it is worth knowing because it affects your bill. Claude models from Opus 4.7 onward use a newer tokenizer, and the same text produces roughly **30% more tokens** on them than on earlier models. So the familiar rule of thumb that a token is about three quarters of a word still holds on Haiku 4.5, but on Fable 5, Opus 5, and Sonnet 5 you should budget closer to half a word per token. Nothing is broken when a file you have been sending for months suddenly counts higher.

## How to pick, simply

Think of it as fastest and cheapest on one end, most capable on the other:

**Haiku 4.5 → Sonnet 5 → Opus 5 → Fable 5**

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

The current top models (Fable 5, Opus 5, Sonnet 5) use adaptive thinking: the model itself decides whether and how much to reason on each step, based on how hard the task is. You do not micromanage that turn by turn. Fable 5 always thinks and cannot have it turned off.

What you *can* set is the overall **effort level**, which shifts the balance between speed and cost on one side and depth on the other. In Claude Code, run `/effort` (or use the slider inside `/model`):

- `low`, `medium`, `high`, `xhigh`, from fastest and cheapest to deepest. `high` is the default and suits most coding.
- `max`, the deepest, for genuinely hard problems. It can overthink, so reach for it on purpose, not by default.
- `ultracode` is a Claude Code extra rather than a model setting: it sends `xhigh` *and* has Claude orchestrate multi-agent workflows on substantive tasks. Expect it to spend accordingly.
- `auto` puts it back to the model default.

The first four persist across sessions; `max` and `ultracode` reset when the session ends. Effort affects every kind of token, including tool calls, so a lower level means less exploring as well as less thinking. (Haiku does not use effort.)

### The one keyword that still matters: ultrathink

You may have seen advice to write "think", "think hard", or "think more" to make Claude reason more. That is now folklore, and the docs say so outright: those phrases are passed through as ordinary prompt text. The one keyword Claude Code actually recognizes is **`ultrathink`**: drop it anywhere in a prompt, or anywhere in a Skill's content, to ask for deeper reasoning on that turn. Under the hood it adds an in-context instruction and leaves the effort level sent to the API untouched, so your session setting is safe. For anything more lasting, use `/effort`.

Do not mix up the two similar-sounding names: `ultrathink` is a one-turn keyword you type in a prompt, `ultracode` is a session-wide effort setting.

## A few practical facts

- **Model IDs are fixed snapshots.** `claude-opus-5` points to one specific release, not an evergreen "latest." From the 4.6 generation onward the IDs simply stopped carrying a date, and they are still pinned. Older models kept the date, which is why Haiku 4.5 is `claude-haiku-4-5-20251001`; `claude-haiku-4-5` is a convenience alias that resolves to it. Use the exact string, because a typo returns an error.
- **In Claude Code** you switch models with `/model` and can set a default in [settings](/docs/settings).
- **Availability.** All four are on the Claude API, plus Amazon Bedrock, Claude Platform on AWS, Google Cloud, and Microsoft Foundry (cloud providers sometimes prefix the IDs).

Next: build your own apps on top of these models with the [Claude API basics](/docs/api-basics).

**Official links:** [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) · [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) · [Model configuration in Claude Code](https://code.claude.com/docs/en/model-config)

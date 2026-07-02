# The Claude Family

"Claude" is not one model. It is a family, from fast and affordable to deeply capable. Knowing which one to use is a real skill that saves you money and time. Here is the current lineup and how to choose.

## The 2026 lineup

| Model | Model ID | Context window | Speed | Best for |
|---|---|---|---|---|
| **Claude Fable 5** | `claude-fable-5` | 1M tokens | Slowest | The hardest reasoning and long-running autonomous agents |
| **Claude Opus 4.8** | `claude-opus-4-8` | 1M tokens | Moderate | Complex agentic coding and enterprise work (great default) |
| **Claude Sonnet 5** | `claude-sonnet-5` | 1M tokens | Fast | The everyday workhorse, best balance of speed and smarts |
| **Claude Haiku 4.5** | `claude-haiku-4-5` | 200K tokens | Fastest | Simple, high-volume, latency-sensitive tasks |

All of these accept text and images and produce text, and all are multilingual.

## What a "context window" means

A token is a chunk of text, roughly three quarters of a word in English. A 1 million token context window means the model can consider around 555,000 words at once: a large codebase, long documents, a big conversation. Haiku's 200K window is still around 150,000 words, which is plenty for most everyday tasks.

## How to pick, simply

Think of it as fastest and cheapest on one end, most capable on the other:

**Haiku 4.5 → Sonnet 5 → Opus 4.8 → Fable 5**

- **Haiku** for simple, speed-critical, high-volume work. "Classify this review as positive or negative."
- **Sonnet** for most day-to-day production work where you want near-top quality at a lower cost.
- **Opus** for complex, agentic, hard coding tasks. If you are unsure, this is a safe default.
- **Fable** only when you genuinely need the extra reasoning muscle, like the most demanding problems or agents that run a long time. It costs more, so do not reach for it by habit.

## A note on pricing

Pricing is per million tokens, split into input (what you send) and output (what Claude generates). Output always costs more than input. The cheaper tiers cost dramatically less per token, which is exactly why matching the model to the task matters: running simple work on the biggest model is like renting a moving truck to carry a backpack.

Always check the [official pricing page](https://docs.claude.com/en/docs/about-claude/pricing) for current numbers, since they change.

## Adaptive thinking

The current top models (Fable 5, Opus 4.8, Sonnet 5) use adaptive thinking: the model itself decides how much to "think" before answering, based on how hard the question is. You do not micromanage this. You can nudge it with an effort setting, and in Claude Code you can toggle thinking on or off.

## A few practical facts

- **Model IDs are fixed snapshots.** `claude-opus-4-8` points to one specific release, not an evergreen "latest." Use the exact string; a typo returns an error.
- **In Claude Code** you switch models with `/model` and can set a default in [settings](/docs/settings).
- **Availability.** All four are on the Claude API, plus AWS Bedrock, Google Vertex AI, and Microsoft Foundry (cloud providers sometimes prefix the IDs).

Next: build your own apps on top of these models with the [Claude API basics](/docs/api-basics).

**Official link:** [Models overview](https://docs.claude.com/en/docs/about-claude/models/overview)

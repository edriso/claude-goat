# Cost, Latency & Caching

You pay for every token in and every token out. That one sentence explains most LLM bills: the API is stateless, so each request resends the whole conversation, and a chat that grows to 50K tokens of history pays for those 50K tokens again on every single turn. Context discipline is not tidiness, it is money.

Exact per-model prices change, so we will not quote them here; check the [pricing page](https://platform.claude.com/docs/en/about-claude/pricing). The levers below do not change.

## Lever 1: Pick the smallest model that passes your evals

The biggest cost decision is the model name. Opus-tier models cost several times more per token than Haiku, and plenty of tasks (classification, extraction, routing, summarizing) do not need the extra intelligence.

The key word is *evals*. "Haiku feels fine" is a guess; "Haiku passes 96% of my test cases and Sonnet passes 97%" is a decision. Build a small eval set first ([Evaluating AI Output](/docs/evals)), then work down the [model family](/docs/models) until quality actually drops. A common pattern is mixing tiers: a big model for the hard reasoning step, a small one for everything around it.

## Lever 2: Prompt caching

If your requests share a big stable prefix (system prompt, tool definitions, a reference document), prompt caching is the single highest-leverage switch. You mark a breakpoint with `cache_control`, and the API caches everything up to it:

```json
"system": [
  {
    "type": "text",
    "text": "...large system prompt and reference docs...",
    "cache_control": {"type": "ephemeral"}
  }
]
```

How it works, per the official docs:

- **Cache reads are cheap.** Tokens served from cache cost 0.1x the base input price, a 90% saving on the cached portion. Writing the cache costs a premium (1.25x for the default cache, 2x for the long-lived one), so caching pays off from the second request on.
- **TTL.** Entries last 5 minutes by default, refreshed each time they are used. A 1 hour TTL is available for traffic with longer gaps.
- **It is a prefix match.** Content is cached in the order tools, then system, then messages, and any byte change invalidates everything after it. So keep stable content first and volatile content (timestamps, user questions) last. A `datetime.now()` interpolated into your system prompt silently kills the cache every request.
- **Mechanics.** Up to 4 breakpoints per request, and prompts below a per-model minimum length will not cache at all. Verify it is working by checking `cache_read_input_tokens` in the response `usage`; if it stays 0, something in your prefix is changing.

Claude Code does this for you automatically. For your own API apps, it is a few lines for a large discount on exactly the tokens you resend most.

## Lever 3: Batch processing for non-urgent work

The Message Batches API processes requests asynchronously at 50% of standard prices. Most batches finish within an hour, with a 24 hour ceiling. If nobody is waiting on the answer (nightly evals, backfills, bulk classification, report generation), running it as a batch halves the bill for zero engineering effort beyond submitting the batch and polling for results.

## Lever 4: Streaming for perceived latency

Streaming does not make generation faster, but it makes it *feel* faster: the first tokens appear immediately instead of after the full response is done. For anything user-facing, stream by default. For long outputs it is also the practical option, since large non-streaming responses can hit HTTP timeouts.

## Lever 5: Keep the context lean

Since you pay for the whole context on every turn, the cheapest token is the one you never send:

- **Start fresh sessions per task.** In Claude Code, `/clear` between unrelated tasks; a 200-message session drags its entire history into every request.
- **Use subagents for exploration.** A [subagent](/docs/subagents) can read thirty files and burn its own context doing it, returning only a short summary to the main conversation. The exploration tokens are paid once, not resent every subsequent turn.
- **Curate what goes in.** Beyond cost, the docs note that accuracy degrades as context grows (context rot). Trimming irrelevant material makes responses cheaper *and* better, which is a rare free lunch.

## The order to pull these levers

1. Measure first: response `usage` tells you exactly where tokens go.
2. Right-size the model against your evals.
3. Turn on prompt caching for any stable prefix.
4. Move non-urgent traffic to batches.
5. Stream everything user-facing, and keep sessions lean as a habit.

Next: [Prompt Injection & AI Security](/docs/ai-security)

**Official links:** [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) · [Streaming](https://platform.claude.com/docs/en/build-with-claude/streaming) · [Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows)

# Classify, Don't Generate

Most of the AI in an internal tool is not writing anything. It is deciding. Is this Slack message a bug report or a question? Is this pull request mergeable? Which of four queues does this ticket belong in? Should this invoice go to a human?

Every one of those has an answer from a fixed set. Getting it from a model that produces text one token at a time is the expensive way, and for a long time it was the only way that was easy to reach. That is changing, so it is worth knowing what the options actually are and how to tell the marketing from the mechanism.

## The cheap version you already have

Before reaching for anything new: [structured outputs](/docs/structured-outputs) with an `enum` already turns Claude into a classifier with a guaranteed-valid answer.

```typescript
const Triage = z.object({
  category: z.enum(["bug", "question", "feature_request", "spam"]),
})

const response = await client.messages.parse({
  model: "claude-haiku-4-5-20251001",
  max_tokens: 16,
  messages: [{ role: "user", content: `Classify this message:\n\n${text}` }],
  output_config: { format: zodOutputFormat(Triage) },
})
```

Three things make that cheap rather than just correct. A small model, because classification is the task Haiku is for. A tiny `max_tokens`, because the answer is a handful of tokens and you are billed for what comes out. And an enum, so you never spend a retry on an invalid label.

The mechanism underneath has a name worth knowing, because every vendor implements it and they all call it something different. Anthropic's docs describe strict tool use as constraining "the model's token sampling to schema-valid outputs (a technique called grammar-constrained sampling)". You will meet the same idea as constrained decoding, guided decoding, or logit masking. In every case the model still generates, but tokens that would break your schema are removed before it samples.

## Confidence is where this gets interesting

A label on its own is a weak thing to build on. What you usually want is "route it automatically if the model is sure, queue it for a human if it is not." That needs a number.

There are two ways to get one, and they are not equally good.

**Read the probability the model assigned.** This is the real version. OpenAI's cookbook is the canonical write-up: logprobs "provide a probability associated with each class prediction, enabling users to set classification or confidence thresholds", and their API exposes it as `top_logprobs`. There is research behind trusting it in this specific setup: Anthropic's own [Language Models (Mostly) Know What They Know](https://arxiv.org/abs/2207.05221) found that larger models are well calibrated "on diverse multiple choice and true/false questions when they are provided in the right format". Multiple choice is exactly the format you are in.

**Ask the model to state its confidence in the JSON.** This is what most people do, and it is the weaker one. A number the model wrote as text is a number it generated, not a number it measured. There is a whole research line on verbalized uncertainty ([Lin, Hilton and Evans](https://arxiv.org/abs/2205.14334)) and its defining feature is that it works "without use of model logits", which tells you it is a different quantity from the first option.

Which matters here for a practical reason: **the Claude Messages API does not expose logprobs.** There is no `logprobs` or `top_logprobs` parameter. So on Claude today, the self-reported number is what you get, and you should treat it as a hint rather than a probability. If you need a calibrated score, you need something that gives you one.

## A different shape: models that only decide

[TypeSafe AI](https://typesafe.ai/) came out of stealth in September 2026 with a $40M seed and a model called **Jev**, named after William Stanley Jevons. They call the category "System One models", after Kahneman. Their own one-line framing:

> "Think of Jev as a frontier-intelligence function call: unstructured state in, typed probabilistic decisions out."

It takes natural-language input like an LLM and returns typed decisions with probabilities instead of text. Their docs are blunt about the trade: System One models "do not write replies, produce code, or generate explanations of their reasoning". Strings are not an allowed output type at all.

There are exactly three primitives:

| Primitive | What it returns |
| --- | --- |
| **Choice** | One item from an unordered set, plus the full probability distribution and a confidence scalar. Up to 255 options. |
| **Score** | A position along ordered levels you define. It can land between two of them, so it is a float, not an integer. |
| **Noul** | A 0 to 1 number for a yes/no judgment. You pick the threshold. It has no separate confidence, because it is one. |

Two structural properties matter more than the primitives:

**One call, many questions.** A request is one `state` plus a map of named questions, and "every question is evaluated in parallel and in isolation against the same state in one go". Adding questions barely moves the response time. There is no conversation, no history, nothing to rot.

**Calibration is the actual product.** Their training method is named for it (RLCD, Reinforcement Learning for Calibrated Decisions), and they define the goal honestly: "Outcomes assigned a probability of 0.2 should occur about 20% of the time." Then immediately: "These rates describe groups of predictions, not a guarantee about any single answer."

As published in September 2026, and the docs warn these move without notice: $42 per billion input tokens with output tokens free, 70ms to 500ms end to end. It is waitlist-only early access, there are Python and JavaScript SDKs, and it is not on OpenRouter, so you cannot try it casually.

## Read the claims carefully

This is a good product with a marketing layer, and separating them is the actual skill.

**"It can't hallucinate" means "it can't emit an out-of-schema value."** That is a type guarantee, not a correctness guarantee. A commenter on Hacker News made the point and the CEO agreed with it directly: "that's right, but because these models are probabilistic, it's also possible to be confidently wrong." The Register put it the same way. And note that a constrained LLM gets you the identical type guarantee, so this is not the differentiator.

**The speed comparison needs a fair baseline.** "70 to 500ms versus 3 to 329 seconds" compares a single typed decision against an LLM generating a full response. Constrain the LLM to one enum token with a small model and the gap narrows a lot. The honest version of what Jev buys is cost and latency at scale, not a capability you could not otherwise reach.

**On their own benchmark it is not the most accurate.** They publish [workflow evals](https://evals.typesafe.ai/) and Jev tops out around 76% accuracy while the frontier models on the same tasks reach 78 to 79%. It wins by two to three orders of magnitude on cost and one to two on latency. "Comparable accuracy, dramatically cheaper" is the true claim, and it is a good one. "As smart as frontier models" is not.

Credit where it is due: they publish their own caveats, including that their ground truth is the average of two frontier models (which biases toward those models), that the evals were built by their own team, and that the 0% hallucination figure "is not empirical" but derived from the schema guarantee. They also [refuse to publish standard benchmarks](https://typesafe.ai/blog/antibenchmaxxing) on principle and tell users to build their own evals, which is either refreshing or unfalsifiable depending on your mood. Their best page is the one titled ["Jev 1.13 jaggedness"](https://docs.typesafe.ai/model-jaggedness/jev-1.13), which lists eight documented failure modes including that it is "not a calculator", does not count reliably, reads dates as text rather than ordered quantities, loses accuracy as the state grows, and does not treat state as hostile by default. Every vendor should ship that page.

## The baseline nobody runs

Here is the most useful thing in this whole page, and it costs nothing.

Somebody ran an [independent head to head](https://github.com/sypherin/jev-trace-classifier) on 653 pages, classifying them as agent-written or human-written. Jev got 69.8% accuracy. A generative model got 30.1%. And the trivial baseline that always guesses the majority class got **77.6%**, beating both. The author's conclusion was that no decision threshold separates the classes, because the text does not carry the signal.

> **Compute the majority-class baseline before you compare models.** If your classes are 80/20, a model at 78% accuracy is worse than a constant.

Once you have that number, the ladder of options is well studied:

- **A fine-tuned small model beats zero-shot prompting.** Bucher and Martini tested this against GPT-4 and Claude and found fine-tuned small models "consistently and significantly outperform larger, zero-shot prompted models in text classification". The practical threshold is low: performance starts saturating around **200 labelled examples**.
- **The cost crossover is low too.** Wang, Qu and Ye put it at **150 to 200 samples**, after which zero-shot prompting costs more than having fine-tuned. Training their BERT model on 200 samples took three and a half minutes, and inference ran at about 10ms per sample.
- **Encoders never stopped being the right tool.** The ModernBERT team put it well: you can press a generative model into service for classification, "but while this workflow is great for prototyping, you don't want to pay prototype prices once you're in mass production." The controlled comparison is [Ettin](https://arxiv.org/abs/2507.11412), which trained encoders and decoders on identical data: a 150M encoder beat a 400M decoder on classification.
- **Sometimes it is not machine learning at all.** Google's Rules of Machine Learning opens with "Rule #1: Don't be afraid to launch a product without machine learning." TF-IDF and a linear model still win on plenty of text problems, and they run in microseconds.

## How to choose

| Situation | Reach for |
| --- | --- |
| A handful of calls, no labelled data, shipping today | Claude with an enum and structured outputs |
| You need a calibrated probability, not a guess | A model that exposes one, or a fine-tuned classifier |
| Millions of calls, latency in the loop | A small fine-tuned encoder, or a System One model if you can get access |
| You have 200+ labelled examples | Fine-tune something small. This is the crossover. |
| The classes are wildly imbalanced | Compute the majority-class baseline first, then decide whether to build anything |
| The decision needs an explanation a human reads | A generative model. This is the one job the typed models explicitly do not do. |

The paradigm shift worth taking seriously is not any one vendor. It is that "call an LLM" stopped being the only way to put judgment in a program, and the cheapest correct answer is now usually smaller than the one you reached for first.

Next: [RAG & Embeddings](/docs/rag-embeddings)

**Official links:** [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) · [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use) · [Using logprobs for classification (OpenAI cookbook)](https://developers.openai.com/cookbook/examples/using_logprobs) · [Rules of Machine Learning (Google)](https://developers.google.com/machine-learning/guides/rules-of-ml)

**Other links:** [TypeSafe AI docs](https://docs.typesafe.ai/) · [System One concepts](https://docs.typesafe.ai/concepts/system-one) · [Jev jaggedness](https://docs.typesafe.ai/model-jaggedness/jev-1.13) · [ModernBERT](https://huggingface.co/blog/modernbert) · [Language Models (Mostly) Know What They Know](https://arxiv.org/abs/2207.05221)

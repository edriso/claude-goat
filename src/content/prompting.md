# Prompting Playbook

Better prompts are the highest-leverage skill you can build. The same model gives wildly different results depending on how you ask. Good news: the techniques are simple and you can start today.

## The golden rule

> Show your prompt to a colleague with almost no context and ask them to follow it. If they would be confused, so will Claude.

Think of Claude as a brilliant new hire who does not know your codebase, your conventions, or your goals. Almost every technique below is really about supplying that missing context.

## 1. Be clear and direct

Say exactly what you want, including the format and any constraints. If you want ambitious work, ask for it. Do not expect Claude to infer it.

- Weak: "Create an analytics dashboard."
- Strong: "Create an analytics dashboard. Include as many relevant features and interactions as you can. Go beyond the basics into a fully featured implementation."

Also: tell Claude to *act*, not to *suggest*. "Can you suggest changes?" may give you only suggestions. "Change this function to improve performance" makes the edit.

## 2. Say what to do, not what to avoid

Prohibitions leave Claude guessing at what you actually want. Point at the behavior you want instead.

- Weak: "Do not use markdown in your response."
- Strong: "Write your response as smoothly flowing prose paragraphs."

A related trick from the official guide: Claude tends to mirror the style of your prompt. If the output format keeps drifting, make your prompt look like the output you want. A prompt full of bullet points invites bullet points back.

## 3. Explain the why

Giving the reason helps Claude generalize to your true goal.

- Weak: "Never use ellipses."
- Strong: "This text will be read aloud by a text-to-speech engine, so never use ellipses, because it cannot pronounce them."

## 4. Give examples

Examples are one of the most reliable ways to steer output. Aim for three to five. Make them relevant to your real use case, diverse enough to cover edge cases, and clearly separated (wrapping each in tags like `<example>` helps).

## 5. Let Claude think

For anything with real reasoning, coding, or math, give Claude room to work through it. With today's models you can simply say "think this through carefully" and ask it to check its own answer before finishing: "Before you finish, verify your solution against these criteria."

## 6. Structure longer prompts

When a prompt mixes instructions, context, and input, label the parts so nothing gets confused:

```text
<instructions>
Summarize the document for a non-technical reader.
</instructions>

<document>
...the actual text...
</document>
```

For long documents, put the document near the top and your question at the end. On big inputs this alone can noticeably improve quality.

## 7. Give a role

One sentence in the system prompt focuses tone and behavior: "You are a senior backend engineer who values simple, well-tested code."

## 8. Make Claude look before it answers

Hallucinated claims about code usually come from answering without reading. The official fix is to demand investigation up front. Adapted from the best practices page:

```text
Never speculate about code you have not opened. If I reference a specific file, read it
before answering. Investigate the relevant files before answering questions about the
codebase.
```

One rule like this in your system prompt or CLAUDE.md turns confident guesses into grounded answers.

## 9. Chain prompts when you want checkpoints

Older prompting guides said to chop every big task into small sequential prompts. Current models handle most multistep reasoning internally, so chain for control, not capability: when you want to inspect intermediate output, or when a fixed pipeline matters.

The chaining pattern that pays off most is self-correction: one call produces a draft, the next reviews that draft against your criteria, a third refines it based on the review. Each step is a separate call, so you can log, evaluate, or branch at any point. If that sounds like [spec-driven development](/docs/spec-driven), it is the same idea: checkpoints where steering is cheap.

## 10. Iterate against a real test

Prompting is a loop, not a one-shot. Write a draft, see the result, refine. If a result is off, the fix is usually more context or a clearer instruction, not magic words.

The upgrade on that habit: decide what "good" means before you start tuning. The official guide assumes you have success criteria and a way to test against them before you touch a prompt. That can be as light as a scratch file with ten example inputs and the outputs you expect, rerun after each change. Without it, you are guessing whether an edit helped. When you outgrow the scratch file, the Console has an evaluation tool built for exactly this.

## Two modern gotchas

- **Do not over-pressure.** Old prompts leaned on "CRITICAL, YOU MUST." Newer models over-react to that. Normal, clear phrasing works better.
- **Watch for over-engineering.** Newer models sometimes add abstractions you did not ask for. If you see that, add: "Avoid over-engineering. Only make changes I asked for or that are clearly necessary."

## Let the Console draft it for you

The Claude Console ships three prompt tools worth knowing:

- **Prompt generator.** Describe your task and it drafts a quality first prompt using Anthropic's own best practices. The cure for the blank page problem.
- **Templates and variables.** Mark the parts of a prompt that change per request with placeholders in `{{double brackets}}`. You get one stable template you can version, test, and reuse, instead of a pile of near-duplicate prompts.
- **Prompt improver.** Feed it an existing prompt and it rewrites it in four steps: extract your examples, restructure with XML tags, add chain-of-thought instructions, then upgrade the examples to match. Expect more thorough but longer and slower outputs, so skip it for latency-sensitive prompts.

## Steal working prompts

You do not have to write everything from scratch:

- The [Claude Code prompt library](https://code.claude.com/docs/en/prompt-library) collects copy-paste prompts for real development work, tagged by phase (discover, design, build, ship, operate), task, and role. They are starting points rather than scripts, and each has a "Why this works" note on the pattern behind it.
- The [general prompt library](https://platform.claude.com/docs/en/resources/prompt-library/library) has ready-made prompts for common non-coding tasks.
- The best practices page opens with model-specific guides for Fable 5, Sonnet 5, and Opus 4.8. When you settle on a model, read its page; it covers exactly where that model behaves differently.

One last shift worth knowing: for agent work, what Claude can see and verify matters more than any phrasing trick. That layer, context and checks and workflow, is what the rest of this section teaches.

Next: put these into a real [developer workflow](/docs/workflows).

**Official links:** [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) · [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) · [Console prompting tools](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-tools) · [Claude Code prompt library](https://code.claude.com/docs/en/prompt-library)

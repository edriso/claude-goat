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

## 2. Explain the why

Giving the reason helps Claude generalize to your true goal.

- Weak: "Never use ellipses."
- Strong: "This text will be read aloud by a text-to-speech engine, so never use ellipses, because it cannot pronounce them."

## 3. Give examples

Examples are one of the most reliable ways to steer output. Aim for three to five. Make them relevant to your real use case, diverse enough to cover edge cases, and clearly separated (wrapping each in tags like `<example>` helps).

## 4. Let Claude think

For anything with real reasoning, coding, or math, give Claude room to work through it. With today's models you can simply say "think this through carefully" and ask it to check its own answer before finishing: "Before you finish, verify your solution against these criteria."

## 5. Structure longer prompts

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

## 6. Give a role

One sentence in the system prompt focuses tone and behavior: "You are a senior backend engineer who values simple, well-tested code."

## 7. Iterate

Prompting is a loop, not a one-shot. Write a draft, see the result, refine. If a result is off, the fix is usually more context or a clearer instruction, not magic words.

## Two modern gotchas

- **Do not over-pressure.** Old prompts leaned on "CRITICAL, YOU MUST." Newer models over-react to that. Normal, clear phrasing works better.
- **Watch for over-engineering.** Newer models sometimes add abstractions you did not ask for. If you see that, add: "Avoid over-engineering. Only make changes I asked for or that are clearly necessary."

Next: put these into a real [developer workflow](/docs/workflows).

**Official links:** [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) · [Best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

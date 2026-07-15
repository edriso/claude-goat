# Spec-Driven Development

You already know the core loop (explore, plan, code, commit) and the habit of pinning a spec before big features. Spec-driven development turns those ideas into a repeatable pipeline. It is the community's current best answer to a real problem: AI helps you ship a lot more code, and without structure, a chunk of it is slop you spend next week cleaning up.

One note before we start: this page describes community practice, not an official Anthropic feature. The ideas are worth knowing either way.

## The idea

Hand a whole ticket to one long session and you get a single context window trying to research, decide, and build all at once. Quality drops as the window fills, and your first real review moment is a giant diff at the end, exactly where steering is most expensive.

Spec-driven development splits the work into phases. Each phase runs in a fresh context window, and each writes a short markdown artifact that becomes the input to the next:

1. **Research**: what is true about the codebase right now. Files, flows, patterns, constraints. Facts only.
2. **Plan**: what will change and in what order, based on that research.
3. **Implement**: a fresh session reads the plan and builds it, step by step.

Because the artifacts live on disk instead of in the chat, they survive `/clear`, can be reviewed like a PR, shared with teammates, and handed to any fresh session. And you steer at the cheap points: fixing a wrong sentence in a plan costs seconds, fixing the two thousand lines built from it costs days.

## Lessons from the field

The best-known version is **Research, Plan, Implement (RPI)** from HumanLayer, whose open-source prompts spread from small startups to enterprises. A year of heavy use surfaced real problems, which Dex Horthy lays out in the talk [Everything We Got Wrong About Research-Plan-Implement](https://youtu.be/YwZR6tc7qYg). The lessons transfer to any version of this workflow, including your own:

- **Keep research free of opinions.** If you tell the research step what you plan to build, you get opinions back instead of facts. Ask what is true ("how do endpoints work, trace everything that touches billing") and save the deciding for the plan.
- **Mind the instruction budget.** Their original planning prompt held about 85 instructions, and models silently skipped steps. A model reliably follows only a limited number of instructions at once, so several small, focused prompts beat one mega-prompt. Their fix was splitting three phases into seven smaller ones (a flow they call CRISPY) covering questions, research, design, structure, plan, implementation, and the PR.
- **Review the short artifacts and the code, skip the long plans.** A thousand-line plan is about as much reading as the thousand lines of code it produces, so reviewing both doubles your work. The leverage is in the 200-line design doc, where a wrong direction is cheap to fix, and in the final code, which you still read. The fix for slop is not reading less.
- **Plan vertically, not horizontally.** Models love layer-by-layer plans (all the database, then all the services, then all the UI), which give you nothing testable until the very end. Ask for vertical slices instead, each ending at a working, testable checkpoint.
- **No magic words.** If a workflow only behaves when you remember to type "work back and forth with me before writing the plan," the workflow is broken. Make each step its own explicit prompt instead of hoping the model infers it.

The honest goal is two to three times faster with quality intact, not ten times faster with slop you rewrite in six months.

## Try it in Claude Code, the light way

You do not need a framework. The primitives are built in:

- **Phases:** plan mode for the research and planning, then implement. You know this from [Developer Workflows](/docs/workflows).
- **Artifacts:** have Claude write the research and the plan to files (`research.md`, `plan.md`). `/clear`, then point the next session at the file: "Read plan.md and implement phase 1."
- **Handoff docs:** when a long session has to pause, ask for "a handoff doc for a fresh session: what we are doing, decisions made, what is next." Then `/clear` and start the new session by reading it. You control exactly what survives, instead of trusting a compaction summary.
- **Skills:** once a phase works well for your repo, codify it as a [skill](/docs/skills-intro) or slash command, like a `/research` that knows where your docs and entry points live. Tune it on a few tickets, then share it with your team.

## Off-the-shelf toolkits

Three open-source options if you want structure without building it yourself:

- **[Spec Kit](https://github.com/github/spec-kit)** from GitHub: a CLI plus templates for a spec, plan, tasks, implement flow. Works with Claude Code and many other agents.
- **[Superpowers](https://github.com/obra/superpowers)** by Jesse Vincent: a Claude Code plugin that enforces brainstorm, spec, plan, then test-driven implementation.
- **[HumanLayer's write-up](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents)**: the thinking behind RPI in essay form, with links to their prompts.

The tradeoff is real. These add steps, they can feel slow and verbose on small tasks, and they are generic by design, which means opinions that may not fit your repo. A good path: try one on a big ticket, keep the pieces that help, and fold those into your own skills.

## When to skip it

Most tasks do not need a pipeline. A one-sentence fix is still a one-sentence prompt. The judgment worth building: run small things straight, use plan mode for medium things, and save the full research, plan, implement treatment for large or unfamiliar work where a wrong direction is expensive. Your goal as the engineer is to bypass the steps you do not need, not to push every ticket through all of them.

Next: scale up with [Working in Parallel](/docs/parallel).

**Official links:** [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Best practices](https://code.claude.com/docs/en/best-practices)

**Community links:** [Everything We Got Wrong About RPI (talk)](https://youtu.be/YwZR6tc7qYg) · [Spec Kit](https://github.com/github/spec-kit) · [Superpowers](https://github.com/obra/superpowers) · [HumanLayer ACE-FCA](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents)

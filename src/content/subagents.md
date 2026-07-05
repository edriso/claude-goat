# Subagents

Here is a problem you will hit fast: Claude has a limited context window (its working memory), and its quality drops as that window fills up. A single "go investigate how our auth works" can read dozens of files and flood your conversation with noise you will never look at again.

Subagents solve this.

## What a subagent is

A subagent is a specialized assistant that runs in its **own separate context window**, with its own instructions, its own tool permissions, and its own model. Claude hands it a task, the subagent does the messy work in its own space, and only a short summary comes back to your main conversation.

Your main context stays clean. The subagent did the reading; you got the answer.

## When to reach for one

- The task produces a lot of output you will not need to keep (searching, reading logs, running a big test suite).
- You want to restrict what a helper can do (a review agent that can read but never write).
- The work is self-contained and can be summarized.
- You want to route cheaper work to a faster, cheaper model like Haiku.

Stay in the main conversation instead when the work needs tight back-and-forth, or is a quick one-line change.

## The built-in ones

Claude Code ships with a few it uses automatically:

- **Explore** does fast, read-only codebase search.
- **Plan** does read-only research during planning mode.
- **general-purpose** has full tools for complex, multi-step work.

By default these inherit your session's model; a custom agent can pin its own (see below).

You can also invoke them yourself: "Use subagents to investigate how token refresh works." Claude can even run several at once and merge their results, one of the [parallel patterns](/docs/parallel).

## Creating your own

The guided way is to run `/agents` and follow the prompts. Under the hood, a subagent is just a markdown file with some frontmatter. Save it in `.claude/agents/` (shared with your team) or `~/.claude/agents/` (just you).

```markdown
---
name: code-reviewer
description: Expert code reviewer. Use right after writing or changing code.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a senior code reviewer. Run git diff, focus on the changed files,
and report issues grouped as Critical, Warning, and Suggestion, each with a
specific fix. Only flag correctness and requirement gaps, not style nitpicks.
```

The two required fields are `name` and `description`. The `description` is important: it is how Claude decides when to delegate to this agent, so write it clearly. The body of the file becomes the agent's system prompt (its personality and rules).

## How you trigger them

- **Automatically.** Claude reads each description and delegates when a task fits.
- **By name.** "Use the code-reviewer subagent on my changes."
- **For a whole session.** `claude --agent code-reviewer` runs everything as that agent.

## A mental model

Think of subagents as teammates with job descriptions. You would not ask your database expert to also design the logo. You give focused people focused work, and you get focused results without everyone talking over each other in the main room.

Next: connect Claude to your other tools with [MCP](/docs/mcp).

**Official link:** [Subagents](https://code.claude.com/docs/en/sub-agents)

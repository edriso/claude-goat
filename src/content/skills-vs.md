# Skills vs Everything

Claude Code gives you several ways to extend and customize it, and at first they blur together. Skills, subagents, MCP, hooks, slash commands. This page makes the differences click, so you always know which tool to reach for.

## The one-line version

| Tool | What it is | Reach for it when |
|---|---|---|
| **CLAUDE.md** | Always-on project context and rules | You want Claude to always know your conventions |
| **Skills** | On-demand know-how for specific tasks | A recurring task should be done a specific way |
| **Subagents** | A helper in its own context window | Work is noisy or needs isolation and its own tools |
| **MCP** | A bridge to external systems | Claude needs to read or act on outside data and tools |
| **Hooks** | Automatic scripts at fixed moments | Something must happen every time, guaranteed |
| **Slash commands** | Shortcuts you type | You want to trigger something on demand |

## How to think about each

**CLAUDE.md is the always-loaded briefing.** It is read at the start of every session and is best for rules that apply broadly: build commands, style, gotchas. Keep it lean or Claude starts ignoring it.

**Skills are just-in-time expertise.** Unlike `CLAUDE.md`, a Skill only loads when a task matches its description. This is why you can have many Skills without bloating context. Use them for "when I do X, do it this way" knowledge.

**Subagents are about context, not knowledge.** Their superpower is running in a separate context window with their own tools and permissions, then returning a summary. Use them when a task would flood your main conversation with noise, or when you want a read-only helper.

**MCP is about reach.** It connects Claude to systems outside your codebase: databases, issue trackers, design files, your APIs. Skills and subagents work inside Claude's world; MCP extends that world outward.

**Hooks are about guarantees.** Everything above is instructions Claude chooses to follow. A hook is a script that *always* runs at a set moment. When "usually" is not good enough, you want a hook.

## They combine

These are not competing. The best setups use several together:

- A **Skill** encodes how your team writes API endpoints.
- A **hook** runs your linter after every edit, no matter what.
- An **MCP** server lets Claude read the ticket describing the endpoint.
- A **subagent** reviews the finished diff in its own clean context.
- `CLAUDE.md` ties it together with your project's core rules.

## A quick decision guide

- Should this apply to *every* session? Put it in **CLAUDE.md**.
- Is it know-how for a *specific kind of task*? Make a **Skill**.
- Does it need *outside data or systems*? Add an **MCP** server.
- Is the work *noisy or best isolated*? Use a **subagent**.
- Must it happen *every single time, guaranteed*? Write a **hook**.

Get comfortable with this map and you will always know where to put a new piece of behavior. Next up, meet the [Claude model family](/docs/models).

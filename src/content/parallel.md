# Working in Parallel

By default, Claude Code is one conversation doing one task at a time. For most work, that is exactly right, and you should not talk yourself out of it. But when tasks are independent, or you want Claude to keep going while you step away, you can scale up.

Here are the ways, from light to heavy. The skill is not using the fanciest one. It is reaching for the lightest pattern that fits the job.

## Fan out with subagents

You have met [subagents](/docs/subagents): helpers that each run in their own context window and report a summary back. The thing to know here is that Claude can run **several at once** and merge the results. Ask it to "research these five competitors," and it can spin up one per competitor in parallel instead of plodding through them one at a time.

They report to the main conversation, not to each other (a hub and spokes), so the main agent stitches the findings together. A handy version of this is a **builder and reviewer chain**: one subagent writes the code, another reviews it, giving you a quality check without doing the reviewing yourself.

Best for independent, read-heavy work that splits cleanly into pieces.

## Run parallel sessions with worktrees

When you have several independent changes going at once (a new feature, a bug fix, a design experiment), run them side by side, each in its own isolated copy of the repo. Claude Code has this built in:

```text
claude --worktree new-onboarding
```

(`-w` for short.) That creates a **git worktree**, a separate working copy on its own branch, and drops you into a session there. Nothing you do in one worktree touches another, so their contexts never collide. Close the session and Claude cleans up after itself: if nothing changed it removes the worktree automatically; if there is work worth keeping, it asks first.

You are the coordinator here, deciding when each task is done and merging it back. Use this for tasks that do **not** depend on each other. If they do, keep them in one session.

## Agent teams (experimental)

Subagents cannot talk to each other. When they genuinely need to, say a front-end and a back-end change that must stay in sync, there is a newer pattern: **agent teams**. Each teammate is a full Claude session, and they coordinate through a shared task list and can message one another, not just report to a lead.

It is powerful, and it is a lot. Agent teams are an experimental research preview, and they can burn several times the tokens of a single session (around 7x when teammates are planning). Turn it on with an environment variable in `settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Then ask for a team explicitly in your prompt; Claude will not form one on its own. Honestly, most work never needs this. Reach for it only when a task truly requires agents to collaborate, not just to churn out more output faster.

## Headless: Claude without you

Everything above still has you in the terminal. Headless mode takes you out of the loop entirely:

```text
claude -p "generate today's report and save it to report.md"
```

The `-p` (print) flag runs one prompt and exits: no chat, no approvals. On its own it is great for scripts and CI. It gets genuinely powerful when you **schedule** it, wire it to cron (or your OS task scheduler) to run each morning, and the report is waiting before you open your laptop.

Because nobody is watching each step, use headless where the output is **easy to verify**, and put guardrails on it: restrict what it can touch with `--allowedTools`, and lean on your deny rules and [permission settings](/docs/settings). Do not point an unattended run at anything hard to undo.

## Loops: let it keep going until it is done

A loop is just headless work repeated: Claude does a pass, checks itself, and goes again. What makes a loop safe is not the loop, it is the **check**. Give it something that returns pass or fail (a test suite, a build, a linter) and it will iterate toward green on its own, instead of stopping at "looks done."

Claude Code has a built-in `/loop` for running a prompt on a repeat, handy for polling ("check the build every few minutes and tell me what broke"). For work that should run while your machine is off, on a schedule or overnight, there are scheduled cloud agents that run on Anthropic's side and report back.

You may also hear about the **Ralph loop**, a community trick that runs `claude` in a shell `while` loop, re-feeding one prompt and keeping the plan in a file on disk so each pass starts with a fresh context. People have shipped real projects with it, but it is advanced and easy to misfire: without tight scoping, a solid pass/fail check, and a sandbox, it can loop forever or burn through tokens unnoticed. Treat it as a power-user experiment, not a starting point, and reach for the built-in `/loop` and scheduled agents first.

## Which one do I use?

- **One conversation** for almost everything.
- **Worktrees** when you have independent tasks to run at the same time.
- **Subagent fan-out** when a single task splits into independent, read-heavy pieces.
- **Agent teams** only when agents must actually coordinate, and you accept the cost.
- **Headless** when you want it to run on a schedule or unattended, on easy-to-check work.
- **A loop** when the work has a clear pass/fail check and should repeat until it is green.

More agents is not more progress. It still has to be the *right* work. Pick the lightest pattern that does the job.

Next: give Claude eyes on the running app with [Browser Automation and QA](/docs/browser-automation).

**Official links:** [Subagents](https://code.claude.com/docs/en/sub-agents) · [Worktrees](https://code.claude.com/docs/en/worktrees) · [Agent teams](https://code.claude.com/docs/en/agent-teams) · [Headless](https://code.claude.com/docs/en/headless)

# Developer Workflows

Knowing the tools is one thing. Weaving them into a smooth daily rhythm is what actually makes you fast. This page is the practical playbook.

## The master skill: manage context

Claude has a limited context window, and its quality drops as that window fills with old messages, file reads, and command output. Almost every habit below exists to protect that context. Treat it as your scarcest resource.

**Clear vs. compact.** Two commands keep the window healthy, and picking the right one matters:

- **`/clear`** wipes the conversation and starts fresh. Your `CLAUDE.md` and memory reload automatically, so Claude keeps your project context but forgets the chat. Reach for it when you switch to an *unrelated* task.
- **`/compact`** keeps you in the same task but replaces the long back-and-forth with a summary, freeing up room. Use it when one piece of work is running long and the window is filling. You can steer the summary: `/compact focus on the API changes and the files we edited`.

Rule of thumb: **new task, `/clear`; same task getting long, `/compact`.**

**Auto-compact** is the safety net. As the window approaches full, Claude compacts on its own so the session keeps going. It works, but a summary you trigger yourself with focus instructions is usually cleaner than one made under pressure, so compact proactively before a big new stretch of work rather than waiting for it to kick in.

**The handoff doc** is the community's manual alternative to compacting. Before ending a long session, ask Claude to "write a handoff doc for a fresh session: what we are working on, decisions made, what is next." Then `/clear` and have the new session read that file first. Unlike a compaction summary, you can read and edit exactly what survives.

**See what is filling the window** with `/context`. It draws a live breakdown by category (system prompt, memory files, tools and MCP servers, files you have read, the conversation) so you can spot what is eating your budget and trim it.

## Give Claude a way to check its own work

This is the single highest-leverage habit. Left alone, Claude stops when work "looks done." If you give it something that returns pass or fail, a test suite, a build, a linter, a screenshot to compare, it will iterate until the check passes, instead of you being the one who keeps finding the bugs.

- Weak: "Write a function that validates emails."
- Strong: "Write a validateEmail function. Test cases: user@example.com is valid, 'invalid' is not, user@.com is not. Run the tests after implementing and fix any failures."

Ask Claude to show evidence: the test output, the command it ran. Not just "done." For new features, test-first (red then green) works especially well: have Claude write the tests, watch them fail, then implement until they pass.

## The core loop: explore, plan, code, commit

1. **Explore** in plan mode. "Read `/src/auth` and explain how sessions and login work." No changes yet.
2. **Plan.** "I want to add Google login. What files change, and what is the flow? Make a plan." Press `Ctrl+G` to edit the plan yourself.
3. **Code.** Leave plan mode. "Implement your plan. Write tests for the callback, run the suite, fix failures."
4. **Commit.** "Commit with a clear message and open a PR."

Skip the plan for one-sentence changes. Use it whenever the approach is uncertain or the change spans several files.

## For big or fuzzy features, pin the spec first

When a task is large or the requirements are hazy, do not let Claude start guessing. Turn it around and have it interview you: "Before writing any code, ask me the questions you need answered to build this well." Answer them, then have Claude write the agreed approach into a short spec (a plan file, or a scratch `SPEC.md`).

Two payoffs: you catch misunderstandings while they are still free to fix, and you end up with a clean, self-contained brief. Hand that spec to a fresh session to implement, and it starts with exactly what it needs and none of the back-and-forth clutter. This habit scales into a full methodology, [spec-driven development](/docs/spec-driven), covered two pages ahead.

## Be specific in your prompts

The more precise your instruction, the fewer corrections you make later.

- Scope it: "Write a test for foo.py covering the logged-out case. Avoid mocks."
- Point to a pattern: "Look at how HotDogWidget.php works and follow that pattern."
- Describe the symptom: "Login fails after session timeout. Check `src/auth`, especially token refresh. Write a failing test that reproduces it, then fix it."

Feed it rich context: reference files with `@`, paste screenshots, give URLs, or pipe data in with `cat error.log | claude`.

## Debug the root cause

Give Claude the actual error text and tell it what you want: "The build fails with this error: [paste]. Fix the root cause, do not just suppress it, and verify the build passes." For visual bugs, paste a screenshot and ask it to reproduce, fix, screenshot the result, and compare.

## Manage the session actively

- **Course-correct early.** Press `Esc` to stop Claude mid-action. Tight, quick feedback beats one giant prompt.
- **`/clear` between unrelated tasks** so old context does not bleed in.
- **The two-correction rule.** If you have corrected Claude twice on the same thing, the context is polluted. `/clear` and restart with a sharper prompt that includes what you just learned. A clean session with a good prompt beats a long messy one.
- **Use subagents for investigation.** "Use subagents to explore how token refresh works" keeps the noise out of your main window.
- **Review with fresh eyes.** A new session, or `/code-review`, reviews code better than the session that wrote it. Tell reviewers to flag only correctness and requirement gaps, so you do not drown in style nitpicks.

## Scaling beyond one conversation

When tasks are independent, or you want Claude to keep working while you step away, you can run several Claudes at once or let one run unattended. That toolkit is covered in [Working in Parallel](/docs/parallel).

Get these habits into your fingers and the tools stop feeling like tools. They feel like leverage. Next: turn the spec habit into a repeatable pipeline with [Spec-Driven Development](/docs/spec-driven).

**Official link:** [Best practices](https://code.claude.com/docs/en/best-practices)

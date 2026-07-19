# AI Code Review

Claude is genuinely good at finding bugs. The catch is that most people ask the wrong Claude: the session that just wrote the code. This page covers how to get reviews you can actually trust.

## Fresh eyes beat the author

The session that wrote the code is a bad reviewer of it. Its context is full of the reasoning that produced the change, so it evaluates the code against its own intentions instead of on the code's own terms. The official best practices page is blunt about it: "a fresh context improves code review since Claude won't be biased toward code it just wrote."

So separate the roles. Have one session (or subagent) write, and a second session with clean context review. The reviewer sees only the diff and the criteria you give it, which is exactly what a good human reviewer sees.

A simple Writer/Reviewer loop:

1. Session A implements the feature.
2. Session B: "Review the rate limiter in @src/middleware/rateLimiter.ts. Look for edge cases, race conditions, and consistency with our existing middleware patterns."
3. Feed B's findings back to A to fix.

## The built-in review commands

Claude Code ships review skills that already do the fresh-context part for you:

- **`/code-review`** reviews the current diff for correctness bugs and for reuse, simplification, and efficiency cleanups. It runs in a fresh subagent and returns findings to your session. Pass `--fix` to apply findings to your working tree, `--comment` to post them as inline GitHub PR comments, or an effort level (`low` through `max`, or `ultra` for a deep multi-agent cloud review). You can also point it at a PR: `/code-review high 1234`.
- **`/security-review`** checks the diff for security vulnerabilities. Run it before shipping anything that touches auth, user input, or secrets.
- **`/review`** gives a fast single-pass, read-only review of a GitHub pull request.

## Give the reviewer a rubric

"Review this code" invites vague opinions. A rubric turns the review into checkable questions. Something like:

```text
Review this diff against these criteria:
1. Correctness: does the code do what the PR description says? Trace the logic, do not skim it.
2. Security: injection, authz gaps, secrets in code, unsafe handling of user input.
3. Performance: N+1 queries, unnecessary allocations in hot paths, missing indexes.
4. Tests: do the tests cover the edge cases this change introduces? Name any missing case.

For each finding, cite the file and line, explain the failure scenario, and rate your
confidence. Report only findings that affect correctness or the stated requirements,
not style preferences.
```

Two details matter here. Ask for evidence (file, line, failure scenario), because a claim the reviewer can point to is far more likely to be real than a general impression. And scope what counts as a finding: the official docs warn that a reviewer prompted to find gaps will usually report some even when the work is sound, and chasing every finding leads to over-engineering.

## Reviewing PRs with gh

Install the `gh` CLI and Claude knows how to use it: fetching PR diffs, reading comments, and posting reviews. From any session you can say "use gh to fetch PR 482, review the diff against our CLAUDE.md conventions, and draft review comments." For team-wide automation, [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions) responds to `@claude` mentions on PRs and issues, and [GitHub Code Review](https://code.claude.com/docs/en/code-review) posts reviews automatically on every PR with no trigger.

## Findings are leads, not verdicts

Treat every AI finding the way you would treat a static analyzer warning: a lead to verify, not a conclusion. Before acting on one, reproduce it. Ask Claude to write a failing test that demonstrates the bug, or trace the failure path yourself. A finding that cannot be turned into a failing test or a concrete failure scenario is probably noise. This filter is cheap, and it is what keeps an AI review from flooding your PR with plausible-sounding non-issues.

## Where humans still matter

AI review is strongest on mechanical correctness: logic errors, missed edge cases, known vulnerability patterns. Keep a human in the loop for the things a diff cannot show. Whether this is the right change to make at all, whether the design will age well, whether the tradeoffs match your product's priorities, and final sign-off on anything security-critical or irreversible. The practical split: let Claude do the first pass and catch the mechanical issues, so human review time goes to judgment instead of typo-hunting.

Next: [Evaluating AI Output](/docs/evals)

**Official links:** [Commands reference](https://code.claude.com/docs/en/commands) · [Best practices](https://code.claude.com/docs/en/best-practices) · [GitHub Actions](https://code.claude.com/docs/en/github-actions)

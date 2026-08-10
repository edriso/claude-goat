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

## Do not be a meat proxy

There is one failure mode that undoes everything on this page: running a review
and pasting the output straight into the pull request without reading it.

Niklas Gruhn named this in [a post on 3 August 2026](https://gruhn.me/blog/2026-08-03/)
that [Simon Willison](https://simonwillison.net/2026/Aug/3/dont-be-a-meat-proxy/)
picked up the same day. A **meat proxy** is a person who relays model output
verbatim: a human delivery layer between a model and another human. The problem
is not that AI was involved. It is that nothing was added, and the cost moved.
Generating a page takes seconds and reading one takes minutes, so you saved five
minutes of yours and spent fifteen of somebody else's, on text that is confident,
long, and wrong in a couple of places you have not marked.

Willison's rule is the fix, and it is worth memorizing: **read it, understand it,
validate it, then write the response in your own words.** Writing it yourself is
not politeness. It is the evidence that you did the first three.

The same post makes a second point that is easy to miss, and it is aimed at
authors rather than reviewers:

> Shipping *some* code can be done with close to zero effort now: Copy/paste the
> ticket description into Claude Code. Don't look at the code or read what Claude
> has written. If there's any feedback from reviewers, copy/paste that into Claude
> Code as well. If necessary, iterate.
>
> That works. But who has done the implementation? **The reviewers did, using
> Claude Code, and you as a meat proxy.**

That is the harder one to catch in yourself, because it does not feel like
relaying anything. It feels like shipping. The tell: if you cannot answer a
question about your own diff without going back to the model, then the review is
not a second opinion on your work, it is the work, and you have moved it onto
somebody else.

The research says the filtering step is most of the work. Crupi, Tufano and
Bavota compared ChatGPT review comments against 447 real human comments across
179 pull requests. The model reproduced only 10% of the human comments (23%
counting partial matches) while generating **2.4 times more comments overall**.
About 40% of the extra ones were judged meaningful, so it genuinely finds things
people miss. The authors' conclusion is explicit: use it as an additional check,
not as a replacement and not as a way to save review time, "since human reviewers
would still need to perform their manual inspection".
([paper](https://arxiv.org/abs/2602.11925))

Read that ratio again. More than half of the extra findings are not worth
sending. Somebody has to be the filter, and if it is not you it is the author.

So, three rules that follow from it:

1. **Never auto-post.** If you write a PR review skill, "do not post comments" is
   a requirement of the skill, not a preference. Have it hand findings to you.
2. **Aim the review at intent, not nitpicks.** Point it at the linked issue and
   ask what the diff does that the issue did not ask for, or does not do that it
   did. Style belongs in a linter, and mechanical checks belong in CI.
3. **Send a change instead of a comment where you can.** GitHub put
   [stacked pull requests](https://github.blog/changelog/2026-07-30-stacked-pull-requests-are-now-in-public-preview/)
   into public preview on 30 July 2026, free on every repository
   (`gh extension install github/gh-stack`). If Claude found a fix you believe
   in, a two line PR stacked on top of theirs costs you a minute and the author
   nothing, which beats holding a merge for a day over feedback.

## Where humans still matter

AI review is strongest on mechanical correctness: logic errors, missed edge cases, known vulnerability patterns. Keep a human in the loop for the things a diff cannot show. Whether this is the right change to make at all, whether the design will age well, whether the tradeoffs match your product's priorities, and final sign-off on anything security-critical or irreversible. The practical split: let Claude do the first pass and catch the mechanical issues, so human review time goes to judgment instead of typo-hunting.

Next: [Cross-Agent Review](/docs/cross-agent-review)

**Official links:** [Commands reference](https://code.claude.com/docs/en/commands) · [Best practices](https://code.claude.com/docs/en/best-practices) · [GitHub Actions](https://code.claude.com/docs/en/github-actions)

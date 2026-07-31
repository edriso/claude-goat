# Cross-Agent Review

[AI Code Review](/docs/ai-code-review) makes the case for a fresh session reviewing the diff instead of the session that wrote it. This page takes that one step further: a review by a different model entirely, usually OpenAI's Codex reviewing what Claude just wrote.

It is worth doing, but not for the reason most posts give.

## Why a different model helps

A fresh Claude session fixes the context problem. It does not fix the priors. If the model misread the spec, a second instance of the same model tends to misread it the same way, because the assumption that caused the bug is the same assumption it reviews with.

A different model brings different habits. The best public evidence is a 2026 study by Greptile, which ran 500 Claude-authored and 500 Codex-authored pull requests past both models:

| Reviewer | Recall on Claude-authored PRs | Recall on Codex-authored PRs |
| --- | --- | --- |
| Claude Opus | 53.7% | 62.0% |
| GPT-5.5 | 60.0% | 50.5% |

Each model found more bugs in the other model's code than in its own kind. The suggested reason is that the bugs a model writes are the bugs it is worst at seeing.

Worth knowing before you lean on that table: Greptile sells code review, the study is self-described as experimental, and it has had very little outside scrutiny. Treat it as the best available evidence rather than a settled result. This is a community finding, not official guidance from either vendor.

## The claim to be skeptical of

You will read that Codex is simply the better reviewer and Claude the better implementer. The measurements do not support it.

Factory.ai's code review benchmark ran 13 models against 50 real pull requests with human-curated bugs. GPT-5.2 placed first, Claude Opus 4.6 placed second with the highest recall of any model tested, and the Codex-branded model placed sixth, below both Claude models.

Most of the "Codex is better" sentiment traces to one widely shared blog post from September 2025 that reported no metrics and reviewed a Claude product that has since been replaced, plus a six-week stretch of real Claude Code degradation that Anthropic confirmed and fixed in April 2026.

So the reason to run a second model is decorrelation, not vendor ranking. The rule that holds up: whoever wrote the code should not be the one to sign off on it. If Codex writes the patch, have Claude review it.

## Calibrate before you start

Independent benchmarks put current AI review precision somewhere in the 15 to 40 percent band. SWR-Bench, which used 1,000 manually verified pull requests, found the best setup reached about 17 percent precision and 23 percent recall.

More than half of what any reviewer tells you will be noise. That does not make it useless, it makes verification mandatory. The [findings are leads, not verdicts](/docs/ai-code-review) rule applies with more force here, not less, because a second opinion feels more authoritative than it is.

Agreement between two models is not proof either. In one study, more than 80 agents, including reviewers specifically prompted to be adversarial, all endorsed a vulnerability that did not exist.

## Setting up Codex

```bash
npm i -g @openai/codex
codex login          # browser sign-in, included with ChatGPT paid plans
codex login status
```

`codex doctor` checks auth, sandbox, and git in one shot when something misbehaves.

Then review a diff. Three targets, all non-interactive:

```bash
codex review --uncommitted     # staged, unstaged, and untracked
codex review --base main       # everything the branch would merge
codex review --commit <sha>    # one commit
```

`--base` compares against the merge base, so it reviews what would actually land rather than commits that arrived on main since you branched.

Findings come back worst-first, as `[P1] Title - path/to/file.js:12`, where P0 is a release blocker and P3 is low impact. It prints `No findings.` when it has nothing, and it is told not to invent findings to fill space, so an empty result is a real result.

## Three things that surprised me

**A custom prompt cannot be combined with the target flags.** `codex review --base main "focus on X"` fails with an argument conflict, even though `--help` prints a usage line that suggests it works. It is a known issue. Use `codex exec` when you want both:

```bash
git diff main...HEAD | codex exec -s read-only "Review the diff on stdin. Focus on race conditions."
```

**Piping the diff is much cheaper than letting Codex explore.** On the same change, letting the agent browse the repo itself cost about 27k tokens. Piping the diff in cost about 2.5k for a comparable review.

**`codex review` is not sandboxed read-only in a trusted repo.** It runs `workspace-write` with approvals off. The read-only behavior comes from the review agent's instructions, not from the sandbox, which is a prompt rather than a guarantee. For anything unattended, force it:

```bash
codex review --uncommitted -c sandbox_mode='"read-only"'
```

## Give it your project rules

Codex reads `AGENTS.md` and never `CLAUDE.md`. Its review agent is literally instructed to read `AGENTS.md` first, so in a repo that only has `CLAUDE.md` that step finds nothing and the review runs blind to every convention you wrote down.

Fix that before you judge the results. See [AGENTS.md & Other Agents](/docs/agents-md), and watch the 32 KB truncation limit on the way through.

## Staying inside Claude Code

OpenAI publishes a Claude Code plugin, which is easier than wiring this up yourself:

```text
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
/codex:setup
```

It adds `/codex:review` and `/codex:adversarial-review`, which argues with design choices rather than only hunting defects. There is an optional review gate that blocks Claude from ending a turn until Codex approves. OpenAI's own warning is worth repeating: it can loop between the two agents and burn through usage limits, so only turn it on while you are watching.

## When it is worth it

Not on everything. A typo fix does not need two models, and on a small diff the noise costs more than the coverage buys.

Use it where a missed bug is expensive: payments, migrations, auth, and any pull request big enough that you stopped reading carefully.

One structural caveat. Research in Nature Machine Intelligence found that above roughly a 45 percent single-agent baseline, adding more agents produces little or negative gain, and that uncoordinated agents amplify errors far more than agents whose findings get reconciled by one arbiter. Practically: run the second reviewer, then have one agent or one human reconcile the output. Do not staple two reports together and call it coverage.

Next: [Evaluating AI Output](/docs/evals)

**Official links:** [Codex CLI](https://developers.openai.com/codex/cli/) · [Claude Code review](https://code.claude.com/docs/en/code-review) · [codex-plugin-cc](https://github.com/openai/codex-plugin-cc)

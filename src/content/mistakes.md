# Common Mistakes

Everyone hits these when they start working with AI coding tools. Reading them once will save you a lot of frustration. Each comes with the fix.

## 1. Vague prompts

"Build me an app" gives you a generic guess. Add context, constraints, examples, and the specific outcome you want. Remember the golden rule: if a new colleague would be confused by your request, so is Claude.

## 2. The kitchen-sink session

Piling unrelated tasks into one long conversation fills the context with noise, and quality drops. **Fix:** run `/clear` between unrelated tasks to start fresh.

## 3. Correcting the same thing over and over

Each failed correction adds more clutter to the context, making things worse, not better. **Fix:** after two corrections on the same issue, stop. `/clear` and write a new, sharper prompt that includes what you just learned. A clean start beats fighting a polluted session.

## 4. A bloated CLAUDE.md, or too many tools

It feels like more rules and more Skills should help. The opposite happens: a model reliably follows only a limited number of instructions at once, so every rule you add dilutes the others, and important ones get lost in the noise. **Fix:** prune ruthlessly. For every line ask, "would removing this cause a mistake?" If not, cut it.

## 5. Trusting without verifying

Plausible-looking code that misses edge cases is the classic AI trap. **Fix:** always give Claude a way to check its work (tests, a build, a script, a screenshot). If you cannot verify it, do not ship it.

## 6. Infinite exploration

An unscoped "go investigate this" can read hundreds of files and burn your whole context. **Fix:** scope the request narrowly, or delegate it to a subagent that explores in its own context and reports back.

## 7. Shipping code you do not understand

If you cannot explain, debug, or maintain the code, you do not really own it. **Fix:** read what Claude produces. Ask it *why* it made a choice. Use it as a knowledgeable draft, not a black box you rubber-stamp.

## 8. Skipping tests and review

AI makes mistakes, and untested AI code reaches production just as easily as untested human code. **Fix:** keep tests and a review step (human or a fresh Claude session) in the loop.

## 9. Ignoring security

AI can suggest insecure patterns: injection risks, weak auth, secrets in the wrong place. And skipping permission prompts entirely (`--dangerously-skip-permissions`) on your real machine invites disaster. **Fix:** review for these, use `/security-review` on your changes, and go fast the safe way with [allow and deny rules](/docs/settings).

## 10. Treating the first output as final

The first answer is a draft. Missing an easy improvement because you accepted it too soon is a quiet, common mistake. **Fix:** iterate. It is a draft. Refine it.

## 11. Walking away from a session that can act without asking

This is the one people learn the hard way. You are tired, the task is boring, so you flip on auto-accept and check your phone for a few minutes. You come back to committed changes you did not review and a `git reset` you did not ask for, and now you are awake.

Two things make it worse than it sounds. The permission mode is only half of what decides your blast radius: the other half is your **allow list**, so if you have allowed `Bash(git:*)` to stop the prompts, then commits, resets, and checkouts are all inside what "auto" can do unattended. And a mode you cycled with `Shift+Tab` yesterday can still be on today, because `defaultMode` in settings persists.

**Fix:** match the mode to whether you are actually watching.

- **Watching, and reviewing each diff:** default mode is fine, and auto-accept is fine for a tight loop on code you are reading as it lands.
- **Not watching:** stop the session, or move it to a [sandbox or worktree](/docs/parallel) where a mistake costs nothing.
- **Thinking, not building yet:** plan mode. It cannot write anything, so it is the one mode that is safe to leave running while you do something else, and it is cheaper too.
- **Any repo you would be sad to lose:** keep git out of the allow list and approve those calls by hand. It is a two-second cost on the rare call that matters.

The deeper version of the fix is not a setting at all. If you want a step to happen every time regardless of what Claude decides, a [hook](/docs/hooks) enforces it and an instruction does not. And if you want a key that cannot be used while you are away from your desk, that is a hardware-backed SSH key, which is outside this guide but worth looking up.

## 12. Shipping the scaffolding

The model narrates itself while it works, and the narration lands in your diff. Comments that restate the line under them. Comments pointing at a Figma frame, a ticket, or a pull request that merged six weeks ago. Guards that guard a guard, like `if (x.items && x.items.length && x.items.length > 0)` where `if (x.items?.length)` says the same thing.

Each one looks harmless on its own, which is exactly why they survive review. They are not harmless. A comment pointing somewhere else is a promise the code cannot keep, and it costs the next reader a click to learn nothing. A redundant check is a claim about your data, and a false one: it tells the reader that `items` might be a non-array with a length, so they go and check, and it never was.

There is a measurement behind the feeling. GitClear tracked 623 million code changes across 2023 to 2026 and found duplicated blocks up 81%, error-masking constructs up 47%, and refactoring line-moves down 70% against the 2022 baseline ([report](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)). The individual figures will move. The direction is the point: generated code is additive. It writes the new thing and rarely deletes the old one, and nothing else in your pipeline deletes it either unless a person decides to.

**Fix:** two halves, and the second one matters more.

- **Aim at an outcome in CLAUDE.md, not a ban.** "Never write comments" competes with everything else in the context and loses at the worst moment. "Match the comment density and idiom of the surrounding code" gives the model a target it can actually hit. This is the same lesson Anthropic learned in their own system prompt, described in [Context Engineering](/docs/context-engineering).
- **Clean up before the pull request, not during review.** A cleanup that only ever happens at review time is a cleanup you chose to run at the most expensive moment. `/code-review --fix` applies findings to your working tree, and its quality-only sibling `/simplify` handles reuse and simplification without hunting for bugs. Run either before you push, and your reviewer gets to spend their attention on the change instead of the packaging.

## The meta-lesson

Use Claude as a collaborative partner, not an autopilot. Stay engaged, always keep a check it can run against, and manage your context deliberately. Do that and you get all the speed without the sloppiness.

You have now covered the essentials. Next up: the AI Engineering section, starting with [AI Code Review](/docs/ai-code-review). Or head to the [free courses](/docs/courses) to go deeper, and grab the [cheat sheet](/docs/cheatsheet) to keep handy.

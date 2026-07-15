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

## The meta-lesson

Use Claude as a collaborative partner, not an autopilot. Stay engaged, always keep a check it can run against, and manage your context deliberately. Do that and you get all the speed without the sloppiness.

You have now covered the essentials. Head to the [free courses](/docs/courses) to go deeper, or grab the [cheat sheet](/docs/cheatsheet) to keep handy.

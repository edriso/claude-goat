# Context Engineering for Claude 5

Your prompt is only a slice of what Claude actually reads. The rest gets assembled for you: the system prompt, your `CLAUDE.md` files, Skills, memory, tool descriptions, and every file you referenced. Shaping that layer is *context engineering*, and unlike a prompt it applies across every request, so you are writing it without knowing what the next question will be.

For the Claude 5 generation, the advice on how to write it reversed direction. In July 2026 Anthropic published the number behind that: they removed **over 80% of Claude Code's system prompt** for models like Opus 5 and Fable 5, with no measurable loss on their coding evaluations.

Read that twice. The improvement did not come from a better prompt. It came from less prompt.

## Why less works better now

The old prompts were full of hard rules written to prevent worst cases. Each was sensible on its own. Arriving together in one request, they contradicted each other, and Claude spent reasoning reconciling them instead of solving your problem.

Anthropic's own example comes from reading transcripts of their internal usage. In a single request they would see conflicting messages like "leave documentation as appropriate" and "DO NOT add comments", because the system prompt, the Skills, and the user's actual request all clash. Something has to lose.

Their comment rule used to read:

> In code: default to writing no comments. Never write multi-paragraph docstrings or multi-line comment blocks ...

It now reads:

> Write code that reads like the surrounding code: match its comment density, naming, and idiom.

The second is shorter *and* correct in more situations, because it points at a goal instead of banning a behavior. Older models needed the ban, and you accepted that it would be wrong sometimes. Newer models can hit the goal. That is the entire shift, and everything below follows from it.

## The six reversals

| Then | Now |
|---|---|
| Give Claude rules | Let Claude use judgement |
| Give Claude examples | Design interfaces |
| Put it all upfront | Use progressive disclosure |
| Repeat yourself | Simple tool descriptions |
| Memory in `CLAUDE.md` | Auto-memory |
| Simple specs | Rich references |

**Rules to judgement.** Prefer describing the outcome you want over enumerating prohibitions. See the comment example above.

**Examples to interfaces.** This one is narrower than it looks. The retired rule was specifically about tool usage: the old number one rule was to show Claude examples of how to use your tools. Examples pin the model to the space they demonstrate, so design the tool to be expressive instead. Anthropic's illustration is a todo tool whose `status` field is simply an enum of `pending`, `in_progress`, and `completed`. The shape of the parameter is what hints at how to use it, and the instruction about keeping one item in progress is what defines the behavior they wanted. Examples for *output style and format* are still good practice, in prompts and in Skills.

**Upfront to progressive disclosure.** Anthropic moved verification and code review out of the system prompt into Skills that load only when relevant, and made some tools deferred, so their definitions cost nothing until Claude searches for them. The myth being retired is that a `CLAUDE.md` or `SKILL.md` must be an exhaustive repository of everything, because Claude would otherwise never find it. Build a tree of files that load at the right time instead.

**Repetition to simple tool descriptions.** Instructions about a tool belong in that tool's description, once. Not in the description *and* the system prompt.

**`CLAUDE.md` as memory to auto-memory.** The old advice was to press `#` to append facts to your `CLAUDE.md`. Claude now writes its own [memory files](/docs/claude-md) as it works, so the two jobs separate cleanly: `CLAUDE.md` is the rules you author, memory is the notes Claude keeps.

**Simple specs to rich references.** A plan does not have to be a markdown file. Claude can work from an HTML artifact, a detailed test suite, a function in another codebase to port, or a rubric that encodes your taste. Prefer references that are *code*, because code is unambiguous and Claude reads it fluently. An HTML mockup of a design will generally beat either a written description of it or a screenshot.

## What to change in your own files

**`CLAUDE.md`:** briefly say what the repo is for, then spend most of your tokens on gotchas. The counterintuitive test is whether Claude could work it out by looking around. Directory layouts, dependency lists, and architecture overviews are all derivable, so they are costing you context for nothing. Pitfalls, rationale, and conventions that differ from tool defaults are not derivable. Keep those.

**Skills:** treat them as lightweight guides to help Claude find information when it needs it, not as fences. Split long ones into several files. They earn their keep when they encode opinions, knowledge, or practices specific to you, your team, or your product.

**References:** `@` mention the real artifact rather than describing it.

## Let `/doctor` do the first pass

Anthropic shipped this guidance as a command. Run `/doctor` (alias `/checkup`) in a session and it audits your setup, then reports findings and asks before changing anything:

- Trims checked-in `CLAUDE.md` files by cutting content Claude could derive from the codebase, and migrates the always-loaded guidance that survives into Skills and nested `CLAUDE.md` files that load on demand.
- Deduplicates local `CLAUDE.md` files against checked-in ones.
- Finds unused Skills, MCP servers, and plugins weighed against what they cost you in context, and flags slow hooks.
- Checks installation health: duplicate installs, `PATH` problems, unparseable settings files, and whether a newer version is out.

The `CLAUDE.md` trim needs Claude Code v2.1.206 or later. Note the two forms are not the same: `claude doctor` from your shell prints read-only installation diagnostics without starting a session, while the in-session `/doctor` is the full checkup that can apply fixes.

## Where the old rules still earn their keep

"Judgement over rules" is not "delete your guardrails."

- **Fragile, must-be-exact operations still want exact instructions.** Anthropic's Skill authoring guide frames this as a robot on a path: a narrow bridge with cliffs on both sides needs specific guardrails, an open field needs only a direction. Database migrations are a bridge. Code review is a field. Match the specificity to the cost of getting it wrong.
- **Smaller models need more.** The same guide is blunt that what works for Opus may need more detail for Haiku, so test your Skills against every model you actually run them on.
- **If it must happen every single time, do not write it as an instruction at all.** A [hook](/docs/hooks) or a [setting](/docs/settings) is enforced. A sentence is interpreted. That distinction did not change.

Next: put this into practice in a real [developer workflow](/docs/workflows).

**Official links:** [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) · [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) · [Memory](https://code.claude.com/docs/en/memory) · [Commands reference](https://code.claude.com/docs/en/commands)

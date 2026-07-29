# Writing Skills That Work

A Skill that never triggers is dead weight. A Skill that triggers and then gets half-followed is worse, because you now trust it. [Building one](/docs/skills-build) is easy. This page is the craft part: the decisions that separate a Skill Claude actually follows from a folder of good intentions.

Everything here comes from Anthropic's official authoring guide, in the order you will actually need it.

## Assume Claude is already smart

The context window is shared. Your Skill competes with the system prompt, the conversation so far, every other Skill's description, and the actual request. So only write down what Claude does not already know.

Three questions to run over every paragraph:

- Does Claude really need this explanation?
- Can I assume Claude knows this?
- Does this paragraph justify its token cost?

Too verbose (roughly 150 tokens, and most of it is filler):

```text
PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. There are many libraries available, but pdfplumber is
recommended because it's easy to use and handles most cases well. First,
you'll need to install it using pip. Then you can use the code below...
```

Concise (roughly 50 tokens, and it says everything that matters):

````text
## Extract PDF text

Use pdfplumber for text extraction:

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

The short version assumes Claude knows what a PDF is and how `pip` works. It does.

## Match freedom to fragility

This is the single most useful idea in the guide, and the one most people skip. How specific your instructions should be depends entirely on how badly things break when Claude improvises.

Picture Claude as a robot walking a path:

- **A narrow bridge with cliffs on both sides.** One safe way forward. Give exact commands and guardrails.
- **An open field with no hazards.** Many routes work. Give a direction and let Claude pick.

That maps to three levels:

| Level | What you write | Use when |
|---|---|---|
| **High freedom** | Prose instructions | Multiple approaches are valid, decisions depend on context |
| **Medium freedom** | Pseudocode, or a script with parameters | A preferred pattern exists but variation is fine |
| **Low freedom** | An exact script, few or no parameters | The operation is fragile, or the sequence must not change |

High freedom, because a good review depends on what the code is:

```text
## Code review process

1. Analyze the code structure and organization
2. Check for potential bugs or edge cases
3. Suggest improvements for readability and maintainability
4. Verify adherence to project conventions
```

Low freedom, because a half-run migration is a very bad day:

````text
## Database migration

Run exactly this script:

```bash
python scripts/migrate.py --verify --backup
```

Do not modify the command or add additional flags.
````

Getting this backwards is the classic failure. Locking down a code review makes it shallow. Leaving a migration open-ended makes it dangerous.

## Turn multi-step work into a checklist

For anything with more than a few steps, give Claude a checklist it can copy into its response and tick off as it goes. It keeps Claude from quietly skipping the boring validation step, and it lets you see where things are.

````text
## PDF form filling workflow

Copy this checklist and check off items as you complete them:

```
Task Progress:
- [ ] Step 1: Analyze the form (run analyze_form.py)
- [ ] Step 2: Create field mapping (edit fields.json)
- [ ] Step 3: Validate mapping (run validate_fields.py)
- [ ] Step 4: Fill the form (run fill_form.py)
- [ ] Step 5: Verify output (run verify_output.py)
```

**Step 1: Analyze the form**

Run: `python scripts/analyze_form.py input.pdf`

...

**Step 5: Verify output**

Run: `python scripts/verify_output.py output.pdf`

If verification fails, return to Step 2.
````

That last line is doing real work. Note the pattern applies to writing and analysis too, not just code: read sources, find themes, cross-reference claims, summarize, verify citations.

## Add a feedback loop

The highest-leverage structure in a Skill is: **run the validator, fix what it says, run it again**.

With code, the validator is a script:

```text
1. Make your edits to `word/document.xml`
2. Validate immediately: `python ooxml/scripts/validate.py unpacked_dir/`
3. If validation fails:
   - Review the error message carefully
   - Fix the issues in the XML
   - Run validation again
4. Only proceed when validation passes
5. Rebuild: `python ooxml/scripts/pack.py unpacked_dir/ output.docx`
```

Without code, the validator is a document. Point at `STYLE_GUIDE.md`, list the checks, and tell Claude to loop until they all pass before finalizing. Same shape, no scripts required.

## Patterns worth stealing

**Template pattern.** Give the output format, and be explicit about how strict it is. For an API response shape, say "ALWAYS use this exact template structure." For a report, say "here is a sensible default format, but use your best judgment" and let Claude adapt the sections. Both are valid; just pick on purpose.

**Examples pattern.** When quality depends on style and tone, show input and output pairs, exactly like you would in a normal prompt. Three commit-message examples teach the house format better than any amount of describing it.

**Conditional workflow.** Route Claude at the decision point instead of dumping every branch on it:

```text
1. Determine the modification type:

   **Creating new content?** -> Follow "Creation workflow" below
   **Editing existing content?** -> Follow "Editing workflow" below
```

If a branch grows large, push it into its own file and tell Claude which file to read.

## Content rules that stop a Skill from rotting

**No dates or "as of now".** Never write "if you're doing this before August 2025, use the old API." That instruction is guaranteed to be wrong eventually. Keep the current method up top, and park history in a collapsed section:

```markdown
## Current method

Use the v2 API endpoint: `api.example.com/v2/messages`

## Old patterns

<details>
<summary>Legacy v1 API (deprecated 2025-08)</summary>

The v1 API used: `api.example.com/v1/messages`. No longer supported.
</details>
```

**Pick one word and keep it.** Always "field", never a mix of field, box, element, and control. Always "extract", never a rotation of pull, get, and retrieve. Synonyms read nicely to humans and add ambiguity for a model.

**One default, not a menu.** "Use pdfplumber for text extraction" beats "you could use pypdf, or pdfplumber, or PyMuPDF." Add exceptions as named escape hatches: "for scanned PDFs that need OCR, use pdf2image with pytesseract instead."

**Forward slashes, always.** `scripts/helper.py`, never `scripts\helper.py`. Windows-style paths break on everything else.

## Prove it works before you write more

The guide is blunt about this: build the evaluations *before* the documentation. Otherwise you spend your effort solving problems you imagined.

1. **Find the real gaps.** Run Claude on the actual task with no Skill. Write down exactly where it fell short.
2. **Write three scenarios** that test those gaps.
3. **Record the baseline.** How does Claude do today, without help?
4. **Write the minimum** that closes the gaps and passes your scenarios.
5. **Iterate** against the baseline.

An evaluation is just a prompt plus what you expect to happen:

```json
{
  "skills": ["pdf-processing"],
  "query": "Extract all text from this PDF file and save it to output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "Reads the PDF using an appropriate PDF library or command-line tool",
    "Extracts text from all pages without missing any",
    "Saves the text to output.txt in a clear, readable format"
  ]
}
```

There is no built-in runner for that format, so you either check them by hand or bring your own harness.

Two things matter and they are separate: does Claude **invoke** the Skill on the prompts it should, and is the **output** right when it does. The check for both is the same. Run realistic prompts in a fresh session with the Skill available, then again with it turned off, and compare. Fresh sessions are not optional here. Leftover context from writing the Skill will make weak instructions look fine.

**Automate the loop.** The official `skill-creator` plugin runs it for you inside Claude Code:

```text
/plugin install skill-creator@claude-plugins-official
```

It stores cases in `evals/evals.json`, runs each in its own subagent so contexts stay clean, grades assertions with evidence, and benchmarks with-Skill against without-Skill so you can see the pass-rate gain next to the token cost. It will also A/B two versions blind, and tune your `description` by generating should-trigger and should-not-trigger prompts and measuring the hit rate.

## The two-Claude loop

The best way to write a Skill is with Claude, and the guide names the roles: **Claude A** helps you author it, **Claude B** is a fresh session that has to live with it.

1. Do the task normally with Claude A, and notice what context you keep supplying by hand.
2. Ask Claude A to turn that into a Skill. No special prompt needed, Claude knows the format.
3. Cut what Claude A over-explained. "Remove the explanation of what win rate means, Claude already knows that."
4. Fix the architecture. "Move the table schema into a separate reference file, we'll add more tables later."
5. Hand it to Claude B on a real task and watch.
6. Take what you saw back to Claude A: "It forgot to filter test accounts even though the Skill says to. Is that rule prominent enough?"

Then keep going round. The fix is often structural rather than additive: promote the rule higher up, or harden "always filter" into "MUST filter".

## Watch how Claude navigates

While Claude B works, the navigation itself tells you what to change:

- **Reads files in an order you did not expect?** Your structure is less obvious than you thought.
- **Never follows a reference?** The link needs to be more explicit, or moved somewhere prominent.
- **Opens the same file every single time?** That content belongs in `SKILL.md`.
- **Never opens a file at all?** It is either unnecessary or badly signposted.

## When your Skill ships scripts

Bundled scripts beat generated code: more reliable, consistent every run, and the code never enters the context window, only its output. A few rules apply once you have them.

**Solve, do not defer.** Handle the error in the script instead of leaving it for Claude to puzzle out. Catch the missing file and create a default; catch the permission error and fall back. `return open(path).read()` and hope is not a strategy.

**No voodoo constants.** `TIMEOUT = 47` invites the question and answers nothing. If you cannot justify the value, Claude certainly cannot:

```python
# HTTP requests typically complete within 30 seconds
# Longer timeout accounts for slow connections
REQUEST_TIMEOUT = 30
```

**Say whether to run it or read it.** "Run `analyze_form.py` to extract fields" and "See `analyze_form.py` for the extraction algorithm" are different instructions. Execution is usually what you want.

**Name files for their contents.** `form_validation_rules.md`, not `doc2.md`. Organize by domain (`reference/finance.md`, `reference/sales.md`) so Claude can load one topic without dragging in the rest.

**Plan, validate, execute.** For batch or destructive work, have Claude write its plan to a file, validate that file with a script, and only then apply it. Updating 50 form fields from a spreadsheet? Write `changes.json`, validate it, then execute. Errors surface before anything is touched, Claude can iterate on the plan without harm, and the error message points at the real problem. Make those messages verbose: "Field 'signature_date' not found. Available fields: customer_name, order_total, signature_date_signed."

**Fully qualify MCP tool names.** Use `ServerName:tool_name`, as in `BigQuery:bigquery_schema` or `GitHub:create_issue`. Drop the prefix and Claude may not find the tool at all once several [MCP](/docs/mcp) servers are connected.

**Be explicit about dependencies,** because the sandbox differs by surface. In Claude Code, Skills have the same network access as any other program on your machine (install locally, never globally). On claude.ai, network access depends on your settings. On the Claude API there is no network access and no runtime package installation at all, so only pre-installed packages work. Never write "use the pdf library"; write `pip install pypdf` and then the code.

## Pre-flight checklist

Before you share a Skill:

- [ ] The description says what it does *and* when to use it, in specific terms
- [ ] `SKILL.md` is under 500 lines, with details split into linked files
- [ ] No time-sensitive information outside an "old patterns" section
- [ ] One term per concept, throughout
- [ ] Examples are concrete, not abstract
- [ ] References are one level deep from `SKILL.md`
- [ ] Workflows have clear steps, and fragile ones have a validation loop
- [ ] Scripts handle their own errors, and every constant is justified
- [ ] Required packages are listed and confirmed available
- [ ] Forward slashes everywhere
- [ ] At least three evaluations, run in fresh sessions against a no-Skill baseline
- [ ] Tested on every model you plan to use it with

That last one catches people out. A Skill sits on top of the model, so the same file behaves differently across the family. Ask of each: does Haiku get enough guidance, is it clear and efficient for Sonnet, does it avoid over-explaining to Opus? Aim for instructions that work across all three.

Next: the fields that turn a Skill from a document into a program, in [Frontmatter & Power Features](/docs/skills-reference).

**Official links:** [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) · [Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) · [Evaluating skill output quality](https://agentskills.io/skill-creation/evaluating-skills)

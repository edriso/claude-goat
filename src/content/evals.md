# Evaluating AI Output

"It looks good to me" works for one prompt on one afternoon. It does not work when you change a prompt, swap a model, or ship to users who will send inputs you never imagined. Vibes do not scale. Evals do.

## What an eval actually is

An eval is three things:

1. **Fixed inputs.** A set of test cases drawn from your real task, including the ugly ones: irrelevant input, overly long input, ambiguous requests, hostile users.
2. **Expected outcomes.** What a good answer looks like for each input. Sometimes an exact string, sometimes a rubric.
3. **A grader.** Something that compares actual output to expected outcome and produces a score.

Run the same inputs through your system, grade the outputs, get a number. Now "did my change help?" has an answer instead of a feeling.

## Three kinds of grader

**Code-based grading.** Exact match, string match, or a script that checks the output (does the JSON parse, does the extracted date equal the known date, does the generated code pass the tests). Fastest, cheapest, and most reliable. Use it whenever you can shape the task to allow it, for example by asking for a category label instead of a paragraph.

**Human grading.** Most flexible, highest quality, and by far the slowest and most expensive. The official guidance is to avoid leaning on it: structure questions so they can be graded automatically instead.

**LLM-as-judge.** A model grades the output against a rubric. This is how you grade things code cannot, like tone, helpfulness, or whether a summary preserved the key facts. The official docs' one hard rule: use a different model to judge than the one that generated the output, so it is not grading its own work. Beyond that, known pitfalls from community and research experience: judges tend to favor longer and more confident-sounding answers, and vague rubric criteria ("is this good?") produce noisy scores. Give the judge explicit, independently checkable criteria and ask for a decision per criterion, not one overall vibe score.

The official eval guide is direct about the tradeoff: more questions with slightly lower-signal automated grading beats fewer questions with high-quality human grading. Volume wins.

## Build a regression suite for your prompts

The habit that pays off most: treat your prompts like code and give them tests.

- Collect real inputs from your logs or your own usage. Twenty is plenty to start.
- Write down the expected outcome for each.
- Put them in a file with a small script that runs them through your prompt and grades the results.
- Rerun it after every prompt edit and every model change.

Without this, every prompt tweak is a guess and every model upgrade is a leap of faith. With it, "the new model broke our date extraction on European formats" is a failing test case instead of a user complaint. This is the same loop as [prompting](/docs/prompting) step 10, just made permanent.

## The Console Evaluation tool

When you outgrow the scratch script, the Claude Console has an Evaluation tab built into the prompt editor. Write your prompt with `{{variables}}` for the parts that change per request, then:

- Add test cases by hand, have Claude generate them, or import them from a CSV.
- Rerun the whole suite against a new prompt version to see how a change lands across every case at once.
- Compare two or more prompts side by side and grade response quality on a five-point scale.

It will not replace a code-graded suite in CI, but for prompt iteration it is the fastest feedback loop available.

## Start small

The failure mode is not "my eval suite is too small." It is having no eval at all because building a proper one felt like a project. Twenty real cases with a dumb string-match grader beat zero cases every time. Start there, add cases whenever production surprises you, and promote the suite to something fancier only when the simple version stops answering your questions.

Next: [Structured Outputs & Tool Calling](/docs/structured-outputs)

**Official links:** [Create strong empirical evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) · [Console Evaluation tool](https://platform.claude.com/docs/en/test-and-evaluate/eval-tool)

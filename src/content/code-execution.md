# Code Execution & Code Mode

You now know that a tool is a function Claude can call, and that an [MCP server](/docs/mcp-deep) is a bundle of those tools. Under the hood, everything Claude Code does is a tool call: `Read` a file, `Edit` it, run a `Bash` command. The `get_weather` example and `edit_file` are the same shape.

That model is clean until you connect a lot of tools and start chaining them. Two costs show up, and code execution is the fix for both.

## The two costs of plain tool calling

**Tool definitions eat context.** Every connected tool ships its full schema (name, description, every parameter) into the context window before you even ask a question. Connect a few big servers and you can burn hundreds of thousands of tokens on definitions alone. Cloudflare measured a full API as 1.17 million tokens of definitions, more than most models can even hold.

**Intermediate results flow through the model.** When you chain tool calls, the output of each one passes back through Claude to reach the next. Ask it to pull a two-hour meeting transcript from one system and paste it into another, and that transcript flows through the model twice. Anthropic's own example puts a single such task at 150,000 tokens.

Both costs are worse for the thing tools are best at: multi-step work that stitches several calls together.

## The idea: let the model write code

Instead of exposing tools as a giant list the model calls one at a time, present them as a code API the model can *program against*. Claude writes a short script that calls the tools, and only the final result comes back.

This flips three things:

- **Load tools on demand (progressive disclosure).** The model browses the available tools like files and reads only the definitions it actually needs, instead of loading all of them upfront.
- **Filter data before it hits the context.** Got 10,000 spreadsheet rows but need five? The code filters them in the execution environment; only those five reach the model.
- **Do control flow in code.** Loops, conditionals, and error handling are plain code, not a fragile chain of individual tool calls where the model can lose its place.

Anthropic reports the transcript example dropping from 150,000 tokens to about 2,000, a 98.7% reduction, by writing code instead of chaining calls.

Because each tool is just an async function, code can also express flows that a flat list of tool calls cannot handle cleanly. A human-in-the-loop approval gate, for instance, is ordinary control flow:

```js
async function refund(user, amount) {
  // small refunds go straight through; large ones wait for a human in Slack
  const approved = amount < 10 || await askForApprovalInSlack(user, amount);
  if (approved) await issueRefund(user, amount);
}
```

The older way to get this is to wire each step into an explicit graph of nodes and edges, with approvals as breakpoints between them (community frameworks like LangGraph do this). Code execution collapses that graph into a single program the model writes and runs in one pass.

## Where you will meet it

**Programmatic tool calling (Claude API).** An official Claude feature: Claude writes code that calls your tools inside a sandbox, rather than making a round trip through the model for every call. Tool results consumed inside the sandbox do not count toward your token usage; only the final result does. Anthropic reports that on agentic-search benchmarks it improved results by about 11% while using 24% fewer input tokens, and that requests carrying 10 to 49 tools typically save 20% to 40% of tokens.

**Code execution with MCP (Anthropic guidance).** The same idea applied to MCP servers: expose each server as a code API the agent imports and calls, so it loads tool definitions on demand and keeps intermediate data in the execution environment. This also helps privacy, since raw data stays in the sandbox instead of passing through the prompt.

**Code Mode (Cloudflare, community).** The technique that popularized the name. Rather than exposing every tool, Cloudflare's Agents SDK gives the model just two: `search`, to discover the available methods and their types, and `execute`, to run validated TypeScript against a typed SDK in a sandboxed V8 isolate, chaining the whole workflow in one pass. They report giving an agent an entire API in about 1,000 tokens, a 99.9% cut versus loading every tool definition. It is a third-party approach, not an Anthropic product, but the Anthropic features above are built on the same insight.

## Why it works: use deterministic tools for deterministic work

Models are weak at exact, mechanical steps (this is the same reason a raw model is bad at arithmetic). Code is perfect at them. Code execution hands the deterministic parts (filtering, math, looping, moving data) to code, and keeps the model doing what it is good at: deciding what to do. A common pattern is to use a strong model to write the orchestration code once, then a fast, cheap model like [Haiku](/docs/models) to run the loop behind it.

## When to reach for it

You do not need this for a single tool call. It earns its keep when you are chaining several calls, moving large payloads between tools, or connecting so many tools that their definitions crowd out your actual work. For everyday Claude Code use, the built-in tools already handle this well; this is the concept to understand when you start *building* agents of your own.

Next: level up how you actually work with the [Prompting Playbook](/docs/prompting).

**Official links:** [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) · [Programmatic tool calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling) · [Cloudflare Code Mode](https://blog.cloudflare.com/code-mode-mcp/) · [LangGraph quickstart](https://docs.langchain.com/oss/javascript/langgraph/quickstart)

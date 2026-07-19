# Structured Outputs & Tool Calling

If your app parses Claude's prose with regexes and hopes, it will break. The API has two first-class mechanisms for getting machine-readable output: structured outputs, which constrain the response itself to a JSON schema, and tool calling, which lets Claude invoke functions you define. Both give you `JSON.parse`-able data instead of "Here's the JSON you asked for! ```json ...".

## Structured outputs: guaranteed JSON

Pass a JSON schema in `output_config.format` and the API uses constrained decoding, so the response is guaranteed to be valid JSON matching your schema. No "respond only with JSON" begging, no retry loops for malformed output. It is generally available on all current models, including Fable 5, Opus 4.8, Sonnet 5, and Haiku 4.5.

The TypeScript SDK pairs this with Zod: define the schema once, and `client.messages.parse()` returns a typed, validated object. Adapted from the official docs:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const ContactInfo = z.object({
  name: z.string(),
  email: z.string(),
  plan_interest: z.string(),
  demo_requested: z.boolean(),
});

const client = new Anthropic();

const response = await client.messages.parse({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: "Extract the key info: John Smith (john@example.com) wants the Enterprise plan and a demo next Tuesday.",
  }],
  output_config: { format: zodOutputFormat(ContactInfo) },
});

console.log(response.parsed_output); // typed, validated object
```

Schema limits worth knowing: no recursive schemas, and no numeric or string constraints like `minimum` or `maxLength` (the SDKs strip those and validate them client-side instead). Every object needs `additionalProperties: false`. The first request with a new schema pays a one-time grammar compilation cost; it is cached for 24 hours after that.

## Tool calling: defining tools with JSON Schema

A tool is a name, a description, and a JSON Schema for its inputs:

```json
{
  "name": "get_weather",
  "description": "Get the current weather for a given location.",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City and state, e.g. San Francisco, CA" }
    },
    "required": ["location"]
  }
}
```

The description does real work: Claude uses it to decide when to call the tool, so say when to call it, not just what it does. By default (`tool_choice: {"type": "auto"}`) Claude decides whether to call a tool; you can also force a specific tool or require that at least one is used.

## The tool-use loop

Tool calling is a round trip your code drives:

1. You send a request with `tools` defined.
2. Claude responds with `stop_reason: "tool_use"` and one or more `tool_use` blocks, each carrying an `id`, the tool `name`, and parsed `input`.
3. Your code runs the tool.
4. You send the result back as a `tool_result` block (with the matching `tool_use_id`) in a new user message, along with the full conversation so far.
5. Claude either calls another tool (loop back to 2) or answers with `stop_reason: "end_turn"`.

Claude can call several tools in one response. Run them all and return all the `tool_result` blocks together in a single user message. The SDKs also ship a Tool Runner helper that drives this loop for you; the manual loop is worth understanding either way, because it is what every agent is under the hood.

## Validate and retry anyway

Guaranteed syntax is not guaranteed sense. Keep a thin validation layer:

- **Check `stop_reason` first.** A `refusal` response may not match your schema at all, and `max_tokens` means the output was cut off; retry with a higher limit.
- **For tool inputs**, add `strict: true` to the tool definition (with `additionalProperties: false` and `required` in the schema) and the API guarantees the input validates exactly. Without it, validate inputs yourself and return a `tool_result` with `is_error: true` and a clear message on mismatch; Claude reads the error and retries with corrected input.
- **Compare enum values case-insensitively.** Structured outputs do not guarantee the capitalization of `enum` values.
- **Validate business rules in code.** A schema can force `age` to be an integer; it cannot force it to be plausible.

## When to use which

Use structured outputs when you want data out of the model: extraction, classification, anything feeding a database or UI. Use tool calling when the model should decide what to do next with functions you provide: look something up, take an action, then reason about the result. Parse prose only when a human is the consumer. If code will read the output, ask for structure. It removes the flakiest part of most LLM apps, which was never the model, but the parsing.

Next: [RAG & Embeddings](/docs/rag-embeddings)

**Official links:** [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) · [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) · [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use)

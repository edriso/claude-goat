# Claude API Basics

Claude Code is one way to use Claude. The other is to build your own apps and features on the Claude API. This page gives you enough to make your first calls and understand the core ideas. You will be surprised how little code it takes.

## Setup

Install the official SDK for your language and set your API key (get one from the Claude Console):

```bash
pip install anthropic          # Python
# or
npm install @anthropic-ai/sdk  # JavaScript / TypeScript

export ANTHROPIC_API_KEY="your-key-here"
```

## Your first call

Everything runs through one endpoint, the Messages API. Here it is in Python:

```python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from your environment

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "What is the capital of France?"}],
)

for block in response.content:
    if block.type == "text":
        print(block.text)
```

That is a complete, working program.

## The core concepts

A few ideas explain almost everything:

- **messages** is the conversation: a list of `{"role": "user" or "assistant", "content": ...}`.
- **The API is stateless.** Claude has no memory between calls. To continue a conversation, you resend the whole history each time. This surprises everyone at first.
- **max_tokens** caps the length of the *output*. If the answer hits the cap, it gets cut off.
- **system** sets Claude's role and behavior. Pass it as a top-level parameter: `system="You are a helpful coding assistant."`
- **response.content is a list of blocks.** Always check `block.type` before reading `block.text`.

## Tool use (function calling)

You can give Claude tools it can call. You describe each tool with a JSON schema; Claude decides when to use one and returns a request; your code runs the actual function and sends the result back.

```python
tools = [{
    "name": "get_weather",
    "description": "Get current weather for a location",
    "input_schema": {
        "type": "object",
        "properties": {"location": {"type": "string"}},
        "required": ["location"],
    },
}]

response = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024, tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Paris?"}],
)
# If response.stop_reason == "tool_use": run your function, then send the
# result back as a tool_result message so Claude can finish its answer.
```

This loop, Claude asks, your code runs it, you return the result, is the foundation of agents.

## Streaming

For anything that produces a long answer, stream the tokens as they arrive. It feels faster and avoids timeouts.

```python
with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about the sea"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

## Prompt caching (saves real money)

If you send the same big chunk repeatedly (a long system prompt, a big document, a fixed set of tools), you can cache that part. Repeat requests then read from the cache for a small fraction of the normal input price.

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": LARGE_SHARED_DOCUMENT,
        "cache_control": {"type": "ephemeral"},  # cache everything up to here
    }],
    messages=[{"role": "user", "content": "Summarize the key points"}],
)
```

The one rule: caching is a prefix match, so put the *stable* content first and the *changing* content (like the user's question) last. A classic beginner bug is putting a timestamp near the top of the system prompt, which silently breaks all caching.

## Useful odds and ends

- **response.usage** reports how many input and output tokens you used, so you can track cost.
- **stop_reason** tells you why Claude stopped: `end_turn` (done), `max_tokens` (hit the cap), `tool_use` (wants a tool).
- **The Batch API** gives you a large discount for non-urgent bulk work.

Want the standard you keep hearing about? Read the [MCP deep dive](/docs/mcp-deep) next.

**Official links:** [Get started](https://docs.claude.com/en/docs/get-started) · [API overview](https://docs.claude.com/en/api/overview)

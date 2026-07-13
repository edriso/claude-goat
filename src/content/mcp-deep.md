# MCP Deep Dive

You met MCP as the way Claude Code connects to outside tools. Here we go one level deeper, so you understand how it actually works and could even build your own server. Do not worry, the mental model is simple.

## The problem MCP solves

Before MCP, every connection between an AI app and a tool was custom-built. Ten apps and ten tools meant a hundred bespoke integrations. This is the "N times M" problem. MCP standardizes the connection, so you build once and it works everywhere. That is why the docs call it "a USB-C port for AI applications."

## The pieces

MCP uses a client and server model:

- **Host**: the AI application, like Claude Code or the desktop app.
- **Client**: the host creates one client per server, each holding a single connection.
- **Server**: a program that exposes data and tools. It can run locally on your machine or remotely over the network.

They talk using JSON-RPC messages. When they connect, they do a quick handshake to agree on what each side supports, then the client can discover and use what the server offers.

## The three primitives

A server can expose three kinds of things. These are the heart of MCP.

**1. Tools: actions the AI can take.** A tool is a function Claude can call to *do* something: run a database query, send an email, create a file. Each tool has a name, a description, and a schema for its inputs.

**2. Resources: data the AI can read.** A resource provides context: a file's contents, a database record, an API response, a schema. Resources inform; tools act.

**3. Prompts: reusable templates.** A prompt is a pre-written interaction the user can pick, like a saved query template or a set of few-shot examples.

A handy example from the docs: a database MCP server might expose a **tool** to run queries, a **resource** holding the database schema, and a **prompt** with examples of well-written queries.

## What the messages look like

You almost never write this by hand, but seeing it makes MCP concrete. To discover what tools a server has:

```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
```

The server replies with a list, each tool describing its name and input schema:

```json
{ "jsonrpc": "2.0", "id": 2, "result": { "tools": [
  { "name": "weather_current",
    "description": "Get current weather for any location",
    "inputSchema": { "type": "object",
      "properties": { "location": { "type": "string" } },
      "required": ["location"] } }
]}}
```

And to actually call one:

```json
{ "jsonrpc": "2.0", "id": 3, "method": "tools/call",
  "params": { "name": "weather_current",
              "arguments": { "location": "San Francisco" } } }
```

The server returns the result, which the host feeds back to Claude.

## You do not write JSON by hand

In practice you use the MCP SDKs (Python, TypeScript, and others). You define your tools, resources, and prompts in normal code, and the SDK handles all the protocol wiring. Building a basic server is genuinely a short afternoon project.

## Why this matters

MCP is why the ecosystem grows so fast. Anyone can publish a server for their product, and instantly every MCP-compatible AI app can use it. When you connect a server in Claude Code, you are plugging into that ecosystem.

Want to build one for real? Anthropic's free MCP course walks you through it in Python.

Next, see how agents call all of this efficiently: [Code Execution & Code Mode](/docs/code-execution).

**Official links:** [modelcontextprotocol.io](https://modelcontextprotocol.io) · [Architecture](https://modelcontextprotocol.io/docs/learn/architecture)

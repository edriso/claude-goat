# MCP Servers

Claude Code is powerful on its own, but your work does not live only in code. It lives in issue trackers, databases, design files, monitoring dashboards, and your own APIs. MCP is how you connect Claude to all of that.

## What MCP is

MCP stands for Model Context Protocol. It is an open standard, created by Anthropic, for connecting AI apps to external systems. The docs describe it as "a USB-C port for AI applications": one standard plug, so any MCP-compatible app can talk to any MCP-compatible service.

Once connected, Claude can read and act on those systems directly, instead of you copy-pasting between tabs.

## What it unlocks, with real prompts

- "Add the feature described in JIRA ENG-4521 and open a PR on GitHub."
- "What are the most common Sentry errors in the last 24 hours?"
- "Find customers who have not purchased in 90 days." (against your database)

## Adding a server

You add servers with the `claude mcp` command. A remote server over HTTP:

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

One that needs an auth token:

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer YOUR_GITHUB_TOKEN"
```

A local one that runs as a process on your machine:

```bash
claude mcp add --transport stdio airtable \
  --env AIRTABLE_API_KEY=KEY -- npx -y airtable-mcp-server
```

Manage them with `claude mcp list`, `claude mcp get <name>`, and `claude mcp remove <name>`.

## Scopes: who can use it

- `local` (default): private to you, in this project.
- `project`: shared with your team through a committed `.mcp.json` file.
- `user`: available in all your projects.

Project-scoped servers ask for approval the first time, for safety.

## Using it in a session

Type `/mcp` to see connected servers, how many tools each offers, and to log in to servers that need OAuth. If you are signed in with a claude.ai account, connectors you set up there are available automatically.

Do not worry about adding "too many" servers. Tool definitions load on demand, so extra servers cost you almost no context until you actually use them.

## The short version

MCP turns Claude from something that only sees your files into something that can see and act across your whole toolchain. Want to understand what is happening under the hood? Read the [MCP deep dive](/docs/mcp-deep).

**Official links:** [MCP in Claude Code](https://code.claude.com/docs/en/mcp) · [MCP quickstart](https://code.claude.com/docs/en/mcp-quickstart)

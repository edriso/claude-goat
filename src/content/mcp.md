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

## Scopes: where the config lives, and who gets it

Every server you add lands in one of three scopes. The scope decides which projects load it, and whether your team gets it too.

| Scope | Loads in | Shared with the team | Stored in |
| --- | --- | --- | --- |
| `local` (default) | The current project only | No | `~/.claude.json` |
| `project` | The current project only | Yes, through version control | `.mcp.json` in the project root |
| `user` | All your projects | No | `~/.claude.json` |

```bash
claude mcp add --transport http railway https://mcp.railway.com/mcp --scope user
claude mcp add --transport http railway https://mcp.railway.com/mcp --scope project
claude mcp add --transport http railway https://mcp.railway.com/mcp --scope local
```

Two things here surprise people.

**Local is the default, and "local" does not mean "in the repo".** A local-scoped server is tied to one project, but the config sits in `~/.claude.json` under that project's path. Nothing to gitignore, nothing to leak, which also makes it the right place for a server that carries credentials. Watch the word, though: MCP local *scope* lives in `~/.claude.json`, while local *settings* live in `.claude/settings.local.json` inside the project. Different files, similar names.

**Project scope asks before it connects.** Claude Code prompts for approval the first time it sees a server in a checked-in `.mcp.json`, so cloning a repo never silently wires you up to someone else's tools. Run `claude mcp reset-project-choices` to be asked again.

If the same server name appears in more than one scope, the higher one wins outright: local beats project beats user. The whole entry comes from that source, rather than being merged field by field.

## Install broadly, enable selectively

Scopes are only half of it. You can also turn an installed server off where you do not want it, and that is what makes "install at user scope" a comfortable default rather than a commitment.

The easy way is `/mcp`: toggle the server off there and Claude Code records the choice per project in `~/.claude.json`. The server stays configured and simply does not connect in that project. Two cases this covers:

- A Shopify server you want in every Shopify repo and nowhere else. Install it at user scope, toggle it off in the projects that have nothing to do with Shopify.
- A team `.mcp.json` that includes a service you have no account for. Turn it off for yourself and leave the shared file alone.

The same choice in settings, for when you want it scripted or committed:

| Key | What it does |
| --- | --- |
| `disabledMcpjsonServers` | Reject named servers from the project's `.mcp.json` |
| `enabledMcpjsonServers` | Pre-approve named servers from `.mcp.json` |
| `enableAllProjectMcpServers` | Pre-approve every server in `.mcp.json` |

Put those in `.claude/settings.local.json` to keep the decision on your machine only, or in `.claude/settings.json` to share it with the team. One name to keep straight: `enabledPlugins` lives in the same settings file but turns *plugins* on and off, not MCP servers. Two different systems, one file.

## Using it in a session

Type `/mcp` to see connected servers, how many tools each offers, and to log in to servers that need OAuth. If you are signed in with a claude.ai account, connectors you set up there are available automatically.

You mostly do not have to ration servers. Tool search is on by default and defers tool definitions until Claude needs them, so adding another server has minimal impact on your context window.

"Minimal" is not "zero", and the difference explains a complaint you will hear. Tool *names* and each server's *instructions* still load at session start, and some servers ship long instructions. So a heavy server can cost you real context in every session even when you never call a single one of its tools. That is the honest reason to disable the ones you are not using in a given project, rather than a vague fear of "too many". Run `/context` to see what yours are actually costing, and `/doctor` to get the always-on stuff weighed against what it buys you.

## The short version

MCP turns Claude from something that only sees your files into something that can see and act across your whole toolchain. Want to understand what is happening under the hood? Read the [MCP deep dive](/docs/mcp-deep).

**Official links:** [MCP in Claude Code](https://code.claude.com/docs/en/mcp) · [MCP quickstart](https://code.claude.com/docs/en/mcp-quickstart)

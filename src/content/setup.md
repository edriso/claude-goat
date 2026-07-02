# Setup and Install

Let's get Claude Code running so you can follow along with real commands. This takes about five minutes.

## What you need first

- A supported OS: macOS 13+, Windows 10 (1809+) or later, or a modern Linux (Ubuntu 20.04+, Debian 10+, Alpine 3.19+). On Windows, WSL works great.
- 4 GB+ of RAM and an internet connection.
- **A paid Claude plan or API access.** Claude Code needs one of: Claude Pro, Max, Team, or Enterprise; a Claude Console account with API credits; or an enterprise cloud provider (Amazon Bedrock, Google Vertex AI, Microsoft Foundry). The free Claude.ai plan does not include Claude Code.

## Install it

The recommended way is the native installer.

```bash
# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

Prefer a package manager? Any of these work too:

```bash
brew install --cask claude-code          # macOS Homebrew
winget install Anthropic.ClaudeCode       # Windows
npm install -g @anthropic-ai/claude-code  # needs Node 18+
```

> Tip: if you use the npm method, never run it with `sudo`. Native installs update themselves in the background; Homebrew, WinGet, and npm need manual updates.

## Verify and start

```bash
claude --version   # confirms the install
claude doctor      # checks your setup and flags problems
```

Now move into a project folder and launch an interactive session:

```bash
cd my-project
claude
```

The first time, it will walk you through logging in. After that, you are talking to Claude.

## Your first two minutes

Try these, in order, to get a feel for it:

```text
/help
```

That lists everything you can do. Then just ask, in plain English:

```text
what does this project do?
```

```text
add a friendly hello world route and show me the diff before changing anything
```

Claude will explore, propose changes, and ask before editing. You are always in control.

## Editors and other surfaces

The same engine powers the terminal, VS Code, JetBrains IDEs, a desktop app, the web at claude.ai/code, Slack, and CI/CD. Your project memory, settings, and connected tools follow you across all of them. Start in the terminal though. It is where you learn the fundamentals fastest.

Next up: the [Claude Code overview](/docs/claude-code-overview), your daily driver.

**Official links:** [Setup](https://code.claude.com/docs/en/setup) · [Quickstart](https://code.claude.com/docs/en/quickstart)

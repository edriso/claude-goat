# Browser Automation and QA

Claude is great with code it can read. But a lot of your real work happens in a browser: does the page actually render, does the button click, did the layout break on mobile? Giving Claude a browser to drive turns "looks done" into "I checked it", and it automates the tedious setup around a PR review.

Two open tools lead here. Both are third party (not official Anthropic), and they solve different problems, so it is worth knowing which to reach for.

## The manual dance they replace

Reviewing a teammate's PR by hand usually means: stash your changes, pull the latest, check out their branch, run the dev server, open localhost, click through the feature, and eyeball it. Five minutes of setup every time, and easy to skip when you are busy. A browser tool lets Claude do that lap for you and report back with a screenshot.

## Chrome DevTools MCP: deep inspection and debugging

[Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp), maintained by the Chrome DevTools team, is an [MCP server](/docs/mcp) that plugs Claude straight into a real Chrome. It exposes a large set of tools: navigate, click, type, screenshot, read the console, inspect network requests, grab computed styles, and run performance and Lighthouse audits.

Add it to Claude Code with one command:

```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
```

It needs a current Node LTS and a recent stable Chrome. Now you can ask things like:

```text
Open localhost:5173/checkout, click "Place order", and tell me any console
errors. Then grab the computed styles on the .total element.
```

The killer feature is **headed mode connected to a real Chrome profile**. By default it launches a clean, headless browser, which is exactly what trips Cloudflare and other bot checks (a guest browser has no logged-in fingerprint). Run it headed and pointed at your everyday Chrome instead, and you can click through a cookie banner, solve a captcha, or type a password yourself, then let Claude pick up where it left off. That solves the "page just will not load for the agent" problem.

One caution that comes with that power: a headed session attached to your logged-in profile can reach your real accounts. Keep it on a second monitor where you can watch it, and never point it at your live profile and walk away.

Trade-off: it is thorough but **token heavy**. Every page it reads is a lot of context. Great for debugging a specific screen, less great for looping over a whole site.

## Agent Browser: token-respectful scripting

[Agent Browser](https://github.com/vercel-labs/agent-browser) from Vercel Labs is a fast command-line tool (a native Rust CLI, Apache-2.0) built for agents from the start. Install it and download its browser:

```bash
npm install -g agent-browser
agent-browser install
```

Its trick is the **accessibility snapshot**. Instead of dumping a whole DOM at Claude, it returns a compact tree of the page with stable references you can act on:

```bash
agent-browser open example.com
agent-browser snapshot          # returns elements as @e1, @e2, @e3 ...
agent-browser fill @e3 "test@example.com"
agent-browser click @e2
agent-browser screenshot page.png
```

Claude reads the tree once, then references elements by their short IDs instead of re-scanning the page each step. Add `--json` for machine-readable output. That makes it much lighter on context, so it is the better fit for repeatable, multi-step flows: click through a form, scrape some sample data, walk a checkout.

It is not magic. JavaScript-heavy sites and aggressive bot protection can still block it. When that happens, Chrome DevTools MCP in headed mode is the usual escape hatch, because you can clear the block by hand.

## Which one, when

- **Chrome DevTools MCP** for debugging one screen: inspect styles, read the console, check network calls, run an audit, or get past a login or captcha in headed mode.
- **Agent Browser** for scripted, repeatable flows where you care about token cost: QA passes, form walks, light scraping.

There is no rule against having both. Reach for the light one first, and escalate to the heavy one when you hit a wall.

## Turn it into a QA skill

The real payoff is packaging your review lap as a [skill](/docs/skills-intro). Write the runbook once (pull the branch, start the server, open these pages, check for console errors, add to cart, screenshot the result) and every review runs the same way. A well-written PR checklist plus a browser tool means Claude works down the list while you sip your coffee, then hands you screenshots as evidence.

Two habits keep this pleasant. Delegate the browser grind to a fast, cheap model like **Haiku**: a lot of the pain is just port and reload churn, and speed matters more than deep reasoning there. And keep a human in the loop for the final call, because a green screenshot is evidence, not a guarantee.

Next: the traps to avoid in [Common Mistakes](/docs/mistakes).

**Official links:** [MCP in Claude Code](https://code.claude.com/docs/en/mcp) · [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) · [Agent Browser](https://github.com/vercel-labs/agent-browser)

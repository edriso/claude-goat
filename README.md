# Claude GOAT 🐐

The GOAT (Greatest Of All Time) guide to mastering **Claude**, **Claude Code**, and **Agent Skills** as a developer. A friendly, hands-on learning hub with real examples and real workflows, grounded in the official docs.

Built as a personal go-to reference to get genuinely productive with Claude and become a 10x developer.

## What is inside

- **Start Here** — why Claude, and how to get set up.
- **Claude Code** — overview, slash commands, CLAUDE.md memory, hooks, subagents, MCP, keyboard shortcuts, and settings.
- **Agent Skills** — what they are, building your first one, and how they compare to subagents, MCP, and hooks.
- **Models & Platform** — the Claude model family, the API basics, and an MCP deep dive.
- **Work Like a 10x Dev** — a prompting playbook, developer workflows, and common mistakes to avoid.
- **Resources** — free Anthropic courses, a cheat sheet, and every official link in one place.

## Tech stack

- [Vite](https://vite.dev) for a fast build and dev server
- [React](https://react.dev) with [React Router](https://reactrouter.com)
- [Tailwind CSS v4](https://tailwindcss.com) for styling
- [react-markdown](https://github.com/remarkjs/react-markdown) with GitHub-flavored markdown and syntax highlighting

Content is authored as plain markdown in `src/content/`, so it is easy to read, edit, and extend.

## Features

- Light and dark themes, remembered across refreshes (no flash on load)
- Collapsible sidebar that remembers your choice, with a mobile drawer
- Per-page table of contents, prev/next navigation, and one-click code copy
- Filterable sidebar search

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server
npm run build   # build for production
npm run preview # preview the production build
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Adding a new page

1. Create a markdown file in `src/content/`, for example `src/content/my-topic.md`.
2. Add an entry to `src/data/nav.js` with the matching `slug` (`my-topic`), a title, and a short blurb.

That is it. Routing, the sidebar, prev/next links, and the table of contents update automatically.

## A note on accuracy

This is a learning project, not an official Anthropic resource. AI tools move fast, so always double-check details against the [official docs](https://code.claude.com/docs) and the built-in `/help`.

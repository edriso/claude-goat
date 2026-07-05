# Claude GOAT

A learning hub for mastering Claude, Claude Code, and Agent Skills. Content is plain markdown in `src/content/`, rendered by a Vite + React + Tailwind app. See @README.md for the full structure, tech stack, and dev commands.

## Accuracy is the whole point

This hub teaches people how Claude Code actually works, so wrong information is worse than no information.

- Verify every technical claim against the official docs (https://code.claude.com/docs, https://docs.claude.com) before adding or changing it. Prefer fetching the live docs over relying on memory.
- Treat YouTube videos, blogs, and community posts as leads, not facts. Confirm them against official sources, and label community techniques as community, not official.
- Never invent model names, command names, flags, settings keys, version numbers, or figures. If you cannot verify something, leave it out or mark it unverified.
- The current Claude models are Fable 5, Opus 4.8, Sonnet 5, and Haiku 4.5. Do not present any other name as a current model.

## Writing style

- Plain, friendly English. Keep it lean: cut anything that does not help the reader.
- No em dashes anywhere. Use commas, parentheses, or two sentences instead.
- Match the voice of the existing pages: concrete, lightly opinionated, no hype.

## How content pages work

- One markdown file per page at `src/content/<slug>.md`, loaded raw at build time. No YAML frontmatter; start the file with a `# Heading`.
- Every page needs a matching entry in `src/data/nav.js` (`slug`, `title`, `blurb`). That single file drives the sidebar, routing, and prev/next links.
- Internal links use `/docs/<slug>`. End each page with a `Next:` pointer to the following page and an `**Official links:**` line to the sources.
- When you insert a page mid-section, update the neighboring pages' `Next:` lines so the guided flow stays correct.

## Before committing

- Run `npm run build` to confirm content changes still compile.
- `dist/` is gitignored; never commit build output.

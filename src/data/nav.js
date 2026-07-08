/**
 * The single source of truth for the sidebar, routing, and prev/next links.
 * Each item's `slug` maps to a markdown file in src/content/<slug>.md
 * (see src/content/index.js).
 */
export const nav = [
  {
    title: 'Start Here',
    icon: '🚀',
    items: [
      { slug: 'welcome', title: 'Welcome', blurb: 'What this guide is and how to use it.' },
      { slug: 'why-claude', title: 'Why Claude', blurb: 'The big picture for developers.' },
      { slug: 'setup', title: 'Setup & Install', blurb: 'Get Claude Code running in minutes.' },
    ],
  },
  {
    title: 'Claude Code',
    icon: '⌨️',
    items: [
      { slug: 'claude-code-overview', title: 'Overview', blurb: 'Your AI pair programmer in the terminal.' },
      { slug: 'slash-commands', title: 'Slash Commands', blurb: 'Built-in shortcuts you will use daily.' },
      { slug: 'claude-md', title: 'CLAUDE.md Memory', blurb: 'Teach Claude your project once.' },
      { slug: 'hooks', title: 'Hooks', blurb: 'Automate formatting, linting, and more.' },
      { slug: 'subagents', title: 'Subagents', blurb: 'Delegate work and keep context clean.' },
      { slug: 'mcp', title: 'MCP Servers', blurb: 'Connect Claude to your tools and data.' },
      { slug: 'shortcuts', title: 'Shortcuts & Speed', blurb: 'Type fast, ship faster.' },
      { slug: 'settings', title: 'Settings & Statusline', blurb: 'Configure and personalize.' },
    ],
  },
  {
    title: 'Agent Skills',
    icon: '🧩',
    items: [
      { slug: 'skills-intro', title: 'What Are Skills', blurb: 'Reusable know-how Claude applies automatically.' },
      { slug: 'skills-build', title: 'Build Your First Skill', blurb: 'A hands-on, step-by-step walkthrough.' },
      { slug: 'skills-vs', title: 'Skills vs Everything', blurb: 'Skills, subagents, MCP, commands compared.' },
    ],
  },
  {
    title: 'Models & Platform',
    icon: '🧠',
    items: [
      { slug: 'models', title: 'The Claude Family', blurb: 'Opus, Sonnet, Haiku, Fable: pick the right one.' },
      { slug: 'api-basics', title: 'Claude API Basics', blurb: 'Build your own apps on Claude.' },
      { slug: 'mcp-deep', title: 'MCP Deep Dive', blurb: 'Tools, resources, and prompts explained.' },
    ],
  },
  {
    title: 'Work Like a 10x Dev',
    icon: '⚡',
    items: [
      { slug: 'prompting', title: 'Prompting Playbook', blurb: 'Get great results, consistently.' },
      { slug: 'workflows', title: 'Developer Workflows', blurb: 'Explore, plan, build, review, ship.' },
      { slug: 'parallel', title: 'Working in Parallel', blurb: 'Worktrees, subagents, agent teams, headless.' },
      { slug: 'browser-automation', title: 'Browser Automation & QA', blurb: 'Give Claude a browser to test and review in.' },
      { slug: 'mistakes', title: 'Common Mistakes', blurb: 'Traps to avoid with AI coding.' },
    ],
  },
  {
    title: 'Resources',
    icon: '📚',
    items: [
      { slug: 'courses', title: 'Free Courses', blurb: 'Anthropic Academy, start to finish.' },
      { slug: 'cheatsheet', title: 'Cheat Sheet', blurb: 'One page to bookmark.' },
      { slug: 'links', title: 'Docs & Links', blurb: 'Every official resource in one place.' },
    ],
  },
]

/** Flat, ordered list of all doc items, used for routing and prev/next. */
export const flatDocs = nav.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.title })),
)

export function getAdjacent(slug) {
  const i = flatDocs.findIndex((d) => d.slug === slug)
  return {
    prev: i > 0 ? flatDocs[i - 1] : null,
    next: i >= 0 && i < flatDocs.length - 1 ? flatDocs[i + 1] : null,
  }
}

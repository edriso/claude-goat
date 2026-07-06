import { Link } from 'react-router-dom'
import { nav } from '../data/nav'

const paths = [
  {
    step: '01',
    title: 'Get set up',
    desc: 'Install Claude Code and run your first session today.',
    to: '/docs/setup',
    emoji: '🚀',
  },
  {
    step: '02',
    title: 'Live in the terminal',
    desc: 'Slash commands, memory, hooks, and the shortcuts that make you fast.',
    to: '/docs/claude-code-overview',
    emoji: '⌨️',
  },
  {
    step: '03',
    title: 'Teach Claude new tricks',
    desc: 'Write Agent Skills and connect tools with MCP.',
    to: '/docs/skills-intro',
    emoji: '🧩',
  },
  {
    step: '04',
    title: 'Work like a 10x dev',
    desc: 'Prompting, workflows, and habits that compound.',
    to: '/docs/prompting',
    emoji: '⚡',
  },
]

export default function Home() {
  return (
    <div className="cg-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stone-200 dark:border-stone-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
          style={{
            background:
              'radial-gradient(60% 55% at 50% 0%, rgba(217,119,87,0.22), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-clay-200 bg-clay-50 px-4 py-1.5 text-sm font-medium text-clay-700 dark:border-clay-800 dark:bg-clay-900/30 dark:text-clay-300">
            🐐 Your go-to guide, grounded in the official docs
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl dark:text-white">
            Master <span className="text-clay-500">Claude</span> and become
            <br className="hidden sm:block" /> the developer you want to be.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 dark:text-stone-400">
            A friendly, hands-on path through Claude Code, Agent Skills, MCP, and the
            everyday habits of a 10x developer. Real examples, real workflows, zero fluff.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/docs/welcome"
              className="rounded-xl bg-clay-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-clay-600 hover:shadow-md"
            >
              Start learning →
            </Link>
            <Link
              to="/docs/cheatsheet"
              className="rounded-xl border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-700 transition hover:border-clay-300 hover:text-clay-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-clay-600"
            >
              Jump to cheat sheet
            </Link>
          </div>
        </div>
      </section>

      {/* Learning path */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-stone-900 dark:text-white">
          A clear path, four steps
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-stone-500 dark:text-stone-400">
          Follow it top to bottom, or jump straight to what you need.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((p) => (
            <Link
              key={p.step}
              to={p.to}
              className="group relative flex flex-col rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-1 hover:border-clay-300 hover:shadow-lg dark:border-stone-800 dark:bg-[#201f1c] dark:hover:border-clay-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{p.emoji}</span>
                <span className="text-sm font-bold text-stone-300 dark:text-stone-600">
                  {p.step}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-stone-900 dark:text-white">{p.title}</h3>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{p.desc}</p>
              <span className="mt-4 text-sm font-medium text-clay-600 opacity-0 transition group-hover:opacity-100 dark:text-clay-400">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Full topic index */}
      <section className="border-t border-stone-200 bg-white/50 py-16 dark:border-stone-800 dark:bg-[#201f1c]/40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Everything inside</h2>
          <p className="mt-2 text-stone-500 dark:text-stone-400">
            {nav.reduce((n, s) => n + s.items.length, 0)} focused guides across {nav.length} areas.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {nav.map((section) => (
              <div key={section.title}>
                <div className="mb-3 flex items-center gap-2 font-semibold text-stone-900 dark:text-white">
                  <span aria-hidden>{section.icon}</span> {section.title}
                </div>
                <ul className="space-y-1.5">
                  {section.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/docs/${item.slug}`}
                        className="text-sm text-stone-600 transition hover:text-clay-600 dark:text-stone-400 dark:hover:text-clay-400"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 py-10 text-center text-sm text-stone-400 dark:border-stone-800 dark:text-stone-500">
        Made for learning. Not affiliated with Anthropic. Always verify against the{' '}
        <a
          href="https://docs.claude.com"
          target="_blank"
          rel="noreferrer"
          className="text-clay-600 hover:underline dark:text-clay-400"
        >
          official docs
        </a>
        .
      </footer>
    </div>
  )
}

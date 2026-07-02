import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import { getContent } from '../content'
import { getAdjacent } from '../data/nav'
import CodeBlock from '../components/CodeBlock'
import NotFound from './NotFound'

// Turn a heading string into the same id rehype-slug generates.
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function DocPage() {
  const { slug } = useParams()
  const markdown = getContent(slug)

  const toc = useMemo(() => {
    if (!markdown) return []
    const headings = []
    let inCode = false
    for (const line of markdown.split('\n')) {
      if (line.trim().startsWith('```')) inCode = !inCode
      if (inCode) continue
      const m = /^(##)\s+(.*)$/.exec(line)
      if (m) headings.push({ text: m[2].replace(/[*`]/g, ''), id: slugify(m[2].replace(/[*`]/g, '')) })
    }
    return headings
  }, [markdown])

  if (!markdown) return <NotFound />

  const { prev, next } = getAdjacent(slug)

  return (
    <div key={slug} className="cg-fade-in mx-auto flex max-w-6xl gap-10 px-5 py-10 md:px-8">
      <article className="prose min-w-0 flex-1">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeHighlight]}
          components={{
            pre: ({ node, ...props }) => <CodeBlock {...props} />,
            a: ({ node, href, ...props }) => {
              const external = href?.startsWith('http')
              return (
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  {...props}
                />
              )
            },
          }}
        >
          {markdown}
        </ReactMarkdown>

        <nav className="mt-16 grid gap-4 border-t border-stone-200 pt-8 sm:grid-cols-2 dark:border-stone-800">
          {prev ? (
            <Link
              to={`/docs/${prev.slug}`}
              className="group rounded-xl border border-stone-200 p-4 transition hover:border-clay-300 hover:bg-clay-50 dark:border-stone-800 dark:hover:border-clay-700 dark:hover:bg-clay-900/20"
            >
              <div className="text-xs font-medium text-stone-400">← Previous</div>
              <div className="mt-1 font-semibold text-stone-800 group-hover:text-clay-700 dark:text-stone-200 dark:group-hover:text-clay-300">
                {prev.title}
              </div>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/docs/${next.slug}`}
              className="group rounded-xl border border-stone-200 p-4 text-right transition hover:border-clay-300 hover:bg-clay-50 dark:border-stone-800 dark:hover:border-clay-700 dark:hover:bg-clay-900/20"
            >
              <div className="text-xs font-medium text-stone-400">Next →</div>
              <div className="mt-1 font-semibold text-stone-800 group-hover:text-clay-700 dark:text-stone-200 dark:group-hover:text-clay-300">
                {next.title}
              </div>
            </Link>
          )}
        </nav>
      </article>

      {toc.length > 1 && (
        <aside className="hidden w-56 shrink-0 xl:block">
          <div className="sticky top-24">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
              On this page
            </div>
            <ul className="space-y-2 border-l border-stone-200 dark:border-stone-800">
              {toc.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="block border-l-2 border-transparent -ml-px pl-4 text-sm text-stone-500 transition hover:border-clay-400 hover:text-clay-600 dark:text-stone-400 dark:hover:text-clay-400"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  )
}

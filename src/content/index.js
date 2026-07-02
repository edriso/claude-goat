// Load every markdown file in this folder as a raw string at build time.
// Keys look like './welcome.md'; we normalize them to slugs ('welcome').
const modules = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true })

const content = {}
for (const path in modules) {
  const slug = path.replace('./', '').replace('.md', '')
  content[slug] = modules[path]
}

export function getContent(slug) {
  return content[slug] ?? null
}

export default content

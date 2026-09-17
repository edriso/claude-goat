// Load every markdown file in this folder on demand, one chunk per page.
// The home page and the sidebar are driven entirely by src/data/nav.js, so they
// should never download the prose. Keys look like './welcome.md'; we normalize
// them to slugs ('welcome').
const loaders = import.meta.glob('./*.md', { query: '?raw', import: 'default' })

// A list rather than a slug-keyed object: the slug comes from the URL, and
// looking a loader up by that key directly would both resolve inherited
// prototype members ("toString") and hand a user-named callee to the caller.
const pages = Object.entries(loaders).map(([path, load]) => ({
  slug: path.replace('./', '').replace('.md', ''),
  load,
}))

/**
 * Whether a page exists. Synchronous: the glob keys are known at build time,
 * so DocPage can decide to render NotFound without waiting on a fetch.
 */
export function hasContent(slug) {
  return pages.some((page) => page.slug === slug)
}

/** Fetches one page's markdown. Each page is its own chunk. */
export async function loadContent(slug) {
  const page = pages.find((candidate) => candidate.slug === slug)
  return page ? page.load() : null
}

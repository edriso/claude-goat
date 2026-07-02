import { useRef, useState } from 'react'

/** Wraps <pre> blocks to add a one-click copy button. */
export default function CodeBlock({ children, ...props }) {
  const preRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const text = preRef.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <div className="group relative">
      <button
        onClick={copy}
        className="absolute right-3 top-3 z-10 rounded-md border border-stone-700 bg-stone-800/80 px-2 py-1 text-xs font-medium text-stone-300 opacity-0 transition hover:bg-stone-700 hover:text-white group-hover:opacity-100"
      >
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  )
}

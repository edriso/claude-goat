import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl">🐐</div>
      <h1 className="mt-4 text-3xl font-bold text-stone-900 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-stone-500 dark:text-stone-400">
        This goat wandered off the trail. Let's get you back to the good stuff.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-clay-500 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-clay-600"
      >
        Back home
      </Link>
    </div>
  )
}

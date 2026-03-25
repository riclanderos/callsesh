'use client'

export default function ClosePageButton() {
  return (
    <button
      type="button"
      onClick={() => window.close()}
      className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
    >
      Close page
    </button>
  )
}

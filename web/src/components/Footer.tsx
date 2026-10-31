export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm sm:px-6">
        <span className="font-sans font-medium text-ink">mendr</span>
        <div className="flex gap-6 font-mono text-[13px] text-ink-2">
          <a href="#how" className="m-press hover:text-ink">How it works</a>
          <a href="#trust" className="m-press hover:text-ink">Trust</a>
          <a href="https://github.com/silky-x0/Mendr" className="m-press hover:text-ink">GitHub</a>
        </div>
      </div>
    </footer>
  )
}

import { useEffect, useRef, useState } from 'react'

export type Tab = 'home' | 'about' | 'updates' | 'join'

export function Header({
  active,
  onChange,
}: {
  active: Tab
  onChange: (t: Tab) => void
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return
      if (!menuRef.current) return
      if (menuRef.current.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const tabs: Tab[] = ['home', 'about', 'updates', 'join']

  return (
    <header className="pt-8">
      <div className="max-w-7xl mx-auto px-10 md:px-16">
        <div className="hidden md:flex items-center justify-between relative">
          <button
            type="button"
            onClick={() => onChange('home')}
            className="font-extrabold text-3xl tracking-tight text-brand hover:opacity-90 transition-opacity"
            aria-label="Go to home"
          >
            blurbable
          </button>

          <nav className="absolute left-1/2 -translate-x-1/2 flex gap-8">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange(t)}
                className={
                  active === t
                    ? 'font-extrabold text-black'
                    : 'font-semibold text-gray-600 hover:text-black'
                }
              >
                {t}
              </button>
            ))}
          </nav>

          <div className="w-[96px]" />
        </div>

        <div className="md:hidden relative flex items-center justify-between">
          <button
            type="button"
            aria-label="Open menu"
            className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-black/5"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block w-5">
              <span className="block h-[2px] bg-black mb-1" />
              <span className="block h-[2px] bg-black mb-1" />
              <span className="block h-[2px] bg-black" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChange('home')}
            className="absolute left-1/2 -translate-x-1/2 font-extrabold text-3xl tracking-tight text-brand hover:opacity-90 transition-opacity"
            aria-label="Go to home"
          >
            blurbable
          </button>

          <div className="h-10 w-10" />

          {open && (
            <div
              ref={menuRef}
              className="absolute left-0 top-12 w-56 bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden z-50"
            >
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onChange(t)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 ${
                    active === t
                      ? 'font-extrabold text-black'
                      : 'font-semibold text-gray-700'
                  } hover:bg-black/5`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
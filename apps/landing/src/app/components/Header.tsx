/*
  Blurbable © 2025–2026 Daniel Zhu

  This file is part of the Blurbable project.
  All rights reserved.

  Proprietary. Reuse requires written permission and credit to
  Blurbable and Daniel Zhu, subject to the terms and exceptions
  in the repository's LICENSE. Credit alone is not permission.
*/

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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const tabs: Tab[] = ['home', 'about', 'updates', 'join']

  return (
    <header className="pt-5 md:pt-8">
      <div className="max-w-7xl mx-auto px-5 md:px-16">
        {/* Desktop */}
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

        {/* Mobile */}
        <div ref={menuRef} className="md:hidden relative flex items-center justify-between">
          {/* Hamburger: keep above everything */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="h-11 w-11 flex items-center justify-center rounded-md hover:bg-black/5 relative z-30"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block w-5">
              <span className="block h-[2px] bg-black mb-1" />
              <span className="block h-[2px] bg-black mb-1" />
              <span className="block h-[2px] bg-black" />
            </span>
          </button>

          {/* Center logo: keep BELOW the menu overlay so it can’t block clicks */}
          <button
            type="button"
            onClick={() => {
              onChange('home')
              setOpen(false)
            }}
            className="absolute left-1/2 -translate-x-1/2 font-extrabold text-3xl tracking-tight text-brand hover:opacity-90 transition-opacity z-10"
            aria-label="Go to home"
          >
            blurbable
          </button>

          <div className="h-11 w-11" />

          {open && (
            <div
              id="mobile-navigation"
              className="absolute left-0 top-12 w-56 bg-white/95 backdrop-blur border border-black/10 rounded-lg shadow-sm overflow-hidden z-50"
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

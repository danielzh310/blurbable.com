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
  const toggleRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return
      if (!menuRef.current) return
      if (menuRef.current.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onDocClick)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onDocClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const tabs: Tab[] = ['home', 'about', 'updates', 'join']

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between relative">
          <button
            type="button"
            onClick={() => onChange('home')}
            className="brand-wordmark"
            aria-label="Go to home"
          >
            blurbable
          </button>

          <nav className="desktop-nav" data-active={active} aria-label="Main navigation">
            <span className="nav-indicator" aria-hidden="true" />
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange(t)}
                className="nav-link"
                aria-current={active === t ? 'page' : undefined}
              >
                {t}
              </button>
            ))}
          </nav>

          <div className="w-[96px]" />
        </div>

        {/* Mobile */}
        <div ref={menuRef} className="md:hidden relative flex items-center justify-between">
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="menu-toggle"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChange('home')
              setOpen(false)
            }}
            className="brand-wordmark mobile-wordmark"
            aria-label="Go to home"
          >
            blurbable
          </button>

          <div className="h-11 w-11" />

          <nav
            id="mobile-navigation"
            className="mobile-menu"
            data-open={open}
            aria-label="Mobile navigation"
            aria-hidden={!open}
          >
            <div className="mobile-menu-inner">
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onChange(t)
                    setOpen(false)
                  }}
                  className="mobile-nav-link"
                  tabIndex={open ? 0 : -1}
                  aria-current={active === t ? 'page' : undefined}
                >
                  {t}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

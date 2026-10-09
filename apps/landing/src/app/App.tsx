/*
  Blurbable © 2025–2026 Daniel Zhu

  This file is part of the Blurbable project.
  All rights reserved.

  Proprietary. Reuse requires written permission and credit to
  Blurbable and Daniel Zhu, subject to the terms and exceptions
  in the repository's LICENSE. Credit alone is not permission.
*/

import { useEffect, useRef, useState } from 'react'
import { Header, Tab } from './components/Header'
import { BlurbCarousel } from './components/BlurbCarousel'
import { WaitlistForm } from './components/WaitlistForm'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [visibleTab, setVisibleTab] = useState<Tab>('home')
  const [leaving, setLeaving] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const previousTab = useRef(visibleTab)

  useEffect(() => {
    if (tab === visibleTab) {
      setLeaving(false)
      return
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setLeaving(!reducedMotion)
    const timer = window.setTimeout(() => {
      setVisibleTab(tab)
      setLeaving(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, reducedMotion ? 0 : 140)
    return () => window.clearTimeout(timer)
  }, [tab, visibleTab])

  useEffect(() => {
    if (previousTab.current !== visibleTab) {
      mainRef.current?.focus({ preventScroll: true })
      previousTab.current = visibleTab
    }
  }, [visibleTab])

  // Newest-first list (reverse chronological: most recent at top)
  const updates = [
    {
      date: 'July 2026',
      title: 'Building in Public',
      body:
        "We're currently in development, creating a space that prioritizes authentic human connection over metrics and engagement.",
    },
    {
      date: 'Coming Soon',
      title: 'Early Access Launch',
      body:
        'Sign up for early access and be among the first to share your thoughts on Blurbable.',
    },
  ]

  return (
    <div className="site-shell">
      {visibleTab !== 'join' && (
        <div className="header-shell">
          <Header active={tab} onChange={setTab} />
        </div>
      )}

      <main
        ref={mainRef}
        tabIndex={-1}
        aria-label={`${visibleTab.charAt(0).toUpperCase()}${visibleTab.slice(1)}`}
        aria-busy={leaving}
        className={visibleTab === 'join' ? 'main-content join-layout' : 'main-content page-layout'}
      >
        <div key={visibleTab} className={`page-panel ${leaving ? 'page-leaving' : 'page-entering'}`}>
          {visibleTab === 'home' && (
            <div className="home-layout">
              <div className="w-full">
                <div className="hero-grid">
                  {/* Hero */}
                  <div className="w-full min-w-0">
                    <div className="hero-copy">
                      <h1 className="hero-title reveal-first">
                        Your thoughts,{' '}<br />unfiltered
                      </h1>

                      <p className="hero-description reveal-second">
                        A text-first space for sharing honest thoughts, everyday moments,
                        and real human experiences. No pressure to be perfect.
                      </p>
                      <button
                        type="button"
                        onClick={() => setTab('join')}
                        className="primary-button hero-cta reveal-third"
                      >
                        Join the beta
                      </button>
                    </div>
                  </div>

                  {/* Carousel */}
                  <div className="w-full min-w-0 reveal-third">
                    <div className="w-full">
                      <BlurbCarousel />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {visibleTab === 'about' && (
            <section className="text-page about-page">
              <h1 className="page-title">About</h1>
              <p>
                Blurbable is a text-first social space focused on taste, identity,
                and low-effort expression.
              </p>
              <p>
                It’s not about authority, completeness, or performance. Just
                writing something honest and moving on.
              </p>
            </section>
          )}

          {visibleTab === 'updates' && (
            <section className="text-page">
              <h1 className="page-title">Updates</h1>

              {updates.map((u, i) => (
                <article key={u.title} className="update-entry">
                  <p className="text-sm text-gray-500">{u.date}</p>
                  <h2 className="mt-2 text-xl font-semibold text-black">{u.title}</h2>
                  <p className="mt-2 text-gray-600 leading-relaxed">{u.body}</p>

                  {i !== updates.length - 1 && (
                    <hr className="mt-8 border-gray-200" />
                  )}
                </article>
              ))}
            </section>
          )}

          {visibleTab === 'join' && (
            <section className="w-full flex items-center justify-center">
              <div className="w-full max-w-2xl text-center">
                {/* Clickable logo returns to home and restores header */}
                <button
                  type="button"
                  onClick={() => setTab('home')}
                  className="brand-wordmark join-wordmark"
                  aria-label="Back to home"
                >
                  blurbable
                </button>

                <WaitlistForm />
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

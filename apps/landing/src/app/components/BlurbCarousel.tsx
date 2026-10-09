/*
  Blurbable © 2025–2026 Daniel Zhu

  This file is part of the Blurbable project.
  All rights reserved.

  Proprietary. Reuse requires written permission and credit to
  Blurbable and Daniel Zhu, subject to the terms and exceptions
  in the repository's LICENSE. Credit alone is not permission.
*/

import { useEffect, useMemo, useRef, useState } from 'react'

type Blurb = {
  user: string
  text: string
  time: string
}

const BLURBS: Blurb[] = [
  { user: 'alex', text: "coffee tastes better when you don't check your phone", time: '2m ago' },
  {
    user: 'maya',
    text: `realized today that I've been pronouncing "gif" wrong my entire life and I'm not changing`,
    time: '15m ago',
  },
  { user: 'jordan', text: "the best kind of friday is when you forget it's friday", time: '1h ago' },
  { user: 'sam', text: 'hot take: grocery shopping at 10pm is peak adulting', time: '3h ago' },
  { user: 'riley', text: 'just witnessed a perfect parking job. felt like applauding but that would be weird', time: '5h ago' },
]

export function BlurbCarousel() {
  const base = useMemo(() => BLURBS, [])
  const n = base.length

  // clone last at front + clone first at end
  const slides = useMemo(() => {
    if (n === 0) return []
    return [base[n - 1], ...base, base[0]]
  }, [base, n])

  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const autoplayRef = useRef<number | null>(null)

  // Start at the first "real" slide (index 1)
  const [index, setIndex] = useState(1)
  const [paused, setPaused] = useState(false)
  const [focused, setFocused] = useState(false)
  const [autoplayStopped, setAutoplayStopped] = useState(false)
  const [canAutoplay, setCanAutoplay] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(
      '(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)',
    )
    const update = () => setCanAutoplay(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const AUTOPLAY_MS = 5200

  const scrollTo = (i: number, behavior: ScrollBehavior) => {
    const el = scrollerRef.current
    if (!el) return
    const w = el.clientWidth || 1
    el.scrollTo({ left: w * i, behavior })
  }

  // On mount, snap to index 1
  useEffect(() => {
    scrollTo(1, 'auto')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Helper: after transitions to clones, jump instantly to the matching real slide
  const normalizeIfOnClone = () => {
    const el = scrollerRef.current
    if (!el) return
    const w = el.clientWidth || 1
    const i = Math.round(el.scrollLeft / w)

    // If we are at the fake first (0), jump to real last (n)
    if (i === 0) {
      setIndex(n)
      scrollTo(n, 'auto')
      return
    }

    // If we are at the fake last (n+1), jump to real first (1)
    if (i === n + 1) {
      setIndex(1)
      scrollTo(1, 'auto')
      return
    }

    setIndex(i)
  }

  // Autoplay (only advances one slide; no rewind)
  useEffect(() => {
    if (paused || focused || autoplayStopped || !canAutoplay) return

    autoplayRef.current = window.setInterval(() => {
      const next = index + 1
      setIndex(next)
      scrollTo(next, 'smooth')
    }, AUTOPLAY_MS)

    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }, [paused, focused, autoplayStopped, index, canAutoplay])

  // If we programmatically set index to a clone, normalize right after movement ends
  // This helps for autoplay cases where scroll events can lag.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const onScrollEnd = () => {
      normalizeIfOnClone()
    }

    // "scrollend" isn't supported everywhere; use a small timeout fallback.
    let t: number | null = null
    const onScrollAny = () => {
      if (t) window.clearTimeout(t)
      t = window.setTimeout(onScrollEnd, 120)
    }

    el.addEventListener('scroll', onScrollAny, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScrollAny)
      if (t) window.clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n])

  // Resnap on resize
  useEffect(() => {
    const onResize = () => scrollTo(index, 'auto')
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (slides.length === 0) return null

  return (
    <aside
      className="blurb-preview"
      aria-label="Sample blurbs"
      aria-roledescription="carousel"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
    >
      <div className="w-full">
        <p className="preview-caption">A glimpse of Blurbable</p>

        {/* Stage */}
        <div
          className="blurb-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={scrollerRef}
            id="blurb-slides"
            className="bb-hide-scrollbar blurb-scroller flex snap-x snap-mandatory w-full overflow-x-auto overflow-y-hidden"
            tabIndex={0}
            aria-label="Sample blurbs. Swipe or use the arrow keys to browse."
          >
            {slides.map((b, i) => (
              <div
                key={`${b.user}-${b.time}-${i}`}
                className="blurb-slide flex-[0_0_100%] min-w-0 snap-start box-border"
                aria-hidden={i === 0 || i === n + 1 ? true : undefined}
              >
                <div
                  className="blurb-card"
                >
                  <div className="blurb-meta">
                    <span>@{b.user}</span><span>{b.time}</span>
                  </div>

                  <p className="blurb-text">
                    {b.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="carousel-controls" aria-label="Choose a sample blurb">
          {base.map((b, i) => {
            const active = ((index - 1 + n) % n) === i
            return (
              <button
                key={b.user}
                type="button"
                aria-label={`Show blurb ${i + 1} of ${n}`}
                aria-current={active ? 'true' : undefined}
                aria-controls="blurb-slides"
                onClick={() => {
                  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  scrollTo(i + 1, reducedMotion ? 'auto' : 'smooth')
                }}
                className="carousel-dot"
              >
                <span />
              </button>
            )
          })}
          {canAutoplay && (
            <button
              type="button"
              className="carousel-playback"
              aria-label={autoplayStopped ? 'Resume automatic previews' : 'Pause automatic previews'}
              onClick={() => setAutoplayStopped((value) => !value)}
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
                {autoplayStopped ? <path d="M5 3 13 8 5 13Z" /> : <path d="M4 3h3v10H4zm5 0h3v10H9z" />}
              </svg>
            </button>
          )}
        </div>

        <p className="preview-footer">
          Join to see more and share your own
        </p>
      </div>
    </aside>
  )
}

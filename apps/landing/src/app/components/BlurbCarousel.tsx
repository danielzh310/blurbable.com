/*
  Blurbable © 2025 Daniel Zhu

  This file is part of the Blurbable project.
  All rights reserved.

  This source code is proprietary and may not be copied,
  modified, distributed, or used without explicit written
  permission from the copyright holder.
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
    if (paused || !canAutoplay) return

    autoplayRef.current = window.setInterval(() => {
      const next = index + 1
      setIndex(next)
      scrollTo(next, 'smooth')
    }, AUTOPLAY_MS)

    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }, [paused, index, canAutoplay])

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
    <aside className="w-full" aria-label="Sample blurbs" aria-roledescription="carousel">
      <div className="grid gap-3 md:gap-6 w-full">
        <p className="text-center md:text-left text-gray-500">A glimpse of Blurbable</p>

        {/* Stage */}
        <div
          className="w-full overflow-hidden md:h-[120px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={scrollerRef}
            id="blurb-slides"
            className="bb-hide-scrollbar w-full md:h-full overflow-x-auto overflow-y-hidden"
            tabIndex={0}
            aria-label="Sample blurbs. Swipe or use the arrow keys to browse."
            style={{
              display: 'flex',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              .bb-hide-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            {slides.map((b, i) => (
              <div
                key={`${b.user}-${b.time}-${i}`}
                className="md:h-full md:px-3"
                aria-hidden={i === 0 || i === n + 1 ? true : undefined}
                style={{
                  flex: '0 0 100%',
                  minWidth: 0,
                  scrollSnapAlign: 'start',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  className="border border-gray-200 rounded-lg bg-white h-full w-full px-5 md:px-6 py-5"
                  style={{ boxSizing: 'border-box', overflow: 'hidden' }}
                >
                  <div className="text-sm text-gray-500 mb-2">
                    @{b.user} · {b.time}
                  </div>

                  <p className="leading-relaxed text-gray-800 md:line-clamp-2">
                    {b.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center md:hidden" aria-label="Choose a sample blurb">
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
                className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              >
                <span className={`h-2 rounded-full ${active ? 'w-5 bg-brand' : 'w-2 bg-gray-400'}`} />
              </button>
            )
          })}
        </div>

        <p className="w-full text-center text-gray-500">
          Join to see more and share your own
        </p>
      </div>
    </aside>
  )
}

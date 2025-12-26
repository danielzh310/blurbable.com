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

  const AUTOPLAY_MS = 5200
  const CARD_HEIGHT_PX = 120
  const SIDE_PADDING_PX = 12

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

  // Track scroll (manual swipes)
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        normalizeIfOnClone()
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n])

  // Autoplay (only advances one slide; no rewind)
  useEffect(() => {
    if (paused) return

    autoplayRef.current = window.setInterval(() => {
      const next = index + 1
      setIndex(next)
      scrollTo(next, 'smooth')
    }, AUTOPLAY_MS)

    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }, [paused, index])

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
    <aside className="w-full">
      <div className="grid gap-6 w-full">
        <p className="text-gray-500">A glimpse of Blurbable</p>

        {/* Stage */}
        <div
          className="w-full overflow-hidden"
          style={{ height: `${CARD_HEIGHT_PX}px` }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={scrollerRef}
            className="w-full h-full overflow-x-auto overflow-y-hidden"
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
                className="bb-hide-scrollbar"
                style={{
                  flex: '0 0 100%',
                  minWidth: 0,
                  height: '100%',
                  scrollSnapAlign: 'start',
                  boxSizing: 'border-box',
                  paddingLeft: `${SIDE_PADDING_PX}px`,
                  paddingRight: `${SIDE_PADDING_PX}px`,
                }}
              >
                <div
                  className="border border-gray-200 rounded-lg bg-white h-full w-full px-6 py-5"
                  style={{ boxSizing: 'border-box', overflow: 'hidden' }}
                >
                  <div className="text-sm text-gray-500 mb-2">
                    @{b.user} · {b.time}
                  </div>

                  <p
                    className="leading-relaxed text-gray-800"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {b.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="w-full text-center text-gray-500">
          Join to see more and share your own
        </p>
      </div>
    </aside>
  )
}
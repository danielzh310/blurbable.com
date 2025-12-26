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
  const blurbs = useMemo(() => BLURBS, [])
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const [paused, setPaused] = useState(false)
  const [index, setIndex] = useState(0)

  // Tuning
  const AUTOPLAY_MS = 5200
  const STAGE_MAX_WIDTH_PX = 560
  const CARD_HEIGHT_PX = 120

  const clampIndex = (i: number) => {
    const n = blurbs.length
    return (i % n + n) % n
  }

  const scrollToIndex = (i: number, behavior: ScrollBehavior) => {
    const el = scrollerRef.current
    if (!el) return
    const width = el.clientWidth || 1
    el.scrollTo({ left: width * i, behavior })
  }

  // Sync index to scroll position (manual drag)
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const width = el.clientWidth || 1
        const next = Math.round(el.scrollLeft / width)
        setIndex(clampIndex(next))
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [blurbs.length])

  // Autoplay (pause on hover)
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => {
      const next = clampIndex(index + 1)
      setIndex(next)
      scrollToIndex(next, 'smooth')
    }, AUTOPLAY_MS)

    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, index])

  // Resnap on resize
  useEffect(() => {
    const onResize = () => scrollToIndex(index, 'auto')
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return (
    <aside className="w-full" style={{ maxWidth: `${STAGE_MAX_WIDTH_PX}px` }}>
      <div
        className="grid"
        style={{
          gridTemplateRows: 'auto auto auto',
          rowGap: '24px',
        }}
      >
        <p className="text-gray-500">A glimpse of Blurbable</p>

        {/* CLIPPING MASK: no padding, no gap, always one card visible */}
        <div
          className="w-full"
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
              scrollBehavior: 'smooth',
            }}
          >
            <style>{`
              .bb-hide-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            {blurbs.map((b, i) => (
              <div
                key={i}
                className="bb-hide-scrollbar"
                style={{
                  flex: '0 0 100%',
                  height: '100%',
                  scrollSnapAlign: 'start',
                }}
              >
                {/* Card fills the stage so nothing peeks */}
                <div
                  className="border border-gray-200 rounded-lg bg-white h-full w-full px-6 py-5"
                  style={{
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                  }}
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

        <p className="text-center text-gray-500">
          Join to see more and share your own
        </p>
      </div>
    </aside>
  )
}
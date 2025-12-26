import { useEffect, useMemo, useState } from 'react'

type Blurb = {
  user: string
  text: string
  time: string
}

const BLURBS: Blurb[] = [
  { user: 'alex', text: "coffee tastes better when you don't check your phone", time: '2m ago' },
  { user: 'maya', text: "i'm not changing how i pronounce gif", time: '15m ago' },
  { user: 'jordan', text: "the best friday is when you forget it's friday", time: '1h ago' },
  { user: 'sam', text: 'hot take: grocery shopping at 10pm is peak adulting', time: '3h ago' },
  { user: 'riley', text: 'just witnessed a perfect parking job. felt like applauding but that would be weird', time: '5h ago' },
]

export function BlurbCarousel() {
  const blurbs = useMemo(() => BLURBS, [])
  const [index, setIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)

  const STAGE_MAX_WIDTH_PX = 520
  const CARD_HEIGHT_PX = 120

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setIndex((i) => (i + 1) % blurbs.length)
        setIsFading(false)
      }, 180)
    }, 3200)

    return () => clearInterval(interval)
  }, [blurbs.length])

  const b = blurbs[index]

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

        {/* Restored white card */}
        <div
          className="border border-gray-200 rounded-lg px-6 py-5 bg-white w-full"
          style={{
            height: `${CARD_HEIGHT_PX}px`,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div
            className={`transition-opacity duration-300 ease-in-out ${
              isFading ? 'opacity-0' : 'opacity-100'
            }`}
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

        <p className="text-center text-gray-500">
          Join to see more and share your own
        </p>
      </div>
    </aside>
  )
}
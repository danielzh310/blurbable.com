import { useState } from 'react'
import { Header, Tab } from './components/Header'
import { BlurbCarousel } from './components/BlurbCarousel'
import { WaitlistForm } from './components/WaitlistForm'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <div className="min-h-screen text-black bg-[#f3f9f7]">
      <Header active={tab} onChange={setTab} />

      {/* Increased side padding only */}
      <main className="max-w-7xl mx-auto px-10 md:px-16">
        {tab === 'home' && (
          <div className="min-h-[calc(100vh-140px)] flex items-center">
            <div className="w-full grid md:grid-cols-2 gap-14 md:gap-16 items-start py-16 md:py-0">
              {/* Hero */}
              <div className="w-full">
                <div className="hero-copy mx-auto text-center md:text-left">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    Your thoughts, unfiltered
                  </h1>

                  <p className="mt-6 text-gray-600 leading-relaxed">
                    A text-first space for sharing honest thoughts, everyday moments,
                    and real human experiences. No pressure to be perfect.
                  </p>
                </div>
              </div>

              {/* Carousel */}
              <div className="w-full flex justify-center md:justify-end">
                <div
                  className="w-full max-w-xl"
                  style={{ height: '210px' }}
                >
                  <BlurbCarousel />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'about' && (
          <section className="max-w-2xl mx-auto py-16 space-y-4 text-gray-600">
            <h2 className="text-xl font-semibold text-black">About</h2>
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

        {tab === 'updates' && (
          <section className="max-w-2xl mx-auto py-16 space-y-6">
            <h2 className="text-xl font-semibold">Updates</h2>
            <p className="text-gray-600">
              Landing page live. App in progress.
            </p>
          </section>
        )}

        {tab === 'join' && (
          <section className="max-w-md mx-auto py-16">
            <WaitlistForm />
          </section>
        )}
      </main>
    </div>
  )
}
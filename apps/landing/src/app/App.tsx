import { useState } from 'react'
import { Header, Tab } from './components/Header'
import { BlurbCarousel } from './components/BlurbCarousel'
import { WaitlistForm } from './components/WaitlistForm'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <div className="min-h-screen text-black bg-[#f3f9f7] overflow-x-hidden">
      <Header active={tab} onChange={setTab} />

      {/* Increased side padding only */}
      <main className="max-w-7xl mx-auto px-10 md:px-16 overflow-x-hidden">
        {tab === 'home' && (
          <div className="min-h-[calc(100vh-140px)] flex items-center">
            <div className="w-full py-12 md:py-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                {/* Hero */}
                <div className="w-full min-w-0">
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
                <div className="w-full min-w-0 flex justify-center md:justify-end">
                  <div className="w-full md:max-w-xl md:h-[210px]">
                    <BlurbCarousel />
                  </div>
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
          <section className="max-w-2xl mx-auto py-16">
            <h2 className="text-xl font-semibold">Updates</h2>

            {[
              {
                date: 'December 2025',
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
            ].map((u, i, arr) => (
              <div key={u.title} className="mt-8">
                <p className="text-sm text-gray-500">{u.date}</p>
                <h3 className="mt-2 font-semibold text-black">{u.title}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{u.body}</p>

                {i !== arr.length - 1 && (
                  <hr className="mt-8 border-gray-200" />
                )}
              </div>
            ))}
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
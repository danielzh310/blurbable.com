/*
  Blurbable © 2025–2026 Daniel Zhu

  This file is part of the Blurbable project.
  All rights reserved.

  Proprietary. Reuse requires written permission and credit to
  Blurbable and Daniel Zhu, subject to the terms and exceptions
  in the repository's LICENSE. Credit alone is not permission.
*/

import { useState } from 'react'
import { Header, Tab } from './components/Header'
import { BlurbCarousel } from './components/BlurbCarousel'
import { WaitlistForm } from './components/WaitlistForm'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')

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
    <div className="min-h-screen text-black bg-[#f3f9f7] overflow-x-hidden">
      {/* Header fades in and is hidden entirely in join mode */}
      {tab !== 'join' && (
        <div className="fade-up relative z-20">
          <Header active={tab} onChange={setTab} />
        </div>
      )}

      <main
        className={
          tab === 'join'
            ? 'min-h-screen flex items-start md:items-center justify-center px-2 py-6 md:px-16 md:py-12'
            : 'max-w-7xl mx-auto px-5 md:px-16 overflow-x-hidden'
        }
      >
        <div className="w-full fade-up">
          {tab === 'home' && (
            <div className="md:min-h-[calc(100vh-140px)] flex items-center">
              <div className="w-full py-10 md:py-0">
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
                      <button
                        type="button"
                        onClick={() => setTab('join')}
                        className="mt-6 min-h-12 w-full max-w-sm rounded-full bg-brand px-6 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:hidden"
                      >
                        Join the beta
                      </button>
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

              {updates.map((u, i) => (
                <div key={u.title} className="mt-8">
                  <p className="text-sm text-gray-500">{u.date}</p>
                  <h3 className="mt-2 font-semibold text-black">{u.title}</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">{u.body}</p>

                  {i !== updates.length - 1 && (
                    <hr className="mt-8 border-gray-200" />
                  )}
                </div>
              ))}
            </section>
          )}

          {tab === 'join' && (
            <section className="w-full flex items-center justify-center">
              <div className="w-full max-w-2xl text-center">
                {/* Clickable logo returns to home and restores header */}
                <button
                  type="button"
                  onClick={() => setTab('home')}
                  className="mx-auto block text-[#0a4b39] font-extrabold tracking-tight text-4xl md:text-6xl hover:opacity-90 transition"
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

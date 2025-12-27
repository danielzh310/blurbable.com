/*
  Blurbable © 2025 Daniel Zhu

  This file is part of the Blurbable project.
  All rights reserved.

  This source code is proprietary and may not be copied,
  modified, distributed, or used without explicit written
  permission from the copyright holder.
*/

import { useState } from 'react'
import { Header, Tab } from './components/Header'
import { BlurbCarousel } from './components/BlurbCarousel'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')

  // Local-only waitlist no backend
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    setTimeout(() => {
      setSubmitted(false)
      setName('')
      setEmail('')
    }, 2500)
  }

  return (
    <div className="min-h-screen text-black bg-[#f3f9f7] overflow-x-hidden">
      {/* Header fades in nd is hidden entirely in join mode*/}
      {tab !== 'join' && (
        <div className="fade-up">
          <Header active={tab} onChange={setTab} />
        </div>
      )}

      <main
        className={
          tab === 'join'
            ? 'min-h-screen flex items-center justify-center px-10 md:px-16'
            : 'max-w-7xl mx-auto px-10 md:px-16 overflow-x-hidden'
        }
      >
        <div className="w-full fade-up">
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

                  {i !== arr.length - 1 && <hr className="mt-8 border-gray-200" />}
                </div>
              ))}
            </section>
          )}

          {tab === 'join' && (
            <section className="w-full flex items-center justify-center">
              <div className="w-full max-w-sm text-center">
                {/* Clickable logo returns to home and restores header */}
                <button
                  type="button"
                  onClick={() => setTab('home')}
                  className="mx-auto block text-[#0a4b39] font-extrabold tracking-tight text-5xl md:text-6xl hover:opacity-90 transition"
                  aria-label="Back to home"
                >
                  blurbable
                </button>

                <form onSubmit={handleJoinSubmit} className="mt-10 space-y-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    autoComplete="name"
                    className="w-full rounded-full border border-gray-300 bg-transparent px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4b39]"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    autoComplete="email"
                    required
                    className="w-full rounded-full border border-gray-300 bg-transparent px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4b39]"
                  />

                  <button
                    type="submit"
                    disabled={!email || submitted}
                    className="w-full rounded-full bg-[#0a4b39] text-white py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {submitted ? 'You’re in' : 'Join'}
                  </button>

                  <p className="pt-2 text-xs text-gray-500">
                    Early access. No spam. Leave anytime.
                  </p>
                </form>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
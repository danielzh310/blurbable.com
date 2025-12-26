/*
  Blurbable © 2025 Daniel Zhu

  This file is part of the Blurbable project.
  All rights reserved.

  This source code is proprietary and may not be copied,
  modified, distributed, or used without explicit written
  permission from the copyright holder.
*/

import { useState } from 'react'

export function WaitlistForm() {
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="text-center">
        <p className="font-semibold">You’re on the list.</p>
        <p className="text-gray-500 mt-1">We’ll be in touch.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setDone(true)
      }}
      className="space-y-4 border rounded-lg p-6"
    >
      <h3 className="font-semibold text-lg">Join Blurbable</h3>

      <input
        placeholder="username"
        className="w-full border rounded px-4 py-3"
        required
      />

      <input
        type="email"
        placeholder="email"
        className="w-full border rounded px-4 py-3"
        required
      />

      <button className="w-full bg-black text-white py-3 rounded">
        Get early access
      </button>

      <p className="text-sm text-gray-500 text-center">
        No spam. Just occasional updates.
      </p>
    </form>
  )
}
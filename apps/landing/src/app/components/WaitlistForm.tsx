/*
  Blurbable © 2025–2026 Daniel Zhu

  This file is part of the Blurbable project.
  All rights reserved.

  Proprietary. Reuse requires written permission and credit to
  Blurbable and Daniel Zhu, subject to the terms and exceptions
  in the repository's LICENSE. Credit alone is not permission.
*/

import { useState } from 'react'

// Public hosted form URL; no private API credentials are needed on the site.
const BETA_SIGNUP_URL =
  'https://98fdaec9.sibforms.com/serve/MUIFALJebGxdGNKIPjIzwBgNeyOGmsBqnO5AsxXIpfQ0tgYifwsLmOWlMhCYALmPSaxZq3tAy_ckgU921V8mQaHwrplRYgzvHkwj7AJBS5fWAvmLN3rfkYSztnWiM41NmuJGJMh426JRALWGKJwQ4AcDasBGiq5bQPI6af93A_ezGQp6Q9-0OhXnVpmNxFLDWlFewT8cLbdF8IaNCw=='

export function WaitlistForm() {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="waitlist-content">
      <p className="waitlist-intro">
        Sign up for beta invitations and Blurbable updates.
      </p>
      <div className="signup-frame" data-loaded={loaded}>
        {!loaded && <p className="signup-loading" role="status">Loading signup form…</p>}
        <iframe
          src={BETA_SIGNUP_URL}
          title="Join the Blurbable beta waitlist"
          onLoad={() => setLoaded(true)}
          className="signup-embed"
        />
      </div>
      <p className="signup-fallback">
        Form not loading?{' '}
        <a
          href={BETA_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          Open the signup form in a new tab
        </a>
      </p>
    </div>
  )
}

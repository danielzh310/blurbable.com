/*
  Blurbable © 2025–2026 Daniel Zhu

  This file is part of the Blurbable project.
  All rights reserved.

  Proprietary. Reuse requires written permission and credit to
  Blurbable and Daniel Zhu, subject to the terms and exceptions
  in the repository's LICENSE. Credit alone is not permission.
*/

// Public hosted form URL; no private API credentials are needed on the site.
const BETA_SIGNUP_URL =
  'https://98fdaec9.sibforms.com/serve/MUIFALJebGxdGNKIPjIzwBgNeyOGmsBqnO5AsxXIpfQ0tgYifwsLmOWlMhCYALmPSaxZq3tAy_ckgU921V8mQaHwrplRYgzvHkwj7AJBS5fWAvmLN3rfkYSztnWiM41NmuJGJMh426JRALWGKJwQ4AcDasBGiq5bQPI6af93A_ezGQp6Q9-0OhXnVpmNxFLDWlFewT8cLbdF8IaNCw=='

export function WaitlistForm() {
  return (
    <div className="mt-4 space-y-3 md:mt-8 md:space-y-4">
      <p className="px-3 text-sm text-gray-600">
        Sign up for beta invitations and Blurbable updates.
      </p>
      <iframe
        src={BETA_SIGNUP_URL}
        title="Join the Blurbable beta waitlist"
        className="block w-full h-[620px] md:h-[720px] border-0 rounded-lg bg-white"
      />
      <p className="text-sm text-gray-600">
        Form not loading?{' '}
        <a
          href={BETA_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline underline-offset-4 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          Open the signup form in a new tab
        </a>
      </p>
    </div>
  )
}

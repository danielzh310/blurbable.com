# Landing page

Run `npm install` and `npm run dev` from this directory. Run `npm run build`
to generate the static site in `dist/`, and `npx tsc --noEmit` to check types.

Use Node.js 20 or newer for the current build tooling. Tailwind CSS 4 targets
Safari 16.4+, Chrome 111+, and Firefox 128+; older browsers are not supported.

## Preview on your phone

Run `npm run dev:mobile` from this directory. Keep the terminal open and connect
your phone to the same Wi-Fi as your computer. Open the **Network** URL Vite
prints (port 5174) in your phone's browser. Edits update automatically.
On the computer, open `http://localhost:5174`. Press Ctrl+C to stop the server.
Use this development server only on a trusted local network, never for public hosting.
If Windows asks, allow Node.js access on your private network.

## Beta signup

The Join page embeds the public Brevo form configured in
`src/app/components/WaitlistForm.tsx`. Brevo stores submissions and handles
validation, CAPTCHA, confirmation emails, and success/error messages. No
server or private API key is required for this integration, including when
the built site is hosted on GitHub Pages.

Manage the form in Brevo under **Marketing > Forms**. Its fields, appearance,
destination list, and confirmation settings are controlled there. Save with
**Done** after changes. If you replace the form, update `BETA_SIGNUP_URL` with
the new public URL from the **Share** step. The direct-link fallback uses the
same URL.

Before announcing the waitlist:

1. Check that the form's destination list is **Blurbable Beta**.
2. Check the confirmation setting. If double confirmation is enabled, make
   the submission message say to check email; joining is not complete until
   the confirmation link is clicked.
3. Publish the rebuilt site through the existing Vercel project's deployment
   process. Its project Root Directory should be `apps/landing`, so Vercel
   reads this app's `vercel.json` security headers and redirect.
4. Open **Join** on the published site, enter an email address you control,
   complete the CAPTCHA, and submit. Complete any email confirmation.
5. Verify the address appears in the intended list in Brevo. Also check the
   form on mobile and the link that opens it in a new tab.

Fetching the public form or building the site does not verify that a signup
was saved or a confirmation email was delivered. That requires the test above.

## Production domains and security

Production is hosted on Vercel at `https://www.blurbable.com`. Add both
`www.blurbable.com` and `blurbable.com` under the same project's **Settings >
Domains**. Set the root domain to redirect permanently to
`https://www.blurbable.com`. Use the DNS records Vercel currently recommends
for this project; do not guess new DNS addresses.

Both names need valid TLS certificates, including the redirecting root domain.
A redirect in `vercel.json` cannot repair a certificate: TLS validation happens
before the browser receives the redirect. Vercel provisions certificates after
domain verification succeeds. Wait for both domains to show valid configuration
and certificates, then verify without disabling certificate validation:

```powershell
curl.exe -I https://blurbable.com
curl.exe -I https://www.blurbable.com
curl.exe -IL http://blurbable.com
```

The root domain should redirect to HTTPS on `www`, which should return 200.
Vercel supplies HTTPS enforcement and HSTS. The app's `vercel.json` additionally
restricts scripts, styles, frames, and browser permissions and prevents framing
the landing page. Its CSP permits Google Fonts and the exact Brevo form host.
Brevo's embedded document manages its own scripts, CAPTCHA, and form submission;
the parent page does not need to allow inline scripts or direct Google CAPTCHA
scripts. Keep the policy in sync if the form host or site integrations change.

These production headers apply on deployment, not through the Vite dev server.
After deployment, verify the response headers and test the carousel, navigation,
and a real signup. Never put Brevo API keys or CAPTCHA secret keys in client code.
If a secret key has been shared in a screenshot, replace it in the provider
console and Brevo. Public site keys and the hosted signup URL are not secrets.

# Landing page

Run `npm install` and `npm run dev` from this directory. Run `npm run build`
to generate the static site in `dist/`, and `npx tsc --noEmit` to check types.

## Preview on your phone

Run `npm run dev:mobile` from this directory. Keep the terminal open and connect
your phone to the same Wi-Fi as your computer. Open the **Network** URL Vite
prints (port 5174) in your phone's browser. Edits update automatically.
On the computer, open `http://localhost:5174`. Press Ctrl+C to stop the server.
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
3. Publish the rebuilt site through your hosting provider's existing process.
   This repository does not currently include a deployment workflow.
4. Open **Join** on the published site, enter an email address you control,
   complete the CAPTCHA, and submit. Complete any email confirmation.
5. Verify the address appears in the intended list in Brevo. Also check the
   form on mobile and the link that opens it in a new tab.

Fetching the public form or building the site does not verify that a signup
was saved or a confirmation email was delivered. That requires the test above.

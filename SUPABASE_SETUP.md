# Connect your existing app to Supabase

## 1. Create or select a Supabase project

Open https://supabase.com/dashboard and create a project, or select an existing one.
Wait until it is ready. No custom users table, SQL migration, or database password is needed for this app.

## 2. Copy the frontend configuration

Use the project's **Connect** dialog to find the project URL and a public key.
Keys are also available under **Settings → API Keys**. Use the legacy **anon** key
or the newer **publishable** key (`sb_publishable_...`). Both work in this app's
`VITE_SUPABASE_ANON_KEY` variable. Never use a service-role key or `sb_secret_...` key.

From the project folder, run:

```sh
npm install
cp -n .env.example .env
```

The `-n` prevents overwriting an existing .env. Open `.env` in your editor and fill in:

```dotenv
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-public-or-anon-key
```

These are placeholders, not working credentials. Do not paste database passwords here.
Vite exposes VITE_ variables to the browser, so these must be public values.
The .env file is ignored by Git; .env.example contains only empty variable names.
Restart Vite whenever you change .env.

## 3. Enable email authentication

In **Authentication → Sign In / Providers**, enable **Email** and allow new user signups.
Leave **Confirm Email** enabled if you want users to verify their email address.
The app displays confirmation instructions after signup and supports the default
Supabase confirmation email template. If confirmation is disabled, signup opens
Welcome immediately. For normal use, keeping confirmation enabled is recommended.

Under **Authentication → URL Configuration**, set **Site URL** to:

```text
http://localhost:5173
```

Also add `http://localhost:5173` to the allowed redirect URLs. This app uses the
Site URL as the default email-confirmation destination. If Vite uses another port,
update these URLs accordingly and open that same origin in your browser.
When deploying, change Site URL to your production HTTPS URL and add it to allowed
redirect URLs. Configure these same environment variables with your hosting provider.

For email delivery to arbitrary users, configure **custom SMTP** in Authentication's
email settings. Supabase's default sender is restricted to project team addresses
and is rate limited, so test with a team-member email until SMTP is configured.

Official references:
- https://supabase.com/docs/guides/getting-started/api-keys
- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/auth/redirect-urls
- https://supabase.com/docs/guides/auth/auth-smtp

## 4. Run the app

```sh
npm run dev
```

Open the local URL printed in the terminal. Additional checks:

```sh
npm test
npm run lint
npm run build
```

## 5. Try the full flow

1. Open Create an Account; enter your name, email, and a matching password pair.
2. A mismatch should show an error without calling Supabase.
3. Use a password of at least six characters (or your project's stronger policy).
4. If email confirmation is enabled, open the confirmation email before logging in.
5. Log in; Welcome should display the name you entered.
6. Refresh the page; the Supabase session should keep you logged in.
7. Click Logout; you should return to Login. Refresh to check you stay logged out.
8. Try a wrong password; expect “Invalid email or password”.
9. In **Authentication → Users**, you can inspect the new user and name metadata.

## How the code is organized

- `src/lib/supabase.js`: creates one Supabase client from environment variables;
  missing configuration shows a useful message instead of crashing the page.
- `src/lib/auth.js`: validates signup fields, calls Supabase Auth, and translates
  common login errors into clear messages. It does not insert database records.
- `src/App.jsx`: connects both forms, shows progress/messages, restores sessions,
  listens for auth changes, and signs users out. The listener is cleaned up when
  the component unmounts. Form passwords are cleared after successful submission.
- `src/components/Welcome.jsx`: shows the session user's name/email and Logout.
- `src/App.css`: adds only feedback, disabled-control, and Welcome styling.
- `tests/auth.test.js`: checks validation and auth results using a fake client;
  no real accounts, passwords, or Supabase requests are used in automated tests.

Supabase Auth handles password storage and session tokens. Only the name goes into
user metadata, and React displays it as text. Metadata is editable profile data,
not a source of permissions. This app does not create/query application tables;
if you add private tables later, protect them with Row Level Security policies.
Showing Welcome in React is not a substitute for database access rules.

Live signup/email delivery/login/logout require your own configured project;
the automated tests do not verify your project's settings or email delivery.

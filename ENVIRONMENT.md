# Environment Variables — Setup Guide

Every variable this project reads, what it does, and exactly where to get its
value.

There are **14 variables**. Right now **11 are set** and **3 are blank** — all
three are the Microsoft 365 mail credentials, which are the only thing standing
between you and email alerts landing in your inbox. Jump to
[SMTP_USER / SMTP_PASS](#4-smtp_user--smtp_pass) if that's all you came for.

---

## How the files work

| File | What it is | In git? |
|---|---|---|
| `.env` | **Your real values.** This is the file the app actually reads. | **No** — gitignored |
| `.env.example` | The template, with blanks and comments. Committed so the next person knows what to fill in. | Yes |

Rules worth knowing:

- **Never commit `.env`.** It holds your database password and signing secret.
  It's already in `.gitignore`; leave it there.
- **Restart `next dev` after editing `.env`.** Next usually picks changes up on
  its own, but a restart removes all doubt — press `Ctrl+C` in the terminal and
  run `pnpm dev` again.
- **`NEXT_PUBLIC_*` variables are baked into the browser bundle at build time.**
  Two consequences: they are *visible to anyone* who views the site, so never
  put a secret in one; and changing one in production requires a **rebuild**, not
  just a restart.
- Values with spaces or `#` should be quoted: `EMAIL_FROM_NAME="MStack 360"`.

---

## Status at a glance

| Variable | Status | Needed for |
|---|---|---|
| `DATABASE_URI` | ✅ Set | Everything — the site won't boot without it |
| `PAYLOAD_SECRET` | ✅ Set | Staying logged in to `/admin` |
| `NEXT_PUBLIC_SERVER_URL` | ✅ Set (localhost) | Links inside alert emails |
| `SMTP_HOST` | ✅ Set | Sending email |
| `SMTP_PORT` | ✅ Set | Sending email |
| `SMTP_USER` | ❌ **Blank** | Sending email |
| `SMTP_PASS` | ❌ **Blank** | Sending email |
| `EMAIL_FROM_ADDRESS` | ❌ **Blank** | Sending email |
| `EMAIL_FROM_NAME` | ✅ Set | Sending email |
| `NOTIFY_EMAIL_TO` | ✅ Set | Who receives quote alerts |
| `VAPID_PUBLIC_KEY` | ✅ Set | Browser push |
| `VAPID_PRIVATE_KEY` | ✅ Set | Browser push |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | ✅ Set | Browser push |
| `VAPID_SUBJECT` | ✅ Set | Browser push |

Until `SMTP_USER` and `SMTP_PASS` are filled in, Payload **logs emails to the
terminal instead of sending them**. That's deliberate — it's the safe default,
not a bug. You'll see lines like:

```
INFO: Email attempted without being configured. To: 'you@example.com',
      Subject: 'New quote request — Acme Ltd (£560/mo)'
```

---

## 1. `DATABASE_URI`

**What it does:** The MongoDB connection string. Payload stores every service
request, service, industry, case study and admin user here. Nothing works
without it.

**Status:** ✅ Already set — you're connected to a working database. Don't
change it unless you're moving databases.

### If you ever need a new one (MongoDB Atlas, free tier)

1. Go to <https://cloud.mongodb.com> and sign in.
2. **Create a free cluster** — pick the **M0 Free** tier. No card required.
3. In the left sidebar go to **Database Access** → **Add New Database User**.
   Choose a username and password. **Copy the password now** — Atlas won't show
   it again.
4. Go to **Network Access** → **Add IP Address**. For development click
   *Allow access from anywhere* (`0.0.0.0/0`). For production, restrict this to
   your host's IP addresses.
5. Go to **Database** → **Connect** → **Drivers**. Copy the string. It looks
   like:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the real password, and add the database name
   `mstack360` **before** the `?`:
   ```
   DATABASE_URI=mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/mstack360?retryWrites=true&w=majority
   ```

> **Gotcha:** if your password contains `@`, `:`, `/` or `#`, it must be
> percent-encoded (`@` → `%40`). Easiest fix is to use a password with only
> letters and numbers.

**Local alternative:** with MongoDB installed on your machine, use
`mongodb://127.0.0.1:27017/mstack360`.

---

## 2. `PAYLOAD_SECRET`

**What it does:** The key Payload uses to sign and encrypt login tokens. Change
it and everyone is instantly logged out of `/admin`.

**Status:** ✅ Already set (64 characters — a good length).

### To generate a new one

Run this in the project folder:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the output:

```
PAYLOAD_SECRET=3f9a1c...64_hex_characters...b2e7
```

> **Keep it secret and keep it stable.** Anyone with this value can forge admin
> sessions. Use a *different* secret in production than in development.

---

## 3. `NEXT_PUBLIC_SERVER_URL`

**What it does:** The site's own base address. Used to build the absolute
"Open in dashboard" link inside quote-alert emails.

**Status:** ✅ Set to `http://localhost:3000` — correct for development.

**When you go live**, change it to your real domain:

```
NEXT_PUBLIC_SERVER_URL=https://mstack360.com
```

> Get this wrong in production and the button in your alert emails will point
> at `localhost` and do nothing on your phone. No trailing slash.
>
> This is `NEXT_PUBLIC_`, so changing it in production needs a **rebuild**.

---

## 4. `SMTP_USER` / `SMTP_PASS`

**What they do:** The mailbox that sends email — both Payload's password-reset
emails and your new-quote-request alerts.

**Status:** ❌ **Both blank.** This is the only thing left to do.

Microsoft has disabled SMTP AUTH by default on most tenants, so this takes two
steps: turn it on for the mailbox, then create an app password.

### Step A — enable Authenticated SMTP for the mailbox

1. Go to the **Microsoft 365 admin center**: <https://admin.microsoft.com>
2. **Users** → **Active users** → click the mailbox you want to send from
   (e.g. `noreply@mstack360.com` or your own address).
3. Open the **Mail** tab.
4. Under *Email apps*, click **Manage email apps**.
5. Tick **Authenticated SMTP**. Save.

> If the tenant has security defaults enforced, you may also need to allow SMTP
> AUTH tenant-wide: **Exchange admin center** (<https://admin.exchange.microsoft.com>)
> → **Settings** → **Mail flow** → make sure *Turn off SMTP AUTH protocol for
> your organization* is **unchecked**.

### Step B — create an app password

Your normal password will be rejected if MFA is on the account.

1. Go to <https://mysignins.microsoft.com/security-info> signed in as that
   mailbox.
2. Click **Add sign-in method** → **App password**.
3. Name it something like `MStack360 Website`.
4. **Copy the generated password immediately** — it is shown once.

> **Don't see the App password option?** Your admin has disabled it. In that
> case use the fallback below.

### Step C — fill them in

```
SMTP_USER=noreply@mstack360.com
SMTP_PASS=the-app-password-you-just-copied
```

`SMTP_USER` must be the **full email address**, not just the username.

### Fallback if Microsoft 365 blocks you

Many tenants now block basic auth entirely, and no amount of clicking will fix
it. Two options that work today:

- **Gmail** — free, 500 emails/day. Enable 2-Step Verification, then create an
  app password at <https://myaccount.google.com/apppasswords>. Set
  `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=you@gmail.com`.
- **Resend** — 3,000 emails/month free, sends from your own domain, best
  deliverability. Sign up at <https://resend.com>, verify `mstack360.com` by
  adding the DNS records they give you, then create an API key. Set
  `SMTP_HOST=smtp.resend.com`, `SMTP_PORT=587`, `SMTP_USER=resend`, and
  `SMTP_PASS=` your API key.

Both are drop-in — no code changes needed.

---

## 5. `SMTP_HOST` / `SMTP_PORT`

**What they do:** Which mail server to connect to, and on which port.

**Status:** ✅ Set to `smtp.office365.com` and `587` — correct for Microsoft 365.

Port `587` is STARTTLS, which is what the code expects (`secure: false` in
`payload.config.ts`). Only change these if you switch providers — see the
fallback list above for the right values.

---

## 6. `EMAIL_FROM_ADDRESS` / `EMAIL_FROM_NAME`

**What they do:** The "From" line recipients see.

**Status:** `EMAIL_FROM_ADDRESS` ❌ blank · `EMAIL_FROM_NAME` ✅ set to
`MStack360`.

```
EMAIL_FROM_ADDRESS=noreply@mstack360.com
EMAIL_FROM_NAME=MStack360
```

> **This must be an address the mailbox is allowed to send as** — normally the
> same as `SMTP_USER`, or an alias it has Send As rights on. Microsoft rejects
> mismatches outright.
>
> If left blank the code falls back to `SMTP_USER`, so it's safe to leave empty
> once SMTP is configured — but setting it explicitly is clearer.

---

## 7. `NOTIFY_EMAIL_TO`

**What it does:** Who gets emailed when someone submits the pricing
configurator on a `/solutions/[slug]` page.

**Status:** ✅ Set to your Gmail address.

Change it to whoever should handle leads. Comma-separate for several people —
no spaces needed:

```
NOTIFY_EMAIL_TO=sales@mstack360.com,hisham@mstack360.com
```

Leave it **blank** to switch email alerts off entirely. Browser push is
independent and keeps working either way.

---

## 8. `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `NEXT_PUBLIC_VAPID_PUBLIC_KEY`

**What they do:** Your identity to the browsers' push services (Google,
Mozilla, Apple). Push notifications are free — these keys are how those
services know a push genuinely came from your site.

**Status:** ✅ All three set. A keypair has already been generated for you.

The public key appears **twice on purpose**:

- `VAPID_PUBLIC_KEY` — read on the server when sending.
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — shipped to the browser so it can subscribe.

They must be **identical**. It's public by design, so exposing it is fine.
`VAPID_PRIVATE_KEY` is the opposite — treat it like a password.

### To generate a new pair (only if you must)

```bash
node -e "console.log(JSON.stringify(require('web-push').generateVAPIDKeys()))"
```

Copy `publicKey` into **both** public variables and `privateKey` into the
private one.

> ⚠️ **Regenerating invalidates every existing subscription.** Everyone who
> turned notifications on has to go to the dashboard and turn them on again.
> There's no reason to rotate these routinely — keep the pair stable.

---

## 9. `VAPID_SUBJECT`

**What it does:** A contact address the push service can use to reach you if
your notifications start misbehaving. Required by the Web Push spec.

**Status:** ✅ Set to your Gmail address.

Must be a `mailto:` URL (or an `https://` URL):

```
VAPID_SUBJECT=mailto:hisham@mstack360.com
```

---

## Going live

When you deploy, **do not upload `.env`.** Every host has its own place to
store these:

**Vercel** — Project → **Settings** → **Environment Variables**. Add each one,
choosing the *Production* environment. Redeploy afterwards so `NEXT_PUBLIC_*`
values get baked into the new build.

Two values that **must** change in production:

| Variable | Change to |
|---|---|
| `NEXT_PUBLIC_SERVER_URL` | `https://mstack360.com` |
| `PAYLOAD_SECRET` | A **different** random 64-char string from your local one |

Also confirm your MongoDB Atlas **Network Access** allows your host's IPs, or
production will hang on every page that reads the database.

> **Push needs HTTPS in production.** Browsers only allow push in a secure
> context. `localhost` is treated as secure so development works over plain
> HTTP, but a LAN address like `192.168.1.3:3000` will not.

---

## Checking your work

**Is a variable actually being read?** This prints which are set without
revealing any secret values:

```bash
node --env-file=.env -e "['DATABASE_URI','PAYLOAD_SECRET','NEXT_PUBLIC_SERVER_URL','SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','EMAIL_FROM_ADDRESS','EMAIL_FROM_NAME','NOTIFY_EMAIL_TO','VAPID_PUBLIC_KEY','VAPID_PRIVATE_KEY','NEXT_PUBLIC_VAPID_PUBLIC_KEY','VAPID_SUBJECT'].forEach(k=>console.log((process.env[k]?'SET  ':'EMPTY'),k))"
```

(Uses Node's built-in `--env-file`, so there's nothing to install.)

**Is email working?** Submit the configurator on any `/solutions/[slug]` page
and watch the dev server terminal:

- `Email attempted without being configured` → SMTP credentials are still blank.
- No message at all → check `NOTIFY_EMAIL_TO` isn't empty.
- An error mentioning authentication → the app password or Authenticated SMTP
  setting is wrong; revisit [section 4](#4-smtp_user--smtp_pass).
- Silence and an email in your inbox → working.

**Is push working?** Open `/admin`, click **Turn on** next to *Browser alerts*,
and accept the browser prompt. The device then appears under
**System → Push Devices**. Submit a test request and the notification should
arrive even with the dashboard tab closed.

---

## Quick reference

```ini
# Core — required
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/mstack360
PAYLOAD_SECRET=<64 random hex chars>
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Email
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=noreply@mstack360.com
SMTP_PASS=<app password>
EMAIL_FROM_ADDRESS=noreply@mstack360.com
EMAIL_FROM_NAME=MStack360

# Quote alerts
NOTIFY_EMAIL_TO=sales@mstack360.com

# Browser push
VAPID_PUBLIC_KEY=<public key>
VAPID_PRIVATE_KEY=<private key>
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<same public key>
VAPID_SUBJECT=mailto:you@mstack360.com
```

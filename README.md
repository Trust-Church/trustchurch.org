# Trust Church — Landing Page & App Foundation (trustchurch.org)

This repository powers **trustchurch.org** — the landing experience for **Trust Church** and the starting point for the future **Trust Church app + tools**.

Our goal is simple: **bring God’s Kingdom together** through a growing set of digital tools that help people connect, serve, and make a positive impact on the world. The landing page is the first step—introducing Trust Church, sharing updates, and collecting interest as the platform expands.

---

## ✨ Vision

Trust Church is building a modern digital foundation for:
- **Community & connection** (people, groups, discipleship, relationships)
- **Service & volunteering** (matching needs with action)
- **Communication & updates** (announcements, events, and real-time outreach)
- **Tools for impact** that support local ministry and global good

This site will evolve alongside the Trust Church platform as new features roll out.

---

## 🚀 What This Project Includes (Today)

- A modern **Next.js (App Router)** web app
- A fast, responsive landing page experience
- An **email subscription** flow to keep people informed as the app grows
- Shared layout/components for consistent branding across new routes/pages

---

## 🧱 Tech Stack

- **Next.js (App Router)** + TypeScript
- **React** functional components & hooks
- **Tailwind CSS** for styling
- API routes for subscription handling

---

## 📂 Project Structure

```
.
├── eslint.config.mjs         # ESLint config with Next.js & TypeScript rules
├── next-env.d.ts             # Next.js type declarations
├── next.config.ts            # Next.js configuration (custom build/runtime settings)
├── package.json              # Project metadata, dependencies, scripts
├── package-lock.json         # Dependency lockfile
├── postcss.config.mjs        # PostCSS setup (Tailwind plugin)
├── tsconfig.json             # TypeScript configuration (strict, path aliases)
│
├── public/                   # Static assets (favicons, images, etc.)
│   └── favicon.ico           # App favicon
│
└── src/
    ├── app/
    │   ├── globals.css       # Global styles, Tailwind + theme variables
    │   ├── layout.tsx        # Root layout, applies fonts & metadata
    │   ├── page.tsx          # Main landing page with subscription form
    │   │
    │   ├── api/
    │   │   └── subscribe/
    │   │       ├── route.ts  # Handles email subscription POST requests
    │   │       └── count/
    │   │           └── route.ts # Returns total subscriber count
    │   │
    │   └── favicon.ico       # Shortcut favicon reference
    │
    ├── components/
    │   ├── Footer.tsx       # Global styles, Tailwind + theme variables
    │   ├── Socials.tsx        # Root layout, applies fonts & metadata
    │
    └── lib/
        └── getApiUrl.ts      # Utility for constructing API base URLs
```

---

## 🔌 API Endpoints

### `POST /api/subscribe`

Accepts:

```json
{ "email": "example@email.com" }
```

Stores the subscriber entry in your chosen backend (Firebase/DB/etc.).

### `GET /api/subscribe/count`

Returns:

```json
{ "totalSubscribers": 123 }
```

Used to display/refresh the current subscriber count.

---

## ⚙️ Scripts

* `npm run dev` — Start dev server
* `npm run build` — Production build
* `npm run start` — Run production server
* `npm run lint` — Lint the codebase

---

## 🛠️ Getting Started

1. Clone the repo

   ```bash
   git clone https://github.com/Trust-Church/trustchurch.org.git
   cd trustchurch.org
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Run locally

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

---

## 🗺️ Roadmap (High-Level)

Planned expansions as Trust Church tools mature:

* Volunteer onboarding + opportunities directory
* Events & gatherings
* Community groups & discipleship tooling
* Giving/support features (as needed)
* Admin tooling to support ministry and outreach

---

## 🤝 Contributing

Contributions are welcome—especially improvements that support the mission and help keep the codebase clean, secure, and accessible.

If you’re submitting changes:

* Keep components accessible (ARIA, keyboard navigation)
* Prefer small PRs with clear intent
* Maintain consistent styling patterns

---

## 📣 Socials

Follow Trust Church and stay connected:

* Instagram: [https://instagram.com/trust_church](https://instagram.com/trust_church)
* X: [https://x.com/TrustChurchOrg](https://x.com/TrustChurchOrg)
* GitHub: [https://github.com/trustchurch](https://github.com/trustchurch)
* Primal: [https://primal.net/trustchurch](https://primal.net/trustchurch)



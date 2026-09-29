# Trust Church

The official website for [Trust Church](https://trustchurch.org).

Trust Church is a community of believers focused on connecting, serving, and putting faith into action wherever there is a need.

Our goal is simple: bring God's Kingdom together through community, service, encouragement, and digital tools that help believers make a positive impact in the world.

## About

Trust Church is building a digital foundation for:

- **Community & connection** — bringing believers together through relationships, groups, and discipleship
- **Service & volunteering** — connecting people with opportunities to serve
- **Communication & updates** — sharing announcements, opportunities, and community updates
- **Tools for impact** — building technology that supports ministry, outreach, and practical service

The website will continue to evolve as the Trust Church community and platform grow.

## Features

- Responsive Trust Church website
- Email community subscription
- Public community member count
- Volunteer opportunities
- Volunteer applications
- Social links and community resources
- Reusable site-wide navigation and components
- API routes for subscriptions and application handling

## Tech Stack

- [Next.js](https://nextjs.org/) — App Router
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Firebase / Firestore
- Next.js Route Handlers

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Trust-Church/trustchurch.org.git
cd trustchurch.org
```

Install dependencies:

```bash
npm install
```

Configure the required environment variables for your local environment.

Then start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production server.

```bash
npm run lint
```

Runs the project's linting checks.

## API

The application uses Next.js Route Handlers for server-side functionality.

### Community Subscription

```text
POST /api/subscribers
```

Handles community email subscriptions.

Example request:

```json
{
  "email": "example@email.com"
}
```

### Community Count

```text
GET /api/subscribers/count
```

Returns the current number of community subscribers.

Example response:

```json
{
  "totalSubscribers": 123
}
```

Only the aggregate count is exposed publicly. Subscriber records and email addresses are not returned by this endpoint.

## Project Structure

```text
.
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # Server-side route handlers
│   │   ├── about/          # About Trust Church
│   │   ├── volunteer/      # Volunteer opportunities and applications
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout and metadata
│   │   └── page.tsx        # Homepage
│   │
│   ├── components/         # Shared UI components
│   └── lib/                # Shared utilities and server helpers
│
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Development

When contributing:

- Keep components accessible and keyboard friendly
- Validate user input on both the client and server
- Never expose private subscriber or application data through public endpoints
- Keep secrets and credentials out of source control
- Prefer reusable components over duplicated UI
- Maintain responsive behavior across mobile and desktop
- Keep pull requests focused and clearly documented

## Roadmap

Trust Church is continuing to expand its digital tools, including:

- Expanded volunteer and service tools
- Events and gatherings
- Community groups
- Discipleship resources
- Communication and outreach tools
- Ministry administration tools
- Additional ways for the community to connect and serve

## Contributing

Contributions that support the mission of Trust Church and improve the security, accessibility, usability, or maintainability of the project are welcome.

Please open an issue or pull request through GitHub.

## Socials

Stay connected with Trust Church:

- [Instagram](https://instagram.com/trust_church)
- [X](https://x.com/TrustChurchOrg)
- [GitHub](https://github.com/trust-church)
- [Primal](https://primal.net/trustchurch)

## Website

[trustchurch.org](https://trustchurch.org)
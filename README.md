# Trust Church

The official website for [Trust Church](https://trustchurch.org).

Trust Church is a community of believers focused on connecting, serving, and putting faith into action wherever there is a need.

Our goal is simple: **bring God's Kingdom together** through community, service, encouragement, and digital tools that help believers make a positive impact in the world.

## About

Trust Church is building a digital foundation for:

- **Community & connection** — bringing believers together through relationships, groups, and discipleship
- **Service & volunteering** — connecting people with opportunities to serve
- **Communication & updates** — sharing announcements, opportunities, and community updates
- **Tools for impact** — building technology that supports ministry, outreach, and practical service

The website will continue to evolve as the Trust Church community and platform grow.

## Features

### Community

- Community email subscriptions
- Live public community member count
- Social links and community resources
- Bible access directly from site navigation

### Volunteer

- Volunteer opportunity directory
- Individual opportunity pages
- Volunteer application forms
- Applicant contact and social profile information
- Resume and supporting document uploads
- Application field validation
- Social profile URL validation and normalization

Supported social profiles include:

- X / Twitter
- GitHub
- LinkedIn
- Instagram

Social fields accept common formats such as usernames, domain-based URLs, and HTTP/HTTPS URLs. Valid profiles are normalized to canonical HTTPS URLs before submission.

### Website

- Responsive mobile and desktop layouts
- Shared navigation and footer
- About and mission content
- Reusable UI components
- SEO metadata and structured data
- Open Graph and social sharing metadata
- Semantic and accessible page structure

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

Start the development server:

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

Example:

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

Example:

```json
{
  "totalSubscribers": 123
}
```

Only the aggregate count is exposed publicly. Subscriber records and email addresses are not returned by the count endpoint.

### Volunteer

Volunteer API routes support retrieving opportunities and submitting applications.

Application data is validated before processing, including contact information, supported social profiles, and uploaded files.

## Project Structure

```text
.
├── public/                     # Static assets
│
├── src/
│   ├── app/
│   │   ├── api/                # Server-side route handlers
│   │   ├── about/              # About Trust Church
│   │   ├── volunteer/          # Opportunities and applications
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout and metadata
│   │   ├── page.tsx            # Homepage
│   │   ├── robots.ts           # Search crawler configuration
│   │   └── sitemap.ts          # XML sitemap generation
│   │
│   ├── components/             # Shared UI components
│   └── lib/                    # Shared utilities and server helpers
│
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Security

Trust Church handles user-submitted information through server-side API routes.

Development should follow several basic principles:

- Validate user input on both the client and server
- Restrict accepted social profiles to supported platforms
- Normalize accepted social profiles to HTTPS URLs
- Validate uploaded files before processing
- Never expose subscriber or applicant information through public endpoints
- Keep Firebase credentials and other secrets out of source control
- Store secrets using environment variables
- Avoid trusting client-side validation as a security boundary

## SEO

The website includes support for:

- Page-specific metadata
- Search engine titles and descriptions
- Canonical site information
- Open Graph metadata
- Social sharing metadata
- Structured data
- `robots.txt`
- XML sitemap generation
- Semantic HTML

## Development

When contributing:

- Keep components accessible and keyboard friendly
- Maintain responsive behavior across mobile and desktop
- Validate user-controlled data
- Prefer reusable components over duplicated UI
- Keep secrets and credentials out of source control
- Keep pull requests focused and clearly documented
- Run the production build before submitting changes

```bash
npm run build
```

## Roadmap

Trust Church will continue expanding its digital tools, including:

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
- [GitHub](https://github.com/trustchurch)
- [Primal](https://primal.net/trustchurch)

## Website

[trustchurch.org](https://trustchurch.org)

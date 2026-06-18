# Chohan's Style Hub

A premium multi-branch hair salon webapp with a social-media-style community. Built with Next.js 16, TypeScript, Tailwind CSS 4, and Prisma.

## Features

- **Stunning Landing Page** — Hero with real salon photography, men's & women's services, courses preview, branches, testimonials
- **User Accounts** — Signup/login, profiles with posts, bookings, and stats
- **Social Feed** — Facebook-style feed with image posts, likes, comments, follow, share
- **Explore** — Browse all posts filtered by category (Hairstyle, Mehndi, Makeup, Bridal)
- **Appointment Booking** — 4-step wizard: Service → Branch → Date & Time → Confirm
- **Beauty Courses** — Professional courses with details and enrollment
- **Branch Locator** — 4 branches across Lahore & Rawalpindi with reviews and maps
- **Reviews & Ratings** — Star ratings for service, staff, and cleanliness
- **Admin Panel** — User management, content moderation, analytics, branch KPIs
- **Owner Dashboard** — Business analytics, top/underperforming branches, CSV export
- **AI Style Assistant** — GLM-4 powered chatbot for style advice and FAQs
- **WhatsApp Integration** — Quick contact via +923205719979

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York)
- **Database**: Prisma ORM (SQLite)
- **State**: Zustand (client) + TanStack Query (server)
- **Animations**: Framer Motion
- **AI**: z-ai-web-dev-sdk (GLM-4)
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
bun install

# Set up the database
bun run db:push

# Start the dev server
bun run dev
```

Visit `http://localhost:3000`. The database seeds automatically on first load.

## Demo Accounts

| Role     | Email               | Password   |
|----------|---------------------|------------|
| Customer | demo@chohans.com    | demo123    |
| Owner    | owner@chohans.com   | owner123   |
| Admin    | admin@chohans.com   | admin123   |

## Project Structure

```
src/
├── app/
│   ├── api/            # API routes (auth, posts, bookings, admin, chat)
│   ├── globals.css     # Brand gradient theme
│   ├── layout.tsx      # Root layout with fonts
│   └── page.tsx        # Main app shell
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── views/          # Page views (landing, feed, booking, etc.)
│   ├── app-shell.tsx   # Main app container
│   ├── navbar.tsx      # Top navigation
│   ├── bottom-nav.tsx  # Mobile bottom nav
│   ├── auth-modal.tsx  # Login/Signup modal
│   ├── post-card.tsx   # Social post card
│   └── ai-chat-panel.tsx # AI assistant
└── lib/
    ├── store.ts        # Zustand app store
    ├── db.ts           # Prisma client
    ├── auth.ts         # Auth helpers
    ├── seed.ts         # Database seed data
    └── images.ts       # Image URL mapping
```

## Brand Colors

The app uses a warm peach-to-coral gradient palette:
- Primary: Coral (`oklch(0.68 0.19 30)`)
- Accent: Peach (`oklch(0.88 0.10 50)`)
- Gradient: `from-amber-400 via-orange-400 to-rose-400`

## License

© Chohan's Style Hub. All rights reserved.

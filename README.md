# JollyBuoy Trade

A modern AI-powered trading platform built with React, Vite, Tailwind CSS, and Recharts.

## Tech Stack

- **React 19** + **Vite** — Frontend framework and build tool
- **Tailwind CSS v4** — Utility-first styling with custom dark theme
- **React Router v7** — Client-side routing
- **Recharts** — Portfolio and allocation charts
- **Lucide React** — Icon library
- **Supabase** — Backend (to be integrated)
- **IBKR API** — Broker integration (planned)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── charts/       # Recharts visualizations
│   ├── layout/       # AppLayout, Sidebar, Header
│   └── ui/           # Reusable UI components
├── data/
│   └── mockData.ts   # Dummy data for development
├── lib/
│   └── utils.ts      # Formatting and helper functions
├── pages/            # Route page components
├── routes/
│   └── index.tsx     # React Router configuration
└── types/
    └── index.ts      # TypeScript interfaces
```

## Pages

| Route | Page |
|-------|------|
| `/` | Dashboard |
| `/portfolio` | Portfolio |
| `/watchlist` | Watchlist |
| `/scanner` | Market Scanner |
| `/strategies` | Strategies |
| `/paper-trading` | Paper Trading |
| `/history` | Trade History |
| `/settings` | Settings |

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## Status

Frontend UI and routing only. Trading logic, Supabase integration, and IBKR API are not yet implemented.

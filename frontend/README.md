# MLBB Supporter Frontend

A responsive React + Vite application that surfaces Mobile Legends: Bang Bang tier data, hero insights, and experimental build paths.

## Getting started

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in a `.env` file to point the client at the backend service (defaults to `/api`).

## Available pages

- **Home:** Overview of the platform with quick navigation to primary tools.
- **Tier Lists:** Filterable by role and lane with hero portraits styled after the in-game Pro Setup interface.
- **Hero Roster:** Searchable hero grid with quick navigation to hero detail views.
- **Hero Detail:** Meta and off-meta build tabs, lore, strengths, and weaknesses.
- **Off-Meta Explorer:** Build discovery surface with optional copy-to-clipboard interactions.

## Tooling highlights

- React Router for nested layouts and route-driven navigation.
- TanStack Query for caching API responses and background refetching.
- Axios-based API client with friendly error handling defaults.
- Custom reusable UI primitives for filters, hero tiles, and build cards.
- Accessibility-friendly focus states, semantic headings, and keyboard operable controls.

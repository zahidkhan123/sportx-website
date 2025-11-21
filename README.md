# SportX Website

Public website and authenticated dashboard for SportX platform.

## Features

### Public Pages
- **Home**: Hero section, featured listings, latest sports listings
- **Marketplace**: Browse and filter marketplace items
- **Sports Listings**: Browse teams, tournaments, players, etc.
- **About**: Information about SportX
- **Contact**: Contact form

### Authenticated Pages (Coming Soon)
- **My Listings**: Manage user's listings
- **Add Listing**: Create new listings
- **Profile**: User profile settings
- **Wishlist**: Saved favorite items

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/UI
- Framer Motion
- TanStack Query (React Query)
- Axios
- Lucide React Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
website/
├── app/
│   ├── (public)/        # Public routes
│   │   ├── home/
│   │   ├── marketplace/
│   │   └── ...
│   ├── (auth)/          # Auth routes
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/     # Authenticated routes (coming soon)
│   └── layout.tsx       # Root layout
├── components/          # Reusable components
│   ├── ui/             # Shadcn UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/
│   ├── api.ts          # API service
│   ├── auth.ts         # Auth utilities
│   └── constants.ts    # App constants
└── ...
```

## Authentication

The website uses JWT tokens stored in localStorage. Users can register, login, and manage their listings.

## Design Theme

- Background: `#000000` (Black)
- Text: `#FFFFFF` (White)
- Primary Accent: `#00FFFF` (Neon Blue)
- Secondary Accent: `#39FF14` (Neon Green)
- Glassmorphism cards with backdrop blur
- Smooth animations with Framer Motion

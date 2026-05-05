# SportX360 Website

Public website and authenticated dashboard for SportX360 platform.

## Features

### Public Pages
- **Home**: Hero section, featured listings, latest sports listings
- **Marketplace**: Browse and filter marketplace items
- **Sports Listings**: Browse teams, tournaments, players, etc.
- **About**: Information about SportX360
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

## App deep links (Vercel / Universal Links & App Links)

This project serves the **mobile app** link infrastructure on the **same domain** as the site (e.g. `sportx360.com`):

| Path | Purpose |
|------|--------|
| `/.well-known/apple-app-site-association` | iOS Universal Links (JSON) |
| `/.well-known/assetlinks.json` | Android App Links (JSON) |
| `/find-match` | Fallback landing page (open app / App Store / Play Store) |

**Included in the repo**

- `public/.well-known/apple-app-site-association` — update `appID` if Team ID or bundle id changes.
- `public/.well-known/assetlinks.json` — keep **Play App Signing** + **upload** SHA-256 fingerprints current (see Play Console → App integrity).
- `vercel.json` — sets `Content-Type: application/json` for both `.well-known` files (required for verification).
- `app/find-match/` — Next.js route for the landing UI (preserves `?pool=…` etc. for the `sportx360://` handoff).

**After you deploy to Vercel**

1. Confirm production URLs (replace domain if yours differs):  
   `https://sportx360.com/.well-known/apple-app-site-association`  
   `https://sportx360.com/.well-known/assetlinks.json`  
   `https://sportx360.com/find-match`
2. In the Vercel project, set the **root directory** to `website` if the repo is monorepo-style, so `vercel.json` and `public/` apply to this app.
3. Apple: Associated Domains on the iOS app must use the **same** host (`applinks:sportx360.com`).
4. Android: reinstall or run `adb shell pm verify-app-links --re-verify com.sportx360` after `assetlinks.json` updates.


Play Now/ Find Game 
Backend + DB running; app pointing at that API.
Case C (solo)
One account, Play Now, pick sport + slot + today, turn on location (so you share a stable geo cell with others later). You should land on the “nobody yet” style result.
Case B (pool visible)
Second account (or second device): same sport, same date, same time slot, same rough location (within the same rounded lat/lng cell). Run Find Match again on both; the second user should tend toward case B once `poolCount` reaches that sport’s `min_players` from Mongo `SportsMatchRules` (see backend seed), with avatars/progress updating (wait or pull Refresh).
Case A (existing event)
Ensure there is an open event in the DB for that sport/date/time window and within FIND_MATCH_RADIUS_KM (default 25 km) of the user. Find Match should return case A and Join Event should work.
Auto-create event
Either use enough distinct users in the same pool to reach that sport’s `ideal_players` in `SportsMatchRules` (e.g. cricket defaults to 10), or temporarily lower `ideal_players` / `min_players` for that sport in the DB and clear the in-memory cache (`SPORTS_MATCH_CONFIG_CACHE_TTL_MS` wait or API restart), then confirm a new event appears and the flow returns case A.
Deep link / invite
From case B, use Invite and open the link on another install; it should open the flow with pool in the URL and the “Main bhi pool join karna hai” path when there is no full searchPayload from the first screen.
If you tell me whether you care more about device testing or staging with one machine, I can suggest the smallest setup (e.g. lowering `ideal_players` for one sport in `SportsMatchRules` on staging only).
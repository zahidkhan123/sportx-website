# Google AdSense Integration Setup

This document explains how to set up Google AdSense in your Next.js application.

## Environment Variables

Create a `.env.local` file in the root of the `website` directory and add:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXX
```

Replace `ca-pub-XXXXXXXXXXXX` with your actual AdSense Client ID from [Google AdSense](https://www.google.com/adsense/).

## Component Usage

The `GoogleAds` component is located at `components/GoogleAds.tsx` and can be used throughout your application.

### Basic Usage

```tsx
import GoogleAds from '@/components/GoogleAds';

<GoogleAds
  adSlot="YOUR_AD_SLOT_ID"
  adFormat="auto"
  className="my-4"
  minHeight="250px"
/>
```

### Props

- `adSlot` (required): Your AdSense ad slot ID
- `adFormat` (optional): Ad format - `"auto"`, `"rectangle"`, `"vertical"`, etc.
- `adLayout` (optional): Ad layout - `"in-article"`, `"display"`, etc.
- `adLayoutKey` (optional): Ad layout key for responsive ads
- `className` (optional): Additional CSS classes
- `minHeight` (optional): Minimum height to prevent layout shift (default: `"250px"`)
- `fullWidthResponsive` (optional): Enable full-width responsive ads

### Example Ad Units

#### Responsive Display Ad (Homepage)

```tsx
<GoogleAds
  adSlot="YOUR_AD_SLOT_ID_HOMEPAGE"
  adFormat="auto"
  fullWidthResponsive={true}
  className="w-full"
  minHeight="250px"
/>
```

#### Vertical Sidebar Ad

```tsx
<GoogleAds
  adSlot="YOUR_AD_SLOT_ID_SIDEBAR"
  adFormat="vertical"
  className="w-full"
  minHeight="600px"
/>
```

#### In-Article Ad (Blog Posts)

```tsx
<GoogleAds
  adSlot="YOUR_AD_SLOT_ID_IN_ARTICLE"
  adFormat="auto"
  adLayout="in-article"
  fullWidthResponsive={true}
  className="w-full"
  minHeight="250px"
/>
```

## Current Implementation

### Layout
The AdSense script is automatically loaded in `app/layout.tsx` when `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set.

### Example Pages
- **Homepage**: `app/(public)/home/page.tsx` - Contains responsive display ad and vertical sidebar ad
- **Blog Post**: `app/(public)/blog/[slug]/page.tsx` - Contains in-article ads

## Features

- ✅ SSR-safe (no hydration errors)
- ✅ Client-side hydration support
- ✅ Ad blocker detection
- ✅ Prevents layout shift with min-height
- ✅ TypeScript support
- ✅ Responsive design

## Notes

- Replace all `YOUR_AD_SLOT_ID_*` placeholders with your actual AdSense ad slot IDs
- The component handles SSR gracefully and only initializes ads after client-side hydration
- Ad blocker detection shows a fallback message if ads are blocked
- Make sure your AdSense account is approved before using real ad slot IDs


# Quick Start: See Ads on Your Website

## ✅ What's Already Done

1. ✅ **Publisher ID Configured**: `ca-pub-1874611183482152`
   - Already set up in your environment
   - Component is ready to use

## 🔴 What You Need to Do Now

### Step 1: Create Ad Units in Google AdSense

1. **Go to Google AdSense Dashboard**

   - Visit: https://www.google.com/adsense/
   - Sign in with your account

2. **Create Ad Units**

   - Click **"Ads"** → **"By ad unit"**
   - Click **"Create ad unit"**

3. **Create These 3 Ad Units:**

   #### a) Responsive Display Ad (Homepage)

   - **Name**: "Homepage Display Ad"
   - **Ad type**: Display ads → Responsive
   - **Size**: Responsive (auto)
   - **Copy the Ad unit ID** (e.g., `1234567890`)

   #### b) Vertical Sidebar Ad

   - **Name**: "Sidebar Vertical Ad"
   - **Ad type**: Display ads → Display ad
   - **Size**: 300x600 (Vertical)
   - **Copy the Ad unit ID**

   #### c) In-Article Ad (Blog Posts)

   - **Name**: "Blog In-Article Ad"
   - **Ad type**: In-article ads
   - **Copy the Ad unit ID**

### Step 2: Set Up Environment Variable (If Not Already Done)

Create `.env.local` in the `website` directory:

```bash
cd website
```

Create `.env.local`:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1874611183482152
```

**Note**: Your publisher ID is already configured, but make sure `.env.local` exists with this value.

### Step 3: Update Ad Slot IDs

Edit these files and replace placeholder IDs:

#### `app/(public)/home/page.tsx`

```tsx
// Replace this:
adSlot = "YOUR_AD_SLOT_ID_HOMEPAGE";

// With your real ad slot ID:
adSlot = "1234567890"; // Your actual ad slot ID
```

#### `app/(public)/blog/[slug]/page.tsx`

```tsx
// Replace:
adSlot = "YOUR_AD_SLOT_ID_IN_ARTICLE_1";
adSlot = "YOUR_AD_SLOT_ID_IN_ARTICLE_2";

// With real IDs:
adSlot = "1234567891";
adSlot = "1234567892";
```

### Step 4: Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## Testing

### Test Mode (Current State)

- ✅ You should see **yellow/orange placeholder boxes** with debug info
- This confirms the component is working

### Production Mode (After Setup)

- ✅ Real Google ads will appear
- ✅ Check browser console for initialization logs
- ✅ Disable ad blockers to see ads

## Debugging

### Check Browser Console

Open DevTools (F12) and look for:

- ✅ `✅ Google Ad initialized:` - Ad loaded successfully
- ⚠️ `⚠️ AdSense script not found` - Environment variable not set
- 🔍 `🔍 Google Ads Debug:` - Test mode info

### Common Issues

1. **"AdSense script not loaded"**

   - Check `.env.local` exists
   - Verify `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set correctly
   - Restart dev server after adding env variable

2. **"Ad blocked by browser extension"**

   - Disable ad blockers (uBlock Origin, AdBlock Plus, etc.)
   - Check browser privacy settings

3. **Still seeing placeholders**
   - Verify ad slot IDs are replaced (not `YOUR_AD_SLOT_ID_*`)
   - Check AdSense account is approved
   - Wait a few minutes for ads to initialize

## Quick Test Without AdSense Account

If you want to test the component without AdSense:

1. Set a dummy client ID in `.env.local`:

   ```env
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-test123456
   ```

2. Use test ad slot IDs:

   ```tsx
   adSlot = "1234567890"; // Any number works for testing
   ```

3. You'll see the placeholder, confirming the component works!

## Need Help?

- Check `ADSENSE_SETUP.md` for detailed documentation
- Review Google AdSense [documentation](https://support.google.com/adsense/)
- Check browser console for error messages

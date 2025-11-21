# ✅ Google AdSense Setup - Next Steps

## ✅ What's Already Done

1. ✅ **Publisher ID Added**: `ca-pub-1874611183482152`

   - Added to `.env.local` file
   - Configured in `app/layout.tsx`
   - Component ready to use

2. ✅ **GoogleAds Component**: Created and ready

   - Located at `components/GoogleAds.tsx`
   - Handles SSR, hydration, and ad blocker detection
   - Shows placeholder in test mode

3. ✅ **Ad Placements**: Added to pages
   - Homepage: Responsive display ad + Vertical sidebar ad
   - Blog posts: In-article ads

## 🔴 What You Need to Do Next

### Step 1: Get Your Ad Slot IDs from Google AdSense

1. **Go to Google AdSense Dashboard**

   - Visit: https://www.google.com/adsense/
   - Sign in with your account

2. **Create Ad Units**

   - Click **"Ads"** → **"By ad unit"**
   - Click **"Create ad unit"**

3. **Create These Ad Units:**

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

### Step 2: Update Ad Slot IDs in Your Code

Replace the placeholder IDs with your real Ad Slot IDs:

#### Update `app/(public)/home/page.tsx`

Find these lines and replace:

```tsx
// Line ~56 - Homepage responsive ad
<GoogleAds
  adSlot="YOUR_AD_SLOT_ID_HOMEPAGE"  // ← Replace with your ad slot ID
  adFormat="auto"
  fullWidthResponsive={true}
  className="w-full"
  minHeight="250px"
/>

// Line ~134 - Sidebar vertical ad
<GoogleAds
  adSlot="YOUR_AD_SLOT_ID_SIDEBAR"  // ← Replace with your ad slot ID
  adFormat="vertical"
  className="w-full"
  minHeight="600px"
/>
```

#### Update `app/(public)/blog/[slug]/page.tsx`

Find these lines and replace:

```tsx
// Line ~67 - First in-article ad
<GoogleAds
  adSlot="YOUR_AD_SLOT_ID_IN_ARTICLE_1"  // ← Replace with your ad slot ID
  adFormat="auto"
  adLayout="in-article"
  fullWidthResponsive={true}
  className="w-full"
  minHeight="250px"
/>

// Line ~85 - Second in-article ad
<GoogleAds
  adSlot="YOUR_AD_SLOT_ID_IN_ARTICLE_2"  // ← Replace with your ad slot ID
  adFormat="auto"
  adLayout="in-article"
  fullWidthResponsive={true}
  className="w-full"
  minHeight="250px"
/>
```

### Step 3: Restart Your Development Server

After updating the ad slot IDs:

```bash
# Stop the server (Ctrl+C)
# Then restart:
cd website
npm run dev
```

### Step 4: Verify Ads Are Showing

1. **Check Browser Console** (F12)

   - Look for: `✅ Google Ad initialized:` messages
   - No errors should appear

2. **Check Your Website**

   - Visit your homepage
   - You should see real Google ads (not placeholders)
   - If you see yellow placeholders, the ad slot IDs are still placeholders

3. **Disable Ad Blockers**
   - Make sure ad blockers are disabled for testing
   - Some browsers have built-in ad blockers

## 📋 Quick Checklist

- [ ] Publisher ID added to `.env.local` ✅ (Already done)
- [ ] Created ad units in AdSense dashboard
- [ ] Copied ad slot IDs from AdSense
- [ ] Updated `YOUR_AD_SLOT_ID_HOMEPAGE` in `home/page.tsx`
- [ ] Updated `YOUR_AD_SLOT_ID_SIDEBAR` in `home/page.tsx`
- [ ] Updated `YOUR_AD_SLOT_ID_IN_ARTICLE_1` in `blog/[slug]/page.tsx`
- [ ] Updated `YOUR_AD_SLOT_ID_IN_ARTICLE_2` in `blog/[slug]/page.tsx`
- [ ] Restarted dev server
- [ ] Verified ads are showing (not placeholders)

## 🚨 Important Notes

1. **AdSense Approval**: Your account needs to be approved by Google before ads show

   - This can take 1-7 days
   - Until approved, you'll see placeholders

2. **Ad Slot Format**: Ad slot IDs are just numbers (e.g., `1234567890`)

   - Don't include `ca-pub-` prefix in ad slot IDs
   - Only the publisher ID uses `ca-pub-` prefix

3. **Testing**:
   - Placeholders will show until you add real ad slot IDs
   - Real ads will only show after AdSense account approval
   - Use test mode to verify component is working

## 🆘 Troubleshooting

### Still seeing placeholders?

- Check that ad slot IDs are replaced (not `YOUR_AD_SLOT_ID_*`)
- Verify `.env.local` has correct publisher ID
- Restart dev server after changes

### Ads not showing?

- Check AdSense account approval status
- Verify ad slot IDs are correct
- Check browser console for errors
- Disable ad blockers

### Need Help?

- Check `ADSENSE_SETUP.md` for detailed documentation
- Review Google AdSense [help center](https://support.google.com/adsense/)

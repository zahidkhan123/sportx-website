# 🎯 Google AdSense - What You Need to Do Next

## ✅ Already Completed

- ✅ Publisher ID: `ca-pub-1874611183482152` 
- ✅ GoogleAds component created and configured
- ✅ Ad placements added to pages
- ✅ Environment variable setup ready

## 🔴 Required: Get Ad Slot IDs from Google AdSense

### Step 1: Create Ad Units

1. Go to: https://www.google.com/adsense/
2. Navigate to: **Ads** → **By ad unit** → **Create ad unit**

Create **3 ad units**:

| Ad Unit Name | Type | Size | Use For |
|-------------|------|------|---------|
| Homepage Display Ad | Display ads → Responsive | Responsive (auto) | Homepage banner |
| Sidebar Vertical Ad | Display ads → Display ad | 300x600 | Sidebar |
| Blog In-Article Ad | In-article ads | Auto | Blog posts |

### Step 2: Copy Ad Slot IDs

After creating each ad unit, copy the **Ad unit ID** (it's just numbers, like `1234567890`)

## 📝 Files to Update

### File 1: `app/(public)/home/page.tsx`

**Line ~56** - Replace:
```tsx
adSlot="YOUR_AD_SLOT_ID_HOMEPAGE"
```
With your homepage ad slot ID (e.g., `"1234567890"`)

**Line ~134** - Replace:
```tsx
adSlot="YOUR_AD_SLOT_ID_SIDEBAR"
```
With your sidebar ad slot ID (e.g., `"1234567891"`)

### File 2: `app/(public)/blog/[slug]/page.tsx`

**Line ~67** - Replace:
```tsx
adSlot="YOUR_AD_SLOT_ID_IN_ARTICLE_1"
```
With your first in-article ad slot ID

**Line ~85** - Replace:
```tsx
adSlot="YOUR_AD_SLOT_ID_IN_ARTICLE_2"
```
With your second in-article ad slot ID (can be same as first or different)

## 🚀 After Updating

1. **Restart dev server**:
   ```bash
   cd website
   npm run dev
   ```

2. **Check your website**:
   - Visit homepage - should see ads (not yellow placeholders)
   - Visit a blog post - should see in-article ads

3. **Verify in console** (F12):
   - Look for: `✅ Google Ad initialized:`
   - No errors should appear

## ⚠️ Important Notes

1. **AdSense Approval**: Your account must be approved by Google (takes 1-7 days)
   - Until approved, you'll see placeholders or no ads
   - This is normal!

2. **Ad Slot Format**: 
   - Ad slot IDs are just numbers: `"1234567890"`
   - Publisher ID uses prefix: `ca-pub-1874611183482152`
   - Don't mix them up!

3. **Environment Variable**:
   - Make sure `.env.local` exists in `website/` directory
   - Should contain: `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1874611183482152`

## 📋 Quick Checklist

- [ ] Created 3 ad units in AdSense dashboard
- [ ] Copied ad slot IDs from AdSense
- [ ] Updated `YOUR_AD_SLOT_ID_HOMEPAGE` in `home/page.tsx`
- [ ] Updated `YOUR_AD_SLOT_ID_SIDEBAR` in `home/page.tsx`
- [ ] Updated `YOUR_AD_SLOT_ID_IN_ARTICLE_1` in `blog/[slug]/page.tsx`
- [ ] Updated `YOUR_AD_SLOT_ID_IN_ARTICLE_2` in `blog/[slug]/page.tsx`
- [ ] Created `.env.local` with publisher ID
- [ ] Restarted dev server
- [ ] Verified ads showing (or placeholders if not approved yet)

## 🆘 Troubleshooting

**Still seeing yellow placeholders?**
- ✅ This is normal if AdSense account isn't approved yet
- ✅ Check that ad slot IDs are replaced (not `YOUR_AD_SLOT_ID_*`)
- ✅ Verify `.env.local` has correct publisher ID

**Need help?**
- See `QUICK_START_ADS.md` for detailed guide
- See `ADSENSE_SETUP.md` for technical documentation


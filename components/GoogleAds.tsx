'use client';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export interface GoogleAdsProps {
  /**
   * AdSense ad slot ID (e.g., "1234567890")
   */
  adSlot: string;
  /**
   * Ad format (e.g., "auto", "rectangle", "vertical")
   */
  adFormat?: string;
  /**
   * Ad layout (e.g., "in-article", "display")
   */
  adLayout?: string;
  /**
   * Ad layout key (for responsive ads)
   */
  adLayoutKey?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Minimum height for the ad container to prevent layout shift
   */
  minHeight?: string;
  /**
   * Full width of the ad unit
   */
  fullWidthResponsive?: boolean;
}

/**
 * Google AdSense Component
 * 
 * A reusable component for displaying Google AdSense ads with proper SSR handling
 * and client-side hydration support.
 * 
 * @example
 * ```tsx
 * <GoogleAds
 *   adSlot="1234567890"
 *   adFormat="auto"
 *   className="my-4"
 *   minHeight="250px"
 * />
 * ```
 */
export default function GoogleAds({
  // adSlot,
  // adFormat = 'auto',
  // adLayout,
  // adLayoutKey,
  // className = '',
  // minHeight = '250px',
  // fullWidthResponsive = false,
}: GoogleAdsProps) {
  // Ads are temporarily disabled across website.
  // Keep component in place so existing page imports/usages do not need changes.
  return (
    <>
      {/*
      <div
        className={`google-ads-container ${className}`}
        style={{ minHeight }}
      />
      */}
    </>
  );
}


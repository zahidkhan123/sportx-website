'use client';

import { useEffect, useRef, useState, } from 'react';

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
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  className = '',
  minHeight = '250px',
  fullWidthResponsive = false,
}: GoogleAdsProps) {
  const [mounted, setMounted] = useState(false);
  const [isAdBlocked, setIsAdBlocked] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isTestMode, setIsTestMode] = useState(true); // Start as true to prevent hydration mismatch
  const adRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Get client ID from environment (NEXT_PUBLIC_* vars are available in client components)
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Ensure component only renders client-side differences after hydration
  useEffect(() => {
    setMounted(true);
    // Check if using placeholder/test ad slot only after mount (prevents hydration mismatch)
    const hasPlaceholder = adSlot.includes('YOUR_AD_SLOT_ID');
    const invalidClientId = !adsenseClientId || adsenseClientId.includes('XXXXXXXX');
    setIsTestMode(hasPlaceholder || invalidClientId);
  }, [adSlot, adsenseClientId]);

  useEffect(() => {
    // Only run on client side after mount
    if (!mounted || typeof window === 'undefined') return;

    // Debug logging (only log once to prevent spam)
    if (isTestMode && !isInitialized.current) {
      setDebugInfo('Test Mode: Using placeholder ad slot. Set NEXT_PUBLIC_ADSENSE_CLIENT_ID and real ad slot IDs to see ads.');
      console.log('🔍 Google Ads Debug:', {
        adSlot,
        adsenseClientId: adsenseClientId || 'NOT SET',
        isTestMode: true,
        windowAdsbygoogle: typeof window.adsbygoogle !== 'undefined',
      });
    }

    // Check if AdSense script is loaded
    const checkScriptLoaded = () => {
      const script = document.querySelector('script[src*="adsbygoogle.js"]');
      if (!script) {
        setDebugInfo('AdSense script not loaded. Check NEXT_PUBLIC_ADSENSE_CLIENT_ID in .env.local');
        console.warn('⚠️ AdSense script not found. Make sure NEXT_PUBLIC_ADSENSE_CLIENT_ID is set in .env.local');
        return false;
      }
      return true;
    };

    if (!checkScriptLoaded() && !isTestMode) {
      return;
    }

    // Initialize adsbygoogle array if it doesn't exist
    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
    }

    // Push ad configuration only once
    // Google Ads requires pushing an empty object {} to initialize
    // The data attributes are already on the <ins> tag
    if (!isInitialized.current && adRef.current) {
      try {
        // Only push if we have a valid client ID and not in test mode
        if (adsenseClientId && !isTestMode) {
          // Push empty object to initialize the ad (data attributes are on <ins> tag)
          window.adsbygoogle.push({});
          console.log('✅ Google Ad initialized:', { 
            adSlot, 
            adFormat, 
            adLayout,
            clientId: adsenseClientId 
          });
        }
        
        isInitialized.current = true;
      } catch (error) {
        console.error('❌ Error initializing Google Ads:', error);
        setIsAdBlocked(true);
      }
    }

    // Check for ad blocker after a delay
    const checkAdBlocker = setTimeout(() => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.position = 'absolute';
      testAd.style.left = '-9999px';
      document.body.appendChild(testAd);

      setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setIsAdBlocked(true);
        }
        if (document.body.contains(testAd)) {
          document.body.removeChild(testAd);
        }
      }, 100);
    }, 500);

    return () => {
      clearTimeout(checkAdBlocker);
    };
  }, [mounted, adSlot, adFormat, adLayout, adLayoutKey, fullWidthResponsive, adsenseClientId, isTestMode]);

  // Always render the same structure on server and client
  // Only show ad blocker message after hydration
  if (mounted && isAdBlocked) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 ${className}`}
        style={{ minHeight }}
      >
        <div className="text-center p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Ad blocked by browser extension
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Disable your ad blocker to see ads
          </p>
        </div>
      </div>
    );
  }

  // Show test/placeholder mode
  if (mounted && isTestMode) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 rounded-lg border-2 border-dashed border-yellow-500/50 ${className}`}
        style={{ minHeight }}
      >
        <div className="text-center p-6 max-w-md">
          <div className="text-2xl mb-2">📢</div>
          <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
            Ad Placeholder (Test Mode)
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            {debugInfo || 'Set up your AdSense account to see real ads here'}
          </p>
          <div className="text-xs text-left bg-black/20 dark:bg-white/10 p-3 rounded font-mono">
            <div className="mb-1">
              <span className="text-gray-500">Ad Slot:</span>{' '}
              <span className="text-white">{adSlot}</span>
            </div>
            <div className="mb-1">
              <span className="text-gray-500">Format:</span>{' '}
              <span className="text-white">{adFormat}</span>
            </div>
            {adLayout && (
              <div className="mb-1">
                <span className="text-gray-500">Layout:</span>{' '}
                <span className="text-white">{adLayout}</span>
              </div>
            )}
            <div className="mt-2 pt-2 border-t border-gray-600">
              <span className="text-gray-500">Client ID:</span>{' '}
              <span className="text-white">
                {adsenseClientId || 'NOT SET'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`google-ads-container ${className}`}
      style={{ minHeight }}
    >
      <ins
        ref={adRef as React.RefObject<HTMLModElement | null>}
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: minHeight as string,
        }}
        data-ad-client={adsenseClientId as string}
        data-ad-slot={adSlot as string}
        data-ad-format={adFormat as string}
        {...(adLayout && { 'data-ad-layout': adLayout as string })}
        {...(adLayoutKey && { 'data-ad-layout-key': adLayoutKey as string })}
        {...(fullWidthResponsive && { 'data-full-width-responsive': 'true' })}
      />
      {mounted && debugInfo && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
          {debugInfo}
        </div>
      )}
    </div>
  );
}


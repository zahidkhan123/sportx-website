"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const IOS_STORE = "https://apps.apple.com/pk/app/sportx360/id6759158349";
const ANDROID_STORE =
  "https://play.google.com/store/apps/details?id=com.sportx360&hl=en";

function useClientSearchString() {
  const searchParams = useSearchParams();
  return useMemo(() => {
    const q = new URLSearchParams();
    searchParams.forEach((value, key) => {
      q.set(key, value);
    });
    const s = q.toString();
    return s ? `?${s}` : "";
  }, [searchParams]);
}

type ClientEnv = {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  inAppBrowser: boolean;
  ready: boolean;
};

function FindMatchLandingInner() {
  const search = useClientSearchString();
  const [status, setStatus] = useState("");
  const [env, setEnv] = useState<ClientEnv>({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    inAppBrowser: false,
    ready: false,
  });

  const customScheme = `sportx360://find-match${search}`;

  useEffect(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const inAppBrowser = /Instagram|FBAN|FBAV|Line\//i.test(ua);
    setEnv({
      isIOS,
      isAndroid,
      isMobile: isIOS || isAndroid,
      inAppBrowser,
      ready: true,
    });
  }, []);

  const storeUrl = env.isIOS
    ? IOS_STORE
    : env.isAndroid
      ? ANDROID_STORE
      : IOS_STORE;
  const storeLabel = env.isIOS
    ? "App Store"
    : env.isAndroid
      ? "Google Play"
      : "App Store";

  const tryOpenApp = useCallback(() => {
    setStatus("Opening app…");
    window.location.href = customScheme;
    window.setTimeout(() => {
      setStatus("App not opened? Use the store button below.");
    }, 1800);
  }, [customScheme]);

  useEffect(() => {
    if (!env.ready) return;
    if (!env.isMobile) {
      setStatus("On your phone, this link opens the app or store.");
      return;
    }
    if (env.inAppBrowser) {
      setStatus("Open in Safari / Chrome, then tap Open in app.");
      return;
    }
    tryOpenApp();
  }, [env, tryOpenApp]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-[#0d0d3a] to-[#1a1a2e] px-6 py-10 text-center text-white">
      <p className="mb-2 text-xl font-extrabold text-[#00FFA3]">SportX360</p>
      <h1 className="mb-3 max-w-md text-2xl font-bold leading-snug">
        Open in app or download
      </h1>
      <p className="mb-6 max-w-sm text-sm text-zinc-300">
        If SportX360 is installed, we try to open Find Match. Otherwise, get the
        app from your store.
      </p>

      <button
        type="button"
        onClick={tryOpenApp}
        className="mb-3 w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#00FFA3] to-[#00CFFF] px-5 py-3.5 text-base font-extrabold text-[#0d0d0d] shadow-lg transition active:scale-[0.98]"
      >
        Open in app
      </button>

      <a
        href={storeUrl}
        className="w-full max-w-sm rounded-2xl border border-[#00FFA3]/45 bg-white/5 px-5 py-3.5 text-base font-extrabold text-[#00FFA3] no-underline transition hover:bg-white/10"
      >
        {storeLabel}
      </a>

      {status ? (
        <p className="mt-6 max-w-xs text-xs text-zinc-500">{status}</p>
      ) : null}
    </div>
  );
}

export function FindMatchLanding() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-[#0d0d3a] to-[#1a1a2e] text-[#00FFA3]">
          Loading…
        </div>
      }
    >
      <FindMatchLandingInner />
    </Suspense>
  );
}

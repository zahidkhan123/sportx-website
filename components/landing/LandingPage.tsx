"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarClock, ChevronRight, MapPin, Smartphone } from "lucide-react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.sportx360";
const APP_STORE_URL = "https://apps.apple.com/pk/app/sportx360/id6759158349";
const APP_DEEP_LINK = "sportx360://home";

function isIOS() {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(window.navigator.userAgent);
}

function openAppWithFallback() {
  if (typeof window === "undefined") return;

  const fallbackUrl = isIOS() ? APP_STORE_URL : PLAY_STORE_URL;
  const startedAt = Date.now();

  window.location.href = APP_DEEP_LINK;

  window.setTimeout(() => {
    if (Date.now() - startedAt < 2200) {
      window.location.href = fallbackUrl;
    }
  }, 1400);
}

export default function LandingPage() {
  const [showBlocker, setShowBlocker] = useState(false);
  const blockerText = useMemo(
    () => "For the best experience, use our mobile app.",
    []
  );

  const triggerLimitedAction = () => {
    setShowBlocker(true);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <p className="text-lg font-bold tracking-tight">SportX360</p>
          <button
            onClick={openAppWithFallback}
            className="inline-flex items-center gap-2 rounded-full bg-[#00FFA3] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#00FFA3]/90"
          >
            <Smartphone className="h-4 w-4" />
            Download App
          </button>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 md:px-6 md:pb-16 md:pt-14">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80">
                <CalendarClock className="h-3.5 w-3.5" />
                Fast sports ground booking
              </p>
              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                Book Sports Grounds Instantly
              </h1>
              <p className="mt-4 max-w-xl text-sm text-white/75 md:text-base">
                Better, faster experience on our mobile app. Discover grounds,
                check real-time slot availability, and complete booking in
                seconds.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  Get it on Google Play
                </Link>
                <Link
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  Download on App Store
                </Link>
                <button
                  onClick={openAppWithFallback}
                  className="rounded-xl bg-[#00FFA3] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#00FFA3]/90"
                >
                  Open App
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-[#0F1320] p-4 shadow-2xl">
              <div className="mb-3 text-sm font-semibold text-white/80">
                App Preview
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["Grounds", "Slots", "Confirm"].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-[#141A2A] p-3"
                  >
                    <div className="mb-2 h-20 rounded-lg bg-gradient-to-b from-[#00FFA3]/25 to-[#00A6FF]/10" />
                    <p className="text-xs font-medium text-white/85">{item}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li>- Slot booking in a few taps</li>
                <li>- Real-time ground availability</li>
                <li>- Faster checkout and confirmations</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
            <h2 className="text-xl font-semibold">Browse on web (limited)</h2>
            <p className="mt-2 text-sm text-white/70">
              You can view grounds and slots here. Booking, payments, and full
              account actions continue on app for better speed and reliability.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                href="/grounds"
                className="group flex items-center justify-between rounded-xl border border-white/15 bg-[#101525] px-4 py-3 text-sm transition hover:bg-[#141B2D]"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#00FFA3]" />
                  View grounds list
                </span>
                <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-white" />
              </Link>

              <button
                onClick={triggerLimitedAction}
                className="group flex items-center justify-between rounded-xl border border-white/15 bg-[#101525] px-4 py-3 text-left text-sm transition hover:bg-[#141B2D]"
              >
                <span>View today&apos;s available slots</span>
                <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-white" />
              </button>

              <button
                onClick={triggerLimitedAction}
                className="rounded-xl border border-dashed border-[#00FFA3]/40 bg-[#00FFA3]/10 px-4 py-3 text-sm font-medium text-[#9DFFD9] transition hover:bg-[#00FFA3]/15"
              >
                Continue on app for booking
              </button>

              <button
                onClick={triggerLimitedAction}
                className="rounded-xl border border-dashed border-[#00A6FF]/40 bg-[#00A6FF]/10 px-4 py-3 text-sm font-medium text-[#A6E5FF] transition hover:bg-[#00A6FF]/15"
              >
                Unlock full features on mobile app
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
          <div className="rounded-2xl border border-white/10 bg-[#0D1220] p-5 md:p-6">
            <h2 className="text-xl font-semibold">Why app is better</h2>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li>- Faster booking</li>
              <li>- Real-time updates</li>
              <li>- Behtar user experience</li>
            </ul>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row md:px-6">
          <p className="text-xs text-white/80 sm:text-sm">
            Get full SportX360 access on mobile.
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <button
              onClick={openAppWithFallback}
              className="flex-1 rounded-lg bg-[#00FFA3] px-4 py-2 text-sm font-bold text-black transition hover:bg-[#00FFA3]/90 sm:flex-none"
            >
              Download App
            </button>
            <Link
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/20 px-3 py-2 text-xs font-medium text-white/90 transition hover:bg-white/10"
            >
              Play Store
            </Link>
            <Link
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/20 px-3 py-2 text-xs font-medium text-white/90 transition hover:bg-white/10"
            >
              App Store
            </Link>
          </div>
        </div>
      </div>

      {showBlocker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#121826] p-5 text-center">
            <p className="text-base font-semibold">Continue on SportX360 App</p>
            <p className="mt-2 text-sm text-white/75">{blockerText}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowBlocker(false)}
                className="flex-1 rounded-lg border border-white/20 px-3 py-2 text-sm"
              >
                Maybe later
              </button>
              <button
                onClick={openAppWithFallback}
                className="flex-1 rounded-lg bg-[#00FFA3] px-3 py-2 text-sm font-semibold text-black"
              >
                Open App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

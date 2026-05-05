"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.sportx360";
const APP_STORE_URL = "https://apps.apple.com/pk/app/sportx360/id6759158349";

function getStoreUrl(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("android")) return PLAY_STORE_URL;
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    return APP_STORE_URL;
  }
  return PLAY_STORE_URL;
}

export default function ReferralInstallRedirectPage() {
  const params = useParams<{ code: string }>();
  const code = String(params?.code || "").trim().toUpperCase();

  const deepLink = useMemo(() => {
    const encoded = encodeURIComponent(code);
    return `sportx360://signup?ref=${encoded}`;
  }, [code]);

  useEffect(() => {
    if (!code) return;

    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const storeUrl = getStoreUrl(userAgent);
    let fallbackFired = false;

    const fallbackTimer = window.setTimeout(() => {
      fallbackFired = true;
      window.location.replace(storeUrl);
    }, 1300);

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.clearTimeout(fallbackTimer);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    window.location.href = deepLink;

    return () => {
      if (!fallbackFired) window.clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [code, deepLink]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #02020a 0%, #0d0d3a 60%, #1a1a2e 100%)",
        color: "#fff",
        padding: 24,
        textAlign: "center",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 520,
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 16,
          padding: 24,
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(6px)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Open SportX360</h1>
        <p style={{ marginTop: 10, color: "#c9d0da" }}>
          We are opening the app now. If it does not open, install SportX360 from your store.
        </p>
        {code ? (
          <p style={{ marginTop: 8, color: "#98e7c0", fontWeight: 600 }}>
            Referral code: {code}
          </p>
        ) : null}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href={PLAY_STORE_URL}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "#00FFA3",
              color: "#0b1320",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Install on Android
          </Link>
          <Link
            href={APP_STORE_URL}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Install on iPhone
          </Link>
        </div>
      </section>
    </main>
  );
}


"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.sportx360";
const APP_STORE_URL = "https://apps.apple.com/pk/app/sportx360/id6759158349";

function getStoreUrl(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("android")) return PLAY_STORE_URL;
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    return APP_STORE_URL;
  }
  return PLAY_STORE_URL;
}

export default function EventJoinRedirectPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Opening app...");

  const eventId = String(params?.id || "").trim();
  const inviteCode = String(searchParams.get("inviteCode") || "").trim();
  const inviterId = String(searchParams.get("inviterId") || "").trim();

  const appUrl = useMemo(() => {
    const q = new URLSearchParams();
    if (eventId) q.set("eventId", eventId);
    if (inviteCode) q.set("inviteCode", inviteCode);
    if (inviterId) q.set("inviterId", inviterId);
    // Reuse app's existing deep-link parser path.
    return `sportx360://find-match?${q.toString()}`;
  }, [eventId, inviteCode, inviterId]);

  useEffect(() => {
    if (!eventId) {
      setStatus("Invalid event link.");
      return;
    }

    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const storeUrl = getStoreUrl(userAgent);
    let fallbackFired = false;

    const fallbackTimer = window.setTimeout(() => {
      fallbackFired = true;
      setStatus("App not opened? Redirecting to store...");
      window.location.replace(storeUrl);
    }, 1500);

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.clearTimeout(fallbackTimer);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    window.location.href = appUrl;

    return () => {
      if (!fallbackFired) window.clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [eventId, appUrl]);

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
          We are opening this event in your app. If it does not open, install SportX360.
        </p>
        <p style={{ marginTop: 8, color: "#98e7c0", fontWeight: 600 }}>{status}</p>
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


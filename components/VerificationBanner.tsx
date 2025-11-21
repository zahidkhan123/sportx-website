"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { verificationAPI } from "@/lib/api";

export function VerificationBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["verification-stats"],
    queryFn: () => verificationAPI.getStats(),
    refetchInterval: 60000, // Refetch every minute
  });

  useEffect(() => {
    // Check if banner was dismissed in localStorage
    const dismissed = localStorage.getItem("verificationBannerDismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("verificationBannerDismissed", "true");
  };

  if (isDismissed) return null;

  const verifiedCount = stats?.data?.verifiedCount || 54;
  const remainingSlots = stats?.data?.remainingSlots || 46;

  return (
    <div className="relative bg-gradient-to-r from-[#00FFFF]/10 via-[#39FF14]/10 to-[#00FFFF]/10 border-b border-[#00FFFF]/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#00FFFF] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">
                Get verified to sell faster, buy smarter, and unlock exclusive
                opportunities to get booked, hired, or discovered in the sports
                world.
              </p>
              <p className="text-white/70 text-xs mt-1">
                {verifiedCount} users verified — {remainingSlots} spots left from
                the first 100 free verifications.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/verification">
              <Button
                size="sm"
                className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
              >
                Verify Now
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4 text-white/70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


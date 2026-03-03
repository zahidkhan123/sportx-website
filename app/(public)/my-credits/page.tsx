"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { packagesAPI } from "@/lib/api";
import { authService } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Star, Sparkles, ShoppingCart, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface UserCredits {
  adsCredits: number;
  featuredCredits: number;
  boostCredits: number;
  freeAdsUsed: number;
  freeAdsRemaining: number;
  freeAdsResetDate?: string;
}

export default function MyCreditsPage() {
  const router = useRouter();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadCredits();
    
    // Refresh credits when page becomes visible (e.g., after admin approval)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadCredits(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh on focus
    window.addEventListener('focus', () => loadCredits(false));
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', () => loadCredits(false));
    };
  }, [router]);

  const loadCredits = async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      const response = await packagesAPI.getUserCredits();
      // Backend returns: { success: true, data: { user: {...} } }
      const userData = response.data?.user || response.data;

      setCredits({
        adsCredits: userData?.adsCredits || 0,
        featuredCredits: userData?.featuredCredits || 0,
        boostCredits: userData?.boostCredits || 0,
        freeAdsUsed: userData?.freeAdsUsed || 0,
        freeAdsRemaining: Math.max(0, 2 - (userData?.freeAdsUsed || 0)),
        freeAdsResetDate: userData?.freeAdsResetDate,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load credits");
    } finally {
      if (showLoading) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  const getResetDate = () => {
    if (!credits?.freeAdsResetDate) return "N/A";
    const date = new Date(credits.freeAdsResetDate);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4">Loading credits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              My Credits
            </h1>
            <button
              onClick={() => loadCredits(false)}
              disabled={refreshing}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
              title="Refresh credits"
            >
              <RefreshCw className={`w-5 h-5 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-gray-400 text-lg">
            Manage your ad credits and boost your listings
          </p>
        </div>

        {/* Credits Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Free Ads */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Free Ads</h3>
                <p className="text-xs text-gray-500">Monthly Limit</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">
              {credits?.freeAdsRemaining || 0} / 2
            </div>
            <div className="text-sm text-gray-400">
              Resets on {getResetDate()}
            </div>
          </Card>

          {/* Ad Credits */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Ad Credits</h3>
                <p className="text-xs text-gray-500">Purchased</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {credits?.adsCredits || 0}
            </div>
            <div className="text-sm text-gray-400">Available</div>
          </Card>

          {/* Featured Credits */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Featured</h3>
                <p className="text-xs text-gray-500">Tags</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {credits?.featuredCredits || 0}
            </div>
            <div className="text-sm text-gray-400">Available</div>
          </Card>

          {/* Boost Credits */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Boost</h3>
                <p className="text-xs text-gray-500">Credits</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {credits?.boostCredits || 0}
            </div>
            <div className="text-sm text-gray-400">Available</div>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Featured Ads
            </h3>
            <p className="text-gray-400 mb-4">
              Featured ads appear at the top of listings, giving you maximum
              visibility. Use a featured credit to feature any of your ads.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Appears at the top of search results</li>
              <li>• Permanent until manually removed</li>
              <li>• Increases visibility and engagement</li>
            </ul>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Boosted Ads
            </h3>
            <p className="text-gray-400 mb-4">
              Boost your ad to the top of listings for 24 hours. Perfect for
              time-sensitive promotions or new listings.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Pushes ad to top for 24 hours</li>
              <li>• Great for new listings</li>
              <li>• Increases views and responses</li>
            </ul>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link href="/packages">
            <Button className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy More Credits
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


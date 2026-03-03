"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { packagesAPI } from "@/lib/api";
import { authService } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShoppingCart, CreditCard, Sparkles, Star, FileText } from "lucide-react";

interface Package {
  _id: string;
  packageId: string;
  packageName: string;
  adsCredits: number;
  featuredCredits: number;
  boostCredits: number;
  price: number;
  description?: string;
}

interface UserCredits {
  adsCredits: number;
  featuredCredits: number;
  boostCredits: number;
  freeAdsUsed: number;
  freeAdsRemaining: number;
}

export default function PackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [paymentProof, setPaymentProof] = useState("");
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [packagesRes, creditsRes] = await Promise.all([
        packagesAPI.getAll(),
        packagesAPI.getUserCredits(),
      ]);

      setPackages(packagesRes.data || []);
      
      const userData = creditsRes.data;
      setCredits({
        adsCredits: userData?.adsCredits || 0,
        featuredCredits: userData?.featuredCredits || 0,
        boostCredits: userData?.boostCredits || 0,
        freeAdsUsed: userData?.freeAdsUsed || 0,
        freeAdsRemaining: Math.max(0, 2 - (userData?.freeAdsUsed || 0)),
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    try {
      setPurchasing(true);
      await packagesAPI.purchase(
        selectedPackage.packageId,
        paymentProof || "Paid to Admin"
      );
      toast.success("Purchase request submitted! Waiting for admin approval.");
      setShowPurchaseDialog(false);
      setSelectedPackage(null);
      setPaymentProof("");
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to purchase package");
    } finally {
      setPurchasing(false);
    }
  };

  const getPackageIcon = (pkg: Package) => {
    if (pkg.boostCredits > 0) return <Sparkles className="w-6 h-6" />;
    if (pkg.featuredCredits > 0) return <Star className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Buy Packages
          </h1>
          <p className="text-gray-400 text-lg">
            Unlock more features and boost your ads visibility
          </p>
        </div>

        {/* Credits Display */}
        {credits && (
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Credits</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {credits.freeAdsRemaining} / 2
                </div>
                <div className="text-sm text-gray-400">Free Ads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {credits.adsCredits}
                </div>
                <div className="text-sm text-gray-400">Ad Credits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {credits.featuredCredits}
                </div>
                <div className="text-sm text-gray-400">Featured</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {credits.boostCredits}
                </div>
                <div className="text-sm text-gray-400">Boost</div>
              </div>
            </div>
          </Card>
        )}

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card
              key={pkg._id}
              className="bg-white/5 backdrop-blur-md border-white/10 hover:border-cyan-500/50 transition-all"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getPackageIcon(pkg)}
                    <h3 className="text-xl font-semibold">{pkg.packageName}</h3>
                  </div>
                </div>

                {pkg.description && (
                  <p className="text-gray-400 mb-4">{pkg.description}</p>
                )}

                <div className="space-y-2 mb-6">
                  {pkg.adsCredits > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-green-400" />
                      <span>{pkg.adsCredits} Ad Credits</span>
                    </div>
                  )}
                  {pkg.featuredCredits > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{pkg.featuredCredits} Featured Tags</span>
                    </div>
                  )}
                  {pkg.boostCredits > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>{pkg.boostCredits} Boost Credits</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-cyan-400">
                    Rs {pkg.price}
                  </span>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600"
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setShowPurchaseDialog(true);
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="bg-black border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Purchase Package</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedPackage?.packageName} - Rs {selectedPackage?.price}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="payment-proof">Payment Proof (Optional)</Label>
              <Textarea
                id="payment-proof"
                placeholder="Enter payment details or 'Paid to Admin'"
                value={paymentProof}
                onChange={(e) => setPaymentProof(e.target.value)}
                className="bg-white/5 border-white/10 mt-2"
                rows={4}
              />
              <p className="text-sm text-gray-400 mt-2">
                Upload screenshot or enter payment confirmation details
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPurchaseDialog(false);
                  setPaymentProof("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={purchasing}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500"
              >
                {purchasing ? "Processing..." : "Confirm Purchase"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


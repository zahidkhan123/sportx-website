"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  marketplaceAPI,
  packagesAPI,
  type MarketplaceProductCondition,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Info, Star, Rocket, FileText } from "lucide-react";
import Link from "next/link";
import GoogleAds from "@/components/GoogleAds";
import { ImageUrlUploadField } from "@/components/ImageUrlUploadField";

export default function AddListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [""] as string[],
    price: "",
    category: "",
    condition: "New" as MarketplaceProductCondition,
    location: "",
    contactNumber: "",
    isFeatured: false,
  });

  const { data: categories } = useQuery({
    queryKey: ["marketplace-categories"],
    queryFn: () => marketplaceAPI.getCategories(),
  });

  // Fetch ad data if editing
  const { data: adData } = useQuery({
    queryKey: ["marketplace-ad", editId],
    queryFn: () => marketplaceAPI.getById(editId!),
    enabled: !!editId,
  });

  // Load ad data when editing
  useEffect(() => {
    if (adData?.data && isEditMode) {
      const ad = adData.data;
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setFormData({
          title: ad.title || "",
          description: ad.description || "",
          images: ad.images || [""],
          price: ad.price?.toString() || "",
          category: ad.category || "",
          condition: (ad.condition || "New") as MarketplaceProductCondition,
          location: ad.location || "",
          contactNumber: ad.contactNumber || "",
          isFeatured: ad.isFeatured || false,
        });
      }, 0);
    }
  }, [adData, isEditMode]);

  // Fetch user credits
  const { data: creditsData, refetch: refetchCredits } = useQuery({
    queryKey: ["user-credits"],
    queryFn: async () => {
      const response = await packagesAPI.getUserCredits();
      const user = response.data?.user || response.data;
      return {
        adsCredits: user?.adsCredits || 0,
        featuredCredits: user?.featuredCredits || 0,
        boostCredits: user?.boostCredits || 0,
        freeAdsUsed: user?.freeAdsUsed || 0,
        freeAdsRemaining: Math.max(0, 2 - (user?.freeAdsUsed || 0)),
      };
    },
  });

  const credits = creditsData || {
    adsCredits: 0,
    featuredCredits: 0,
    boostCredits: 0,
    freeAdsUsed: 0,
    freeAdsRemaining: 0,
  };

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      isEditMode
        ? marketplaceAPI.update(
            editId!,
            data as Parameters<typeof marketplaceAPI.update>[1]
          )
        : marketplaceAPI.create(
            data as Parameters<typeof marketplaceAPI.create>[0]
          ),
    onSuccess: () => {
      toast.success(
        isEditMode ? "Ad updated successfully!" : "Ad created successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["my-marketplace-ads"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-ad", editId] });
      if (!isEditMode) {
        refetchCredits();
      }
      router.push("/profile");
    },
    onError: (error: {
      response?: { data?: { message?: string; requiresPackage?: boolean } };
    }) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create ad";
      if (error.response?.data?.requiresPackage) {
        toast.error(errorMessage, {
          action: {
            label: "Buy Package",
            onClick: () => router.push("/packages"),
          },
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || formData.title.trim() === "") {
      toast.error("Title is required");
      return;
    }

    if (!formData.description || formData.description.trim() === "") {
      toast.error("Description is required");
      return;
    }

    if (!formData.images[0] || formData.images[0].trim() === "") {
      toast.error("Add at least one image (URL or upload)");
      return;
    }

    if (
      !formData.price ||
      formData.price.trim() === "" ||
      Number(formData.price) < 0
    ) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!formData.category || formData.category.trim() === "") {
      toast.error("Please select a category");
      return;
    }

    if (!formData.location || formData.location.trim() === "") {
      toast.error("Location is required");
      return;
    }

    if (!formData.contactNumber || formData.contactNumber.trim() === "") {
      toast.error("Contact number is required");
      return;
    }

    // Check credits before submitting
    const hasFreeAds = credits.freeAdsRemaining > 0;
    const hasAdCredits = credits.adsCredits > 0;
    const needsFeaturedCredit =
      formData.isFeatured && credits.featuredCredits < 1;

    if (!hasFreeAds && !hasAdCredits) {
      toast.error("You've used your free ads. Buy a package to post more.", {
        action: {
          label: "Buy Package",
          onClick: () => router.push("/packages"),
        },
      });
      return;
    }

    if (needsFeaturedCredit) {
      toast.error(
        "You need featured credits to create a featured ad. Buy a package with featured credits.",
        {
          action: {
            label: "Buy Package",
            onClick: () => router.push("/packages"),
          },
        }
      );
      return;
    }

    createMutation.mutate({
      ...formData,
      price: Number(formData.price),
      images: formData.images.filter((img) => img.trim() !== ""),
    });
  };

  const addImageField = () => {
    if (formData.images.length < 6) {
      setFormData({ ...formData, images: [...formData.images, ""] });
    }
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index),
      });
    }
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-6">
          {/* Left Vertical Ad Sidebar */}
          <div className="hidden xl:block w-[300px] flex-shrink-0">
            <div className="sticky top-4">
              <GoogleAds
                adSlot="3814764721"
                adFormat="vertical"
                className="w-full"
                minHeight="600px"
              />
            </div>
          </div>

          {/* Main Form Content */}
          <div className="flex-1">
            <Link
              href="/my-listings"
              className="inline-flex items-center text-white/70 hover:text-white mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Listings
            </Link>

            <Card className="glass-card border-white/10">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-3xl font-bold text-white">
                  {isEditMode
                    ? "Edit Marketplace Ad"
                    : "Create New Marketplace Ad"}
                </CardTitle>
                <p className="text-white/70 mt-2">
                  {isEditMode
                    ? "Update your marketplace ad details"
                    : "List your sports equipment or items for sale"}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information Section */}
                  <div className="space-y-6 pb-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="title"
                          className="text-white text-sm font-medium"
                        >
                          Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                          maxLength={100}
                          className="bg-white/5 border-white/10 text-white h-11"
                          placeholder="e.g., Professional Cricket Bat"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-white text-sm font-medium"
                        >
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          required
                          maxLength={2000}
                          rows={5}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                          placeholder="Describe your item in detail..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images Section */}
                  <div className="space-y-4 pb-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Images
                    </h3>
                    <div className="space-y-3">
                      <Label className="text-white text-sm font-medium">
                        Images <span className="text-red-500">*</span> (1–6 —
                        URL or upload each)
                      </Label>
                      <p className="text-xs text-white/50">
                        You must be signed in to upload files (JPEG, PNG, GIF,
                        WebP, max 10MB).
                      </p>
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row gap-2 sm:items-start"
                        >
                          <div className="flex-1 min-w-0">
                            <ImageUrlUploadField
                              label={`Image ${index + 1}`}
                              value={image}
                              onChange={(url) => updateImage(index, url)}
                              uploadName={`marketplace-ad-${index}`}
                              required={index === 0}
                            />
                          </div>
                          {formData.images.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeImageField(index)}
                              className="border-red-500/30 text-red-500 hover:bg-red-500/10 h-11 shrink-0 sm:mt-7"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      {formData.images.length < 6 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addImageField}
                          className="border-white/10 text-white hover:bg-white/5 h-11"
                        >
                          + Add Another Image
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Details Section */}
                  <div className="space-y-6 pb-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Pricing & Details
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="price"
                          className="text-white text-sm font-medium"
                        >
                          Price (Rs) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          required
                          min="0"
                          className="bg-white/5 border-white/10 text-white h-11"
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="category"
                          className="text-white text-sm font-medium"
                        >
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData({ ...formData, category: value })
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-white/10">
                            {categories?.data?.map(
                              (cat: { value: string; name: string }) => (
                                <SelectItem
                                  key={cat.value}
                                  value={cat.value}
                                  className="text-white"
                                >
                                  {cat.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="condition"
                          className="text-white text-sm font-medium"
                        >
                          Condition <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.condition}
                          onValueChange={(value: MarketplaceProductCondition) =>
                            setFormData({ ...formData, condition: value })
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-white/10">
                            <SelectItem value="New" className="text-white">
                              New
                            </SelectItem>
                            <SelectItem value="Like New" className="text-white">
                              Like New
                            </SelectItem>
                            <SelectItem value="Good" className="text-white">
                              Good
                            </SelectItem>
                            <SelectItem value="Fair" className="text-white">
                              Fair
                            </SelectItem>
                            <SelectItem value="Used" className="text-white">
                              Used
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="location"
                          className="text-white text-sm font-medium"
                        >
                          Location <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          required
                          className="bg-white/5 border-white/10 text-white h-11"
                          placeholder="e.g., Lahore, Pakistan"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-6 pb-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <Label
                        htmlFor="contactNumber"
                        className="text-white text-sm font-medium"
                      >
                        Contact Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contactNumber"
                        value={formData.contactNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactNumber: e.target.value,
                          })
                        }
                        required
                        className="bg-white/5 border-white/10 text-white h-11"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                  </div>

                  {/* Credits Info Banner */}
                  <div className="p-4 bg-[#00FFA3]/10 rounded-lg border border-[#00FFA3]/30 mb-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-[#00FFA3] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-2">
                          Your Available Credits
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-2 text-white/70 mb-1">
                              <FileText className="h-4 w-4" />
                              <span>Free Ads</span>
                            </div>
                            <div className="text-[#00FFA3] font-semibold">
                              {credits.freeAdsRemaining} / 2 remaining
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-white/70 mb-1">
                              <FileText className="h-4 w-4" />
                              <span>Ad Credits</span>
                            </div>
                            <div className="text-[#00FFA3] font-semibold">
                              {credits.adsCredits}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-white/70 mb-1">
                              <Star className="h-4 w-4" />
                              <span>Featured</span>
                            </div>
                            <div
                              className={`font-semibold ${
                                credits.featuredCredits > 0
                                  ? "text-[#00FFA3]"
                                  : "text-orange-400"
                              }`}
                            >
                              {credits.featuredCredits}
                              {credits.featuredCredits === 0 &&
                                " (Buy package)"}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-white/70 mb-1">
                              <Rocket className="h-4 w-4" />
                              <span>Boost</span>
                            </div>
                            <div className="text-[#00FFA3] font-semibold">
                              {credits.boostCredits}
                            </div>
                          </div>
                        </div>
                        {credits.freeAdsRemaining === 0 &&
                          credits.adsCredits === 0 && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <Link
                                href="/packages"
                                className="text-[#00FFA3] hover:text-[#00FFFF] text-sm font-medium"
                              >
                                Buy a package to get more credits →
                              </Link>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Featured Option */}
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked,
                        })
                      }
                      disabled={credits.featuredCredits === 0}
                      className="w-5 h-5 rounded accent-[#00FFA3] mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="isFeatured"
                        className="text-white cursor-pointer"
                      >
                        Make this a featured ad (premium)
                      </Label>
                      <p className="text-white/60 text-sm mt-1">
                        Your ad will appear in the featured section for 7 days
                      </p>
                      {credits.featuredCredits === 0 && (
                        <p className="text-orange-400 text-sm mt-1">
                          Featured Credits: {credits.featuredCredits} (Buy
                          package to get featured credits)
                        </p>
                      )}
                      {credits.featuredCredits > 0 && (
                        <p className="text-[#00FFA3] text-sm mt-1">
                          Featured Credits: {credits.featuredCredits} available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90 h-12 text-lg font-semibold"
                    >
                      {createMutation.isPending
                        ? isEditMode
                          ? "Updating Ad..."
                          : "Creating Ad..."
                        : isEditMode
                        ? "Update Ad"
                        : "Create Ad"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Vertical Ad Sidebar */}
          <div className="hidden xl:block w-[300px] flex-shrink-0">
            <div className="sticky top-4">
              <GoogleAds
                adSlot="3814764721"
                adFormat="vertical"
                className="w-full"
                minHeight="600px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

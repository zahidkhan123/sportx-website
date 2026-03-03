"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listingsAPI, formSchemaAPI } from "@/lib/api";
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
import { ArrowLeft, Loader2, Star, Rocket, FileText } from "lucide-react";
import Link from "next/link";
import GoogleAds from "@/components/GoogleAds";
import { packagesAPI } from "@/lib/api";

const SPORTS = [
  { value: "cricket", label: "Cricket" },
  { value: "football", label: "Football" },
  { value: "hockey", label: "Hockey" },
  { value: "badminton", label: "Badminton" },
  { value: "table_tennis", label: "Table Tennis" },
  { value: "volleyball", label: "Volleyball" },
  { value: "tennis", label: "Tennis" },
  { value: "basketball", label: "Basketball" },
  { value: "baseball", label: "Baseball" },
  { value: "kabaddi", label: "Kabaddi" },
  { value: "squash", label: "Squash" },
  { value: "golf", label: "Golf" },
  { value: "rugby", label: "Rugby" },
  { value: "athletics", label: "Athletics" },
  { value: "swimming", label: "Swimming" },
  { value: "handball", label: "Handball" },
  { value: "chess", label: "Chess" },
  { value: "cycling", label: "Cycling" },
  { value: "boxing", label: "Boxing" },
];

const LISTING_TYPES = [
  { value: "player", label: "Player" },
  { value: "team", label: "Team" },
  { value: "tournament", label: "Tournament" },
  { value: "ground", label: "Ground" },
  { value: "umpire", label: "Umpire" },
  { value: "referee", label: "Referee" },
  { value: "commentator", label: "Commentator" },
  { value: "scorer", label: "Scorer" },
  { value: "coach", label: "Coach" },
];

export default function CreateListingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sportType, setSportType] = useState("");
  const [listingType, setListingType] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [schema, setSchema] = useState<any>(null);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Fetch user credits
  const { data: creditsData } = useQuery({
    queryKey: ["user-credits"],
    queryFn: async () => {
      const response = await packagesAPI.getUserCredits();
      const user = response.data?.user || response.data;
      return {
        boostCredits: user?.boostCredits || 0,
        featuredCredits: user?.featuredCredits || 0,
        adsCredits: user?.adsCredits || 0,
        freeAdsRemaining: user?.freeAdsRemaining || 0,
      };
    },
  });

  const credits = creditsData || {
    boostCredits: 0,
    featuredCredits: 0,
    adsCredits: 0,
    freeAdsRemaining: 0,
  };

  // Load form schema when sport and listing type are selected
  useEffect(() => {
    if (sportType && listingType) {
      loadFormSchema();
    } else {
      setSchema(null);
      setFormData({});
    }
  }, [sportType, listingType]);

  const loadFormSchema = async () => {
    try {
      setLoadingSchema(true);
      const response = await formSchemaAPI.getSchema(sportType, listingType);
      setSchema(response.data);

      // Initialize form data with default values
      const initialData: Record<string, any> = {
        description: "", // Always include description field
      };
      response.data.fields.forEach((field: any) => {
        if (field.defaultValue !== undefined) {
          initialData[field.name] = field.defaultValue;
        } else if (field.type === "switch") {
          initialData[field.name] = false;
        } else if (field.type === "multiselect") {
          initialData[field.name] = [];
        } else {
          initialData[field.name] = "";
        }
      });
      setFormData(initialData);
    } catch (error: any) {
      console.error("Error loading form schema:", error);
      toast.error("Failed to load form schema");
    } finally {
      setLoadingSchema(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => listingsAPI.create(data),
    onSuccess: () => {
      toast.success("Listing created successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      router.push("/my-listings");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create listing";
      const errors = error.response?.data?.errors;

      if (errors && Array.isArray(errors)) {
        toast.error(errors.join(", "));
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sportType || !listingType) {
      toast.error("Please select sport type and listing type");
      return;
    }

    if (!schema) {
      toast.error("Please wait for form to load");
      return;
    }

    // Validate required fields
    const validationErrors: string[] = [];

    // Always validate description
    if (!formData.description || formData.description.trim() === "") {
      validationErrors.push("Description is required");
    }

    schema.fields.forEach((field: any) => {
      if (field.required && field.name !== "description") {
        const value = formData[field.name];
        if (value === undefined || value === null || value === "") {
          if (field.type === "multiselect") {
            if (!Array.isArray(value) || value.length === 0) {
              validationErrors.push(`${field.label || field.name} is required`);
            }
          } else {
            validationErrors.push(`${field.label || field.name} is required`);
          }
        }
      }
    });

    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(", "));
      return;
    }

    // Check credits for boost/featured
    if (isBoosted && credits.boostCredits < 1) {
      toast.error(
        "You don't have boost credits. Buy a package to get boost credits.",
        {
          action: {
            label: "Buy Package",
            onClick: () => router.push("/packages"),
          },
        }
      );
      return;
    }

    if (isFeatured && credits.featuredCredits < 1) {
      toast.error(
        "You don't have featured credits. Buy a package to get featured credits.",
        {
          action: {
            label: "Buy Package",
            onClick: () => router.push("/packages"),
          },
        }
      );
      return;
    }

    // Clean up data - remove empty strings and null values
    const cleanedData: Record<string, any> = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value !== "" && value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            cleanedData[key] = value;
          }
        } else {
          cleanedData[key] = value;
        }
      }
    });

    // Get title from form data
    const title =
      cleanedData.title ||
      cleanedData.teamName ||
      cleanedData.playerName ||
      "New Listing";

    // Parse location safely
    let location: any = {};
    if (cleanedData.location) {
      try {
        if (typeof cleanedData.location === "string") {
          location = JSON.parse(cleanedData.location);
        } else if (typeof cleanedData.location === "object") {
          location = cleanedData.location;
        }
      } catch (e) {
        if (typeof cleanedData.location === "string") {
          location = { address: cleanedData.location };
        }
      }
    }

    // Build contact object only with non-empty values
    const contact: Record<string, string> = {};
    const phone = cleanedData.contactNumber || cleanedData.phone;
    const email = cleanedData.email;

    if (phone && typeof phone === "string" && phone.trim() !== "") {
      contact.phone = phone.trim();
    }
    if (email && typeof email === "string" && email.trim() !== "") {
      contact.email = email.trim();
    }

    const listingData = {
      sportType,
      listingType,
      title,
      description: cleanedData.description || "",
      data: cleanedData,
      ...(Object.keys(contact).length > 0 ? { contact } : {}),
      location: Object.keys(location).length > 0 ? location : undefined,
      isBoosted: isBoosted,
      isFeatured: isFeatured,
    };

    createMutation.mutate(listingData);
  };

  const renderField = (field: any) => {
    const value = formData[field.name] || "";
    const error = null; // You can add error state if needed

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "number":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-white">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={
                field.type === "email"
                  ? "email"
                  : field.type === "number"
                  ? "number"
                  : "text"
              }
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              placeholder={field.placeholder || ""}
              className="bg-white/5 border-white/10 text-white"
            />
            {field.helperText && (
              <p className="text-sm text-white/60">{field.helperText}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-white">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              placeholder={field.placeholder || ""}
              rows={4}
              className="bg-white/5 border-white/10 text-white"
            />
            {field.helperText && (
              <p className="text-sm text-white/60">{field.helperText}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="space-y-2">
            <Label className="text-white">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value || ""}
              onValueChange={(val) => handleFieldChange(field.name, val)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder={`Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10">
                {field.options?.map((option: string) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="text-white"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helperText && (
              <p className="text-sm text-white/60">{field.helperText}</p>
            )}
          </div>
        );

      case "multiselect":
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div key={field.name} className="space-y-2">
            <Label className="text-white">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex flex-wrap gap-2">
              {field.options?.map((option: string) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      const newValues = isSelected
                        ? selectedValues.filter((v: string) => v !== option)
                        : [...selectedValues, option];
                      handleFieldChange(field.name, newValues);
                    }}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      isSelected
                        ? "bg-[#00FFA3] text-black border-[#00FFA3]"
                        : "bg-white/5 text-white border-white/10 hover:border-white/30"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {field.helperText && (
              <p className="text-sm text-white/60">{field.helperText}</p>
            )}
          </div>
        );

      case "switch":
        return (
          <div
            key={field.name}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <Label htmlFor={field.name} className="text-white cursor-pointer">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <input
              type="checkbox"
              id={field.name}
              checked={value || false}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="w-5 h-5 rounded"
            />
          </div>
        );

      case "date":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-white">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="date"
              value={value || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              className="bg-white/5 border-white/10 text-white"
            />
            {field.helperText && (
              <p className="text-sm text-white/60">{field.helperText}</p>
            )}
          </div>
        );

      default:
        return null;
    }
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
                  Create New Sports Listing
                </CardTitle>
                <p className="text-white/70 mt-2">
                  Fill in the details below to create your listing
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information Section */}
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-white/10">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Basic Information
                      </h3>
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Sport Type Selection */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="sportType"
                            className="text-white text-sm font-medium"
                          >
                            Sport Type <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={sportType}
                            onValueChange={setSportType}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                              <SelectValue placeholder="Select sport type" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-white/10">
                              {SPORTS.map((sport) => (
                                <SelectItem
                                  key={sport.value}
                                  value={sport.value}
                                  className="text-white"
                                >
                                  {sport.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Listing Type Selection */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="listingType"
                            className="text-white text-sm font-medium"
                          >
                            Listing Type <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={listingType}
                            onValueChange={setListingType}
                            disabled={!sportType}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                              <SelectValue placeholder="Select listing type" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-white/10">
                              {LISTING_TYPES.map((type) => (
                                <SelectItem
                                  key={type.value}
                                  value={type.value}
                                  className="text-white"
                                >
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Description Field - Always Show */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-white text-sm font-medium"
                      >
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) =>
                          handleFieldChange("description", e.target.value)
                        }
                        required
                        placeholder="Provide a detailed description of your listing..."
                        rows={5}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                      />
                      <p className="text-xs text-white/60">
                        This description will be displayed on your listing card
                        and detail page
                      </p>
                    </div>
                  </div>

                  {/* Loading Schema */}
                  {loadingSchema && (
                    <div className="flex items-center justify-center py-12 border-y border-white/10">
                      <Loader2 className="h-8 w-8 animate-spin text-[#00FFA3]" />
                      <span className="ml-3 text-white">
                        Loading form fields...
                      </span>
                    </div>
                  )}

                  {/* Dynamic Form Fields */}
                  {schema && !loadingSchema && (
                    <div className="space-y-6 pt-6 border-t border-white/10">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Additional Details
                      </h3>
                      <div className="grid gap-6 md:grid-cols-2">
                        {schema.fields
                          .filter((field: any) => field.name !== "description")
                          .map((field: any) => (
                            <div
                              key={field.name}
                              className={
                                field.type === "textarea" ||
                                field.type === "multiselect" ||
                                field.type === "switch"
                                  ? "md:col-span-2"
                                  : ""
                              }
                            >
                              {renderField(field)}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Credits Display */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                      <h3 className="text-white font-semibold mb-4">
                        Your Credits
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                            {credits.featuredCredits === 0 && " (Buy package)"}
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
                        <div>
                          <div className="flex items-center gap-2 text-white/70 mb-1">
                            <FileText className="h-4 w-4" />
                            <span>Free Ads</span>
                          </div>
                          <div className="text-[#00FFA3] font-semibold">
                            {credits.freeAdsRemaining}
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

                    {/* Boost Option */}
                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 mb-4">
                      <input
                        type="checkbox"
                        id="isBoosted"
                        checked={isBoosted}
                        onChange={(e) => setIsBoosted(e.target.checked)}
                        disabled={credits.boostCredits === 0}
                        className="w-5 h-5 rounded accent-[#00FFA3] mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="isBoosted"
                          className="text-white cursor-pointer"
                        >
                          Boost this listing (premium)
                        </Label>
                        <p className="text-white/60 text-sm mt-1">
                          Your listing will appear at the top for 24 hours
                        </p>
                        {credits.boostCredits === 0 && (
                          <p className="text-orange-400 text-sm mt-1">
                            Boost Credits: {credits.boostCredits} (Buy package
                            to get boost credits)
                          </p>
                        )}
                        {credits.boostCredits > 0 && (
                          <p className="text-[#00FFA3] text-sm mt-1">
                            Boost Credits: {credits.boostCredits} available
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Featured Option */}
                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 mb-6">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        disabled={credits.featuredCredits === 0}
                        className="w-5 h-5 rounded accent-[#00FFA3] mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="isFeatured"
                          className="text-white cursor-pointer"
                        >
                          Make this a featured listing (premium)
                        </Label>
                        <p className="text-white/60 text-sm mt-1">
                          Your listing will appear at the top of listings
                        </p>
                        {credits.featuredCredits === 0 && (
                          <p className="text-orange-400 text-sm mt-1">
                            Featured Credits: {credits.featuredCredits} (Buy
                            package to get featured credits)
                          </p>
                        )}
                        {credits.featuredCredits > 0 && (
                          <p className="text-[#00FFA3] text-sm mt-1">
                            Featured Credits: {credits.featuredCredits}{" "}
                            available
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={
                        createMutation.isPending ||
                        !sportType ||
                        !listingType ||
                        loadingSchema ||
                        !schema
                      }
                      className="w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90 disabled:opacity-50 h-12 text-lg font-semibold"
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Creating Listing...
                        </>
                      ) : (
                        "Create Listing"
                      )}
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

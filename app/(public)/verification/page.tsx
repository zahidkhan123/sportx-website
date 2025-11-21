"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import {
  CheckCircle2,
  Zap,
  TrendingUp,
  Users,
  Shield,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { verificationAPI, uploadAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const SPORTS_CATEGORIES = [
  "Cricket",
  "Football",
  "Hockey",
  "Badminton",
  "Table Tennis",
  "Volleyball",
  "Tennis",
  "Basketball",
  "Baseball",
  "Kabaddi",
  "Squash",
  "Golf",
  "Rugby",
  "Athletics",
  "Swimming",
  "Handball",
  "Chess",
  "Cycling",
  "Boxing",
];

export default function VerificationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    sportsCategory: "",
    bio: "",
    idDocumentUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: status } = useQuery({
    queryKey: ["verification-status"],
    queryFn: () => verificationAPI.getStatus(),
  });

  useEffect(() => {
    if (status?.data?.isVerified) {
      router.push("/");
      toast.success("You are already verified!");
    }
  }, [status, router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Please upload an image or PDF file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIdDocumentFile(file);
    setUploading(true);

    try {
      const response = await uploadAPI.uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        idDocumentUrl: response.data.url,
      }));
      setPreviewUrl(response.data.url);
      toast.success("Document uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.city || !formData.sportsCategory || !formData.bio || !formData.idDocumentUrl) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await verificationAPI.submitRequest(formData);
      toast.success("Verification request submitted successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit verification request");
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: "Faster Selling",
      description: "Get your listings noticed faster with verified badge",
    },
    {
      icon: TrendingUp,
      title: "Higher Visibility",
      description: "Stand out in search results and recommendations",
    },
    {
      icon: Users,
      title: "More Bookings",
      description: "Increase trust and get more opportunities",
    },
    {
      icon: Shield,
      title: "Trust Boost",
      description: "Build credibility with verified status",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0d0d3a] to-[#1a1a2e] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-white/70 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Preview & Benefits */}
          <div className="space-y-6">
            {/* Verified Profile Preview */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00FFFF]" />
                  Verified Profile Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#39FF14] flex items-center justify-center">
                    <span className="text-2xl font-bold text-black">JD</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold">John Doe</h3>
                      <VerifiedBadge size="md" />
                    </div>
                    <p className="text-white/70 text-sm">Cricket Player</p>
                    <p className="text-white/60 text-xs mt-1">Lahore, Pakistan</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Benefits of Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-[#00FFFF]/10 rounded-lg">
                      <benefit.icon className="h-5 w-5 text-[#00FFFF]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{benefit.title}</h4>
                      <p className="text-white/70 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Verification Request</CardTitle>
              <p className="text-white/70 text-sm">
                Fill out the form below to request verification
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-white">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    className="bg-white/5 border-white/10 text-white mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-white">
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="bg-white/5 border-white/10 text-white mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sportsCategory" className="text-white">
                    Sports Category *
                  </Label>
                  <Select
                    value={formData.sportsCategory}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, sportsCategory: value }))
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                      <SelectValue placeholder="Select sports category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPORTS_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bio" className="text-white">
                    Brief Bio/Description *
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    className="bg-white/5 border-white/10 text-white mt-1"
                    rows={4}
                    maxLength={500}
                    required
                  />
                  <p className="text-white/60 text-xs mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="idDocument" className="text-white">
                    Upload CNIC or ID Document *
                  </Label>
                  <div className="mt-1">
                    <input
                      type="file"
                      id="idDocument"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="idDocument"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#00FFFF]/50 transition-colors bg-white/5"
                    >
                      {uploading ? (
                        <div className="text-white/70">Uploading...</div>
                      ) : previewUrl ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={previewUrl}
                            alt="ID Document"
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-white/70 mb-2" />
                          <p className="text-white/70 text-sm">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-white/60 text-xs mt-1">
                            PNG, JPG, PDF up to 5MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
                >
                  {submitting ? "Submitting..." : "Submit Verification Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


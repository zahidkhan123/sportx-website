"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { feedbackAPI } from "@/lib/api";

const EMOJIS = ["😡", "😕", "😐", "🙂", "😍"];
const TAGS_LOW = [
  "App is slow",
  "Listing issues",
  "Payment problem",
  "Incorrect listing info",
  "UI confusing",
  "Notifications issue",
  "Other",
];
const TAGS_HIGH = [
  "Easy to use",
  "Great listings",
  "Good marketplace",
  "Clean design",
  "Smooth payment",
  "Helpful support",
];

export default function ProfileFeedbackPage() {
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [featureSuggestion, setFeatureSuggestion] = useState(false);
  const [featureRequest, setFeatureRequest] = useState("");
  const [allowContact, setAllowContact] = useState(false);
  const [loading, setLoading] = useState(false);

  const tagOptions = rating != null ? (rating <= 3 ? TAGS_LOW : TAGS_HIGH) : [];
  const tagTitle =
    rating != null
      ? rating <= 3
        ? "What went wrong?"
        : "What did you like?"
      : null;

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating == null) {
      toast.error("Please select a rating");
      return;
    }
    setLoading(true);
    try {
      await feedbackAPI.submit({
        rating,
        tags,
        message: message.trim() || undefined,
        featureRequest: featureSuggestion ? featureRequest.trim() || undefined : undefined,
        allowContact,
        platform: "web",
        appVersion: "1.0.0",
      });
      toast.success("Thank you! Your feedback has been submitted.");
      setRating(null);
      setTags([]);
      setMessage("");
      setFeatureSuggestion(false);
      setFeatureRequest("");
      setAllowContact(false);
      setTimeout(() => router.push("/profile"), 800);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to submit feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-white/70 hover:text-[#00FFA3] mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Feedback</h1>
        <p className="text-white/70 mb-8">Help us improve by sharing your experience.</p>

        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Emoji rating */}
              <div>
                <Label className="text-[#00FFA3] text-base font-semibold block mb-3">
                  How would you rate your experience?
                </Label>
                <div className="flex justify-between gap-2">
                  {EMOJIS.map((emoji, index) => {
                    const value = index + 1;
                    const isSelected = rating === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 transition-colors ${
                          isSelected
                            ? "bg-[#00FFA3]/20 border-[#00FFA3]"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reason tags */}
              {tagTitle && (
                <div>
                  <Label className="text-[#00FFA3] text-base font-semibold block mb-2">
                    {tagTitle}
                  </Label>
                  <p className="text-white/60 text-sm mb-3">(Select all that apply)</p>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                          tags.includes(tag)
                            ? "bg-[#00FFA3]/20 border-[#00FFA3] text-[#00FFA3]"
                            : "bg-white/5 border-white/10 text-white/80 hover:border-white/20"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional message */}
              <div>
                <Label className="text-white font-medium block mb-2">
                  Tell us more (optional)
                </Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts…"
                  maxLength={250}
                  rows={3}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                />
                <p className="text-white/50 text-xs mt-1">{message.length}/250</p>
              </div>

              {/* Feature suggestion */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <Label className="text-white font-medium">I have a feature suggestion</Label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={featureSuggestion}
                  onClick={() => setFeatureSuggestion(!featureSuggestion)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    featureSuggestion ? "bg-[#00FFA3]" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      featureSuggestion ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
              {featureSuggestion && (
                <Textarea
                  value={featureRequest}
                  onChange={(e) => setFeatureRequest(e.target.value)}
                  placeholder="What would you like us to add?"
                  rows={3}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                />
              )}

              {/* Contact permission */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <Label className="text-white font-medium block">
                    You may contact me about this feedback
                  </Label>
                  <p className="text-white/50 text-sm mt-1">
                    We&apos;ll only reach out if we need clarification.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={allowContact}
                  onClick={() => setAllowContact(!allowContact)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    allowContact ? "bg-[#00FFA3]" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      allowContact ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <Button
                type="submit"
                disabled={rating == null || loading}
                className="w-full bg-[#00FFA3] hover:bg-[#00FFA3]/90 text-black font-semibold h-12 disabled:opacity-50"
              >
                {loading ? "Submitting…" : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

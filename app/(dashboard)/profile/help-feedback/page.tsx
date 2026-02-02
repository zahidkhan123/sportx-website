"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, HelpCircle, MessageSquare, Send, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supportAPI } from "@/lib/api";
import { authService } from "@/lib/auth";

export default function ProfileHelpFeedbackPage() {
  const router = useRouter();
  const user = authService.getCurrentUser() as { _id?: string; id?: string; email?: string; fullName?: string; name?: string } | null;
  const [type, setType] = useState<"help" | "feedback">("help");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const subjectPlaceholder =
    type === "help" ? "Enter help subject" : "Enter feedback subject";
  const messagePlaceholder =
    type === "help"
      ? "Describe your issue or question…"
      : "Describe your feedback…";
  const infoText =
    type === "help"
      ? "We typically respond within 24–48 hours."
      : "Your feedback helps us improve the app!";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    if (!trimmedSubject || !trimmedMessage) {
      toast.error("Please enter subject and message.");
      return;
    }
    setLoading(true);
    try {
      await supportAPI.submitContact({
        type,
        subject: trimmedSubject,
        message: trimmedMessage,
        userId: ((user as any)?._id ?? (user as any)?.id) as string | undefined,
        userEmail: user?.email,
        userName: (user?.fullName ?? user?.name) as string | undefined,
      });
      toast.success("Message sent! We will get back to you soon.");
      setSubject("");
      setMessage("");
      setTimeout(() => router.push("/profile"), 800);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to send message."
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

        <h1 className="text-3xl font-bold text-white mb-2">Help / Feedback</h1>
        <p className="text-white/70 mb-8">
          Get help or send us your feedback.
        </p>

        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("help")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-colors ${
                    type === "help"
                      ? "bg-[#00FFA3] border-[#00FFA3] text-black"
                      : "bg-white/5 border-white/10 text-white hover:border-white/20"
                  }`}
                >
                  <HelpCircle className="h-5 w-5" />
                  Help
                </button>
                <button
                  type="button"
                  onClick={() => setType("feedback")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-colors ${
                    type === "feedback"
                      ? "bg-[#00FFA3] border-[#00FFA3] text-black"
                      : "bg-white/5 border-white/10 text-white hover:border-white/20"
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                  Feedback
                </button>
              </div>

              <div>
                <Label className="text-white font-medium block mb-2">Subject</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={subjectPlaceholder}
                  maxLength={100}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <Label className="text-white font-medium block mb-2">Message</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={messagePlaceholder}
                  maxLength={1000}
                  rows={5}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                />
                <p className="text-white/50 text-xs mt-1">{message.length}/1000</p>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#00FFA3]/10 border border-[#00FFA3]/30">
                <Info className="h-5 w-5 text-[#00FFA3] shrink-0 mt-0.5" />
                <p className="text-white/90 text-sm">{infoText}</p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00FFA3] hover:bg-[#00FFA3]/90 text-black font-semibold h-12 disabled:opacity-50"
              >
                {loading ? (
                  "Sending…"
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { featuredAdRequestAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface FeaturedAdRequestButtonProps {
  adId: string;
  adTitle: string;
  isOwner: boolean;
}

export function FeaturedAdRequestButton({
  adId,
  adTitle,
  isOwner,
}: FeaturedAdRequestButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [featuredDuration, setFeaturedDuration] = useState("7");
  const queryClient = useQueryClient();

  const { data: statusData } = useQuery({
    queryKey: ["featured-ad-request-status", adId],
    queryFn: () => featuredAdRequestAPI.getStatus(adId),
    enabled: isOwner && !!adId,
  });

  const requestStatus = statusData?.data?.status;

  const submitMutation = useMutation({
    mutationFn: (data: { adId: string; message?: string; featuredDuration?: number }) =>
      featuredAdRequestAPI.submitRequest(data),
    onSuccess: () => {
      toast.success("Featured ad request submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["featured-ad-request-status", adId] });
      setOpen(false);
      setMessage("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit request");
    },
  });

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please provide a message explaining why your ad should be featured");
      return;
    }

    submitMutation.mutate({
      adId,
      message: message.trim(),
      featuredDuration: parseInt(featuredDuration) || 7,
    });
  };

  if (!isOwner) return null;

  if (requestStatus === "approved") {
    return (
      <div className="flex items-center gap-2 text-[#00FFA3]">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-semibold">This ad is featured!</span>
      </div>
    );
  }

  if (requestStatus === "pending") {
    return (
      <div className="flex items-center gap-2 text-yellow-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Featured request pending review</span>
      </div>
    );
  }

  if (requestStatus === "rejected") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-red-500">
          <XCircle className="h-5 w-5" />
          <span className="text-sm">Featured request rejected</span>
        </div>
        {statusData?.data?.rejectionReason && (
          <p className="text-xs text-red-400">
            Reason: {statusData.data.rejectionReason}
          </p>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOpen(true)}
          className="border-[#00FFA3]/50 text-[#00FFA3] hover:bg-[#00FFA3]/10"
        >
          <Star className="h-4 w-4 mr-2" />
          Request Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-[#00FFA3]/50 text-[#00FFA3] hover:bg-[#00FFA3]/10"
      >
        <Star className="h-4 w-4 mr-2" />
        Request Featured Status
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] bg-black border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-[#00FFA3]" />
              Request Featured Ad Status
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Request to make "{adTitle}" a featured ad. Featured ads get more visibility
              and appear at the top of search results.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">
                Featured Duration (days)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="30"
                value={featuredDuration}
                onChange={(e) => setFeaturedDuration(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                placeholder="7"
              />
              <p className="text-xs text-white/60">
                How many days would you like your ad to be featured? (1-30 days)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">
                Why should your ad be featured? *
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain why your ad deserves featured status..."
                rows={4}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                required
              />
              <p className="text-xs text-white/60">
                Tell us what makes your ad special and why it should be featured.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || !message.trim()}
              className="bg-[#00FFA3] text-black hover:bg-[#00FFA3]/90"
            >
              {submitMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


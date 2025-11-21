"use client";

import { CheckCircle2 } from "lucide-react";

interface VerifiedBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VerifiedBadge({ className = "", size = "md" }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <CheckCircle2
      className={`${sizeClasses[size]} text-blue-500 fill-blue-500 ${className}`}
      aria-label="Verified user"
    />
  );
}


"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function ChatsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[300px]">
      <div className="rounded-full bg-white/5 p-6 mb-4">
        <MessageCircle className="h-14 w-14 text-white/40" />
      </div>
      <h2 className="text-lg font-semibold text-white mb-1">Select a conversation</h2>
      <p className="text-sm text-white/60 max-w-xs mb-6">
        Choose a conversation from the list to view messages, or start a new chat from a listing or marketplace ad.
      </p>
      <Link
        href="/marketplace"
        className="text-sm font-medium text-[#00FFFF] hover:text-[#00FFFF]/80 transition"
      >
        Browse marketplace →
      </Link>
    </div>
  );
}

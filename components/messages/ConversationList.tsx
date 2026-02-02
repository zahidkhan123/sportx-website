"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export type ChatItem = {
  _id: string;
  status?: string;
  contextType?: string;
  contextTitle?: string;
  lastMessage?: { content?: string; createdAt?: string };
  updatedAt?: string;
  unreadCount?: number;
  initiatorId?: { _id?: string; fullName?: string; name?: string; profileImage?: string };
  ownerId?: { _id?: string; fullName?: string; name?: string; profileImage?: string };
};

type ConversationListProps = {
  chats: ChatItem[];
  loading: boolean;
  typingChatId: string | null;
  myId: string | undefined;
  getOtherUser: (chat: ChatItem) => { fullName?: string; name?: string; profileImage?: string } | undefined;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh?: () => void;
};

export function ConversationList({
  chats,
  loading,
  typingChatId,
  myId,
  getOtherUser,
  searchQuery,
  onSearchChange,
}: ConversationListProps) {
  const pathname = usePathname();
  const selectedChatId = pathname.startsWith("/chats/") && pathname !== "/chats"
    ? pathname.replace("/chats/", "").split("/")[0]
    : null;

  const getLastPreview = (chat: ChatItem) => {
    if (String(typingChatId) === String(chat._id)) return "typing...";
    const last = chat.lastMessage;
    if (!last?.content) return "No messages yet";
    return last.content.length > 45 ? last.content.slice(0, 45) + "…" : last.content;
  };

  const filteredChats = searchQuery.trim()
    ? chats.filter((chat) => {
        const other = getOtherUser(chat);
        const name = (other?.fullName || other?.name || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query);
      })
    : chats;

  return (
    <div className="flex h-full flex-col bg-zinc-900/95 border-r border-white/10 min-w-0">
      {/* Header - compact like Upwork */}
      <div className="shrink-0 border-b border-white/10 px-4 py-3">
        <h2 className="text-base font-semibold text-white">Messages</h2>
        <div className="mt-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-1 focus:ring-[#00FFFF]/50 focus:border-[#00FFFF]/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 border-2 border-[#00FFFF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageCircle className="h-10 w-10 text-white/30 mb-3" />
            <p className="text-sm font-medium text-white/70">
              {searchQuery.trim() ? "No conversations match" : "No conversations yet"}
            </p>
            <p className="text-xs text-white/50 mt-1">
              {searchQuery.trim() ? "Try a different search" : "Start from a listing or marketplace ad"}
            </p>
          </div>
        ) : (
          <ul className="py-1">
            {filteredChats.map((chat) => {
              const other = getOtherUser(chat);
              const name = other?.fullName || other?.name || "User";
              const avatar =
                other?.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a5f&color=00ffff&size=96`;
              const isSelected = selectedChatId === chat._id;
              const isActive = chat.status === "active";
              const contextLabel = chat.contextType === "PRODUCT" ? "Product" : "Listing";

              return (
                <li key={chat._id}>
                  <Link
                    href={`/chats/${chat._id}`}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 border-l-2 border-transparent transition-colors",
                      isSelected
                        ? "bg-[#00FFFF]/10 border-[#00FFFF]"
                        : "hover:bg-white/5 border-transparent"
                    )}
                  >
                    <img
                      src={avatar}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover shrink-0 bg-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          "text-sm font-medium truncate",
                          (chat.unreadCount ?? 0) > 0 ? "text-white" : "text-white/90"
                        )}>
                          {name}
                        </span>
                        <span className="text-[11px] text-white/50 shrink-0">
                          {chat.lastMessage?.createdAt
                            ? formatTime(chat.lastMessage.createdAt)
                            : formatTime(chat.updatedAt || "")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00FFFF]/15 text-[#00FFFF]">
                          {contextLabel}
                        </span>
                        {!isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">
                            Closed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 truncate mt-0.5">
                        {getLastPreview(chat)}
                      </p>
                    </div>
                    {(chat.unreadCount ?? 0) > 0 && (
                      <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {(chat.unreadCount ?? 0) > 99 ? "99+" : chat.unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

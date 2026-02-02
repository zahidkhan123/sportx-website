"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { chatAPI } from "@/lib/api";
import { connectChatSocket } from "@/lib/chatSocket";
import { useChatUnread } from "@/contexts/ChatUnreadContext";
import { ConversationList, type ChatItem } from "@/components/messages/ConversationList";
import { ArrowLeft } from "lucide-react";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTotalUnread } = useChatUnread();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [typingChatId, setTypingChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadChats = useCallback(async () => {
    try {
      const res = await chatAPI.getChats();
      const list = res?.data?.chats ?? [];
      setChats(list);
      const total = list.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);
      setTotalUnread(total);
    } catch {
      setChats([]);
      setTotalUnread(0);
    } finally {
      setLoading(false);
    }
  }, [setTotalUnread]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) {
      router.replace("/login");
      return;
    }
    setUser(JSON.parse(userStr));
    loadChats();
  }, [router, loadChats]);

  useEffect(() => {
    if (pathname === "/chats" || pathname.startsWith("/chats/")) loadChats();
  }, [pathname, loadChats]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    connectChatSocket(token, {
      onNewMessage: (payload) => {
        loadChats();
        const { chatId: cid, message } = payload || {};
        const msg = message as any;
        if (!cid || !msg) return;
        const myId = (user?._id || user?.id)?.toString();
        const senderId = (msg.senderId?._id ?? msg.senderId)?.toString();
        if (senderId === myId) return;
        const showNotification =
          typeof document !== "undefined" &&
          (document.hidden || pathname !== `/chats/${cid}`);
        if (showNotification && "Notification" in window) {
          if (Notification.permission === "default") Notification.requestPermission();
          if (Notification.permission === "granted") {
            const senderName = msg.senderId?.fullName || msg.senderId?.name || "Someone";
            const body = (msg.content || "").slice(0, 80);
            new Notification(`Message from ${senderName}`, { body });
          }
        }
      },
      onTyping: (payload) => {
        if (payload?.chatId) setTypingChatId(payload.chatId);
      },
      onChatClosed: () => loadChats(),
    });
  }, [loadChats, pathname, user?._id, user?.id]);

  useEffect(() => {
    if (!typingChatId) return;
    const t = setTimeout(() => setTypingChatId(null), 3000);
    return () => clearTimeout(t);
  }, [typingChatId]);

  const getOtherUser = (chat: ChatItem) => {
    const initiator = chat.initiatorId;
    const owner = chat.ownerId;
    const myId = user?._id || user?.id;
    if (!myId) return owner || initiator;
    const initId = initiator?._id ?? initiator;
    return String(initId) === String(myId) ? owner : initiator;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  const selectedChatId = pathname.startsWith("/chats/") && pathname !== "/chats"
    ? pathname.replace("/chats/", "").split("/")[0]
    : null;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="flex flex-1 min-h-0 bg-black text-white size-full">
      {/* Left: Conversation list - Upwork style sidebar */}
      <aside
        className={[
          "w-full md:w-[360px] lg:w-[380px] shrink-0 flex flex-col border-r border-white/10",
          selectedChatId && "hidden md:flex",
        ].join(" ")}
      >
        <ConversationList
          chats={chats}
          loading={loading}
          typingChatId={typingChatId}
          myId={(user?._id || user?.id) as string}
          getOtherUser={getOtherUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={loadChats}
        />
      </aside>

      {/* Right: Active chat or empty state - full width/height so chat opens full screen on mobile */}
      <main
        key={selectedChatId ?? "list"}
        className={`flex-1 flex flex-col min-w-0 min-h-0 bg-zinc-950/50 w-full ${selectedChatId ? "min-h-[70vh] md:min-h-0" : ""}`}
      >
        {/* Mobile: back to list when viewing a chat */}
        {selectedChatId && (
          <div className="md:hidden shrink-0 border-b border-white/10 px-3 py-2 flex items-center gap-2 bg-zinc-900/80">
            <Link
              href="/chats"
              className="p-2 rounded-lg hover:bg-white/5 transition text-[#00FFFF]"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-sm text-white/70">Back to messages</span>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

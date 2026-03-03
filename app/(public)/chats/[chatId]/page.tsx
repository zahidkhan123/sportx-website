"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { chatAPI } from "@/lib/api";
import {
  connectChatSocket,
  joinChat,
  leaveChat,
  emitTyping,
} from "@/lib/chatSocket";
import { Send, Flag, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LIMIT = 50;

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [chatStatus, setChatStatus] = useState<string>("active");
  const [otherUserName, setOtherUserName] = useState("");
  const [otherUserImage, setOtherUserImage] = useState("");
  const [contextTitle, setContextTitle] = useState("");
  const [user, setUser] = useState<any>(null);
  const [chatLoadError, setChatLoadError] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const myId = user?._id || user?.id;

  const loadMessages = useCallback(
    async (before?: string) => {
      try {
        if (before) setLoadingMore(true);
        else setLoading(true);
        const params: { limit: number; before?: string } = { limit: LIMIT };
        if (before) params.before = before;
        const res = await chatAPI.getMessages(chatId, params);
        const list = res?.data?.messages ?? [];
        if (before) {
          setMessages((prev) => [...list, ...prev]);
          setLoadingMore(false);
        } else {
          setMessages(list);
          setLoading(false);
        }
        setHasMore(list.length === LIMIT);
      } catch {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [chatId]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    if (!chatId) return;
    setChatLoadError(false);
    let cancelled = false;
    (async () => {
      try {
        const res = await chatAPI.getChatById(chatId);
        const chat = res?.data?.chat;
        if (cancelled) return;
        if (!chat) {
          setChatLoadError(true);
          return;
        }
        setChatStatus(chat.status || "active");
        setContextTitle(chat.contextTitle || "Chat");
        const initiator = chat.initiatorId;
        const owner = chat.ownerId;
        const myIdStr = (user?._id || user?.id)?.toString();
        if (myIdStr) {
          const initId = (initiator?._id ?? initiator)?.toString();
          const other = initId === myIdStr ? owner : initiator;
          setOtherUserName(other?.fullName || other?.name || "User");
          setOtherUserImage(other?.profileImage || "");
        } else {
          const other = owner || initiator;
          setOtherUserName(other?.fullName || other?.name || "User");
          setOtherUserImage(other?.profileImage || "");
        }
      } catch {
        if (!cancelled) setChatLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chatId, user?._id, user?.id]);

  useEffect(() => {
    if (!chatId) return;
    loadMessages();
  }, [chatId, loadMessages]);

  useEffect(() => {
    if (!loading && messages.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading, messages.length]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    connectChatSocket(token, {
      onNewMessage: ({ chatId: cid, message }) => {
        if (cid?.toString() !== chatId) return;
        const msg = message as any;
        setMessages((prev) => {
          const id = msg?._id?.toString?.() ?? msg?._id;
          if (!id) return prev;
          const hasExisting = prev.some((m) => String(m?._id ?? m) === String(id));
          if (hasExisting) return prev;
          const fromMe = (msg.senderId?._id ?? msg.senderId)?.toString() === String(myId);
          if (fromMe) {
            const optIndex = prev.findIndex(
              (m) => (typeof m?._id === "string" && m._id.startsWith("temp-")) || (m as any)?.isOptimistic
            );
            if (optIndex !== -1) {
              return prev.map((m, i) => (i === optIndex ? { ...msg, _id: id } : m));
            }
          }
          return [...prev, msg];
        });
      },
      onTyping: ({ chatId: cid, userId: typingUserIdFromSocket }) => {
        if (String(cid) !== String(chatId)) return;
        if (String(typingUserIdFromSocket) === String(myId)) return;
        setTypingUserId(typingUserIdFromSocket);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(
          () => setTypingUserId(null),
          3000
        );
      },
      onChatClosed: ({ chatId: cid }) => {
        if (cid === chatId) setChatStatus("closed");
      },
    });
    joinChat(String(chatId));
    return () => {
      leaveChat(chatId);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [chatId, myId]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending || chatStatus === "closed") return;
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      content: text,
      senderId: {
        _id: myId,
        fullName: user?.fullName,
        profileImage: user?.profileImage,
      },
      senderRole: "INITIATOR",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    setSending(true);
    try {
      const res = await chatAPI.sendMessage(chatId, text);
      const serverMsg = res?.data?.message;
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId ? { ...serverMsg, _id: serverMsg._id } : m
        )
      );
    } catch (e: any) {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      toast.error(e?.response?.data?.message || "Could not send message");
    } finally {
      setSending(false);
    }
  };

  const loadOlder = () => {
    if (loadingMore || !hasMore || messages.length === 0) return;
    const before = messages[0]?.createdAt;
    if (before) loadMessages(before);
  };

  const onReport = () => {
    const reason = window.prompt(
      "Report reason: abuse, spam, off_platform_contact, inappropriate, other"
    );
    if (!reason) return;
    chatAPI
      .reportChat(chatId, reason)
      .then(() => toast.success("Report submitted"))
      .catch((e: any) =>
        toast.error(e?.response?.data?.message || "Report failed")
      );
  };

  const isClosed = chatStatus === "closed";

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  if (chatLoadError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-white/80 mb-4">Couldn&apos;t load this conversation.</p>
        <Link
          href="/chats"
          className="text-sm font-medium text-[#00FFFF] hover:text-[#00FFFF]/80 transition"
        >
          ← Back to messages
        </Link>
      </div>
    );
  }

  const avatarUrl =
    otherUserImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUserName)}&background=1e3a5f&color=00ffff&size=96`;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Compact header - Upwork style */}
      <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-zinc-900/80">
        <img
          src={avatarUrl}
          alt=""
          className="w-10 h-10 rounded-full object-cover bg-white/10 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-white truncate">
            {otherUserName || "Chat"}
          </h1>
          <p className="text-xs text-white/50 truncate">
            {contextTitle}
            {isClosed ? " · Closed" : ""}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-white/70 hover:text-white hover:bg-white/5 h-9 w-9"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10">
            <DropdownMenuItem
              onClick={onReport}
              className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
            >
              <Flag className="h-4 w-4 mr-2" />
              Report conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Messages area */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="h-8 w-8 border-2 border-[#00FFFF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto min-h-0 px-4 py-4 flex flex-col gap-4"
          >
            {hasMore && messages.length > 0 && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={loadOlder}
                  disabled={loadingMore}
                  className="text-xs text-[#00FFFF] hover:underline disabled:opacity-50 py-1"
                >
                  {loadingMore ? "Loading..." : "Load older messages"}
                </button>
              </div>
            )}
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-white/50 text-sm py-12">
                No messages yet. Say hi!
              </div>
            )}
            {messages.map((msg, i) => {
              const isMe =
                (msg.senderId?._id ?? msg.senderId)?.toString() === String(myId);
              return (
                <div
                  key={msg._id ?? `msg-${i}-${msg.createdAt ?? ""}`}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isMe
                        ? "bg-[#00FFFF] text-black rounded-br-md"
                        : "bg-white/10 text-white rounded-bl-md"
                    }`}
                  >
                    <p className="text-[15px] leading-snug">{msg.content}</p>
                    <p
                      className={`text-[11px] mt-1 ${
                        isMe ? "text-black/50" : "text-white/50"
                      }`}
                    >
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })}
            {typingUserId && (
              <p className="text-xs text-white/50 italic">typing...</p>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input - Upwork style bar */}
          {!isClosed && (
            <div className="shrink-0 px-4 py-3 border-t border-white/10 bg-zinc-900/80">
              <div className="flex gap-2 items-end">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    emitTyping(chatId);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 min-h-[44px] max-h-28 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FFFF]/30 focus:border-[#00FFFF]/50"
                  maxLength={5000}
                  disabled={sending}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="shrink-0 h-11 w-11 rounded-xl bg-[#00FFFF] text-black flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition"
                >
                  {sending ? (
                    <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}
          {isClosed && (
            <div className="shrink-0 px-4 py-3 bg-red-500/10 border-t border-red-500/20 text-red-400 text-center text-sm">
              This conversation is closed
            </div>
          )}
        </>
      )}
    </div>
  );
}

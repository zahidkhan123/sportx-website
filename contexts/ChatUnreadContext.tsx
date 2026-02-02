'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { chatAPI } from '@/lib/api';
import { connectChatSocket } from '@/lib/chatSocket';
import { toast } from 'sonner';

type ChatUnreadContextValue = {
  totalUnread: number;
  setTotalUnread: (n: number) => void;
  refreshUnread: () => Promise<void>;
};

const ChatUnreadContext = createContext<ChatUnreadContextValue | null>(null);

export function useChatUnread() {
  const ctx = useContext(ChatUnreadContext);
  if (!ctx) {
    return {
      totalUnread: 0,
      setTotalUnread: () => {},
      refreshUnread: async () => {},
    };
  }
  return ctx;
}

export function ChatUnreadProvider({ children }: { children: React.ReactNode }) {
  const [totalUnread, setTotalUnreadState] = useState(0);
  const setTotalUnread = useCallback((n: number) => setTotalUnreadState(n), []);

  const refreshUnread = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await chatAPI.getChats();
      const list = res?.data?.chats ?? [];
      const total = list.reduce((sum: number, c: { unreadCount?: number }) => sum + (c.unreadCount ?? 0), 0);
      setTotalUnreadState(total);
    } catch {
      setTotalUnreadState(0);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return;

    const user = JSON.parse(userStr) as { _id?: string; id?: string };
    const myId = (user?._id || user?.id)?.toString();

    connectChatSocket(token, {
      onNewMessage: (payload) => {
        const { chatId: cid, message } = payload || {};
        const msg = message as { senderId?: { _id?: string; fullName?: string; name?: string }; content?: string } | undefined;
        if (!cid || !msg) return;

        refreshUnread();

        const senderId = (msg.senderId?._id ?? (msg.senderId as unknown as string))?.toString();
        if (senderId === myId) return;

        const senderName = msg.senderId?.fullName ?? (msg.senderId as { name?: string })?.name ?? 'Someone';
        const body = (msg.content || '').slice(0, 80) + (msg.content && msg.content.length > 80 ? '…' : '');
        toast.info(`Message from ${senderName}`, { description: body });

        if (typeof document !== 'undefined' && document.hidden && 'Notification' in window) {
          if (Notification.permission === 'default') Notification.requestPermission();
          if (Notification.permission === 'granted') {
            new Notification(`Message from ${senderName}`, { body });
          }
        }
      },
      onChatClosed: () => refreshUnread(),
    });

    refreshUnread();
  }, [refreshUnread]);

  const value: ChatUnreadContextValue = {
    totalUnread,
    setTotalUnread,
    refreshUnread,
  };

  return (
    <ChatUnreadContext.Provider value={value}>
      {children}
    </ChatUnreadContext.Provider>
  );
}

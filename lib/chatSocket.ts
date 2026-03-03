import { io, Socket } from "socket.io-client";
import api from "./api";

function getSocketUrl(): string {
  const base = api.defaults.baseURL || "";
  return base.replace(/\/api\/?$/, "") || base;
}

let socket: Socket | null = null;

export type ChatSocketCallbacks = {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onNewMessage?: (payload: { chatId: string; message: object }) => void;
  onTyping?: (payload: { userId: string; chatId: string }) => void;
  onChatClosed?: (payload: { chatId: string }) => void;
  onChatOpened?: (payload: { chatId: string }) => void;
};

export function connectChatSocket(
  token: string,
  callbacks: ChatSocketCallbacks = {}
): Socket | null {
  if (!token) return null;

  const registerListeners = () => {
    if (!socket) return;
    const onNewMessage = (payload: { chatId: string; message: object }) =>
      callbacks.onNewMessage?.(payload);
    const onTyping = (payload: { userId: string; chatId: string }) =>
      callbacks.onTyping?.(payload);
    const onChatClosed = (payload: { chatId: string }) =>
      callbacks.onChatClosed?.(payload);
    const onChatOpened = (payload: { chatId: string }) =>
      callbacks.onChatOpened?.(payload);
    socket.on("new_message", onNewMessage);
    socket.on("typing", onTyping);
    socket.on("chat_closed", onChatClosed);
    socket.on("chat_opened", onChatOpened);
    return () => {
      socket?.off("new_message", onNewMessage);
      socket?.off("typing", onTyping);
      socket?.off("chat_closed", onChatClosed);
      socket?.off("chat_opened", onChatOpened);
    };
  };

  if (socket?.connected) {
    callbacks.onConnect?.();
    registerListeners();
    return socket;
  }

  const url = getSocketUrl();
  socket = io(url, {
    path: "/socket.io",
    auth: { token },
    transports: ["websocket", "polling"],
  });
  socket.on("connect", () => {
    callbacks.onConnect?.();
    registerListeners();
  });
  socket.on("disconnect", (reason) => callbacks.onDisconnect?.(reason));
  return socket;
}

export function disconnectChatSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getChatSocket(): Socket | null {
  return socket;
}

export function joinChat(chatId: string): void {
  if (socket?.connected && chatId) socket.emit("join_chat", chatId);
}

export function leaveChat(chatId: string): void {
  if (socket?.connected && chatId) socket.emit("leave_chat", chatId);
}

export function emitTyping(chatId: string): void {
  if (socket?.connected && chatId) socket.emit("typing", { chatId });
}

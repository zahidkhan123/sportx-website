import type { Metadata } from "next";
import ChatsShellClient from "@/components/messages/ChatsShellClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatsShellClient>{children}</ChatsShellClient>;
}

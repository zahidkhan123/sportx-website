import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SportX360 — Find Players, Teams & Grounds in Pakistan",
  description:
    "Your sports marketplace: find cricket players in Pakistan, join a team near you, book grounds, enter tournaments, and buy sports equipment — SportX360.",
  alternates: { canonical: "/home" },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

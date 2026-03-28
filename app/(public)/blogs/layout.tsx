import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SportX360 Blog | Sports Tips & News Pakistan",
  description:
    "Read the SportX360 blog for sports tips, tournament news, and updates for players and teams in Pakistan.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

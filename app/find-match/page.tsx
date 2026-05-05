import type { Metadata } from "next";
import { FindMatchLanding } from "./FindMatchLanding";

export const metadata: Metadata = {
  title: "Find Match",
  description:
    "Download SportX360 to find a match, join players, and play now.",
  robots: { index: true, follow: true },
};

export default function FindMatchPage() {
  return <FindMatchLanding />;
}

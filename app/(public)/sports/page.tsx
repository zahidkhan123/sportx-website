import type { Metadata } from "next";
import { ListingBrowseClient } from "@/components/listings/ListingBrowseClient";

export const metadata: Metadata = {
  title: "Sports Listings Pakistan | Teams, Tournaments, Grounds | SportX360",
  description:
    "Browse sports listings in Pakistan and worldwide — find cricket players, join a team near you, book a ground, and discover tournaments. Free to browse on SportX360.",
};

export default function SportsPage() {
  return (
    <ListingBrowseClient
      variant="all"
      pageTitle="Sports Listings"
      pageSubtitle="Find teams, tournaments, players, grounds, umpires, and scorers — filter by sport and your city."
    />
  );
}

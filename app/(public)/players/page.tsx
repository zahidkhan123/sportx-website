import type { Metadata } from "next";
import { ListingBrowseClient } from "@/components/listings/ListingBrowseClient";

export const metadata: Metadata = {
  title: "Find Cricket Players in Pakistan | SportX360",
  description:
    "Discover and connect with cricket and sports players across Pakistan. Find teammates, trialists, and talent for your club — browse verified SportX360 player listings.",
};

export default function PlayersPage() {
  return (
    <ListingBrowseClient
      variant="player"
      pageTitle="Find players"
      pageSubtitle="Find cricket players in Pakistan and globally — connect for club trials, friendly matches, and league squads."
    />
  );
}

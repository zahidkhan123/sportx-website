import type { Metadata } from "next";
import { ListingBrowseClient } from "@/components/listings/ListingBrowseClient";

export const metadata: Metadata = {
  title: "Sports Tournaments Pakistan | Cricket & Football Events | SportX360",
  description:
    "Discover sports tournaments in Pakistan — cricket leagues, weekend cups, and football events. Register your team or promote your event on SportX360.",
};

export default function TournamentsPage() {
  return (
    <ListingBrowseClient
      variant="tournament"
      pageTitle="Tournaments & events"
      pageSubtitle="Find upcoming tournaments, hire umpires and scorers, and register your squad for events across Pakistan."
    />
  );
}

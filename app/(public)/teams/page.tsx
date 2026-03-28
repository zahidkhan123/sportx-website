import type { Metadata } from "next";
import { ListingBrowseClient } from "@/components/listings/ListingBrowseClient";

export const metadata: Metadata = {
  title: "Join a Cricket Team Near You | Sports Teams Pakistan | SportX360",
  description:
    "Join a cricket or football team near you in Lahore, Karachi, Islamabad, and across Pakistan. Browse teams looking for players on SportX360.",
};

export default function TeamsPage() {
  return (
    <ListingBrowseClient
      variant="team"
      pageTitle="Find teams"
      pageSubtitle="Join a team near you — clubs recruiting players, looking for opponents, and building squads for tournaments."
    />
  );
}

import type { Metadata } from "next";
import { ListingBrowseClient } from "@/components/listings/ListingBrowseClient";

export const metadata: Metadata = {
  title: "Book Cricket Ground Lahore & Pakistan | Sports Venues | SportX360",
  description:
    "Book a cricket ground in Lahore, Karachi, Islamabad, and across Pakistan. Compare venues, slots, and pricing from ground owners on SportX360.",
};

export default function GroundsPage() {
  return (
    <ListingBrowseClient
      variant="ground"
      pageTitle="Book grounds & venues"
      pageSubtitle="Book cricket and sports grounds — hourly and daily slots, tournaments, and practice nets across Pakistan."
    />
  );
}

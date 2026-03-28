import type { Metadata } from "next";
import Link from "next/link";
import { EquipmentBrowseClient } from "@/components/marketplace/EquipmentBrowseClient";

export const metadata: Metadata = {
  title: "Buy Sports Equipment Pakistan | Cricket & Football Gear | SportX360",
  description:
    "Buy sports equipment in Pakistan — cricket bats, kits, balls, shoes, and training gear. New and used listings from sellers nationwide on SportX360.",
};

export default function EquipmentPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-3">
          Sports equipment in Pakistan
        </h1>
        <p className="text-lg text-white/70">
          Buy cricket bats, kits, balls, football boots, and training gear from trusted
          sellers. Every ad links to our secure{" "}
          <Link href="/marketplace" className="text-[#00FFFF] underline">
            marketplace
          </Link>{" "}
          where you can chat with sellers on SportX360.
        </p>
      </header>
      <section aria-labelledby="equipment-listings">
        <h2 id="equipment-listings" className="sr-only">
          Recent equipment listings
        </h2>
        <EquipmentBrowseClient />
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingBrowseClient } from "@/components/listings/ListingBrowseClient";
import {
  DISCOVER_SEO_SLUGS,
  parseDiscoverSlug,
  type DiscoverSegment,
} from "@/lib/seo-location";
import { formatSportLabel, getSiteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DISCOVER_SEO_SLUGS.map((slug) => ({ slug }));
}

function titleCaseSport(api: string): string {
  return formatSportLabel(api.replace(/_/g, " "));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = parseDiscoverSlug(slug);
  if (!p) {
    return { title: "Discover | SportX360" };
  }
  const sportLabel = titleCaseSport(p.sportApi);
  const typeLabel =
    p.listingType === "player"
      ? "players"
      : p.listingType === "team"
        ? "teams"
        : p.listingType === "ground"
          ? "grounds"
          : "tournaments";
  const site = getSiteUrl();
  const url = `${site}/discover/${slug}`;
  return {
    title: `${sportLabel} ${typeLabel} in ${p.cityDisplay} | SportX360`,
    description: `Find ${sportLabel.toLowerCase()} ${typeLabel} in ${p.cityDisplay}, Pakistan on SportX360 — connect with players, book venues, and join events.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${sportLabel} ${typeLabel} in ${p.cityDisplay}`,
      description: `Browse ${sportLabel} ${typeLabel} listings in ${p.cityDisplay}.`,
      url,
      siteName: "SportX360",
      locale: "en_PK",
    },
  };
}

function DiscoverIntro({ p }: { p: DiscoverSegment }) {
  const sport = titleCaseSport(p.sportApi);
  const kind =
    p.listingType === "player"
      ? "players"
      : p.listingType === "team"
        ? "teams"
        : p.listingType === "ground"
          ? "grounds"
          : "tournaments";

  return (
    <section className="container mx-auto px-4 pt-10 pb-4 max-w-4xl">
      <nav className="text-sm text-white/50 mb-4">
        <Link href="/home" className="hover:text-[#00FFFF]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/sports" className="hover:text-[#00FFFF]">
          Listings
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white/70">Discover</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        {sport} {kind} in {p.cityDisplay}
      </h1>
      <div className="space-y-4 text-white/75 leading-relaxed">
        <p>
          Browse active {sport.toLowerCase()} {kind} listings in{" "}
          <strong className="text-white">{p.cityDisplay}</strong>, Pakistan. SportX360
          helps you find cricket players, join a team near you, book a ground, and
          enter sports tournaments — with listings updated by real players and
          organizers.
        </p>
        <p>
          Looking for more cities or sports? Explore{" "}
          <Link href="/players" className="text-[#00FFFF] underline">
            all players
          </Link>
          ,{" "}
          <Link href="/teams" className="text-[#00FFFF] underline">
            teams
          </Link>
          ,{" "}
          <Link href="/grounds" className="text-[#00FFFF] underline">
            grounds
          </Link>
          , and{" "}
          <Link href="/tournaments" className="text-[#00FFFF] underline">
            tournaments
          </Link>{" "}
          across Pakistan, or open the full{" "}
          <Link href="/sports" className="text-[#00FFFF] underline">
            sports marketplace
          </Link>
          .
        </p>
        <h2 className="text-xl font-semibold text-white pt-2">
          Why use SportX360 in {p.cityDisplay}?
        </h2>
        <p>
          Whether you need to hire an umpire or scorer, book a cricket ground in
          Lahore-style metro areas, or buy sports equipment in Pakistan, SportX360
          connects listing owners with athletes and fans in one place.
        </p>
      </div>
    </section>
  );
}

export default async function DiscoverCityPage({ params }: Props) {
  const { slug } = await params;
  const p = parseDiscoverSlug(slug);
  if (!p) notFound();

  return (
    <div className="min-h-screen">
      <DiscoverIntro p={p} />
      <ListingBrowseClient
        variant={p.listingType}
        forced={{
          sport: p.sportApi,
          city: p.cityDisplay,
          listingType: p.listingType,
        }}
        pageTitle={`${titleCaseSport(p.sportApi)} ${p.listingType === "player" ? "players" : p.listingType === "team" ? "teams" : p.listingType === "ground" ? "grounds" : "tournaments"} — ${p.cityDisplay}`}
        pageSubtitle={`Live listings filtered for ${p.cityDisplay}. Change city from the main listings page anytime.`}
      />
    </div>
  );
}

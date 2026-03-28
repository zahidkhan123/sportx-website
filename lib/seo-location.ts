/**
 * Predefined location SEO slugs: /discover/[slug] for city + sport + listing-type landing pages.
 */

export type DiscoverSegment = {
  sportApi: string;
  listingType: "player" | "team" | "ground" | "tournament";
  cityDisplay: string;
  slug: string;
};

const MODULE_TO_TYPE: Record<string, DiscoverSegment["listingType"]> = {
  players: "player",
  teams: "team",
  grounds: "ground",
  tournaments: "tournament",
};

/** Map URL segment (hyphenated) to API sportType */
export function sportSlugToApi(slug: string): string {
  return slug.replace(/-/g, "_");
}

/**
 * Parse discover slug: "{sport}-{players|teams|grounds|tournaments}-{city}"
 * e.g. cricket-players-lahore, football-teams-islamabad
 */
export function parseDiscoverSlug(slug: string): DiscoverSegment | null {
  const keys = Object.keys(MODULE_TO_TYPE).join("|");
  const re = new RegExp(`^(.+)-(${keys})-(.+)$`);
  const m = slug.match(re);
  if (!m) return null;
  const sportSlug = m[1];
  const moduleKey = m[2] as keyof typeof MODULE_TO_TYPE;
  const citySlug = m[3];
  const listingType = MODULE_TO_TYPE[moduleKey];
  if (!listingType) return null;

  const cityDisplay = citySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return {
    sportApi: sportSlugToApi(sportSlug),
    listingType,
    cityDisplay,
    slug,
  };
}

/** Static params for SSG / warm cache — high-value Pakistan + global sports combos */
export const DISCOVER_SEO_SLUGS: string[] = [
  "cricket-players-lahore",
  "cricket-players-karachi",
  "cricket-players-islamabad",
  "cricket-players-rawalpindi",
  "cricket-players-faisalabad",
  "cricket-players-multan",
  "cricket-teams-lahore",
  "cricket-teams-karachi",
  "cricket-teams-islamabad",
  "cricket-grounds-lahore",
  "cricket-grounds-karachi",
  "cricket-grounds-islamabad",
  "cricket-tournaments-lahore",
  "cricket-tournaments-karachi",
  "football-players-lahore",
  "football-players-karachi",
  "football-teams-lahore",
  "football-teams-karachi",
  "football-teams-islamabad",
  "football-grounds-lahore",
  "hockey-players-lahore",
  "badminton-players-islamabad",
  "table-tennis-players-lahore",
];

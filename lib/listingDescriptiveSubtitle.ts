/**
 * Human-readable listing subtitles (e.g. "Zahid khan is looking for players to join his team").
 * Matches SportsHub utils/listingDescriptiveSubtitle.js for consistency with the mobile app.
 */

function getLocationString(listing: Record<string, unknown>): string {
  const location = (listing.location as Record<string, unknown>) || {};
  const data = (listing.data as Record<string, unknown>) || {};
  if (location.address) return String(location.address);
  if (data.location) return String(data.location);
  if (data.address) return String(data.address);
  if (data.area && data.city) return `${data.area}, ${data.city}`;
  if (data.city) return String(data.city);
  if (location.city) return String(location.city);
  if (data.region) return String(data.region);
  if (listing.region) return String(listing.region);
  return "";
}

function formatDateForDisplay(dateString: unknown): string {
  if (!dateString) return "";
  const date = new Date(String(dateString));
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year} (${dayName})`;
}

/**
 * Returns a human-readable descriptive subtitle for a listing
 * (e.g. "Zahid khan is looking for players to join his team (Team Name)").
 */
export function generateDescriptiveSubtitle(
  listing: Record<string, unknown>
): string {
  const user = (listing.userId as Record<string, unknown>) || {};
  const userName =
    (user.name as string) || (user.fullName as string) || "Someone";
  const data = (listing.data as Record<string, unknown>) || {};
  const listingType = listing.listingType as string | undefined;
  const location = getLocationString(listing);

  switch (listingType) {
    case "player": {
      const playerName =
        (data.playerName as string) ||
        (data.name as string) ||
        userName;
      let position =
        (data.position as string) ||
        (data.preferredPosition as string) ||
        (data.role as string) ||
        "Player";
      const bowlingStyle =
        (data.bowlingStyle as string) || (data.bowlingType as string) || "";
      const battingStyle =
        (data.battingStyle as string) || (data.battingType as string) || "";
      if (
        bowlingStyle &&
        (position.includes("Bowler") || position === "Bowler")
      ) {
        position = `${position} (${bowlingStyle})`;
      } else if (
        battingStyle &&
        (position.includes("Batsman") || position === "Batsman")
      ) {
        position = `${position} (${battingStyle})`;
      } else if (
        bowlingStyle &&
        (position === "All-rounder" || position.includes("All-rounder"))
      ) {
        position = `All-rounder (${bowlingStyle})`;
      }
      const lookingForTeam =
        data.lookingForTeam !== undefined
          ? Boolean(data.lookingForTeam)
          : data.available !== undefined
            ? !data.available
            : true;
      if (lookingForTeam) {
        return `${playerName} is looking for a Team to join as a ${position}${location ? ` in ${location}` : ""}`;
      }
      return `${playerName} is available as a ${position}${location ? ` in ${location}` : ""}`;
    }
    case "team": {
      const teamName =
        (data.teamName as string) || (data.name as string) || "their team";
      const lookingForOpponent = Boolean(data.lookingForOpponent);
      const lookingForPlayers =
        data.lookingForPlayers !== undefined
          ? Boolean(data.lookingForPlayers)
          : true;
      let position =
        (data.lookingForPosition as string) ||
        (data.position as string) ||
        (data.lookingFor as string) ||
        "players";
      if (lookingForOpponent) {
        const matchDate =
          data.matchDate || data.date
            ? formatDateForDisplay(data.matchDate ?? data.date)
            : "";
        return `${userName} is looking for an opponent to play a match with ${teamName}${location ? ` in ${location}` : ""}${matchDate ? ` on ${matchDate}` : ""}`;
      }
      if (lookingForPlayers && position && position !== "players") {
        const bowlingStyle = (data.bowlingStyle as string) || "";
        const battingStyle = (data.battingStyle as string) || "";
        if (
          bowlingStyle &&
          (position.includes("Bowler") || position === "Bowler")
        ) {
          position = `${position} (${bowlingStyle})`;
        } else if (
          battingStyle &&
          (position.includes("Batsman") || position === "Batsman")
        ) {
          position = `${position} (${battingStyle})`;
        } else if (bowlingStyle && position === "All-rounder") {
          position = `All-rounder (${bowlingStyle})`;
        }
        return `${userName} is looking for a ${position} to join ${teamName}${location ? ` in ${location}` : ""}`;
      }
      if (lookingForPlayers) {
        return `${userName} is looking for players to join his team (${teamName})${location ? ` in ${location}` : ""}`;
      }
      return `${userName} is managing ${teamName}${location ? ` in ${location}` : ""}`;
    }
    case "tournament": {
      const tournamentName =
        (data.tournamentName as string) ||
        (data.name as string) ||
        "Tournament";
      const startDate =
        data.startDate || data.date
          ? formatDateForDisplay(data.startDate ?? data.date)
          : "";
      const playingDays =
        (data.playingDays as string) ||
        (data.availableDays as string) ||
        (data.playingOn as string) ||
        "";
      if (data.lookingForUmpire) {
        return `${userName} is looking for an Umpire${location ? ` on ${location}` : ""} for Tournament${startDate ? ` on ${startDate}` : ""}`;
      }
      if (data.lookingForScorer) {
        return `${userName} is looking for a Scorer${location ? ` on ${location}` : ""} for Tournament${startDate ? ` on ${startDate}` : ""}`;
      }
      if (data.lookingForTeam) {
        return `${userName} is an Organizer and is looking for a Team for their Tournament${location ? ` in ${location}` : ""}${startDate ? `. The tournament begins on ${startDate}${playingDays ? ` it will be played on ${playingDays}` : ""}` : ""}`;
      }
      return `${userName} is organizing ${tournamentName}${location ? ` in ${location} and looking for teams to join` : ""}${startDate ? ` starting ${startDate}` : ""}`;
    }
    case "ground": {
      const groundName =
        (data.groundName as string) || (data.name as string) || "a ground";
      const lookingForBooking =
        data.lookingForBooking !== undefined
          ? Boolean(data.lookingForBooking)
          : true;
      const bookingDate = data.bookingDate
        ? formatDateForDisplay(data.bookingDate)
        : "";
      if (lookingForBooking) {
        return `${userName} is looking for ${groundName} to play${location ? ` in ${location}` : ""}${bookingDate ? ` on ${bookingDate}` : ""}`;
      }
      return `${groundName} is available${location ? ` in ${location}` : ""}`;
    }
    case "coach": {
      const coachName =
        (data.coachName as string) || (data.name as string) || userName;
      const coachingType =
        (data.coachingType as string) ||
        (data.serviceType as string) ||
        "Coaching";
      const availableDays =
        (data.availableDays as string) ||
        (data.playingDays as string) ||
        "";
      const experience = data.experience
        ? ` with ${data.experience} years experience`
        : "";
      const coachingTypeStr = Array.isArray(coachingType)
        ? coachingType.join(", ")
        : String(coachingType);
      return `${coachName} is offering ${coachingTypeStr}${location ? ` in ${location}` : ""}${experience}${availableDays ? ` (${availableDays})` : ""}`;
    }
    case "umpire":
    case "referee": {
      const lookingForWork =
        data.lookingForWork !== undefined ? Boolean(data.lookingForWork) : true;
      const experience = data.experience
        ? `${data.experience} years experience`
        : "";
      if (lookingForWork) {
        return `${userName} is looking for ${listingType} opportunities${location ? ` in ${location}` : ""}${experience ? ` (${experience})` : ""}`;
      }
      return `${userName} is an experienced ${listingType}${location ? ` in ${location}` : ""}${experience ? ` (${experience})` : ""}`;
    }
    case "scorer": {
      const lookingForWork =
        data.lookingForWork !== undefined ? Boolean(data.lookingForWork) : true;
      const experience = data.experience
        ? `${data.experience} years experience`
        : "";
      if (lookingForWork) {
        return `${userName} is looking for Scorer opportunities${location ? ` in ${location}` : ""}${experience ? ` (${experience})` : ""}`;
      }
      return `${userName} is an experienced Scorer${location ? ` in ${location}` : ""}${experience ? ` (${experience})` : ""}`;
    }
    case "commentator": {
      const lookingForWork =
        data.lookingForWork !== undefined ? Boolean(data.lookingForWork) : true;
      const experience = data.experience
        ? `${data.experience} years experience`
        : "";
      if (lookingForWork) {
        return `${userName} is looking for Commentator opportunities${location ? ` in ${location}` : ""}${experience ? ` (${experience})` : ""}`;
      }
      return `${userName} is an experienced Commentator${location ? ` in ${location}` : ""}${experience ? ` (${experience})` : ""}`;
    }
    default: {
      const listingTypeLabel =
        typeof listingType === "string"
          ? listingType.charAt(0).toUpperCase() + listingType.slice(1)
          : "Listing";
      return `${listingTypeLabel}${location ? ` · 📍 ${location}` : ""}`;
    }
  }
}

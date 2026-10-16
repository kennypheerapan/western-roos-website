export type MatchStatus = "scheduled" | "live" | "final" | "postponed" | "cancelled";
export type Tournament = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  venueIds: string[];
  /** Confirmed entries are not themselves a division. */
  participatingTeamIds?: string[];
  status: "upcoming" | "active" | "completed";
};
export type Division = { id: string; tournamentId: string; name: string; teamIds: string[] };
export type Team = {
  id: string;
  name: string;
  shortName?: string;
  /** Registry key for a family club, or an external club identifier. */
  club: string;
  logo?: string;
  accentColour?: string;
  secondaryColour?: string;
  /** Optional profile fields extend the BUILD 03 registry. Missing values stay hidden. */
  slug?: string | null;
  season?: string | null;
  status?: "pending" | "confirmed" | "archived";
  heroImage?: import("@/types").Media | null;
  teamPhoto?: import("@/types").Media | null;
  description?: string | null;
  coach?: string | null;
  manager?: string | null;
  trainingInformation?: string | null;
  homeVenue?: Venue["id"] | null;
  playerPathway?: string[];
  /** References to existing registries; never duplicate fixtures, scores or events. */
  competition?: Tournament["id"][];
  division?: Division["id"][];
  fixtureIds?: Fixture["id"][];
  resultFixtureIds?: MatchResult["fixtureId"][];
  eventIds?: string[];
};
export type Venue = { id: string; name: string; location?: string };
export type Fixture = {
  id: string;
  tournamentId: string;
  divisionId: string;
  homeTeamId: string;
  awayTeamId: string;
  date?: string;
  time?: string;
  /** ISO timestamp with an explicit UTC offset, used for chronological selection. */
  startsAt?: string;
  timeZoneLabel?: string;
  venueId?: string;
  diamond?: string;
  status: MatchStatus;
  summary?: string;
  notes?: string;
};
export type MatchResult = { fixtureId: string; homeScore: number; awayScore: number; status: "live" | "final" };
export type CompetitionData = {
  tournaments: Tournament[];
  divisions: Division[];
  teams: Team[];
  venues: Venue[];
  fixtures: Fixture[];
  results: MatchResult[];
};
export type Match = Fixture & { home: Team; away: Team; tournament: Tournament; division: Division; venue?: Venue; result?: MatchResult };

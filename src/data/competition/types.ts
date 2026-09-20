export type MatchStatus = "scheduled" | "live" | "final" | "postponed" | "cancelled";
export type Tournament = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  venueIds: string[];
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

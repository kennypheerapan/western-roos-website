import { brands } from "@/config/brands";
import type { CompetitionData, Match, Team } from "./types";

// Confirmed competition records only. Club identities do not imply registered teams.
export const competitionData: CompetitionData = {
  tournaments: [], divisions: [], teams: [], venues: [], fixtures: [], results: [],
};

export function teamIdentity(team: Team) {
  const brand = brands[team.club];
  return { ...team, logo: team.logo ?? brand?.logo, accentColour: team.accentColour ?? brand?.accent,
    secondaryColour: team.secondaryColour ?? brand?.secondary };
}

export function getMatches(data: CompetitionData = competitionData): Match[] {
  return data.fixtures.flatMap(fixture => {
    const home = data.teams.find(t => t.id === fixture.homeTeamId);
    const away = data.teams.find(t => t.id === fixture.awayTeamId);
    const tournament = data.tournaments.find(t => t.id === fixture.tournamentId);
    const division = data.divisions.find(d => d.id === fixture.divisionId && d.tournamentId === fixture.tournamentId);
    if (!home || !away || !tournament || !division) return [];
    return [{ ...fixture, home, away, tournament, division,
      venue: data.venues.find(v => v.id === fixture.venueId),
      result: data.results.find(r => r.fixtureId === fixture.id && r.status === fixture.status) }];
  });
}
export function involvesClub(match: Match, club?: string) {
  return [match.home.club, match.away.club].some(id => club ? id === club : Object.hasOwn(brands, id));
}
export function matchTime(match: Match) {
  return Date.parse(match.startsAt ?? (match.date ? `${match.date}T00:00:00Z` : "")) || 0;
}
export function filterMatches(matches: Match[], filters: { tournament?: string; division?: string; team?: string; status?: string }) {
  const { tournament, division, team, status } = filters;
  return matches.filter(m => (!tournament || m.tournamentId === tournament) && (!division || m.divisionId === division) &&
    (!team || (team.startsWith("club:") ? [m.home.club, m.away.club].includes(team.slice(5)) : [m.home.id, m.away.id].includes(team.slice(5)))) && (!status || m.status === status));
}
export function nextMatch(matches: Match[], now: number, club?: string) {
  return matches.filter(m => m.status === "scheduled" && !!m.startsAt && matchTime(m) > now && involvesClub(m, club))
    .sort((a, b) => matchTime(a) - matchTime(b))[0];
}
export function completedMatches(matches: Match[], club?: string) {
  return matches.filter(m => m.status === "final" && m.result?.status === "final" && involvesClub(m, club))
    .sort((a, b) => matchTime(b) - matchTime(a));
}
export function clubTournaments(club: string, data = competitionData) {
  const teamIds = new Set(data.teams.filter(t => t.club === club).map(t => t.id));
  const ids = new Set(data.divisions.filter(d => d.teamIds.some(id => teamIds.has(id))).map(d => d.tournamentId));
  data.tournaments.filter(t=>t.participatingTeamIds?.some(id=>teamIds.has(id))).forEach(t=>ids.add(t.id));
  data.fixtures.filter(f => teamIds.has(f.homeTeamId) || teamIds.has(f.awayTeamId)).forEach(f => ids.add(f.tournamentId));
  return data.tournaments.filter(t => t.status === "upcoming" && ids.has(t.id));
}

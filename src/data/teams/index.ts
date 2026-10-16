import { competitionData, getMatches, nextMatch, completedMatches } from "@/data/competition";
import type { CompetitionData, Team } from "@/data/competition/types";
import { events, type ClubEvent } from "@/data/events";

export type ClubTeam = Team & { slug: string; club: "united" | "west-coast-marlins"; status: "confirmed" | "archived" };
export function hasTeamProfile(team: Team): team is ClubTeam {
  return !!team.slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(team.slug) && team.slug !== "details-pending" &&
    ["united", "west-coast-marlins"].includes(team.club) && ["confirmed", "archived"].includes(team.status ?? "");
}
export function getTeams(data: CompetitionData = competitionData) { return data.teams.filter(hasTeamProfile); }
export function getTeam(slug: string) { return getTeams().find(team => team.slug === slug); }
export const playerPathways = [
  { id: "new", title: "New to the game", club: "united", copy: "Find your starting point with United." },
  { id: "returning", title: "Returning to play", club: "united", copy: "Reconnect with softball through United." },
  { id: "social", title: "Social softball", club: "united", copy: "Explore United’s social playing pathway." },
  { id: "competitive", title: "Competitive softball", club: "united", copy: "Explore the competitive pathway at United." },
  { id: "masters", title: "Masters softball", club: "west-coast-marlins", copy: "Meet Marlins Masters and explore your next chapter." },
] as const;

export function teamContext(team: Team, now: number, data: CompetitionData = competitionData, eventData: ClubEvent[] = events) {
  // Membership in the fixture is authoritative; a stale reference cannot expose another team's match.
  const matches = getMatches(data).filter(m => [m.homeTeamId, m.awayTeamId].includes(team.id));
  const divisions = data.divisions.filter(d => d.teamIds.includes(team.id) || team.division?.includes(d.id) || matches.some(m => m.divisionId === d.id));
  const tournamentIds = new Set([...divisions.map(d => d.tournamentId), ...matches.map(m => m.tournamentId), ...(team.competition ?? []),...data.tournaments.filter(t=>t.participatingTeamIds?.includes(team.id)).map(t=>t.id)]);
  return {
    matches, divisions, tournaments: data.tournaments.filter(t => tournamentIds.has(t.id)),
    next: nextMatch(matches, now, team.club), latest: completedMatches(matches, team.club)[0],
    venue: data.venues.find(v => v.id === team.homeVenue),
    events: eventData.filter(e => team.eventIds?.includes(e.id)),
    competitionData: { ...data,
      tournaments: data.tournaments.filter(t => tournamentIds.has(t.id)), divisions,
      teams: data.teams.filter(t => t.id === team.id || matches.some(m => [m.homeTeamId, m.awayTeamId].includes(t.id))),
      fixtures: data.fixtures.filter(f => [f.homeTeamId, f.awayTeamId].includes(team.id)),
    },
  };
}

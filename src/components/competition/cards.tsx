import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { competitionData, teamIdentity } from "@/data/competition";
import type { CompetitionData, Match, Team, Tournament } from "@/data/competition/types";
import { formatDate } from "@/lib/format";
import { hasTeamProfile } from "@/data/teams";

export function CompetitionEmptyState({ title, description }: { title: string; description?: string }) {
  return <div className="competition-empty"><span className="empty-diamond" aria-hidden="true">◇</span><h3>{title}</h3>{description && <p>{description}</p>}</div>;
}
export function CompetitionStatus({ status }: { status: string }) {
  return <span className={`tag competition-status status-${status}`}>{status === "scheduled" ? "Upcoming" : status}</span>;
}
export function TeamBadge({ team }: { team: Team }) {
  const identity = teamIdentity(team);
  const badge = <span className="team-identity" style={{ "--team-accent": identity.accentColour ?? "#a4afc2" } as CSSProperties}>
    {identity.logo ? <Image src={identity.logo} width={56} height={56} alt={`${team.name} logo`} /> : <span className="team-fallback" aria-hidden="true">◇</span>}
    <span>{team.name}</span></span>;
  return hasTeamProfile(team) ? <Link className="team-profile-link" href={`/teams/${team.slug}`} aria-label={`${team.name} team profile`}>{badge}</Link> : badge;
}
export function ScoreDisplay({ match }: { match: Match }) {
  if (!match.result) return <span className="match-versus">VS</span>;
  return <strong className="competition-score" aria-label={`${match.home.name} ${match.result.homeScore}, ${match.away.name} ${match.result.awayScore}`}>{match.result.homeScore}<span aria-hidden="true"> : </span>{match.result.awayScore}</strong>;
}
export function FixtureCard({ match, detail = false }: { match: Match; detail?: boolean }) {
  return <article className="competition-card">
    <div className="card-top"><span className="eyebrow">{match.tournament.name} / {match.division.name}</span><CompetitionStatus status={match.status} /></div>
    <div className="competition-matchup"><TeamBadge team={match.home} /><ScoreDisplay match={match} /><TeamBadge team={match.away} /></div>
    <div className="competition-meta">{match.date && <time dateTime={match.date}>{formatDate(match.date)}</time>}{match.time && <span>{match.time}{match.timeZoneLabel ? ` ${match.timeZoneLabel}` : ""}</span>}{match.venue && <span>{match.venue.name}{match.venue.location ? ` · ${match.venue.location}` : ""}</span>}{match.diamond && <span>{match.diamond}</span>}</div>
    {!detail && <Link className="text-link" href={`/fixtures/${match.id}`} aria-label={`Match centre: ${match.home.name} vs ${match.away.name}`}>Match centre ↗</Link>}
  </article>;
}
export const ResultCard = FixtureCard;
export function TournamentCard({ tournament, data = competitionData }: { tournament: Tournament; data?: CompetitionData }) {
  const divisions = data.divisions.filter(d => d.tournamentId === tournament.id);
  const teams = new Set([...divisions.flatMap(d => d.teamIds),...(tournament.participatingTeamIds??[])]);
  const venues = data.venues.filter(v => tournament.venueIds.includes(v.id));
  return <article className="competition-card tournament-card"><CompetitionStatus status={tournament.status} /><h3><Link href={`/tournaments/${tournament.slug}`}>{tournament.name}</Link></h3>{tournament.description && <p>{tournament.description}</p>}
    <div className="competition-meta">{tournament.startDate && <span>{formatDate(tournament.startDate)}{tournament.endDate && ` – ${formatDate(tournament.endDate)}`}</span>}{venues.map(v => <span key={v.id}>{v.name}{v.location && ` · ${v.location}`}</span>)}{teams.size > 0 && <span>{teams.size} teams</span>}{divisions.length > 0 && <span>{divisions.length} divisions</span>}</div>
    <Link className="text-link" href={`/tournaments/${tournament.slug}`}>Tournament details ↗</Link></article>;
}

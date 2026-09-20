import Link from "next/link";
import { competitionData, getMatches } from "@/data/competition";
import type { Match, Tournament } from "@/data/competition/types";
import { CompetitionEmptyState, FixtureCard, TeamBadge, TournamentCard } from "./cards";
import { FixturesBrowser } from "./fixtures-browser";

export function FixturesPage() {
  return <div className="container route-page"><p className="eyebrow">Western Roos / Competition centre</p><h1>Fixtures & results</h1><p className="intro">Follow the action across the Western Roos family.</p><FixturesBrowser data={competitionData} /></div>;
}
export function TournamentsPage() {
  return <div className="container route-page"><p className="eyebrow">Western Roos / Competition centre</p><h1>Tournaments</h1><p className="intro">Tournament information across the Western Roos family.</p><div className="competition-grid">{competitionData.tournaments.length ? competitionData.tournaments.map(t => <TournamentCard key={t.id} tournament={t} />) : <CompetitionEmptyState title="Tournament details coming soon" description="Tournament information will be published here once confirmed." />}</div></div>;
}
export function MatchPage({ match }: { match: Match }) {
  return <div className="container route-page"><p className="eyebrow">Match centre / {match.status === "scheduled" ? "Next match" : match.status}</p><h1>{match.home.name} vs {match.away.name}</h1><p className="intro"><Link href={`/tournaments/${match.tournament.slug}`}>{match.tournament.name}</Link> / {match.division.name}</p><FixtureCard match={match} detail />{match.summary && <section className="competition-block"><h2>Match summary</h2><p>{match.summary}</p></section>}{match.notes && <section className="competition-block"><h2>Match notes</h2><p>{match.notes}</p></section>}<Link className="text-link competition-back" href="/fixtures">All fixtures & results ↗</Link></div>;
}
export function TournamentPage({ tournament }: { tournament: Tournament }) {
  const divisions = competitionData.divisions.filter(d => d.tournamentId === tournament.id);
  const teamIds = new Set(divisions.flatMap(d => d.teamIds));
  const teams = competitionData.teams.filter(t => teamIds.has(t.id));
  const data = { ...competitionData, tournaments: [tournament], divisions, fixtures: competitionData.fixtures.filter(f => f.tournamentId === tournament.id) };
  // Include fixture participants even before a full division roster is supplied.
  getMatches(data).forEach(m => [m.home, m.away].forEach(t => { if (!teams.some(team => team.id === t.id)) teams.push(t); }));
  return <div className="container route-page"><p className="eyebrow">Western Roos / Tournament centre</p><h1>{tournament.name}</h1><section className="competition-block"><h2>Overview</h2><TournamentCard tournament={tournament} /></section><section className="competition-block"><h2>Divisions</h2>{divisions.length ? <ul className="division-list">{divisions.map(d => <li key={d.id}>{d.name}</li>)}</ul> : <CompetitionEmptyState title="Division information coming soon" />}</section><section className="competition-block"><h2>Teams</h2>{teams.length ? <div className="competition-grid">{teams.map(t => <TeamBadge key={t.id} team={t} />)}</div> : <CompetitionEmptyState title="Teams will appear once confirmed" />}</section><FixturesBrowser data={data} /><Link className="text-link competition-back" href="/tournaments">All tournaments ↗</Link></div>;
}

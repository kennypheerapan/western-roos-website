import Link from "next/link";
import { competitionData, getMatches, matchTime } from "@/data/competition";
import type { CompetitionData, Match, Tournament } from "@/data/competition/types";
import { CompetitionEmptyState, FixtureCard, TeamBadge, TournamentCard } from "./cards";
import { FixturesBrowser } from "./fixtures-browser";
import { Button } from "@/components/ui";
import { managedCompetition } from '@/lib/content/public-adapters';
import { publicContent } from '@/lib/content/server';
import { ContentCards } from '@/components/content/published';

export async function CompetitionPage() {
  const data=await managedCompetition();
  return (
    <div className="container route-page competition-landing">
      <p className="eyebrow">Western Roos / Competition</p>
      <h1>Competition centre</h1>
      <p className="intro">Perth Softball League (PSL) is United’s primary competition pathway. West Coast Marlins provides Masters representative opportunities through WRTSC. Find confirmed fixtures, results and tournament information here.</p>
      <div className="competition-grid">
        <section className="competition-card" aria-labelledby="competition-fixtures">
          <h2 id="competition-fixtures">Fixtures & results</h2>
          <p className="competition-meta">Explore upcoming fixtures and confirmed results.</p>
          <Button href="/fixtures">View fixtures & results</Button>
        </section>
        <section className="competition-card" aria-labelledby="competition-tournaments">
          <h2 id="competition-tournaments">Tournaments</h2>
          <p className="competition-meta">Explore tournament information and competition details.</p>
          <Button href="/tournaments">View tournaments</Button>
        </section>
      </div>
      {!data.fixtures.length && !data.tournaments.length && (
        <section className="competition-block" aria-labelledby="competition-information">
          <h2 id="competition-information" className="sr-only">Official competition information</h2>
          <CompetitionEmptyState title="Competition information coming soon" description="Official fixtures, results and tournament information will be published once confirmed." />
        </section>
      )}
    </div>
  );
}

export async function FixturesPage() {
  return <div className="container route-page"><p className="eyebrow">Western Roos / Competition centre</p><h1>Fixtures & results</h1><p className="intro">Follow the action across the Western Roos family.</p><FixturesBrowser data={await managedCompetition()} /><p className="team-actions"><Link className="text-link" href="/join?pathway=competitive">Find your competitive pathway ↗</Link></p></div>;
}
export async function ResultsPage() {
  const matches = getMatches(await managedCompetition()).filter(m => m.status === "final" && m.result).sort((a, b) => matchTime(b) - matchTime(a));
  return <div className="container route-page"><p className="eyebrow">Western Roos / Competition centre</p><h1>Results</h1><p className="intro">Confirmed results across the Western Roos family.</p><h2 className="sr-only">Final scores</h2><div className="competition-grid">{matches.length ? matches.map(m => <FixtureCard key={m.id} match={m} />) : <CompetitionEmptyState title="No confirmed results yet" description="Results will appear here once confirmed." />}</div><Link className="text-link competition-back" href="/fixtures#results">Filter fixtures & results ↗</Link><p className="team-actions"><Link className="text-link" href="/join?pathway=competitive">Find your competitive pathway ↗</Link></p></div>;
}
export async function TournamentsPage() {
  const data=await managedCompetition();return <div className="container route-page"><p className="eyebrow">Western Roos / Competition centre</p><h1>Tournaments</h1><p className="intro">Tournament information across the Western Roos family.</p><h2 className="sr-only">Tournament information</h2><div className="competition-grid">{data.tournaments.length ? data.tournaments.map(t => <TournamentCard key={t.id} tournament={t} data={data} />) : <CompetitionEmptyState title="Tournament details coming soon" description="Tournament information will be published here once confirmed." />}</div></div>;
}
export async function MatchPage({ match }: { match: Match }) {
  const reports=(await publicContent()).filter(r=>r.kind==='news'&&r.data.fixture_id===match.id);
  return <div className="container route-page"><p className="eyebrow">Match centre / {match.status === "scheduled" ? "Next match" : match.status}</p><h1>{match.home.name} vs {match.away.name}</h1><p className="intro"><Link href={`/tournaments/${match.tournament.slug}`}>{match.tournament.name}</Link> / {match.division.name}</p><FixtureCard match={match} detail />{match.summary && <section className="competition-block"><h2>Match summary</h2><p>{match.summary}</p></section>}{match.notes && <section className="competition-block"><h2>Match notes</h2><p>{match.notes}</p></section>}{reports.length>0&&<section className="competition-block"><h2>Match reports & updates</h2><ContentCards records={reports}/></section>}<Link className="text-link competition-back" href="/fixtures">All fixtures & results ↗</Link></div>;
}
export async function TournamentPage({ tournament,source=competitionData }: { tournament: Tournament;source?:CompetitionData }) {
  const divisions = source.divisions.filter(d => d.tournamentId === tournament.id);
  const teamIds = new Set([...divisions.flatMap(d => d.teamIds),...(tournament.participatingTeamIds??[])]);
  const teams = source.teams.filter(t => teamIds.has(t.id));
  const data = { ...source, tournaments: [tournament], divisions, fixtures: source.fixtures.filter(f => f.tournamentId === tournament.id) };
  const content=await publicContent(),itineraries=content.filter(r=>r.kind==='itinerary'&&r.data.tournament_id===tournament.id),details=content.find(r=>r.id===tournament.id),updates=content.filter(r=>r.kind==='news'&&r.data.tournament_id===tournament.id);
  // Include fixture participants even before a full division roster is supplied.
  getMatches(data).forEach(m => [m.home, m.away].forEach(t => { if (!teams.some(team => team.id === t.id)) teams.push(t); }));
  return <div className="container route-page"><p className="eyebrow">Western Roos / Tournament centre</p><h1>{tournament.name}</h1><section className="competition-block"><h2>Overview</h2><TournamentCard tournament={tournament} data={source}/>{details&&<><p className="managed-copy">{details.body}</p>{details.data.competition&&<p>{String(details.data.competition)}</p>}{details.data.website&&<a className="text-link" href={String(details.data.website)} target="_blank" rel="noopener noreferrer">Official tournament platform ↗</a>}</>}</section><section className="competition-block"><h2>Divisions</h2>{divisions.length ? <ul className="division-list">{divisions.map(d => <li key={d.id}>{d.name}</li>)}</ul> : <CompetitionEmptyState title="Division information coming soon" />}</section><section className="competition-block"><h2>Teams</h2>{teams.length ? <div className="competition-grid">{teams.map(t => <TeamBadge key={t.id} team={t} />)}</div> : <CompetitionEmptyState title="Teams will appear once confirmed" />}</section><FixturesBrowser data={data} /><section className="competition-block"><h2>Approved itineraries</h2><ContentCards records={itineraries} empty="Meeting times and approved public travel information are pending."/></section>{updates.length>0&&<section className="competition-block"><h2>Tournament announcements</h2><ContentCards records={updates}/></section>}<Link className="text-link competition-back" href="/tournaments">All tournaments ↗</Link></div>;
}

import { JoinPage } from "@/components/join/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clubs } from "@/config/brands";
import { AboutPage } from "@/components/about/page";
import { competitionData, getMatches } from "@/data/competition";
import { CompetitionPage, FixturesPage, TournamentsPage, MatchPage, TournamentPage } from "@/components/competition/pages";

import { events, getEvent } from "@/data/events";
import { EventsPage, EventPage } from "@/components/events/pages";
import { PlayPage, CommunityPage } from "@/components/events/pathways";
import { TeamsPage, TeamDetail } from "@/components/teams/pages";
import { getTeam, getTeams } from "@/data/teams";
import { ResultsPage } from "@/components/competition/pages";
import { managedCompetition,clubEvent } from '@/lib/content/public-adapters';
import { publicContent } from '@/lib/content/server';
import { ManagedSection } from '@/components/content/published';
const pages: Record<string, { title: string; intro: string }> = {
  competition: { title: "Competition centre", intro: "Fixtures, results and tournament information across the Western Roos family." },
  events: { title: "Club life & events", intro: "Softball, development, community and club events across the Western Roos family." },
  play: { title: "Play & development", intro: "Future opportunities to learn, play and grow with the game." },
  community: { title: "Community", intro: "Future community involvement and club initiatives." },
  tournaments: {
    title: "Tournament centre",
    intro:
      "Tournament information from Western Roos Tournament Softball Club.",
  },
  fixtures: {
    title: "Fixtures & results",
    intro:
      "Follow fixtures and results across the Western Roos Tournament Softball Club family.",
  },
  teams: {
    title: "Our teams",
    intro: "Official team information will appear here when confirmed.",
  },
  results: { title: "Results", intro: "Confirmed results across the Western Roos family." },
  about: {
    title: "About Western Roos",
    intro:
      "Western Roos Tournament Softball Club (WRTSC) provides governance, administration and development for United Softball Club and the West Coast Marlins Masters representative program.",
  },
  join: {
    title: "Join / Find your pathway",
    intro: "Find your softball pathway, explore United and Marlins Masters, and prepare your enquiry.",
  },
};
export const dynamicParams = true;
export const dynamic='force-dynamic';
export function generateStaticParams() {
  return [
    ...Object.keys(pages).map((key) => ({ slug: [key] })),
    ...clubs.map(club => ({ slug: ["clubs", club.slug, "teams"] })),
    { slug: ["teams", "details-pending"] },
    ...getTeams().map(team => ({ slug: ["teams", team.slug] })),
    ...events.map(event => ({ slug: ["events", event.slug] })),
    ...getMatches().map((match) => ({ slug: ["fixtures", match.id] })),
    ...competitionData.tournaments.map(t => ({ slug: ["tournaments", t.slug] })),
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if(slug.length===2&&['fixtures','tournaments','events'].includes(slug[0])){
    const managed=(await publicContent()).find(r=>r.id===slug[1]&&r.kind===({fixtures:'fixture',tournaments:'tournament',events:'event'}[slug[0]]));
    if(managed)return {title:managed.title,description:managed.summary};
  }
  const team = slug[0] === "teams" && slug.length === 2 ? getTeam(slug[1]) : undefined;
  if (team) return { title: team.name, description: team.description ?? undefined };
  if (slug.join("/") === "teams/details-pending") return { title: "Team details pending", robots: { index: false, follow: false } };
  if (slug[0] === "clubs" && slug[2] === "teams") return { title: `${clubs.find(c => c.slug === slug[1])?.shortName} teams` };
  const event = slug[0] === "events" && slug.length === 2 ? getEvent(slug[1]) : undefined;
  const match = slug[0] === "fixtures" && slug.length === 2 ? getMatches().find(m => m.id === slug[1]) : undefined;
  const tournament = slug[0] === "tournaments" && slug.length === 2 ? competitionData.tournaments.find(t => t.slug === slug[1]) : undefined;
  return {
    description: event?.summary ?? tournament?.description ?? pages[slug.join("/")]?.intro ?? (match ? match.home.name + " vs " + match.away.name + " — " + match.tournament.name : undefined),
    title:
      event?.title ?? (match ? `${match.home.name} vs ${match.away.name}` : tournament?.name) ??
      pages[slug.join("/")]?.title ??
      clubs.find((c) => c.slug === slug[1])?.name ??
      "Match centre",
  };
}
export default async function RoutePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug.join("/");
  if (key === "competition") return <CompetitionPage />;
  if (key === "about") return <AboutPage />;
  if (key === "join") return <JoinPage />;
  if (key === "teams") return <TeamsPage />;
  if (key === "results") return <ResultsPage />;
  if (key === "teams/details-pending") return <TeamDetail />;
  if (slug[0] === "teams" && slug.length === 2) {
    const team = getTeam(slug[1]);
    if (!team) notFound();
    return <TeamDetail team={team} />;
  }
  if (slug[0] === "clubs" && slug[2] === "teams" && slug.length === 3) {
    const club = clubs.find(c => c.slug === slug[1]);
    if (!club) notFound();
    return <TeamsPage club={club} />;
  }
  if (key === "events") return <EventsPage />;
  if (key === "play") return <><PlayPage /><ManagedSection kinds={['event','news']} categories={['coaching','junior','beginners','development']} title="Published development & club updates"/></>;
  if (key === "community") return <><CommunityPage /><ManagedSection kinds={['event']} categories={['community','charity','poker','social','volunteer']} title="Confirmed community & club activities"/></>;
  if (slug[0] === "events" && slug.length === 2) {
    const records=await publicContent(),managed=records.find(r=>r.kind==='event'&&r.id===slug[1]);
    const event = managed?clubEvent(managed,records):getEvent(slug[1]);
    if (!event) notFound();
    return <EventPage event={event} />;
  }
  if (key === "fixtures") return <FixturesPage />;
  if (key === "tournaments") return <TournamentsPage />;
  const page = pages[key];
  if (page)
    return (
      <div className="container route-page">
        <p className="eyebrow">WESTERN ROOS / {page.title}</p>
        <h1>{page.title}</h1>
        <p className="intro">{page.intro}</p>
      </div>
    );
  if (slug[0] === "fixtures" && slug.length === 2) {
    const match = getMatches(await managedCompetition()).find(m => m.id === slug[1]);
    if (!match) notFound();
    return <MatchPage match={match} />;
  }
  if (slug[0] === "tournaments" && slug.length === 2) {
    const source=await managedCompetition();const tournament = source.tournaments.find(t => t.slug === slug[1]);
    if (!tournament) notFound();
    return <TournamentPage tournament={tournament} source={source}/>;
  }
  notFound();
}

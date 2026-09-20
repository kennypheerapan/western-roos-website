import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clubs } from "@/config/brands";
import { mockNews } from "@/data/mock";
import { Button, MediaArea } from "@/components/ui";
import { competitionData, getMatches } from "@/data/competition";
import { FixturesPage, TournamentsPage, MatchPage, TournamentPage } from "@/components/competition/pages";
import {
  GallerySection,
  NewsSection,
} from "@/components/sections/stories";

const pages: Record<string, { title: string; intro: string }> = {
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
  news: {
    title: "News & stories",
    intro:
      "A home for stories from our softball community. These are editorial placeholders, not club announcements.",
  },
  gallery: {
    title: "Club gallery",
    intro:
      "A space for the action, the people and the moments. Official club photography is coming soon.",
  },
  about: {
    title: "About Western Roos",
    intro:
      "Western Roos Tournament Softball Club (WRTSC) is the peak organisation for United Softball Club and West Coast Marlins Masters Softball Club.",
  },
  join: {
    title: "Ready to play?",
    intro: "Become part of Western Roos Tournament Softball Club.",
  },
};
export const dynamicParams = false;
export function generateStaticParams() {
  return [
    ...Object.keys(pages).map((key) => ({ slug: [key] })),
    ...getMatches().map((match) => ({ slug: ["fixtures", match.id] })),
    ...competitionData.tournaments.map(t => ({ slug: ["tournaments", t.slug] })),
    ...mockNews.map((story) => ({ slug: ["news", story.slug] })),
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const match = slug[0] === "fixtures" && slug.length === 2 ? getMatches().find(m => m.id === slug[1]) : undefined;
  const tournament = slug[0] === "tournaments" && slug.length === 2 ? competitionData.tournaments.find(t => t.slug === slug[1]) : undefined;
  return {
    description: tournament?.description ?? pages[slug.join("/")]?.intro ?? (match ? match.home.name + " vs " + match.away.name + " — " + match.tournament.name : undefined),
    title:
      (match ? `${match.home.name} vs ${match.away.name}` : tournament?.name) ??
      pages[slug.join("/")]?.title ??
      clubs.find((c) => c.slug === slug[1])?.name ??
      mockNews.find((n) => n.slug === slug[1])?.title ??
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
  if (key === "fixtures") return <FixturesPage />;
  if (key === "tournaments") return <TournamentsPage />;
  const page = pages[key];
  if (page)
    return (
      <div className="container route-page">
        <p className="eyebrow">WESTERN ROOS / {page.title}</p>
        <h1>{page.title}</h1>
        <p className="intro">{page.intro}</p>
        {key === "news" && <NewsSection />}
        {key === "gallery" && <GallerySection />}
        {["join", "teams", "about"].includes(key) && (
          <div className="notice-panel">
            <h2>
              {key === "join"
                ? "Your place on the diamond."
                : key === "teams"
                  ? "Team details coming soon."
                  : "Competition. Community. Softball."}
            </h2>
            <p>
              {key === "join"
                ? "Membership details and an official contact channel will be added here once confirmed. Online registration is not open on this website yet."
                : key === "teams"
                  ? "Team names, divisions and player information have not been supplied. Check back for confirmed information."
                  : "Club history, committee information and official contact details will be added once supplied."}
            </p>
            <Button href="/clubs">Explore our clubs</Button>
          </div>
        )}
      </div>
    );
  if (slug[0] === "fixtures" && slug.length === 2) {
    const match = getMatches().find(m => m.id === slug[1]);
    if (!match) notFound();
    return <MatchPage match={match} />;
  }
  if (slug[0] === "tournaments" && slug.length === 2) {
    const tournament = competitionData.tournaments.find(t => t.slug === slug[1]);
    if (!tournament) notFound();
    return <TournamentPage tournament={tournament} />;
  }
  if (slug[0] === "news" && slug.length === 2) {
    const story = mockNews.find((n) => n.slug === slug[1]);
    if (!story) notFound();
    return (
      <article className="container route-page">
        <p className="eyebrow">{story.category} / STORIES</p>
        <h1>{story.title}</h1>
        <div className="article-body">
          <MediaArea media={story.media} />
          <p>{story.description}</p>
          <p>
            This is a space for a future story. No club announcement has
            been made. Official stories and photography will replace this sample
            content.
          </p>
          <Button href="/news">Back to news</Button>
        </div>
      </article>
    );
  }
  notFound();
}




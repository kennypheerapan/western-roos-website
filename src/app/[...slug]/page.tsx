import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clubs } from "@/config/brands";
import { mockFixtures, mockNews } from "@/data/mock";
import { Button, MediaArea } from "@/components/ui";
import { TournamentSection } from "@/components/sections/tournament";
import {
  GallerySection,
  NewsSection,
  ResultsSection,
} from "@/components/sections/stories";
import { formatDate } from "@/lib/format";
const pages: Record<string, { title: string; intro: string }> = {
  tournaments: {
    title: "Tournament centre",
    intro:
      "A home for tournament information. The event below is a demonstration, not an announced tournament.",
  },
  fixtures: {
    title: "Fixtures & results",
    intro:
      "Explore the sample schedule and scores. All dates, opponents, venues and results shown here are demo content.",
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
    ...mockFixtures.map((match) => ({ slug: ["fixtures", match.id] })),
    ...mockNews.map((story) => ({ slug: ["news", story.slug] })),
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title:
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
  const page = pages[key];
  if (page)
    return (
      <div className="container route-page">
        <p className="eyebrow">WESTERN ROOS / {page.title}</p>
        <h1>{page.title}</h1>
        <p className="intro">{page.intro}</p>
        {key === "tournaments" && <TournamentSection />}
        {key === "fixtures" && (
          <>
            <div className="fixture-list">
              {mockFixtures.map((match) => (
                <article key={match.id} className="fixture-row">
                  <div>
                    <span className="eyebrow">Upcoming · Demo fixture</span>
                    <h2>
                      {match.home} vs {match.away}
                    </h2>
                    <p>
                      {formatDate(match.date)} · {match.time} AWST ·{" "}
                      {match.venue}
                    </p>
                  </div>
                  <Button href={`/fixtures/${match.id}`}>Match centre</Button>
                </article>
              ))}
            </div>
            <div id="results">
              <ResultsSection />
            </div>
          </>
        )}
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
    const match = mockFixtures.find((m) => m.id === slug[1]);
    if (!match) notFound();
    return (
      <div className="container route-page">
        <p className="eyebrow">MATCH CENTRE / DEMO FIXTURE</p>
        <h1>
          {match.home}
          <br />
          vs {match.away}
        </h1>
        <p className="intro">
          {match.competition} · {formatDate(match.date)} · {match.time} AWST
        </p>
        <div className="notice-panel">
          <h2>{match.venue}</h2>
          <p>
            This is sample match information. Official fixtures and match
            details have not been confirmed. Live scoring is reserved for a
            future build.
          </p>
          <Button href="/fixtures">All fixtures & results</Button>
        </div>
      </div>
    );
  }
  if (slug[0] === "news" && slug.length === 2) {
    const story = mockNews.find((n) => n.slug === slug[1]);
    if (!story) notFound();
    return (
      <article className="container route-page">
        <p className="eyebrow">{story.category} / DEMO STORY</p>
        <h1>{story.title}</h1>
        <div className="article-body">
          <MediaArea media={story.media} />
          <p>{story.description}</p>
          <p>
            This is a preview of a future story page. No club announcement has
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




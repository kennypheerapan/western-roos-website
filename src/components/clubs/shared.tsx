import { competitionSnapshotTime } from "@/data/competition/snapshot";
import Link from "next/link";
import Image from "next/image";
import type { Club, Media } from "@/types";
import { clubs, parentBrand } from "@/config/brands";
import { clubEditorial } from "@/config/club-editorial";
import { clubTournaments, completedMatches, getMatches, nextMatch } from "@/data/competition";
import { BrandMark, Button, MediaArea } from "@/components/ui";
import { CompetitionEmptyState, FixtureCard, ResultCard, TournamentCard } from "@/components/competition/cards";

export function ClubFamilyNav({ active }: { active?: string }) {
  return <nav className="family-nav container" aria-label="Club family">
    <Link href="/">Western Roos</Link><span aria-hidden="true">/</span>
    <Link href="/clubs" aria-current={active === "hub" ? "page" : undefined}>Our clubs</Link>
    {clubs.map(c => <Link key={c.slug} href={`/clubs/${c.slug}`} aria-current={active === c.slug ? "page" : undefined}>{c.slug === "united" ? "United" : "Marlins Masters"}</Link>)}
  </nav>;
}
export function ClubGraphic({ club, media, label = "Masters softball" }: { club: Club; media?: Media | null; label?: string }) {
  if (media?.src) return <MediaArea media={media} className="club-graphic" />;
  return <div className="club-graphic" aria-label={`${club.name} brand artwork`} role="img">
    <div className="diamond-ring ring-one" /><div className="diamond-ring ring-two" />
    <Image className="graphic-watermark" src={club.logo!} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" />
    <BrandMark brand={club} /><span className="graphic-label">{label}</span>
  </div>;
}
export function ClubIntro({ club }: { club: Club }) {
  return <section className="container club-intro club-space"><div><p className="eyebrow">{club.slug === "united" ? "About United" : "About Marlins Masters"}</p><h2>{club.slug === "united" ? <>A place to play.<br />Room to grow.</> : <>Still in the game.<br />Always part of it.</>}</h2></div><div><p className="club-lead">{club.description}</p><p>{club.slug === "united" ? "Participation, player development and family involvement are at the heart of a supportive club environment." : "From league competition to masters tournaments and representative opportunities, there is more than one way to stay connected to softball."}</p></div></section>;
}
export const pathwayCopy: Record<string, [string, string][]> = {
  united: [["New to the game", "A pathway into softball, with participation and support at its heart."], ["Returning to play", "Reconnect with the game in a supportive club environment."], ["Social softball", "Enjoy the game and the people you share it with."], ["Competitive play", "Develop your game and take part in competitive softball."]],
  "west-coast-marlins": [["League competition", "Competitive and social opportunities for masters players."], ["Masters tournaments", "A tournament pathway to continue your softball experience."], ["Representative opportunities", "Explore the representative opportunities available through the club."]],
};
export function ClubPathways({ club }: { club: Club }) {
  return <section className="club-pathway-section club-space"><div className="container"><p className="eyebrow">{club.slug === "united" ? "Your way into United" : "Competition pathways"}</p><h2>{club.slug === "united" ? "Find your place in the game." : "More game ahead."}</h2><div className="pathway-list">{pathwayCopy[club.slug].map(([title, text], i) => <article key={title}><span className="pathway-number">0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div><span className="pathway-plus" aria-hidden="true">+</span></article>)}</div></div></section>;
}
export function ClubCompetition({ club }: { club: Club }) {
  const matches = getMatches();
  const fixture = nextMatch(matches, competitionSnapshotTime, club.slug);
  const result = completedMatches(matches, club.slug)[0];
  const tournaments = clubTournaments(club.slug);
  return <section className="container club-space club-competition"><div><p className="eyebrow">The competition desk</p><h2>Next up.<br />Last out.</h2><p>Follow {club.shortName} fixtures, results and upcoming tournaments.</p><Button href="/fixtures" secondary>Fixtures & results</Button></div><div className="competition-panels"><div><p className="eyebrow">Next fixture</p>{fixture ? <FixtureCard match={fixture} /> : <CompetitionEmptyState title="Fixtures coming soon" description="Competition details are being prepared." />}</div><div><p className="eyebrow">Latest result</p>{result ? <ResultCard match={result} /> : <CompetitionEmptyState title="No confirmed results yet" />}</div><div><p className="eyebrow">Upcoming tournaments</p>{tournaments.length ? tournaments.map(t => <TournamentCard key={t.id} tournament={t} />) : <CompetitionEmptyState title="Tournament details coming soon" />}</div></div></section>;
}
export function ClubNews({ club }: { club: Club }) {
  const entries = clubEditorial[club.slug].news;
  return <section className="container club-space club-news"><div><p className="eyebrow">News & stories</p><h2>{club.slug === "united" ? "More than game day." : "The Marlins story continues."}</h2></div>{entries.length ? entries.map(entry => <article key={entry.title}>{entry.media && <MediaArea media={entry.media} />}<div><p className="eyebrow">{entry.provisional ? "Provisional editorial preview" : "Club story"}</p><h3>{entry.title}</h3><p>{entry.description}</p></div></article>) : <div className="club-editorial-note"><span aria-hidden="true">M / M</span><p>Club news and moments from the diamond will appear here as official stories and photography are supplied.</p></div>}</section>;
}
export function ClubGallery({ club }: { club: Club }) {
  const photos = clubEditorial[club.slug].gallery;
  if (!photos.length) return null;
  return <section className="club-space club-gallery container"><p className="eyebrow">{club.shortName} / In the frame</p><h2>These are our moments.</h2><div>{photos.map((media, i) => <figure key={media.src}><MediaArea media={media} /><figcaption><span>0{i + 1}</span>{media.label}</figcaption></figure>)}</div></section>;
}
export function ClubJoinCTA({ club }: { club?: Club }) {
  return <section className="club-join club-space"><div className="container"><p className="eyebrow">{club?.parentLabel ?? "The Western Roos family"}</p><h2>{club ? `Ready to ${club.slug === "united" ? "join United?" : "play with Marlins?"}` : "Your next chapter starts here."}</h2><p>{club ? "Take the next step towards your place on the diamond." : "New to softball, returning to play or looking for masters opportunities — explore your club pathway."}</p><Button href="/join">{club ? `Join / enquire — ${club.shortName}` : "Join / find your club"}</Button><p className="join-note">Membership information and an official enquiry channel are awaiting confirmation.</p>{!club && <Link href="/" className="text-link">Back to {parentBrand.shortName} ↗</Link>}</div></section>;
}

import { contactHref, joinHref } from "@/lib/enquiry";
import { competitionSnapshotTime } from "@/data/competition/snapshot";
import Link from "next/link";
import Image from "next/image";
import type { Club, Media } from "@/types";
import { clubs, parentBrand } from "@/config/brands";
import { clubEditorial } from "@/config/club-editorial";
import { clubTournaments, completedMatches, getMatches, nextMatch } from "@/data/competition";
import { BrandMark, Button, MediaArea } from "@/components/ui";
import { CompetitionEmptyState, FixtureCard, ResultCard, TournamentCard } from "@/components/competition/cards";
import { Suspense } from 'react';
import { homepageContent,newsStory } from '@/lib/content/public-adapters';
import { competitionData } from '@/data/competition';
import type { CompetitionData } from '@/data/competition/types';

export function ClubFamilyNav({ active }: { active?: string }) {
  return <nav className="family-nav container" aria-label="Club family">
    <Link href="/">Western Roos</Link><span aria-hidden="true">/</span>
    <Link href="/clubs" aria-current={active === "hub" ? "page" : undefined}>Our pathways</Link>
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
  return <section className="container club-intro club-space"><div><p className="eyebrow">{club.slug === "united" ? "About United" : "About Marlins Masters"}</p><h2>{club.slug === "united" ? <>A place to play.<br />Room to grow.</> : <>Still in the game.<br />Always part of it.</>}</h2></div><div><p className="club-lead">{club.description}</p><p>{club.slug === "united" ? "New, returning, social and competitive players can find a pathway through United, with player development and family involvement at the heart of the club." : "The program is part of WRTSC, not a standalone softball club. Opportunities include Masters tournaments, interstate events, state and national championships, and invitational representative competitions."}</p></div></section>;
}
export const pathwayCopy: Record<string, [string, string][]> = {
  united: [["New to the game", "A pathway into softball, with participation and support at its heart."], ["Returning to play", "Reconnect with the game in a supportive club environment."], ["Social softball", "Enjoy the game and the people you share it with."], ["Competitive play", "Develop your game and take part in competitive softball."]],
  "west-coast-marlins": [["Interstate events", "Representative opportunities for eligible Masters players."], ["Masters tournaments", "A tournament pathway to continue your softball experience."], ["Representative opportunities", "State and national championships and invitational representative competitions through the WRTSC program."]],
};
export function ClubPathways({ club }: { club: Club }) {
  return <section className="club-pathway-section club-space"><div className="container"><p className="eyebrow">{club.slug === "united" ? "Your way into United" : "Competition pathways"}</p><h2>{club.slug === "united" ? "Find your place in the game." : "More game ahead."}</h2><div className="pathway-list">{pathwayCopy[club.slug].map(([title, text], i) => <article key={title}><span className="pathway-number">0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div><span className="pathway-plus" aria-hidden="true">+</span></article>)}</div></div></section>;
}
export function ClubCompetition({ club }: { club: Club }) {
  return <Suspense fallback={<ClubCompetitionDisplay club={club}/>}><ManagedClubCompetition club={club}/></Suspense>;
}
async function ManagedClubCompetition({club}:{club:Club}){const {data,now}=await homepageContent();return <ClubCompetitionDisplay club={club} data={data} now={now}/>;}
function ClubCompetitionDisplay({club,data=competitionData,now=competitionSnapshotTime}:{club:Club;data?:CompetitionData;now?:number}){
  const matches = getMatches(data);
  const fixture = nextMatch(matches, now, club.slug);
  const result = completedMatches(matches, club.slug)[0];
  const tournaments = clubTournaments(club.slug,data);
  return <section className="container club-space club-competition"><div><p className="eyebrow">The competition desk</p><h2>Next up.<br />Last out.</h2><p>Follow {club.shortName} fixtures, results and upcoming tournaments.</p><Button href="/fixtures" secondary>Fixtures & results</Button><p className="club-event-pathway">Beyond the diamond, explore <Link href="/events">events across the club family ↗</Link>.</p></div><div className="competition-panels"><div><p className="eyebrow">Next fixture</p>{fixture ? <FixtureCard match={fixture} /> : <CompetitionEmptyState title="Fixtures coming soon" description="Competition details are being prepared." />}</div><div><p className="eyebrow">Latest result</p>{result ? <ResultCard match={result} /> : <CompetitionEmptyState title="No confirmed results yet" />}</div><div><p className="eyebrow">Upcoming tournaments</p>{tournaments.length ? tournaments.map(t => <TournamentCard key={t.id} tournament={t} data={data}/>) : <CompetitionEmptyState title="Tournament details coming soon" />}</div></div></section>;
}
export function ClubNews({ club }: { club: Club }) {
  return <Suspense fallback={<ClubNewsDisplay club={club}/>}><ManagedClubNews club={club}/></Suspense>;
}
async function ManagedClubNews({club}:{club:Club}){const {records}=await homepageContent();const stories=records.filter(r=>r.kind==='news'&&r.pathway===club.slug).slice(0,3).map(newsStory);if(!stories.length)return <ClubNewsDisplay club={club}/>;return <section className="container club-space club-news"><div><p className="eyebrow">News & stories</p><h2>{club.slug==='united'?'More than game day.':'The Marlins story continues.'}</h2></div>{stories.map(s=><article key={s.id}><MediaArea media={s.media}/><div><p className="eyebrow">Approved club news</p><h3><Link href={`/news/${s.id}`}>{s.title}</Link></h3><p>{s.excerpt}</p></div></article>)}</section>;}
function ClubNewsDisplay({club}:{club:Club}){
  const entries = clubEditorial[club.slug].news;
  return <section className="container club-space club-news"><div><p className="eyebrow">News & stories</p><h2>{club.slug === "united" ? "More than game day." : "The Marlins story continues."}</h2></div>{entries.length ? entries.map(entry => <article key={entry.title}>{entry.media && <MediaArea media={entry.media} />}<div><p className="eyebrow">{entry.provisional ? "Provisional editorial preview" : "Club story"}</p><h3>{entry.title}</h3><p>{entry.description}</p></div></article>) : <div className="club-editorial-note"><span aria-hidden="true">M / M</span><p>Club news and moments from the diamond will appear here as official stories and photography are supplied.</p></div>}</section>;
}
export function ClubGallery({ club }: { club: Club }) {
  const photos = clubEditorial[club.slug].gallery;
  if (!photos.length) return null;
  return <section className="club-space club-gallery container"><p className="eyebrow">{club.shortName} / In the frame</p><h2>These are our moments.</h2><div>{photos.map((media, i) => <figure key={media.src}><MediaArea media={media} /><figcaption><span>0{i + 1}</span>{media.label}</figcaption></figure>)}</div></section>;
}
export function ClubJoinCTA({ club }: { club?: Club }) {
  return <section className="club-join club-space"><div className="container"><p className="eyebrow">{club?.parentLabel ?? "The Western Roos family"}</p><h2>{club ? `Ready to ${club.slug === "united" ? "join United?" : "play with Marlins?"}` : "Your next chapter starts here."}</h2><p>{club ? "Take the next step towards your place on the diamond." : "New to softball, returning to play or looking for masters opportunities — explore your participation pathway."}</p><Button href={joinHref(club?.slug)}>{club ? `Join / enquire — ${club.shortName}` : "Join / find your pathway"}</Button>{club && <p className="club-contact-link"><Link className="text-link" href={contactHref(club.slug)}>Enquire about {club.slug === "united" ? "United" : "Marlins Masters"} ↗</Link></p>}<p className="join-note">Membership information and an official enquiry channel are awaiting confirmation.</p>{!club && <Link href="/" className="text-link">Back to {parentBrand.shortName} ↗</Link>}</div></section>;
}

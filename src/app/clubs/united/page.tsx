import type { Metadata } from "next";
import Image from "next/image";
import { clubs } from "@/config/brands";
import { clubEditorial } from "@/config/club-editorial";
import { BrandMark, Button, MediaArea, clubStyle } from "@/components/ui";
import { ClubFamilyNav, ClubIntro, ClubPathways, ClubCompetition, ClubNews, ClubGallery, ClubJoinCTA } from "@/components/clubs/shared";
import "../clubs.css";
import { ClubTeamsSection } from "@/components/teams/pages";
const club = clubs.find(c => c.slug === "united")!;
const editorial = clubEditorial.united;
export const metadata: Metadata = { title: club.name, description: club.description };
export default function UnitedPage() {
  return <div className="clubs-experience united-page" style={clubStyle(club)}><ClubFamilyNav active={club.slug} />
    <section className="united-hero"><div className="container"><div className="united-hero-copy"><p className="eyebrow">{club.parentLabel}</p><BrandMark brand={club} /><h1>Your game.<br /><em>Our United.</em></h1><p>New players. Returning players.<br />Social and competitive softball.<br />There’s a place to begin again.</p><Button href="#united-pathways" secondary>Find your pathway</Button></div><figure><MediaArea media={editorial.hero!} /><figcaption>United Softball Club / Together on the diamond</figcaption></figure></div><div className="united-ribbon" aria-hidden="true">Participation <span>+</span> Development <span>+</span> Family <span>+</span> United</div></section>
    <ClubIntro club={club} /><div id="united-pathways"><ClubPathways club={club} /></div>
    <section className="container club-space united-action"><div className="action-heading"><div><p className="eyebrow">United in action</p><h2>Play. Compete.<br /><em>Connect.</em></h2></div><Image src={club.compactLogo!} alt="United USC monogram" width={150} height={150} /></div><div className="action-grid">{editorial.action.map(media => <figure key={media.src}><MediaArea media={media} /><figcaption>{media.label}</figcaption></figure>)}</div><p>From the first pitch to the final huddle. Participation and player development, with a team around you.</p></section>
    <ClubTeamsSection club={club} /><ClubCompetition club={club} />
    <section className="united-achievements club-space"><div className="container">{editorial.achievements.map(achievement => <article key={achievement.title}><MediaArea media={achievement.media} /><div><p className="eyebrow">Club achievements</p><h2>Shared effort.<br />Shared pride.</h2>{achievement.year && <p>{achievement.year} · {achievement.competition}</p>}<p>A look at United’s club achievements through the supplied club photography.</p><p className="muted">Official achievement records will be added as details are confirmed.</p></div></article>)}</div></section>
    <ClubNews club={club} /><ClubGallery club={club} /><ClubJoinCTA club={club} />
  </div>;
}

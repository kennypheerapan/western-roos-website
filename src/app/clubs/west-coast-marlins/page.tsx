import type { Metadata } from "next";
import { clubs } from "@/config/brands";
import { clubEditorial } from "@/config/club-editorial";
import { Button, clubStyle } from "@/components/ui";
import { ClubFamilyNav, ClubGraphic, ClubIntro, ClubPathways, ClubCompetition, ClubNews, ClubGallery, ClubJoinCTA } from "@/components/clubs/shared";
import "../clubs.css";
import { ClubTeamsSection } from "@/components/teams/pages";
const club = clubs.find(c => c.slug === "west-coast-marlins")!;
export const metadata: Metadata = { title: club.name, description: club.description };
export default function MarlinsPage() {
  return <div className="clubs-experience marlins-page" style={clubStyle(club)}><ClubFamilyNav active={club.slug} />
    <section className="marlins-hero"><div className="container"><div><p className="eyebrow">{club.parentLabel}</p><p className="marlins-name">West Coast Marlins<br />Masters Representative Program</p><h1>The game<br />stays <em>with you.</em></h1><p>Competitive spirit. Social connection.<br />Your masters softball chapter.</p><Button href="#marlins-pathways">Explore the pathways</Button></div><ClubGraphic club={club} media={clubEditorial[club.slug].hero} label="West Coast / Marlins Masters" /></div><div className="masters-band"><span>Interstate events</span><span>Masters tournaments</span><span>Representative opportunities</span></div></section>
    <ClubIntro club={club} />
    <section className="masters-statement container"><p className="eyebrow">Masters softball</p><h2>Bring your game.<br /><em>Stay connected.</em></h2><p>Representative opportunities for eligible Masters players, supported by WRTSC governance and administration.</p></section>
    <div id="marlins-pathways"><ClubPathways club={club} /></div><ClubTeamsSection club={club} /><ClubCompetition club={club} />
    <section className="representative-section club-space"><div className="container"><span className="representative-mark" aria-hidden="true">M</span><div><p className="eyebrow">Representative opportunities</p><h2>Another way<br />to take the field.</h2><p>Representative opportunities are part of the Marlins Masters pathway. Confirmed participation and eligibility information will be shared when available.</p><Button href="/join" secondary>Explore joining Marlins</Button></div></div></section>
    <section className="container club-space"><p className="eyebrow">West Coast Marlins merchandise</p><h2>Wear the Marlins colours.</h2><p>Explore the supplied apparel and accessories catalogue. Ordering details await confirmation.</p><Button href="/shop" secondary>Explore merchandise</Button></section>
    <ClubNews club={club} /><ClubGallery club={club} /><ClubJoinCTA club={club} />
  </div>;
}

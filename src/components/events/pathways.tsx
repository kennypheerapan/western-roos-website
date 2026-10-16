import { EventCategoryLink } from "./category-link";
import Link from "next/link";
import { ClubLifeHero } from "./pages";
import { homepageMedia } from "@/config/media";
import { TeamPathways } from "@/components/teams/pages";
const pathways = [
  ["New to softball", "Curious about the game? Future learn-to-play and beginner session information will be shared here once confirmed."],
  ["Junior development", "A place for junior softball opportunities. Current programs and intake details appear below only when confirmed."],
  ["Skills & coaching", "Details of coaching clinics and skills development sessions will appear when available."],
  ["Returning players", "Looking to reconnect with softball? Explore the club family while future playing opportunities take shape."],
  ["Participation pathways", "Explore United’s community club / PSL pathway and the West Coast Marlins Masters representative program of WRTSC."],
];
export function PlayPage() {
  return <><ClubLifeHero label="PLAY & DEVELOPMENT" first="START HERE." second="GROW WITH THE GAME." copy="Every softball journey starts somewhere. Explore the club family and look ahead to future opportunities to learn, play and develop." media={homepageMedia.beyond[0]} />
    <section className="container life-section"><p className="eyebrow">FIND YOUR WAY INTO THE GAME</p>{pathways.map(([title, copy], i) => <div className="pathway-row" key={title}><span className="eyebrow">0{i + 1}</span><h2>{title}</h2><p>{copy}</p></div>)}<div className="life-links"><Link className="text-link" href="/clubs">Explore our pathways ↗</Link><EventCategoryLink className="text-link" href="/events#category-development">Future sessions & events ↗</EventCategoryLink></div></section><TeamPathways /></>;
}
export function CommunityPage() {
  return <><ClubLifeHero label="COMMUNITY" first="MORE THAN" second="A SOFTBALL CLUB." copy="A future home for community involvement, charity activities, fundraising, volunteering and club social initiatives." media={homepageMedia.community} />
    <section className="container life-section"><p className="eyebrow">TOGETHER, BEYOND THE GAME</p><div className="event-empty"><h2>GOOD THINGS<br />START WITH PEOPLE.</h2><p>Community initiatives and ways to get involved will be shared here as plans are confirmed.</p></div><div className="life-links"><Link className="text-link" href="/events">Explore club events ↗</Link><EventCategoryLink className="text-link" href="/events#category-charity">Charity & fundraising ↗</EventCategoryLink><EventCategoryLink className="text-link" href="/events#category-poker">Poker events ↗</EventCategoryLink></div></section></>;
}
export const merchandise = { status: "coming-soon", title: "WEAR THE CLUB.", summary: "Official Western Roos merchandise is coming soon." } as const;
export function ShopPage() {
  return <><ClubLifeHero label="MERCHANDISE" first={merchandise.title} copy={merchandise.summary} media={homepageMedia.join} /><section className="container life-section"><p className="eyebrow">CLUB COLOURS. EVERY DAY.</p><p className="intro">Apparel and merchandise details will appear here when confirmed.</p><Link className="text-link" href="/clubs">Explore our pathways ↗</Link></section></>;
}

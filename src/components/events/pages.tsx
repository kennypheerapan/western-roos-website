import Link from "next/link";
import { MediaArea } from "@/components/ui";
import { homepageMedia } from "@/config/media";
import { clubs, parentBrand } from "@/config/brands";
import { upcomingEvents, type ClubEvent } from "@/data/events";
import { EventsBrowser } from "./browser";
import { EventDate } from "./shared";
import { publicContent } from '@/lib/content/server';
import { clubEvent } from '@/lib/content/public-adapters';
export function ClubLifeHero({ label, first, second, copy, media = homepageMedia.beyond[1] }: { label: string; first: string; second?: string; copy: string; media?: typeof homepageMedia.community }) {
  return <section className="club-life-hero container">
    <div className="club-life-title"><p className="eyebrow">WESTERN ROOS / {label}</p><h1>{first}{second && <><br /><span>{second}</span></>}</h1><p className="intro">{copy}</p></div>
    <MediaArea media={{ ...media, preload: true, sizes: "(max-width: 700px) 100vw, 50vw" }} />
  </section>;
}
export async function EventsPage() {
  const records=await publicContent(),managed=records.filter(r=>r.kind==='event').map(r=>clubEvent(r,records));
  return <><ClubLifeHero label="CLUB LIFE" first="MORE THAN" second="GAME DAY." copy="Softball, development, community and club events across the Western Roos family." />
    <section className="container life-section"><div className="life-section-heading"><h2>UPCOMING & UPDATES</h2><p>On the diamond. Around the club.</p></div><EventsBrowser events={[...managed.filter(e=>e.status!=='completed'),...upcomingEvents()]} /><p className="team-actions"><Link className="text-link" href="/join?pathway=volunteering#enquiry">Get involved / Volunteer with us ↗</Link></p></section></>;
}
export function EventPage({ event }: { event: ClubEvent }) {
  const club = event.club === "western-roos" ? parentBrand : clubs.find(club => club.slug === event.club);
  return <article className="container life-section event-detail">
    <Link className="text-link" href="/events">← All events</Link><p className="eyebrow">{event.category} / {event.status}</p><h1>{event.title}</h1><p className="intro">{event.summary}</p>
    {event.image?.src && <MediaArea media={event.image} />}
    <div className="event-detail-grid"><div>{event.description.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
    <aside><h2>EVENT DETAILS</h2><dl><dt>Date</dt><dd><EventDate event={event} /></dd><dt>Time</dt><dd>{event.startTime ?? "Time to be confirmed"}{event.endTime ? ` – ${event.endTime}` : ""}</dd><dt>Venue</dt><dd>{event.venue ?? "Venue to be confirmed"}{event.address && <p>{event.address}</p>}</dd>{club && <><dt>Organisation / pathway</dt><dd><Link className="text-link" href={event.club === "western-roos" ? "/about" : `/clubs/${event.club}`}>{club.name} ↗</Link></dd></>}</dl>
    <h3>REGISTRATION</h3>
    {event.status === "cancelled" ? <p>This event has been cancelled.</p> : event.status === "postponed" ? <p>Registration updates will follow once the event is rescheduled.</p> : event.status === "completed" ? <p>This event has finished.</p> : event.registrationStatus === "open" && event.registrationUrl ? <a className="text-link" href={event.registrationUrl}>Register for this event ↗</a> : event.registrationStatus === "closed" ? <p>Registration is closed.</p> : event.registrationStatus === "not-required" ? <p>No registration required.</p> : <p>REGISTRATION DETAILS COMING SOON</p>}
    {event.contactUrl && <p><a className="text-link" href={event.contactUrl}>{event.contactLabel ?? "Contact about this event"} ↗</a></p>}</aside></div>
  </article>;
}

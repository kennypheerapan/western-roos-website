import Link from "next/link";
import { MediaArea, SectionHeading } from "@/components/ui";
import { homepageMedia } from "@/config/media";
import { upcomingEvents,type ClubEvent } from "@/data/events";
import { EventEmptyState, EventRows } from "@/components/events/shared";
export function BeyondSection({confirmedEvents}:{confirmedEvents?:ClubEvent[]}) {
  const events = upcomingEvents(confirmedEvents).slice(0, 3);
  return <section className="section club-life-home"><div className="container">
    <SectionHeading eyebrow="BEYOND THE DIAMOND" title="WHAT'S HAPPENING AROUND THE CLUB." href="/events" link="VIEW ALL EVENTS" />
    {events.length ? <EventRows events={events} /> : <div className="club-life-empty"><MediaArea media={homepageMedia.beyond[1]} /><EventEmptyState /></div>}
    <div className="life-links"><Link href="/play" className="text-link">Play & development ↗</Link><Link href="/community" className="text-link">Our community ↗</Link></div>
  </div></section>;
}

import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { ClubEvent } from "@/data/events";
export function EventEmptyState({ filtered = false }: { filtered?: boolean }) {
  return <div className="event-empty">
    <span className="eyebrow">{filtered ? "STAY IN THE LOOP" : "ON THE HORIZON"}</span>
    <h3>{filtered ? <>NO EVENTS IN<br />THIS CATEGORY YET.</> : <>THE NEXT EVENT<br />IS TAKING SHAPE.</>}</h3>
    <p>{filtered ? "Try another category or view all events." : "There are currently no confirmed upcoming events. Club events and activities will appear here as details are confirmed."}</p>
  </div>;
}
export function EventDate({ event }: { event: ClubEvent }) {
  return <>{event.startDate ? formatDate(event.startDate) : "Date to be confirmed"}{event.endDate && event.endDate !== event.startDate ? ` – ${formatDate(event.endDate)}` : ""}</>;
}
export function EventRows({ events }: { events: readonly ClubEvent[] }) {
  return <div className="event-rows">{events.map(event => <article className="event-row" key={event.id}>
    <div><span className="eyebrow">{event.category}</span><p><EventDate event={event} /></p></div>
    <div><h3><Link href={`/events/${event.slug}`}>{event.shortTitle ?? event.title} <span aria-hidden="true">↗</span></Link></h3><p>{event.summary}</p></div>
  </article>)}</div>;
}

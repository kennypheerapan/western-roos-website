"use client";
import { useSyncExternalStore } from "react";
import { eventFilters, filterEvents, type ClubEvent, type EventFilter } from "@/data/events";
import { EventEmptyState, EventRows } from "./shared";

const filters = Object.keys(eventFilters) as EventFilter[];
const filterId = (filter: EventFilter) => `category-${filter.toLowerCase()}`;
function readFilter(): EventFilter {
  return filters.find(filter => `#${filterId(filter)}` === window.location.hash) ?? "All";
}
function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}
// The server and first hydration render always agree. URL state is read after hydration.
const serverFilter = (): EventFilter => "All";
export function EventsBrowser({ events }: { events: ClubEvent[] }) {
  const filter = useSyncExternalStore(subscribe, readFilter, serverFilter);
  const visible = filterEvents(events, filter);
  function selectFilter(label: EventFilter) {
    window.history.replaceState(window.history.state, "", `#${filterId(label)}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
  return <>
    <div className="event-filters" role="group" aria-label="Event categories">
      {filters.map(label => <button key={label} id={filterId(label)} aria-pressed={filter === label} aria-controls="event-results" onClick={() => selectFilter(label)}>{label}</button>)}
    </div>
    <p className="event-count" role="status" aria-atomic="true">{visible.length} confirmed events and updates · {filter}</p>
    <div id="event-results">
      {visible.length ? <EventRows events={visible} /> : <EventEmptyState filtered={events.length > 0 && filter !== "All"} />}
    </div>
  </>;
}

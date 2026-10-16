import type { Media } from "@/types";
export const eventCategories = ["SOFTBALL", "TOURNAMENT", "JUNIOR", "DEVELOPMENT", "COACHING", "COMMUNITY", "SOCIAL", "CHARITY", "FUNDRAISING", "POKER", "PRESENTATION", "OTHER"] as const;
export type EventCategory = typeof eventCategories[number];
export interface ClubEvent {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  category: EventCategory;
  summary: string;
  description: string[];
  /** Local calendar dates YYYY-MM-DD; times are venue-local display values. */
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  address?: string;
  club?: "western-roos" | "united" | "west-coast-marlins";
  image?: Media;
  status: "upcoming" | "postponed" | "cancelled" | "completed";
  featured?: boolean;
  registrationStatus: "pending" | "open" | "closed" | "not-required";
  registrationUrl?: string;
  contactLabel?: string;
  contactUrl?: string;
}
// Confirmed records only. No sample events are published.
export const events: ClubEvent[] = [];
export const eventFilters = {
  All: eventCategories,
  Softball: ["SOFTBALL", "TOURNAMENT"],
  Development: ["JUNIOR", "DEVELOPMENT", "COACHING"],
  Community: ["COMMUNITY"],
  Social: ["SOCIAL", "PRESENTATION"],
  Charity: ["CHARITY", "FUNDRAISING"],
  Poker: ["POKER"],
} satisfies Record<string, readonly EventCategory[]>;
export type EventFilter = keyof typeof eventFilters;
export function filterEvents(records: readonly ClubEvent[], filter: EventFilter) {
  const categories: readonly EventCategory[] = eventFilters[filter];
  return records.filter(event => categories.includes(event.category));
}
/** Explicit editorial status drives selection; no browser clock or inferred dates. */
export function upcomingEvents(records: readonly ClubEvent[] = events) {
  return records.filter(event => event.status === "upcoming")
    .sort((a, b) => (a.startDate ?? "9999").localeCompare(b.startDate ?? "9999") || (a.startTime ?? "").localeCompare(b.startTime ?? "") || a.slug.localeCompare(b.slug));
}
export function getEvent(slug: string) { return events.find(event => event.slug === slug); }

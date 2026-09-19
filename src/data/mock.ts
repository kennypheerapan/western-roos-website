import type { Fixture, Media } from "@/types";
import { homepageMedia } from "@/config/media";
// BUILD 01 DEMO DATA ONLY. These are not official dates, results or announcements.
export const mockFixtures: Fixture[] = [
  {
    id: "demo-01",
    home: "Western Roos",
    away: "Opponent A",
    date: "2026-10-17",
    time: "14:00",
    venue: "Venue to be confirmed",
    competition: "Demo tournament",
    status: "Upcoming",
    brandId: "western-roos",
  },
  {
    id: "demo-02",
    home: "United",
    away: "Opponent B",
    date: "2026-10-18",
    time: "10:30",
    venue: "Venue to be confirmed",
    competition: "Demo tournament",
    status: "Upcoming",
    brandId: "united",
  },
];
export const mockResults: Fixture[] = [
  {
    id: "demo-03",
    home: "Western Roos",
    away: "Opponent A",
    date: "2026-09-12",
    time: "14:00",
    venue: "Demo venue",
    competition: "Demo tournament",
    status: "Final",
    homeScore: 8,
    awayScore: 4,
    brandId: "western-roos",
  },
  {
    id: "demo-04",
    home: "United",
    away: "Opponent B",
    date: "2026-09-12",
    time: "11:00",
    venue: "Demo venue",
    competition: "Demo tournament",
    status: "Final",
    homeScore: 6,
    awayScore: 2,
    brandId: "united",
  },
  {
    id: "demo-05",
    home: "Western Roos",
    away: "Opponent C",
    date: "2026-09-11",
    time: "15:00",
    venue: "Demo venue",
    competition: "Demo tournament",
    status: "Final",
    homeScore: 3,
    awayScore: 5,
    brandId: "western-roos",
  },
];
export const mockTournament = {
  name: "A weekend on the diamond.",
  date: "17–18 October 2026",
  teams: 8,
  games: 24,
  description: "Tournament details, all in one place.",
  label: "Demo tournament — sample dates and format",
};
export const mockNews = [
  {
    slug: "on-the-diamond",
    category: "The game",
    title: "Every inning. Every play. Together.",
    description:
      "A space for the moments and stories that bring our softball community together.",
    date: null,
    media: homepageMedia.news[0],
  },
  {
    slug: "meet-our-clubs",
    category: "Our clubs",
    title: "One community. More than one club.",
    description: "Get to know the clubs under Western Roos.",
    date: null,
    media: homepageMedia.news[1],
  },
  {
    slug: "behind-the-scenes",
    category: "Club life",
    title: "Beyond the diamond.",
    description: "A place for future stories about the people behind the game.",
    date: null,
    media: homepageMedia.news[2],
  },
];
export const gallery: Media[] = homepageMedia.gallery;
export const sponsors: { name: string; logo: string | null }[] = Array.from(
  { length: 4 },
  (_, i) => ({
    name: `Sponsor space ${String(i + 1).padStart(2, "0")}`,
    logo: null,
  }),
);

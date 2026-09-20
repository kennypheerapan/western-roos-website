import type { Media } from "@/types";
import { homepageMedia } from "@/config/media";
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

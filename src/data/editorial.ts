import { homepageMedia } from "@/config/media";
import type { Media } from "@/types";
export type ClubAssociation = "western-roos" | "united" | "west-coast-marlins";
export const associationLabels = { "western-roos": "Western Roos", united: "United", "west-coast-marlins": "Marlins Masters" };
export const newsCategories = [{ id: "club", label: "Club" }, { id: "competition", label: "Competition" }, { id: "community", label: "Community" }, { id: "events", label: "Events" }, { id: "development", label: "Development" }];
export type NewsStory = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    homepageCategory?: string;
    publishDate: string | null;
    media: Media;
    clubs: ClubAssociation[];
    featured: boolean;
    status: "preview" | "published";
    body: {
        heading?: string;
        text: string;
    }[];
};
export const news: NewsStory[] = [
    { id: "diamond-preview", slug: "on-the-diamond", title: "Every inning. Every play. Together.", excerpt: "A space for the moments and stories that bring our softball community together.", category: "competition", homepageCategory: "The game", publishDate: null, media: homepageMedia.news[0], clubs: ["united"], featured: true, status: "preview", body: [] },
    { id: "clubs-preview", slug: "meet-our-clubs", title: "One community. Two pathways.", excerpt: "Meet United, the community club, and West Coast Marlins, the Masters representative program of WRTSC.", category: "community", homepageCategory: "Our pathways", publishDate: null, media: homepageMedia.news[1], clubs: ["western-roos"], featured: false, status: "preview", body: [] },
    { id: "life-preview", slug: "behind-the-scenes", title: "Beyond the diamond.", excerpt: "A place for future stories about the people behind the game.", category: "club", homepageCategory: "Club life", publishDate: null, media: homepageMedia.news[2], clubs: ["united"], featured: false, status: "preview", body: [] }
];
export function getNews() { return [...news].sort((a, b) => (b.publishDate ?? "").localeCompare(a.publishDate ?? "")); }
export function getStory(slug: string) { return news.find(s => s.slug === slug); }
export function categoryLabel(id: string) { return newsCategories.find(c => c.id === id)?.label ?? id; }
export function displayDate(date: string) { return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(date)); }
export const galleryCategories = [{ id: "diamond", label: "On the diamond" }, { id: "teams", label: "Teams" }, { id: "community", label: "Community" }, { id: "events", label: "Events" }, { id: "achievements", label: "Achievements" }];
export type GalleryItem = {
    id: string;
    media: Media;
    original: string;
    category: string;
    club: ClubAssociation;
    event: string | null;
    date: string | null;
    featured: boolean;
};
function photo(media: Media, category: string, featured = false): GalleryItem { const id = media.src!.split("/").pop()!.replace(".webp", ""); return { id, media, original: "/images/club/united/" + id.toUpperCase().replace("-", "_") + ".jpeg", category, club: "united", event: null, date: null, featured }; }
export const galleryItems: GalleryItem[] = [...homepageMedia.gallery.map((m, i) => photo(m, ["diamond", "teams", "teams", "achievements"][i], true)), photo(homepageMedia.join, "teams"), photo(homepageMedia.community, "community"), photo(homepageMedia.news[1], "community"), photo(homepageMedia.news[2], "events"), photo(homepageMedia.news[0], "achievements"), photo(homepageMedia.beyond[0], "diamond"), photo(homepageMedia.beyond[1], "events")];

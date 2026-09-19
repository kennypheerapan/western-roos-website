import type { Brand, Club } from "@/types";
// Original supplied artwork, copied unchanged. Compact variants fall back to the full logo.
export const parentBrand: Brand = {
  name: "Western Roos Tournament Softball Club",
  shortName: "Western Roos",
  primary: "#091323",
  accent: "#b8e64b",
  logo: "/brands/western-roos/western-roos.png",
  compactLogo: null,
};
export const clubs: Club[] = [
  {
    slug: "united",
    parentLabel: "Part of the Western Roos family",
    background: "#101b30",
    tagline: "Your game. Our United.",
    photographyAvailable: true,
    editorialSecondary: "#a51f2b",
    name: "United Softball Club",
    shortName: "United",
    primary: "#101b30",
    accent: "#e53d48",
    logo: "/brands/united/united-full.png",
    compactLogo: "/brands/united/usc-monogram.jpeg",
    description:
      "Pathways for new, returning, social and competitive softball players.",
    focus: "Participation · Development · Family · Support",
    pathways: ["New players", "Player development", "Competition"],
  },
  {
    slug: "west-coast-marlins",
    parentLabel: "Part of the Western Roos family",
    background: "#061a3b",
    tagline: "The game stays with you.",
    photographyAvailable: false,
    name: "West Coast Marlins Masters Softball Club",
    shortName: "Marlins",
    primary: "#061a3b",
    secondary: "#084ba8",
    accent: "#ffc400",
    foreground: "#ffffff",
    accentForeground: "#061a3b",
    logo: "/brands/west-coast-marlins/west-coast-marlins.png",
    compactLogo: null,
    description:
      "Competitive and social softball opportunities for masters players.",
    focus: "Masters softball · Competition · Community",
    pathways: [
      "League participation",
      "Masters tournaments",
      "Representative opportunities",
    ],
  },
];
export const brands: Record<string, Brand> = {
  "western-roos": parentBrand,
  ...Object.fromEntries(clubs.map((club) => [club.slug, club])),
};
export const contact = { email: null, socials: [] };



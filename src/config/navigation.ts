export type NavigationItem = { label: string; href: string } | { label: string; children: { label: string; href: string }[] };
export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Pathways", href: "/clubs" },
  { label: "Teams", href: "/teams" },
  { label: "Competition", children: [
    { label: "Competition centre", href: "/competition" },
    { label: "Tournaments", href: "/tournaments" },
    { label: "Fixtures & results", href: "/fixtures" },
    { label: "Training", href: "/training" },
    { label: "Player profiles", href: "/players" },
  ] },
  { label: "Club life", children: [
    { label: "Events", href: "/events" },
    { label: "Play & Development", href: "/play" },
    { label: "Community", href: "/community" },
    { label: "Charity & fundraising", href: "/events#category-charity" },
    { label: "Poker events", href: "/events#category-poker" },
    { label: "Merchandise", href: "/shop" },
    { label: "Sponsors", href: "/sponsors" },
    { label: "Policies & documents", href: "/documents" },
    { label: "Official links", href: "/resources" },
  ] },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
];

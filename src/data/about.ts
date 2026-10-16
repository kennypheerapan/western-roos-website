export type ClubIdentity = "western-roos" | "united" | "west-coast-marlins";
export type ContactChannel = { label: string; href: string };
export type LeadershipEntry = {
  id: string;
  role: string;
  name: string;
  club: ClubIdentity;
  photo?: { src: string; alt: string };
  bio?: string;
  contact?: ContactChannel;
};
export const documentCategories = ["Constitution", "Policies", "Codes of conduct", "Club documents", "Forms"] as const;
export type ClubDocument = {
  id: string;
  title: string;
  category: (typeof documentCategories)[number];
  description: string;
  /** A confirmed local file path or official URL. Never a placeholder download. */
  url: string;
  publishedDate: string;
  updatedDate?: string;
};
// Only confirmed official records belong here. Empty collections render pending states.
export const leadership: readonly LeadershipEntry[] = [
  { id: "president", role: "President", name: "Anthony Bell", club: "western-roos", bio: "Provides leadership and strategic direction for WRTSC, including governance, club development, stakeholder engagement, partnerships and long-term planning." },
  { id: "vice-president", role: "Vice President", name: "Gus Smith", club: "western-roos", bio: "Supports the President and Committee in delivering club objectives, competition participation, member engagement and development activities." },
  { id: "secretary", role: "Secretary", name: "Martin Carroll", club: "western-roos", bio: "Coordinates committee administration, meetings, minutes, correspondence, records and governance documentation." },
  { id: "treasurer", role: "Treasurer", name: "Gavin Varis", club: "western-roos", bio: "Oversees budgeting, financial reporting, income, expenditure and organisational financial accountability." },
  { id: "kenny", role: "General Committee", name: "Kenny", club: "western-roos", bio: "Supports club operations, events, volunteers and member activities." },
  { id: "tristan", role: "General Committee", name: "Tristan", club: "western-roos", bio: "Contributes to competition planning, player development and club operations." },
  { id: "bevan", role: "General Committee", name: "Bevan", club: "western-roos", bio: "Supports governance, member engagement and club development projects." },
  { id: "sam", role: "General Committee", name: "Sam", club: "western-roos", bio: "Assists with tournaments, events, fundraising and member participation activities." },
];
export const values = [
  { title: "Unity", copy: "We stand together as one club community." },
  { title: "Respect", copy: "We treat players, officials, volunteers, supporters and opponents with dignity." },
  { title: "Culture", copy: "We recognise and celebrate the stories, identities and cultural connections that strengthen our organisation." },
  { title: "Inclusion", copy: "We work to provide a welcoming environment where people can participate and belong." },
  { title: "Integrity", copy: "We act honestly, responsibly and in the best interests of our members." },
  { title: "Excellence", copy: "We encourage continuous improvement on and off the field." },
] as const;
export const responsibilities = [
  "Governance and strategic planning", "Club and program administration", "Financial management",
  "Membership management", "Competition coordination", "Representative team management",
  "Sponsorship and partnerships", "Volunteer development", "Cultural inclusion and community engagement",
  "Long-term sustainability and growth",
] as const;
export const documents: readonly ClubDocument[] = [];
export const officialContacts: readonly ContactChannel[] = [];
export const enquiryPath = "/contact?topic=general#enquiry";
// Editorial organising themes, not official constitutional statements.
export const aboutThemes = [
  { title: "Participation", copy: "Find your place in the game. Explore pathways for new and returning players.", href: "/join", link: "Find your pathway" },
  { title: "Development", copy: "Room to learn. Room to grow. Explore the club’s play and development direction.", href: "/play", link: "Play & development" },
  { title: "Competition", copy: "Follow the game across the club family, from tournament information to fixtures and results.", href: "/fixtures", link: "Fixtures & results" },
  { title: "Community", copy: "The connections around the diamond. Discover the community side of club life.", href: "/community", link: "Our community" },
] as const;

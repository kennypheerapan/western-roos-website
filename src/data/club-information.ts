import type { ClubIdentity, ContactChannel } from "./about";
export type InformationKey = "contact" | "training" | "locations" | "competition" | "membership" | "pathways" | "social";
export type ClubInformation = Partial<Record<InformationKey, { text: string; links?: readonly ContactChannel[] }>>;
export const informationFields: readonly { key: InformationKey; label: string; pending: string }[] = [
  { key: "contact", label: "Contact", pending: "Official contact details are being confirmed." },
  { key: "training", label: "Training information", pending: "Official training details are being confirmed." },
  { key: "locations", label: "Playing locations", pending: "Official playing locations are being confirmed." },
  { key: "competition", label: "Competition information", pending: "Official competition details are being confirmed." },
  { key: "membership", label: "Membership information", pending: "Membership fees and registration dates are being confirmed." },
  { key: "pathways", label: "Age / player pathways", pending: "Age eligibility and player pathway details are being confirmed." },
  { key: "social", label: "Social links", pending: "Official social channels are being confirmed." },
];
// Add only supplied, confirmed details. Editorial previews are not official records.
export const clubInformation: Record<ClubIdentity, ClubInformation> = {
  "western-roos": {
    competition: { text: "WRTSC provides governance, administration and development supporting United’s community / PSL pathway and the West Coast Marlins Masters representative program. Additional opportunities may include regional and invitational tournaments, state and national events, and coaching, umpiring and volunteer development." },
    pathways: { text: "WRTSC welcomes new and returning players, Masters athletes, coaches, umpires, volunteers and supporters. Exact eligibility remains pending." },
  },
  united: {
    competition: { text: "Perth Softball League (PSL) is the primary competition pathway for United Softball Club, the community participation club of WRTSC. Fixtures and season details remain pending." },
    pathways: { text: "New, returning, social and competitive players, player development and family involvement. United welcomes varying ages, skill levels and experience; exact eligibility remains pending." },
  },
  "west-coast-marlins": {
    competition: { text: "West Coast Marlins is the Masters representative team program of WRTSC. Opportunities include Masters tournaments, interstate events, state and national championships and invitational representative competitions. Confirmed event entries remain pending." },
    pathways: { text: "Representative opportunities for eligible Masters players. Exact eligibility and selection arrangements remain pending." },
  },
};

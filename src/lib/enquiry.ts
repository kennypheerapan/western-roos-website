export const interests = [
  ["new-player", "New to softball"], ["returning", "Returning to softball"],
  ["social", "Social softball"], ["competitive", "Competitive softball"],
  ["masters", "Masters softball"], ["development", "Junior / development"],
  ["volunteering", "Volunteering"], ["coaching", "Coaching"],
  ["officials", "Officials / support roles"], ["sponsorship", "Sponsorship / partnerships"], ["other", "Other"],
] as const;
export type Interest = typeof interests[number][0];
export type PreferredClub = "" | "western-roos" | "united" | "marlin-masters";
export const enquiryTopics = [["join", "Join / membership"], ["competition", "Competition"], ["tournaments", "Tournaments"], ["events", "Club life & events"], ["general", "General enquiry"]] as const;
export type EnquiryTopic = typeof enquiryTopics[number][0];
export function contactHref(club?: string, topic: EnquiryTopic = "general", pathway?: string) {
  const params = new URLSearchParams({ topic });
  if (clubQuery(club)) params.set("club", clubQuery(club));
  if (pathway) params.set("pathway", pathway);
  return `/contact?${params}#enquiry`;
}
export function parseContactContext(params: { get(name: string): string | null }) {
  return { ...parseJoinContext(params), topic: enquiryTopics.find(([id]) => id === params.get("topic"))?.[0] ?? "general" };
}
export const pathways = [
  { id: "new-player", title: "New to softball", copy: "A first step onto the diamond.", clubs: ["united"] },
  { id: "returning", title: "Returning to the game", copy: "Pick up where your love of the game began.", clubs: ["united"] },
  { id: "social", title: "Social softball", copy: "The game. The people. The connection.", clubs: ["united"] },
  { id: "competitive", title: "Competitive softball", copy: "Explore United’s competitive club pathway.", clubs: ["united"] },
  { id: "masters", title: "Masters softball", copy: "More game. Same spirit.", clubs: ["west-coast-marlins"] },
  { id: "development", title: "Junior / development", copy: "Future pathway · official details pending.", clubs: ["united"] },
  { id: "not-sure", title: "I'm not sure", copy: "Start with what you enjoy. We'll take it from there.", clubs: [] },
] as const;
export function clubQuery(slug?: string): PreferredClub {
  return slug === "western-roos" ? "western-roos" : slug === "united" ? "united" : ["west-coast-marlins", "marlin-masters"].includes(slug ?? "") ? "marlin-masters" : "";
}
export function joinHref(club?: string, pathway?: string) {
  const params = new URLSearchParams();
  if (clubQuery(club)) params.set("club", clubQuery(club));
  if (pathway) params.set("pathway", pathway === "new" ? "new-player" : pathway);
  return `/join${params.size ? `?${params}` : ""}`;
}
export function parseJoinContext(params: { get(name: string): string | null }) {
  const value = params.get("pathway");
  const pathway = pathways.some(p => p.id === value) || interests.some(p => p[0] === value) ? value! : "";
  return { club: clubQuery(params.get("club") ?? undefined), pathway, interest: (interests.find(p => p[0] === pathway)?.[0] ?? "other") as Interest };
}
export type Enquiry = { name: string; email: string; phone: string; interest: Interest; club: PreferredClub; topic?: EnquiryTopic; message: string; consent: boolean };
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;
export function validateEnquiry(value: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!value.name.trim() || value.name.length > 100) errors.name = "Enter your name (up to 100 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()) || value.email.length > 254) errors.email = "Enter a valid email address, such as name@example.com.";
  if (value.phone && (!/^[+\d\s().-]+$/.test(value.phone) || value.phone.replace(/\D/g, "").length < 6 || value.phone.length > 40)) errors.phone = "Enter a phone number with at least six digits, or leave it blank.";
  if (!interests.some(([id]) => id === value.interest)) errors.interest = "Choose an area of interest.";
  if (!["", "western-roos", "united", "marlin-masters"].includes(value.club)) errors.club = "Choose a organisation or pathway or Not sure.";
  if (value.topic !== undefined && !enquiryTopics.some(([id]) => id === value.topic)) errors.topic = "Choose an enquiry type.";
  if (!value.message.trim() || value.message.length > 3000) errors.message = "Tell us what you're looking for (up to 3,000 characters).";
  if (!value.consent) errors.consent = "Please acknowledge the enquiry notice.";
  return errors;
}
export const enquiryPendingMessage = "Online enquiries are being prepared. Official contact details will be available here soon.";
// Replace this boundary with an approved transport in a future build. No data leaves the browser.
export type EnquirySubmission = { status: "unavailable"; message: string };
export async function submitEnquiry(value: Enquiry): Promise<EnquirySubmission> {
  if (Object.keys(validateEnquiry(value)).length) throw new Error("Enquiry validation is required before submission.");
  return { status: "unavailable", message: "Your details pass the preview checks. Nothing has been sent or saved. " + enquiryPendingMessage };
}

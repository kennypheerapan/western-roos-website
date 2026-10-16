import { experienceOptions, type ApplicationDraft, type ParticipationDetails, type ParticipationPathway } from "./domain";

export const membershipPathways = [
  { id: "united", title: "Join United", copy: "Community softball / PSL pathway. New and returning players, coaches, umpires and volunteers." },
  { id: "marlins", title: "West Coast Marlins", copy: "Enquiry / expression of interest in WRTSC’s Masters Representative Program." },
  { id: "not-sure", title: "I'm not sure", copy: "Explore your options with WRTSC. No pathway preference or experience needed." },
] as const;
export function participationFor(pathway: ParticipationPathway | ""): ParticipationDetails {
  if (pathway === "united") return { pathway, involvement: "", preference: "", experience: "" };
  if (pathway === "marlins") return { pathway, representativeInterest: "", tournamentInterest: "", experience: "" };
  return { pathway, guidance: "" };
}
export function initialApplication(pathway: ParticipationPathway | "", interest = ""): ApplicationDraft {
  const experience: ApplicationDraft["experience"] = interest === "new-player" ? ["New to softball"] : interest === "returning" ? ["Returning player"] : interest === "masters" ? ["Masters player"] : interest === "coaching" ? ["Coach"] : interest === "volunteering" ? ["Volunteer"] : [];
  return { participation: participationFor(pathway), firstName: "", lastName: "", dateOfBirth: "", email: "", phone: "", experience, emergencyName: "", emergencyRelationship: "", emergencyPhone: "", notes: "", previewAcknowledgement: false };
}
export function pathwayFromContext(params: { get(name: string): string | null }): ParticipationPathway | "" {
  const club = params.get("club"), pathway = params.get("pathway");
  if (pathway === "not-sure") return "not-sure";
  if (club === "united") return "united";
  if (["marlin-masters", "west-coast-marlins", "marlins"].includes(club ?? "")) return "marlins";
  if (["marlins", "masters"].includes(pathway ?? "")) return "marlins";
  if (["united", "new-player", "new", "returning", "social", "competitive", "development"].includes(pathway ?? "")) return "united";
  if (club === "western-roos" || ["volunteering", "coaching", "officials", "sponsorship", "other"].includes(pathway ?? "")) return "not-sure";
  return "";
}
export const stepNames = ["Your pathway", "About you", "Softball experience", "Participation details", "Emergency contact", "Additional information", "Review"] as const;
export type Field = keyof ApplicationDraft | "pathway" | "involvement" | "preference" | "representativeInterest" | "tournamentInterest" | "previousExperience" | "guidance";
export type ApplicationErrors = Partial<Record<Field, string>>;
export const fieldStep: Record<Field, number> = { participation: 0, pathway: 0, firstName: 1, lastName: 1, dateOfBirth: 1, email: 1, phone: 1, experience: 2, involvement: 3, preference: 3, representativeInterest: 3, tournamentInterest: 3, previousExperience: 3, guidance: 3, emergencyName: 4, emergencyRelationship: 4, emergencyPhone: 4, notes: 5, previewAcknowledgement: 6 };
// Same explicit field-error architecture as the existing enquiry validator.
export function validateApplication(value: ApplicationDraft, step?: number): ApplicationErrors {
  const errors: ApplicationErrors = {};
  const requiredText = (key: "firstName" | "lastName" | "emergencyName" | "emergencyRelationship", label: string) => { if (!value[key].trim() || value[key].length > 100) errors[key] = `Enter ${label} (up to 100 characters).`; };
  if (!membershipPathways.some(p => p.id === value.participation.pathway)) errors.pathway = "Choose United, West Coast Marlins or I'm not sure.";
  requiredText("firstName", "your first name"); requiredText("lastName", "your last name");
  const date = value.dateOfBirth, parsed = new Date(`${date}T12:00:00Z`);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date || date > today || date.startsWith("0000")) errors.dateOfBirth = "Enter a valid date of birth that is not in the future.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()) || value.email.length > 254) errors.email = "Enter a valid email address, such as name@example.com.";
  for (const key of ["phone", "emergencyPhone"] as const) {
    const phone = value[key].trim(), digits = phone.replace(/\D/g, "").length;
    if (!/^\+?[\d\s().-]+$/.test(phone) || digits < 6 || digits > 15 || phone.length > 40) errors[key] = "Enter a phone number with 6–15 digits; spaces, +, brackets and dashes are accepted.";
  }
  if (!value.experience.length || value.experience.some(v => !experienceOptions.includes(v))) errors.experience = "Choose at least one experience or role, including Other if needed.";
  const p = value.participation;
  if (p.pathway === "united") {
    if (!["player", "non-player", "both"].includes(p.involvement)) errors.involvement = "Choose player, non-player or both.";
    if (!["social", "competitive", "support", "not-sure"].includes(p.preference)) errors.preference = "Choose a preferred participation type.";
  }
  if (p.pathway === "marlins") {
    if (!["playing", "support", "explore"].includes(p.representativeInterest)) errors.representativeInterest = "Choose your Masters representative interest.";
    if (p.tournamentInterest.length > 1500) errors.tournamentInterest = "Keep tournament interests to 1,500 characters.";
  }
  if ("experience" in p && p.experience.length > 1500) errors.previousExperience = "Keep previous experience to 1,500 characters.";
  if ("guidance" in p && p.guidance.length > 1500) errors.guidance = "Keep your interests to 1,500 characters.";
  requiredText("emergencyName", "an emergency contact name"); requiredText("emergencyRelationship", "their relationship to you");
  if (value.notes.length > 3000) errors.notes = "Keep additional information to 3,000 characters.";
  if (value.previewAcknowledgement !== true) errors.previewAcknowledgement = "Acknowledge the submission notice and pending policy wording before submitting.";
  return Object.fromEntries(Object.entries(errors).filter(([key]) => step === undefined || fieldStep[key as Field] === step));
}
export type ApplicationSubmissionResult =
  | { status: "validation_failed"; errors: ApplicationErrors }
  | { status: "preview_validated"; persisted: false; message: string }
  | { status: "submitted"; persisted: true; applicationId: string; submittedAt: string };
export interface ApplicationSubmissionPort { submit(value: ApplicationDraft): Promise<ApplicationSubmissionResult> }
export const previewSubmission: ApplicationSubmissionPort = {
  async submit(value) {
    const errors = validateApplication(value);
    if (Object.keys(errors).length) return { status: "validation_failed", errors };
    return { status: "preview_validated", persisted: false, message: "Form validation successful. Nothing has been sent or saved. WRTSC has not received an application or expression of interest. Online submission is not available yet." };
  },
};

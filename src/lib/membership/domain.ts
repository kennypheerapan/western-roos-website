/** Provider-neutral IDs. Accounts/customers can exist independently of membership. */
export type PartyId = string;
export interface AccountIdentity { partyId: PartyId; provider: string; subject: string }
export type ParticipationPathway = "united" | "marlins" | "not-sure";
export type ApplicationStatus = "draft" | "submitted" | "under_review" | "approved" | "declined" | "withdrawn";
export type PaymentStatus = "not_required" | "pending" | "paid" | "failed" | "refunded";
export interface EmergencyContact { name: string; relationship: string; phone: string }
export interface MemberProfile {
  id: string; partyId: PartyId; firstName: string; lastName: string;
  dateOfBirth: string; email: string; phone: string; emergencyContact: EmergencyContact;
  createdAt: string; updatedAt: string;
}
export interface MembershipSeason {
  id: string; label: string; startsOn: string; endsOn: string;
  registrationOpensAt: string | null; registrationClosesAt: string | null;
  publication: "pending" | "confirmed";
}
export interface MembershipType { id: string; label: string; pathway: Exclude<ParticipationPathway, "not-sure">; active: boolean }
export interface MembershipFee { id: string; membershipTypeId: string; seasonId: string; amountMinor: number; currency: "AUD" }
export interface MembershipPayment { id: string; membershipId: string; feeId: string | null; amountMinor: number | null; currency: "AUD"; status: PaymentStatus; externalReference: string | null }
export interface MembershipRecord {
  id: string; memberProfileId: string; applicationId: string; seasonId: string; membershipTypeId: string;
  pathway: Exclude<ParticipationPathway, "not-sure">; renewedFromId: string | null;
  status: "active" | "expired" | "cancelled"; createdAt: string;
}
export interface InternalApplicationNote { id: string; applicationId: string; authorAccountId: string; text: string; createdAt: string }
export interface ApplicationAuditEvent { id: string; applicationId: string; actorAccountId: string; from: ApplicationStatus; to: ApplicationStatus; occurredAt: string }
export interface PolicyAcknowledgement { privacyVersion: string; termsVersion: string; acknowledgedAt: string }
export interface MembershipApplication {
  id: string; memberProfileId: string | null; partyId: PartyId | null;
  kind: "new" | "renewal"; renewsMembershipId: string | null;
  details: ApplicationDetails; status: ApplicationStatus; seasonId: string | null;
  assignedPathway: Exclude<ParticipationPathway, "not-sure"> | null; membershipTypeId: string | null;
  policyAcknowledgement: PolicyAcknowledgement | null;
  createdAt: string; updatedAt: string; submittedAt: string | null;
}
export const experienceOptions = ["New to softball", "Returning player", "Current player", "Masters player", "Coach", "Umpire", "Volunteer", "Other"] as const;
export type SoftballExperience = typeof experienceOptions[number];
export type ParticipationDetails =
  | { pathway: "" | "not-sure"; guidance: string }
  | { pathway: "united"; involvement: "" | "player" | "non-player" | "both"; preference: "" | "social" | "competitive" | "support" | "not-sure"; experience: string }
  | { pathway: "marlins"; representativeInterest: "" | "playing" | "support" | "explore"; tournamentInterest: string; experience: string };
export interface ApplicationDraft {
  participation: ParticipationDetails; firstName: string; lastName: string; dateOfBirth: string;
  email: string; phone: string; experience: SoftballExperience[];
  emergencyName: string; emergencyRelationship: string; emergencyPhone: string;
  notes: string; previewAcknowledgement: boolean;
}
/** Persistable details deliberately exclude the preview-only acknowledgement. */
export type ApplicationDetails = Omit<ApplicationDraft, "previewAcknowledgement">;
/** Server-only contracts for a future approved adapter; no implementation or fake records. */
export interface MembershipRepository {
  // Must atomically create the application + audit entry and deduplicate retries.
  submit(details: ApplicationDetails, context: { idempotencyKey: string; seasonId: string; policy: PolicyAcknowledgement }): Promise<{ applicationId: string; submittedAt: string }>;
  findApplication(id: string): Promise<MembershipApplication | null>;
  listForParty(partyId: PartyId): Promise<MembershipApplication[]>;
  searchMembers(query: { term: string; cursor?: string; limit: number }): Promise<{ members: Pick<MemberProfile, "id" | "firstName" | "lastName" | "email">[]; nextCursor: string | null }>;
  review(id: string, change: { status: ApplicationStatus; assignedPathway: MembershipApplication["assignedPathway"]; membershipTypeId: string | null; expectedUpdatedAt: string; actorAccountId: string }): Promise<void>;
  addInternalNote(note: InternalApplicationNote): Promise<void>;
  recordPayment(payment: MembershipPayment, actorAccountId: string): Promise<void>;
  saveMembership(record: MembershipRecord): Promise<void>;
}
export interface MembershipCatalogue { seasons: readonly MembershipSeason[]; types: readonly MembershipType[]; fees: readonly MembershipFee[] }
// No official seasons, prices or types have been provided.
export const membershipCatalogue: MembershipCatalogue = { seasons: [], types: [], fees: [] };

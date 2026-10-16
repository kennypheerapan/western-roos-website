"use client";
import { useSearchParams } from "next/navigation";
import { EnquiryForm } from "@/components/join/form";
import { parseContactContext, type EnquiryTopic, type Interest, type PreferredClub } from "@/lib/enquiry";

export function ContactExperience() {
  const context = parseContactContext(useSearchParams());
  function choose(topic: EnquiryTopic, club: PreferredClub, interest: Interest) {
    const next = new URLSearchParams({ topic });
    if (club) next.set("club", club);
    if (interest !== "other") next.set("pathway", interest);
    window.history.replaceState(null, "", `/contact?${next}#enquiry`);
  }
  return <EnquiryForm interest={context.interest} club={context.club} topic={context.topic}
    onContextChange={(interest, club) => choose(context.topic, club, interest)}
    onTopicChange={topic => choose(topic, context.club, context.interest)} />;
}

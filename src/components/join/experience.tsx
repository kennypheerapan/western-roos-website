"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clubs } from "@/config/brands";
import { BrandMark, clubStyle } from "@/components/ui";
import { contactHref } from "@/lib/enquiry";
import { membershipPathways, pathwayFromContext } from "@/lib/membership/application";
import type { ParticipationPathway } from "@/lib/membership/domain";
import { MembershipForm } from "./membership-form";

export function JoinExperience() {
  const params = useSearchParams();
  const pathway = pathwayFromContext(params);
  const club = pathway === "marlins" ? "marlin-masters" : pathway === "united" ? "united" : "";
  function choose(nextPathway: ParticipationPathway, focus = false) {
    const next = new URLSearchParams({ pathway: nextPathway, step: "0" });
    if (nextPathway !== "not-sure") next.set("club", nextPathway === "marlins" ? "marlin-masters" : "united");
    window.history.pushState(null, "", `/join?${next}${focus ? "#enquiry" : ""}`);
    if (focus) document.getElementById("enquiry-heading")?.focus();
  }
  const matching = clubs.filter(c => pathway === "united" ? c.slug === "united" : pathway === "marlins" ? c.slug === "west-coast-marlins" : pathway !== "not-sure");
  return <>
    <section className="container join-block" id="pathways"><p className="eyebrow">01 / Find your pathway</p><h2>What are you looking for?</h2><p>One organisation. United’s community club and the West Coast Marlins Masters representative program. Choose a starting point below.</p>
      <div className="join-pathways" role="group" aria-label="Choose your pathway">{membershipPathways.map((p, i) => <button key={p.id} type="button" aria-pressed={pathway === p.id} onClick={() => choose(p.id, true)}><span className="eyebrow">0{i + 1}{p.id === "marlins" ? " / Expression of interest" : ""}</span><strong>{p.title}</strong><span>{p.copy}</span><span className="pathway-arrow" aria-hidden="true">↗</span></button>)}</div>
    </section>
    <section className="container join-block join-matches" aria-labelledby="join-match-heading"><p className="eyebrow">02 / Explore your options</p><h2 id="join-match-heading">{pathway === "not-sure" ? "Start with a conversation." : "A pathway to explore."}</h2>
      <p role="status" aria-live="polite">{pathway === "not-sure" ? "No pathway preference needed. Tell us what you're looking for in the application preview." : "Explore your pathway, then prepare your details below. Test submissions can be saved when the backend is connected."}</p>
      {params.get("pathway") === "development" && <p className="enquiry-pending">Junior / development is a future pathway. No junior program, intake or eligibility details have been confirmed.</p>}
      <div className="join-clubs">{matching.map(c => <article key={c.slug} style={clubStyle(c)}><BrandMark brand={c} /><p className="eyebrow">Western Roos family / {c.slug === "united" ? "Community Club" : "Masters Representative Program"}</p><h3>{c.slug === "united" ? "United" : "West Coast Marlins"}</h3><p>{c.description}</p><p className="muted">Fees, registration conditions, eligibility and season dates await official confirmation.</p><div className="team-actions"><button className="button" onClick={() => choose(c.slug === "united" ? "united" : "marlins", true)}>{c.slug === "united" ? "Prepare application" : "Prepare expression of interest"} ↗</button><Link className="text-link" href={`/clubs/${c.slug}`}>Explore this pathway ↗</Link></div></article>)}</div>
    </section>
    <section className="container join-help"><div><p className="eyebrow">Every journey starts somewhere</p><h2>Not sure where you fit?</h2><p>Tell us what you enjoy. WRTSC can help you explore the right pathway once applications open.</p></div><button className="button" onClick={() => choose("not-sure", true)}>Help me find my pathway ↗</button></section>
    <section className="container join-block join-enquiry" id="enquiry"><div><p className="eyebrow">03 / Your next step</p><h2 id="enquiry-heading" tabIndex={-1}>{pathway === "marlins" ? "Your Masters interest." : pathway === "not-sure" ? "Find your place." : "Your next innings."}</h2><p>{pathway === "marlins" ? "Prepare an expression of interest in the West Coast Marlins, WRTSC’s Masters Representative Program." : pathway === "united" ? "Prepare your membership application for United Softball Club, the community / PSL pathway within WRTSC." : "Prepare your details and explore how you would like to be involved with Western Roos Tournament Softball Club."}</p><p>Seven steps. Review everything before submitting your application. This preview does not create a membership or confirm a place in a team or program.</p><p><Link className="text-link" href={contactHref(club, "join", params.get("pathway") ?? undefined)}>Contact Western Roos about joining ↗</Link></p><div className="join-support"><h3>More ways to belong.</h3><p>Volunteer involvement can include committee service, coaching, team management, scoring, umpiring, events, fundraising, sponsorship, communications and general club support.</p></div></div><MembershipForm pathway={pathway} interest={params.get("pathway") ?? ""} choose={choose} /></section>
  </>;
}

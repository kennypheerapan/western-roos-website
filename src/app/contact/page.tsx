import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ContactExperience } from "@/components/contact/experience";
import { PracticalInformation } from "@/components/contact/information";
import { contactHref } from "@/lib/enquiry";
import "./contact.css";

export const metadata: Metadata = { title: "Contact", description: "Joining, club pathways, competitions and life beyond the diamond. Find your enquiry pathway and practical club information." };
const pathways = [
  { label: "Join / membership", copy: "Finding your place, returning to play or taking the next step.", href: contactHref(undefined, "join") },
  { label: "Competition", copy: "Questions about fixtures, results and competition pathways.", href: contactHref(undefined, "competition") },
  { label: "Tournaments", copy: "Tournament information and opportunities to take the field.", href: contactHref(undefined, "tournaments") },
  { label: "Club life & events", copy: "Connecting with the club beyond game day.", href: contactHref(undefined, "events") },
  { label: "United", copy: "Start a conversation about United and its player pathways.", href: contactHref("united") },
  { label: "Marlins Masters", copy: "Ask about the WRTSC Masters representative program.", href: contactHref("marlin-masters") },
  { label: "General enquiry", copy: "Not sure where to start? Begin here.", href: contactHref() },
];
export default function ContactPage() {
  return <div className="contact-experience">
    <section className="container contact-hero"><div><p className="eyebrow">Western Roos / Contact</p><h1>Let&apos;s talk<br /><em>softball.</em></h1></div><div><p className="contact-lead">Your next step.<br />A conversation away.</p><p>Questions about joining, club pathways, competitions, tournaments, events or the Western Roos family? Find your starting point below.</p><div className="enquiry-pending"><span className="eyebrow">Contact information</span><p>Official contact details are being confirmed.</p><p>Online sending is not available yet. The enquiry form is a preview only.</p></div></div></section>
    <section className="container contact-section" aria-labelledby="contact-pathways"><p className="eyebrow">01 / Find your starting point</p><h2 id="contact-pathways">What brings you here?</h2><div className="contact-pathways">{pathways.map((p, i) => <Link key={p.label} href={p.href}><span className="eyebrow">0{i + 1} / Enquiry preview</span><h3>{p.label}</h3><p>{p.copy}</p><span className="contact-arrow" aria-hidden="true">↗</span></Link>)}</div></section>
    <section className="container contact-section contact-enquiry" id="enquiry" aria-labelledby="contact-enquiry-heading"><div><p className="eyebrow">02 / Prepare your enquiry</p><h2 id="contact-enquiry-heading">Start with<br />a little about you.</h2><p>Choose a topic and an organisation or pathway, or select “Not sure”. You can review your details here while official enquiry channels are being prepared.</p><p>Nothing entered here is sent or saved. This is not registration.</p><Link className="text-link" href="/join">Explore joining pathways ↗</Link></div><Suspense fallback={<div className="enquiry-pending"><p>Loading the enquiry preview. Sending is unavailable.</p><noscript>Enable JavaScript to use the form preview. Official contact details are being confirmed.</noscript></div>}><ContactExperience /></Suspense></section>
    <section className="container contact-section" aria-labelledby="practical-heading"><p className="eyebrow">03 / Practical information</p><h2 id="practical-heading">The details that matter.</h2><p className="contact-intro">Confirmed information will be published here as it becomes available. Explore the community club and Masters representative pathways while the practical details are being prepared.</p><div className="contact-clubs">{([
      ["western-roos", "Western Roos", "/about"], ["united", "United", "/clubs/united"], ["west-coast-marlins", "Marlins Masters", "/clubs/west-coast-marlins"],
    ] as const).map(([id, name, href]) => <details key={id}><summary>{name}<span aria-hidden="true">+</span></summary><PracticalInformation club={id} /><Link className="text-link" href={href}>Explore {name} ↗</Link></details>)}</div></section>
  </div>;
}

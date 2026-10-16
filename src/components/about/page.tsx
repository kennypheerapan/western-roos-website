import Link from "next/link";
import { clubs, parentBrand } from "@/config/brands";
import { homepageMedia } from "@/config/media";
import { Arrow, BrandMark, Button, MediaArea, clubStyle } from "@/components/ui";
import { values, responsibilities, documentCategories, documents, enquiryPath, leadership, officialContacts } from "@/data/about";
import { ClubDocuments, Leadership } from "./information";

export function AboutPage() {
  return <div className="about-page">
    <header className="container about-hero">
      <p className="eyebrow">Western Roos / About</p>
      <h1>More than a club.<br /><em>A home for<br />tournament softball.</em></h1>
      <div className="about-hero-foot"><span className="about-rule" aria-hidden="true" /><p>Participation. Development. Competition. Community.<br />Connected through the Western Roos family.</p><a className="text-link" href="#our-family">Meet our organisation <span aria-hidden="true">↓</span></a></div>
    </header>
    <nav className="container about-nav" aria-label="About sections">{[["our-family", "Our organisation"], ["our-purpose", "Our purpose"], ["values", "Values"], ["responsibilities", "What WRTSC does"], ["leadership", "Leadership"], ["documents", "Club documents"], ["contact", "Contact"]].map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
    <section className="container about-section" id="our-family" aria-labelledby="family-heading">
      <div className="about-section-intro"><p className="eyebrow">01 / Who we are</p><div><h2 id="family-heading">The organisation<br />behind the pathways.</h2><p>Western Roos Tournament Softball Club (WRTSC) is the overarching administrative, governance and development body facilitating softball participation and representative opportunities. WRTSC provides leadership, governance, administration and strategic direction supporting United Softball Club and the West Coast Marlins program.</p></div></div>
      <div className="about-family" aria-label="WRTSC governance and its community club and Masters representative pathways">
        <div className="about-parent"><BrandMark brand={parentBrand} /><p className="eyebrow">Governance & development</p><h3>Western Roos</h3><p>Tournament Softball Club</p></div>
        <p className="about-affiliation"><span aria-hidden="true">↓</span> Two participation pathways</p>
        <ol className="about-clubs">{clubs.map((club, index) => <li key={club.slug} style={clubStyle(club)}><div className="about-club-top"><span className="eyebrow">0{index + 1} / {index === 0 ? "Community Club" : "Masters Representative Program"}</span><BrandMark brand={club} /></div><h3>{club.name}</h3><p>{club.description}</p><Link className="text-link" href={`/clubs/${club.slug}`}>Explore {index === 0 ? "United" : "West Coast Marlins"}<Arrow /></Link></li>)}</ol>
      </div>
      <p className="about-editorial-note">WRTSC provides the governance. United provides the club pathway. Marlins provides the Masters pathway. Together we create opportunities for our softball community.</p>
    </section>
    <section className="about-purpose" id="our-purpose" aria-labelledby="purpose-heading"><div className="container about-section">
      <div className="about-section-intro"><p className="eyebrow">02 / Our purpose</p><div><h2 id="purpose-heading">The game.<br />And everything around it.</h2><p>WRTSC exists to create opportunities for people to participate in softball, whether through community competition with United Softball Club or representative Masters competition through the West Coast Marlins program.</p></div></div>
      <div className="about-purpose-grid"><figure><MediaArea media={homepageMedia.community} /><figcaption>United Softball Club / Together on the diamond</figcaption></figure><div><h3>Our story</h3><p>WRTSC was founded on the belief that softball is more than a game. It brings people together, builds lifelong friendships, strengthens communities and creates opportunities for personal growth on and off the field.</p><p>The organisation developed from tournament-focused beginnings through the dedication of players, families, volunteers and supporters.</p><Link className="text-link" href="/join">Find your pathway<Arrow /></Link></div></div>
    </div></section>
    <section className="container about-section" id="values" aria-labelledby="values-heading"><div className="about-section-intro"><p className="eyebrow">03 / Our values</p><div><h2 id="values-heading">What we stand for.</h2></div></div><ol className="about-themes">{values.map((value, index) => <li key={value.title}><span className="eyebrow">0{index + 1}</span><div><h3>{value.title}</h3><p>{value.copy}</p></div></li>)}</ol></section>
    <section className="container about-section" id="responsibilities" aria-labelledby="responsibilities-heading"><div className="about-section-intro"><p className="eyebrow">04 / Our responsibilities</p><div><h2 id="responsibilities-heading">What WRTSC does.</h2><p>WRTSC is a volunteer-led organisation responsible for strategic direction, governance and sustainable development.</p></div></div><ul className="about-records">{responsibilities.map(item => <li key={item}>{item}</li>)}</ul></section>
    <div className="container about-section about-official">
      <section id="leadership" aria-labelledby="leadership-heading"><p className="eyebrow">05 / Governance & leadership</p><h2 id="leadership-heading">WRTSC leadership</h2><Leadership entries={leadership.filter(person => person.role !== "General Committee")} /></section>
      <section id="committee" aria-labelledby="committee-heading"><p className="eyebrow">Our people</p><h2 id="committee-heading">General Committee</h2><Leadership entries={leadership.filter(person => person.role === "General Committee")} /></section>
    </div>
    <section className="container about-section" id="documents" aria-labelledby="documents-heading"><p className="eyebrow">06 / Governance & resources</p><h2 id="documents-heading">Club documents</h2><ul className="about-categories" aria-label="Future document categories">{documentCategories.map(category => <li key={category}>{category}</li>)}</ul><ClubDocuments entries={documents} /></section>
    <section className="about-contact" id="contact" aria-labelledby="contact-heading"><div className="container"><div><p className="eyebrow">07 / Have a question?</p><h2 id="contact-heading">Let’s talk<br />softball.</h2></div><div><p>Find organisation and pathway information or prepare a general enquiry through our Contact page.</p><Button href={enquiryPath}>Contact / enquire</Button>{officialContacts.length ? <ul className="about-records">{officialContacts.map(contact => <li key={contact.href}><a className="text-link" href={contact.href}>{contact.label}</a></li>)}</ul> : <p className="about-contact-note">Official contact details are pending. The current enquiry flow is a preview; sending is not yet available.</p>}</div></div></section>
  </div>;
}

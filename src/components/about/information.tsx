import Image from "next/image";
import { brands } from "@/config/brands";
import type { ClubDocument, LeadershipEntry } from "@/data/about";

export function Leadership({ entries }: { entries: readonly LeadershipEntry[] }) {
  if (!entries.length) return <div className="about-pending"><span className="eyebrow">Pending confirmation</span><p>Official committee and leadership information will be published once confirmed.</p></div>;
  return <ul className="about-records">{entries.map(person => <li key={person.id}>
    {person.photo && <Image src={person.photo.src} alt={person.photo.alt} width={160} height={160} />}
    <p className="eyebrow">{person.role} / {brands[person.club]?.name}</p><h3>{person.name}</h3>
    {person.bio && <p>{person.bio}</p>}{person.contact && <a className="text-link" href={person.contact.href}>{person.contact.label}</a>}
  </li>)}</ul>;
}

export function ClubDocuments({ entries }: { entries: readonly ClubDocument[] }) {
  if (!entries.length) return <div className="about-pending"><span className="eyebrow">Official documents pending</span><p>Club documents will be available here once confirmed and supplied. No files are available to download yet.</p></div>;
  return <ul className="about-records">{entries.map(document => <li key={document.id}>
    <p className="eyebrow">{document.category}</p><h3><a className="text-link" href={document.url}>{document.title} <span aria-hidden="true">↗</span></a></h3><p>{document.description}</p>
    <p className="about-dates">Published <time dateTime={document.publishedDate}>{document.publishedDate}</time>{document.updatedDate && <> · Updated <time dateTime={document.updatedDate}>{document.updatedDate}</time></>}</p>
  </li>)}</ul>;
}

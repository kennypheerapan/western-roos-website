import Link from "next/link";
import type { ClubIdentity } from "@/data/about";
import { clubInformation, informationFields } from "@/data/club-information";

export function PracticalInformation({ club }: { club: ClubIdentity }) {
  const records = clubInformation[club];
  return <dl className="contact-information">{informationFields.map(({ key, label, pending }) => <div key={key}>
    <dt>{label}</dt><dd>{records[key]?.text ?? pending}
      {records[key]?.links?.map(link => <Link key={link.href} href={link.href}>{link.label} ↗</Link>)}
    </dd>
  </div>)}</dl>;
}

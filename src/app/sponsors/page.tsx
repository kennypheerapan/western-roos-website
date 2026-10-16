import Link from 'next/link';
import { publishedKind } from '@/lib/content/server';
import { ContentCards } from '@/components/content/published';
export const dynamic='force-dynamic';
export const metadata={title:'Sponsors & partnerships',description:'Approved sponsor recognition and a pathway to support the Western Roos softball community.'};
export default async function Page(){return <div className="container route-page"><p className="eyebrow">Western Roos / Our community</p><h1>Sponsors & partnerships</h1><p className="intro">Supporting opportunities for our softball community.</p><ContentCards records={await publishedKind('sponsor')} empty="Official sponsor names, logos and partnership categories are pending approval."/><p><Link className="button" href="/contact?topic=join&pathway=sponsorship">Sponsorship enquiries ↗</Link></p></div>;}

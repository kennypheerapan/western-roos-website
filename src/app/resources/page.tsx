import { publishedKind } from '@/lib/content/server';
import { ContentCards } from '@/components/content/published';
export const dynamic='force-dynamic';
export const metadata={title:'Official links',description:'Approved social media, tournament and competition platform links.'};
export default async function Page(){return <div className="container route-page"><p className="eyebrow">Western Roos / Stay connected</p><h1>Official links</h1><ContentCards records={await publishedKind('link')} empty="Confirmed social media and competition platform links are pending."/></div>;}

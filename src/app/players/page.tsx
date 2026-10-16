import { publishedKind } from '@/lib/content/server';
import { ContentCards } from '@/components/content/published';
export const dynamic='force-dynamic';
export const metadata={title:'Approved player profiles',description:'Club-approved adult player profiles from the Western Roos family.'};
export default async function Page(){return <div className="container route-page"><p className="eyebrow">Western Roos / Our people</p><h1>Player profiles</h1><p className="intro">Meet our players through their approved public profiles.</p><ContentCards records={await publishedKind('profile')} empty="Approved public player profiles are pending."/></div>;}

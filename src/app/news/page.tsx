import type { Metadata } from "next";
import { getNews } from "@/data/editorial";
import { NewsListing } from "@/components/editorial/news";
import { publishedKind } from '@/lib/content/server';
import { newsStory } from '@/lib/content/public-adapters';
export const dynamic='force-dynamic';
export const metadata: Metadata = { title: "News & stories", description: "News and stories from the Western Roos family. Official updates pending." };
export default async function NewsPage() { const stories=(await publishedKind('news')).map(newsStory);return <div className="container editorial-page"><header className="editorial-intro"><p className="eyebrow">Western Roos / From around the club</p><h1>News & stories</h1><p>The game. The people. The moments we share.</p>{!stories.length&&<p className="editorial-disclosure">Official news is pending. The stories below are clearly labelled editorial previews, not club announcements.</p>}</header><NewsListing stories={stories.length?stories:getNews()}/></div>; }

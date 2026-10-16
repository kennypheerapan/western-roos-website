import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getNews, getStory, categoryLabel, displayDate, associationLabels } from "@/data/editorial";
import { NewsCard } from "@/components/editorial/news";
import { EditorialPhoto } from "@/components/editorial/photo";
import { publicContent } from '@/lib/content/server';
import { PublishedArticle } from '@/components/content/published';
export const dynamic='force-dynamic';
export const dynamicParams = true;
export function generateStaticParams() { return getNews().map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: {
    params: Promise<{
        slug: string;
    }>;
}): Promise<Metadata> { const slug=(await params).slug;const managed=(await publicContent()).find(r=>r.kind==='news'&&r.id===slug);const s = getStory(slug); return { title: managed?.title??s?.title ?? "Story not found", description: managed?.summary??s?.excerpt }; }
export default async function NewsDetail({ params }: {
    params: Promise<{
        slug: string;
    }>;
}) { const slug=(await params).slug,records=await publicContent(),managed=records.find(r=>r.kind==='news'&&r.id===slug);if(managed)return <PublishedArticle record={managed} records={records}/>;const s = getStory(slug); if (!s)
    notFound(); const related = getNews().filter(n => n.id !== s.id).sort((a, b) => Number(b.category === s.category) - Number(a.category === s.category)).slice(0, 2); return <article className="container editorial-page"><Link className="text-link editorial-back" href="/news">← Back to News</Link><header className="editorial-intro"><p className="eyebrow">{categoryLabel(s.category)} / {s.clubs.map(c => associationLabels[c]).join(" · ")}</p><h1>{s.title}</h1><p>{s.publishDate ? <time dateTime={s.publishDate}>{displayDate(s.publishDate)}</time> : "Publication date pending"}</p>{s.status === "preview" && <p className="editorial-disclosure">Editorial preview — this is a space for a future story, not an official club announcement.</p>}</header><div className="editorial-article-photo"><EditorialPhoto media={s.media} featured/></div><div className="editorial-body"><p className="intro">{s.excerpt}</p>{s.body.length ? s.body.map((b, i) => <section key={i}>{b.heading && <h2>{b.heading}</h2>}<p>{b.text}</p></section>) : <div className="editorial-empty"><h2>Story pending</h2><p>Official article content and publication details have not yet been supplied. This photograph is from the supplied United collection; it does not confirm a result, event date or achievement.</p></div>}</div><section className="editorial-section"><h2>Related stories</h2>{related.length ? <div className="editorial-news-grid">{related.map(n => <NewsCard key={n.id} story={n}/>)}</div> : <p>More stories will appear here when available.</p>}</section></article>; }

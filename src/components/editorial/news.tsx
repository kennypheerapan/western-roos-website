"use client";
import { useState } from "react";
import Link from "next/link";
import { categoryLabel, displayDate, newsCategories, type NewsStory } from "@/data/editorial";
import { EditorialPhoto } from "./photo";
export function NewsCard({ story, featured = false }: {
    story: NewsStory;
    featured?: boolean;
}) { return <Link href={"/news/" + story.slug} className={"editorial-card" + (featured ? " editorial-featured" : "")}><div className="editorial-photo"><EditorialPhoto media={story.media} featured={featured}/></div><div className="editorial-card-copy"><p className="eyebrow">{categoryLabel(story.category)} / {story.status === "preview" ? "Editorial preview" : story.publishDate ? displayDate(story.publishDate) : "Date pending"}</p><h3>{story.title}</h3><p>{story.excerpt}</p><span className="text-link">{story.status === "preview" ? "View preview" : "Read story"} ↗</span></div></Link>; }
export function Filters({ options, value, onChange, label }: {
    options: {
        id: string;
        label: string;
    }[];
    value: string;
    onChange: (value: string) => void;
    label: string;
}) { return <div className="editorial-filters" role="group" aria-label={label}>{[{ id: "all", label: "All" }, ...options].map(o => <button type="button" key={o.id} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>{o.label}</button>)}</div>; }
export function NewsListing({ stories }: {
    stories: NewsStory[];
}) { const [category, setCategory] = useState("all"); const featured = stories.find(s => s.featured); const filtered = stories.filter(s => category === "all" || s.category === category); return <>{featured && <section className="editorial-section" aria-labelledby="featured-heading"><h2 className="eyebrow" id="featured-heading">In focus / Featured story</h2><NewsCard story={featured} featured/></section>}<section className="editorial-section" aria-labelledby="latest-heading"><h2 id="latest-heading">Latest stories</h2><Filters options={newsCategories} value={category} onChange={setCategory} label="News categories"/><p className="editorial-status" role="status">{filtered.length} {filtered.length === 1 ? "story" : "stories"}</p>{filtered.length ? <div className="editorial-news-grid">{filtered.map(s => <NewsCard key={s.id} story={s}/>)}</div> : <div className="editorial-empty"><h3>Stories to come</h3><p>No stories in this category yet. Confirmed club updates will appear here when supplied.</p><button className="button" onClick={() => setCategory("all")}>View all stories</button></div>}</section></>; }

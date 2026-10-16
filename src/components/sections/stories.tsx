import Link from "next/link";
import { sponsors } from "@/data/mock";
import { getNews, galleryItems, displayDate } from "@/data/editorial";
import { Arrow, Button, MediaArea, SectionHeading } from "@/components/ui";
import { completedMatches, getMatches } from "@/data/competition";
import { ResultCard, CompetitionEmptyState } from "@/components/competition/cards";
import Image from "next/image";
import { homepageMedia } from "@/config/media";
import type { CompetitionData } from '@/data/competition/types';
import { competitionData } from '@/data/competition';
import type { NewsStory } from '@/data/editorial';
export function ResultsSection({data=competitionData}:{data?:CompetitionData}) {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="THE FINAL WORD"
          title="LATEST RESULTS"
          href="/fixtures#results"
          link="All results"
        />
        {!completedMatches(getMatches(data)).length && <CompetitionEmptyState title="No confirmed results yet" description="Results will appear here once confirmed." />}
        <div className="results-grid">
          {completedMatches(getMatches(data)).slice(0, 3).map((match) => (
            <ResultCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </section>
  );
}
export function NewsSection({ prioritizeFirstImage = false,stories=getNews() }: { prioritizeFirstImage?: boolean;stories?:NewsStory[] }) {
  return (
    <section className="section news-section">
      <div className="container">
        <SectionHeading
          eyebrow="FROM AROUND THE CLUB"
          title="NEWS & STORIES"
          href="/news"
          link="View all news"
        />
        <div className="news-grid">
          {stories.slice(0, 3).map((story, index) => (
            <Link
              href={`/news/${story.slug}`}
              className={`story story-${index}`}
              key={story.slug}
            >
              <MediaArea media={{ ...story.media, preload: prioritizeFirstImage && index === 0 }} />
              <div className="story-content">
                <p className="eyebrow">
                  {story.homepageCategory ?? story.category} / {story.status === "preview" ? "Editorial preview" : "News"}
                  {story.publishDate && <span> / {displayDate(story.publishDate)}</span>}
                </p>
                <h3>{story.title}</h3>
                {index === 0 && <p>{story.excerpt}</p>}
                <span className="text-link">
                  {story.status === "preview" ? "View preview" : "Read story"} <Arrow />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
export function GallerySection({ prioritizeFirstImage = false }: { prioritizeFirstImage?: boolean }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="THE MOMENTS THAT MATTER"
          title="CLUB GALLERY"
          href="/gallery"
          link="Explore the gallery"
        />
        <div className="gallery-grid">
          {galleryItems.filter(item => item.featured).map(({ media, id }, i) => (
            <Link href="/gallery" className={`gallery-item gallery-${i}`} key={id}>
              <MediaArea media={{ ...media, preload: prioritizeFirstImage && i === 0 }} />
              <span className="gallery-index">0{i + 1}</span>
              <strong className="gallery-label">{media.label}</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
export function JoinSection() {
  return (
    <section className="join-section">
      <MediaArea media={homepageMedia.join} className="join-photo" />
      <div className="join-photo-wash" aria-hidden="true" />
      <div className="container join-inner">
        <div>
          <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
          <h2>
            READY TO <span>PLAY?</span>
          </h2>
          <p>Become part of Western Roos Tournament Softball Club.</p>
        </div>
        <Button href="/join">Join the club</Button>
      </div>
    </section>
  );
}
export function SponsorsSection({approved=[]}:{approved?:{name:string;logo:string|null;url:string}[]}) {
  return (
    <section className="sponsors-section container">
      <p className="eyebrow">{approved.length?'OUR CLUB SUPPORTERS':'SPACE FOR OUR FUTURE SUPPORTERS'}</p>
      <div className="sponsors-grid">
        {(approved.length?approved:sponsors).map((sponsor) => (
          <div key={sponsor.name}>
            {'url' in sponsor&&typeof sponsor.url==='string'?<Link href={sponsor.url}>{sponsor.logo?<Image src={sponsor.logo} width={140} height={60} alt={sponsor.name}/>:<span>{sponsor.name}</span>}</Link>:sponsor.logo ? (
              <Image
                src={sponsor.logo}
                width={140}
                height={60}
                alt={sponsor.name}
              />
            ) : (
              <span>
                {sponsor.name}
                <small>Partner logo pending</small>
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

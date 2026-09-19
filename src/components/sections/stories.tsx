import Link from "next/link";
import { gallery, mockNews, mockResults, sponsors } from "@/data/mock";
import { Arrow, Button, MediaArea, SectionHeading } from "@/components/ui";
import { ScoreCard } from "@/components/score-card";
import Image from "next/image";
import { homepageMedia } from "@/config/media";
export function ResultsSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="THE FINAL WORD"
          title="LATEST RESULTS"
          href="/fixtures#results"
          link="All results"
        />
        <div className="results-grid">
          {mockResults.map((match) => (
            <ScoreCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </section>
  );
}
export function NewsSection() {
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
          {mockNews.map((story, index) => (
            <Link
              href={`/news/${story.slug}`}
              className={`story story-${index}`}
              key={story.slug}
            >
              <MediaArea media={story.media} />
              <div className="story-content">
                <p className="eyebrow">
                  {story.category}
                  {story.date && <span> / {story.date}</span>}
                </p>
                <h3>{story.title}</h3>
                {index === 0 && <p>{story.description}</p>}
                <span className="text-link">
                  Read story <Arrow />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
export function GallerySection() {
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
          {gallery.map((media, i) => (
            <div className={`gallery-item gallery-${i}`} key={media.label}>
              <MediaArea media={media} />
              <span className="gallery-index">0{i + 1}</span>
              <strong className="gallery-label">{media.label}</strong>
            </div>
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
export function SponsorsSection() {
  return (
    <section className="sponsors-section container">
      <p className="eyebrow">SPACE FOR OUR FUTURE SUPPORTERS</p>
      <div className="sponsors-grid">
        {sponsors.map((sponsor) => (
          <div key={sponsor.name}>
            {sponsor.logo ? (
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

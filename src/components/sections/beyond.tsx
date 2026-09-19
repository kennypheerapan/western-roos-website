import { Arrow, MediaArea, SectionHeading } from "@/components/ui";
import { homepageMedia } from "@/config/media";

const features = [
  {
    number: "01",
    title: "Learn & develop",
    copy: "A future home for new-player pathways, junior development and coaching.",
    action: "Learn more",
  },
  {
    number: "02",
    title: "Events",
    copy: "Club, social and fundraising events that bring people together beyond fixtures.",
    action: "Explore events",
  },
  {
    number: "03",
    title: "Community",
    copy: "A place for future stories about volunteering, fundraising and community involvement.",
    action: "Our community",
  },
];

export function BeyondSection() {
  return (
    <section className="section beyond-section">
      <div className="beyond-wordmark" aria-hidden="true">
        BEYOND
      </div>
      <div className="container">
        <SectionHeading
          eyebrow="MORE THAN THE SCOREBOARD"
          title="BEYOND THE DIAMOND"
        />
        <div className="beyond-grid">
          {features.map((feature, index) => (
            <article className="beyond-card" key={feature.title}>
              <MediaArea media={homepageMedia.beyond[index]} />
              <div className="beyond-content">
                <span className="beyond-number">{feature.number}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                  <span className="text-link beyond-link">
                    {feature.action} <Arrow />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

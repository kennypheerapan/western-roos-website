import Image from "next/image";
import { clubs } from "@/config/brands";
import { BrandMark, Button, clubStyle, SectionHeading } from "@/components/ui";
export function ClubsSection() {
  return (
    <section className="section clubs-section">
      <div className="container">
        <SectionHeading
          eyebrow="OUR COLOURS. OUR COMMUNITY."
          title="OUR PATHWAYS"
          href="/clubs"
          link="Explore our pathways"
        />
        <div className="club-grid">
          {clubs.map((club) => (
            <article
              key={club.slug}
              className="club-card"
              style={clubStyle(club)}
            >
              {club.compactLogo && (
                <Image
                  className="club-watermark"
                  src={club.compactLogo}
                  alt=""
                  width={350}
                  height={350}
                />
              )}
              <div className="card-top">
                <span className="eyebrow">{club.slug === "united" ? "COMMUNITY CLUB" : "MASTERS REPRESENTATIVE PROGRAM"}</span>
                <span className="club-stripe" />
              </div>
              <BrandMark brand={club} />
              <h3>{club.name}</h3>
              <p>{club.description}</p>
              <span className="club-focus">{club.focus}</span>
              <Button href={`/clubs/${club.slug}`} secondary>
                View pathway
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


import { Button, MediaArea } from "@/components/ui";
import { homepageMedia } from "@/config/media";
export function Hero() {
  return (
    <section className="hero">
      <div className="hero-geometry" aria-hidden="true" />
      <div className="container hero-content">
        <p className="eyebrow">
          <span className="accent-line" /> WRTSC · THE HOME OF TOURNAMENT SOFTBALL
        </p>
        <h1>
          WESTERN
          <br />
          <span>ROOS</span>
          <span className="hero-dot">.</span>
        </h1>
        <p className="hero-subtitle">TOURNAMENT SOFTBALL CLUB</p>
        <p className="hero-copy">
          Participation. Development. Competition. Community.
        </p>
        <div className="button-row">
          <Button href="/clubs">Explore clubs</Button>
          <Button href="/fixtures" secondary>
            View fixtures
          </Button>
        </div>
      </div>
      <div className="hero-art">
        <MediaArea media={homepageMedia.hero} className="hero-photo" />
        <div className="hero-photo-wash" aria-hidden="true" />
        <span className="vertical-label">WESTERN ROOS / SOFTBALL</span>
        <div className="hero-outline" aria-hidden="true">
          PLAY
          <br />
          HARD.
          <br />
          PLAY
          <br />
          TOGETHER.
        </div>
        <span className="hero-media-label">01 / SOFTBALL ACTION</span>
      </div>
      <div className="hero-bottom container">
        <span>PERTH SOFTBALL LEAGUE · TOURNAMENT PATHWAYS</span>
        <a href="#game-centre">
          Step onto the diamond <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

import Link from "next/link";
import { parentBrand } from "@/config/brands";
import { BrandMark } from "./ui";
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <BrandMark brand={parentBrand} />
          <h3>WESTERN ROOS</h3>
          <p>Tournament Softball Club</p>
          <p className="muted">
            Participation. Development. Competition. Community.
          </p>
        </div>
        <div>
          <h4>Club</h4>
          <Link href="/clubs">Our pathways</Link>
          <Link href="/teams">Our teams</Link>
          <Link href="/join">Join us</Link>
        </div>
        <div>
          <h4>Competitions</h4>
          <Link href="/tournaments">Tournaments</Link>
          <Link href="/fixtures">Fixtures & results</Link>
        </div>
        <div>
          <h4>Information</h4>
          <Link href="/contact">Contact</Link>
          <Link href="/about">About Western Roos</Link>
          <Link href="/news">News & stories</Link>
          <Link href="/gallery">Club gallery</Link>
        </div>
        <div>
          <h4>Club life</h4>
          <Link href="/events">Events</Link>
          <Link href="/play">Play & development</Link>
          <Link href="/community">Community</Link>
          <Link href="/shop">Merchandise</Link>
          <p className="muted">
            Official contact details and social channels coming soon.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Western Roos Tournament Softball Club
        </span>
        <span>Competition · Community · Softball</span>
      </div>
    </footer>
  );
}

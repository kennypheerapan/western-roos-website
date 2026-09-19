import type { Fixture } from "@/types";
import { brands } from "@/config/brands";
import { formatDate, score } from "@/lib/format";
import { BrandMark, clubStyle } from "./ui";
export function ScoreCard({ match }: { match: Fixture }) {
  const brand = brands[match.brandId];
  return (
    <article className="score-card" style={clubStyle(brand)}>
      <span className="score-card-line" aria-hidden="true" />
      <div className="score-meta">
        <span>Final · Demo</span>
        <time dateTime={match.date}>{formatDate(match.date)}</time>
      </div>
      <div className="score-team">
        <span>
          <BrandMark brand={brand} compact />
          {match.home}
        </span>
        <strong>{score(match.homeScore)}</strong>
      </div>
      <div className="score-team opponent">
        <span>{match.away}</span>
        <strong>{score(match.awayScore)}</strong>
      </div>
      <p>{match.competition}</p>
    </article>
  );
}

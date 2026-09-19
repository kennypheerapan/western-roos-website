import { mockFixtures, mockResults } from "@/data/mock";
import { BrandMark, Button, SectionHeading } from "@/components/ui";
import { formatDate, score } from "@/lib/format";
import { brands } from "@/config/brands";
export function GameCentre() {
  const next = mockFixtures[0],
    result = mockResults[0];
  return (
    <section id="game-centre" className="section game-section">
      <div className="container">
        <SectionHeading
          eyebrow="THE DIAMOND, AT A GLANCE"
          title="GAME CENTRE"
          href="/fixtures"
          link="All fixtures & results"
        />
        <p className="demo-note">
          Demo schedule & scores · Official match information coming soon
        </p>
        <div className="game-grid">
          <article className="next-game">
            <div className="card-top">
              <span className="eyebrow">NEXT GAME</span>
              <span className="tag">Upcoming · Demo</span>
            </div>
            <p className="competition">{next.competition}</p>
            <div className="matchup">
              <div className="matchup-team">
                <BrandMark brand={brands[next.brandId]} compact />
                <strong>{next.home}</strong>
              </div>
              <span>VS</span>
              <div className="matchup-team matchup-team-away">
                <span className="opponent-mark" aria-hidden="true">
                  OPP
                </span>
                <strong>{next.away}</strong>
              </div>
            </div>
            <div className="match-details">
              <span>
                <time dateTime={next.date}>{formatDate(next.date)}</time>
                <small>{next.time} AWST</small>
              </span>
              <span>
                {next.venue}
                <small>Softball</small>
              </span>
              <Button href={`/fixtures/${next.id}`}>Match centre</Button>
            </div>
          </article>
          <article className="last-game">
            <div className="card-top">
              <span className="eyebrow">LATEST RESULT</span>
              <span className="tag">Final · Demo</span>
            </div>
            <div className="result-team-label">
              <BrandMark brand={brands[result.brandId]} compact />
              <p>{result.home}</p>
            </div>
            <div className="big-score">
              {score(result.homeScore)}
              <span>:</span>
              {score(result.awayScore)}
            </div>
            <p>{result.away}</p>
            <div className="result-bottom">
              {formatDate(result.date)} <span>{result.competition}</span>
            </div>
          </article>
        </div>
        <div className="up-next">
          <span className="eyebrow">ON DECK</span>
          <strong>
            {mockFixtures[1].home} <span>vs</span> {mockFixtures[1].away}
          </strong>
          <span>
            {formatDate(mockFixtures[1].date)} · {mockFixtures[1].time} AWST
          </span>
          <span className="muted">Demo fixture</span>
        </div>
      </div>
    </section>
  );
}

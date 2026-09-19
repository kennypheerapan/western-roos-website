import { mockTournament } from "@/data/mock";
import { Button } from "@/components/ui";
export function TournamentSection() {
  const tournament = mockTournament;
  return (
    <section className="tournament-section">
      <div className="tournament-wordmark" aria-hidden="true">
        TOURNAMENT
      </div>
      <div className="container tournament-grid">
        <div>
          <p className="eyebrow">TOURNAMENT CENTRE / NEXT UP</p>
          <h2>{tournament.name}</h2>
          <p>{tournament.description}</p>
          <Button href="/tournaments" secondary>
            Tournament centre
          </Button>
        </div>
        <div className="tournament-info">
          <span className="eyebrow">NEXT TOURNAMENT · DEMO</span>
          <p className="tournament-date">{tournament.date}</p>
          <div className="tournament-stats">
            <div>
              <strong>{String(tournament.teams).padStart(2, "0")}</strong>
              <span>TEAMS</span>
            </div>
            <div>
              <strong>{tournament.games}</strong>
              <span>GAMES</span>
            </div>
          </div>
          <p className="demo-note">{tournament.label}</p>
          <span className="tournament-status">
            Preview data · Official details pending
          </span>
        </div>
      </div>
    </section>
  );
}

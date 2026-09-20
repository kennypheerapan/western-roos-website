import { competitionData } from "@/data/competition";
import { Button } from "@/components/ui";
import { TournamentCard } from "@/components/competition/cards";
export function TournamentSection() {
  const tournament = competitionData.tournaments.filter(t => t.status === "upcoming").sort((a, b) => (a.startDate ?? "9999").localeCompare(b.startDate ?? "9999"))[0];
  return <section className="tournament-section"><div className="tournament-wordmark" aria-hidden="true">TOURNAMENT</div><div className="container tournament-grid"><div><p className="eyebrow">Tournament centre / Next up</p><h2>{tournament?.name ?? "Tournament details coming soon."}</h2><p>{tournament?.description ?? "Official tournament information will appear here once confirmed."}</p><Button href="/tournaments" secondary>Tournament centre</Button></div><div className="tournament-info"><span className="eyebrow">Next tournament</span>{tournament ? <TournamentCard tournament={tournament} /> : <><p className="tournament-date">See you on the diamond.</p><span className="tournament-status">Competition details are being prepared.</span></>}</div></div></section>;
}

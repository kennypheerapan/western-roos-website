import { competitionSnapshotTime } from "@/data/competition/snapshot";
import { competitionData, completedMatches, getMatches, nextMatch } from "@/data/competition";
import type { CompetitionData } from '@/data/competition/types';
import { SectionHeading } from "@/components/ui";
import { CompetitionEmptyState, FixtureCard, ResultCard } from "@/components/competition/cards";
export function GameCentre({data=competitionData,now=competitionSnapshotTime}:{data?:CompetitionData;now?:number}) {
  const matches = getMatches(data);
  const next = nextMatch(matches, now);
  const result = completedMatches(matches)[0];
  return <section id="game-centre" className="section game-section"><div className="container"><SectionHeading eyebrow="THE DIAMOND, AT A GLANCE" title="GAME CENTRE" href="/fixtures" link="All fixtures & results" /><div className="game-grid"><div className="next-game"><p className="eyebrow">Next game</p>{next ? <FixtureCard match={next} /> : <CompetitionEmptyState title="Fixtures coming soon" description="The next game will appear here once confirmed." />}</div><div className="last-game"><p className="eyebrow">Latest result</p>{result ? <ResultCard match={result} /> : <CompetitionEmptyState title="No confirmed results yet" description="Results will appear here once confirmed." />}</div></div></div></section>;
}

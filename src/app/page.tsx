import { Hero } from "@/components/sections/hero";
import { GameCentre } from "@/components/sections/game-centre";
import { ClubsSection } from "@/components/sections/clubs";
import { TournamentSection } from "@/components/sections/tournament";
import { BeyondSection } from "@/components/sections/beyond";
import {
  ResultsSection,
  NewsSection,
  GallerySection,
  JoinSection,
  SponsorsSection,
} from "@/components/sections/stories";
export default function Home() {
  return (
    <>
      <Hero />
      <GameCentre />
      <ClubsSection />
      <TournamentSection />
      <ResultsSection />
      <NewsSection />
      <BeyondSection />
      <GallerySection />
      <JoinSection />
      <SponsorsSection />
    </>
  );
}

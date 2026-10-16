import { Hero } from "@/components/sections/hero";
import { GameCentre } from "@/components/sections/game-centre";
import { ClubsSection } from "@/components/sections/clubs";
import { TournamentSection } from "@/components/sections/tournament";
import { BeyondSection } from "@/components/sections/beyond";
import { homepageContent,newsStory,clubEvent } from '@/lib/content/public-adapters';
import { Suspense } from 'react';
import {
  ResultsSection,
  NewsSection,
  GallerySection,
  JoinSection,
  SponsorsSection,
} from "@/components/sections/stories";
export const dynamic='force-dynamic';
function HomeSections({content}:{content?:Awaited<ReturnType<typeof homepageContent>>}){
  const records=content?.records??[],data=content?.data,now=content?.now,news=records.filter(r=>r.kind==='news').map(newsStory),events=records.filter(r=>r.kind==='event').map(r=>clubEvent(r,records));
  return (
    <>
      <GameCentre data={data} now={now}/>
      <ClubsSection />
      <TournamentSection data={data}/>
      <ResultsSection data={data}/>
      <NewsSection stories={news.length?news:undefined}/>
      <BeyondSection confirmedEvents={events.length?events:undefined}/>
      <GallerySection />
      <JoinSection />
      <SponsorsSection approved={records.filter(r=>r.kind==='sponsor').map(r=>({name:r.title,logo:r.data.asset_id?`/api/media/${r.data.asset_id}`:null,url:`/content/${r.id}`}))}/>
    </>
  );
}
async function ManagedHomeSections(){return <HomeSections content={await homepageContent()}/>;}
export default function Home(){return <><Hero/><Suspense fallback={<HomeSections/>}><ManagedHomeSections/></Suspense></>;}

import 'server-only';
import { cache } from 'react';
import { competitionData } from '@/data/competition';
import type { CompetitionData,MatchStatus } from '@/data/competition/types';
import { publishedDirectory,publicClubTeam } from '@/lib/teams/public';
import { publicContent } from './server';
import type { PublicContent } from './contract';
import type { NewsStory } from '@/data/editorial';
import type { ClubEvent,EventCategory } from '@/data/events';
import { parentBrand } from '@/config/brands';
export async function homepageContent(){const [records,data]=await Promise.all([publicContent(),managedCompetition()]);return {records,data,now:Date.now()};}
export function newsStory(r:PublicContent):NewsStory{return {id:r.id,slug:r.id,title:r.title,excerpt:r.summary,category:['match-report','selection'].includes(String(r.data.category))?'competition':['coaching','development','junior'].includes(String(r.data.category))?'development':'club',publishDate:r.published_at,media:{src:r.data.asset_id?`/api/media/${r.data.asset_id}`:parentBrand.logo,alt:r.data.asset_id?r.title:'Western Roos club logo',label:r.title},clubs:[r.pathway],featured:false,status:'published',body:r.body.split('\n\n').filter(Boolean).map(text=>({text}))};}
export function clubEvent(r:PublicContent,records:PublicContent[]):ClubEvent{
 const d=r.data,venue=records.find(v=>v.id===d.venue_id),start=String(d.starts_at??''),end=String(d.ends_at??'');
 const category=String(d.category)==='beginners'?'DEVELOPMENT':String(d.category)==='volunteer'?'COMMUNITY':String(d.category).toUpperCase();
 return {id:r.id,slug:r.id,title:r.title,category:category as EventCategory,summary:r.summary,description:r.body.split('\n\n'),startDate:start.slice(0,10),startTime:start.slice(11)+' AWST',endDate:end.slice(0,10)||undefined,endTime:end.slice(11)||undefined,venue:venue?.title,address:String(venue?.data.address??''),club:r.pathway,status:d.event_status==='changed'?'postponed':d.event_status as ClubEvent['status'],registrationStatus:'pending',contactUrl:d.website?String(d.website):undefined,contactLabel:'Official event information',image:d.asset_id?{src:`/api/media/${d.asset_id}`,alt:r.title,label:r.title}:undefined};
}
/** One adapter feeds the existing competition engine, cards and filters. */
export const managedCompetition=cache(async():Promise<CompetitionData>=>{
 const [records,directory]=await Promise.all([publicContent(),publishedDirectory()]);
 const data:CompetitionData={tournaments:[...competitionData.tournaments],divisions:[...competitionData.divisions],teams:[...competitionData.teams,...directory.teams.map(publicClubTeam)],venues:[...competitionData.venues],fixtures:[...competitionData.fixtures],results:[...competitionData.results]};
 records.filter(r=>r.kind==='venue').forEach(r=>data.venues.push({id:r.id,name:r.title,location:String(r.data.address??'')}));
 records.filter(r=>r.kind==='tournament').forEach(r=>{data.tournaments.push({id:r.id,slug:r.id,name:r.title,description:r.summary,startDate:String(r.data.starts_on),endDate:String(r.data.ends_on),venueIds:r.data.venue_id?[String(r.data.venue_id)]:[],participatingTeamIds:Array.isArray(r.data.team_ids)?r.data.team_ids:[],status:r.data.tournament_status as 'upcoming'|'active'|'completed'});});
 records.filter(r=>r.kind==='fixture').forEach(r=>{
  const d=r.data,team=data.teams.find(t=>t.id===d.team_id),tournament=data.tournaments.find(t=>t.id===d.tournament_id);if(!team||!tournament)return;
  const opponentId=tournament.id+'-opponent-'+encodeURIComponent(String(d.opponent).trim().toLowerCase());
  let opponent=data.teams.find(t=>t.id===opponentId);if(!opponent){opponent={id:opponentId,name:String(d.opponent),club:'external'};data.teams.push(opponent);}
  const divisionId=tournament.id+'-division-'+encodeURIComponent(String(d.division).trim().toLowerCase());
  let division=data.divisions.find(v=>v.id===divisionId);if(!division){division={id:divisionId,tournamentId:tournament.id,name:String(d.division),teamIds:[]};data.divisions.push(division);}division.teamIds=Array.from(new Set([...division.teamIds,team.id,opponent.id]));
  const start=String(d.starts_at);data.fixtures.push({id:r.id,tournamentId:tournament.id,divisionId:division.id,homeTeamId:d.side==='home'?team.id:opponent.id,awayTeamId:d.side==='away'?team.id:opponent.id,date:start.slice(0,10),time:start.slice(11),startsAt:start+'+08:00',timeZoneLabel:'AWST',venueId:String(d.venue_id),diamond:String(d.diamond),status:d.match_status as MatchStatus,summary:r.summary,notes:r.body});if(d.match_status==='final')data.results.push({fixtureId:r.id,homeScore:Number(d.home_score),awayScore:Number(d.away_score),status:'final'});
 });
 return data;
});

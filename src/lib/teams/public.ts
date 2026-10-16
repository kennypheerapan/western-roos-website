import 'server-only';
import { cache } from 'react';
import { database } from '@/lib/backend/server';
import type { ClubTeam } from '@/data/teams';
import { publicContent } from '@/lib/content/server';
import { uuid } from '@/lib/content/contract';
export type PublicPerson={name:string;number:string;position:string;role:string};
export type PublishedTeam={id:string;name:string;pathway:'united'|'marlins';category?:string;season:string;description:string;roster:PublicPerson[]};
export type PublishedSquad=PublishedTeam&{team_id:string|null;tournament_id:string|null};
export const publishedDirectory=cache(async():Promise<{teams:PublishedTeam[];squads:PublishedSquad[];available:boolean}>=>{
 try{const db=database();if(!db)throw Error();const r=await db.rpc('published_team_directory');if(r.error||!Array.isArray(r.data?.teams)||!Array.isArray(r.data?.squads))throw Error();const tournaments=new Set((await publicContent()).filter(c=>c.kind==='tournament').map(c=>c.id));return {teams:r.data.teams,squads:r.data.squads.filter((s:PublishedSquad)=>!s.tournament_id||!uuid.test(s.tournament_id)||tournaments.has(s.tournament_id)),available:true};}catch{return {teams:[],squads:[],available:false};}
});
export function publicClubTeam(t:PublishedTeam):ClubTeam{return {id:t.id,slug:t.id,name:t.name,club:t.pathway==='united'?'united':'west-coast-marlins',season:t.season,description:t.description,status:'confirmed'};}

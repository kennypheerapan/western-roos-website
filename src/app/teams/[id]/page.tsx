import { notFound } from 'next/navigation';
import { TeamDetail } from '@/components/teams/pages';
import { PublishedRoster, PublishedSquads } from '@/components/teams/published';
import { publishedDirectory, publicClubTeam } from '@/lib/teams/public';
import { homepageContent } from '@/lib/content/public-adapters';
import { ContentCards } from '@/components/content/published';
import Link from 'next/link';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const data=await publishedDirectory();return {title:data.teams.find(t=>t.id===id)?.name??'Team details pending'};}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(id==='details-pending')return <TeamDetail/>;const directory=await publishedDirectory();const team=directory.teams.find(t=>t.id===id);if(!team)notFound();const {data,records,now}=await homepageContent();return <><TeamDetail team={publicClubTeam(team)} data={data} now={now}/>{team.category&&<section className="container teams-section"><h2>Confirmed division</h2><p>{team.category}</p></section>}<PublishedRoster people={team.roster}/><PublishedSquads squads={directory.squads.filter(s=>s.team_id===id)}/><section className="container teams-section"><h2>Training & team updates</h2><p><Link className="text-link" href={`/training?team=${id}`}>View this team’s training schedule ↗</Link></p><ContentCards records={records.filter(r=>r.kind==='news'&&r.data.team_id===id)} empty="Approved selection information and team updates are pending."/></section></>;}

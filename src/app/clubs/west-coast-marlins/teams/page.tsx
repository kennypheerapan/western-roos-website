import { clubs } from '@/config/brands';
import { TeamsPage } from '@/components/teams/pages';
import { publishedDirectory, publicClubTeam } from '@/lib/teams/public';
export const dynamic='force-dynamic';
export default async function Page(){const data=await publishedDirectory();return <TeamsPage club={clubs.find(c=>c.slug==='west-coast-marlins')} approvedTeams={data.teams.map(publicClubTeam)}/>;}

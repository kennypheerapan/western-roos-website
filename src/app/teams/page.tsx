import { TeamsPage } from '@/components/teams/pages';
import { PublishedSquads } from '@/components/teams/published';
import { publishedDirectory, publicClubTeam } from '@/lib/teams/public';
import Link from 'next/link';
import { ManagedSection } from '@/components/content/published';
export const dynamic='force-dynamic';
export const metadata={title:'Our teams'};
export default async function Page(){const data=await publishedDirectory();return <><TeamsPage approvedTeams={data.teams.map(publicClubTeam)}/><PublishedSquads squads={data.squads}/><div className="container teams-section"><Link className="text-link" href="/players">Approved player profiles ↗</Link> · <Link className="text-link" href="/training">Training schedule ↗</Link></div><ManagedSection kinds={['news']} categories={['selection','coaching','officials']} title="Team selection, coaches & officials"/></>;}

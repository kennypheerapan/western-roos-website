import { TeamAdminPage } from '@/app/admin/team-pages';
export default async function Page({params}:{params:Promise<{id:string}>}){return <TeamAdminPage kind="squad" id={(await params).id}/>;}

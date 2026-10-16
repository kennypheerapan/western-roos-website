import { ContentList } from '../../content-pages';
export default async function Page({params,searchParams}:{params:Promise<{module:string}>;searchParams:Promise<Record<string,string|undefined>>}){return <ContentList module={(await params).module} search={await searchParams}/>;}

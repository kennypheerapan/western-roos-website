import { ContentDetail } from '../../../content-pages';
export default async function Page({params,searchParams}:{params:Promise<{module:string;id:string}>;searchParams:Promise<{kind?:string}>}){return <ContentDetail {...await params} kind={(await searchParams).kind}/>;}

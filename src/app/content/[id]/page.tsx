import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { publicContent } from '@/lib/content/server';
import { PublishedArticle } from '@/components/content/published';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{const {id}=await params;const record=(await publicContent()).find(r=>r.id===id);return {title:record?.title??'Content unavailable',description:record?.summary,robots:record?undefined:{index:false,follow:false}};}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params,records=await publicContent(),record=records.find(r=>r.id===id);if(!record)notFound();return <PublishedArticle record={record} records={records}/>;}

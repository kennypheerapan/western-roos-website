import { assetResponse } from '@/lib/content/assets';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){return assetResponse((await params).id);}

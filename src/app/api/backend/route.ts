import { database } from '@/lib/backend/server';
import { presidentPreviewLocked } from '@/lib/president-preview';
import { json } from '@/lib/backend/http';
export const dynamic = 'force-dynamic';
export async function GET() {
  if(presidentPreviewLocked()||process.env.PRESIDENT_PREVIEW_READ_ONLY==='true')return json({available:false,message:'President review mode: submissions are disabled. Nothing will be sent or saved.'});
  const db=database();
  if(!db)return json({available:false,message:'Backend is not configured. Preview only; nothing is saved.'});
  try {
    const {data,error}=await db.rpc('backend_ready');
    return json({available:!error && data===true,message:error?'Backend unavailable. Nothing has been saved.':'Test submissions are saved privately. No payments or confirmed memberships.'});
  } catch {return json({available:false,message:'Backend unavailable. Nothing has been saved.'});}
}

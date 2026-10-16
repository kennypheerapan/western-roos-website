import 'server-only';
import { presidentPreviewLocked } from '../president-preview';
import { createClient } from '@supabase/supabase-js';
export function database() {
  if (presidentPreviewLocked()) return null;
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SECRET_KEY;
  if(!url || !key) return null;
  try {
    const parsed=new URL(url);
    if(parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['localhost','127.0.0.1'].includes(parsed.hostname))) return null;
    return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store',signal:AbortSignal.timeout(15000)})}});
  } catch { return null; }
}

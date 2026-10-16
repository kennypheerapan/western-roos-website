import { createHash } from 'node:crypto';
import { readBody,json } from '@/lib/backend/http';
import { database } from '@/lib/backend/server';
import { InputError } from '@/lib/backend/validation';
import { validateEnquiry,type Enquiry } from '@/lib/enquiry';
import { uuid } from '@/lib/content/contract';
import { intakeMode } from '@/lib/content/enquiries';
export const dynamic='force-dynamic';
export async function GET(){return json({mode:await intakeMode()});}
export async function POST(request:Request){
 try{const mode=await intakeMode();if(mode==='disabled')return json({message:'Online enquiries are pending approval. Nothing was sent or saved.'},503);
 const body=await readBody(request);if(!uuid.test(String(body.requestKey))||body.website!==''||typeof body.startedAt!=='number'||Date.now()-body.startedAt<3000||Date.now()-body.startedAt>86400000)throw new InputError('Please complete the enquiry form and try again.');
 const v=body.enquiry as Record<string,unknown>;if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).sort().join(',')!=='club,consent,email,interest,message,name,phone,topic'||['name','email','phone','interest','club','topic','message'].some(k=>typeof v[k]!=='string')||v.consent!==true)throw new InputError('Review the enquiry fields and consent.');
 const payload=v as Enquiry;const errors=validateEnquiry(payload);if(Object.keys(errors).length)return json({message:'Review the highlighted enquiry fields.',errors},400);
 if(mode==='test'&&!payload.email.toLowerCase().endsWith('@example.invalid'))throw new InputError('Test mode accepts synthetic @example.invalid addresses only.');
 const db=database();if(!db)throw Error();const r=await db.rpc('submit_club_enquiry',{p_key:body.requestKey,p_hash:createHash('sha256').update(JSON.stringify(payload)).digest('hex'),p_mode:mode,p_payload:payload});
 if(r.error){if(r.error.message==='enquiry_rate')return json({message:'Too many enquiries. Please try again later.'},429);if(r.error.message==='enquiry_conflict')return json({message:'This request reference belongs to different details. Reload before starting a new enquiry.'},409);throw Error();}
 if(r.data?.status!=='received'||!uuid.test(r.data?.id))throw Error();return json({message:`${mode==='test'?'Synthetic test enquiry':'Enquiry'} saved for committee review. This does not register a player or confirm membership.`,id:r.data.id},201);
 }catch(e){return e instanceof InputError?json({message:e.message},400):json({message:'Receipt could not be confirmed. Keep these details and retry the same submission.'},503);}
}

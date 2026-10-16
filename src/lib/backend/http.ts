import 'server-only';
import { presidentPreviewLocked } from '../president-preview';
import { createHash } from 'node:crypto';
import { database } from './server';
import { catalogId } from '../shop/catalog-identity';
import { InputError, membershipInput, orderInput, record, requestKey } from './validation';
export function json(value:unknown,status=200) { return Response.json(value,{status,headers:{'Cache-Control':'no-store'}}); }
export async function readBody(request:Request) {
  const origin=request.headers.get('origin');
  // Next may use an internal hostname in request.url; compare the incoming Host.
  let sameOrigin=false;
  try { const url=new URL(origin ?? ''); sameOrigin=['https:','http:'].includes(url.protocol) && url.host===request.headers.get('host'); } catch {}
  if(!sameOrigin) throw new InputError('Please submit from this website.');
  if(!request.headers.get('content-type')?.startsWith('application/json')) throw new InputError('Please submit a valid form.');
  const reader=request.body?.getReader();
  if(!reader) throw new InputError('Please submit a valid form.');
  const chunks:Uint8Array[]=[]; let length=0;
  for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>32768){await reader.cancel();throw new InputError('The submission is too large.');}chunks.push(value);}
  try {return record(JSON.parse(Buffer.concat(chunks).toString('utf8')));} catch {throw new InputError('Please submit a valid form.');}
}
const messages:Record<string,string>={invalid_request:'This request is invalid. Please review your order again.',review_required:'Review the current prices before confirming.',price_changed:'Prices have changed since your last review. Please check the updated total and confirm again.',invalid_order:'Please review your cart and quantities.',invalid_quantity:'Choose a valid quantity (1–99).',product_unavailable:'A product is unavailable. Please remove it from your cart.',variant_unavailable:'A variant is unavailable. Please choose another size.',insufficient_stock:'There is insufficient test stock. Please reduce the quantity.',request_conflict:'This request key belongs to different details. Please review again before starting a new submission.'};
export function backendError(code:string){return messages[code]?json({code,message:messages[code]},409):json({code:'backend_unavailable',message:'The submission could not be confirmed. Please retry without changing the details.'},503);}
export async function submit(request:Request,kind:'membership'|'order') {
  if(presidentPreviewLocked()||process.env.PRESIDENT_PREVIEW_READ_ONLY==='true')return json({code:'preview_read_only',message:'This President preview is read only. Nothing has been sent or saved.'},503);
  try {
    const body=await readBody(request), key=requestKey(body.requestKey);
    const payload=kind==='membership'?membershipInput(body.application):orderInput(body);
    if(kind==='order' && 'lines' in payload && payload.lines.some(line=>!catalogId(line.productId)))throw new InputError('This product is unavailable.','product_unavailable');
    const db=database();
    if(!db)return json({code:'backend_unavailable',message:'Backend is not configured. Nothing has been saved. You can continue reviewing your details.'},503);
    const hash=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const {data,error}=await db.rpc(kind==='membership'?'submit_membership':'create_reviewed_unpaid_order',{p_key:key,p_hash:hash,p_payload:payload});
    if(error)return backendError(error.message);
    return json(data,201);
  } catch(error) {
    if(error instanceof InputError)return json({code:error.code,message:error.message},400);
    return backendError('backend_unavailable');
  }
}

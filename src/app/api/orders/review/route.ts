import {publicCatalog} from '@/lib/shop/catalog';
import { presidentPreviewLocked } from '@/lib/president-preview';
import {backendError,json,readBody} from '@/lib/backend/http';
import {InputError,reviewInput,type OrderReview} from '@/lib/backend/validation';
export const runtime='nodejs';
export async function POST(request:Request){
 if(presidentPreviewLocked())return json({code:'preview_read_only',message:'Order review is disabled in the President preview.'},403);
 try{
  const input=reviewInput(await readBody(request));
  const catalog=await publicCatalog();
  if(!catalog.available)return backendError('backend_unavailable');
  const items:OrderReview['items']=[];
  for(const line of input.lines){
   const p=catalog.products.find(p=>p.id===line.productId);
   if(!p)return backendError('product_unavailable');
   const v=p.offers.find(v=>v.id===line.variantId);
   if(!v||!v.enabled)return backendError('variant_unavailable');
   if((v.stock??0)<line.quantity)return backendError('insufficient_stock');
   if(!v.price||!Number.isSafeInteger(v.price.minor)||v.price.minor<0)return backendError('backend_unavailable');
   items.push({...line,name:p.name,variant:[v.variant,v.size].filter(Boolean).join(" / "),unitPriceCents:v.price.minor,lineTotalCents:v.price.minor*line.quantity});
  }
  const total=items.reduce((sum,l)=>sum+l.lineTotalCents,0);
  if(!Number.isSafeInteger(total)||total>2147483647)return backendError('invalid_order');
  const result:OrderReview={currency:'AUD',demo:true,fulfilment:'pickup',items,subtotalCents:total,shippingCents:0,totalCents:total};
  return json(result);
 }catch(error){if(error instanceof InputError)return json({code:error.code,message:error.message},400);return backendError('backend_unavailable');}
}

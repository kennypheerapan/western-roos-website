'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { database } from '@/lib/backend/server';
import { productWritable } from '@/lib/admin/product-config';
import { productSaveInput, type ProductSaveResult } from '@/lib/admin/product-contract';
export async function saveProduct(raw:unknown):Promise<ProductSaveResult>{
  const actor=await requireAdmin();
  let input;try{input=productSaveInput(raw);}catch(e){return {ok:false,retry:'edit',message:e instanceof Error?e.message:'Review the fields.'};}
  if(!productWritable(input.productId))return {ok:false,retry:'edit',message:'Product writes are disabled or this product is not on the server allowlist.'};
  try{
    const db=database();if(!db)return {ok:false,retry:'edit',message:'Catalog storage is unavailable. Nothing was sent.'};
    // Independently confirm the database identity. RPC repeats these checks under lock.
    const p=await db.from('products').select('id,brand,is_demo,currency').eq('id',input.productId).single();
    if(p.error||!p.data||p.data.brand!=='marlins'||p.data.is_demo!==true||p.data.currency!=='AUD')return {ok:false,retry:'edit',message:'This product is not available for demo editing.'};
    const r=await db.rpc('save_demo_product',{p_actor_id:actor.id,p_input:input});
    if(r.error){
      if(['catalog_stale','catalog_operation_conflict'].includes(r.error.message))return {ok:false,retry:'refresh',message:'The product changed or the operation conflicts. Keep your draft, reload deliberately and review the current values.'};
      if(r.error.message==='catalog_invalid'||r.error.message==='catalog_not_allowed')return {ok:false,retry:'edit',message:'The change was rejected. Check the fields and demo product identity.'};
      if(['PGRST202','42883'].includes(r.error.code))return {ok:false,retry:'edit',message:'BUILD 18 catalog storage is not installed. No change was saved.'};
      return {ok:false,retry:'same',message:'Save outcome is uncertain. Keep this page open and retry the same operation.'};
    }
    if(r.data?.operationId!==input.operationId)throw Error('Unknown receipt');
  }catch{return {ok:false,retry:'same',message:'Save outcome is uncertain. Keep this page open and retry the same operation.'};}
  for(const path of ['/shop',`/shop/${input.productId}`,'/shop/cart','/checkout','/admin/products',`/admin/products/${input.productId}`])revalidatePath(path);
  return {ok:true,operationId:input.operationId};
}

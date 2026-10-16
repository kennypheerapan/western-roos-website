import 'server-only';
import { requireAdmin } from './auth';
import { database } from '../backend/server';
import { catalogIds, catalogId } from '../shop/catalog-identity';
import type { ProductRow, VariantRow } from './product-contract';
const productFields='id,slug,name,brand,category,description,image_path,price_cents,currency,active,is_demo,updated_at';
const variantFields='product_id,id,size,label,sku,active,stock_quantity,updated_at';
export async function adminProducts(){
  await requireAdmin();try{const db=database();if(!db)throw Error();const [p,v]=await Promise.all([db.from('products').select(productFields).in('id',[...catalogIds]).eq('brand','marlins').eq('is_demo',true),db.from('product_variants').select(variantFields).in('product_id',[...catalogIds])]);if(p.error||v.error)throw Error();return {available:true,products:p.data as ProductRow[],variants:v.data as VariantRow[]};}catch{return {available:false,products:[],variants:[]};}
}
export async function adminProduct(id:string){
  await requireAdmin();if(!catalogId(id))return null;
  const result=await adminProducts();if(!result.available)throw Error('Catalog unavailable');
  const product=result.products.find(p=>p.id===id);return product?{product,variants:result.variants.filter(v=>v.product_id===id)}:null;
}
export type CatalogEvent = {operation_id:string;actor_user_id:string;created_at:string;changes:Record<string,unknown>;variant_ids:string[];stock_reason:string};
export async function catalogHistory(id:string){
  await requireAdmin();if(!catalogId(id))return {available:false,events:[]};
  try{const db=database();if(!db)throw Error();const r=await db.from('catalog_events').select('operation_id,actor_user_id,created_at,changes,variant_ids,stock_reason').eq('product_id',id).order('created_at',{ascending:false}).order('operation_id').limit(20);if(r.error)throw Error();return {available:true,events:r.data as CatalogEvent[]};}catch{return {available:false,events:[]};}
}

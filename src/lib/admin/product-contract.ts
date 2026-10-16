import { catalogId, catalogCategories } from '../shop/catalog-identity';
import { UUID } from './policy';
export type ProductRow = {id:string;slug:string;name:string;brand:string;category:string;description:string;image_path:string;price_cents:number;currency:string;active:boolean;is_demo:boolean;updated_at:string};
export type VariantRow = {product_id:string;id:string;size:string|null;label:string;sku:string|null;active:boolean;stock_quantity:number;updated_at:string};
export type ProductChanges = Partial<Pick<ProductRow,'name'|'description'|'category'|'price_cents'|'active'>>;
export type VariantChange = {id:string;expectedVersion:string;changes:Partial<Pick<VariantRow,'active'|'stock_quantity'>>};
export type ProductSave = {operationId:string;productId:string;expectedVersion:string;changes:ProductChanges;variants:VariantChange[];reason:string};
export type ProductSaveResult = {ok:true;operationId:string} | {ok:false;retry:'edit'|'same'|'refresh';message:string};
const version = (s:unknown) => typeof s==='string' && /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:?\d{2})$/.test(s) && Number.isFinite(Date.parse(s));
function object(v:unknown):Record<string,unknown>{if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Invalid product change.');return v as Record<string,unknown>;}
function keys(v:Record<string,unknown>,allowed:string[]){if(Object.keys(v).some(k=>!allowed.includes(k)))throw Error('A read-only or unknown field was submitted.');}
export function audCents(raw:string):number {
  if(!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(raw))throw Error('Enter an AUD price with at most two decimal places.');
  const [whole,fraction='']=raw.split('.');const cents=BigInt(whole)*BigInt(100)+BigInt(fraction.padEnd(2,'0'));
  if(cents>BigInt(2147483647))throw Error('Price must not exceed AUD 21,474,836.47.');return Number(cents);
}
export function productSaveInput(raw:unknown):ProductSave {
  const v=object(raw);keys(v,['operationId','productId','expectedVersion','changes','variants','reason']);
  if(typeof v.operationId!=='string'||!UUID.test(v.operationId)||!catalogId(v.productId)||!version(v.expectedVersion))throw Error('Refresh the product before editing.');
  const c=object(v.changes);keys(c,['name','description','category','price_cents','active']);
  if('name'in c&&(typeof c.name!=='string'||!c.name.trim()||c.name.length>120))throw Error('Name must be 1–120 characters.');
  if('description'in c&&(typeof c.description!=='string'||c.description.length>3000))throw Error('Description must be at most 3,000 characters.');
  if('category'in c&&!(catalogCategories as readonly unknown[]).includes(c.category))throw Error('Choose a supported category.');
  if('price_cents'in c&&(!Number.isInteger(c.price_cents)||(c.price_cents as number)<0||(c.price_cents as number)>2147483647))throw Error('Invalid price.');
  if('active'in c&&typeof c.active!=='boolean')throw Error('Invalid active state.');
  if(!Array.isArray(v.variants)||v.variants.length>48)throw Error('Invalid variants.');
  const seen=new Set<string>();
  const variants=v.variants.map(raw=>{const a=object(raw);keys(a,['id','expectedVersion','changes']);if(typeof a.id!=='string'||!a.id||a.id.length>100||seen.has(a.id)||!version(a.expectedVersion))throw Error('Invalid or duplicate variant.');seen.add(a.id);const b=object(a.changes);keys(b,['active','stock_quantity']);if(!Object.keys(b).length)throw Error('Empty variant change.');if('active'in b&&typeof b.active!=='boolean')throw Error('Invalid size availability.');if('stock_quantity'in b&&(!Number.isInteger(b.stock_quantity)||(b.stock_quantity as number)<0||(b.stock_quantity as number)>2147483647))throw Error('Test stock must be an integer from 0 to 2,147,483,647.');return {id:a.id,expectedVersion:a.expectedVersion as string,changes:b} as VariantChange;});
  if(!Object.keys(c).length&&!variants.length)throw Error('There are no pending changes.');
  if(typeof v.reason!=='string'||v.reason.length>500||v.reason.includes('\0')||variants.some(v=>'stock_quantity'in v.changes)&&v.reason.trim().length<3)throw Error('Stock adjustments require an internal reason of 3–500 characters.');
  if(Object.values(c).some(x=>typeof x==='string'&&x.includes('\0')))throw Error('Invalid text.');
  return {operationId:v.operationId,productId:v.productId,expectedVersion:v.expectedVersion as string,changes:c as ProductChanges,variants:variants.sort((a,b)=>a.id<b.id?-1:1),reason:v.reason.trim()};
}

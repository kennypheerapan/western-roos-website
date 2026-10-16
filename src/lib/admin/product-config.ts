import 'server-only';
import { presidentPreviewLocked } from '../president-preview';
import { catalogId } from '../shop/catalog-identity';
export function productWriteIds():Set<string>|null {
  const raw=process.env.ADMIN_PRODUCT_WRITE_ALLOWED_IDS;if(!raw)return null;
  const ids=raw.split(',').map(s=>s.trim());return ids.every(catalogId)?new Set(ids):null;
}
export function productWritable(id:string){return !presidentPreviewLocked() && process.env.ADMIN_PRODUCT_WRITES_ENABLED==='true' && !!productWriteIds()?.has(id);}

import 'server-only';
import { presidentPreviewLocked } from '../president-preview';
import { products as reviewArtwork } from '@/data/shop';
import { database } from '../backend/server';
import { catalogIds, catalogCategories, catalogImage, artworkDimensions } from './catalog-identity';
import type { Product } from './domain';
export type CatalogResult = { available: boolean; products: Product[] };
// Public projection: no audit, actor, timestamps, stock reasons or private tables.
export async function publicCatalog(): Promise<CatalogResult> {
  if (presidentPreviewLocked()) return { available: true, products: reviewArtwork };
  try {
    const db = database(); if (!db) return { available: false, products: [] };
    const [p, v] = await Promise.all([
      db.from('products').select('id,slug,name,brand,category,description,image_path,price_cents,currency,active,is_demo').in('id', [...catalogIds]).eq('brand','marlins').eq('is_demo',true).eq('active',true),
      db.from('product_variants').select('product_id,id,size,label,active,stock_quantity').in('product_id',[...catalogIds]),
    ]);
    if (p.error || v.error) throw Error('Unavailable');
    const products: Product[] = p.data.map(row => {
      if (row.currency !== 'AUD' || !Number.isInteger(row.price_cents) || row.price_cents < 0 || row.image_path !== catalogImage(row.id) || !catalogCategories.includes(row.category)) throw Error('Invalid catalog');
      const variants=v.data.filter(o=>o.product_id===row.id);
      if(!variants.length||variants.some(o=>!Number.isInteger(o.stock_quantity)||o.stock_quantity<0||typeof o.active!=='boolean'))throw Error('Invalid variants');
      return { id:row.id, name:row.name, brand:'marlins', category:row.category, description:row.description, image:row.image_path, ...artworkDimensions(row.id), alt:`West Coast Marlins ${row.name}`, offers:variants.map(o=>({id:o.id,size:o.size,variant:o.label===o.size?null:o.label,sku:null,enabled:o.active,stock:o.stock_quantity,price:{currency:'AUD',minor:row.price_cents},dataMode:'demo'})) };
    });
    return {available:true,products:products.sort((a,b)=>catalogIds.indexOf(a.id as typeof catalogIds[number])-catalogIds.indexOf(b.id as typeof catalogIds[number]))};
  } catch { return {available:false,products:[]}; }
}

import { available, MAX_QUANTITY, type CartLine, type Product } from './domain';
// Stored selections survive availability changes. Never silently drop or clamp them.
export function storedSelections(raw: string | null): CartLine[] {
  try {
    const data = JSON.parse(raw ?? 'null'); if (data?.version !== 1 || !Array.isArray(data.lines)) return [];
    const seen = new Set<string>();
    return data.lines.slice(0,100).filter((v: CartLine) => {
      if (!v || typeof v.productId !== 'string' || typeof v.offerId !== 'string' || v.productId.length>150 || v.offerId.length>150 || !Number.isInteger(v.quantity) || v.quantity<1 || v.quantity>MAX_QUANTITY) return false;
      const key=JSON.stringify([v.productId,v.offerId]); if(seen.has(key))return false; seen.add(key); return true;
    }).map((v:CartLine)=>({productId:v.productId,offerId:v.offerId,quantity:v.quantity}));
  } catch { return []; }
}
export function cartIssue(line: CartLine, products: Product[]): string | null {
  const p=products.find(p=>p.id===line.productId), o=p?.offers.find(o=>o.id===line.offerId);
  if(!p)return 'This product is unavailable. Remove it to continue.';
  if(!o || !available(o))return 'This size is unavailable. Remove it or choose a size on the product page.';
  if(line.quantity>o.stock!)return `Only ${o.stock} units are available in the test catalog. Adjust the quantity.`;
  return null;
}

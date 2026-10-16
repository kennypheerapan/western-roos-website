export type BrandId = 'western-roos' | 'united' | 'marlins';
export type Category = 'Playing' | 'Training' | 'Outerwear' | 'Accessories';
export type Money = { currency: string; minor: number };
export type Offer = {
  dataMode?: 'demo';
  id: string; variant: string | null; size: string | null; sku: string | null;
  price: Money | null; stock: number | null; enabled: boolean;
};
export type Product = {
  id: string; name: string; brand: BrandId; category: Category; description: string;
  image: string; width: number; height: number; alt: string; offers: Offer[];
};
// A guest is a first-class customer. Account association is optional, for a later build.
export type CustomerReference = { kind: 'guest' } | { kind: 'member'; accountId: string };
export type CheckoutConfiguration = {
  shippingRules: string | null; pickupRules: string | null; returnsPolicy: string | null;
  paymentEnabled: boolean;
};
export const checkoutConfiguration: CheckoutConfiguration = {
  shippingRules: null, pickupRules: null, returnsPolicy: null, paymentEnabled: false,
};
export type CartLine = { productId: string; offerId: string; quantity: number };
export const CART_KEY = 'wrtsc.merchandise.cart.v1';
export const MAX_QUANTITY = 99;
export function available(offer: Offer): boolean {
  return offer.enabled && offer.price !== null && Number.isSafeInteger(offer.price.minor)
    && offer.price.minor >= 0 && /^[A-Z]{3}$/.test(offer.price.currency)
    && offer.stock !== null && Number.isSafeInteger(offer.stock) && offer.stock > 0;
}
export function normalizeCart(value: unknown, products: Product[]): CartLine[] {
  if (!Array.isArray(value)) return [];
  const lines: CartLine[] = [];
  for (const raw of value.slice(0, 100)) {
    if (!raw || typeof raw !== 'object') continue;
    const {productId, offerId, quantity} = raw;
    const offer = products.find(p => p.id === productId)?.offers.find(o => o.id === offerId);
    if (!offer || !available(offer) || !Number.isSafeInteger(quantity) || quantity <= 0) continue;
    const existing = lines.find(l => l.productId === productId && l.offerId === offerId);
    const amount = Math.min(MAX_QUANTITY, offer.stock!, quantity + (existing?.quantity ?? 0));
    if (existing) existing.quantity = amount;
    else lines.push({productId, offerId, quantity: amount});
  }
  // Mixed currencies require separate checkout flows; never silently sum them.
  const currency = lines[0] && products.find(p => p.id === lines[0].productId)!.offers.find(o => o.id === lines[0].offerId)!.price!.currency;
  return lines.filter(l => products.find(p => p.id === l.productId)!.offers.find(o => o.id === l.offerId)!.price!.currency === currency);
}
export type CartAction = {type:'clear'} | { type: 'add'; line: CartLine } | { type: 'quantity'; productId: string; offerId: string; quantity: number } | { type: 'remove'; productId: string; offerId: string };
export function changeCart(lines: CartLine[], action: CartAction, products: Product[]): CartLine[] {
  if (action.type === 'clear') return [];
  if (action.type === 'add') return normalizeCart([...lines, action.line], products);
  const matches = (l: CartLine) => l.productId === action.productId && l.offerId === action.offerId;
  if (action.type === 'remove') return normalizeCart(lines.filter(l => !matches(l)), products);
  if (!Number.isSafeInteger(action.quantity) || action.quantity < 1) return normalizeCart(lines, products);
  return normalizeCart(lines.map(l => matches(l) ? {...l, quantity: action.quantity} : l), products);
}
export function readCart(raw: string | null, products: Product[]): CartLine[] {
  try { const value = JSON.parse(raw ?? 'null'); return value?.version === 1 ? normalizeCart(value.lines, products) : []; } catch { return []; }
}
export function serializeCart(lines: CartLine[]): string { return JSON.stringify({version:1, lines:lines.map(({productId,offerId,quantity})=>({productId,offerId,quantity}))}); }
export function cartSubtotal(lines: CartLine[], products: Product[]): Money | null {
  const valid = normalizeCart(lines, products);
  if (!valid.length) return null;
  return valid.reduce((sum, l) => {
    const price = products.find(p => p.id === l.productId)!.offers.find(o => o.id === l.offerId)!.price!;
    return {currency: price.currency, minor: sum.minor + price.minor * l.quantity};
  }, {currency:'', minor:0});
}
export function formatMoney(money: Money): string {
  return new Intl.NumberFormat('en-AU', {style:'currency', currency:money.currency}).format(money.minor / 100);
}

export type Customer = {firstName:string;lastName:string;email:string;phone:string};
export type FulfilmentMethod = 'pickup' | 'shipping';
export type OrderStatus = 'demo' | 'pending' | 'confirmed' | 'processing' | 'ready_for_pickup' | 'shipped' | 'completed' | 'cancelled';
export type PaymentStatus = 'not_processed' | 'pending' | 'paid' | 'failed' | 'refunded';
import { normalizeCart, type CartLine, type Product, type Money } from './domain';
export type CartItem = {productId:string;offerId:string;name:string;image:string;size:string;unitPrice:Money;quantity:number};
export type Cart = {items:CartItem[];subtotal:Money};
export type OrderItem = CartItem & {lineTotal:Money};
export type Order = {reference:string;mode:'demo';status:OrderStatus;paymentStatus:PaymentStatus;customer:Customer;items:OrderItem[];subtotal:Money;fulfilment:FulfilmentMethod;createdAt:string};
export const demoFulfilment = {pickup:{enabled:true,message:'Pickup details will be confirmed before orders open.'},shipping:{enabled:false,message:'Shipping — coming later'}} as const;
export function resolveCart(lines:CartLine[],products:Product[]):Cart {
 const items=normalizeCart(lines,products).map(line=>{
  const product=products.find(p=>p.id===line.productId)!;
  const offer=product.offers.find(o=>o.id===line.offerId)!;
  return {...line,name:product.name,image:product.image,size:offer.size ?? 'Standard',unitPrice:{...offer.price!}};
 });
 return {items,subtotal:{currency:'AUD',minor:items.reduce((n,i)=>n+i.unitPrice.minor*i.quantity,0)}};
}
export function validateCustomer(customer:Customer):Partial<Record<keyof Customer,string>> {
 const errors:Partial<Record<keyof Customer,string>>={};
 if(!customer.firstName.trim())errors.firstName='Enter your first name.';
 if(!customer.lastName.trim())errors.lastName='Enter your last name.';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()))errors.email='Enter a valid email address.';
 if(!/^[+\d\s().-]+$/.test(customer.phone.trim()) || customer.phone.replace(/\D/g,'').length<8 || customer.phone.replace(/\D/g,'').length>15)errors.phone='Enter a valid phone number (8–15 digits).';
 return errors;
}
// Provider-independent boundary. Future live implementation needs server validation,
// authoritative pricing/stock, idempotency and provider callbacks; this adapter is local only.
export interface OrderGateway {place(input:{customer:Customer;cart:Cart;fulfilment:FulfilmentMethod}):Order}
export const demoOrderGateway:OrderGateway={place({customer,cart,fulfilment}){
 if(Object.keys(validateCustomer(customer)).length || !cart.items.length || fulfilment!=='pickup')throw new Error('Review the customer, cart and pickup selection.');
 return {reference:`DEMO-WR-${crypto.randomUUID().toUpperCase()}`,mode:'demo',status:'demo',paymentStatus:'not_processed',customer:{...customer},items:cart.items.map(i=>({...i,unitPrice:{...i.unitPrice},lineTotal:{currency:i.unitPrice.currency,minor:i.unitPrice.minor*i.quantity}})),subtotal:{...cart.subtotal},fulfilment,createdAt:new Date().toISOString()};
}};

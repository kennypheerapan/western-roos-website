import { validateApplication } from '../membership/application';
import type { ApplicationDraft } from '../membership/domain';
import { validateCustomer, type Customer } from '../shop/orders';

export class InputError extends Error {
  constructor(message:string,public code='invalid_request'){super(message);}
}
export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InputError('Please review the submitted details.');
  return value as Record<string, unknown>;
}
function text(value: unknown, max: number): string {
  if (typeof value !== 'string' || value.length > max) throw new InputError('Please review the submitted details.');
  return value.trim();
}
export function requestKey(value: unknown): string {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) throw new InputError('Please refresh and try again.');
  return value;
}
export function membershipInput(raw: unknown): ApplicationDraft {
  const r = record(raw), p = record(r.participation);
  const pathway = p.pathway;
  let participation: ApplicationDraft['participation'];
  if (pathway === 'united') participation = {pathway, involvement: text(p.involvement,20) as 'player', preference: text(p.preference,20) as 'social', experience: text(p.experience,1500)};
  else if (pathway === 'marlins') participation = {pathway, representativeInterest: text(p.representativeInterest,20) as 'playing', tournamentInterest: text(p.tournamentInterest,1500), experience:text(p.experience,1500)};
  else if (pathway === 'not-sure') participation = {pathway, guidance:text(p.guidance,1500)};
  else throw new InputError('Choose a participation pathway.');
  if (!Array.isArray(r.experience) || r.experience.length > 8 || r.experience.some(x=>typeof x !== 'string')) throw new InputError('Choose your experience or roles.');
  const value: ApplicationDraft = {participation, firstName:text(r.firstName,100), lastName:text(r.lastName,100), dateOfBirth:text(r.dateOfBirth,10), email:text(r.email,254), phone:text(r.phone,40), experience:r.experience as ApplicationDraft['experience'], emergencyName:text(r.emergencyName,100), emergencyRelationship:text(r.emergencyRelationship,100), emergencyPhone:text(r.emergencyPhone,40), notes:text(r.notes,3000), previewAcknowledgement:r.previewAcknowledgement === true};
  if (Object.keys(validateApplication(value)).length) throw new InputError('Please review all application fields and acknowledge the submission notice.');
  return value;
}
export type ReviewLine = {productId:string;variantId:string;quantity:number};
export type ReviewedLine = ReviewLine & {reviewedUnitPriceCents:number};
export type OrderInput = {customer:Customer; fulfilment:'pickup';reviewedCurrency:'AUD';lines:ReviewedLine[]};
export type OrderReview = {currency:'AUD';demo:true;fulfilment:'pickup';items:(ReviewLine & {name:string;variant:string;unitPriceCents:number;lineTotalCents:number})[];subtotalCents:number;shippingCents:0;totalCents:number};
export function reviewInput(raw:unknown):{fulfilment:'pickup';lines:ReviewLine[]} {
  const r=record(raw);
  if(r.fulfilment !== 'pickup') throw new InputError('Only test pickup is available.');
  if(!Array.isArray(r.lines) || r.lines.length < 1 || r.lines.length > 50) throw new InputError('Your cart must contain between 1 and 50 lines.');
  const seen=new Set<string>();
  const lines=r.lines.map(raw=>{
    const l=record(raw), productId=text(l.productId,100), variantId=text(l.variantId,100), quantity=l.quantity;
    if(!productId || !variantId || !Number.isSafeInteger(quantity) || (quantity as number)<1 || (quantity as number)>99) throw new InputError('Choose a valid product, variant and quantity (1–99).');
    const key=JSON.stringify([productId,variantId]);
    if(seen.has(key)) throw new InputError('Combine duplicate cart lines before submitting.');
    seen.add(key);
    return {productId,variantId,quantity:quantity as number};
  });
  // Locale-independent ordering makes equivalent carts hash identically.
  lines.sort((a,b)=>a.productId<b.productId?-1:a.productId>b.productId?1:a.variantId<b.variantId?-1:a.variantId>b.variantId?1:0);
  return {fulfilment:'pickup',lines};
}
export function orderInput(raw: unknown): OrderInput {
  const r=record(raw), c=record(r.customer),review=reviewInput(r);
  const customer = {firstName:text(c.firstName,100),lastName:text(c.lastName,100),email:text(c.email,254),phone:text(c.phone,40)};
  if(Object.keys(validateCustomer(customer)).length) throw new InputError('Please review your contact details.');
  if(r.reviewedCurrency!=='AUD')throw new InputError('Review the current AUD prices before confirming.','review_required');
  const originals=(r.lines as unknown[]).map(record);
  const lines=review.lines.map(line=>{
    const input=originals.find(l=>text(l.productId,100)===line.productId&&text(l.variantId,100)===line.variantId)!;
    const price=input.reviewedUnitPriceCents;
    if(!Number.isSafeInteger(price)||(price as number)<0||(price as number)>2147483647)throw new InputError('Review the current prices before confirming.','review_required');
    return {...line,reviewedUnitPriceCents:price as number};
  });
  const total=lines.reduce((sum,l)=>sum+l.quantity*l.reviewedUnitPriceCents,0);
  if(!Number.isSafeInteger(total)||total>2147483647)throw new InputError('The reviewed total is too large.','invalid_order');
  // Only comparison prices survive. Arbitrary totals, status and hashes do not.
  return {customer,fulfilment:'pickup',reviewedCurrency:'AUD',lines};
}
export type OrderReceipt = {reference:string;status:'pending';paymentStatus:'unpaid';currency:'AUD';subtotalCents:number;shippingCents:number;totalCents:number;demo:true;items:{name:string;variant:string;quantity:number;unitPriceCents:number;lineTotalCents:number}[]};

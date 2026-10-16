'use client';
import Link from 'next/link';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {cartIssue} from '@/lib/shop/cart-current';
import {formatMoney} from '@/lib/shop/domain';
import {demoFulfilment,resolveCart,validateCustomer,type Customer,type Cart} from '@/lib/shop/orders';
import {useCart} from './cart-provider';
import {useBackend,postSubmission,SubmissionError} from '@/lib/backend/client';
import type {OrderReceipt,OrderReview,OrderInput} from '@/lib/backend/validation';
const fields = [{key:'firstName',label:'First name',auto:'given-name',type:'text'},{key:'lastName',label:'Last name',auto:'family-name',type:'text'},{key:'email',label:'Email',auto:'email',type:'email'},{key:'phone',label:'Phone',auto:'tel',type:'tel'}] as const;
function Items({cart,review,previous}:{cart:Cart;review?:OrderReview;previous?:OrderReview}){
 const items=review?.items??cart.items.map(i=>({productId:i.productId,variantId:i.offerId,name:i.name,variant:i.size,quantity:i.quantity,unitPriceCents:i.unitPrice.minor,lineTotalCents:i.unitPrice.minor*i.quantity}));
 return <section className="checkout-panel"><h2>Items</h2>{items.map(item=>{const old=previous?.items.find(i=>i.productId===item.productId&&i.variantId===item.variantId);return <div className="checkout-item" key={JSON.stringify([item.productId,item.variantId])}><div><strong>{item.name}</strong><p>{item.variant} · Quantity {item.quantity}</p><p className="shop-muted">{formatMoney({currency:'AUD',minor:item.unitPriceCents})} each</p>{old&&old.unitPriceCents!==item.unitPriceCents&&<p>Price changed: {formatMoney({currency:'AUD',minor:old.unitPriceCents})} → {formatMoney({currency:'AUD',minor:item.unitPriceCents})}</p>}</div><strong>{formatMoney({currency:'AUD',minor:item.lineTotalCents})}</strong></div>})}<div className="checkout-item"><strong>{review?'Reviewed total (AUD)':'Demo estimate (AUD)'}</strong><strong>{formatMoney({currency:'AUD',minor:review?.totalCents??cart.subtotal.minor})}</strong></div></section>;
}
function CustomerSummary({customer}:{customer:Customer}){return <section className="checkout-panel"><h2>Customer</h2><p>{customer.firstName} {customer.lastName}</p><p>{customer.email}</p><p>{customer.phone}</p><h2>Fulfilment</h2><p>Pickup</p><p className="shop-muted">{demoFulfilment.pickup.message}</p></section>}
export function Checkout(){
 const {lines,ready,dispatch,products,catalogAvailable}=useCart();
 const backend=useBackend();
 const submission=useRef<{signature:string;key:string;payload:OrderInput;snapshot:OrderReview}|null>(null);
 const [uncertain,setUncertain]=useState(false);
 const [busy,setBusy]=useState(false);
 const [customer,setCustomer]=useState<Customer>({firstName:'',lastName:'',email:'',phone:''});
 const [errors,setErrors]=useState<Partial<Record<keyof Customer,string>>>({});
 const [review,setReview]=useState<{signature:string;snapshot:OrderReview;previous?:OrderReview}|null>(null);
 const [order,setOrder]=useState<OrderReceipt|null>(null);
 const [message,setMessage]=useState('');
 const title=useRef<HTMLHeadingElement>(null);
 const placed=useRef(false);
 const cart=resolveCart(lines,products);
 const signature=JSON.stringify(cart);
 const latestSignature=useRef(signature);
 useLayoutEffect(()=>{latestSignature.current=signature;},[signature]);
 const reviewing=review!==null && (review.signature===signature||uncertain);
 useEffect(()=>{title.current?.focus();},[review,order]);
 async function loadReview(previous?:OrderReview){
  setReview(null);
  try{
   const snapshot:OrderReview=await postSubmission('/api/orders/review',{fulfilment:'pickup',lines:lines.map(l=>({productId:l.productId,variantId:l.offerId,quantity:l.quantity}))});
   if(latestSignature.current!==signature){setMessage('Your cart changed. Please review it again.');return;}
   setReview({signature,snapshot,previous});
  }catch(error){setMessage(error instanceof Error?error.message:'The current prices could not be loaded. Please try again.');}
 }
 async function submit(event:React.FormEvent){
  event.preventDefault();if(placed.current||uncertain)return;
  const clean=Object.fromEntries(Object.entries(customer).map(([k,v])=>[k,v.trim()])) as Customer;
  const found=validateCustomer(clean);setErrors(found);
  if(Object.keys(found).length){document.getElementById('customer-'+Object.keys(found)[0])?.focus();return;}
  setCustomer(clean);setMessage('');placed.current=true;setBusy(true);
  try{await loadReview();}finally{placed.current=false;setBusy(false);}
 }
 async function confirm(){
  if(placed.current||!reviewing||!review)return;
  placed.current=true;setBusy(true);setMessage('');
  if(!submission.current){
   const payload:OrderInput={customer:{...customer},fulfilment:'pickup',reviewedCurrency:review.snapshot.currency,lines:review.snapshot.items.map(i=>({productId:i.productId,variantId:i.variantId,quantity:i.quantity,reviewedUnitPriceCents:i.unitPriceCents}))};
   submission.current={signature:review.signature,key:crypto.randomUUID(),payload,snapshot:review.snapshot};
  }
  const attempt=submission.current;setUncertain(true);
  try{
   const result:OrderReceipt=await postSubmission('/api/orders',{...attempt.payload,requestKey:attempt.key});
   setCustomer(attempt.payload.customer);setOrder(result);setUncertain(false);
   if(latestSignature.current===attempt.signature)dispatch({type:'clear'});
  }catch(error){
   const message=error instanceof Error?error.message:'Order creation could not be confirmed. Please retry.';setMessage(message);
   if(error instanceof SubmissionError&&error.definitive){
    submission.current=null;setUncertain(false);
    if(error.code==='price_changed'){await loadReview(attempt.snapshot);}else{setReview(null);}
   }
  }finally{placed.current=false;setBusy(false);}
 }
 if(!ready)return <p role="status">Loading checkout…</p>;
 if(order)return <><header className="shop-cart-heading"><p className="eyebrow">Order created · Test catalog</p><h1 ref={title} tabIndex={-1}>Payment not completed</h1><p className="order-reference">{order.reference}</p></header><div className="shop-notice"><strong>Your unpaid test order was saved.</strong><p>No payment was processed. This is not a completed purchase. No email was sent. No fulfilment has been requested. Stock is not reserved.</p></div><div className="checkout-grid"><section className="checkout-panel"><h2>Saved order</h2>{order.items.map((item,i)=><div className="checkout-item" key={i}><div><strong>{item.name}</strong><p>{item.variant} · Quantity {item.quantity}</p></div><strong>{formatMoney({currency:order.currency,minor:item.lineTotalCents})}</strong></div>)}<p>Total: {formatMoney({currency:order.currency,minor:order.totalCents})} (demo prices)</p></section><CustomerSummary customer={customer}/></div><Link className="shop-action" href="/shop">Continue shopping →</Link></>;
 if(!uncertain&&(catalogAvailable!==true||lines.some(l=>cartIssue(l,products))))return <section className="shop-notice"><h1>Review your cart</h1><p>{catalogAvailable===null?'Loading current catalog…':catalogAvailable===false?'Current catalog is unavailable. Your selections are retained.':'A product, size or stock level has changed. Adjust your cart before checkout.'}</p><Link href="/shop/cart">Return to cart →</Link></section>;
 if(!cart.items.length&&!uncertain)return <header className="shop-cart-heading"><h1 ref={title} tabIndex={-1}>Your cart is empty</h1><p>Add merchandise to try guest checkout.</p><Link className="shop-action" href="/shop">Continue shopping →</Link></header>;
 return <><header className="shop-cart-heading"><p className="eyebrow">Guest checkout · Test catalog</p><h1 ref={title} tabIndex={-1}>{reviewing?'Review your order':'Checkout'}</h1><p>No membership required. No payment will be taken.</p><ol className="checkout-steps" aria-label="Checkout progress"><li aria-current={!reviewing?'step':undefined}>1. Details</li><li aria-current={reviewing?'step':undefined}>2. Review</li><li>3. Unpaid confirmation</li></ol></header>{review!==null&&!reviewing&&<p role="status" className="shop-notice">Your cart changed. Please review your updated order.</p>}<p role="alert">{message}</p><div className="checkout-grid"><div>{reviewing?<><CustomerSummary customer={customer}/><div className="checkout-actions"><button disabled={busy||uncertain} onClick={()=>{setReview(null);submission.current=null;}}>Edit details</button>{!busy&&!uncertain&&<Link className="shop-back" href="/shop/cart">Edit cart →</Link>}</div><section className="checkout-panel"><h2>Payment</h2><p>Secure online payment will be enabled before the store opens.</p><p className="shop-notice">{backend.message} A connected submission creates an unpaid test order. Stock is not reserved.</p><button className="shop-action" disabled={busy} onClick={confirm}>{busy?'Creating order…':uncertain?'Retry the same order':'Create unpaid test order'}</button>{uncertain&&!busy&&<p role="status">The previous result is uncertain. Retry the same order before editing details or starting another order. Keep this page open.</p>}</section></>:<form onSubmit={submit} noValidate className="checkout-panel"><h2>Your details</h2><p className="shop-muted">All fields required. Submitting saves your contact details privately when the backend is connected. Use sample details for testing.</p>{Object.keys(errors).length>0&&<p role="alert">Please check the highlighted fields.</p>}<div className="checkout-fields">{fields.map(field=><label key={field.key} htmlFor={`customer-${field.key}`}>{field.label}<input id={`customer-${field.key}`} aria-label={field.label} type={field.type} autoComplete={field.auto} required maxLength={field.key==='email'?254:100} value={customer[field.key]} onChange={e=>{setCustomer({...customer,[field.key]:e.target.value});setErrors(current=>{const next={...current};delete next[field.key];return next;});}} aria-invalid={!!errors[field.key]} aria-describedby={errors[field.key]?`error-${field.key}`:undefined}/>{errors[field.key]&&<span className="checkout-error" id={`error-${field.key}`}>{errors[field.key]}</span>}</label>)}</div><fieldset><legend>Fulfilment</legend><label className="fulfilment-option"><input type="radio" name="fulfilment" value="pickup" defaultChecked/> Pickup (preview)</label><p className="shop-muted">{demoFulfilment.pickup.message}</p><label className="fulfilment-option"><input type="radio" name="fulfilment" value="shipping" disabled/> {demoFulfilment.shipping.message}</label></fieldset><button className="shop-action" type="submit" disabled={busy}>{busy?'Loading current prices…':'Review order →'}</button><Link className="shop-back" href="/shop/cart">Edit cart →</Link></form>}</div><Items cart={cart} review={reviewing?review?.snapshot:undefined} previous={reviewing?review?.previous:undefined}/></div><p className="shop-muted">The final review uses current database prices. No payment is taken.</p></>;
}

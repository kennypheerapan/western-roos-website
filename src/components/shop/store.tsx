'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { catalogCategories as categories } from '@/lib/shop/catalog-identity';
import { cartIssue } from '@/lib/shop/cart-current';
const shopBrands={marlins:'West Coast Marlins',united:'United Softball Club','western-roos':'Western Roos'};
import { available, cartSubtotal, formatMoney, MAX_QUANTITY, type Product } from '@/lib/shop/domain';
import { useCart } from './cart-provider';
export function ShopNavigation() {
  const {lines,ready,storageError} = useCart();
  const count=lines.reduce((n,l)=>n+l.quantity,0);
  return <><nav className="shop-nav" aria-label="Merchandise"><Link href="/shop">Merchandise</Link><Link href="/shop/cart">Cart <span aria-live="polite">({ready ? count : 0})</span></Link></nav>{storageError && <p role="status" className="shop-notice">Your browser could not save the cart. It will last only for this visit.</p>}</>;
}
export function ProductImage({product,priority=false}: {product:Product;priority?:boolean}) {
  return <div className="shop-image"><Image src={product.image} alt={product.alt} width={product.width} height={product.height} priority={priority} /></div>;
}
export function Storefront({products}: {products:Product[]}) {
  const [category,setCategory] = useState('All');
  const artworkOnly = products.every(p => p.offers.length === 0);
  const shown=products.filter(p=>category==='All'||p.category===category);
  return <><header className="shop-hero"><p className="eyebrow">Western Roos / Merchandise</p><h1>Club colours.<br /><em>Every day.</em></h1><div><p className="shop-brand">West Coast Marlins</p><p>Explore the range from the supplied catalogue.</p><p className="shop-muted">{artworkOnly ? 'President review · Ordering unavailable.' : 'AUD · Guest checkout welcome.'}</p></div></header>
    <aside className="shop-notice">{artworkOnly ? 'Catalogue artwork for review. Prices, sizes and availability await confirmation. Orders cannot be submitted.' : 'Preview store — prices and availability are test data.'}</aside>
    <section className="shop-catalog" aria-labelledby="range-heading"><div className="shop-section-heading"><h2 id="range-heading">The Marlins range</h2><span aria-live="polite">{shown.length} products</span></div>
    <div className="shop-filters" role="group" aria-label="Filter by category">{['All',...categories].map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    <div className="shop-grid">{shown.map(p=><Link className="shop-card" href={`/shop/${p.id}`} key={p.id}><ProductImage product={p}/><div className="shop-card-copy"><p className="eyebrow">{p.category}</p><h3>{p.name}</h3><p className="shop-muted">{p.offers[0]?.price ? formatMoney(p.offers[0].price) : 'Ordering details to come'}</p><span className="shop-card-link">View product <span aria-hidden="true">↗</span></span></div></Link>)}</div></section>
    <div className="shop-bottom"><p>From the West Coast Marlins catalogue. Artwork is shown as supplied.</p><Link href="/clubs/west-coast-marlins">Explore the Marlins program ↗</Link></div></>;
}
export function PurchaseControls({product}: {product:Product}) {
  const {dispatch,ready,lines,catalogAvailable}=useCart();
  const [offerId,setOfferId]=useState(product.offers.length===1 ? product.offers[0].id : '');
  const [quantity,setQuantity]=useState(1);
  const [message,setMessage]=useState('');
  const offer=product.offers.find(o=>o.id===offerId);
  if(!product.offers.length) return <div className="shop-purchase"><h2>Ordering details to come</h2><p>Price, sizes, variants and stock are awaiting confirmation.</p><button disabled>Add to cart · Not available yet</button><p className="shop-muted">Shipping, pickup and returns information will be confirmed before orders open.</p></div>;
  const remaining=(offer?.stock ?? 0)-(lines.find(l=>l.productId===product.id && l.offerId===offerId)?.quantity ?? 0);
  return <div className="shop-purchase"><p className="shop-price">{formatMoney(product.offers[0].price!)} <small>AUD</small></p><p className="shop-muted">Preview store — prices, sizes and availability are test data.</p><label>{product.offers.length===1 ? "Size" : "Choose a size (required)"}<select value={offerId} onChange={e=>{setOfferId(e.target.value);setQuantity(1);setMessage('');}}>{product.offers.length>1 && <option value="">Select a size</option>}{product.offers.map(o=><option key={o.id} value={o.id} disabled={!available(o)}>{[o.variant,o.size].filter(Boolean).join(' / ') || 'Standard'}{available(o)?'':' — unavailable'}</option>)}</select></label>

    <label>Quantity<input type="number" min="1" max={Math.min(MAX_QUANTITY,remaining)} value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label>
    <button disabled={!ready||catalogAvailable!==true||!offer||!available(offer)||!Number.isInteger(quantity)||quantity<1||quantity>Math.min(MAX_QUANTITY,remaining)} onClick={()=>{if(!offer)return;dispatch({type:'add',line:{productId:product.id,offerId,quantity}});setMessage(`${quantity} × ${product.name}, ${offer.size} added to cart.`);}}>Add to cart</button><p role="status">{message || (offer && remaining===0 ? "Test stock limit reached for this size." : "")}</p></div>;
}
export function ProductDetail({product}: {product:Product}) {
  return <><Link className="shop-back" href="/shop">← All merchandise</Link><div className="shop-detail"><div><ProductImage product={product} priority/><p className="shop-image-caption">Original catalogue artwork · {product.id.endsWith('beach-towel')?'Single view':'Both supplied views'}<br/>Detail is limited by the resolution of the supplied catalogue.</p></div><section><p className="eyebrow">{shopBrands[product.brand]} / {product.category}</p><h1>{product.name}</h1><p>{product.description}</p><PurchaseControls product={product}/><Link href="/shop/cart" className="shop-back">View cart →</Link></section></div></>;
}
export function CartPage() {
  const {lines,dispatch,ready,products,catalogAvailable}=useCart();
  const issues=lines.some(l=>cartIssue(l,products));
  if(catalogAvailable!==true)return <section className="shop-notice"><h1>Your cart</h1><p role="status">{catalogAvailable===null?"Loading current catalog…":"Current catalog is unavailable. Your selections are retained; reload to retry."}</p><button onClick={()=>window.location.reload()}>Retry current catalog</button></section>;
  const subtotal=issues?null:cartSubtotal(lines,products);
  return <><header className="shop-cart-heading"><p className="eyebrow">Western Roos / Merchandise</p><h1>Your cart</h1><p>Preview store — prices and availability are test data.</p></header><div className="shop-cart-layout"><section aria-label="Cart items" className="shop-cart-items">{!ready?<p role="status">Loading your cart…</p>:!lines.length?<div className="shop-empty"><span aria-hidden="true">↗</span><h2>Your next club colours.</h2><p>Your cart is empty. The Marlins range is ready to explore.</p><Link className="shop-action" href="/shop">Explore merchandise →</Link></div>:lines.map(line=>{
    const product=products.find(p=>p.id===line.productId);const offer=product?.offers.find(o=>o.id===line.offerId);const issue=cartIssue(line,products);
    if(!product||!offer||issue)return <article className="shop-cart-line" key={`${line.productId}/${line.offerId}`}><div><h2>{product?.name??line.productId}</h2><p>{offer?.size??line.offerId} · Selected quantity {line.quantity}</p><p role="alert">{issue}</p><label>Adjust quantity<input type="number" min="1" max="99" value={line.quantity} onChange={e=>dispatch({type:"quantity",productId:line.productId,offerId:line.offerId,quantity:Number(e.target.value)})}/></label><button onClick={()=>dispatch({type:"remove",productId:line.productId,offerId:line.offerId})}>Remove unavailable selection</button></div></article>;
    return <article className="shop-cart-line" key={`${line.productId}/${line.offerId}`}><ProductImage product={product}/><div><Link href={`/shop/${product.id}`}><h2>{product.name}</h2></Link><p>{[offer.variant,offer.size].filter(Boolean).join(' / ')}</p><p>Unit price {formatMoney(offer.price!)}</p><p>Line total <strong>{formatMoney({currency:offer.price!.currency,minor:offer.price!.minor*line.quantity})}</strong></p><label>Quantity for {product.name} {[offer.variant,offer.size].filter(Boolean).join(" / ")}<input type="number" min="1" max={Math.min(MAX_QUANTITY,offer.stock!)} value={line.quantity} onChange={e=>dispatch({type:'quantity',productId:line.productId,offerId:line.offerId,quantity:Number(e.target.value)})}/></label><button onClick={()=>dispatch({type:'remove',productId:line.productId,offerId:line.offerId})}>Remove <span className="sr-only">{product.name} {[offer.variant,offer.size].filter(Boolean).join(" / ")}</span></button></div></article>;
  })}</section><aside className="shop-summary"><h2>Order summary</h2><div><span>Items</span><strong aria-live="polite">{lines.reduce((n,l)=>n+l.quantity,0)}</strong></div><div><span>Subtotal</span><strong aria-live="polite">{issues?'Resolve cart changes':subtotal?formatMoney(subtotal):'$0.00'}</strong></div><p>AUD · Demo subtotal. Pickup details will be confirmed before orders open.</p>{ready && lines.length>0 && !issues ? <Link className="shop-action" href="/checkout">Continue to checkout →</Link> : <button disabled>Continue to checkout</button>}<p className="shop-muted">Purchases will be open to guests. WRTSC membership will not be required.</p></aside></div></>;
}

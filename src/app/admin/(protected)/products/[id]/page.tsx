import { notFound } from 'next/navigation';
import { adminProduct, catalogHistory } from '@/lib/admin/products';
import { productWritable } from '@/lib/admin/product-config';
import { ProductEditor } from '@/app/admin/product-editor';
export default async function ProductPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;let data;try{data=await adminProduct(id);}catch{return <p role="status" className="admin-notice">Catalog unavailable. Reload to retry.</p>;}
 if(!data)notFound();const history=await catalogHistory(id);
 return <><a href="/admin/products">← Products</a><h1>Edit demo product</h1><ProductEditor product={data.product} variants={data.variants} enabled={productWritable(id)}/><section className="admin-card"><h2>Catalog history</h2><p>Latest 20 append-only changes. Earlier changes are not reconstructed.</p>{!history.available?<p role="status">History unavailable. BUILD 18 SQL may be awaiting installation. This does not mean there are no changes.</p>:history.events.length?<ol className="admin-history">{history.events.map(e=><li key={e.operation_id}><strong>{new Intl.DateTimeFormat('en-AU',{dateStyle:'medium',timeStyle:'short',timeZone:'Australia/Perth'}).format(new Date(e.created_at))}</strong><pre className="admin-catalog-diff">{JSON.stringify(e.changes,null,2)}</pre>{e.stock_reason&&<p className="admin-note-text">Reason: {e.stock_reason}</p>}<p className="admin-author">Actor: {e.actor_user_id}</p><p className="admin-author">Operation: {e.operation_id}</p></li>)}</ol>:<p>No recorded catalog changes.</p>}</section></>;
}

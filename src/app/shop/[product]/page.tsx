import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { publicCatalog } from '@/lib/shop/catalog';
import { catalogId } from '@/lib/shop/catalog-identity';
import Link from 'next/link';
import { CatalogRetry } from '@/components/shop/catalog-retry';
import { ProductDetail } from '@/components/shop/store';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{product:string}>}):Promise<Metadata>{
  const {product}=await params;const record=(await publicCatalog()).products.find(p=>p.id===product);
  return {title:record?.name,description:record?.description};
}
export default async function Page({params}:{params:Promise<{product:string}>}){
  const {product}=await params;if(!catalogId(product))notFound();const data=await publicCatalog();const record=data.products.find(p=>p.id===product);
  if(!data.available)return <section className="shop-notice"><h1>Catalog unavailable</h1><p>Current prices could not be loaded. Reload to retry.</p><CatalogRetry/></section>;
  if(!record)return <section className="shop-notice"><h1>Product unavailable</h1><p>This demo product is not currently available for new orders.</p><Link href="/shop">View available merchandise</Link></section>;
  return <ProductDetail product={record}/>;
}

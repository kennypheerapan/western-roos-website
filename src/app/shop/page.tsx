import type { Metadata } from 'next';
import { Storefront } from '@/components/shop/store';
import { publicCatalog } from '@/lib/shop/catalog';
import { CatalogRetry } from '@/components/shop/catalog-retry';
export const dynamic='force-dynamic';
export const metadata: Metadata = {title:'Merchandise',description:'Explore the West Coast Marlins merchandise catalogue. Ordering details await confirmation.'};
export default async function Page(){ const data=await publicCatalog();return data.available?<Storefront products={data.products}/>:<section className="shop-notice"><h1>Catalog unavailable</h1><p>Current demo prices could not be loaded. Please reload to retry.</p><CatalogRetry/></section>; }

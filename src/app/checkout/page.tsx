import type { Metadata } from 'next';
import { Checkout } from '@/components/shop/checkout';
import Link from 'next/link';
import { presidentPreviewLocked } from '@/lib/president-preview';
import { ShopNavigation } from '@/components/shop/store';
import '../shop/shop.css';
export const metadata:Metadata={title:'Checkout'};
export default function Page(){return <div className="shop-shell container"><ShopNavigation/>{presidentPreviewLocked() ? <section className="shop-notice"><h1>Ordering is unavailable</h1><p>This President preview is read only. Orders and payments cannot be submitted.</p><Link href="/shop">Explore the merchandise artwork</Link></section> : <Checkout/>}</div>;}

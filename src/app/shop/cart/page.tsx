import type { Metadata } from 'next';
import { CartPage } from '@/components/shop/store';
export const metadata: Metadata={title:'Your cart'};
export default function Page(){return <CartPage/>;}

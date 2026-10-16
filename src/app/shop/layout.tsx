
import { ShopNavigation } from '@/components/shop/store';
import './shop.css';
export default function ShopLayout({children}: {children:React.ReactNode}) {
  return <div className="shop-shell container"><ShopNavigation/>{children}</div>;
}

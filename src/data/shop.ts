import { catalogCategories } from '../lib/shop/catalog-identity';
import type { BrandId, Category, Product } from '../lib/shop/domain';
export const shopBrands: Record<BrandId, string> = {
  'western-roos': 'Western Roos', united: 'United Softball Club', marlins: 'West Coast Marlins',
};
export const categories: Category[] = [...catalogCategories];
// Supplied public artwork only. No synthetic prices, stock, sizes or orders.
const records: [string, string, Category, number, number][] = [
  ['playing-top', 'Playing Top', 'Playing', 152, 96],
  ['basketball-singlet', 'Basketball Singlet', 'Playing', 146, 96],
  ['polo', 'Polo', 'Training', 143, 96],
  ['training-shirt', 'Training T-Shirt', 'Training', 152, 82],
  ['shorts', 'Shorts', 'Training', 146, 82],
  ['long-sleeve-top', 'Long Sleeve Top', 'Training', 143, 82],
  ['softshell-jacket', 'Softshell Jacket', 'Outerwear', 152, 87],
  ['hoodie', 'Hoodie', 'Outerwear', 146, 87],
  ['slicker-jacket', 'Slicker Jacket', 'Outerwear', 143, 80],
  ['bucket-hat', 'Bucket Hat', 'Accessories', 152, 60],
  ['fitted-cap', 'Fitted Cap', 'Accessories', 146, 60],
  ['beach-towel', 'Beach Towel', 'Accessories', 143, 64],
];
export const products: Product[] = records.map(([slug, name, category, width, height], i) => ({
  id: `marlins-${slug}`, name, brand: 'marlins', category, width, height,
  image: `/images/merchandise/marlins/marlins-${slug}.webp`,
  description: `${name} from the supplied West Coast Marlins catalogue.`,
  alt: `West Coast Marlins ${name} in navy and gold${i < 9 ? ', front and back views' : i < 11 ? ', two catalogue views' : ''}`,
  offers: [],
}));

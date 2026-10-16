import { publicCatalog } from '@/lib/shop/catalog';
export const dynamic = 'force-dynamic';
export async function GET() {
  const catalog = await publicCatalog();
  return Response.json(catalog,{status:catalog.available?200:503,headers:{'Cache-Control':'no-store'}});
}

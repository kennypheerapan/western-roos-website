import { orderList } from '@/lib/admin/data';
import type { Search } from '@/lib/admin/policy';
import { Orders, Pagination } from '../../ui';
export default async function OrdersPage({ searchParams }: { searchParams: Promise<Search> }) {
  const data = await orderList(await searchParams);
  return <><p className="admin-kicker">Order review</p><h1>Orders</h1><p className="admin-notice">DEMO orders are test records. UNPAID totals are not money received.</p><Orders rows={data.rows} /><Pagination {...data} path="/admin/orders" /></>;
}

import 'server-only';
import { database } from '../backend/server';
import { requireAdmin } from './auth';
import { applicationStatuses, filters, UUID, type Search } from './policy';

const applicationFields = 'id,reference,first_name,last_name,pathway,created_at,status';
const orderFields = 'id,order_number,created_at,status,payment_status,total_cents,currency,is_demo';
export type ApplicationRow = { id: string; reference: string; first_name: string; last_name: string; pathway: string; created_at: string; status: string };
export type OrderRow = { id: string; order_number: string; created_at: string; status: string; payment_status: string; total_cents: number; currency: string; is_demo: boolean };
export type ApplicationDetail = ApplicationRow & { email: string; phone: string; experience: string[] };
export type OrderItem = { id: string; product_name: string; variant_label: string; sku: string | null; quantity: number; unit_price_cents: number; line_total_cents: number };
export type OrderDetail = OrderRow & { first_name: string; last_name: string; email: string; phone: string; fulfilment_method: string; subtotal_cents: number; shipping_cents: number };
function backend() { const db = database(); if (!db) throw new Error('Admin records unavailable'); return db; }
function checked<T>(result: { data: T; error: unknown }): T { if (result.error) throw new Error('Admin records unavailable'); return result.data; }

export async function applicationList(search: Search = {}) {
  await requireAdmin();
  const selected = filters(search);
  let query = backend().from('membership_applications').select(applicationFields, { count: 'exact' });
  if (selected.status) query = query.eq('status', selected.status);
  if (selected.pathway) query = query.eq('pathway', selected.pathway);
  const result = await query.order('created_at', { ascending: false }).order('id').range((selected.page - 1) * 20, selected.page * 20 - 1);
  return { rows: checked(result) as ApplicationRow[], count: result.count ?? 0, ...selected };
}
export async function applicationDetail(id: string) {
  await requireAdmin();
  if (!UUID.test(id)) return null;
  return checked(await backend().from('membership_applications').select(`${applicationFields},email,phone,experience`).eq('id', id).maybeSingle()) as ApplicationDetail | null;
}
export async function orderList(search: Search = {}) {
  await requireAdmin();
  const { page } = filters(search);
  const result = await backend().from('orders').select(orderFields, { count: 'exact' }).order('created_at', { ascending: false }).order('id').range((page - 1) * 20, page * 20 - 1);
  return { rows: checked(result) as OrderRow[], count: result.count ?? 0, page };
}
export async function orderDetail(id: string) {
  await requireAdmin();
  if (!UUID.test(id)) return null;
  const db = backend();
  const order = checked(await db.from('orders').select(`${orderFields},first_name:contact_snapshot->>firstName,last_name:contact_snapshot->>lastName,email:contact_snapshot->>email,phone:contact_snapshot->>phone,fulfilment_method,subtotal_cents,shipping_cents`).eq('id', id).maybeSingle()) as OrderDetail | null;
  if (!order) return null;
  // Reverify immediately before the second protected database operation.
  await requireAdmin();
  const items = checked(await db.from('order_items').select('id,product_name,variant_label,sku,quantity,unit_price_cents,line_total_cents').eq('order_id', id).order('id')) as OrderItem[];
  return { order, items };
}
async function count(table: 'membership_applications' | 'orders', field?: string, value?: string | boolean) {
  await requireAdmin();
  let query = backend().from(table).select('id', { head: true, count: 'exact' });
  if (field) query = query.eq(field, value!);
  const result = await query;
  checked(result);
  if (result.count === null) throw new Error('Admin records unavailable');
  return result.count;
}
export async function overview() {
  await requireAdmin();
  const [applications, orders, unpaid, demo, statuses, recentApplications, recentOrders] = await Promise.all([
    count('membership_applications'), count('orders'), count('orders', 'payment_status', 'unpaid'), count('orders', 'is_demo', true),
    Promise.all(applicationStatuses.map(async status => ({ status, count: await count('membership_applications', 'status', status) }))),
    applicationList(), orderList(),
  ]);
  return { applications, orders, unpaid, demo, statuses, recentApplications: recentApplications.rows.slice(0, 5), recentOrders: recentOrders.rows.slice(0, 5) };
}

import type { ApplicationRow, OrderRow } from '@/lib/admin/data';
export const label = (value: string) => value.replaceAll('_', ' ');
export const pathway = (value: string) => ({ united: 'United', marlins: 'West Coast Marlins', unsure: 'Guidance requested' })[value] ?? value;
export const date = (value: string) => new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium', timeZone: 'Australia/Perth' }).format(new Date(value));
export const money = (cents: number, currency: string) => new Intl.NumberFormat('en-AU', { style: 'currency', currency }).format(cents / 100);
export function Applications({ rows }: { rows: ApplicationRow[] }) {
  if (!rows.length) return <p className="admin-notice">No applications match this view.</p>;
  return <div className="admin-table-wrap"><table><caption>Membership applications</caption><thead><tr><th>Reference / applicant</th><th>Pathway</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td><a href={`/admin/applications/${row.id}`}>{row.reference}</a><span className="admin-secondary">{row.first_name} {row.last_name}</span></td><td>{pathway(row.pathway)}</td><td>{date(row.created_at)}</td><td><span className="admin-badge">{label(row.status)}</span></td></tr>)}</tbody></table></div>;
}
export function Orders({ rows }: { rows: OrderRow[] }) {
  if (!rows.length) return <p className="admin-notice">No orders match this view.</p>;
  return <div className="admin-table-wrap"><table><caption>Stored orders</caption><thead><tr><th>Reference / created</th><th>Status</th><th>Payment</th><th>Total</th><th>Designation</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td><a href={`/admin/orders/${row.id}`}>{row.order_number}</a><span className="admin-secondary">{date(row.created_at)}</span></td><td>{label(row.status)}</td><td><span className="admin-badge">{row.payment_status.toUpperCase()}</span></td><td>{money(row.total_cents, row.currency)} {row.currency}</td><td>{row.is_demo ? 'DEMO / TEST' : 'Non-demo'}</td></tr>)}</tbody></table></div>;
}
export function Pagination({ page, count, path, status, pathway: selectedPathway }: { page: number; count: number; path: string; status?: string; pathway?: string }) {
  const href = (next: number) => { const query = new URLSearchParams({ page: String(next) }); if (status) query.set('status', status); if (selectedPathway) query.set('pathway', selectedPathway); return `${path}?${query}`; };
  return <nav className="admin-pagination" aria-label="Pagination">{page > 1 && <a href={href(page - 1)}>← Previous</a>}<span>Page {page} · {count} records</span>{page * 20 < count && <a href={href(page + 1)}>Next →</a>}</nav>;
}

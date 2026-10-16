import { requireAdmin } from '@/lib/admin/auth';
import { logout } from '../actions';
import { teamScope } from '@/lib/admin/team-config';
import { reviewEnabled } from '@/lib/admin/review-config';
import { contentMode } from '@/lib/content/server';
import { modules } from '@/lib/content/contract';
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <><header className="admin-header"><a className="admin-brand" href="/admin">WRTSC <span>Administration</span></a><span className="admin-badge">{contentMode()?`${contentMode()} content edits`:teamScope().length ? 'Scoped team edits' : reviewEnabled() ? 'TEST review enabled' : 'Read only'}</span></header><nav className="admin-nav" aria-label="Administration"><a href="/admin">Overview</a><a href="/admin/applications">Membership</a><a href="/admin/enquiries">Enquiries</a><a href="/admin/teams">Teams</a><a href="/admin/players">Players</a><a href="/admin/squads">Squads</a>{Object.entries(modules).map(([id,label])=><a key={id} href={`/admin/${id}`}>{label}</a>)}<a href="/admin/products">Merchandise</a><a href="/admin/orders">Orders · read only</a><a href="/admin/settings">Settings</a><a href="/">Back to website</a><form action={logout}><button type="submit">Logout</button></form></nav><div className="admin-content">{children}</div><footer className="admin-footer">WRTSC administration · United community softball · West Coast Marlins Masters program</footer></>;
}

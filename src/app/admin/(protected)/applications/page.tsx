import { applicationList } from '@/lib/admin/data';
import { applicationStatuses, pathways, type Search } from '@/lib/admin/policy';
import { Applications, Pagination, label, pathway } from '../../ui';
export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const data = await applicationList(await searchParams);
  return <><p className="admin-kicker">Membership</p><h1>Applications</h1><p className="admin-muted">Review submitted records. Open a record to see its review permissions and private history.</p><form className="admin-filters" action="/admin/applications"><label>Status<select name="status" defaultValue={data.status ?? ''}><option value="">All statuses</option>{applicationStatuses.map(status => <option key={status}>{status}</option>)}</select></label><label>Pathway<select name="pathway" defaultValue={data.pathway ?? ''}><option value="">All pathways</option>{pathways.map(value => <option key={value} value={value}>{pathway(value)}</option>)}</select></label><button>Apply filters</button><a href="/admin/applications">Reset</a></form><span className="admin-muted">{data.status ? label(data.status) : 'All statuses'}</span><Applications rows={data.rows} /><Pagination {...data} path="/admin/applications" /></>;
}

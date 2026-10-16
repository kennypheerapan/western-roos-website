import { login, logout } from '../actions';
import { allowedIds } from '@/lib/admin/policy';
import { authConfig } from '@/lib/admin/session';
import { LoginButton } from './submit';
const messages: Record<string, string> = {
  unavailable: 'Administrator access is unavailable. Ask the site operator to check the account configuration and connection.',
  expired: 'Please sign in. Your session may have expired.',
  denied: 'Access denied. This account does not have administrator permission.',
  invalid: 'Sign-in was unsuccessful. Check your details and try again.',
  'signed-out': 'You have signed out.',
  'logout-local': 'This browser has signed out. The Auth service could not confirm remote session revocation.',
};
export default async function Login({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  const configured = !!authConfig() && !!allowedIds(process.env.ADMIN_ALLOWED_USER_IDS);
  const message = !configured ? messages.unavailable : state && Object.hasOwn(messages, state) ? messages[state] : undefined;
  return <div className="admin-login"><a className="admin-brand" href="/">WRTSC <span>Administration</span></a><section className="admin-card"><p className="admin-kicker">Restricted access</p><h1>Administrator sign in</h1><p>Review membership applications and unpaid demo orders with your individual account.</p>{message && <p className="admin-notice" role="status">{message}</p>}<form action={login} className="admin-form"><label>Email address<input name="email" type="email" autoComplete="username" required maxLength={254} /></label><label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={1024} /></label><LoginButton disabled={!configured} /></form><p className="admin-muted">Access is granted by the site operator. Public administrator registration is unavailable.</p>{state === 'denied' && <form action={logout}><button>Sign out of this account</button></form>}</section><a href="/">← Back to website</a></div>;
}

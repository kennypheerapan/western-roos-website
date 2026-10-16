import 'server-only';

// Temporary opt-in local diagnostics. Never serialize an error or Auth payload.
const codes = new Set(['invalid_credentials', 'email_not_confirmed', 'over_request_rate_limit', 'over_email_send_rate_limit', 'user_banned', 'user_not_found', 'email_provider_disabled', 'signup_disabled', 'unexpected_failure', 'request_timeout', 'session_not_found', 'session_expired', 'refresh_token_not_found', 'refresh_token_already_used', 'bad_jwt', 'no_authorization', 'captcha_failed']);
const names = new Set(['AuthApiError', 'AuthRetryableFetchError', 'AuthSessionMissingError', 'AuthUnknownError', 'AuthInvalidTokenResponseError', 'AbortError', 'TimeoutError', 'TypeError']);
type Stage = 'form_validation' | 'password_sign_in' | 'verified_identity' | 'allowlist_comparison' | 'cookie_write' | 'cookie_refresh_deferred' | 'proxy_identity' | 'dashboard_redirect';
export function loginDiagnostic(stage: Stage, outcome: { ok: boolean; match?: boolean }, error?: unknown) {
  if (process.env.NODE_ENV !== 'development' || process.env.ADMIN_LOGIN_DIAGNOSTICS !== '1') return;
  const e = error && typeof error === 'object' ? error as Record<string, unknown> : {};
  console.info('[admin-login]', JSON.stringify({
    stage, ok: outcome.ok,
    ...(typeof outcome.match === 'boolean' ? { match: outcome.match } : {}),
    ...(error ? {
      code: typeof e.code === 'string' && codes.has(e.code) ? e.code : 'unclassified',
      name: typeof e.name === 'string' && names.has(e.name) ? e.name : 'unclassified',
      status: typeof e.status === 'number' && Number.isInteger(e.status) && e.status >= 100 && e.status <= 599 ? e.status : null,
    } : {}),
  }));
}

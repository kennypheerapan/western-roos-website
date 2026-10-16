'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="admin-card" role="alert"><h1>Records unavailable</h1><p>We could not retrieve the records. This does not mean there are no records.</p><button onClick={reset}>Try again</button></section>;
}

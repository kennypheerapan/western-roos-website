import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { presidentPreviewLocked } from '@/lib/president-preview';
import './admin.css';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Administration', description: 'Restricted WRTSC administration', robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (presidentPreviewLocked()) notFound();
  return <div className="admin-shell">{children}</div>;
}

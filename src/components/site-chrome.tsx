'use client';
import { usePathname } from 'next/navigation';
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return path === '/admin' || path.startsWith('/admin/') ? null : children;
}

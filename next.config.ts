import type { NextConfig } from "next";
import preview from './president-preview.config.json';
if (preview.locked && process.env.VERCEL_ENV === 'production') {
  throw new Error('President review branch cannot be built for Vercel Production. Use the existing project Preview environment.');
}
const config: NextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'no-referrer' },
    ] }];
  },
};
export default config;

import 'server-only';
import configuration from '../../president-preview.config.json';

// This review branch is locked in source, independently of Vercel environment
// variables. Removing the lock requires a separately reviewed code change.
export function presidentPreviewLocked(): boolean {
  return configuration.locked || process.env.VERCEL_ENV === 'preview';
}

import type { SaveInput } from './contract';
// Type-only editor interface; no synthetic record payload or test identity.
export type OneDraftBinding = { required: boolean; input: SaveInput | null; expiresAt?: string };

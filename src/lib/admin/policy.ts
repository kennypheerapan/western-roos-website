// Pure policy shared only by server modules and isolated tests.
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function allowedIds(raw: string | undefined): Set<string> | null {
  const ids = raw?.split(',').map(value => value.trim().toLowerCase());
  if (!ids?.length || ids.some(id => !UUID.test(id))) return null;
  return new Set(ids);
}
export function isAllowed(raw: string | undefined, id: string): boolean {
  return UUID.test(id) && (allowedIds(raw)?.has(id.toLowerCase()) ?? false);
}
export const applicationStatuses = ['submitted', 'under_review', 'approved', 'declined', 'withdrawn'] as const;
export const pathways = ['united', 'marlins', 'unsure'] as const;
export type Search = Record<string, string | string[] | undefined>;
export function filters(search: Search) {
  const single = (key: string) => typeof search[key] === 'string' ? search[key] as string : '';
  const number = Number(single('page'));
  return {
    page: Number.isSafeInteger(number) && number > 0 ? Math.min(number, 100000) : 1,
    status: applicationStatuses.find(value => value === single('status')),
    pathway: pathways.find(value => value === single('pathway')),
  };
}

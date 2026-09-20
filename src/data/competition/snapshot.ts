// Server-side snapshot for the static export. Refreshes on a new build/server load,
// never during React render or browser hydration. Redeploy after data updates.
export const competitionSnapshotTime = Date.now();

export const sponsors: { name: string; logo: string | null }[] = Array.from(
  { length: 4 },
  (_, i) => ({
    name: `Sponsor space ${String(i + 1).padStart(2, "0")}`,
    logo: null,
  }),
);

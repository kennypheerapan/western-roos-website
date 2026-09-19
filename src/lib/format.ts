export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
export const score = (value: number | undefined) =>
  value === undefined ? "—" : String(value).padStart(2, "0");

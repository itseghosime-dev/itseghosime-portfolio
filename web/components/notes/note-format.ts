export function formatNoteDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(value));
}

export function formatNoteYear(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(value));
}

export function formatVolumeNumber(value: number): string {
  return String(value).padStart(2, "0");
}

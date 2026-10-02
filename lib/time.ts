/** Datums- und Zeitangaben, gleich auf dem Server und im Browser. */
export const DAY_MS = 864e5;

const rtf = new Intl.RelativeTimeFormat("de", { numeric: "auto" });

/** "2. Oktober 2026" für ein Datum im Format YYYY-MM-DD. */
export function fmtDay(day: string): string {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];

/** "2. Okt" für ein Datum im Format YYYY-MM-DD (Jahr steht am Zeitstrahl). */
export function fmtDayShort(day: string): string {
  return `${Number(day.slice(8, 10))}. ${MONTHS[Number(day.slice(5, 7)) - 1]}`;
}

/** "2.10.2026, 21:30" für einen ISO-Zeitstempel. */
export function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  });
}

export function daysSince(day: string, now: number): number {
  return Math.round((now - Date.parse(`${day}T12:00:00Z`)) / DAY_MS);
}

/** "vor 3 Tagen", "vor 2 Monaten" … für ein Datum YYYY-MM-DD. */
export function ago(day: string, now: number): string {
  const days = -daysSince(day, now);
  const abs = Math.abs(days);
  if (abs < 45) return rtf.format(days, "day");
  if (abs < 365) return rtf.format(Math.round(days / 30.4), "month");
  return rtf.format(Math.round(days / 365), "year");
}

/** Wie ago(), aber unter einem Tag in Stunden. */
export function agoTime(iso: string, now: number): string {
  const hours = Math.round((Date.parse(iso) - now) / 36e5);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return ago(iso.slice(0, 10), now);
}

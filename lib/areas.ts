/**
 * Bereiche: Filter auf der Startseite und Farbe des Punkts auf dem
 * Zeitstrahl. Posts (Front Matter `area`), Tools und Quellen gehören zu genau
 * einem Bereich. Neuer Bereich: hier eintragen und in components/Icons.tsx
 * ein Icon ergänzen.
 */
export const AREAS = {
  ai: { label: "AI", color: "var(--purple)" },
  automation: { label: "Automation", color: "var(--teal)" },
  infra: { label: "Infra", color: "var(--beige)" },
  dev: { label: "Dev", color: "var(--blue)" },
  apps: { label: "Apps", color: "var(--ok)" },
} as const;

export type AreaKey = keyof typeof AREAS;

export const AREA_KEYS = Object.keys(AREAS) as AreaKey[];

export function isArea(value: unknown): value is AreaKey {
  return typeof value === "string" && value in AREAS;
}

import { site } from "./site.ts";

/**
 * Lab: kleine Werkzeuge und Seiten, die komplett im Browser laufen. Die
 * Lab-Seite zeigt links alle Einträge, rechts den gewählten – nativ gerendert.
 *
 * - "interactive": Island mit eigener Route routes/lab/<slug>.tsx (hier
 *   eintragen)
 * - "page": minimale HTML- oder Markdown-Datei content/lab/<slug>.html|.md
 *   (wird automatisch gefunden, siehe lib/lab_pages.ts)
 * - "external": liegt woanders (z. B. eigene Project-Site) und wird verlinkt
 */
export type LabKind = "interactive" | "page" | "external";

export interface LabItem {
  slug: string;
  title: string;
  /** Kurzfassung für den Schnellzugriff auf der Startseite. */
  short: string;
  /** Beschreibung für Sidebar und Seitentitel. */
  description: string;
  kind: LabKind;
  href: string;
}

export const LAB_KINDS: Record<LabKind, string> = {
  interactive: "Interaktiv",
  page: "Seiten",
  external: "Extern",
};

export const interactiveLabs: LabItem[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    short: "JSON prüfen und formatieren",
    description:
      "JSON einfügen, validieren, hübsch formatieren oder minifizieren – alles lokal im Browser.",
    kind: "interactive",
    href: "/lab/json-formatter",
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    short: "Reguläre Ausdrücke live testen",
    description:
      "Reguläre Ausdrücke mit Flags live gegen Beispieltext testen, Treffer und Gruppen ansehen.",
    kind: "interactive",
    href: "/lab/regex-tester",
  },
];

export const externalLabs: LabItem[] = [
  {
    slug: "tools",
    title: "Tools-Sammlung",
    short: "Weitere HTML-Werkzeuge",
    description:
      "Wachsende Sammlung einzelner HTML-Werkzeuge – eigene Project-Site (Repo niclasedge/tools), öffnet sich dort.",
    kind: "external",
    href: site.toolsPath,
  },
];

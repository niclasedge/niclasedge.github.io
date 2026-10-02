/** Interaktive Werkzeuge unter /lab. Jede Seite liegt in routes/lab/<slug>.tsx. */
export interface LabTool {
  slug: string;
  title: string;
  description: string;
}

export const labTools: LabTool[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description:
      "JSON einfügen, validieren, hübsch formatieren oder minifizieren – alles lokal im Browser.",
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description:
      "Reguläre Ausdrücke mit Flags live gegen Beispieltext testen, Treffer und Gruppen ansehen.",
  },
];

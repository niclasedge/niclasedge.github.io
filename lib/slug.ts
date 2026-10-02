/**
 * Entspricht Jekylls `Utils.slugify(..., mode: "pretty")`: alles außer
 * Buchstaben, Ziffern und `._~!$&'()+,;=@` wird zu `-`. So bleiben die
 * Post-URLs identisch zu denen, die Jekyll aus dem Dateinamen erzeugt hat.
 */
export function jekyllSlug(input: string, cased = true): string {
  const slug = input
    .replace(/[^\p{M}\p{L}\p{Nd}._~!$&'()+,;=@]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return cased ? slug : slug.toLowerCase();
}

/** Slug für Tags (`/tags/<slug>`), klein geschrieben wie bei Chirpy. */
export function tagSlug(tag: string): string {
  return jekyllSlug(tag.trim(), false);
}

/** Anker-ID für Überschriften. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z0-9#]+;/g, "")
    .replace(/[^\p{L}\p{Nd}\s_-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

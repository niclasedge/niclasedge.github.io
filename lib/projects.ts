import { join } from "@std/path";
import { type RenderedMarkdown, renderMarkdown } from "./markdown.ts";

/**
 * Detailtexte der eigenen Tools: content/projekte/<id>.md, reines Markdown
 * ohne Front Matter (Name, Kategorie und Zeitraum stehen in tools.json).
 * Jedes eigene Tool braucht genau einen Text – geprüft in getTools().
 */
export const PROJECTS_DIR = "content/projekte";

/** Ids aller Detailtexte (Dateiname ohne .md). */
export function projectIds(): string[] {
  return [...Deno.readDirSync(PROJECTS_DIR)]
    .filter((e) => e.isFile && e.name.endsWith(".md"))
    .map((e) => e.name.slice(0, -3));
}

/** Bricht ab, wenn ein eigenes Tool keinen Text hat oder ein Text verwaist ist. */
export function checkProjects(ownIds: string[], textIds: string[]): void {
  const own = new Set(ownIds);
  const texts = new Set(textIds);
  const missing = ownIds.filter((id) => !texts.has(id));
  const orphans = textIds.filter((id) => !own.has(id));
  if (missing.length > 0) {
    throw new Error(
      `${PROJECTS_DIR}: Text fehlt für eigene Tools: ${missing.join(", ")}`,
    );
  }
  if (orphans.length > 0) {
    throw new Error(
      `${PROJECTS_DIR}: kein eigenes Tool zu ${
        orphans.map((id) => `${id}.md`).join(", ")
      }`,
    );
  }
}

/** Gerenderter Detailtext oder undefined, wenn es keinen gibt. */
export function getProject(id: string): RenderedMarkdown | undefined {
  if (!/^[a-z0-9-]+$/.test(id)) return undefined;
  try {
    return renderMarkdown(
      Deno.readTextFileSync(join(PROJECTS_DIR, `${id}.md`)),
    );
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) return undefined;
    throw e;
  }
}

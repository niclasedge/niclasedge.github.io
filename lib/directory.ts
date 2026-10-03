import { type AreaKey, isArea } from "./areas.ts";
import type { TimelineIcon } from "../components/Icons.tsx";
import { checkProjects, projectIds } from "./projects.ts";

/**
 * Tool-Verzeichnis und Quellen der Startseite, iOS-Apps der About-Seite. Die
 * Daten liegen als JSON in content/tools.json, content/feeds.json und
 * content/apps.json und werden wie die Posts zur Laufzeit gelesen (nur in
 * `deno task dev` und beim Export). Fehlerhafte Einträge brechen den Export
 * mit einer klaren Meldung ab.
 */
export const TOOLS_FILE = "content/tools.json";
export const FEEDS_FILE = "content/feeds.json";
export const APPS_FILE = "content/apps.json";
/** iOS-Apps stehen nicht im Tool-Verzeichnis, sondern in APPS_FILE. */
const APP_CAT = "iOS-App";

export type ToolGroup = "own" | "ext";
export type ToolStatus = "current" | "past";

export interface Link {
  label: string;
  href: string;
}

/** Icon auf dem Zeitstrahl je Kategorie; sonst "code". */
export const TIMELINE_ICON_BY_CAT: Record<string, TimelineIcon> = {
  "Skill": "skill",
  "Plugin": "skill",
  "Agent": "skill",
  "Multiplexer": "terminal",
  "Linux-Distro": "terminal",
  "TUI-Framework": "terminal",
  "App-Framework": "layers",
  "Website": "web",
  "Web-Tools": "lab",
  "Lab": "lab",
  "Repo": "repo",
  "CLI": "terminal",
  "Runtime": "terminal",
  "Framework": "layers",
  "CSS": "layers",
  "IDE": "code",
  "Vertrieb": "app",
  "CI": "gear",
  "Hosting": "cloud",
  "Container": "box",
  "Diagramme": "chart",
};

const TIMELINE_ICONS = new Set<string>([
  "post",
  "app",
  "skill",
  "web",
  "lab",
  "repo",
  "terminal",
  "layers",
  "cloud",
  "box",
  "gear",
  "chart",
  "code",
]);

export interface Tool {
  id: string;
  /** "own" = eigene Projekte, "ext" = externe Tools. */
  group: ToolGroup;
  area: AreaKey;
  /** "current" = aktueller Workflow, "past" = früher benutzt. */
  status: ToolStatus;
  name: string;
  desc: string;
  /** Kategorie, z. B. "CLI", "Editor", "Web-App". */
  cat: string;
  /** Startjahr (YYYY). */
  since: string;
  /** Endjahr (YYYY), nur bei status "past". */
  until?: string;
  /** Letztes Release, z. B. { "ver": "v1.2.0", "date": "2026-09-14" }. */
  release?: { ver: string; date: string };
  /** Bei "past": id des Nachfolgers … */
  replacedBy?: string;
  /** … oder Begründung, warum es nicht mehr nötig ist. */
  reason?: string;
  web?: string;
  repo?: string;
  /** Weitere Links, z. B. Datenschutzseite einer App. */
  links?: Link[];
  /** Icon auf dem Zeitstrahl; Standard über die Kategorie. */
  icon: TimelineIcon;
}

export type FeedKind = "video" | "release" | "user" | "blog" | "site";

export const FEED_KINDS: Record<FeedKind, string> = {
  video: "Video",
  release: "Release",
  user: "Aktivität",
  blog: "Beitrag",
  site: "Website",
};

export interface FeedSource {
  kind: FeedKind;
  area: AreaKey;
  name: string;
  /** Plattform, z. B. "YouTube", "GitHub Releases", "Blog". */
  handle: string;
  /** Link auf die Quelle selbst. */
  url: string;
  /** RSS/Atom-Feed; ohne Feed steht die Quelle unter „Zum Nachschlagen“. */
  feed?: string;
  /** Kurzbeschreibung, vor allem für Quellen ohne Feed. */
  note?: string;
}

const YEAR_RE = /^\d{4}$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function fail(file: string, where: string, message: string): never {
  throw new Error(`${file}: ${where}: ${message}`);
}

function readJsonArray(file: string): Record<string, unknown>[] {
  const data = JSON.parse(Deno.readTextFileSync(file));
  if (!Array.isArray(data)) fail(file, "Wurzel", "muss ein Array sein");
  return data;
}

function str(
  file: string,
  where: string,
  entry: Record<string, unknown>,
  key: string,
  optional = false,
): string | undefined {
  const value = entry[key];
  if (value === undefined && optional) return undefined;
  if (typeof value !== "string" || value.trim() === "") {
    fail(file, where, `"${key}" fehlt oder ist kein Text`);
  }
  return value;
}

/** Alle Tools aus content/tools.json, geprüft. */
export function getTools(): Tool[] {
  const file = TOOLS_FILE;
  const tools = readJsonArray(file).map((entry, i): Tool => {
    const where = `Eintrag ${i + 1} (${entry.id ?? "ohne id"})`;
    const s = (key: string) => str(file, where, entry, key)!;
    const o = (key: string) => str(file, where, entry, key, true);

    const group = s("group");
    if (group !== "own" && group !== "ext") {
      fail(file, where, `"group" muss "own" oder "ext" sein`);
    }
    const status = s("status");
    if (status !== "current" && status !== "past") {
      fail(file, where, `"status" muss "current" oder "past" sein`);
    }
    if (!isArea(entry.area)) {
      fail(file, where, `unbekannter Bereich "${entry.area}"`);
    }
    if (!YEAR_RE.test(s("since"))) fail(file, where, `"since" muss YYYY sein`);
    if (s("cat") === APP_CAT) {
      fail(file, where, `iOS-Apps gehören nach ${APPS_FILE}`);
    }

    const tool: Tool = {
      id: s("id"),
      group,
      area: entry.area,
      status,
      name: s("name"),
      desc: s("desc"),
      cat: s("cat"),
      since: s("since"),
      until: o("until"),
      replacedBy: o("replacedBy"),
      reason: o("reason"),
      web: o("web"),
      repo: o("repo"),
      icon: TIMELINE_ICON_BY_CAT[s("cat")] ?? "code",
    };
    const icon = o("icon");
    if (icon !== undefined) {
      if (!TIMELINE_ICONS.has(icon)) {
        fail(
          file,
          where,
          `unbekanntes Icon "${icon}" (erlaubt: ${
            [...TIMELINE_ICONS].join(", ")
          })`,
        );
      }
      tool.icon = icon as TimelineIcon;
    }

    if (status === "past") {
      if (!tool.until || !YEAR_RE.test(tool.until)) {
        fail(file, where, `"until" (YYYY) fehlt`);
      }
      if (!tool.replacedBy === !tool.reason) {
        fail(file, where, `genau eins von "replacedBy" oder "reason" angeben`);
      }
    } else if (tool.until || tool.replacedBy || tool.reason) {
      fail(file, where, `"until", "replacedBy" und "reason" nur bei "past"`);
    }

    if (entry.release !== undefined) {
      const rel = entry.release as Record<string, unknown>;
      const ver = str(file, `${where} release`, rel, "ver")!;
      const date = str(file, `${where} release`, rel, "date")!;
      if (!DAY_RE.test(date)) {
        fail(file, where, `"release.date" muss YYYY-MM-DD sein`);
      }
      tool.release = { ver, date };
    }

    tool.links = links(file, where, entry);
    return tool;
  });

  const byId = new Map<string, Tool>();
  for (const tool of tools) {
    if (byId.has(tool.id)) fail(file, tool.id, "id ist doppelt");
    byId.set(tool.id, tool);
  }
  for (const tool of tools) {
    if (!tool.replacedBy) continue;
    const next = byId.get(tool.replacedBy);
    if (!next) {
      fail(file, tool.id, `"replacedBy" zeigt auf unbekannte id`);
    }
    if (next.status !== "current") {
      fail(file, tool.id, `Nachfolger "${next.id}" ist selbst nicht aktuell`);
    }
  }
  checkProjects(
    tools.filter((t) => t.group === "own").map((t) => t.id),
    projectIds(),
  );
  return tools;
}

function links(
  file: string,
  where: string,
  entry: Record<string, unknown>,
): Link[] | undefined {
  if (entry.links === undefined) return undefined;
  if (!Array.isArray(entry.links)) {
    fail(file, where, `"links" muss ein Array sein`);
  }
  return entry.links.map((link: Record<string, unknown>) => ({
    label: str(file, `${where} links`, link, "label")!,
    href: str(file, `${where} links`, link, "href")!,
  }));
}

/** iOS-App für die About-Seite; Support-Seiten liegen in static/. */
export interface App {
  id: string;
  name: string;
  desc: string;
  links?: Link[];
}

/** Alle iOS-Apps aus content/apps.json, geprüft. */
export function getApps(): App[] {
  const file = APPS_FILE;
  return readJsonArray(file).map((entry, i): App => {
    const where = `Eintrag ${i + 1} (${entry.id ?? "ohne id"})`;
    const s = (key: string) => str(file, where, entry, key)!;
    return {
      id: s("id"),
      name: s("name"),
      desc: s("desc"),
      links: links(file, where, entry),
    };
  });
}

/** Alle Quellen aus content/feeds.json, geprüft. */
export function getFeedSources(): FeedSource[] {
  const file = FEEDS_FILE;
  return readJsonArray(file).map((entry, i): FeedSource => {
    const where = `Eintrag ${i + 1} (${entry.name ?? "ohne Namen"})`;
    const s = (key: string) => str(file, where, entry, key)!;
    const kind = s("kind");
    if (!(kind in FEED_KINDS)) fail(file, where, `unbekannte Art "${kind}"`);
    if (!isArea(entry.area)) {
      fail(file, where, `unbekannter Bereich "${entry.area}"`);
    }
    return {
      kind: kind as FeedKind,
      area: entry.area,
      name: s("name"),
      handle: s("handle"),
      url: s("url"),
      feed: str(file, where, entry, "feed", true),
      note: str(file, where, entry, "note", true),
    };
  });
}

import { assert, assertEquals, assertThrows } from "@std/assert";
import { getApps, getTools } from "./directory.ts";
import {
  checkProjects,
  getProject,
  projectIds,
  RENAMED_PROJECTS,
} from "./projects.ts";

Deno.test("checkProjects: jedes eigene Tool hat genau einen Text", () => {
  checkProjects(["a", "b"], ["b", "a"]);
});

Deno.test("checkProjects: fehlender Text nennt die id", () => {
  assertThrows(() => checkProjects(["a", "b"], ["a"]), Error, "b");
});

Deno.test("checkProjects: verwaister Text nennt die Datei", () => {
  assertThrows(() => checkProjects(["a"], ["a", "x"]), Error, "x.md");
});

Deno.test("Tools: keine iOS-Apps, jedes eigene Tool mit Text", () => {
  const tools = getTools();
  assertEquals(tools.filter((t) => t.cat === "iOS-App"), []);
  for (const t of tools.filter((t) => t.group === "own")) {
    assert(getProject(t.id)?.html, `${t.id}: Text fehlt`);
  }
});

Deno.test("Externe Tools haben keine Detailseite", () => {
  const ext = getTools().filter((t) => t.group === "ext");
  assert(ext.length > 0);
  for (const t of ext) assertEquals(getProject(t.id), undefined);
});

Deno.test("Apps: iOS-Apps mit Support- und Datenschutzlink", () => {
  const apps = getApps();
  assert(apps.length > 0);
  assert(apps.some((a) => a.links?.some((l) => l.label === "Datenschutz")));
});

Deno.test("Umbenannte Projekte: Ziel existiert, alter Text ist weg", () => {
  const own = new Set(
    getTools().filter((t) => t.group === "own").map((t) => t.id),
  );
  for (const [old, now] of Object.entries(RENAMED_PROJECTS)) {
    assert(own.has(now), `${old} → ${now}: Ziel ist kein eigenes Tool`);
    assert(!own.has(old), `${old}: steht noch in tools.json`);
    assert(!projectIds().includes(old), `${old}.md existiert noch`);
  }
});

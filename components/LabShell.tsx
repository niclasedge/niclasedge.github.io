import type { ComponentChildren } from "preact";
import { LAB_KINDS, type LabItem, type LabKind } from "../lib/lab.ts";
import { getLabItems } from "../lib/lab_pages.ts";

/**
 * Rahmen der Lab-Seiten: links die Übersicht aller Einträge mit
 * Beschreibung, rechts der gewählte Eintrag. Jeder Eintrag hat eine eigene
 * URL (/lab/<slug>) – ein Klick ist normale Navigation, ohne JavaScript.
 * Schmal (mobil): /lab zeigt nur die Liste, eine Lab-Seite nur ihren Inhalt.
 */
export function LabShell(
  { current, children }: { current?: string; children: ComponentChildren },
) {
  const items = getLabItems();
  const groups = (Object.keys(LAB_KINDS) as LabKind[])
    .map((kind) => [kind, items.filter((i) => i.kind === kind)] as const)
    .filter(([, list]) => list.length > 0);
  return (
    <div class={`wrap lab ${current ? "detail" : "index"}`}>
      <aside class="lab-side" aria-label="Lab-Übersicht">
        <p class="lab-side-title">
          <a href="/lab" aria-current={current ? "false" : "page"}>Lab</a>
        </p>
        <p class="sub">
          Kleine Werkzeuge und Seiten, alles läuft lokal im Browser.
        </p>
        {groups.map(([kind, list]) => (
          <section key={kind}>
            <h2 class="lab-group">{LAB_KINDS[kind]}</h2>
            <ul>
              {list.map((item) => (
                <LabLink key={item.slug} item={item} current={current} />
              ))}
            </ul>
          </section>
        ))}
      </aside>
      <div class="lab-main">
        {current && <a class="lab-back" href="/lab">← Alle Labs</a>}
        {children}
      </div>
    </div>
  );
}

function LabLink({ item, current }: { item: LabItem; current?: string }) {
  const external = item.kind === "external";
  return (
    <li>
      <a
        class="lab-link"
        href={item.href}
        aria-current={item.slug === current ? "page" : "false"}
      >
        <b>
          {item.title}
          {external && <span class="ml-1" aria-label="(extern)">↗</span>}
        </b>
        <small>{item.description}</small>
      </a>
    </li>
  );
}

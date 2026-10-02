# niclasedge.github.io

Persönliche Seite von Niclas Edge unter <https://niclasedge.github.io> – gebaut
mit [Deno Fresh 2](https://fresh.deno.dev) (Vite 7, Tailwind CSS 4 mit
`@tailwindcss/typography`, Preact 10) und **statisch exportiert** nach GitHub
Pages.

Es läuft in Produktion kein Server: `deno task export` startet den gebauten
Fresh-Server im Prozess, crawlt alle Seiten und schreibt reines HTML nach
`_site/`. Die GitHub Action schiebt `_site/` bei jedem Push auf `main` in den
Branch `gh-pages`.

## Schnellstart

Voraussetzung: [Deno](https://deno.com) 2.x.

```sh
deno install          # Abhängigkeiten (node_modules) installieren
deno task dev         # Entwicklungsserver mit Hot Reload (http://localhost:5173)
deno task site        # build + export → _site/
deno task preview     # _site/ lokal ausliefern (http://localhost:8000)
deno task check       # fmt --check, lint, Typprüfung (wie in CI)
```

| Task      | Was passiert                                                    |
| --------- | --------------------------------------------------------------- |
| `dev`     | Vite-Dev-Server                                                 |
| `build`   | Produktions-Build nach `_fresh/`                                |
| `export`  | Statischer Export nach `_site/` inkl. Link- und Alt-URL-Prüfung |
| `site`    | `build` + `export`                                              |
| `preview` | Statischen Export lokal ansehen                                 |
| `check`   | `deno fmt --check`, `deno lint`, `deno check`                   |

## Aufbau

```
content/posts/        Blogposts als Markdown (YYYY-MM-DD-slug.md)
content/tools.json    Eigene und externe Tools (Startseite, About, Sitemap)
content/feeds.json    Quellen, denen ich folge (neuester Eintrag beim Build)
content/about.md      Text der About-Seite
routes/               Seiten (Fresh-Dateirouting)
  posts/, tags/       Postliste, Post, Tag-Übersicht, Tag-Seite
  lab/                Lab mit Sidebar; [slug].tsx rendert content/lab/*
  archives.tsx        Alt-URL /archives/   → /posts   (Meta-Refresh)
  categories/         Alt-URL /categories/ → /tags    (Meta-Refresh)
  feed.xml.ts         Atom-Feed
  sitemap.xml.ts      Sitemap
  _404.tsx            404-Seite (Status 404 → _site/404.html)
islands/              Interaktive Komponenten (Startseite, JSON Formatter, Regex Tester, Mermaid)
content/lab/          Lab-Seiten als HTML-Fragment oder Markdown
components/           Gemeinsame Komponenten (Zeitstrahl, Icons, Seitentitel …)
lib/                  Posts, Tools und Feeds lesen, Markdown, Bereiche, Konfiguration
assets/styles.css     Design-Tokens und Komponenten-CSS (Tailwind 4)
static/               Wird 1:1 kopiert (iOS-App-Seiten, sw.js, robots.txt, Favicon)
scripts/export.ts     Statischer Export
scripts/legacy-urls.txt  Alle URLs der alten Jekyll-Seite
```

Seitentitel, Beschreibung und Links stehen in `lib/site.ts`.

## Neuen Post schreiben

1. Datei `content/posts/YYYY-MM-DD-mein-slug.md` anlegen. Die URL wird wie bei
   Jekyll aus dem Dateinamen gebildet: `/posts/mein-slug/`.
2. Front Matter:

   ```markdown
   ---
   title: Mein Titel
   tags: [linux, docker]
   area: infra
   description: Optionaler Teaser für Liste, Feed und Meta-Tags.
   ---

   Inhalt in Markdown (GitHub Flavored) …
   ```

   Optionale Felder:

   | Feld                               | Bedeutung                                                      |
   | ---------------------------------- | -------------------------------------------------------------- |
   | `area`                             | Bereich: `ai`, `automation`, `infra`, `dev` (Standard), `apps` |
   | `description`                      | Teaser; sonst die ersten Sätze des Textes                      |
   | `date`                             | Überschreibt das Datum aus dem Dateinamen                      |
   | `slug`                             | Überschreibt den Slug aus dem Dateinamen                       |
   | `toc: false`                       | Inhaltsverzeichnis ausblenden (sonst ab 3 Überschriften)       |
   | `published: false` / `draft: true` | Post wird nicht veröffentlicht                                 |
   | `categories`                       | Alt-Feld aus Jekyll; wird wie `tags` behandelt                 |

3. Codeblöcke mit Sprache (`` ```python ``) werden per highlight.js eingefärbt.
   `` ```mermaid ``-Blöcke werden im Browser zu Diagrammen – Mermaid wird dafür
   nur auf solchen Seiten vom jsDelivr-CDN nachgeladen.
4. `deno task dev` zum Ansehen, `deno task site` zum Prüfen des Exports.

Tags bekommen automatisch eine Seite unter `/tags/<tag>/` und erscheinen in
Sitemap und Feed.

## Design

Grundlage ist die Design-Referenz „hiro3“ (Things-Stil): ruhige graue Flächen,
ein Blau als Akzent, Zeitstrahlen mit farbigen Punkten je Bereich.

- **Tokens** stehen oben in `assets/styles.css` (`--bg`, `--side`, `--panel`,
  `--text`, `--muted`, `--line`, `--link`, Bereichsfarben …). Dunkel ist
  Standard, hell bei `prefers-color-scheme: light`; `<html data-theme="light">`
  bzw. `"dark"` erzwingt ein Schema.
- Tailwind kennt die Tokens als Farben: `bg-side`, `bg-panel`, `text-fg`,
  `text-muted`, `border-line`, `text-link`, `text-danger` … – keine
  `dark:`-Varianten nötig.
- Die Klassen der Referenz (`.top`, `.intro`, `.seg`, `.area`, `.tl`, `.item`,
  `.post`, `.tool`, `.feed` …) liegen unverändert benannt in
  `@layer components`, damit sich Änderungen an der Referenz direkt übernehmen
  lassen.
- **Bereiche** (Filter + Punktfarbe): `lib/areas.ts`, Icons in
  `components/Icons.tsx`.

## Startseite: Tools und Quellen

Die Startseite (`islands/Directory.tsx`) zeigt Blog, eigene und externe Tools
als Zeitstrahl sowie die Quellen. Suche, Zeitraum („Aktueller Workflow“ /
„Vergangen“) und Bereich filtern alles gleichzeitig; Zeitraum und Bereich stehen
in der URL (`/?view=past&area=dev`). Ohne JavaScript bleibt die serverseitig
gerenderte Ansicht stehen.

### Tool eintragen – `content/tools.json`

```json
{
  "id": "deno",
  "group": "ext",
  "area": "dev",
  "status": "current",
  "name": "Deno",
  "desc": "Runtime für TypeScript …",
  "cat": "Runtime",
  "since": "2026",
  "web": "https://deno.com/",
  "repo": "https://github.com/denoland/deno"
}
```

| Feld         | Bedeutung                                                        |
| ------------ | ---------------------------------------------------------------- |
| `group`      | `own` (eigene Tools) oder `ext` (externe Tools)                  |
| `status`     | `current` oder `past`                                            |
| `since`      | Startjahr; `until` = Endjahr (nur bei `past`)                    |
| `replacedBy` | bei `past`: id des Nachfolgers (springt auf der Seite dorthin) … |
| `reason`     | … oder Begründung „Nicht mehr nötig: …“ (genau eins von beiden)  |
| `release`    | optional `{ "ver": "v1.2.0", "date": "2026-09-14" }`             |
| `web`/`repo` | optionale Links „Website“/„Repo“                                 |
| `links`      | weitere Links `[{ "label": "Datenschutz", "href": "/…" }]`       |

Je Spalte erscheinen höchstens 10 Tools, darunter „Alle N anzeigen“. Im
aktuellen Workflow stehen zuerst die aktiven Tools; sind es weniger als 10, wird
mit vergangenen aufgefüllt (unter „Früher“). Grenze: `TOOLS_VISIBLE` in
`islands/Directory.tsx`.

Ein Tool belegt auf der Startseite zwei Zeilen (Name, Kategorie und Links;
darunter die einzeilige Beschreibung) – `desc` deshalb kurz halten (rund 45
Zeichen), der volle Text steht im Tooltip. Jahr und Bereich zeigen Jahresmarke
und Punktfarbe.

Eigene Apps (`"group": "own", "area": "apps"`) erscheinen zusätzlich auf der
About-Seite; ihre internen `links` landen in der Sitemap. Fehlerhafte Einträge
(doppelte id, unbekannter Bereich, `replacedBy` ins Leere …) brechen den Export
mit einer Meldung ab.

### Quelle eintragen – `content/feeds.json`

```json
{
  "kind": "video",
  "area": "dev",
  "name": "Deno",
  "handle": "YouTube",
  "url": "https://www.youtube.com/@deno_land",
  "feed": "https://www.youtube.com/feeds/videos.xml?channel_id=UCqC2G2M-rg4fzg1esKFLFIw"
}
```

`kind` ist `video`, `release`, `user`, `blog` oder `site` (Website ohne Feed, z.
B. ein Dashboard). Quellen ohne `feed` stehen immer sichtbar unter „Zum
Nachschlagen“; `note` ist dann der Text unter dem Namen. Feed-URLs:

- YouTube: `https://www.youtube.com/feeds/videos.xml?channel_id=<ID>` (die ID
  steht im Seitenquelltext des Kanals als `"externalId"`)
- GitHub-Releases: `https://github.com/<owner>/<repo>/releases.atom`
- GitHub-Account: `https://github.com/<user>.atom`
- Blog: RSS/Atom des Blogs; ohne `feed` wird nur die Quelle verlinkt (Beispiel:
  Artificial Analysis, Anthropic News)

Beim Export lädt `lib/feeds.ts` von jedem Feed den neuesten Eintrag (10 s
Timeout). Ein Feed, der nicht antwortet, erzeugt nur eine Warnung im Log – die
Quelle erscheint dann ohne neuesten Beitrag. `FEEDS=off deno task export`
überspringt das Laden (offline). Damit die Angaben aktuell bleiben, baut die
Action zusätzlich täglich. Was seit „Alle als gelesen markieren“ neu ist, merkt
sich der Browser im `localStorage`.

## Lab

`/lab` zeigt links die Übersicht aller Einträge mit Beschreibung, rechts den
gewählten Eintrag, nativ gerendert (kein iframe). Jeder Eintrag hat eine eigene
URL `/lab/<slug>`; mobil zeigt `/lab` nur die Liste und eine Lab-Seite nur ihren
Inhalt. Abgrenzung: **Lab** = kleine Werkzeuge und HTML-Seiten im Browser,
**Eigene Tools** auf der Startseite = Repos, Skills, Websites und Apps.

Drei Arten (`lib/lab.ts`):

| Art           | Quelle                                    | Beispiel       |
| ------------- | ----------------------------------------- | -------------- |
| `interactive` | Island + Route `routes/lab/<slug>.tsx`    | JSON Formatter |
| `page`        | `content/lab/<slug>.html` oder `.md`      | Design-Tokens  |
| `external`    | Link auf eine andere Seite (eigenes Repo) | Tools-Sammlung |

### HTML-Seite hinzufügen (ohne Code)

`content/lab/<slug>.html` anlegen – wird automatisch gefunden:

```html
---
title: Mein Spickzettel
short: Kurztext für die Startseite
description: Beschreibung für Sidebar und Seitentitel.
order: 10 # optional, Sortierung innerhalb der Seiten
---
<style>
.mein-zettel td {
  padding: .25rem .5rem;
}
</style>
<table class="mein-zettel">…</table>
```

Das HTML wird unverändert in den rechten Bereich eingesetzt: nur ein Fragment
(kein `<html>`/`<body>`), eigene CSS-Regeln über eine eigene Klasse eingrenzen
(sie gelten sonst für die ganze Seite), Farben über die Tokens (`var(--text)` …)
– dann passt die Seite automatisch zu hell und dunkel. `.md` statt `.html` wird
als Markdown gerendert.

### Interaktives Werkzeug hinzufügen

1. Island anlegen, z. B. `islands/Base64Tool.tsx` (Preact-Komponente, Zustand
   mit `@preact/signals`).
2. Seite anlegen: `routes/lab/base64.tsx` mit `<LabShell current="base64">` –
   siehe `routes/lab/json-formatter.tsx` als Vorlage.
3. Eintrag in `interactiveLabs` in `lib/lab.ts` ergänzen (`slug` = Dateiname der
   Route). Damit erscheint es in der Lab-Sidebar, im Schnellzugriff unter dem
   Blog und in der Sitemap.

Größere Einzelseiten-Werkzeuge gehören eher ins Repo
[niclasedge/tools](https://github.com/niclasedge/tools) – das ist eine eigene
GitHub-Pages-Project-Site unter `/tools/` und wird von diesem Export bewusst
nicht gecrawlt (ein Ordner `_site/tools` würde sie verdecken und lässt den
Export fehlschlagen).

## Alt-URLs (Jekyll/Chirpy)

Die Seite lief bis 2026 mit Jekyll und dem Chirpy-Theme. Alle damals
öffentlichen URLs stehen in `scripts/legacy-urls.txt` und funktionieren weiter:

- `/posts/<slug>/`, `/tags/…`, `/about/`, `/feed.xml`, `/sitemap.xml`,
  `/robots.txt`, `/404.html` – gleiche Pfade wie vorher.
- `/archives/` → `/posts/`, `/categories/` → `/tags/`, `/categories/<c>/` →
  `/tags/<c>/` per Meta-Refresh (GitHub Pages kann keine echten Redirects).
- `/<app>-ios/index.html` und `privacy.html` – App-Store-Support- und
  Datenschutzseiten, liegen **byte-identisch** in `static/`. Nicht
  umformatieren: `deno fmt`/`lint` ignorieren `static/`, und der Export prüft,
  dass jede Datei aus `static/` unverändert in `_site/` landet.
- `/sw.js` ist ein Kill-Switch für den alten Chirpy-Service-Worker: Er löscht
  alle Caches, meldet sich ab und lädt offene Tabs neu. Nicht entfernen.

Der Export bricht ab, wenn

- eine URL aus `scripts/legacy-urls.txt` im Export fehlt,
- ein interner Link nicht mit Status 200 antwortet,
- eine Datei aus `static/` nicht byte-identisch kopiert wurde oder
- die 404-Seite nicht Status 404 liefert.

Wer eine Seite umbenennt, lässt unter der alten Route eine Weiterleitung
(`components/Redirect.tsx`) stehen und trägt die alte URL in
`scripts/legacy-urls.txt` ein.

## Deployment

`.github/workflows/pages-deploy.yml`:

- **Pull Requests:** `deno install --frozen`, `deno task check`, `build`,
  `export` – nur bauen und prüfen, kein Deploy.
- **Push auf `main`:** zusätzlich Deploy von `_site/` auf den Branch `gh-pages`
  via `peaceiris/actions-gh-pages@v4`. GitHub Pages liefert `gh-pages` aus.
- **Täglich (04:17 UTC):** gleicher Ablauf wie ein Push auf `main`, damit die
  Quellen aktuell bleiben. GitHub pausiert geplante Workflows, wenn im Repo 60
  Tage nichts passiert – dann unter _Actions_ wieder aktivieren.

Neue Abhängigkeiten in `deno.json` eintragen und `deno install` ausführen, damit
`deno.lock` aktualisiert wird – CI installiert mit `--frozen`.

## Hinweise zur Technik

- Posts werden zur Laufzeit per `Deno.readDirSync` gelesen (`import.meta.glob`
  mit `?raw` funktioniert im SSR-Build nicht). Das ist unkritisch, weil der
  Server nur lokal und beim Export läuft.
- `trailingSlashes("never")`: Dynamische Fresh-Routen matchen keinen Slash am
  Ende. Interne Links deshalb **ohne** Slash schreiben (`/posts/foo`); GitHub
  Pages leitet sie auf `/posts/foo/` weiter.
- Daten werden in Route-Handlern geladen; unbekannte Slugs werfen dort
  `HttpError(404)`.
- Mermaid wird nicht gebündelt (der SSR-Build scheitert an `node:module`),
  sondern im Island per `import()` vom jsDelivr-ESM-Bundle geladen.

## Lizenz

[MIT](LICENSE)

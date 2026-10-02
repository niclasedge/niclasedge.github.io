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
content/about.md      Text der About-Seite
routes/               Seiten (Fresh-Dateirouting)
  posts/, tags/       Postliste, Post, Tag-Übersicht, Tag-Seite
  lab/                Lab-Übersicht und je eine Seite pro Werkzeug
  archives.tsx        Alt-URL /archives/   → /posts   (Meta-Refresh)
  categories/         Alt-URL /categories/ → /tags    (Meta-Refresh)
  feed.xml.ts         Atom-Feed
  sitemap.xml.ts      Sitemap
  _404.tsx            404-Seite (Status 404 → _site/404.html)
islands/              Interaktive Komponenten (JSON Formatter, Regex Tester, Mermaid)
components/           Gemeinsame Komponenten
lib/                  Posts lesen, Markdown rendern, Seiten-Konfiguration
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
   description: Optionaler Teaser für Liste, Feed und Meta-Tags.
   ---

   Inhalt in Markdown (GitHub Flavored) …
   ```

   Optionale Felder:

   | Feld                               | Bedeutung                                                |
   | ---------------------------------- | -------------------------------------------------------- |
   | `description`                      | Teaser; sonst die ersten Sätze des Textes                |
   | `date`                             | Überschreibt das Datum aus dem Dateinamen                |
   | `slug`                             | Überschreibt den Slug aus dem Dateinamen                 |
   | `toc: false`                       | Inhaltsverzeichnis ausblenden (sonst ab 3 Überschriften) |
   | `published: false` / `draft: true` | Post wird nicht veröffentlicht                           |
   | `categories`                       | Alt-Feld aus Jekyll; wird wie `tags` behandelt           |

3. Codeblöcke mit Sprache (`` ```python ``) werden per highlight.js eingefärbt.
   `` ```mermaid ``-Blöcke werden im Browser zu Diagrammen – Mermaid wird dafür
   nur auf solchen Seiten vom jsDelivr-CDN nachgeladen.
4. `deno task dev` zum Ansehen, `deno task site` zum Prüfen des Exports.

Tags bekommen automatisch eine Seite unter `/tags/<tag>/` und erscheinen in
Sitemap und Feed.

## Lab-Werkzeug hinzufügen

Lab-Werkzeuge sind Fresh-Islands und laufen komplett im Browser.

1. Island anlegen, z. B. `islands/Base64Tool.tsx` (Preact-Komponente, Zustand
   mit `@preact/signals`).
2. Seite anlegen: `routes/lab/base64.tsx` – siehe
   `routes/lab/json-formatter.tsx` als Vorlage.
3. Eintrag in `lib/lab.ts` ergänzen (`slug` = Dateiname der Route). Damit
   erscheint die Karte auf der Startseite, unter `/lab` und in der Sitemap.

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

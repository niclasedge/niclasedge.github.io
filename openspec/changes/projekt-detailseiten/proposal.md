## Why

Im Tool-Verzeichnis der Startseite stehen eigene Tools nur mit einer Zeile. Was
ein Tool gemacht hat, wie es funktioniert und warum es abgelöst wurde, steht
nirgends. Dazu belegen die iOS-Apps Platz im Verzeichnis, obwohl sie schon auf
der About-Seite stehen. Issue: niclasedge/niclasedge.github.io#3.

## What Changes

- Jedes eigene Tool bekommt eine Detailseite unter `/projekte/<id>/`. Sie zeigt
  Zweck, Funktionsweise und Stand, bei abgelösten Tools auch den Grund und den
  Nachfolger. Der Text liegt als Markdown in `content/projekte/<id>.md` und ist
  aus dem jeweiligen Repo abgeleitet.
- Im Verzeichnis verlinkt der Name eines eigenen Tools auf seine Detailseite.
- Die iOS-Apps ziehen aus `content/tools.json` nach `content/apps.json`. Die
  About-Seite und die Sitemap lesen sie dort. Ihre Support- und
  Datenschutzseiten in `static/` bleiben unverändert.
- Neue eigene Tools: Folienschmiede, hook-redactor, ops-lab,
  go-knowledge-planner.
- OpenSpec wird im Repo eingerichtet (`openspec/`).

## Capabilities

### New Capabilities

- `tool-verzeichnis`: Eigene und externe Tools auf der Startseite, Detailseiten
  für eigene Tools, Trennung von iOS-Apps.

### Modified Capabilities

(keine – bisher gibt es keine Specs im Repo)

## Impact

- Berührte Dateien: `content/tools.json`, `content/apps.json` (neu),
  `content/projekte/*.md` (neu), `lib/directory.ts`, `lib/projects.ts` (neu),
  `lib/projects_test.ts` (neu), `routes/projekte/[id].tsx` (neu),
  `components/Timeline.tsx`, `routes/about.tsx`, `routes/sitemap.xml.ts`,
  `deno.json`, `.github/workflows/pages-deploy.yml`.
- Der Export crawlt die neuen Seiten über die Links im Verzeichnis. Ein
  fehlender Detailtext bricht Test und Export ab.
- Abgrenzung: externe Tools bekommen keine Detailseite. Die iOS-Apps werden
  nicht beschrieben.

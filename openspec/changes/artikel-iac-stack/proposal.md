## Why

Der IaC-Stack betreibt seit Juli 2026 alle Hosts, Dienste, geplanten Jobs und
Alarme aus einem Repo. Das Repo ist privat; ein Artikel soll zeigen, welche
Technologie wofür eingesetzt wird und wie die Teile zusammenspielen – nicht das
Repo Datei für Datei. Issue: niclasedge/niclasedge.github.io#11.

## What Changes

- Neuer Post `content/posts/2026-07-23-iac-stack.md`. Das Datum ist der erste
  Commit im Repo (2026-07-23).
- Schaubilder als Mermaid: Hosts und Rollen, Deploy-Pfad, Scheduler, Alarmkette,
  Secrets.
- Artikelbild `static/images/posts/iac-stack.svg` und das gerenderte PNG.

## Capabilities

### New Capabilities

(keine)

### Modified Capabilities

(keine – reine Inhaltsänderung; die Pflicht zum Artikelbild prüft der bestehende
Test, daher `skip_specs: true`)

## Impact

- Berührte Dateien: `content/posts/2026-07-23-iac-stack.md`,
  `static/images/posts/iac-stack.{svg,png}`.
- Keine Hostnamen, Domains, IPs oder einzelnen Dienstnamen im Text.

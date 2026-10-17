## Why

Die Lesefassung `docs/sop-plugins-workflow.md` aus ops-lab beschreibt
Plugin-Auswahl, gemeinsame SOP, Schreibregeln und einen vollständigen
Beispielablauf. Sie soll als Artikel auf der Seite erscheinen. Issue:
niclasedge/niclasedge.github.io#13.

## What Changes

- Neuer Post `content/posts/2026-10-04-ops-lab-sop-plugins.md` mit dem Inhalt
  der Lesefassung. SOP und unslop-de bleiben im Wortlaut, ihre Überschriften
  rücken zwei Ebenen tiefer.
- Das interaktive Archify-Schaubild (`sop-workflow.html`) wird als
  Mermaid-Diagramm nachgebaut, gleiche Knoten und Kanten.
- Der Name der privaten Org entfällt (`<org>/ops-lab-plugin`).
- Artikelbild `static/images/posts/ops-lab-sop-plugins.svg` und das PNG.

## Capabilities

### New Capabilities

(keine)

### Modified Capabilities

(keine – reine Inhaltsänderung; die Pflicht zum Artikelbild prüft der bestehende
Test, daher `skip_specs: true`)

## Impact

- Berührte Dateien: `content/posts/2026-10-04-ops-lab-sop-plugins.md`,
  `static/images/posts/ops-lab-sop-plugins.{svg,png}`.

## Why

Auf breiten Bildschirmen bleibt neben einem Artikel viel Platz ungenutzt. Das
Inhaltsverzeichnis steht nur über dem Text, und vom Artikel aus führt kein Weg
zu weiteren Artikeln, Tools oder Tags. Gesucht werden kann nur auf der
Startseite. Issue: niclasedge/niclasedge.github.io#5.

## What Changes

- Artikelansicht ab 80rem dreispaltig: links das mitlaufende Inhaltsverzeichnis,
  in der Mitte der Text, rechts eine Sidebar mit drei weiteren Artikeln,
  passenden Tools und allen Tags.
- Schmale Ansicht: Inhaltsverzeichnis wie bisher über dem Text, Sidebar unter
  dem Artikel.
- Suchfeld in der Kopfleiste aller Unterseiten. Es führt zu `/?q=<begriff>`, und
  die Suche der Startseite übernimmt den Begriff.

## Capabilities

### New Capabilities

- `artikel-ansicht`: Aufbau der Artikelseite mit Inhaltsverzeichnis, Sidebar und
  Suche in der Kopfleiste.

### Modified Capabilities

(keine)

## Impact

- Berührte Dateien: `routes/posts/[slug].tsx`, `routes/_app.tsx`,
  `components/PostSidebar.tsx` (neu), `lib/posts.ts`, `lib/posts_test.ts` (neu),
  `islands/Directory.tsx`, `assets/styles.css`, `README.md`.
- Abgrenzung: Detailseiten der Tools, Lab und Startseite behalten ihr Layout.
  Die Suche bleibt die bestehende Suche der Startseite, es gibt keinen
  Suchindex.

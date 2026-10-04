## Purpose

Jeder Artikel hat ein eigenes Bild, das seinen Inhalt zeigt. Es dient als
Titelbild, als Vorschaubild auf Startseite und Postliste und als Vorschau beim
Teilen eines Links.

## ADDED Requirements

### Requirement: Bild je Artikel

Jeder veröffentlichte Artikel SHALL ein Bild unter `/images/posts/<slug>.png`
mit 1200×630 Pixeln haben, gerendert aus `<slug>.svg` im selben Ordner. Fehlt
eines davon oder stimmt die Größe nicht, MUST `deno task test` mit einer Meldung
fehlschlagen, die den Slug nennt.

#### Scenario: Alle Artikel haben ein Bild

- **WHEN** `deno task test` läuft
- **THEN** besteht der Test nur, wenn es zu jedem Artikel SVG und PNG mit
  1200×630 gibt

### Requirement: Bild auf Artikel, Zeitstrahl und Vorschau

Die Artikelseite SHALL das Bild unter dem Titel zeigen und es als `og:image` mit
`twitter:card` `summary_large_image` ausweisen. Der Zeitstrahl SHALL statt des
Platzhalters das Bild als Vorschaubild zeigen. Hat ein Artikel kein Bild, MUST
der bisherige Platzhalter erscheinen.

#### Scenario: Artikelseite

- **WHEN** `/posts/ticktick-zu-openspec` geladen wird
- **THEN** steht unter dem Titel das Bild, und der Kopf enthält `og:image` mit
  der absoluten URL des PNG

#### Scenario: Zeitstrahl

- **WHEN** die Startseite geladen wird
- **THEN** zeigt jeder Artikel im Blog-Zeitstrahl sein PNG als Vorschaubild

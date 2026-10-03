## Purpose

Das Tool-Verzeichnis zeigt eigene und externe Tools auf der Startseite. Eigene
Tools haben eine Detailseite, die erklärt, was das Tool tut, wie es funktioniert
und warum es gegebenenfalls abgelöst wurde.

## ADDED Requirements

### Requirement: Detailseite je eigenem Tool

Jedes eigene Tool (`group: "own"`) SHALL eine Detailseite unter
`/projekte/<id>/` haben. Ihr Text kommt aus `content/projekte/<id>.md`. Fehlt
der Text für ein eigenes Tool oder gibt es einen Text ohne passendes eigenes
Tool, MUST der Build mit einer Meldung abbrechen, die die id nennt.

#### Scenario: Eigenes Tool mit Text

- **WHEN** `content/tools.json` ein eigenes Tool `ops-lab` enthält und
  `content/projekte/ops-lab.md` existiert
- **THEN** liefert `/projekte/ops-lab/` Status 200 mit Name, Kategorie, Zeitraum
  und dem gerenderten Text

#### Scenario: Text fehlt

- **WHEN** ein eigenes Tool keine Datei in `content/projekte/` hat
- **THEN** bricht das Laden der Tools mit einer Meldung ab, die die id nennt

#### Scenario: Verwaister Text

- **WHEN** `content/projekte/` eine Datei enthält, zu der es kein eigenes Tool
  gibt
- **THEN** bricht das Laden der Tools mit einer Meldung ab, die den Dateinamen
  nennt

#### Scenario: Externes Tool

- **WHEN** ein Tool `group: "ext"` hat
- **THEN** gibt es dafür keine Detailseite und `/projekte/<id>/` liefert 404

### Requirement: Abgelöstes Tool nennt seinen Nachfolger

Die Detailseite eines abgelösten eigenen Tools (`status: "past"`) SHALL den
Zeitraum und den Nachfolger zeigen. Ist der Nachfolger ein eigenes Tool, MUST
der Link auf dessen Detailseite zeigen.

#### Scenario: Nachfolger ist eigenes Tool

- **WHEN** `site-jekyll` durch `site` abgelöst wurde
- **THEN** zeigt `/projekte/site-jekyll/` „Abgelöst durch“ mit Link auf
  `/projekte/site/`

#### Scenario: Nachfolger ist externes Tool

- **WHEN** `cronjob-manager` durch das externe Tool `semaphore` abgelöst wurde
- **THEN** zeigt die Seite „Abgelöst durch Semaphore UI“ mit Link auf dessen
  Website oder Repo

### Requirement: Verzeichnis verlinkt Detailseiten

Im Tool-Verzeichnis der Startseite SHALL der Name jedes eigenen Tools auf seine
Detailseite verlinken. Diese Links stehen auch im serverseitig gerenderten HTML,
damit der statische Export die Seiten findet.

#### Scenario: Link im Verzeichnis

- **WHEN** die Startseite ohne JavaScript geladen wird
- **THEN** enthält der Eintrag jedes sichtbaren eigenen Tools einen Link
  `/projekte/<id>`

### Requirement: iOS-Apps nicht im Tool-Verzeichnis

`content/tools.json` MUST keine Einträge der Kategorie `iOS-App` enthalten.
iOS-Apps stehen in `content/apps.json`. Die About-Seite und die Sitemap lesen
sie dort, ihre Support- und Datenschutzseiten bleiben unter den bisherigen URLs
erreichbar.

#### Scenario: Tool-Verzeichnis ohne iOS

- **WHEN** die Tools geladen werden
- **THEN** hat kein Tool die Kategorie `iOS-App`

#### Scenario: About-Seite und Sitemap

- **WHEN** `/about` und `/sitemap.xml` gerendert werden
- **THEN** listet `/about` die iOS-Apps mit Support- und Datenschutzlinks, und
  die Sitemap enthält deren Seiten

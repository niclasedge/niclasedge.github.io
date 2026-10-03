## Purpose

Die Artikelseite nutzt breite Bildschirme für Orientierung: Inhaltsverzeichnis
links, Verweise auf weitere Artikel, Tools und Tags rechts, dazu eine Suche in
der Kopfleiste jeder Unterseite.

## ADDED Requirements

### Requirement: Inhaltsverzeichnis links bei Platz

Hat ein Artikel ein Inhaltsverzeichnis, SHALL es ab einer Fensterbreite von
80rem links neben dem Text stehen und beim Scrollen sichtbar bleiben. Darunter
MUST es wie bisher über dem Text stehen.

#### Scenario: Breites Fenster

- **WHEN** ein Artikel mit mehr als zwei Überschriften bei 1440px Breite
  geöffnet wird
- **THEN** steht das Inhaltsverzeichnis links neben dem Text und bleibt beim
  Scrollen sichtbar

#### Scenario: Schmales Fenster

- **WHEN** derselbe Artikel bei 390px Breite geöffnet wird
- **THEN** steht das Inhaltsverzeichnis über dem Text

### Requirement: Sidebar mit weiteren Artikeln, Tools und Tags

Die Artikelseite SHALL eine Sidebar mit drei weiteren Artikeln, bis zu fünf
Tools und allen Tags zeigen. Ab 80rem steht sie rechts neben dem Text, darunter
unter dem Artikel. Weitere Artikel MUST den aktuellen Artikel ausschließen und
Artikel mit gemeinsamen Tags vor neueren ohne gemeinsame Tags reihen. Tools MUST
aus dem Bereich des Artikels kommen, aktuelle vor vergangenen und eigene vor
externen.

#### Scenario: Weitere Artikel

- **WHEN** ein Artikel geöffnet wird und es mindestens vier Artikel gibt
- **THEN** zeigt die Sidebar genau drei andere Artikel, zuerst die mit den
  meisten gemeinsamen Tags, sonst die neuesten

#### Scenario: Tools zum Bereich

- **WHEN** ein Artikel im Bereich `automation` geöffnet wird
- **THEN** zeigt die Sidebar nur Tools aus `automation`, eigene mit Link auf
  ihre Detailseite

### Requirement: Suche in der Kopfleiste

Jede Unterseite SHALL in der Kopfleiste ein Suchfeld haben, das ohne JavaScript
als Formular zu `/?q=<begriff>` führt. Die Startseite MUST den Begriff aus `q`
in ihr Suchfeld übernehmen und danach filtern. Auf der Startseite selbst
entfällt das Suchfeld in der Kopfleiste.

#### Scenario: Suche von einem Artikel

- **WHEN** im Suchfeld der Kopfleiste „openspec“ eingegeben und abgeschickt wird
- **THEN** öffnet sich `/?q=openspec`, und Blog und Tools sind nach „openspec“
  gefiltert

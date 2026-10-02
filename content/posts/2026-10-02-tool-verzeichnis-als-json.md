---
title: Tool-Verzeichnis und Quellen als JSON in Fresh
area: automation
tags: [fresh, json, feeds]
description: Woher die Startseite ihre Tools und Quellen bekommt – zwei JSON-Dateien, ein Feed-Abruf beim Build und ein täglicher Rebuild.
---

Die Startseite zeigt neben dem Blog zwei Zeitstrahlen – eigene und externe
Tools – und darunter die Quellen, denen ich folge. Ein CMS gibt es dafür nicht,
nur zwei Dateien im Repo.

## Tools: `content/tools.json`

Jeder Eintrag beschreibt ein Tool mit Bereich, Kategorie und Zeitraum:

```json
{
  "id": "jekyll",
  "group": "ext",
  "area": "dev",
  "status": "past",
  "name": "Jekyll + Chirpy",
  "desc": "Static-Site-Generator in Ruby mit dem Chirpy-Theme.",
  "cat": "Framework",
  "since": "2022",
  "until": "2026",
  "replacedBy": "fresh"
}
```

- `group` trennt eigene (`own`) von externen Tools (`ext`).
- `status` steuert den Umschalter „Aktueller Workflow“ / „Vergangen“.
- Ein vergangenes Tool hat entweder einen Nachfolger (`replacedBy`) oder eine
  Begründung (`reason`). Der Nachfolger ist auf der Seite direkt anspringbar.

Beim Export wird die Datei geprüft: doppelte IDs, unbekannte Bereiche oder ein
`replacedBy` ins Leere brechen den Build mit einer klaren Meldung ab.

## Quellen: `content/feeds.json`

Für jede Quelle stehen Name, Link und – wenn vorhanden – ein RSS- oder
Atom-Feed in der Datei:

| Quelle          | Feed                                                 |
| --------------- | ---------------------------------------------------- |
| YouTube-Kanal   | `youtube.com/feeds/videos.xml?channel_id=<ID>`       |
| GitHub-Releases | `github.com/<owner>/<repo>/releases.atom`            |
| GitHub-Account  | `github.com/<user>.atom`                             |
| Blog            | RSS/Atom des Blogs                                   |

Beim Build lädt die Seite von jedem Feed den neuesten Eintrag. Antwortet ein
Feed nicht, bleibt die Quelle sichtbar, nur eben ohne neuesten Beitrag – der
Build läuft weiter.

## Damit die Quellen aktuell bleiben

Weil die Seite statisch ist, zeigt sie den Stand des letzten Builds. Die GitHub
Action baut deshalb zusätzlich einmal am Tag. Was seit dem letzten Klick auf
„Alle als gelesen markieren“ neu ist, merkt sich der Browser im
`localStorage` – ganz ohne Server.

## Was es macht

Ein GitHub-Dashboard aus einer einzigen Go-Binary: Issues über alle Repos, ein
Planner mit Agenda, ein Actions-Tracker und weitere Seiten aus `config.yaml`.
Der Kern ist, GitHub so selten wie möglich zu fragen. Ein Poll, der nichts Neues
findet, kostet kein Rate-Limit. Git Planner gibt es auch als iOS-Client.

## Wie es funktioniert

Die Regel hinter dem Design: Beim Seitenaufruf wird nie gefetcht. Ein Request
liest den letzten Stand aus dem Speicher, Refreshes laufen im Hintergrund.

- Jeder Request an GitHub ist bedingt (`If-None-Match`). Die ETags liegen in
  SQLite und überleben den Neustart; ein `304 Not Modified` zählt nicht gegen
  das Rate-Limit.
- Alle 5 Minuten fragt ein einziger inkrementeller Request nach Änderungen,
  einmal pro Stunde läuft ein voller Abgleich über alle Repos.
- Die Issue-Summen je Repo kommen über GraphQL, 20 Repos pro Anfrage.
- Die Oberfläche besteht aus Go-Templates und HTMX. Assets und Schriften liegen
  per `embed` in der Binary, ohne Build-Step fürs Frontend.
- Widgets für weitere Seiten: `monitor`, `semaphore`, `ollama`, `beads`,
  `bookmarks`, `iframe`, `html`.

```bash
go build -o git-planner .
./git-planner   # http://127.0.0.1:8092
```

Gemessen über 224 Repos verbrauchten zwei warme Runden mit 1176 bedingten
Requests exakt 0 vom Rate-Limit. Die Actions-Seite mit 48 Repo-Karten rendert in
9 ms.

Login gibt es keinen. Der Server hört nur auf Loopback und optional auf der
Tailscale-Adresse – das Tailnet ist die Authentifizierung.

## Stand

Der erste Commit stammt vom 26. Juli 2026, der letzte vom 1. September 2026 –
47 Commits. Die Testsuite umfasst 330 Testfunktionen, `go test ./...` läuft
grün. Zuletzt kamen eine Ansicht für beads-Tasks und eine Zyklus-Planung aus
`cycles.yml` dazu. Die Idee für `config.yaml` und Widgets stammt von
[glance](https://github.com/glanceapp/glance); der Code ist eigenständig.

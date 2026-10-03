## Was es macht

Eine Lese-Oberfläche für [Miniflux](https://miniflux.app), gebaut für das
Handy. Sie ersetzt das eingebaute Miniflux-Frontend für meinen eigenen
Feed-Konsum. Feeds, Inhalte sowie Gelesen- und Stern-Status bleiben allein in
Miniflux – der Reader hält davon nichts selbst.

## Wie es funktioniert

Ein kleiner Go-Server mit HTML-Templates; einzige Go-Abhängigkeit ist
`yaml.v3`.

- **Chronik als Startansicht:** Jeder Feed hat in `config.yaml` ein Tier von S
  bis C. Die Chronik zeigt nur S und A, nach Tagen gruppiert. B und C bleiben
  im Reader, aber aus dem Blickfeld.
- **Kanäle-Tab:** Tier, Kategorie und `always_show` je Feed setzen, neue Feeds
  abonnieren. Der Reader schreibt `config.yaml` atomar zurück.
- **Raindrop.io (optional):** Der Stern legt zusätzlich ein Lesezeichen an, dazu
  kommen Notizen je Artikel und ein Erledigt-Schalter.
- **HTMX nur als Verbesserung:** Jede Aktion funktioniert auch ohne JavaScript
  als normales Formular oder normaler Link.
- Läuft als Docker-Container, nur im Tailnet erreichbar.

```bash
MINIFLUX_URL=… MINIFLUX_TOKEN=… go run .
```

## Stand

Der erste Commit stammt vom 30. Juli 2026, der letzte vom 30. August 2026 –
52 Commits, 182 Testfunktionen, `go test ./...` läuft grün. Getestet wird gegen
einen nachgebauten Miniflux-Server, nie gegen eine echte Instanz. Seit Ende
August deckt der Reader im Browser ab, was zuvor nur eine iOS-App konnte; beide
lesen dieselbe `config.yaml`. Bewusst offen sind eine Bereinigung der
Artikeltexte und der Abgleich der Feed-Liste zurück nach Miniflux.

## Vorgänger

Davor lief ab März 2025 `django-llm-aggregator`: ein eigener Aggregator mit
Django, Celery und HTMX, der RSS-Feeds und YouTube-Kanäle selbst abrief,
speicherte und per LLM zusammenfasste. Der rss-reader dreht das um. Abrufen und
Speichern übernimmt Miniflux, der Reader ist nur noch die Oberfläche zum Lesen
und Sortieren.

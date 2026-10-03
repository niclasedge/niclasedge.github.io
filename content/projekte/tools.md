## Was es macht

Eine Sammlung kleiner Werkzeuge, die jeweils als einzelne HTML-Datei im Browser
laufen – ohne Build und ohne Server. Vorbild ist das
[tools-Repository von Simon Willison](https://github.com/simonw/tools). Die
Seite liegt als eigene GitHub-Pages-Project-Site unter `/tools/`.

## Wie es funktioniert

Jedes Werkzeug ist eine eigenständige `.html`-Datei mit eingebettetem CSS und
JavaScript. Derzeit sind es drei:

- `base64-encoder.html` – Base64 kodieren und dekodieren.
- `color-wheel.html` – interaktives Farbrad; zu einer gewählten Farbe zeigt es,
  wie man sie aus Grund- und Sekundärfarben mischt.
- `image-analysis.html` – Farbanalyse von Bildern.

Die Übersichtsseite entsteht beim Deploy. Eine GitHub Action führt drei
Python-Skripte aus und kopiert danach alle HTML- und JSON-Dateien nach `_site/`:

```sh
python gather_links.py   # Commit-Historie je HTML-Datei → gathered_links.json
python build_index.py    # daraus die Übersicht als index.html
python db_to_json.py     # Bild-URLs aus history.db → images.json
```

Die Übersicht sortiert die Werkzeuge nach dem letzten Commit und zeigt deren
Commit-Nachrichten.

Neben den HTML-Werkzeugen liegen im Repo Experimente, die nicht auf der Seite
erscheinen: Agenten zur Diagrammerzeugung, ein Vergleich des Vercel AI SDK mit
Google ADK und Benchmarks lokaler Modelle über Ollama.

## Stand

Der erste Commit stammt vom 2. April 2025, der letzte vom 16. August 2026 –
39 Commits. Die drei HTML-Werkzeuge entstanden alle Anfang April 2025; danach
kamen nur noch Experimente und Pflege dazu. Tests für die Werkzeuge gibt es
nicht.

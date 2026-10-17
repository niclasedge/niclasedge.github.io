## Was es macht

rust-redactor ist ein einzelnes Rust-Binary (`redactor`), das Secrets und
personenbezogene Daten aus Text und Dateien entfernt, bevor sie in den Kontext
eines Coding-Agenten gelangen. Es hängt sich als Hook in Claude Code, Codex und
OpenCode; für den Agenten pi gibt es eine eigene Extension. API-Keys, Tokens,
private Schlüssel oder Begriffe aus einer eigenen Liste erscheinen dann nur noch
als Platzhalter wie `<redacted:github_token>`.

## Wie es funktioniert

- Hooks für Prompt-Eingabe, Bash, Read und Edit/Write. Grep, NotebookEdit und
  MCP-Werkzeuge sind gesperrt. Ein blockierter Prompt landet geschwärzt in der
  Zwischenablage, dazu kommt eine Desktop-Benachrichtigung.
- Vier Modi: `csv`, `json` (Struktur bleibt, Werte werden geschwärzt), `env` und
  `pattern` für freien Text. `auto` wählt nach Dateiname.
- Ein Path-Guard sperrt `.env`-Dateien, Schlüsselcontainer wie `.kdbx` oder
  `.p12` und Pfade aus `~/.redactorignore`. Projektregeln stehen in
  `.redactor.toml`. Jede Schwärzung landet in einem täglichen Log.
- Ein optionaler Python-Sidecar (Presidio, GLiNER, spaCy) klassifiziert Dateien
  per ML und schlägt Einträge für `~/.redactorignore` vor. Alles andere läuft
  ohne Python.
- Dazu kommt `redactor search`, eine BM25-Suche über Markdown, deren Treffer
  ebenfalls geschwärzt werden.

```bash
redactor install-plugin global    # Hooks in die globalen Claude-Code-Settings
r wrap -- cat config.yaml         # Ausgabe eines Befehls geschwärzt weiterreichen
```

## Grenzen

Die Schwärzung ist regelbasiert: Was keine Regel, kein Stichwort und kein Pfad
beschreibt, bleibt stehen. Ein Hook greift nur bei den Werkzeugen, an die er
angeschlossen ist.

## Stand

Version 0.8.x, rund 520 Rust-Tests. Die CI baut und testet für Linux und
Windows. Installierbar per `cargo`, per Installer-Befehl oder als
Claude-Code-Plugin.

## Vorgänger

Zuerst gab es dsgvo (März 2026): Python-Hooks für Claude Code mit einer
gemeinsamen PII-Engine in drei Stufen (Regex, Keyword-Kontext, GLiNER) und
einem Generator für anonymisierte `.clean`-Kopien. Sie leben als
[claude-code-dsgvo-hooks](/projekte/claude-code-dsgvo-hooks) weiter. Ab Ende
April 2026 löste ein einzelnes Rust-Binary dieselbe Aufgabe, das heute
rust-redactor heißt. Laut Migrationsanleitung ersetzt `redactor install-hooks .`
die Kette der Python-Skripte: ein Binary statt vieler Skripte plus Engine.

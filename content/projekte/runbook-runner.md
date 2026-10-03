## Was es macht

Runbook Runner ist eine macOS-App, die Ansible-Playbooks und Skripte aus einem
Ordner startet. Sie zeigt die Ausgabe live, merkt sich jeden Lauf und fragt
Parameter vorher ab. Gedacht ist sie für den Moment, in dem ich am Mac sitze
und einen Job von Hand anstoßen will, ohne die Befehlszeile zusammenzusuchen.

## Wie es funktioniert

- **Ordner statt Register:** Unterordner werden Kategorien, `.yml` wird mit
  `ansible-playbook` gestartet, `.sh` mit `bash`, `.py` mit `uv run`, JS/TS mit
  `bun`. Eine neue Datei erscheint ohne weitere Pflege.
- **Optionale Metadaten:** `_category.json` setzt Namen, Beschreibung, Timeout
  und Parameter; `.runbookrunner.json` liefert Inventory, `PATH` und
  Umgebungsvariablen. Fehlerhafte Metadaten brechen die Suche nicht ab.
- **Ausführung:** Mehrere Skripte laufen parallel, jedes mit eigener Konsole
  inklusive ANSI-Farben. Bei Ansible entscheidet der `PLAY RECAP` über Erfolg
  oder Fehler. Abbrechen sendet `SIGTERM`.
- **Zeitpläne:** Die App liest crontab und LaunchAgents und ordnet Einträge den
  passenden Skripten zu – nur zur Anzeige, geplant wird weiter dort.
- **Aufbau:** SwiftUI mit Swift Package Manager; die Logik liegt in einem
  getesteten Kit-Target, das App-Target enthält nur den Einstieg.

```bash
swift test
swift run RunbookRunner
```

## Stand

Der Großteil entstand am 2026-07-17 und 2026-07-18; der letzte Commit ist vom
2026-08-16, insgesamt 32 Commits. 88 XCTest-Fälle decken Discovery, Ausführung,
Historie und Zeitpläne ab. Die App ist nicht sandboxed und damit ein lokales
Werkzeug, kein App-Store-Produkt.

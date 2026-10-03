## Why

Runbook Runner ist durch die Web-Oberfläche von Semaphore UI ersetzt, steht im
Tool-Verzeichnis aber noch als aktuell. Issue:
niclasedge/niclasedge.github.io#7.

## What Changes

- `content/tools.json`: `runbook-runner` auf `status: "past"`, `until: "2026"`,
  `replacedBy: "semaphore"`.
- `content/projekte/runbook-runner.md`: Abschnitt „Warum abgelöst“, abgeleitet
  aus der Entscheidungsnotiz im Cronjob-Repo.

## Capabilities

### New Capabilities

(keine)

### Modified Capabilities

(keine – reine Inhaltsänderung, das Verhalten des Tool-Verzeichnisses bleibt
gleich; daher `skip_specs: true`)

## Impact

- Berührte Dateien: `content/tools.json`, `content/projekte/runbook-runner.md`.
- Auf der Startseite wandert der Eintrag unter „Vergangen“, die Detailseite
  zeigt „Abgelöst durch Semaphore UI“.

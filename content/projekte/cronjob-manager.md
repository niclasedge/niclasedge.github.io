## Was es macht

Der Cronjob-Manager führte meine wiederkehrenden Jobs aus und überwachte sie:
Erreichbarkeits- und Container-Checks, Plattenplatz und Backups auf drei
Rechnern. Jeder Lauf sollte nachvollziehbar sein,
und jeder Fehler sollte als Alarm ankommen.

## Wie es funktioniert

- **Ablauf:** crontab auf dem MacBook ruft `run-job.sh` auf, das ein
  Ansible-Playbook startet. ARA schreibt jeden Lauf in eine SQLite-Datei.
- **Playbook-Muster:** Start-Ping an Healthchecks.io, dann der eigentliche Job,
  danach Erfolgs- oder Fehler-Ping plus Slack-Nachricht bei Fehlern.
- **Dashboard:** FastAPI mit HTMX liest die ARA-Daten. Jobs stehen in
  `jobs.json` und werden von dort in die crontab synchronisiert.
- **Fallback:** Ein kleiner Checker auf zwei weiteren Rechnern prüft stündlich
  die Healthchecks-API, falls die Zentrale ausfällt.

```bash
./run-job.sh monitoring_daily
```

## Stand

Die Git-Historie reicht vom 2026-03-01 bis 2026-08-16 (60 Commits); eine ältere
Vorstufe mit Wrapper-Skripten ist nur noch über Pfadverweise belegt. 18
pytest-Tests prüfen den crontab-Sync und die Datenbank-Bereinigung. Seit Sommer
2026 ist das Repo als Ausführer stillgelegt und hält nur noch Runbooks und
Notizen.

## Warum abgelöst

Eine Entscheidungsnotiz im Repo nennt die Schmerzpunkte: Der Scheduler lief auf
dem MacBook, das nachts schläft und tägliche Jobs verpasst. Dazu kamen drei
Oberflächen nebeneinander und viel Eigenbau rund um crontab-Sync,
Healthcheck-Pings und Dashboard.

Nachfolger ist Semaphore UI auf einem ständig laufenden Server. Es vereint
Zeitpläne, Läufe, Live-Logs, Verlauf und Alarme in einem Werkzeug. Die
Playbooks laufen unverändert weiter, ersetzt wird nur die Auslöse-Schicht. Die
Notiz hält auch fest, dass ein weiterer Eigenbau denselben Weg wiederholen
würde. Offen bleibt: Jobs, die den Mac brauchen, brauchen ihn weiterhin wach.

## Vorgänger

Davor liefen die Jobs in Prefect, dann in Windmill. Laut Anforderungsdokument
im Repo war Windmill für einfache Cron-Ausführung überdimensioniert; der
Cronjob-Manager übernahm dessen sechs aktive Jobs als Ansible-Playbooks.

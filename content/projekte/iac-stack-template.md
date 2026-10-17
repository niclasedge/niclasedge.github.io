## Was es macht

iac-stack-template ist eine Vorlage für eine kleine selbst betriebene
Multi-Host-Plattform: ein öffentlicher VPS, ein Heimserver und eine
Workstation, verwaltet aus einem Repo mit Ansible. Das Monitoring öffnet
GitHub-Issues, wenn etwas ausfällt, und Secrets liegen in git nur
verschlüsselt. Es ist ein Startpunkt, kein fertiges Produkt: forken, die
Beispiel-Hosts und -Dienste ersetzen, Unnötiges löschen.

## Wie es funktioniert

- **Dienste als Deklaration:** Welcher Dienst wo läuft und wie er ausgerollt
  wird, steht in einer Datei (`services.yml`), geprüft gegen ein Schema und
  Vertragsregeln, bevor ein Host berührt wird.
- **Deploys mit Rückweg:** Die Rolle sichert den Stand, rollt aus, prüft die
  Gesundheit und rollt zurück. „Geändert“ leitet sich aus Container-IDs ab,
  nicht aus Textausgaben.
- **Alarmkette:** Jobs schreiben strukturierte Ergebnis-Logs, Filebeat liefert
  sie an Elasticsearch, und `monitor-check.py` macht aus Fehlern und fehlenden
  Herzschlägen GitHub-Issues. Fällt die Zustellung selbst aus, bleibt der Ping
  an den Dead-Man's-Switch aus.
- **Secrets:** SOPS und age; Werte werden nur in einem Prozessbaum entschlüsselt.
- Dazu kommen Runbooks für Firewall, Docker-Log-Rotation und den
  Monitoring-Stack.

```mermaid
flowchart LR
  A[Jobs] --> B[Filebeat]
  B --> C[Elasticsearch]
  C --> D[monitor-check]
  D --> E[GitHub-Issues]
```

## Stand

Ansible und Python; die Hosts im Repo sind Beispiele mit Adressen aus
Dokumentationsbereichen.

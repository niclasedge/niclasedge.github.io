## Was es macht

Acht Python-Hooks für Claude Code, die personenbezogene Daten, Secrets und
riskante Tool-Aufrufe vom Modell fernhalten. Sie laufen lokal, nutzen nur die
Python-Standardbibliothek und brauchen kein Netz. Sie sind ein technischer
Baustein für ein DSGVO-bewusstes Setup, keine Rechtsberatung: Konform macht
das allein keine Umgebung.

## Wie es funktioniert

- **Prompt-Guard:** blockiert Prompts mit IBAN, Telefonnummer, Geburtsdatum,
  Sozialversicherungsnummer oder Namen aus einer optionalen Liste.
- **Datei-Guard:** verweigert das Lesen von `.csv`, `.sql`, Zertifikaten,
  Schlüsseln und `.env`-Dateien.
- **Sicherheits-Guard:** blockiert zerstörerische Befehle wie `rm -rf /`,
  `git reset --hard` oder `curl | sh` sowie Schreibzugriffe auf `.env` und
  SSH-Schlüssel.
- **Netz-Guard:** erlaubt `curl`, `ssh` und Co. nur zu Hosts auf einer
  Whitelist; unlesbare Eingaben werden abgelehnt.
- **Ausgabe-Guards:** prüfen nach dem Lesen und nach Bash-Läufen, was zurückkam.
- **Sitzungsstart:** warnt, wenn `CLAUDE.md` selbst personenbezogene Daten
  enthält.

Der gemeinsame Scanner erkennt in zwei Stufen mit Regex und Schlüsselwort-Kontext;
eine dritte Stufe mit GLiNER bleibt optionalen Werkzeugen vorbehalten.

## Stand

Apache-2.0, Tests in der CI. Dahinter steht ein Filter, kein Beweis: Was die
Muster nicht beschreiben, geht durch. Der Nachfolger auf Rust-Basis ist
[rust-redactor](/projekte/rust-redactor).

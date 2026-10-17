## Was es macht

sopsy setzt und nutzt Secrets aus einer mit SOPS und age verschlüsselten
dotenv-Datei – als ein Binary für macOS, Linux und Windows, mit geführter
Web-Oberfläche. Weder `sops` noch `age` müssen installiert sein, beide sind
einkompiliert. Die Dateien bleiben SOPS-kompatibel.

## Wie es funktioniert

```bash
sopsy init                  # Schlüssel, .sops.yaml und secrets.env anlegen
sopsy set GITHUB_TOKEN      # verdeckte Eingabe, nie als Argument
sopsy run -- ./deploy.sh    # Befehl mit den Secrets in der Umgebung starten
sopsy doctor                # Schlüssel, Konfiguration und Entschlüsselung prüfen
```

- sopsy gibt nie einen Wert aus; `sopsy keys` zeigt nur Namen.
- `sopsy run` reicht den Exit-Code des Befehls durch; 125 heißt: sopsy selbst
  ist gescheitert.
- Empfänger lassen sich hinzufügen und entfernen (`sopsy recipients`), um
  Secrets mit einem zweiten Rechner oder Teammitglied zu teilen.
- `sopsy ui` öffnet eine lokale Seite auf `127.0.0.1` mit Einmal-Token: Werte
  setzen ohne Terminal, nur schreibbar. Der Server stoppt nach 15 Minuten
  Leerlauf.

## Stand

Go, alle Funktionen der Version 1 umgesetzt, das erste Release ist in
Vorbereitung. Archive für amd64 und arm64 mit SHA-256-Prüfsummen.

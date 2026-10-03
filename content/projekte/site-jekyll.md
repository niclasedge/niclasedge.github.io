## Was es macht

Die erste Fassung dieser Seite: ein Blog auf GitHub Pages, gebaut mit Jekyll
und dem Chirpy-Theme. Sie trug den Titel „Niclas Edge Docs“ und sollte
Dokumentation und Notizen sammeln. Später lagen hier auch die Support- und
Datenschutzseiten meiner iOS-Apps, die App Store Connect verlinkt.

## Wie es funktioniert

Grundlage war das Chirpy-Starter-Template.

- Jekyll mit dem Gem `jekyll-theme-chirpy` (~> 5.2) über Bundler, die
  statischen Theme-Assets als Git-Submodul.
- Posts als Markdown in `_posts/`, dazu die Tabs About, Archives, Categories
  und Tags.
- Chirpy-Funktionen per `_config.yml`: Inhaltsverzeichnis, Rouge für
  Syntaxhervorhebung, PWA mit Service Worker.
- Eine GitHub Action richtete Ruby 2.7 ein und baute die Seite über das
  Deploy-Skript des Themes.

## Stand

Der erste Commit stammt vom 31. Juli 2022, der letzte vom 12. Juli 2026 – 35
Commits, davon 26 am ersten Tag beim Einrichten. Inhaltlich blieb es bei einem
Post; ab Mai 2026 kamen nur noch App-Seiten hinzu. Am 2. Oktober 2026 wurde
die Seite abgelöst.

## Warum abgelöst

Nachfolger ist die Fassung mit Deno Fresh 2 (`site`). Der Wechsel ändert vor
allem den Unterbau: Statt Ruby, Bundler und einem Theme-Gem läuft die Seite mit
Deno, das Formatieren, Linten und Typprüfung selbst mitbringt. Interaktive
Werkzeuge laufen als Islands direkt auf der Seite, Tools und Quellen kommen aus
JSON-Dateien.

Der Umzug sollte nichts kaputt machen. Alle öffentlichen URLs der Jekyll-Seite
stehen in `scripts/legacy-urls.txt` und funktionieren weiter. Die App-Seiten
liegen byte-identisch in `static/`, `/archives/` und `/categories/` leiten per
Meta-Refresh weiter. Ein neues `/sw.js` meldet den alten Chirpy-Service-Worker
ab, damit niemand dauerhaft die alte Seite aus dem Cache sieht.

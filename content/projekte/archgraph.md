## Was es macht

archgraph rendert Architekturdiagramme aus deklarativem YAML in eine einzelne,
eigenständige HTML-Datei, in der sich mehrere Perspektiven umschalten lassen. Eine
Architektur passt selten in ein Diagramm: Anfragepfad, Datenpipeline und
Vertrauensgrenzen betreffen dieselben Komponenten, beantworten aber
verschiedene Fragen. Von Hand gezeichnet laufen die Ansichten auseinander.
archgraph führt eine Liste der Ressourcen, und jede Perspektive wählt die
Beziehungen, die sie braucht.

## Wie es funktioniert

- Das YAML wird gelesen und mit einem Zod-Schema geprüft; eine Beziehung zu einer
  unbekannten Ressource ist ein Fehler.
- Jede Perspektive wird mit ELK gesetzt (geschichtet, rechtwinklige Kanten,
  verschachtelte Ressourcen).
- Die Ausgabe ist eine HTML-Datei mit Inline-SVG: Tabs je Perspektive, Pan und
  Zoom, Hervorhebung verbundener Ressourcen beim Überfahren, ohne
  Laufzeit-Abhängigkeiten.
- Auf Wunsch entsteht je Perspektive ein PNG (`--png`), ohne Browser.

Das Eingabeformat ist eine Teilmenge des YAML von Ilograph; archgraph ist ein
unabhängiges Projekt ohne dessen Code oder Assets.

## Stand

TypeScript. Das mitgelieferte Beispiel ist ein KI-Assistent mit Gateway,
Retrieval, Vektorspeicher, Modellanbieter und Ticketsystem in drei
Perspektiven.

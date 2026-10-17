## Was es macht

llm-evals lässt Sprachmodelle dieselben Aufgaben lösen und hält die Ergebnisse
reproduzierbar fest. Ein fester Satz Testprompts läuft gegen Modelle
verschiedener Anbieter (lokales Ollama, OpenRouter, OpenAI-kompatible APIs),
jede Anfrage und Antwort wird gespeichert, und die Antworten bewertet ein
Assertion-Satz plus ein LLM-Judge. Die Frage dahinter: Welches Modell ist für
diese Aufgabe gut genug, und zu welchem Preis?

## Wie es funktioniert

- Die aktuelle App besteht aus FastAPI, HTMX und SQLite: Anbieter-Register,
  Testläufe, Bewertung durch den LLM-Judge (Wert von 0 bis 1 mit Stärken und
  Schwächen), Dashboard und eine Rich-CLI.
- Daneben liegen promptfoo-Konfigurationen für Text, Code, Reasoning und
  SEO-Texte samt Skript, das Modelle über mehrere Läufe in eine Rangfolge
  bringt.
- Eine frühere Hybrid-Version aus Python und einem Go-Dienst (Ollama-Proxy mit
  Pooling, Metriken, WebSocket-Dashboard) liegt als Archiv im Repo.

## Stand

Ein persönliches Projekt und ein funktionierender Prototyp, kein gehärtetes
Produkt. Die App startet und besteht die Smoke-Tests; promptfoo-Läufe brauchen
eigene Schlüssel oder ein lokales Ollama.

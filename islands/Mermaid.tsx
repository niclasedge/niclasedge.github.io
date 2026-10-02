import { useEffect } from "preact/hooks";

// Mermaid wird nicht gebündelt (der Vite-SSR-Build scheitert an node:module),
// sondern zur Laufzeit als ESM-Bundle von jsDelivr geladen.
const MERMAID_URL =
  "https://cdn.jsdelivr.net/npm/mermaid@12/dist/mermaid.esm.min.mjs";

interface MermaidApi {
  initialize(config: Record<string, unknown>): void;
  run(options: { querySelector: string }): Promise<void>;
}

/** Rendert alle <pre class="mermaid">-Blöcke der Seite als Diagramme. */
export default function Mermaid() {
  useEffect(() => {
    const load = async () => {
      const mod = await import(/* @vite-ignore */ MERMAID_URL);
      const mermaid = mod.default as MermaidApi;
      // Immer das helle Theme: Diagramme setzen oft eigene helle Füllfarben
      // (classDef), im Dark-Mode liegt das Diagramm deshalb auf hellem Grund.
      mermaid.initialize({ startOnLoad: false, theme: "default" });
      await mermaid.run({ querySelector: "pre.mermaid" });
    };
    load().catch((error) => {
      console.error("Mermaid konnte nicht geladen werden:", error);
      // Quelltext wieder sichtbar machen, statt einen leeren Block zu zeigen.
      document.querySelectorAll("pre.mermaid:not([data-processed])")
        .forEach((el) => el.setAttribute("data-processed", "error"));
    });
  }, []);
  return null;
}

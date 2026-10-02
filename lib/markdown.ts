import { Marked, type Tokens } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { headingId } from "./slug.ts";

export interface TocEntry {
  depth: number;
  text: string;
  id: string;
}

export interface RenderedMarkdown {
  html: string;
  toc: TocEntry[];
  hasMermaid: boolean;
}

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Rendert Markdown (GFM) zu HTML: Syntax-Highlighting per highlight.js,
 * ```mermaid-Blöcke als <pre class="mermaid"> für das Mermaid-Island und
 * Überschriften mit IDs für das Inhaltsverzeichnis.
 */
export function renderMarkdown(source: string): RenderedMarkdown {
  const toc: TocEntry[] = [];
  const usedIds = new Map<string, number>();
  let hasMermaid = false;

  const marked = new Marked(
    { gfm: true },
    markedHighlight({
      emptyLangClass: "hljs",
      langPrefix: "hljs language-",
      highlight(code, lang) {
        if (lang === "mermaid") return code;
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    }),
    {
      renderer: {
        code(token: Tokens.Code) {
          if (token.lang?.trim() !== "mermaid") return false;
          hasMermaid = true;
          return `<pre class="mermaid not-prose">${
            escapeHtml(token.text)
          }</pre>\n`;
        },
        heading({ tokens, depth, text }: Tokens.Heading) {
          const inner = this.parser.parseInline(tokens);
          const base = headingId(text) || "abschnitt";
          const count = usedIds.get(base) ?? 0;
          usedIds.set(base, count + 1);
          const id = count === 0 ? base : `${base}-${count}`;
          toc.push({ depth, text: inner.replace(/<[^>]*>/g, ""), id });
          return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
        },
      },
    },
  );

  const html = marked.parse(source, { async: false });
  return { html, toc, hasMermaid };
}

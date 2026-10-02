import { useComputed, useSignal } from "@preact/signals";

type Indent = "2" | "4" | "tab";
type Mode = "format" | "minify";

const SAMPLE =
  '{"name":"Niclas Edge Docs","tags":["linux","docker"],"lab":{"tools":2,"offline":true}}';

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortKeys(v)]),
    );
  }
  return value;
}

/** Wandelt "… at position 42" aus JSON.parse in Zeile/Spalte um. */
function describeError(input: string, error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const match = /position (\d+)/.exec(message);
  if (!match) return message;
  const before = input.slice(0, Number(match[1]));
  const line = before.split("\n").length;
  const column = before.length - before.lastIndexOf("\n");
  return `${message} (Zeile ${line}, Spalte ${column})`;
}

export default function JsonFormatter() {
  const input = useSignal(SAMPLE);
  const mode = useSignal<Mode>("format");
  const indent = useSignal<Indent>("2");
  const sorted = useSignal(false);
  const copied = useSignal(false);

  const result = useComputed(() => {
    const text = input.value.trim();
    if (!text) return { ok: true, output: "", error: "" };
    try {
      let value = JSON.parse(text);
      if (sorted.value) value = sortKeys(value);
      const space = mode.value === "minify"
        ? undefined
        : indent.value === "tab"
        ? "\t"
        : Number(indent.value);
      return {
        ok: true,
        output: JSON.stringify(value, null, space),
        error: "",
      };
    } catch (error) {
      return { ok: false, output: "", error: describeError(text, error) };
    }
  });

  const copy = async () => {
    await navigator.clipboard.writeText(result.value.output);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  };

  const button = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium ${
      active
        ? "bg-teal-700 text-white"
        : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
    }`;

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class={button(mode.value === "format")}
          onClick={() => (mode.value = "format")}
        >
          Formatieren
        </button>
        <button
          type="button"
          class={button(mode.value === "minify")}
          onClick={() => (mode.value = "minify")}
        >
          Minifizieren
        </button>
        <label class="flex items-center gap-2 text-sm">
          Einrückung
          <select
            class="rounded-md border border-stone-300 bg-transparent px-2 py-1 dark:border-stone-700"
            value={indent.value}
            disabled={mode.value === "minify"}
            onChange={(e) =>
              indent.value = (e.currentTarget as HTMLSelectElement)
                .value as Indent}
          >
            <option value="2">2 Leerzeichen</option>
            <option value="4">4 Leerzeichen</option>
            <option value="tab">Tab</option>
          </select>
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sorted.value}
            onChange={(e) =>
              sorted.value = (e.currentTarget as HTMLInputElement).checked}
          />
          Schlüssel sortieren
        </label>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-sm font-medium">Eingabe</span>
          <textarea
            class="h-80 w-full rounded-lg border border-stone-300 bg-transparent p-3 font-mono text-sm dark:border-stone-700"
            spellcheck={false}
            value={input.value}
            onInput={(e) =>
              input.value = (e.currentTarget as HTMLTextAreaElement).value}
          />
        </label>
        <div>
          <div class="mb-1 flex items-center justify-between">
            <span class="text-sm font-medium">Ergebnis</span>
            <button
              type="button"
              class="text-xs text-teal-700 hover:underline disabled:opacity-40 dark:text-teal-300"
              disabled={!result.value.output}
              onClick={copy}
            >
              {copied.value ? "Kopiert ✓" : "Kopieren"}
            </button>
          </div>
          {result.value.ok
            ? (
              <pre class="h-80 overflow-auto rounded-lg bg-stone-100 p-3 font-mono text-sm dark:bg-stone-900">
                {result.value.output}
              </pre>
            )
            : (
              <p
                role="alert"
                class="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
              >
                Ungültiges JSON: {result.value.error}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}

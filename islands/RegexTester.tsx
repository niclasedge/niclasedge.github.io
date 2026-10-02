import { useComputed, useSignal } from "@preact/signals";

const FLAGS = [
  { flag: "g", label: "global" },
  { flag: "i", label: "ignore case" },
  { flag: "m", label: "multiline" },
  { flag: "s", label: "dotAll" },
  { flag: "u", label: "unicode" },
] as const;

const MAX_MATCHES = 1000;

interface Match {
  index: number;
  text: string;
  groups: (string | undefined)[];
  named?: Record<string, string | undefined>;
}

function findMatches(regex: RegExp, text: string): Match[] {
  const global = new RegExp(
    regex.source,
    regex.flags.includes("g") ? regex.flags : `${regex.flags}g`,
  );
  const matches: Match[] = [];
  for (const m of text.matchAll(global)) {
    matches.push({
      index: m.index ?? 0,
      text: m[0],
      groups: m.slice(1),
      named: m.groups,
    });
    if (!regex.flags.includes("g") || matches.length >= MAX_MATCHES) break;
  }
  return matches;
}

export default function RegexTester() {
  const pattern = useSignal("(\\w+)@(\\w+)\\.de");
  const flags = useSignal("g");
  const text = useSignal(
    "Kontakt: info@example.de, support@firma.de\nKein Treffer: hallo@welt.com",
  );

  const result = useComputed(() => {
    if (!pattern.value) return { error: "", matches: [] as Match[] };
    try {
      const regex = new RegExp(pattern.value, flags.value);
      return { error: "", matches: findMatches(regex, text.value) };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error),
        matches: [] as Match[],
      };
    }
  });

  const toggleFlag = (flag: string) => {
    flags.value = flags.value.includes(flag)
      ? flags.value.replace(flag, "")
      : FLAGS.map((f) => f.flag).filter((f) =>
        f === flag || flags.value.includes(f)
      ).join("");
  };

  // Text in Abschnitte mit und ohne Treffer zerlegen.
  const segments = useComputed(() => {
    const parts: { text: string; hit: boolean }[] = [];
    let pos = 0;
    for (const m of result.value.matches) {
      if (m.text === "") continue;
      if (m.index > pos) {
        parts.push({ text: text.value.slice(pos, m.index), hit: false });
      }
      parts.push({ text: m.text, hit: true });
      pos = m.index + m.text.length;
    }
    if (pos < text.value.length) {
      parts.push({ text: text.value.slice(pos), hit: false });
    }
    return parts;
  });

  return (
    <div class="space-y-5">
      <div>
        <label class="mb-1 block text-sm font-medium" for="regex-pattern">
          Ausdruck
        </label>
        <div class="flex items-center rounded-lg border border-stone-300 font-mono text-sm dark:border-stone-700">
          <span class="pl-3 text-stone-400">/</span>
          <input
            id="regex-pattern"
            class="w-full bg-transparent px-1 py-2 outline-none"
            spellcheck={false}
            value={pattern.value}
            onInput={(e) =>
              pattern.value = (e.currentTarget as HTMLInputElement).value}
          />
          <span class="pr-3 text-stone-400">/{flags.value}</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-4 text-sm">
          {FLAGS.map(({ flag, label }) => (
            <label key={flag} class="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={flags.value.includes(flag)}
                onChange={() =>
                  toggleFlag(flag)}
              />
              <code>{flag}</code>
              <span class="text-stone-500">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <label class="block">
        <span class="mb-1 block text-sm font-medium">Testtext</span>
        <textarea
          class="h-40 w-full rounded-lg border border-stone-300 bg-transparent p-3 font-mono text-sm dark:border-stone-700"
          spellcheck={false}
          value={text.value}
          onInput={(e) =>
            text.value = (e.currentTarget as HTMLTextAreaElement).value}
        />
      </label>

      {result.value.error
        ? (
          <p
            role="alert"
            class="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          >
            {result.value.error}
          </p>
        )
        : (
          <>
            <div>
              <p class="mb-1 text-sm font-medium">
                {result.value.matches.length}{" "}
                {result.value.matches.length === 1 ? "Treffer" : "Treffer"}
              </p>
              <pre class="whitespace-pre-wrap break-words rounded-lg bg-stone-100 p-3 font-mono text-sm dark:bg-stone-900">
                {segments.value.map((s, i) =>
                  s.hit
                    ? (
                      <mark
                        key={i}
                        class="rounded bg-amber-200 px-0.5 text-stone-900 dark:bg-amber-500/40 dark:text-amber-50"
                      >
                        {s.text}
                      </mark>
                    )
                    : <span key={i}>{s.text}</span>
                )}
              </pre>
            </div>
            {result.value.matches.length > 0 && (
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead class="border-b border-stone-200 text-stone-500 dark:border-stone-800">
                    <tr>
                      <th class="py-2 pr-4 font-medium">#</th>
                      <th class="py-2 pr-4 font-medium">Index</th>
                      <th class="py-2 pr-4 font-medium">Treffer</th>
                      <th class="py-2 font-medium">Gruppen</th>
                    </tr>
                  </thead>
                  <tbody class="font-mono">
                    {result.value.matches.map((m, i) => (
                      <tr
                        key={i}
                        class="border-b border-stone-100 dark:border-stone-900"
                      >
                        <td class="py-1.5 pr-4 text-stone-500">{i + 1}</td>
                        <td class="py-1.5 pr-4">{m.index}</td>
                        <td class="py-1.5 pr-4">{JSON.stringify(m.text)}</td>
                        <td class="py-1.5">
                          {m.named
                            ? Object.entries(m.named)
                              .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
                              .join(", ")
                            : m.groups
                              .map((g, j) => `$${j + 1}=${JSON.stringify(g)}`)
                              .join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
    </div>
  );
}

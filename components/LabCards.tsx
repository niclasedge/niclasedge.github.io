import { labTools } from "../lib/lab.ts";

export function LabCards() {
  return (
    <ul class="grid gap-4 sm:grid-cols-2">
      {labTools.map((tool) => (
        <li key={tool.slug}>
          <a
            href={`/lab/${tool.slug}`}
            class="block h-full rounded-xl border border-stone-200 p-5 transition hover:border-teal-500 hover:shadow-sm dark:border-stone-800 dark:hover:border-teal-400"
          >
            <h3 class="font-semibold">{tool.title}</h3>
            <p class="mt-1 text-sm text-stone-600 dark:text-stone-400">
              {tool.description}
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}

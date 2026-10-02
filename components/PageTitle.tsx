import type { ComponentChildren } from "preact";

export function PageTitle(
  { children, lead }: { children: ComponentChildren; lead?: ComponentChildren },
) {
  return (
    <header class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">{children}</h1>
      {lead && <p class="mt-2 text-stone-600 dark:text-stone-400">{lead}</p>}
    </header>
  );
}

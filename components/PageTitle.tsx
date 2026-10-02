import type { ComponentChildren } from "preact";

/** Container für Unterseiten: Breite der Kopfleiste, Inhalt schmaler. */
export function Page(
  { children, wide }: { children: ComponentChildren; wide?: boolean },
) {
  return (
    <div class="wrap page">
      <div class={wide ? "max-w-5xl" : "max-w-3xl"}>{children}</div>
    </div>
  );
}

export function PageTitle(
  { children, lead }: { children: ComponentChildren; lead?: ComponentChildren },
) {
  return (
    <header class="page-title">
      <h1>{children}</h1>
      {lead && <p>{lead}</p>}
    </header>
  );
}

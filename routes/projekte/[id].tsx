import { HttpError, page } from "fresh";
import { define } from "../../utils.ts";
import { getTools, type Tool } from "../../lib/directory.ts";
import { getProject } from "../../lib/projects.ts";
import { AREAS } from "../../lib/areas.ts";
import { Seo } from "../../components/Seo.tsx";
import { AreaIcon } from "../../components/Icons.tsx";
import { Page } from "../../components/PageTitle.tsx";
import Mermaid from "../../islands/Mermaid.tsx";

/** Detailseite eines eigenen Tools; Text aus content/projekte/<id>.md. */
export const handler = define.handlers({
  GET(ctx) {
    const tools = getTools();
    const tool = tools.find((t) => t.id === ctx.params.id && t.group === "own");
    const project = tool && getProject(tool.id);
    if (!tool || !project) throw new HttpError(404);
    const next = tools.find((t) => t.id === tool.replacedBy);
    return page({ tool, project, next });
  },
});

/** Eigene Nachfolger haben eine Detailseite, externe nur Website/Repo. */
function nextHref(next: Tool): string | undefined {
  return next.group === "own" ? `/projekte/${next.id}` : next.web ?? next.repo;
}

export default define.page<typeof handler>(function ProjectPage({ data }) {
  const { tool, project, next } = data;
  const past = tool.status === "past";
  const links = [
    ...(tool.web ? [{ label: "Öffnen", href: tool.web }] : []),
    ...(tool.repo ? [{ label: "Repo", href: tool.repo }] : []),
    ...(tool.links ?? []),
  ];
  return (
    <Page>
      <article>
        <Seo
          title={tool.name}
          description={tool.desc}
          path={`/projekte/${tool.id}`}
        />
        <header class="page-title">
          <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span
              class="inline-flex items-center gap-1.5 font-semibold"
              style={`color:${AREAS[tool.area].color}`}
            >
              <AreaIcon area={tool.area} />
              {AREAS[tool.area].label}
            </span>
            <span class="text-muted">
              {tool.cat} ·{" "}
              {past ? `${tool.since}–${tool.until}` : `seit ${tool.since}`}
            </span>
            {past && <span class="text-muted">abgelöst</span>}
          </p>
          <h1 class="mt-2">{tool.name}</h1>
          <p>{tool.desc}</p>
          {links.length > 0 && (
            <p class="mt-2 flex flex-wrap gap-4 text-sm">
              {links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
            </p>
          )}
        </header>

        {past && (
          <p class="mb-8 rounded-lg border border-line bg-side p-4 text-sm">
            {next
              ? (
                <>
                  ↻ Abgelöst durch {nextHref(next)
                    ? <a href={nextHref(next)}>{next.name}</a>
                    : next.name}
                </>
              )
              : <>– Nicht mehr nötig: {tool.reason}</>}
          </p>
        )}

        <div
          class="prose max-w-none"
          // HTML stammt aus eigenen Markdown-Dateien in content/projekte.
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{ __html: project.html }}
        />
        {project.hasMermaid && <Mermaid />}

        <footer class="mt-12 border-t border-line pt-6 text-sm">
          <a href="/#eigene">← Alle eigenen Tools</a>
        </footer>
      </article>
    </Page>
  );
});

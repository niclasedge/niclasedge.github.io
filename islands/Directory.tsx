import { useEffect, useMemo, useState } from "preact/hooks";
import { AREA_KEYS, type AreaKey, AREAS, isArea } from "../lib/areas.ts";
import { FEED_KINDS, type Tool, type ToolStatus } from "../lib/directory.ts";
import type { Feed } from "../lib/feeds.ts";
import { agoTime, DAY_MS, fmtDateTime } from "../lib/time.ts";
import type { LabItem } from "../lib/lab.ts";
import {
  type PostSummary,
  PostTimeline,
  Timeline,
  ToolItem,
} from "../components/Timeline.tsx";
import {
  AreaIcon,
  CodeIcon,
  KindIcon,
  SearchIcon,
  StarIcon,
} from "../components/Icons.tsx";

interface Props {
  posts: PostSummary[];
  tools: Tool[];
  feeds: Feed[];
  /** Lab-Einträge für den Schnellzugriff unter dem Blog. */
  lab: LabItem[];
  /** Zeitpunkt des Builds (ISO); bis zur Hydration gilt er als "jetzt". */
  builtAt: string;
}

type AreaFilter = AreaKey | "all";

const FEEDS_VISIBLE = 8;
const LAST_READ_KEY = "feeds:lastRead";
/** Beim ersten Besuch gilt alles aus den letzten 2 Tagen als neu. */
const NEW_WINDOW_MS = 2 * DAY_MS;

const matches = (q: string, ...fields: string[]) =>
  !q || fields.join(" ").toLowerCase().includes(q);

/**
 * Startseite: Suche, Zeitraum (aktuell/vergangen) und Bereichsfilter über
 * Blog, eigene Tools, externe Tools und Quellen. Ohne JavaScript bleibt die
 * serverseitig gerenderte Ansicht (aktueller Workflow, alle Bereiche) stehen.
 * Zeitraum und Bereich stehen in der URL (?view=past&area=ai).
 */
export default function Directory(
  { posts, tools, feeds, lab, builtAt }: Props,
) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ToolStatus>("current");
  const [area, setArea] = useState<AreaFilter>("all");
  const [now, setNow] = useState(() => Date.parse(builtAt));
  const [lastRead, setLastRead] = useState(() =>
    Date.parse(builtAt) - NEW_WINDOW_MS
  );
  const [expanded, setExpanded] = useState(false);
  const [jump, setJump] = useState<{ id: string; n: number } | null>(null);

  // Nach der Hydration: echte Uhrzeit, URL-Parameter und "gelesen"-Stand.
  useEffect(() => {
    setNow(Date.now());
    const sp = new URLSearchParams(location.search);
    if (sp.get("view") === "past") setView("past");
    const a = sp.get("area");
    if (isArea(a)) setArea(a);
    let stored: number | null = null;
    try {
      const v = localStorage.getItem(LAST_READ_KEY);
      if (v) stored = Date.parse(v);
    } catch { /* z. B. privater Modus */ }
    setLastRead(stored ?? Date.now() - NEW_WINDOW_MS);
  }, []);

  const syncUrl = (v: ToolStatus, a: AreaFilter) => {
    try {
      const u = new URL(location.href);
      v === "past"
        ? u.searchParams.set("view", "past")
        : u.searchParams.delete("view");
      a !== "all"
        ? u.searchParams.set("area", a)
        : u.searchParams.delete("area");
      history.replaceState(null, "", u);
    } catch { /* ignorieren */ }
  };
  const chooseView = (v: ToolStatus) => {
    setView(v);
    syncUrl(v, area);
  };
  const chooseArea = (a: AreaFilter) => {
    setArea(a);
    syncUrl(view, a);
  };

  const byId = useMemo(
    () => new Map(tools.map((t) => [t.id, t])),
    [tools],
  );

  // Zum Nachfolger springen: Ansicht umschalten, dann scrollen und aufblinken.
  const jumpTo = (id: string) => {
    const target = byId.get(id);
    if (!target) return;
    const a = area !== "all" && target.area !== area ? "all" : area;
    setQuery("");
    setView("current");
    setArea(a);
    syncUrl("current", a);
    setJump({ id, n: (jump?.n ?? 0) + 1 });
  };
  useEffect(() => {
    if (!jump) return;
    const el = document.getElementById(`t-${jump.id}`);
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  }, [jump]);

  const q = query.trim().toLowerCase();
  const inArea = (x: { area: AreaKey }, a: AreaFilter = area) =>
    a === "all" || x.area === a;
  const postMatch = (p: PostSummary) =>
    matches(q, p.title, p.description, p.tags.join(" "));
  const toolMatch = (t: Tool) =>
    t.status === view &&
    matches(q, t.name, t.desc, t.cat, AREAS[t.area].label);
  const feedMatch = (f: Feed) =>
    matches(
      q,
      f.name,
      f.handle,
      f.latest?.title ?? "",
      f.note ?? "",
      FEED_KINDS[f.kind],
    );
  const isNew = (f: Feed) => !!f.latest && Date.parse(f.latest.at) > lastRead;

  // Zähler je Bereich: Posts + Tools der aktuellen Ansicht + Quellen
  const count = (a: AreaFilter) =>
    posts.filter((p) => inArea(p, a) && postMatch(p)).length +
    tools.filter((t) => inArea(t, a) && toolMatch(t)).length +
    feeds.filter((f) => inArea(f, a) && feedMatch(f)).length;

  const shownPosts = posts.filter((p) => inArea(p) && postMatch(p))
    .sort((a, b) => b.day.localeCompare(a.day));

  const yearKey = (t: Tool) => t.status === "past" ? t.until! : t.since;
  const toolList = (group: Tool["group"]) =>
    tools.filter((t) => t.group === group && inArea(t) && toolMatch(t))
      .sort((a, b) =>
        yearKey(b).localeCompare(yearKey(a)) ||
        (b.release?.date ?? "").localeCompare(a.release?.date ?? "")
      );
  const own = toolList("own");
  const ext = toolList("ext");
  const sub = view === "current"
    ? {
      own: "Repos, Websites und Apps, die ich pflege, nach Startjahr",
      ext: "Womit ich arbeite, nach Startjahr",
    }
    : {
      own: "Eigene Projekte, nach Jahr der Ablösung",
      ext: "Was ich früher benutzt habe, nach Jahr des Wechsels",
    };

  const feedList = feeds.filter((f) => f.feed && inArea(f) && feedMatch(f))
    .sort((a, b) => (b.latest?.at ?? "").localeCompare(a.latest?.at ?? ""));
  // Quellen ohne Feed: immer sichtbar unter „Zum Nachschlagen“
  const refList = feeds.filter((f) => !f.feed && inArea(f) && feedMatch(f));
  // Lab-Einträge zählen zum Bereich Dev
  const quick = lab.filter((l) =>
    (area === "all" || area === "dev") && matches(q, l.title, l.short)
  );
  const unread = feedList.filter(isNew).length;
  const shownFeeds = expanded ? feedList : feedList.slice(0, FEEDS_VISIBLE);

  const markRead = () => {
    const t = Date.now();
    setLastRead(t);
    try {
      localStorage.setItem(LAST_READ_KEY, new Date(t).toISOString());
    } catch { /* ignorieren */ }
  };

  const tools_ = (list: Tool[]) => (
    <Timeline
      items={list}
      id={(t) => t.id}
      year={yearKey}
      render={(t) => (
        <ToolItem
          tool={t}
          replacement={t.replacedBy ? byId.get(t.replacedBy) : undefined}
          now={now}
          onJump={jumpTo}
        />
      )}
    />
  );

  return (
    <>
      <section class="intro">
        <div class="wrap">
          <h1>
            <StarIcon size={26} />
            Was ich schreibe, baue und benutze
          </h1>
          <p>
            Notizen aus dem Alltag beim Automatisieren, meine eigenen Tools und
            Apps, alles Externe, mit dem ich arbeite – und was davor kam.
          </p>

          <div class="controls">
            <label class="search">
              <SearchIcon />
              <span class="sr-only">
                Beiträge, Tools und Quellen durchsuchen
              </span>
              <input
                type="search"
                placeholder="Suchen"
                autocomplete="off"
                value={query}
                onInput={(e) => setQuery(e.currentTarget.value)}
              />
            </label>
            <div class="seg" role="group" aria-label="Zeitraum der Tools">
              <button
                type="button"
                aria-pressed={view === "current"}
                onClick={() => chooseView("current")}
              >
                Aktueller Workflow
              </button>
              <button
                type="button"
                aria-pressed={view === "past"}
                onClick={() => chooseView("past")}
              >
                Vergangen
              </button>
            </div>
          </div>
          <div class="areas" role="group" aria-label="Bereich filtern">
            <button
              type="button"
              class="area"
              aria-pressed={area === "all"}
              onClick={() => chooseArea("all")}
            >
              <StarIcon />Alle <span class="n">{count("all")}</span>
            </button>
            {AREA_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                class="area"
                aria-pressed={area === k}
                onClick={() => chooseArea(k)}
              >
                <AreaIcon area={k} />
                {AREAS[k].label} <span class="n">{count(k)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div class="wrap cols">
        <section class="col col-blog" id="blog" aria-labelledby="h-blog">
          <h2 class="head" id="h-blog">
            Blog <span class="n">{shownPosts.length}</span>
            <a class="more-link" href="/posts">Alle Posts</a>
          </h2>
          <p class="sub">Neueste Beiträge oben</p>
          <PostTimeline posts={shownPosts} />

          {quick.length > 0 && (
            <>
              <h2 class="head second" id="h-quick">
                Lab <span class="n">{quick.length}</span>
                <a class="more-link" href="/lab">Zum Lab</a>
              </h2>
              <ul class="quick" aria-labelledby="h-quick">
                {quick.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>
                      <span class="ic">
                        <CodeIcon size={16} />
                      </span>
                      <span style="min-width:0">
                        <b>
                          {l.title}
                          {l.kind === "external" && " ↗"}
                        </b>
                        <small title={l.description}>{l.short}</small>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
        <section class="col" id="eigene" aria-labelledby="h-own">
          <h2 class="head" id="h-own">
            Eigene Tools <span class="n">{own.length}</span>
          </h2>
          <p class="sub">{sub.own}</p>
          {tools_(own)}
        </section>
        <section class="col" id="externe" aria-labelledby="h-ext">
          <h2 class="head" id="h-ext">
            Externe Tools <span class="n">{ext.length}</span>
          </h2>
          <p class="sub">{sub.ext}</p>
          {tools_(ext)}
        </section>
      </div>

      <section class="feeds" id="quellen" aria-labelledby="h-feeds">
        <div class="wrap">
          <h2 class="head" id="h-feeds">
            Quellen, denen ich folge{" "}
            <span class="n">
              {unread ? `${unread} neu` : feedList.length + refList.length}
            </span>
            <span class="acts">
              <button type="button" disabled={unread === 0} onClick={markRead}>
                Alle als gelesen markieren
              </button>
            </span>
          </h2>
          <p class="sub">
            YouTube-Kanäle, GitHub-Accounts und Blogs, jeweils mit dem neuesten
            Beitrag (Stand{" "}
            {fmtDateTime(builtAt)}). Blau markiert ist alles seit deinem letzten
            „gelesen“.
          </p>
          <ul class="feed-grid">
            {feedList.length === 0 && refList.length === 0 && (
              <li class="empty">Keine Quelle passt zu Suche oder Bereich.</li>
            )}
            {shownFeeds.map((f) => (
              <FeedRow key={f.url} feed={f} isNew={isNew(f)} now={now} />
            ))}
          </ul>
          {feedList.length > FEEDS_VISIBLE && (
            <button
              type="button"
              class="more"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded
                ? "Weniger anzeigen"
                : `Alle ${feedList.length} Quellen anzeigen`}
            </button>
          )}
          {refList.length > 0 && (
            <>
              <h3 class="ref-head">Zum Nachschlagen (ohne Feed)</h3>
              <ul class="feed-grid">
                {refList.map((f) => (
                  <FeedRow key={f.url} feed={f} isNew={false} now={now} />
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function FeedRow(
  { feed, isNew, now }: { feed: Feed; isNew: boolean; now: number },
) {
  const { latest } = feed;
  return (
    <li>
      <a
        class={`feed ${isNew || !feed.feed ? "" : "read"}`}
        href={latest?.url ?? feed.url}
        target="_blank"
        rel="noopener"
      >
        <span class="ic" style={`color:${AREAS[feed.area].color}`}>
          <KindIcon kind={feed.kind} />
        </span>
        <span style="min-width:0">
          <span class="src">
            {isNew && <span class="new" aria-label="neu" />}
            <b>{feed.name}</b>
            <span class="kind">{feed.handle}</span>
            {latest && (
              <span class="when" title={fmtDateTime(latest.at)}>
                {agoTime(latest.at, now)}
              </span>
            )}
          </span>
          <span class="title">
            {latest?.title ?? feed.note ??
              (feed.feed
                ? "Neuester Eintrag gerade nicht ladbar – zur Quelle"
                : "Direkt zur Quelle")}
          </span>
        </span>
      </a>
    </li>
  );
}

import { Head } from "fresh/runtime";
import { absoluteUrl, site } from "../lib/site.ts";

interface SeoProps {
  title?: string;
  description?: string;
  /** Pfad der Seite, z. B. "/posts/foo" – für den Canonical-Link. */
  path?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

export function Seo(props: SeoProps) {
  const title = props.title ? `${props.title} | ${site.title}` : site.title;
  const description = props.description ?? site.description;
  const url = props.path ? absoluteUrl(props.path) : undefined;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={props.title ?? site.title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={props.type ?? "website"} />
      <meta property="og:site_name" content={site.title} />
      {url && <meta property="og:url" content={url} />}
      {url && <link rel="canonical" href={url} />}
      {props.noindex && <meta name="robots" content="noindex" />}
    </Head>
  );
}

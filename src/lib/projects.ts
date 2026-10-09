import { getCollection } from "astro:content";
import { existsSync } from "node:fs";
import { join } from "node:path";

export type FeatureKind = "showcase" | "product" | "poster";

export interface ProjectView {
  slug: string;
  num: string;
  title: string;
  name: string;
  sub: string;
  client: string;
  kicker: string;
  kicker_en: string;
  desc: string;
  desc_en: string;
  metric: { value: string; label: string } | null;
  metric_en: { value: string; label: string } | null;
  tags: string[];
  layers: { name: string; tech: string }[];
  isPrivate: boolean;
  demo: { label: string; label_en: string; pending: boolean } | null;
  caseHref: string;
  live: { href: string } | null;
  repos: { href: string; suffix: string }[];
  domain: string;
  cover: string;
  hasCover: boolean;
  // Featured projects render as one of three headliner layouts. A headliner
  // that needs a screenshot (showcase/product) but has none falls back to the
  // type-led poster layout instead of showing an empty frame.
  feature: FeatureKind | null;
}

function splitMetric(m?: string) {
  if (!m) return null;
  const i = m.indexOf(" ");
  return i < 0 ? { value: m, label: "" } : { value: m.slice(0, i), label: m.slice(i + 1) };
}

// Checked at build time so a missing screenshot never ships as a broken
// <img> — the markup simply never contains it.
function publicFileExists(urlPath: string) {
  return existsSync(join(process.cwd(), "public", urlPath));
}

export async function getProjectViews(): Promise<ProjectView[]> {
  const entries = await getCollection("projects");
  // File name prefixes (01-, 02-, ...) in src/content/projects/ define the order.
  entries.sort((a, b) => a.id.localeCompare(b.id));

  return entries.map(({ slug, data }) => {
    const links = data.links.filter((l) => !l.inactive);
    const live = links.find((l) => l.type === "live") ?? null;
    const [name, ...rest] = data.title.split(" · ");
    const hasCover = publicFileExists(data.cover);

    let domain = "";
    if (live) {
      try { domain = new URL(live.href).hostname.replace("www.", ""); } catch { /* keep empty */ }
    }

    let feature: FeatureKind | null = data.feature ?? null;
    if (feature && feature !== "poster" && !hasCover) feature = "poster";

    return {
      slug,
      num: data.num,
      title: data.title,
      name,
      sub: rest.join(" · "),
      client: data.client,
      kicker: data.kicker ?? data.client,
      kicker_en: data.kicker_en ?? data.kicker ?? data.client,
      desc: data.desc,
      desc_en: data.desc_en ?? data.desc,
      metric: splitMetric(data.metric),
      metric_en: splitMetric(data.metric_en ?? data.metric),
      tags: data.tags,
      layers: data.layers ?? [],
      isPrivate: !!data.private,
      demo: data.demo
        ? { label: data.demo.label, label_en: data.demo.label_en ?? data.demo.label, pending: !!data.demo.pending }
        : null,
      caseHref: `/proyectos/${slug}`,
      live: live ? { href: live.href } : null,
      repos: links
        .filter((l) => l.type === "gh")
        .map((l) => ({ href: l.href, suffix: l.label.match(/\(([^)]+)\)/)?.[1] ?? "" })),
      domain,
      cover: data.cover,
      hasCover,
      feature,
    };
  });
}

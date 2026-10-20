import { defineCollection, z } from "astro:content";

const projectLink = z.object({
  href: z.string(),
  label: z.string(),
  // English text; live links fall back to "↗ View live" when it is absent.
  label_en: z.string().optional(),
  type: z.enum(["live", "gh", "priv"]),
  // Keep the entry in the data but don't show it: the destination isn't
  // publicly reachable (private repo, domain not resolving, ...). Remove the
  // flag once it is.
  inactive: z.boolean().optional(),
});

const projectDemo = z.object({
  label: z.string(),
  label_en: z.string().optional(),
  href: z.string().optional(),
  pending: z.boolean().optional(),
});

// A case study told in parts (e.g. public site + admin panel) instead of the
// legacy context/problem/solution/process/result blocks.
const projectPart = z.object({
  key: z.enum(["public", "admin"]),
  title: z.string(),
  title_en: z.string().optional(),
  stack: z.array(z.string()),
  text: z.string(),
  text_en: z.string().optional(),
  // Captures in reading order; the first one is the primary one. `w`/`h` are
  // the file's pixel size (reserves the space, no layout shift).
  shots: z.array(
    z.object({
      src: z.string(),
      label: z.string(),
      label_en: z.string().optional(),
      w: z.number(),
      h: z.number(),
    }),
  ),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    num: z.string(),
    title: z.string(),
    client: z.string(),
    desc: z.string(),
    desc_en: z.string().optional(),
    problem: z.string().optional(),
    problem_en: z.string().optional(),
    solution: z.string().optional(),
    solution_en: z.string().optional(),
    // Small highlighted stat shown as a badge on the card grid (e.g. usage metric)
    metric: z.string().optional(),
    metric_en: z.string().optional(),
    // Video/gallery walkthrough link; use `pending: true` while the asset isn't ready yet
    demo: projectDemo.optional(),
    context: z.string().optional(),
    context_en: z.string().optional(),
    process: z.string().optional(),
    process_en: z.string().optional(),
    result: z.string().optional(),
    result_en: z.string().optional(),
    // Parts-based case (see `projectPart`). When present, the detail page shows
    // the parts instead of the screenshot carousel and the legacy blocks.
    parts: z.array(projectPart).optional(),
    role: z.string().optional(),
    role_en: z.string().optional(),
    integrations: z.array(z.string()).optional(),
    tags: z.array(z.string()),
    links: z.array(projectLink),
    // Keep the entry in the data but publish it nowhere: no card on the home
    // page, no detail page, no navigation and no technology counts. The
    // numbering of the other projects is NOT changed. Remove the flag to show
    // it again.
    hidden: z.boolean().optional(),
    private: z.boolean().optional(),
    full: z.boolean().optional(),
    // Selected Work treatment. Present = this project is a headliner on the
    // home page, laid out as: showcase (screenshot-led), product (title-led,
    // screenshot beside the info) or poster (type-led; shows the screenshot
    // or the `layers` diagram on the right). Absent = secondary: a plate
    // when it has a screenshot, a typographic index row when it doesn't.
    feature: z.enum(["showcase", "product", "poster"]).optional(),
    // Short editorial label shown on the project's folio line; falls back
    // to `client` when absent.
    kicker: z.string().optional(),
    kicker_en: z.string().optional(),
    // Real architecture layers, rendered as a diagram for poster features
    // that have no screenshot (e.g. a full stack project).
    layers: z.array(z.object({ name: z.string(), tech: z.string() })).optional(),
    // Images: drop files in public/images/projects/{slug}/
    // cover is shown on the home page, screenshots on the project page.
    // Both may point at files that don't exist yet: the home page checks at
    // build time and falls back to a type-led treatment. Keep `screenshots`
    // empty until the files exist, or the project page shows broken images.
    cover: z.string(),
    screenshots: z.array(z.string()),
  }),
});

export const collections = { projects };

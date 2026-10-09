import { defineCollection, z } from "astro:content";

const projectLink = z.object({
  href: z.string(),
  label: z.string(),
  type: z.enum(["live", "gh", "priv"]),
});

const projectDemo = z.object({
  label: z.string(),
  label_en: z.string().optional(),
  href: z.string().optional(),
  pending: z.boolean().optional(),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    num: z.string(),
    title: z.string(),
    client: z.string(),
    desc: z.string(),
    desc_en: z.string().optional(),
    problem: z.string(),
    problem_en: z.string().optional(),
    solution: z.string(),
    solution_en: z.string().optional(),
    // Small highlighted stat shown as a badge on the card grid (e.g. usage metric)
    metric: z.string().optional(),
    metric_en: z.string().optional(),
    // Video/gallery walkthrough link; use `pending: true` while the asset isn't ready yet
    demo: projectDemo.optional(),
    context: z.string(),
    context_en: z.string().optional(),
    process: z.string(),
    process_en: z.string().optional(),
    result: z.string(),
    result_en: z.string().optional(),
    tags: z.array(z.string()),
    links: z.array(projectLink),
    private: z.boolean().optional(),
    full: z.boolean().optional(),
    // Images: drop files in public/images/projects/{slug}/
    // cover is shown on the card grid, screenshots on the project page
    cover: z.string(),
    screenshots: z.array(z.string()),
  }),
});

export const collections = { projects };

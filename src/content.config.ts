import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

const indexMarkdown = (base: string) =>
  glob({
    base,
    pattern: "**/index.md",
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ""),
  })

const recipeMarkdown = glob({
  base: "./src/content",
  pattern: "{recipes,custom-recipes}/**/index.md",
  generateId: ({ entry }) =>
    entry
      .replace(/^(recipes|custom-recipes)\//, "")
      .replace(/\/index\.md$/, ""),
})

const blog = defineCollection({
  loader: indexMarkdown("./src/content/blog"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string(),
      date: z.coerce.date(),
      type: z.literal("blog"),
      tags: z.array(z.string()).optional(),
      image: image().optional(),
    }),
})

const recipes = defineCollection({
  loader: recipeMarkdown,
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      type: z.enum(["recipe", "custom-recipe"]),
      tags: z.array(z.string()).optional(),
      source: z.string().optional(),
      notes: z.string().optional(),
      ingredients: z.array(z.string()).optional(),
      image: image().optional(),
    }),
})

const projects = defineCollection({
  loader: indexMarkdown("./src/content/projects"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      type: z.literal("project"),
      demo: z.string().optional(),
      github: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      projectLogo: image().optional(),
    }),
})

export const collections = {
  blog,
  recipes,
  projects,
}

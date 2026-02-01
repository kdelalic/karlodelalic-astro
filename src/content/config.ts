import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    type: z.literal('blog'),
    tags: z.array(z.string()).optional(),
    image: image().optional(),
  }),
});

const recipes = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    type: z.enum(['recipe', 'custom-recipe']),
    tags: z.array(z.string()).optional(),
    source: z.string().optional(),
    notes: z.string().optional(),
    ingredients: z.array(z.string()).optional(),
    image: image().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    type: z.literal('project'),
    demo: z.string().optional(),
    github: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    projectLogo: image().optional(),
  }),
});

const diveLogs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.string().optional(),
  }),
});

export const collections = {
  blog,
  recipes,
  projects,
  'dive-logs': diveLogs,
};

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. Knowledge Base Posts (知识库文章集合 - 兼容现有 Hexo 99+ 篇 Markdown)
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional().nullable(),
    author: z.string().optional().nullable().default('Larry'),
    date: z.coerce.date(),
    updated: z.coerce.date().optional().nullable(),
    categories: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    tags: z.union([z.string(), z.array(z.string())]).optional().nullable().default([]),
    abbrlink: z.union([z.string(), z.number()]).optional().nullable(),
    cover: z.string().optional().nullable(),
    hide: z.boolean().optional().nullable().default(false),
    hidden: z.boolean().optional().nullable().default(false),
    top_img: z.union([z.string(), z.boolean()]).optional().nullable(),
    aside: z.boolean().optional().nullable(),
    comments: z.boolean().optional().nullable(),
    sticky: z.union([z.number(), z.boolean()]).optional().nullable(),
    keywords: z.union([z.string(), z.array(z.string())]).optional().nullable(),
  }),
});

// 2. AI Co-Creation Projects (与 AI 共创作品集集合)
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['AI Agent', 'GenAI Interactive', 'Fullstack Experiment', 'Visual Effects']),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    cover: z.string().optional().nullable(),
    coCreation: z.object({
      humanShare: z.number().min(0).max(100),
      aiShare: z.number().min(0).max(100),
      models: z.array(z.string()),
      humanRole: z.string(),
      aiRole: z.string(),
    }),
    demoUrl: z.string().optional().nullable(),
    githubUrl: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, projects };

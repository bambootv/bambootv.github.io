import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { AUTHOR } from './consts';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			// One category or a list: 'Business' or ['Business', 'Financial']
			category: z
				.union([z.string(), z.array(z.string())])
				.default([])
				.transform((value) => [value].flat()),
			author: z.string().default(AUTHOR.name),
			// Path to an image in `public/`, e.g. '/img/avatar-1.jpg'
			authorAvatar: z.string().default(AUTHOR.avatar),
			// Typed by hand; there is no comment system yet
			commentCount: z.number().int().nonnegative().optional(),
		}),
});

export const collections = { blog };

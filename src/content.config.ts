import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { AUTHOR } from './consts';

// Everything lives in `src/content/topics/<lang>/<topic>/`. Any folder with an index.md is a
// level of the tree: the top folders are topics, the folders inside them are series, and a
// series holds posts, child series, or both.
//   index.md        the topic or series itself
//   NN-slug.md(x)   a post; NN is its position in the series
const base = './src/content/topics';

const series = defineCollection({
	loader: glob({ base, pattern: '*/*/**/index.md' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			cover: image(),
			// Position among its siblings (topics, or series of the same parent)
			order: z.number().default(0),
		}),
});

const posts = defineCollection({
	loader: glob({ base, pattern: '*/*/**/[0-9]*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			author: z.string().default(AUTHOR.name),
			// Path to an image in `public/`, e.g. '/img/avatar-1.jpg'
			authorAvatar: z.string().default(AUTHOR.avatar),
			// Typed by hand; there is no comment system yet
			commentCount: z.number().int().nonnegative().optional(),
		}),
});

export const collections = { series, posts };

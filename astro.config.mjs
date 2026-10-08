// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://bambootv.github.io',
	i18n: {
		defaultLocale: 'vi',
		locales: ['vi', 'en'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		mdx(),
		sitemap({
			i18n: {
				defaultLocale: 'vi',
				locales: { vi: 'vi-VN', en: 'en-US' },
			},
		}),
	],
});

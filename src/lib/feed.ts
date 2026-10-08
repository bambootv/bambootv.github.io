import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_TITLE } from '../consts';
import { type Lang, useTranslations } from '../i18n/ui';
import { getPosts } from './posts';

export function createFeed(lang: Lang) {
	return async function GET(context: APIContext) {
		// Posts shown as a fallback from another language stay out of this language's feed
		const posts = (await getPosts(lang)).filter((post) => post.lang === lang);
		return rss({
			title: SITE_TITLE,
			description: useTranslations(lang)('site.description'),
			site: context.site!,
			items: posts.map(({ entry, url }) => ({
				title: entry.data.title,
				description: entry.data.description,
				pubDate: entry.data.pubDate,
				link: url,
			})),
		});
	};
}

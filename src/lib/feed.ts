import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { SITE_TITLE } from '../consts';
import { type Lang, useTranslations } from '../i18n/ui';
import { getPostsByLang } from './posts';

export function createFeed(lang: Lang) {
	return async function GET(context: APIContext) {
		const posts = await getPostsByLang(lang);
		return rss({
			title: SITE_TITLE,
			description: useTranslations(lang)('site.description'),
			site: context.site!,
			items: posts.map(({ post, slug }) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: getRelativeLocaleUrl(lang, `blog/${slug}`),
			})),
		});
	};
}

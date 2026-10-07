import { type CollectionEntry, getCollection } from 'astro:content';
import { type Lang, locales } from '../i18n/ui';

// Posts live in `src/content/blog/<lang>/`, so the collection id is `<lang>/<slug>`.
// Two translations of the same post share the same slug.
export async function getPostsByLang(lang: Lang) {
	const posts = await getCollection('blog', ({ id }) => id.startsWith(`${lang}/`));
	return posts
		.map((post) => ({ post, slug: post.id.slice(lang.length + 1) }))
		.sort((a, b) => b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf());
}

// "2 months ago" / "2 tháng trước". Computed at build time, so it only refreshes on deploy.
export function getRelativeTime(date: Date, lang: Lang) {
	const days = Math.max(0, Math.floor((Date.now() - date.valueOf()) / 86_400_000));
	const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
	if (days < 30) return rtf.format(-days, 'day');
	if (days < 365) return rtf.format(-Math.floor(days / 30), 'month');
	return rtf.format(-Math.floor(days / 365), 'year');
}

export interface PostPageProps {
	post: CollectionEntry<'blog'>;
	availableLangs: Lang[];
}

export async function getPostStaticPaths(lang: Lang) {
	const ids = new Set((await getCollection('blog')).map((post) => post.id));
	return (await getPostsByLang(lang)).map(({ post, slug }) => ({
		params: { slug },
		props: {
			post,
			availableLangs: locales.filter((locale) => ids.has(`${locale}/${slug}`)),
		} satisfies PostPageProps,
	}));
}

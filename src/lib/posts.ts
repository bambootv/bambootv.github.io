import { type CollectionEntry, getCollection } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { type Lang, defaultLang } from '../i18n/ui';

// Content ids mirror the folders in `src/content/series/`:
//   series  <lang>/<series>[/<child series>...]
//   posts   <lang>/<series>[/<child series>...]/<NN>-<slug>
// Translations share the same folder and file names. A language that has no file of its own
// for a series or a post shows the default language's file instead, under its own URL.

export interface SeriesRef {
	title: string;
	url: string;
}

export interface Post {
	entry: CollectionEntry<'posts'>;
	// Language of the file in use; differs from the page's language when it is a fallback
	lang: Lang;
	// Languages that have their own file
	translations: Lang[];
	slug: string;
	url: string;
	// 1-based position in the series that directly contains it
	part: number;
	series: SeriesRef;
}

export interface Series {
	entry: CollectionEntry<'series'>;
	lang: Lang;
	translations: Lang[];
	// Folders below the language, e.g. 'dap-xe-xuyen-viet/mien-bac'
	path: string;
	url: string;
	// Parent series, outermost first
	ancestors: SeriesRef[];
	// Child series, by their `order`
	children: Series[];
	// Posts directly in this series, in reading order
	posts: Post[];
	// Posts in this series and all of its child series
	postCount: number;
}

// '01-chuan-bi' -> { order: 1, slug: 'chuan-bi' }
function parseFileName(file: string) {
	const [, order, slug] = file.match(/^(\d+)-?(.*)$/)!;
	return { order: Number(order), slug: slug || file };
}

const langOf = (entry: { id: string }) => entry.id.split('/')[0] as Lang;
// 'vi/a/b' -> 'a/b'
const pathOf = (entry: { id: string }) => entry.id.split('/').slice(1).join('/');
// 'a/b' -> 'a', 'a' -> ''
const parentOf = (path: string) => path.split('/').slice(0, -1).join('/');

// Own language first, then the default language, then whatever exists.
function pick<T extends { id: string }>(candidates: T[], lang: Lang) {
	const inLang = (wanted: Lang) => candidates.find((entry) => langOf(entry) === wanted);
	return inLang(lang) ?? inLang(defaultLang) ?? candidates[0];
}

function groupBy<T>(items: T[], key: (item: T) => string) {
	const groups = new Map<string, T[]>();
	for (const item of items) groups.set(key(item), [...(groups.get(key(item)) ?? []), item]);
	return groups;
}

// The top-level series as seen from one language, each with its child series and posts.
export async function getSeriesList(lang: Lang): Promise<Series[]> {
	const [seriesEntries, postEntries] = await Promise.all([getCollection('series'), getCollection('posts')]);

	// The same series or post in several languages ends up in one group, keyed by its path.
	const seriesGroups = groupBy(seriesEntries, pathOf);
	const postGroups = groupBy(postEntries, (entry) => {
		const path = pathOf(entry);
		return `${parentOf(path)}/${parseFileName(path.split('/').at(-1)!).slug}`;
	});

	const orphanPost = postEntries.find((post) => !seriesGroups.has(parentOf(pathOf(post))));
	if (orphanPost) {
		throw new Error(`"${orphanPost.id}" is in a folder that has no index.md in any language. Add one.`);
	}
	const orphanSeries = [...seriesGroups.keys()].find((path) => parentOf(path) && !seriesGroups.has(parentOf(path)));
	if (orphanSeries) {
		throw new Error(`Series "${orphanSeries}" is inside "${parentOf(orphanSeries)}", which has no index.md. Add one.`);
	}
	const clash = [...postGroups.keys()].find((key) => seriesGroups.has(key));
	if (clash) {
		throw new Error(`"${clash}" is both a post and a child series, so they would share one URL. Rename one.`);
	}

	const build = (path: string, ancestors: SeriesRef[]): Series => {
		const candidates = seriesGroups.get(path)!;
		const entry = pick(candidates, lang);
		const url = getRelativeLocaleUrl(lang, `series/${path}`);
		const ref = { title: entry.data.title, url };

		const posts = [...postGroups]
			.filter(([key]) => parentOf(key) === path)
			.map(([, translations]) => {
				const post = pick(translations, lang);
				return { post, translations, ...parseFileName(post.id.split('/').at(-1)!) };
			})
			.sort((a, b) => a.order - b.order)
			.map(({ post, translations, slug }, index) => ({
				entry: post,
				lang: langOf(post),
				translations: translations.map(langOf),
				slug,
				url: getRelativeLocaleUrl(lang, `series/${path}/${slug}`),
				part: index + 1,
				series: ref,
			}));

		const children = [...seriesGroups.keys()]
			.filter((key) => parentOf(key) === path)
			.map((key) => build(key, [...ancestors, ref]))
			.sort((a, b) => a.entry.data.order - b.entry.data.order);

		return {
			entry,
			lang: langOf(entry),
			translations: candidates.map(langOf),
			path,
			url,
			ancestors,
			children,
			posts,
			postCount: posts.length + children.reduce((sum, child) => sum + child.postCount, 0),
		};
	};

	return [...seriesGroups.keys()]
		.filter((path) => parentOf(path) === '')
		.map((path) => build(path, []))
		.sort((a, b) => a.entry.data.order - b.entry.data.order);
}

// A series followed by all of its child series, at any depth.
const withDescendants = (series: Series): Series[] => [series, ...series.children.flatMap(withDescendants)];

// Every post under a series in reading order: its own posts first, then each child series in turn.
export const getReadingOrder = (series: Series): Post[] => [
	...series.posts,
	...series.children.flatMap(getReadingOrder),
];

// Every post of a language, newest first.
export async function getPosts(lang: Lang): Promise<Post[]> {
	return (await getSeriesList(lang))
		.flatMap(getReadingOrder)
		.sort((a, b) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf());
}

// "2 months ago" / "2 tháng trước". Computed at build time, so it only refreshes on deploy.
export function getRelativeTime(date: Date, lang: Lang) {
	const days = Math.max(0, Math.floor((Date.now() - date.valueOf()) / 86_400_000));
	const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
	if (days < 30) return rtf.format(-days, 'day');
	if (days < 365) return rtf.format(-Math.floor(days / 30), 'month');
	return rtf.format(-Math.floor(days / 365), 'year');
}

// `/series/<path>/` is either a series page or a post page.
export type SeriesRouteProps =
	| { kind: 'series'; series: Series }
	// `prev` and `next` follow the reading order of the whole top-level series
	| { kind: 'post'; post: Post; series: Series; prev?: Post; next?: Post };

export async function getSeriesRouteStaticPaths(lang: Lang) {
	return (await getSeriesList(lang)).flatMap((root) => {
		const reading = getReadingOrder(root);
		return withDescendants(root).flatMap((series) => [
			{
				params: { path: series.path },
				props: { kind: 'series', series } satisfies SeriesRouteProps,
			},
			...series.posts.map((post) => {
				const index = reading.indexOf(post);
				return {
					params: { path: `${series.path}/${post.slug}` },
					props: {
						kind: 'post',
						post,
						series,
						prev: reading[index - 1],
						next: reading[index + 1],
					} satisfies SeriesRouteProps,
				};
			}),
		]);
	});
}

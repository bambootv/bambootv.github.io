import { type CollectionEntry, getCollection } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { type Lang, defaultLang, locales } from '../i18n/ui';

// Content ids mirror the folders in `src/content/topics/`, always four levels deep:
//   topic    <lang>/<topic>
//   series   <lang>/<topic>/<series>
//   chapter  <lang>/<topic>/<series>/<chapter>
//   post     <lang>/<topic>/<series>/<chapter>/<NN>-<slug>
// Topics, series and chapters are the same kind of node (a folder with an index.md), told apart
// by depth. URLs put `series` after the topic: `/<topic>/series/<series>/<chapter>/<post>/`.
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
	// 1-based position in its chapter
	part: number;
	series: SeriesRef;
}

export type Level = 'topic' | 'series' | 'chapter';
const LEVELS: Level[] = ['topic', 'series', 'chapter'];

// A topic, a series or a chapter.
export interface Series {
	entry: CollectionEntry<'series'>;
	level: Level;
	// 1-based position among its siblings, e.g. the 2 in "Chương 2"
	position: number;
	lang: Lang;
	translations: Lang[];
	// Folders below the language, e.g. 'topic-1/dap-xe-xuyen-viet/mien-bac'
	path: string;
	url: string;
	// The levels above it, outermost first; empty for a topic
	ancestors: SeriesRef[];
	// Series of a topic or chapters of a series, by their `order`; empty for a chapter
	children: Series[];
	// Posts of a chapter, in reading order; empty above the chapter level
	posts: Post[];
	// Posts at or below this level
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
// Folder path to URL path: 'topic-1/a/b' -> 'topic-1/series/a/b'
const routeOf = (path: string) => {
	const [topic, ...rest] = path.split('/');
	return [topic, 'series', ...rest].join('/');
};

// Top-level URL segments that already mean something, so a topic can't use them
const RESERVED = ['blog', 'about', 'topics', 'series', 'img', 'css', 'js', 'fonts', ...locales];

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

// The topics as seen from one language, each with its series, their chapters and posts.
export async function getTopics(lang: Lang): Promise<Series[]> {
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
	const reserved = [...seriesGroups.keys()].find((path) => RESERVED.includes(path));
	if (reserved) {
		throw new Error(`A topic can't be named "${reserved}": that URL is already taken. Rename the folder.`);
	}
	const depthOf = (path: string) => path.split('/').length;
	const tooDeep = [...seriesGroups.keys()].find((path) => depthOf(path) > LEVELS.length);
	if (tooDeep) {
		throw new Error(`"${tooDeep}" is a folder inside a chapter. A chapter holds only posts.`);
	}
	const misplaced = postEntries.find((post) => depthOf(parentOf(pathOf(post))) !== LEVELS.length);
	if (misplaced) {
		throw new Error(`"${misplaced.id}" must sit in a chapter folder: <topic>/<series>/<chapter>/NN-post.md`);
	}
	const clash = [...postGroups.keys()].find((key) => seriesGroups.has(key));
	if (clash) {
		throw new Error(`"${clash}" is both a post and a child series, so they would share one URL. Rename one.`);
	}

	const build = (path: string, ancestors: SeriesRef[]): Series => {
		const candidates = seriesGroups.get(path)!;
		const entry = pick(candidates, lang);
		const url = getRelativeLocaleUrl(lang, routeOf(path));
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
				url: getRelativeLocaleUrl(lang, `${routeOf(path)}/${slug}`),
				part: index + 1,
				series: ref,
			}));

		const children = numbered(
			[...seriesGroups.keys()].filter((key) => parentOf(key) === path).map((key) => build(key, [...ancestors, ref])),
		);

		return {
			entry,
			level: LEVELS[depthOf(path) - 1],
			position: 0,
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

	return numbered([...seriesGroups.keys()].filter((path) => parentOf(path) === '').map((path) => build(path, [])));
}

// Sorts siblings by their `order` and records their position.
function numbered(nodes: Series[]) {
	nodes.sort((a, b) => a.entry.data.order - b.entry.data.order);
	nodes.forEach((node, index) => (node.position = index + 1));
	return nodes;
}

// Every series of every topic, as listed on `/series/`.
export async function getAllSeries(lang: Lang): Promise<Series[]> {
	return (await getTopics(lang)).flatMap((topic) => topic.children);
}

// A node followed by everything below it.
const withDescendants = (series: Series): Series[] => [series, ...series.children.flatMap(withDescendants)];

// Every post under a node in reading order: chapter by chapter.
export const getReadingOrder = (series: Series): Post[] => [
	...series.posts,
	...series.children.flatMap(getReadingOrder),
];

// Every post of a language, newest first.
export async function getPosts(lang: Lang): Promise<Post[]> {
	return (await getTopics(lang))
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

// `/<topic>/series/[<path>/]` is a topic, a series or a post. Topics use the series page too.
export type SeriesRouteProps =
	| { kind: 'series'; series: Series }
	// `prev` and `next` run across the chapters of the post's series, and stop at its ends
	| { kind: 'post'; post: Post; series: Series; prev?: Post; next?: Post };

export async function getSeriesRouteStaticPaths(lang: Lang) {
	return (await getTopics(lang)).flatMap((topic) => {
		// 'topic-1/a/b' -> { topic: 'topic-1', path: 'a/b' }; the topic page itself has no path
		const params = (path: string) => ({
			topic: topic.path,
			path: path.split('/').slice(1).join('/') || undefined,
		});
		return [
			{
				params: params(topic.path),
				props: { kind: 'series', series: topic } satisfies SeriesRouteProps,
			},
			...topic.children.flatMap((root) => {
				const reading = getReadingOrder(root);
				return withDescendants(root).flatMap((series) => [
					{
						params: params(series.path),
						props: { kind: 'series', series } satisfies SeriesRouteProps,
					},
					...series.posts.map((post) => {
						const index = reading.indexOf(post);
						return {
							params: params(`${series.path}/${post.slug}`),
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
			}),
		];
	});
}

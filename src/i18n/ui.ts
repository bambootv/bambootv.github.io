// UI strings for both languages. Vietnamese is served at `/`, English at `/en/`.

export const languages = {
  vi: "VI",
  en: "EN",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "vi";
export const locales = Object.keys(languages) as Lang[];

const vi = {
  "site.description":
    "Nhật ký hành trình đạp xe xuyên Việt và kinh nghiệm lập trình web của Bamboo.",
  "nav.home": "Trang chủ",
  "nav.topics": "Chủ đề",
  "nav.series": "Loạt bài",
  "nav.posts": "Bài viết",
  "nav.about": "Giới thiệu",
  "sort.label": "Sắp xếp",
  "sort.newest": "Mới nhất",
  "sort.oldest": "Cũ nhất",
  "sort.title": "Tiêu đề A–Z",
  "sort.series": "Theo loạt bài",
  "about.title": "Về tôi",
  "post.updated": "Cập nhật lần cuối",
  "post.part": "Bài",
  "post.prev": "Bài trước",
  "post.next": "Bài sau",
  "post.fallback":
    "Bài này chưa có bản tiếng Việt. Đang hiển thị bản tiếng Anh.",
  "level.series": "Loạt bài",
  "level.chapter": "Chương",
  "count.series": "loạt bài",
  "count.chapter": "chương",
  "count.chapters": "chương",
  "count.post": "bài",
  "count.posts": "bài",
  "series.inThis": "Trong chương này",
  "footer.rights": "Đã đăng ký bản quyền.",
  "404.title": "Không tìm thấy trang",
  "404.lead": "Trang bạn tìm không tồn tại.",
  "404.hint": "Có thể trang đã bị chuyển đi hoặc xoá.",
  "404.home": "Về trang chủ",
};

const en: Record<keyof typeof vi, string> = {
  "site.description":
    "Bamboo's journal of cycling across Vietnam and notes from years of web development.",
  "nav.home": "Home",
  "nav.topics": "Topics",
  "nav.series": "Series",
  "nav.posts": "Posts",
  "nav.about": "About",
  "sort.label": "Sort by",
  "sort.newest": "Newest",
  "sort.oldest": "Oldest",
  "sort.title": "Title A–Z",
  "sort.series": "By series",
  "about.title": "About Me",
  "post.updated": "Last updated on",
  "post.part": "Part",
  "post.prev": "Previous Post",
  "post.next": "Next Post",
  "post.fallback":
    "This post is not available in English yet. Showing the Vietnamese version.",
  "level.series": "Series",
  "level.chapter": "Chapter",
  "count.series": "series",
  "count.chapter": "chapter",
  "count.chapters": "chapters",
  "count.post": "post",
  "count.posts": "posts",
  "series.inThis": "In this chapter",
  "footer.rights": "All rights reserved.",
  "404.title": "Page Not Found",
  "404.lead": "The page you are looking for doesn't exist.",
  "404.hint": "It might have been moved or deleted.",
  "404.home": "Back to Home",
};

export const ui = { vi, en };

export type UIKey = keyof typeof vi;

export function getLang(currentLocale: string | undefined): Lang {
  return currentLocale && currentLocale in languages
    ? (currentLocale as Lang)
    : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UIKey) => ui[lang][key];
}

// "2 chương · 4 bài" / "2 chapters · 4 posts"
export function useCounts(lang: Lang) {
  const t = useTranslations(lang);
  return {
    series: (n: number) => `${n} ${t("count.series")}`,
    chapters: (n: number) => `${n} ${t(n === 1 ? "count.chapter" : "count.chapters")}`,
    posts: (n: number) => `${n} ${t(n === 1 ? "count.post" : "count.posts")}`,
  };
}

// '/en/series/mobile-app/' -> 'series/mobile-app/', '/blog/' -> 'blog/'
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  return first !== defaultLang && first in languages
    ? rest.join("/")
    : pathname.slice(1);
}

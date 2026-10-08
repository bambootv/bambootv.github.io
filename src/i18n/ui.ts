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
  "nav.blog": "Blog",
  "nav.about": "Giới thiệu",
  "nav.contact": "Liên hệ",
  "about.title": "Về tôi",
  "post.updated": "Cập nhật lần cuối",
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
  "nav.blog": "Blog",
  "nav.about": "About",
  "nav.contact": "Contact",
  "about.title": "About Me",
  "post.updated": "Last updated on",
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

// '/en/blog/first-post/' -> 'blog/first-post/', '/blog/' -> 'blog/'
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  return first !== defaultLang && first in languages
    ? rest.join("/")
    : pathname.slice(1);
}

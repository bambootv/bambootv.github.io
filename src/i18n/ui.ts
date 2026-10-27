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
    "Blog của Bamboo về làm việc, tu dưỡng tâm thức và kết nối với mọi người: lập trình web, đạp xe xuyên Việt, sách hay và những thói quen nhỏ.",
  "home.hero.title": "Học làm nghề, đạp xe xuyên Việt và tập sống điềm tĩnh",
  "home.hero.cta": "Khám phá các chủ đề",
  "home.hero.scroll": "Cuộn xuống",
  "home.intro.title": "Xin chào, mình là Bamboo",
  "home.intro.text":
    "Mình là một <strong>lập trình viên web</strong> đang học để thành fullstack, một người mê <strong>đạp xe xuyên Việt</strong>, và một người đang tập sống chậm lại. Blog này ghi lại ba điều mình quan tâm nhất: <strong>làm</strong> việc cho tử tế, giữ <strong>tâm</strong> điềm tĩnh, và <strong>kết nối</strong> với những người xung quanh.",
  "home.divider.text": "Chỉ cần điềm tĩnh, không ai dám xem thường.",
  "home.divider.cta": "Đọc thêm",
  "home.latest.title": "Mới trên blog",
  "home.latest.lead": "Những bài viết gần đây nhất.",
  "home.newsletter.title": "Nhận bài mới qua email",
  "home.newsletter.lead":
    "Mỗi khi có bài mới về lập trình, đạp xe hay tu dưỡng, mình sẽ gửi một email ngắn. Không quảng cáo, huỷ lúc nào cũng được.",
  "home.newsletter.placeholder": "Nhập địa chỉ email của bạn",
  "home.newsletter.submit": "Đăng ký",
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
  "level.topic": "Chủ đề",
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
    "Bamboo's blog about work, inner calm and connecting with people: web development, cycling across Vietnam, good books and small habits.",
  "home.hero.title": "Learning a craft, cycling across Vietnam and practising calm",
  "home.hero.cta": "Explore the topics",
  "home.hero.scroll": "Scroll Down",
  "home.intro.title": "Hi, I'm Bamboo",
  "home.intro.text":
    "I'm a <strong>web developer</strong> learning to go fullstack, someone who loves <strong>cycling across Vietnam</strong>, and someone learning to slow down. This blog records the three things I care about most: <strong>doing</strong> good work, keeping a <strong>calm mind</strong>, and <strong>connecting</strong> with the people around me.",
  "home.divider.text": "Stay calm, and no one will dare look down on you.",
  "home.divider.cta": "Read more",
  "home.latest.title": "Latest from the blog",
  "home.latest.lead": "The most recent posts.",
  "home.newsletter.title": "Get new posts by email",
  "home.newsletter.lead":
    "Whenever there's a new post on programming, cycling or self-cultivation, I'll send a short email. No ads, unsubscribe any time.",
  "home.newsletter.placeholder": "Type your email address",
  "home.newsletter.submit": "Subscribe",
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
  "level.topic": "Topic",
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

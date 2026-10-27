# Bamboo Blog

Blog cá nhân dựng bằng [Astro](https://astro.build), xuất ra file tĩnh và chạy trên GitHub Pages tại <https://bambootv.github.io>. Giao diện dùng theme Bootstrap Blog (Bootstrap Temple). Nội dung song ngữ: tiếng Việt ở `/`, tiếng Anh ở `/en/`.

## Lệnh

```bash
npm install            # cài thư viện
npm run dev            # chạy thử tại http://localhost:4321
npm run check          # kiểm tra kiểu
npm run build          # build ra dist/
npm run preview        # xem bản build
```

Sau khi sửa `src/content.config.ts` hoặc đổi tên thư mục nội dung, nếu trang báo lỗi lạ thì dừng dev server và chạy `npm run dev -- --force` để dựng lại bộ đệm nội dung.

Push lên nhánh `deployment` thì GitHub Actions tự build và deploy (`.github/workflows/deploy.yml`).

## Nội dung: chủ đề → loạt bài → chương → bài viết

Cố định bốn cấp, mỗi cấp là một thư mục có `index.md`, bài viết là file đánh số trong thư mục chương.

```
src/content/topics/
  vi/
    lam/                             chủ đề (topic)
      index.md
      dap-xe-xuyen-viet/             loạt bài (series)
        index.md
        mien-bac/                    chương (chapter)
          index.md
          01-ha-noi-ninh-binh.md     Bài 1 của chương
          02-ninh-binh-vinh.md       Bài 2
        mien-trung/
          index.md
          01-deo-ngang-ve-hue.md
    tam-thuc/
  en/                                bản dịch, chỉ tạo khi có (xem "Bản tiếng Anh")
```

| Đường dẫn | Trang |
|---|---|
| `/` | Trang chủ; ba khối featured dẫn tới ba chủ đề đầu tiên theo `order` |
| `/topics/` | Mọi chủ đề (menu "Chủ đề") |
| `/series/` | Mọi loạt bài của mọi chủ đề (menu "Loạt bài") |
| `/lam/series/` | Một chủ đề và các loạt bài của nó |
| `/lam/series/dap-xe-xuyen-viet/` | Một loạt bài và các chương |
| `/lam/series/dap-xe-xuyen-viet/mien-bac/` | Một chương và các bài |
| `/lam/series/dap-xe-xuyen-viet/mien-bac/ha-noi-ninh-binh/` | Một bài viết |
| `/blog/` | Mọi bài (menu "Bài viết"), sắp xếp được theo mới nhất, cũ nhất, tiêu đề, hoặc thứ tự loạt bài |
| `/about/` | Giới thiệu, kèm khối liên hệ ở cuối trang |

Quy tắc:

- **Đường dẫn đi theo thư mục**, có thêm chữ `series` ngay sau tên chủ đề, và dùng chung cho cả hai ngôn ngữ. Đổi tên hay chuyển thư mục là đổi đường dẫn.
- **Bài viết chỉ nằm trong thư mục chương**, và trong chương không có thư mục con. Tên file bài phải bắt đầu bằng số.
- **Tên chủ đề không được trùng trang sẵn có**: `blog`, `about`, `topics`, `series`, `en`, `vi`, `img`, `css`, `js`, `fonts`.
- **Số ở đầu tên file** là thứ tự bài trong chương. Số này không nằm trong đường dẫn: `01-ha-noi-ninh-binh.md` thành `.../mien-bac/ha-noi-ninh-binh/`. Đổi thứ tự bài thì đổi số, link không đổi.
- **Thứ tự chủ đề, loạt bài, chương** theo trường `order` trong `index.md`; số "Chương 1, 2" đánh theo thứ tự đó.
- **"Bài n/N"** đếm trong chương. Nút bài trước / bài sau đi xuyên các chương của cùng loạt bài và dừng ở đầu, cuối loạt bài.
- Build báo lỗi chỉ rõ file khi vi phạm các quy tắc trên, khi thư mục thiếu `index.md`, và khi một bài trùng tên với một thư mục cùng cấp.

### Thêm chủ đề, loạt bài hoặc chương

Tạo thư mục kèm file `index.md`: trong `src/content/topics/vi/` là chủ đề, trong thư mục chủ đề là loạt bài, trong thư mục loạt bài là chương. Cả ba dùng chung các trường:

```md
---
title: 'Miền Bắc'
description: 'Mô tả ngắn, hiện trên thẻ và ở đầu trang.'
cover: '../../../../../../assets/ten-anh-bia.jpg'
order: 1          # vị trí so với các thư mục cùng cấp
---

Đoạn giới thiệu, hiện ở đầu trang.
```

### Thêm một bài

Tạo file `NN-ten-bai.md` (hoặc `.mdx`) trong thư mục chương:

```md
---
title: 'Tiêu đề bài'
description: 'Mô tả ngắn, hiện trên thẻ bài.'
pubDate: 'Aug 07 2026'
heroImage: '../../../../../../assets/ten-anh.jpg'   # tuỳ chọn
updatedDate: 'Aug 10 2026'                    # tuỳ chọn
author: 'Bamboo'                              # tuỳ chọn, mặc định lấy từ src/consts.ts
authorAvatar: '/img/avatar-1.jpg'             # tuỳ chọn
commentCount: 12                              # tuỳ chọn, số gõ tay
---

Nội dung viết bằng Markdown.
```

Ảnh dùng trong frontmatter đặt ở `src/assets/` để Astro tự nén. Đường dẫn ảnh tính từ vị trí file, nên file nằm sâu thêm một cấp thư mục thì thêm một `../`. Schema của các trường nằm trong `src/content.config.ts`.

### Bản tiếng Anh

Chỉ cần viết trong `vi/`. Mọi trang đều có sẵn ở `/en/...` với giao diện tiếng Anh; chủ đề, loạt bài, chương hay bài nào chưa có file tiếng Anh thì trang đó hiện nội dung tiếng Việt, kèm một dòng báo cho người đọc.

Khi muốn dịch, tạo file **cùng tên, cùng thư mục** bên `src/content/topics/en/`. Có thể dịch từng file một: dịch một bài mà chưa dịch `index.md` của chương, loạt bài hay chủ đề cũng được.

```
src/content/topics/
  vi/ket-noi/ky-nang-giao-tiep/lang-nghe/01-lang-nghe-chu-dong.md
  en/ket-noi/ky-nang-giao-tiep/lang-nghe/01-lang-nghe-chu-dong.md     trang /en/ dùng file này thay cho bản tiếng Việt
```

Bài chưa dịch không xuất hiện trong RSS tiếng Anh (`/en/rss.xml`), và trang `/en/` của nó khai `canonical` về trang tiếng Việt.

## Mã nguồn

```
src/
  content.config.ts    schema của chủ đề, loạt bài, chương và bài viết
  consts.ts            tên site, tác giả mặc định
  i18n/ui.ts           chuỗi giao diện tiếng Việt và tiếng Anh
  lib/posts.ts         dựng cây bốn cấp, kiểm tra cấu trúc, đường dẫn, bài trước/sau
  lib/feed.ts          RSS
  layouts/             MainLayout (khung chung), PostLayout (trang bài viết)
  components/          thẻ và khối giao diện (PostCard, SeriesCard, TopicIndex, TopicBanner, Sidebar...),
                       SeriesView (chủ đề, loạt bài, chương) và PostView (bài) là hai dạng trang dưới /<topic>/series/
  pages/               trang tiếng Việt; pages/en/ bọc lại cho tiếng Anh
  styles/prose.css     kiểu chữ cho nội dung Markdown
public/                CSS, JS, ảnh của theme (giữ nguyên bản gốc)
```

## Phần còn là mẫu

Các phần sau chép từ theme và chưa nối dữ liệu thật: trang chủ, sidebar (tìm kiếm, bài mới, chuyên mục, tag), tag và lượt xem ở trang bài viết, khối bình luận và form bình luận, form liên hệ, form newsletter. Các bài và series hiện có cũng là dữ liệu giả.

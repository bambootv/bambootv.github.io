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

## Nội dung được tổ chức theo series

Thư mục nào có `index.md` thì là một series. Trong đó có thể có bài viết (file đánh số), series con (thư mục con có `index.md`), hoặc cả hai. Lồng bao nhiêu cấp cũng được.

```
src/content/series/
  vi/
    dap-xe-xuyen-viet/         series cha
      index.md                 thông tin series
      mien-bac/                series con
        index.md
        01-ha-noi.md           Phần 1 của "Miền Bắc"
        02-ninh-binh.md        Phần 2
      mien-trung/              series con
        index.md
        01-hue.md
    mobile-app/                series một cấp
      index.md
      01-gioi-thieu.md
  en/                          bản dịch, chỉ tạo khi có (xem "Bản tiếng Anh")
```

| Đường dẫn | Trang |
|---|---|
| `/series/` | Các series cấp cao nhất |
| `/series/dap-xe-xuyen-viet/` | Series cha: giới thiệu, các series con, và bài trực tiếp nếu có |
| `/series/dap-xe-xuyen-viet/mien-bac/` | Series con và các bài theo thứ tự |
| `/series/dap-xe-xuyen-viet/mien-bac/ha-noi/` | Một bài viết |
| `/blog/` | Mọi bài của mọi series, mới nhất trước |

Quy tắc:

- **Đường dẫn đi theo thư mục**, dùng chung cho cả hai ngôn ngữ. Chuyển bài hay series con sang thư mục khác là đổi đường dẫn của nó.
- **Số ở đầu tên file** là thứ tự bài trong series chứa nó. Số này không nằm trong đường dẫn: `01-ha-noi.md` thành `.../mien-bac/ha-noi/`. Đổi thứ tự bài thì đổi số, link không đổi.
- **Thứ tự series** (trên trang `/series/` và giữa các series con cùng cha) theo trường `order` trong `index.md`.
- **"Phần n/N"** đếm trong series chứa trực tiếp bài đó. Nút bài trước / bài sau thì đi xuyên qua các series con của cùng một series gốc: bài trực tiếp của series trước, rồi lần lượt từng series con.
- **Mọi bài phải nằm trong một series** và tên file phải bắt đầu bằng số. Build báo lỗi khi thư mục có bài hoặc có series con mà thiếu `index.md`, và khi một bài trùng tên với một series con cùng cấp.

### Thêm một series

Tạo thư mục trong `src/content/series/vi/` (series cấp cao nhất) hoặc trong thư mục của một series khác (series con), kèm file `index.md`:

```md
---
title: 'Đạp xe xuyên Việt'
description: 'Mô tả ngắn, hiện ở trang danh sách series.'
cover: '../../../../assets/ten-anh-bia.jpg'
order: 1          # vị trí so với các series cùng cấp
---

Đoạn giới thiệu series, hiện ở đầu trang series.
```

### Thêm một bài

Tạo file `NN-ten-bai.md` (hoặc `.mdx`) trong thư mục series:

```md
---
title: 'Tiêu đề bài'
description: 'Mô tả ngắn, hiện trên thẻ bài.'
pubDate: 'Aug 07 2026'
heroImage: '../../../../assets/ten-anh.jpg'   # tuỳ chọn
updatedDate: 'Aug 10 2026'                    # tuỳ chọn
author: 'Bamboo'                              # tuỳ chọn, mặc định lấy từ src/consts.ts
authorAvatar: '/img/avatar-1.jpg'             # tuỳ chọn
commentCount: 12                              # tuỳ chọn, số gõ tay
---

Nội dung viết bằng Markdown.
```

Ảnh dùng trong frontmatter đặt ở `src/assets/` để Astro tự nén. Đường dẫn ảnh tính từ vị trí file, nên file nằm sâu thêm một cấp thư mục thì thêm một `../`. Schema của các trường nằm trong `src/content.config.ts`.

### Bản tiếng Anh

Chỉ cần viết trong `vi/`. Mọi trang đều có sẵn ở `/en/...` với giao diện tiếng Anh; series hay bài nào chưa có file tiếng Anh thì trang đó hiện nội dung tiếng Việt, kèm một dòng báo cho người đọc.

Khi muốn dịch, tạo file **cùng tên** ở `src/content/series/en/<series>/`. Có thể dịch từng file một: dịch một bài mà chưa dịch `index.md` của series cũng được.

```
src/content/series/
  vi/mobile-app/01-gioi-thieu.md
  en/mobile-app/01-gioi-thieu.md     trang /en/ dùng file này thay cho bản tiếng Việt
```

Bài chưa dịch không xuất hiện trong RSS tiếng Anh (`/en/rss.xml`), và trang `/en/` của nó khai `canonical` về trang tiếng Việt.

## Mã nguồn

```
src/
  content.config.ts    schema của series và bài viết
  consts.ts            tên site, tác giả mặc định
  i18n/ui.ts           chuỗi giao diện tiếng Việt và tiếng Anh
  lib/posts.ts         truy vấn series, bài viết, bài trước/sau
  lib/feed.ts          RSS
  layouts/             MainLayout (khung chung), PostLayout (trang bài viết)
  components/          thẻ và khối giao diện (PostCard, SeriesCard, SeriesRow, Sidebar...),
                       SeriesView và PostView là hai dạng trang dưới /series/
  pages/               trang tiếng Việt; pages/en/ bọc lại cho tiếng Anh
  styles/prose.css     kiểu chữ cho nội dung Markdown
public/                CSS, JS, ảnh của theme (giữ nguyên bản gốc)
```

## Phần còn là mẫu

Các phần sau chép từ theme và chưa nối dữ liệu thật: trang chủ, sidebar (tìm kiếm, bài mới, chuyên mục, tag), tag và lượt xem ở trang bài viết, khối bình luận và form bình luận, form liên hệ, form newsletter. Các bài và series hiện có cũng là dữ liệu giả.

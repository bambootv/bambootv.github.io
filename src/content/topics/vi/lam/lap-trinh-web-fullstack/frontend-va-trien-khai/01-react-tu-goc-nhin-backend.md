---
title: 'React nhìn từ góc người làm backend'
description: 'Những khái niệm React mình thấy lạ nhất khi quen làm backend.'
pubDate: '2026-09-06'
heroImage: '../../../../../../assets/featured-pic-3.jpeg'
commentCount: 4
---

Mình làm backend lâu nên khi học React có nhiều chỗ thấy ngược đời. Bài này ghi lại những chỗ đó.

## Tư duy component

- Chia giao diện thành từng mảnh nhỏ
- Props truyền xuống, sự kiện truyền lên

## State và effect

- `useState` giữ dữ liệu của component
- `useEffect` và những lần chạy thừa

## Gọi API từ giao diện

- Trạng thái đang tải, lỗi, có dữ liệu
- Thư viện hỗ trợ: TanStack Query (tuỳ chọn)

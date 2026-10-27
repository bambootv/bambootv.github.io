---
title: 'HTTP và REST API'
description: 'Trình duyệt và máy chủ nói chuyện với nhau như thế nào.'
pubDate: '2026-06-10'
heroImage: '../../../../../../assets/blog-post-4.jpeg'
commentCount: 9
---

Mọi trang web đều xoay quanh một vòng lặp: gửi yêu cầu, nhận phản hồi. Hiểu vòng lặp này là hiểu được nửa phần backend.

## HTTP trong một trang giấy

- Request gồm method, URL, header, body
- Response gồm status code, header, body
- Các mã hay gặp: 200, 201, 400, 401, 404, 500

## Thiết kế REST API

- Tài nguyên là danh từ: `/posts`, `/posts/12`
- Method là động từ: GET, POST, PUT, DELETE
- Trả lỗi rõ ràng để phía frontend xử lý được

## Thử ngay

- Gọi thử API bằng Postman hoặc `curl`

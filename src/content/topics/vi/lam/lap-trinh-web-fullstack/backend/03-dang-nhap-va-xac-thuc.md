---
title: 'Đăng nhập và xác thực người dùng'
description: 'Làm sao biết ai đang dùng ứng dụng và họ được phép làm gì.'
pubDate: '2026-08-21'
heroImage: '../../../../../../assets/featured-pic-2.jpeg'
commentCount: 10
---

Đăng nhập trông đơn giản nhưng là chỗ dễ để lộ dữ liệu nhất. Bài này đi qua những điều tối thiểu phải làm đúng.

## Xác thực và phân quyền

- Xác thực: bạn là ai
- Phân quyền: bạn được làm gì

## Lưu mật khẩu

- Không bao giờ lưu mật khẩu gốc
- Băm mật khẩu bằng bcrypt hoặc argon2

## Session hay token

- Cookie session
- JWT và những điều cần cẩn thận
- Đăng nhập bằng Google, GitHub (OAuth)

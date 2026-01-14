# Hướng dẫn Deploy lên Vercel (Miễn phí)

Web app này sử dụng **Next.js** và **SQLite**. Để chạy miễn phí trên Vercel mà không bị mất dữ liệu, chúng ta dùng **Turso** (Dịch vụ Database SQLite Online).

## Bước 1: Tạo Database trên Turso
1. Truy cập [turso.tech](https://turso.tech) và đăng ký tài khoản (dùng Github).
2. Cài đặt Turso CLI trên máy của bạn (nếu muốn) hoặc dùng giao diện Web.
   - Nếu dùng CLI: `turso db create calo-track`
3. Lấy thông tin kết nối:
   - **Database URL**: Dạng `libsql://calo-track-....turso.io`
   - **Auth Token**: Bấm "Generate Token" để lấy Key.

## Bước 2: Đẩy code lên Github
1. Tạo một repository mới trên Github.
2. Push code hiện tại lên đó.

## Bước 3: Deploy lên Vercel
1. Truy cập [vercel.com](https://vercel.com) và chọn **"Add New Project"**.
2. Import repository vừa tạo.
3. Ở mục **Environment Variables**, thêm 3 biến sau:
   - `GEMINI_API_KEY`: Key AI của bạn.
   - `TURSO_DATABASE_URL`: URL của Turso database (Bước 1).
   - `TURSO_AUTH_TOKEN`: Token của Turso (Bước 1).
4. Bấm **Deploy**.

## Lưu ý khi chạy Local (trên máy tính)
- Hiện tại code đã được cấu hình để chạy được cả Local lẫn Online.
- Nếu bạn không cấu hình biến môi trường `TURSO_...` trong file `.env`, app sẽ tự động dùng file `local.db` trên máy tính.
- Nếu muốn dùng dữ liệu thật từ Turso ngay trên máy, hãy thêm vào `.env`:
  ```
  TURSO_DATABASE_URL=libsql://...
  TURSO_AUTH_TOKEN=...
  ```

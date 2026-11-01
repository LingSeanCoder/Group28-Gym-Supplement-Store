# Gym and Supplement Store Management System

**Group 28** — MSIS207.R11.CTTT

## Thành viên
| Vai trò | Họ tên | MSSV | Module |
|---|---|---|---|
| Người 1 | Nguyễn Đình Sang | [24521521] | Auth + Gym |
| Người 2 | Nguyễn Phan Hoàng Quân | [24521446] | Store |

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + `pg` (node-postgres), SQL có tham số
- **Database:** PostgreSQL local; kết nối Supabase ở Task 7
- **Database client:** pgAdmin để quản lý PostgreSQL và chạy SQL
- **Deploy:** Vercel (FE), Render (BE)
- **Container:** Docker

## Cấu trúc thư mục

```text
frontend/   React + Vite client
backend/    Express API using pg and PostgreSQL
docs/       ERD and project documentation
.github/    Issue and pull request templates
```

## Chạy backend (Task 3)

Yêu cầu Node.js 22 trở lên. Từ thư mục dự án:

```powershell
cd backend
npm ci
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm run dev
```

Nếu đã có `backend/.env`, giữ file hiện tại và bổ sung các biến còn thiếu từ
`.env.example`. Backend ưu tiên biến môi trường của tiến trình, sau đó
`backend/.env`, cuối cùng `.env` ở thư mục gốc để tương thích cấu hình cũ.
File cấu hình được tìm theo vị trí mã nguồn, không phụ thuộc thư mục chạy lệnh.

Kiểm tra API bằng trình duyệt hoặc PowerShell:

```powershell
Invoke-RestMethod http://localhost:5000/health
Invoke-RestMethod http://localhost:5000/api/health
```

Cả hai URL trả HTTP 200 với dạng:

```json
{
  "success": true,
  "data": { "status": "ok", "timestamp": "...", "uptime": 0 },
  "error": null
}
```

Health endpoint chỉ kiểm tra API còn chạy, nên không yêu cầu database đã được
tạo hay kết nối thành công. `GET /api/health/db` và cấu hình Supabase thuộc Task 7.

### PostgreSQL local và pgAdmin

1. Khởi động PostgreSQL. Trong pgAdmin, kết nối server local qua host `localhost`,
   port `5432`, tài khoản PostgreSQL của bạn (thường là `postgres`).
2. Tạo database `gym_supplement_store` nếu chưa có, rồi đặt `PGHOST`, `PGPORT`,
   `PGDATABASE`, `PGUSER`, `PGPASSWORD` tương ứng trong `backend/.env`.
3. Để `DATABASE_URL` trống khi dùng các biến `PG*`. Nếu có `DATABASE_URL`, Pool
   sẽ ưu tiên URL đó. Không commit thông tin kết nối thật.

Backend dùng `pg` để truy cập PostgreSQL; pgAdmin là công cụ quản lý database.
Task 3 chưa tạo bảng hoặc seed; hai phần đó thực hiện ở Task 14–15 sau khi chốt ERD.

### Cấu trúc backend

```text
src/index.js        Start HTTP server and close the Pool on shutdown
src/app.js          Express middleware and route registration
src/config/         Environment configuration and shared pg Pool
src/routes/         URLs and HTTP methods
src/controllers/    HTTP requests and responses
src/services/       Business rules
src/repositories/   Parameterized SQL and database access
src/middlewares/    Shared error handling
```

Các API dùng dạng `{ success, data, error }`; route không tồn tại trả JSON 404,
JSON không hợp lệ trả 400, lỗi nội bộ trả thông báo chung.
`CORS_ORIGIN` mặc định là `http://localhost:5173`.

`npm run dev` dùng chế độ watch có sẵn của Node.js. Chạy production bằng `npm start`.
Chạy kiểm tra backend từ thư mục `backend/`:

```powershell
npm test
```

Tài liệu `pg`: [kết nối](https://node-postgres.com/features/connecting),
[truy vấn có tham số](https://node-postgres.com/features/queries),
[connection pool](https://node-postgres.com/features/pooling).
Đặc tả health endpoints nằm trong `openapi.yaml`; Swagger UI thuộc Task 43.

## Chạy frontend

```bash
cd frontend
npm install
npm run dev
```

Vite hiển thị ứng dụng tại `http://localhost:5173`. Các route mẫu:

- `/`: cửa hàng công khai
- `/admin`: dashboard quản trị
- `/admin/products`: danh sách sản phẩm mẫu
- `/member`: dashboard thành viên

# Dự án Nhóm 19

## 📖 Mô tả dự án
Dự án này là một ứng dụng quản lý người dùng, cho phép thực hiện các thao tác CRUD (Create, Read, Update, Delete) thông qua API. Người dùng có thể thêm, sửa, xóa và xem danh sách người dùng.

## 🛠️ Công nghệ sử dụng
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Vite

## 🚀 Hướng dẫn chạy
### Backend
1. Clone repo: `git clone <link-repo>`
2. Di chuyển vào thư mục Backend: `cd Backend`
3. Cài đặt dependencies: `npm install`
4. Tạo file `.env` với nội dung:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
   PORT=3000
   ```
5. Chạy server: `npm run server`

### Frontend
1. Di chuyển vào thư mục Frontend: `cd Frontend`
2. Cài đặt dependencies: `npm install`
3. Chạy ứng dụng: `npm run dev`

## 👥 Đóng góp — Thành viên nhóm
| Thành viên | Vai trò / Đóng góp |
|-------------|--------------------|
| **Võ Minh Nhí** | Backend (API, MongoDB) |
| **Ngô Trần Phước Duy** | Frontend (UI, styles) |
| **Nguyễn Phú Quý** | Kiểm thử, tài liệu |

## 📂 Cấu trúc thư mục
```
nhom19buoi4/
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🌐 Link repo GitHub
[https://github.com/vominhhnhi-gif/nhom19buoi4](https://github.com/vominhhnhi-gif/nhom19buoi4)
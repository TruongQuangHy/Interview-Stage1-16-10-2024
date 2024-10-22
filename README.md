# Interview Stage1 16/10/2024

Đoạn mô tả ngắn gọn về dự án này, mục tiêu hoặc những gì nó làm được.

## Mục Lục

- [Giới thiệu](#giới-thiệu)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [Chi tiết Bài Test](#chi-tiết-bài-test)

## Giới Thiệu

Dự án gồm

- Đăng nhập
- Đăng xuất
- Lấy tất cả user
- Short Token
- Long token
- Phân quyền người dùng
- Làm mới token
  Ngôn ngữ sử dung
- Front end: AngularJs v1.8.2
- Back end: NodeJS v10.18.0
- Testing: Postman
- Database: Mongodb

## Cài Đặt

1. Clone repository:
   ```bash
   git clone https://github.com/TruongQuangHy/Interview-Stage1-16-10-2024.git
   ```
2. Cài đặt các dependencies:
   ```bash
   cd back-end
   npm install
   ```

## Sử Dụng

Chạy lệnh dưới đây để khởi động dự án:

```bash
cd back-end
npm start

cd front-end
live-server

```

## Chi tiết Bài Test

BACK-END

- Câu trúc file
  - Config
  - Controller
  - Middlewares
  - Models
  - Routers
  - index.js
  - .env
- Thư viện sử dung
  - bcrypt: v4.0.1,
  - cookie-parser: v1.4.7,
  - cors: v2.8.5,
  - dotenv: v8.6.0,
  - express: v4.21.1,
  - express-async-handler: v1.1.3,
  - jsonwebtoken: v8.5.1,
  - mongoose: v5.13.22,
  - nodemon: v3.1.7
- Chi tiết file
  - File config gồm những file con
    - File dbConnect.js dùng để gọi database.
    - File jwtToken dùng để tạo token trong đó có hàm tạo token để đăng nhập và một làm để tạo token gửi lên cookies
  - File Controller gồm
    - File userController.js: dùng để xử lý chức năng trên ở phía back end
  - File Middlewares gồm
    - File authMiddleware.js: Dùng để tạo quền truy cập ở những trang ghi login vào có quyền sử dụng và có một số trang có quyền truy cập của admin mới có quyền sử dụng
    - File errorHandler.js: Dùng để xử lý việc việc nếu không có URL nào sẽ trả ra lỗi và nếu trong quá trình xử lý yêu cầu gặp vấn đề sẽ trả ra lỗi
  - File models gồm
    - File userModel.js: Dùng để tạo dữ liệu định nghĩa cấu trúc dữ liệu với đối tượng là người dùng
  - File Routers gồm
    - File authRouter.js: Dùng để định nghĩa các đường dẩn lên quan đến người dùng, quản lý các phương chức thể xử lý thao tác của người dùng
  - File .env: Dùng để lưu một số biến môi trường gồm link database, key tạo token. file này tạo ta nhằm không muốn những thông tin quan trongl cho người khác biết
  - File index.js: dùng để thiết lập máy chủ

FRONT END

- Câu trúc file

  - Controller
  - css
  - services
  - view
  - app.js
  - routers.js
  - index.html

- Thư viện sử dung
  - Angularjs: v1.8.2
  - Angular router: v1.8.2
- Chi tiết file

  - File controller gồm những file con
    - File dashboardController.js: Dùng để quản lý logic cho trang dashboard đảm người dùng đăng nhập mới có quyền cuy cập vào đây
    - File homeController.js: Dùng để quản lý logic cho trang dashboard đảm người dùng đăng nhập mới có quyền cuy cập vào đây
    - File loginController.js: Dùng để quản lý logic cho trang đăng nhập, nó cho phép người dùng đăng nhập và quá trình chuyển hướng sau khi đăng nhâp
  - File css: Dùng để tạo giao diện cho trang web
  - File Services: Dùng để quản lý tất cả các hoạt động liên quan đến người dùng và điều này cho phép controller dể dang tương tác với người dùng
  - File views: Chứa các file html là nơi hiển thị cho người dùng thấy giao diện và chức năng của nó được tưởng tác quan controller
  - File app.js: Dùng để thiết lập cho các chức năng toàn cùng của ứng dụng và cho phép điều hướng trang một cách hiệu quả
  - File router.js: Dùng để điều hướng trong ứng dụng AngularJs. Nó xác định cách mà các URL cụ thể sẽ tương ứng với những trang và controller nào
  - File index.html: Đây là cấu trúc chính của ứng dụng, nó thiết lập nền tảng cho việc hiển thị giao diện người dùng và định tuyến giữa các trang với nhau

- Mô hình hoạt động
  - Đầu tiền khi chạy website người dùng phải đăng nhập mới vào trang home.
  - Khi đăng nhập sẽ tạo ra token và back end sẽ xử lý người dùng xem token vừa tạo có chưa role là admin hay user. Nếu admin thì sẽ được điều hướng qua dashboard và nếu là user thì sẽ điều hướng qua trang home
  - Token được tạo sẽ cho phép người dùng đó có quyền xử dụng tính năng nào của trang web và tính năng không được dùng của trang web
  - Token được tạo sẽ được lưu trong vòng 30 giấy hoặc 30 phút tùy théo back end sử lý. Khi token hết hàng sẽ xóa đi và thay vào đó là một token được tạo khác thay thế vào. Và token dùng để tạo token thay để cho token củ có thời hạn sử dụng là 1 tuần hoặc 1 tháng tùy theo back end sử lý.

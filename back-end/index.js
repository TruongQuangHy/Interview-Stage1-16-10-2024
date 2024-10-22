const express = require("express");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/authRoute");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

// Kết nối cơ sở dữ liệu
dbConnect();

app.use(
  cors({
    origin: ["http://127.0.0.1:8080", "http://localhost:8080"], // Thay đổi theo URL ứng dụng client của bạn
    credentials: true, // Cho phép gửi cookies
  })
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Route
app.use("/api/user", authRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

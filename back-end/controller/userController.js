const { generateToken, generateRefreshToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exits");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra xem người dùng có tồn tại hay không
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(
      findUser._id,
      findUser.role
    ); // Bao gồm role trong refresh token

    await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: refreshToken },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 72 giờ
      secure: true,
      sameSite: "none",
    });

    // Trả về thông tin người dùng bao gồm role
    res.json({
      _id: findUser._id,
      email: findUser.email,
      role: findUser.role, // Thêm role vào phản hồi
      token: generateToken(findUser._id, findUser.role), // Bao gồm role trong token nếu cần
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.sendStatus(204); // Đăng xuất thành công, không cần thêm gì
  }

  // Sửa lại phần này
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "", // Xóa refreshToken khỏi cơ sở dữ liệu
    }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true, // Chỉ dùng secure khi chạy ở production (HTTPS)
    sameSite: "none",
  });
  return res.sendStatus(204);
});
const handlerRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user)
    throw new Error("No Refresh token present in database or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    } else {
      const accessToken = generateToken(user._id);
      res.json({ accessToken });
    }
  });
});

const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  handlerRefreshToken,
  getallUser,
  logout,
};

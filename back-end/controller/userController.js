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
    );

    await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: refreshToken },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });

    res.json({
      _id: findUser._id,
      email: findUser.email,
      role: findUser.role,
      token: generateToken(findUser._id, findUser.role),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new Error("No Refresh Token in Cookies");

  const user = await User.findOne({ refreshToken });

  if (user) {
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" }); // Xóa refreshToken khỏi cơ sở dữ liệu
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true, // Đảm bảo chỉ dùng trong môi trường HTTPS
    sameSite: "none",
  });

  res.sendStatus(204); // Đăng xuất thành công
});

const handlerRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) throw new Error("No Refresh Token in Cookies");

  const user = await User.findOne({ refreshToken });
  if (!user)
    throw new Error("No Refresh token present in database or not matched");

  try {
    const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (user.id !== decoded.id)
      throw new Error("There is something wrong with refresh token");

    const accessToken = generateToken(user._id);
    return res.json({ accessToken });
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
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

const { generateToken, generateRefreshToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Create transporter for sending email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email
const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Verification",
    text: `Enter your OTP: ${otp}. This OTP will expire in 60 seconds.`,
  };

  await transporter.sendMail(mailOptions);
};

// Create new user
const createUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists.");
  }

  const newUser = await User.create({ email, password });
  res.status(201).json(newUser);
});

// User login - only handles OTP
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });

  // Check user and password
  if (!findUser || !(await findUser.isPasswordMatched(password))) {
    throw new Error("Invalid login credentials.");
  }

  // If no OTP, create a new one and send via email
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
  const otpExpires = Date.now() + 60 * 1000; // OTP expires in 60 seconds

  await User.findByIdAndUpdate(findUser._id, { otp, otpExpires });
  await sendVerificationEmail(findUser.email, otp);

  return res.json({
    message: "OTP has been sent to your email. Please check and enter the OTP.",
  });
});

// Verify OTP and generate tokens after successful OTP validation
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found.");
  }

  // Check OTP and expiration
  if (user.otp === otp && user.otpExpires > Date.now()) {
    // Clear OTP after successful verification
    // Generate refresh token and access token after OTP validation
    const refreshToken = generateRefreshToken(user._id, user.role);
    const accessToken = generateToken(user._id, user.role);

    await User.findByIdAndUpdate(user._id, {
      otp: null,
      otpExpires: null,
      refreshToken, // Save refreshToken in the database
    });

    // Store refreshToken in the cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: true,
      sameSite: "none",
    });

    // Return access token after successful OTP validation
    return res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: accessToken, // Return access token
    });
  } else {
    throw new Error("Invalid OTP or OTP has expired.");
  }
});

// User logout
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) throw new Error("No refresh token in cookies.");

  await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.sendStatus(204); // Successfully logged out
});

// Handle refresh token
const handlerRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) throw new Error("No refresh token in cookies.");

  const user = await User.findOne({ refreshToken });
  if (!user)
    throw new Error(
      "No refresh token present in database or it does not match."
    );

  try {
    const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (user.id !== decoded.id)
      throw new Error("There is an issue with the refresh token.");

    const accessToken = generateToken(user._id);
    return res.json({ accessToken });
  } catch (err) {
    throw new Error("Invalid refresh token.");
  }
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    throw new Error("Error fetching users.");
  }
});

// Export the controller functions
module.exports = {
  createUser,
  loginUser,
  handlerRefreshToken,
  getAllUsers,
  logout,
  verifyOtp,
};

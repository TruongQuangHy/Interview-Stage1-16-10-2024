const express = require("express");
const {
  createUser,
  loginUser,
  handlerRefreshToken,
  logout,
  getAllUsers,
  verifyOtp, // Thêm route xác thực email
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/refresh-token", handlerRefreshToken);
router.post("/logout", logout);
router.get("/all-users", authMiddleware, isAdmin, getAllUsers);

module.exports = router;

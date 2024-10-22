const express = require("express");
const {
  createUser,
  loginUser,
  handlerRefreshToken,
  getallUser,
  logout,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/refresh-token", handlerRefreshToken);
router.get("/all-users", authMiddleware, isAdmin, getallUser);

module.exports = router;

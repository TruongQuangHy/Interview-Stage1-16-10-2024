const jwt = require("jsonwebtoken");
const { models } = require("mongoose");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30s" });
};

const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1w" });
};

module.exports = { generateToken, generateRefreshToken };

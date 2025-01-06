const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const expiresIn = 3600;
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { generateToken, decodeToken };

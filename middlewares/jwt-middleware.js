const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: 401,
      message: "Authorization header is missing",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: 401, message: "Token is missing", data: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: 401, message: "Invalid or expired token", data: null });
  }
};

module.exports = jwtAuthMiddleware;

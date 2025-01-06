const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /auth/ve/login:
 *   post:
 *     summary: Login to access resources of the Vechain Interaction Server
 *     description: Login to access resources of the Vechain Interaction Server
 *     tags:
 *       - VeChain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username
 *               password:
 *                 type: string
 *                 description: Password
 *
 *     responses:
 *       200:
 *         description: Signing in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: HTTPS status code
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Signing in successfully"
 *                 token:
 *                   type: string
 *                   description: The token to access resources
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: integer
 *                   description: HTTPSS status code
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: string
 *                   description: Detailed error description
 */

router.post("/auth/ve/login", async (req, res) => {
  const { generateToken } = require("../helpers/jwt-helper");
  console.log(process.env.ACCOUNT);
  if (
    req.body.username !== `${process.env.ACCOUNT}` ||
    req.body.password !== `${process.env.PASSWORD}`
  ) {
    return res.status(401).json({
      status: 400,
      message: "Invalid username or password",
      data: null,
    });
  }
  const payload = { username: "admin", role: "admin" };
  const token = generateToken(payload);
  res.json({ status: 200, message: "Signing in successfully.", data: token });
});
module.exports = router;

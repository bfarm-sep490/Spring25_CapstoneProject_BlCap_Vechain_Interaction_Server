const express = require("express");
const {
  createTransaction,
  getBlockByTxId,
  decodeFarmData,
} = require("../controllers/farm-controller");
const jwtAuthMiddleware = require("../middlewares/jwt-middleware");

const router = express.Router();

/**
 * @swagger
 * /vechain/farm/register:
 *   post:
 *     summary: Register a farm transaction on VeChain
 *     description: Creates a transaction on the VeChain blockchain for farm registration.
 *     tags:
 *       - VeChain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the farm
 *                 example: "My Organic Farm"
 *               location:
 *                 type: string
 *                 description: Physical location or address of the farm
 *                 example: "123 Farm Lane, Countryside"
 *               certifications:
 *                 type: string
 *                 description: Certifications or qualifications of the farm
 *                 example: "Organic, FDA Approved"
 *     responses:
 *       200:
 *         description: Transaction successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Transaction submitted"
 *                 txId:
 *                   type: string
 *                   description: The ID of the transaction on the VeChain blockchain
 *                   example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 500
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Transaction failed due to an unexpected error."
 *                 error:
 *                   type: string
 *                   description: Detailed error description
 *                   example: "Insufficient funds to cover gas fees"
 */

router.post("/vechain/farm/register", jwtAuthMiddleware, async (req, res) => {
  try {
    const result = await createTransaction(req, res);

    res.status(200).json({
      status: 200,
      message: result.message || "Transaction submitted successfully",
      txId: result.txId || null,
    });
  } catch (error) {
    console.error("Error in /vechain/farm-register:", error);

    res.status(500).json({
      status: 500,
      message: "Transaction failed",
      error: error.message,
    });
  }
});
/**
 * @swagger
 * /vechain/farm/{id}:
 *   get:
 *     summary: Get a farm transaction on VeChain
 *     description: Get a transaction on the VeChain blockchain for farm transaction using the provided farm ID.
 *     tags:
 *       - VeChain
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the farm to be get
 *         schema:
 *           type: string
 *           example: "0x013ad123sda2112312daaeezaaa0x013ad123sda2112312daaeezaaa"
 *     responses:
 *       200:
 *         description: Transaction successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Transaction submitted"
 *                 data:
 *                   type: object
 *                   description: object containing farm data
 *
 *       400:
 *         description: Bad request - Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 400
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Invalid farm ID provided."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 500
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Transaction failed due to an unexpected error."
 *                 error:
 *                   type: string
 *                   description: Detailed error description
 *                   example: "Insufficient funds to cover gas fees"
 */

router.get("/vechain/farm/:id", async (req, res) => {
  try {
    const txId = req.params.id;
    const result = await decodeFarmData(req, res);
    res.status(200).json({
      status: 200,
      message: result?.message || "Transaction gotten successfully",
      data: result?.data || null,
    });
  } catch (error) {
    console.error("Error in /vechain/farm/:id", error);

    res.status(500).json({
      status: 500,
      message: "Transaction gotten failed",
      error: error.message,
    });
  }
});
/**
 * @swagger
 * /vechain/transaction/{id}:
 *   get:
 *     summary: Get a detail transaction on VeChain
 *     description: Get a detail transaction on the VeChain blockchain.
 *     tags:
 *       - VeChain
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the farm to be get
 *         schema:
 *           type: string
 *           example: "0x013ad123sda2112312daaeezaaa0x013ad123sda2112312daaeezaaa"
 *     responses:
 *       200:
 *         description: Transaction successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Transaction submitted"
 *                 data:
 *                   type: object
 *                   description: object containing transaction and block data
 *       400:
 *         description: Bad request - Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 400
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Invalid farm ID provided."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 500
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Transaction failed due to an unexpected error."
 *                 error:
 *                   type: string
 *                   description: Detailed error description
 *                   example: "Insufficient funds to cover gas fees"
 */
router.get("/vechain/transaction/:id", async (req, res) => {
  try {
    const txId = req.params.id;
    const result = await getBlockByTxId(req, res);
    res.status(200).json({
      status: 200,
      message: result?.message || "Transaction gotten successfully",
      data: result?.data || null,
    });
  } catch (error) {
    console.error("Error in /vechain/farm/:id", error);

    res.status(500).json({
      status: 500,
      message: "Transaction gotten failed",
      error: error.message,
    });
  }
});
module.exports = router;

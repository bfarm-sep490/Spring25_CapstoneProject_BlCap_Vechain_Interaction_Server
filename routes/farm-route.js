const express = require("express");
const {
  getContractTransactions,
  createdPlan,
  createdTask,
} = require("../controllers/farm-controller");
const jwtAuthMiddleware = require("../middlewares/jwt-middleware");

const router = express.Router();

/**
 * @swagger
 * /vechain/contracts/plans:
 *   post:
 *     summary: Create a new plan on Vechain
 *     tags: [Farm]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planName:
 *                 type: string
 *                 example: "My Farm Plan"
 *     responses:
 *       200:
 *         description: Transaction submitted successfully
 *       500:
 *         description: Transaction failed
 */
router.post("/vechain/contracts/plans", async (req, res) => {
  try {
    const { status, message, data } = await createdPlan(req, res);

    res.status(200).json({
      status: 200,
      message: message || "Transaction submitted successfully",
      txId: data || null,
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
 * /vechain/contracts/{contractAddress}/task:
 *   post:
 *     summary: Create a new task for a contract
 *     tags: [Farm]
 *     parameters:
 *       - in: path
 *         name: contractAddress
 *         required: true
 *         schema:
 *           type: string
 *         description: Address of the contract
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskName:
 *                 type: string
 *                 example: "Plant Trees"
 *     responses:
 *       200:
 *         description: Transaction submitted successfully
 *       500:
 *         description: Transaction failed
 */
router.post("/vechain/contracts/:contractAddress/task", async (req, res) => {
  try {
    const { status, message, data } = await createdTask(req, res);

    res.status(200).json({
      status: 200,
      message: message || "Transaction submitted successfully",
      txId: data || null,
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
 * /vechain/contracts/{contractAddress}/transactions:
 *   get:
 *     summary: Get transactions of a specific contract
 *     tags: [Farm]
 *     parameters:
 *       - in: path
 *         name: contractAddress
 *         required: true
 *         schema:
 *           type: string
 *         description: Contract address to fetch transactions for
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       txId:
 *                         type: string
 *                       status:
 *                         type: string
 *       500:
 *         description: Error retrieving transactions
 */
router.get("/vechain/contracts/plans/:contractAddress", async (req, res) => {
  try {
    const result = await getContractTransactions(req, res);
    console.log("result", result);
    res.status(200).json({
      status: 200,
      message: result?.message || "Transaction gotten successfully",
      data: result?.data || null,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Transaction gotten failed",
      error: error.message,
    });
  }
});

module.exports = router;
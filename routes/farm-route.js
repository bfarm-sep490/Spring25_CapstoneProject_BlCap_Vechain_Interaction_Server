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
 *               _planId:
 *                 type: integer
 *                 example: 1
 *               _plantId:
 *                 type: integer
 *                 example: 101
 *               _yieldId:
 *                 type: integer
 *                 example: 201
 *               _expertId:
 *                 type: integer
 *                 example: 301
 *               _planName:
 *                 type: string
 *                 example: "Summer Farm Plan"
 *               _startDate:
 *                 type: integer
 *                 description: "Timestamp hoặc byteint"
 *                 example: 1712544000
 *               _endDate:
 *                 type: integer
 *                 description: "Timestamp hoặc byteint"
 *                 example: 1715136000
 *               _estimatedProduct:
 *                 type: integer
 *                 example: 1000
 *               _estimatedUnit:
 *                 type: string
 *                 example: "Kg"
 *               _status:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Transaction submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Transaction submitted successfully
 *                 txId:
 *                   type: string
 *                   example: "0xabc123..."
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
 *             required:
 *               - _taskId
 *               - _taskType
 *               - _status
 *               - _dataHash
 *             properties:
 *               _taskId:
 *                 type: integer
 *                 example: 1
 *               _taskType:
 *                 type: string
 *                 example: "Plant"
 *               _status:
 *                 type: string
 *                 example: "Pending"
 *               _dataHash:
 *                 type: string
 *                 example: "0xabc123...hash"
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
 * /vechain/contracts/plans/{contractAddress}:
 *   get:
 *     summary: Get transaction history of a specific contract
 *     tags: [Farm]
 *     parameters:
 *       - in: path
 *         name: contractAddress
 *         required: true
 *         schema:
 *           type: string
 *         description: The address of the contract to fetch transactions
 *     responses:
 *       200:
 *         description: Successfully retrieved transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Transaction gotten successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       txId:
 *                         type: string
 *                         example: "0x123abc..."
 *                       status:
 *                         type: string
 *                         example: "Success"
 *       500:
 *         description: Failed to retrieve transactions
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
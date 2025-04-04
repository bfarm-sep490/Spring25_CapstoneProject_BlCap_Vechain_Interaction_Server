const express = require("express");
const {
  getContractTransactions,
  createdPlan,
  createdTask,
} = require("../controllers/farm-controller");
const jwtAuthMiddleware = require("../middlewares/jwt-middleware");

const router = express.Router();

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

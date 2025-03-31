const express = require("express");
const {
  createTransaction,
  getBlockByTxId,
  decodeFarmData,
} = require("../controllers/farm-controller");
const jwtAuthMiddleware = require("../middlewares/jwt-middleware");

const router = express.Router();

router.post("/vechain/farm/register", async (req, res) => {
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

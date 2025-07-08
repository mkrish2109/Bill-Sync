const express = require("express");
const router = express.Router();
const {
  getAllFabricsForBuyer,
  deleteFabric,
} = require("../controllers/fabric/buyerController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/fabrics", authMiddleware, getAllFabricsForBuyer);
router.delete("/fabrics/:id", authMiddleware, deleteFabric);

module.exports = router;

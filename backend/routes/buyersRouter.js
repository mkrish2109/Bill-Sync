const express = require("express");
const router = express.Router();
const Buyer = require("../models/Buyer");
const Worker = require("../models/Worker");
const {
  getAllFabricsForBuyer,
  deleteFabric,
  updateFabric,
} = require("../controllers/fabric/buyerController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", async (req, res) => {
  const buyer = await Buyer.create(req.body);
  res.json(buyer);
});

router.get("/", async (req, res) => {
  const buyers = await Worker.find();
  res.json(buyers);
});

router.get("/fabrics", authMiddleware, getAllFabricsForBuyer);
router.delete("/fabrics/:id", authMiddleware, deleteFabric);

module.exports = router;

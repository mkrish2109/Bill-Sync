const express = require("express");
const fabricRouter = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { updateFabric } = require("../controllers/fabric/buyerController");
const {
  getFabricWithHistory,
  getFabricById,
  getAllFabrics,
} = require("../controllers/fabric/commonController");
const buyerController = require("../controllers/fabric/buyerController");

fabricRouter.get("/", authMiddleware, getAllFabrics);
// Get fabric by ID with history
fabricRouter.get("/:id", authMiddleware, getFabricWithHistory);

// Get fabric by ID (simple version)
fabricRouter.get("/edit/:id", authMiddleware, getFabricById);

// Create new fabric
fabricRouter.post("/", authMiddleware, buyerController.createFabric);

// Update fabric
fabricRouter.put("/:id", authMiddleware, updateFabric);

module.exports = fabricRouter;

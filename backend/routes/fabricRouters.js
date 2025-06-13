const express = require("express");
const fabricRouter = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { updateFabric } = require("../controllers/fabric/buyerController");
const {
  getFabricWithHistory,
  getFabricById,
  getAllFabrics,
} = require("../controllers/fabric/commonController");
const buyerController = require("../controllers/fabric/buyerController");

fabricRouter.get("/all", authMiddleware, getAllFabrics);
fabricRouter.get("/:id", authMiddleware, getFabricWithHistory);
fabricRouter.get("/test/:id", authMiddleware, getFabricById);
fabricRouter.put("/:id", authMiddleware, updateFabric);
fabricRouter.post("/", authMiddleware, buyerController.createFabric);

module.exports = fabricRouter;

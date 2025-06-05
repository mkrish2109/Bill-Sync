const express = require("express");
const fabricRouter = express.Router();
const { getAllFabrics, createFabric } = require("../controllers/fabricController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { updateFabric } = require("../controllers/fabric/buyerController");
const { getFabricWithHistory, getFabricById } = require("../controllers/fabric/commonController");
const buyerController = require("../controllers/fabric/buyerController");

fabricRouter.get("/", authMiddleware, getAllFabrics);
fabricRouter.get("/:id",authMiddleware,getFabricWithHistory);
fabricRouter.get("/test/:id",authMiddleware,getFabricById);
fabricRouter.put('/:id',authMiddleware, updateFabric);
fabricRouter.post("/",authMiddleware, buyerController.createFabric);




module.exports = fabricRouter;
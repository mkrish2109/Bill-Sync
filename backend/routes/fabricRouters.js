const express = require("express");
const fabricRouter = express.Router();
const { getAllFabrics, createFabric } = require("../controllers/fabricController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { updateFabric } = require("../controllers/fabric/buyerController");
const { getFabricWithHistory } = require("../controllers/fabric/commonController");

fabricRouter.get("/", authMiddleware, getAllFabrics);
fabricRouter.get("/:id",authMiddleware,getFabricWithHistory);
fabricRouter.put('/:id',authMiddleware, updateFabric);
fabricRouter.post("/",authMiddleware, createFabric);




module.exports = fabricRouter;
// routes/requestRoutes.js

const express = require("express");
const router = express.Router();
const availableUsersController = require("../controllers/availableUsersController");
const requestController = require("../controllers/requestController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Get available users
router.get(
  "/available/workers",
  authMiddleware,
  availableUsersController.getAvailableWorkers
);

// Request management
router.get("/", authMiddleware, requestController.getUserRequests);
router.post("/", authMiddleware, requestController.sendRequest);
router.put(
  "/:requestId/accept",
  authMiddleware,
  requestController.acceptRequest
);
router.put(
  "/:requestId/reject",
  authMiddleware,
  requestController.rejectRequest
);
router.put(
  "/:requestId/cancel",
  authMiddleware,
  requestController.cancelRequest
);
router.get("/connections", authMiddleware, requestController.getConnectedUsers);

module.exports = router;

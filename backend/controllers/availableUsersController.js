// controllers/availableUsersController.js

const Worker = require("../models/Worker");
const Buyer = require("../models/Buyer");
const Request = require("../models/Request");
const { sendDataResponse, sendErrorResponse } = require("../utils/serverUtils");

// Get available workers for a buyer
exports.getAvailableWorkers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const buyerId = req.user.userId;

    const buyer = await Buyer.findById(buyerId).populate("sentRequests");
    const interactedWorkerIds = [
      ...buyer.sentRequests.map((req) => req.receiver),
    ];

    const availableWorkers = await Worker.find({
      _id: { $nin: interactedWorkerIds },
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-receivedRequests"); // Exclude heavy fields

    const total = await Worker.countDocuments({
      _id: { $nin: interactedWorkerIds },
    });

    sendDataResponse(res, {
      data: availableWorkers,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

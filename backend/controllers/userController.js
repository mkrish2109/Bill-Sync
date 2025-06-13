const User = require("../models/User");
const Address = require("../models/Address");
const { validationResult } = require("express-validator");
const {
  sendSuccessResponse,
  sendErrorResponse,
  sendDataResponse,
} = require("../utils/serverUtils");
const Worker = require("../models/Worker");
const Buyer = require("../models/Buyer");
const Request = require("../models/Request");
const FabricAssignment = require("../models/FabricAssignment");
const Fabric = require("../models/Fabric");

// Admin Functions
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    sendDataResponse(res, users);
  } catch (err) {
    console.error(err.message);
    sendErrorResponse(res, "Server error");
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    let additionalData = null;
    if (user.role === "worker") {
      additionalData = await Worker.findOne({ userId: req.params.userId });
    } else if (user.role === "buyer") {
      additionalData = await Buyer.findOne({
        userId: req.params.userId,
      }).populate("assignedFabrics");
    }

    sendDataResponse(res, { ...user.toObject(), additionalData });
  } catch (err) {
    console.error(err.message);
    sendErrorResponse(res, "Server error");
  }
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    if (!["admin", "buyer", "worker"].includes(role)) {
      return sendErrorResponse(res, "Invalid role", 400);
    }

    // If changing from worker/buyer to another role, remove the specific profile
    if (user.role === "worker" && role !== "worker") {
      await Worker.findOneAndDelete({ userId: req.params.userId });
    } else if (user.role === "buyer" && role !== "buyer") {
      await Buyer.findOneAndDelete({ userId: req.params.userId });
    }

    user.role = role;
    await user.save();

    sendDataResponse(res, {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    sendErrorResponse(res, "Server error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // First get the user to check their role
    const user = await User.findById(userId);
    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    // Check if user has any active fabrics or assignments
    let hasActiveData = false;
    if (user.role === "worker") {
      const worker = await Worker.findOne({ userId });
      if (worker) {
        // Check for active fabric assignments
        const activeAssignments = await FabricAssignment.find({
          workerId: worker._id,
          status: { $in: ["pending", "in_progress"] },
        });
        hasActiveData = activeAssignments.length > 0;
      }
    } else if (user.role === "buyer") {
      const buyer = await Buyer.findOne({ userId });
      if (buyer) {
        // Check for active fabrics
        const activeFabrics = await Fabric.find({
          buyerId: buyer._id,
          status: { $in: ["active", "in_progress"] },
        });
        hasActiveData = activeFabrics.length > 0;
      }
    }

    if (hasActiveData) {
      return sendErrorResponse(
        res,
        "Cannot disable user with active fabrics or assignments",
        400
      );
    }

    // Disable role-specific profile
    if (user.role === "worker") {
      const worker = await Worker.findOne({ userId });
      if (worker) {
        // Remove worker from all buyers' connectedWorkers arrays
        await Buyer.updateMany(
          { connectedWorkers: worker._id },
          { $pull: { connectedWorkers: worker._id } }
        );
        // Update worker status
        await Worker.findByIdAndUpdate(worker._id, {
          isActive: false,
          updatedAt: Date.now(),
        });
      }
    } else if (user.role === "buyer") {
      const buyer = await Buyer.findOne({ userId });
      if (buyer) {
        // Remove buyer from all workers' connectedBuyers arrays
        await Worker.updateMany(
          { connectedBuyers: buyer._id },
          { $pull: { connectedBuyers: buyer._id } }
        );
        // Update buyer status
        await Buyer.findByIdAndUpdate(buyer._id, {
          isActive: false,
          updatedAt: Date.now(),
        });
      }
    }

    // Update all requests to cancelled status
    await Request.updateMany(
      {
        $or: [{ sender: userId }, { receiver: userId }],
        status: "pending",
      },
      { status: "cancelled" }
    );

    // Disable the user
    await User.findByIdAndUpdate(userId, {
      isActive: false,
      updatedAt: Date.now(),
    });

    sendSuccessResponse(res, "User has been disabled successfully");
  } catch (err) {
    console.error("Error disabling user:", err);
    sendErrorResponse(res, "Server error");
  }
};

// User Profile Functions
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "fname lname email phone bio role"
    );
    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    const address = await Address.findOne({
      userId: req.user.userId,
      isDefault: true,
    });

    let additionalData = null;
    if (user.role === "worker") {
      additionalData = await Worker.findOne({ userId: req.user.userId });
    } else if (user.role === "buyer") {
      additionalData = await Buyer.findOne({
        userId: req.user.userId,
      }).populate("assignedFabrics");
    }

    sendDataResponse(res, { user, address, additionalData });
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, "Server error");
  }
};

const updateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, "Validation error", 400);
  }

  try {
    const { fname, lname, phone, bio } = req.body;
    const userId = req.user.userId;

    // First get the user to check their role
    const user = await User.findById(userId);
    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    // Update user profile with non-sensitive data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fname, lname, phone, bio },
      { new: true }
    ).select("fname lname email phone bio role"); // Only select non-sensitive fields

    // Update the corresponding role-specific profile
    if (user.role === "worker") {
      await Worker.findOneAndUpdate(
        { userId },
        {
          name: `${fname} ${lname}`,
          contact: phone,
        },
        { new: true }
      ).select("name contact"); // Only select non-sensitive fields
    } else if (user.role === "buyer") {
      await Buyer.findOneAndUpdate(
        { userId },
        {
          name: `${fname} ${lname}`,
          contact: phone,
        },
        { new: true }
      ).select("name contact"); // Only select non-sensitive fields
    }

    sendDataResponse(res, { user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    sendErrorResponse(res, "Server error");
  }
};

const updateAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, "Validation error", 400);
  }

  try {
    const { country, state, city, postalCode, addressLine1, addressLine2 } =
      req.body;

    let address = await Address.findOne({
      userId: req.user.userId,
      isDefault: true,
    });

    if (address) {
      address = await Address.findByIdAndUpdate(
        address._id,
        { country, state, city, postalCode, addressLine1, addressLine2 },
        { new: true }
      );
    } else {
      address = new Address({
        userId: req.user.userId,
        country,
        state,
        city,
        postalCode,
        addressLine1,
        addressLine2,
        isDefault: true,
      });
      await address.save();
    }

    sendDataResponse(res, address);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, "Server error");
  }
};

module.exports = {
  // Admin functions
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,

  // User profile functions
  getUserProfile,
  updateUserProfile,
  updateAddress,
};

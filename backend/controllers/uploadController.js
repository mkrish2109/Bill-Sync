const { upload } = require("../config/upload");
const path = require("path");
const fs = require("fs");
const Fabric = require("../models/Fabric");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");

const UPLOAD_TARGET = process.env.UPLOAD_TARGET || "local";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

// Upload single image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    let uploadResult;

    if (UPLOAD_TARGET === "cloudinary") {
      // Upload to Cloudinary
      uploadResult = await uploadToCloudinary(req.file.path);

      // Clean up local file after successful upload
      fs.unlinkSync(req.file.path);

      return res.json({
        success: true,
        imageUrl: uploadResult.secure_url,
        filename: uploadResult.public_id,
        storage: "cloudinary",
      });
    } else {
      // Local upload
      const imageUrl = `${SERVER_URL}/api/upload/uploads/${req.file.filename}`;

      return res.json({
        success: true,
        imageUrl,
        filename: req.file.filename,
        storage: "local",
      });
    }
  } catch (error) {
    // Clean up if anything fails
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Failed to clean up file:", cleanupError);
      }
    }

    console.error("Upload error:", error);
    res.status(500).json({
      error: "Failed to upload image",
      ...(process.env.NODE_ENV === "development" && { details: error.message }),
    });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    // Update DB to remove references to this image
    const updateResult = await Fabric.updateMany(
      { imageUrl: { $regex: `${filename}$`, $options: "i" } },
      { $set: { imageUrl: "" } }
    );

    if (UPLOAD_TARGET === "cloudinary") {
      // Delete from Cloudinary
      const publicId = filename.replace(/\.[^/.]+$/, ""); // removes extension
      const result = await deleteFromCloudinary(publicId);
      console.log("Cloudinary delete result:", result);
      if (result.result !== "ok" && result.result !== "not found") {
        console.warn("Cloudinary deletion warning:", result);
      }
    } else {
      // Local delete
      const filePath = path.join(__dirname, "../uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File ${filename} not found during deletion`);
      }
    }

    res.json({
      success: true,
      message: "Image deleted successfully",
      dbUpdated: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete image",
      ...(process.env.NODE_ENV === "development" && { details: error.message }),
    });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};

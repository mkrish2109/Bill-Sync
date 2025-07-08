const express = require("express");
const uploadRouter = express.Router();
const { upload } = require("../config/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { uploadImage, deleteImage } = require("../controllers/uploadController");
const path = require("path");

const UPLOAD_TARGET = process.env.UPLOAD_TARGET || "local";

// Serve static files from uploads directory only if using local storage
if (UPLOAD_TARGET === "local" || UPLOAD_TARGET === "local-dev") {
  uploadRouter.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
  );
}

// Upload single image
uploadRouter.post("/", authMiddleware, upload.single("image"), uploadImage);

// Delete image
uploadRouter.delete("/:filename", authMiddleware, deleteImage);

module.exports = uploadRouter;

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(filePath) {
  return cloudinary.uploader.upload(filePath, {
    folder: "uploads",
    resource_type: "image",
    unique_filename: true,
    format: "webp",
  });
}

async function deleteFromCloudinary(fileNameWithExt) {
  if (!fileNameWithExt) {
    throw new Error("File name is required to delete from Cloudinary");
  }

  // 🧠 Remove extension and prepend folder
  const fileName = fileNameWithExt.split(".")[0]; // e.g., "h7xvu0qx0tudk35i6jy7"
  const publicId = `uploads/${fileName}`; // final public_id

  // console.log("Deleting from Cloudinary:", publicId);

  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    throw error;
  }
}

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};

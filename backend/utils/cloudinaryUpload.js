<<<<<<< HEAD
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (buffer, filename) => {
  // Generate a unique filename: timestamp-random-originalname
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const uniqueFilename = `${uniqueSuffix}-${filename}`;
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { public_id: `bill-sync/${uniqueFilename}`, resource_type: "image", format: "webp" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

module.exports = uploadToCloudinary;
=======
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

  console.log("Deleting from Cloudinary:", publicId);

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
>>>>>>> 51216b8 (fix: unify image deletion for local and Cloudinary, and improve frontend delete logic)

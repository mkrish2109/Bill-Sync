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

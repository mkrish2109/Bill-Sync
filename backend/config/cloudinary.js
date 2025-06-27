const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your actual cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Replace with your actual API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your actual secret
});

module.exports = cloudinary;

const express = require('express');
const router = express.Router();
const { upload } = require('../config/upload');
const { authMiddleware } = require('../middleware/authMiddleware');
const path = require('path');
const fs = require('fs');
const Fabric = require('../models/Fabric');

// Serve static files from uploads directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Helper function to delete file
const deleteFile = (filename) => {
  const filePath = path.join(__dirname, '../uploads', filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
};

// Upload single image
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Return the full URL to the uploaded file
    const imageUrl = `http://localhost:5000/api/upload/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename // Send filename for potential deletion
    });
  } catch (error) {
    // If there's an error, delete the uploaded file if it exists
    if (req.file) {
      deleteFile(req.file.filename);
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image
router.delete('/:filename', authMiddleware, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);

      // Find and update all fabrics that have this image URL
      await Fabric.updateMany(
        { imageUrl: { $regex: filename } },
        { $set: { imageUrl: '' } }
      );

      res.json({ 
        success: true, 
        message: 'Image deleted successfully' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'Image not found' 
      });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete image' 
    });
  }
});

module.exports = router; 
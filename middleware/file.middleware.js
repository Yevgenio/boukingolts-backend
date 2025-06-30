const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Generate a unique suffix for the filename
    const ext = path.extname(file.originalname); // Get the file extension
    const shortName = path.basename(file.originalname, ext).slice(0, 10).replace(/\s+/g, '-'); // limit to 10 characters, replace spaces with hyphens
    const base = `${uniqueSuffix}-${shortName}${ext}`; // Create the final filename with the unique suffix and extension
    cb(null, base); // Use the base as the filename
  },
});

// Allowed file extensions for images
// Note: Ensure the 'uploads' directory exists or create it before running the server
const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp']; // Allowed extensions 
const upload = multer({
  storage, // Use the configured storage
  fileFilter: (req, file, cb) => { // Validate file type
    const ext = path.extname(file.originalname).toLowerCase(); // Get the file extension
    if (file.mimetype.startsWith('image/') && allowedExts.includes(ext)) { // Check if it's an image and has a valid extension
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only supported image formats are allowed'), false); // Reject the file
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
}).fields([{ name: 'images', maxCount: 30 }]);  // Maximum 30 images per request

// 👇 Middleware to process uploaded images
const processUploadedImages = async (req, res, next) => {
  if (!req.files?.images) return next(); // No images uploaded, skip processing

  try {
    req.processedImages = await Promise.all( 
      req.files.images.map(async (file) => { 
        const originalFilename = file.filename; // Saved by multer
        const originalPath = path.join(__dirname, '../uploads', originalFilename); // Full path to the original image

        const ext = path.extname(originalFilename); // Get the file extension
        const base = originalFilename.slice(0, -ext.length); // Remove extension
        const thumbnailFilename = `${base}-th${ext}`; // Create thumbnail filename
        const thumbnailPath = path.join(__dirname, '../uploads', thumbnailFilename); // Full path to the thumbnail

        const metadata = await sharp(originalPath) // Get image metadata
          .resize({ width: 400 }) // Resize to a maximum width of 400px
          .toFile(thumbnailPath); // Create the thumbnail

        // Return processed image info
        return {  
          url: originalFilename,
          thumbnail: thumbnailFilename,
          width: metadata.width,
          height: metadata.height,
        };
      })
    );

    next(); // Continue to the next middleware or route handler
  } catch (err) {
    console.error('Image processing failed:', err.message);
    return res.status(500).json({ message: 'Image processing failed', error: err.message });
  }
};

module.exports = {
  upload,
  processUploadedImages,
};

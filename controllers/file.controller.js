const path = require('path');
const fs = require('fs');

// Serve static files with a fallback to default.png
exports.serveFile = (req, res) => {
  const fileName = req.params.file;
  const filePath = path.join(__dirname, '..', 'uploads', fileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // Serve default.png if the requested file doesn't exist
    const defaultPath = path.join(__dirname, '..', 'uploads', 'default.jpg');
    res.sendFile(defaultPath);
  }
};

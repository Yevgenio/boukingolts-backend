const Image = require('../models/image.model');

exports.deleteImageById = async (req, res) => {
  try {
    const deletedImage = await Image.findByIdAndDelete(req.params.id);
    if (!deletedImage) return res.status(404).json({ message: 'Image not found' });
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
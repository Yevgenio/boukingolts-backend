const ContentBlock = require('../models/contentBlock.model');

// Populate helper for images stored inside the value object
const populateImages = { path: 'value.images', model: 'Image' };

exports.getContentByName = async (req, res) => {
  try {
    const block = await ContentBlock
      .findOne({ name: req.params.name })
      .populate(populateImages);
    if (!block) return res.status(404).json({ message: 'Not found' });
    res.json(block.value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setContentByName = async (req, res) => {
  try {
    const value = { ...req.body };
    if (Array.isArray(req.processedImages)) {
      value.images = req.processedImages;
    }

    const updated = await ContentBlock.findOneAndUpdate(
      { name: req.params.name },
      { value },
      { upsert: true, new: true }
    ).populate(populateImages);

    res.json(updated.value);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllContent = async (req, res) => {
  try {
    const blocks = await ContentBlock.find().populate(populateImages);
    res.json(blocks.map((b) => ({ name: b.name, value: b.value })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
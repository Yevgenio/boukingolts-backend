const ContentBlock = require('../models/contentBlock.model');

exports.getContentByName = async (req, res) => {
  try {
    const block = await ContentBlock.findOne({ name: req.params.name });
    if (!block) return res.status(404).json({ message: 'Not found' });
    res.json(block.value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setContentByName = async (req, res) => {
  try {
    const updated = await ContentBlock.findOneAndUpdate(
      { name: req.params.name },
      { value: req.body },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllContent = async (req, res) => {
  try {
    const blocks = await ContentBlock.find();
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
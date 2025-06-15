const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ContentBlock', contentBlockSchema);
// This model defines a ContentBlock schema with a unique name and a value that can be of any type.
// The timestamps option automatically adds createdAt and updatedAt fields to the schema.
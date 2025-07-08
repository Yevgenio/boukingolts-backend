const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, default: "-"},
  description: { type: String, default: "-" },
  category: { type: String, default: "General" },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
});

module.exports = mongoose.model('Product', productSchema);

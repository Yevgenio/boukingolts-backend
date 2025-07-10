const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, default: "-"},
  description: { type: String, default: "-" },
  category: { type: String, default: "General" },
  rank: { type: Number, default: 0 },
  featured: { type: Number, default: 0 },
  tags: [{ type: String }],
  dimensions: [{ type: String }],
  year: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  salePercent: { type: Number, default: 0 },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
});

module.exports = mongoose.model('Product', productSchema);

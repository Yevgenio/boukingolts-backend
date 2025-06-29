const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  width: Number,
  height: Number,
});

const productSchema = new mongoose.Schema({
  name: { type: String, default: "-"},
  description: { type: String, default: "-" },
  category: { type: String, default: "General" },
  images: [imageSchema],
  createdAt: { type: Date, default: Date.now }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // User field
});

module.exports = mongoose.model('Product', productSchema);



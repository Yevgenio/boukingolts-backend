const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "כללי" },
  images: [{
    url: { type: String},
  }],
  imagePath: {type: String, default: "default"},
  barcodePath: {type: String, default: "default"},
  stock: { type: Number, default: -1 },
  startsAt: { type: Date, default: Date.now }, 
  endsAt: { type: Date, default: null }, 
  createdAt: { type: Date, default: Date.now }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // User field
});

module.exports = mongoose.model('Product', productSchema);



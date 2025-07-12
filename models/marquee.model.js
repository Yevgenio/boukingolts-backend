const mongoose = require('mongoose');

const marqueeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

module.exports = mongoose.model('Marquee', marqueeSchema);
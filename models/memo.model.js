const mongoose = require('mongoose');

const memoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['product', 'event', 'external', 'blog'], required: true }, // Type of memo
  targetId: { type: String, default: null }, // Stores productId, eventId, or null for external/blog
  externalLink: { type: String, default: null }, // Optional external URL
  immediateRedirect: { type: Boolean, default: false }, // Determines if user is redirected immediately
  imagePath: { type: String, default: "default" },
  startsAt: { type: Date, default: Date.now },
  endsAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Memo', memoSchema);

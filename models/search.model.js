const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  user: String,
  ip: String,
  result: String,
  createdAt: { type: Date, default: Date.now },
});

// Add a text index to enable full-text search
searchSchema.index({ 
  user: 'text', 
  ip: 'text', 
  prompt: 'text' 
});

module.exports = mongoose.model('Search', searchSchema);
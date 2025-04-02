const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    method: String,
    url: String,
    ip: String, // Store IP address
    params: Object,
    query: Object,
    body: Object,
    status: Number,
    responseTime: String,
});

module.exports = mongoose.model('Log', logSchema);

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const imageSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    width: Number,
    height: Number,
    createdAt: { type: Date, default: Date.now },
});

function removeFiles(doc) {
    if (!doc) return;
    const basePath = path.join(__dirname, '..', 'uploads');
    try { fs.unlinkSync(path.join(basePath, doc.url)); } catch (err) { /* ignore */ }
    try { fs.unlinkSync(path.join(basePath, doc.thumbnail)); } catch (err) { /* ignore */ }
}

imageSchema.post('findOneAndDelete', function(doc) {
    removeFiles(doc); 
});

imageSchema.pre('deleteMany', async function(next) {
    const docs = await this.model.find(this.getFilter());
    docs.forEach(removeFiles);
    next();
});

module.exports = mongoose.model('Image', imageSchema);
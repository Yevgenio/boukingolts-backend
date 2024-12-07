const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  link: String,
  category: String,
  imagePath: {type: String, default: "default"},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);

// {
//   "name": "Rose Bouquet",
//   "description": "A beautiful bouquet of freshly picked roses.",
//   "price": 29.99,
//   "category": "Bouquets",
//   "imageUrl": "https://example.com/images/rose-bouquet.jpg",
//   "stock": 20,
//   "createdAt": "2024-09-12T12:00:00Z"
// }
// {
//   "name": "Tulip Arrangement",
//   "description": "A stunning arrangement of assorted tulips.",
//   "price": 19.99,
//   "category": "Arrangements",
//   "imageUrl": "https://example.com/images/tulip-arrangement.jpg",
//   "stock": 15,
//   "createdAt": "2024-09-10T10:00:00Z"
// }
// {
//   "name": "Orchid Plant",
//   "description": "A single elegant orchid in a decorative pot.",
//   "price": 24.99,
//   "category": "Plants",
//   "imageUrl": "https://example.com/images/orchid-plant.jpg",
//   "stock": 10,
//   "createdAt": "2024-09-08T09:00:00Z"
// }
// {
//   "name": "Sunflower Bundle",
//   "description": "A bundle of vibrant sunflowers, perfect for any occasion.",
//   "price": 14.99,
//   "category": "Bouquets",
//   "imageUrl": "https://example.com/images/sunflower-bundle.jpg",
//   "stock": 25,
//   "createdAt": "2024-09-12T08:30:00Z"
// }
const Product = require('../models/product.model');
const Image = require('../models/image.model');

// Helper to normalize tags input (string or array)
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length);
};

exports.getDistinctCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('images');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsByRank = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('images')
      .sort({ rank: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: { $ne: 0 } })
      .populate('images')
      .sort({ featured: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('images');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products with optional search, filter, and sort
exports.searchProducts = async (req, res) => {
  try {
    const { query, category, sort, limit, page } = req.query;

    // Build query object
    const searchQuery = {};
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ];
    }

    if (category === '') {
      searchQuery.category = { $in: [null, ''] };
    } else if (category) {
      searchQuery.category = category;
    }

    const sortOptions = {};
    if (sort === 'recent') {
      sortOptions.createdAt = -1;
    }

    const itemsPerPage = parseInt(limit) || 100;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * itemsPerPage;

    const products = await Product.find(searchQuery)
      .populate('images')
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);

    const totalCount = await Product.countDocuments(searchQuery);

    res.json({
      data: products,
      pagination: {
        total: totalCount,
        page: currentPage,
        itemsPerPage,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addNewProduct = async (req, res) => {
  try {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    rank: req.body.rank ?? 0,
    featured: req.body.featured ?? 0,
    tags: parseTags(req.body.tags),
    dimensions: req.body.dimensions || [],
    year: req.body.year || 0,
    price: req.body.price ?? 0,
    salePercent: req.body.salePercent ?? 0,
    stock: req.body.stock ?? 1,
    images: req.processedImages || [],
    createdBy: req.user._id,
  });

    const newProduct = await product.save();
    await newProduct.populate('images');
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.updateProductById = async (req, res) => {
  try {
    const product = req.currentProduct || await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = {
      name: req.body.name || product.name,
      description: req.body.description || product.description,
      category: req.body.category || product.category,
      rank: req.body.rank ?? product.rank,
      featured: req.body.featured ?? product.featured,
      tags:
        req.body.tags !== undefined
          ? parseTags(req.body.tags)
          : product.tags,
      dimensions: req.body.dimensions || product.dimensions,
      year: req.body.year || product.year,
      price: req.body.price ?? product.price,
      salePercent: req.body.salePercent ?? product.salePercent,
      stock: req.body.stock ?? product.stock,
      startsAt: req.body.startsAt || product.startsAt,
      endsAt: req.body.endsAt || product.endsAt,
      images: req.processedImages || product.images,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('images');

    res.json(updatedProduct);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    await Image.deleteMany({ _id: { $in: deletedProduct.images } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
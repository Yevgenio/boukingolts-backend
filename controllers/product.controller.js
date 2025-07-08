const Product = require('../models/product.model');
const Image = require('../models/image.model');

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
    let imageDocs = [];
    if (req.processedImages) {
      imageDocs = await Image.insertMany(req.processedImages);
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      images: imageDocs.map(img => img._id),
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
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let newImages = [];
    if (req.processedImages) {
      newImages = await Image.insertMany(req.processedImages);
    }

    const updatedImages = [...existingProduct.images, ...newImages.map(i => i._id)];

    const updateData = {
      name: req.body.name || existingProduct.name,
      description: req.body.description || existingProduct.description,
      category: req.body.category || existingProduct.category,
      stock: req.body.stock ?? existingProduct.stock,
      startsAt: req.body.startsAt || existingProduct.startsAt,
      endsAt: req.body.endsAt || existingProduct.endsAt,
      images: updatedImages,
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
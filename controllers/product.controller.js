const Product = require('../models/product.model'); // Assuming you have a Product model defined
// const sizeOf = require('image-size');
const fs = require('fs');
const path = require('path');

const rawSizeOf = require('image-size');
const sizeOf = rawSizeOf.default || rawSizeOf;

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
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
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
    const searchQuery  = {};
    if (query) {
      searchQuery .$or = [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }, // Partial match in category 
      ];
    }

    // Check for empty or null category
    if (category === '') {
      searchQuery.category = { $in: [null, ''] };
    } else if (category) {
      searchQuery.category = category; // Filter by exact category match
    }

    // Define sort options
    const sortOptions = {};
    if (sort === 'recent') {
      sortOptions.createdAt = -1; // Sort by most recent
    }

    // Pagination (defaults to 10 items per page)
    const itemsPerPage = parseInt(limit) || 100; //need better logic
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * itemsPerPage;

    // Fetch products from the database
    const products = await Product.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);

    // Total count for pagination
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
}

exports.addNewProduct = async (req, res) => {
  console.log('Received request to add new product:', req.body);

  try {
    const imageFiles = req.files?.images || [];
    console.log('Image files received:', imageFiles);

    const images = imageFiles.map((file) => {
      const filePath = path.join(__dirname, '../uploads', file.filename);

      let width = 0;
      let height = 0;

      try {
        const dimensions = sizeOf(filePath);
        width = dimensions.width;
        height = dimensions.height;
        console.log('Image dimensions calculated:', dimensions);
      } catch (error) {
        console.error('Failed to get image dimensions:', error.message);
      }

      return {
        url: file.filename.split('/').pop(),
        width,
        height,
      };
    });

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      images,
      stock: req.body.stock,
      startsAt: req.body.startsAt,
      endsAt: req.body.endsAt,
      createdBy: req.user._id,
    });

    console.log('New product data:', product);
    const newProduct = await product.save();
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

    const imageFiles = req.files?.images || [];

    const newImages = imageFiles.map((file) => {
      const filePath = path.join(__dirname, '../uploads', file.filename);
      const dimensions = sizeOf(filePath);

      return {
        url: file.filename.split('/').pop(),
        width: dimensions.width,
        height: dimensions.height,
      };
    });

    const updatedImages = [...existingProduct.images, ...newImages];

    const updateData = {
      ...existingProduct.toObject(),
      ...req.body,
      images: updatedImages,
    };

    delete updateData._id;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
  
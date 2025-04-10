const Product = require('../models/product.model'); // Assuming you have a Product model defined

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
  try {
    // Save the image path if a file was uploaded
    const imagePath = req.files?.imagePath ? req.files.imagePath[0].filename.split('/').pop() : 'default.jpg';
    const barcodePath = req.files?.barcodePath ? req.files.barcodePath[0].filename.split('/').pop() : 'default.jpg';

    const images = req.files?.images?.map((file, index) => ({
      url: file.filename.split('/').pop(),
      order: index
    })) || [];
    
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      imagePath: imagePath,
      barcodePath: barcodePath,
      stock: req.body.stock,
      startsAt: req.body.startsAt,
      endsAt: req.body.endsAt,
      createdBy: req.user._id, // Attach user ID from token
    });    

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProductById = async (req, res) => {
  try {
    // Find the existing product first
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle uploaded files
    const imagePath = req.files?.imagePath ? req.files.imagePath[0].filename.split('/').pop() : existingProduct.imagePath.split('/').pop();
    const barcodePath = req.files?.barcodePath ? req.files.barcodePath[0].filename.split('/').pop() : existingProduct.barcodePath.split('/').pop();

    // Handle image updates
    const newImages = req.files?.images?.map((file, index) => ({
      url: file.filename.split('/').pop(),
      order: existingProduct.images.length + index
    })) || [];

    const updatedImages = [...existingProduct.images, ...newImages];
    
    // Prepare the update data
    const updateData = {
      ...existingProduct.toObject(), // Start with the existing data
      ...req.body, // Overwrite with new data from the request
      images: updatedImages, // Use new images array
      imagePath, // Use new or existing image path
      barcodePath, // Use new or existing barcode path
    };

    // Ensure we don't accidentally update `_id` or other immutable fields
    delete updateData._id;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

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
  
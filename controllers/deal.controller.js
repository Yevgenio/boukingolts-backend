const Deal = require('../models/deal.model'); // Assuming you have a Deal model defined

exports.getDistinctCategories = async (req, res) => {
  try {
    const categories = await Deal.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get a deal by ID
exports.getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all deals with optional search, filter, and sort
exports.searchDeals = async (req, res) => {
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

    // Fetch deals from the database
    const deals = await Deal.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);

    // Total count for pagination
    const totalCount = await Deal.countDocuments(searchQuery);

    res.json({
      data: deals,
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

exports.addNewDeal = async (req, res) => {
  try {
    // Save the image path if a file was uploaded
    const imagePath = req.files?.imagePath ? req.files.imagePath[0].filename.split('/').pop() : 'default.jpg';
    const barcodePath = req.files?.barcodePath ? req.files.barcodePath[0].filename.split('/').pop() : 'default.jpg';

    const deal = new Deal({
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

    const newDeal = await deal.save();
    res.status(201).json(newDeal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateDealById = async (req, res) => {
  try {
    // Find the existing deal first
    const existingDeal = await Deal.findById(req.params.id);
    if (!existingDeal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Handle uploaded files
    const imagePath = req.files?.imagePath ? req.files.imagePath[0].filename.split('/').pop() : existingDeal.imagePath.split('/').pop();
    const barcodePath = req.files?.barcodePath ? req.files.barcodePath[0].filename.split('/').pop() : existingDeal.barcodePath.split('/').pop();

    // Prepare the update data
    const updateData = {
      ...existingDeal.toObject(), // Start with the existing data
      ...req.body, // Overwrite with new data from the request
      imagePath, // Use new or existing image path
      barcodePath, // Use new or existing barcode path
    };

    // Ensure we don't accidentally update `_id` or other immutable fields
    delete updateData._id;

    const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.json(updatedDeal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a deal by ID
exports.deleteDealById = async (req, res) => {
  try {
    const deletedDeal = await Deal.findByIdAndDelete(req.params.id);
    if (!deletedDeal) return res.status(404).json({ message: 'Deal not found' });
    res.json({ message: 'Deal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
  
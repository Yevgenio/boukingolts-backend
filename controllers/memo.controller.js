const Memo = require('../models/memo.model'); // Assuming you have a Memo model defined

// exports.getDistinctCategories = async (req, res) => {
//   try {
//     const categories = await Memo.distinct("category");
//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.getAllMemos = async (req, res) => {
  try {
    const memos = await Memo.find();
    res.json(memos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get a memo by ID
exports.getMemoById = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    if (!memo) return res.status(404).json({ message: 'Memo not found' });
    res.json(memo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all memos with optional search, filter, and sort
exports.searchMemos = async (req, res) => {
  try {
    const { query, category, type, sort, limit, page } = req.query;

    // Build query object
    const searchQuery  = {};
    if (query) {
      searchQuery .$or = [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }, // Partial match in category 
        { type: { $regex: query, $options: 'i' } }, // Partial match in type 
      ];
    }

    // Check for empty or null category
    if (category === '') {
      searchQuery.category = { $in: [null, ''] };
    } else if (category) {
      searchQuery.category = category; // Filter by exact category match
    }

    // Check for empty or null type
    if (type === '') {
        searchQuery.type = { $in: [null, ''] };
        } else if (type) {
        searchQuery.type = type; // Filter by exact type match
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

    // Fetch memos from the database
    const memos = await Memo.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);

    // Total count for pagination
    const totalCount = await Memo.countDocuments(searchQuery);

    res.json({
      data: memos,
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

exports.addNewMemo = async (req, res) => {
  try {
    // Save the image path if a file was uploaded
    const imagePath = req.files?.imagePath ? req.files.imagePath[0].filename : "default";
    
    const memo = new Memo({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type, // 'deal', 'chat', 'external', 'blog'
      targetId: req.body.targetId || null, // ID of chat/deal
      externalLink: req.body.externalLink || null, // Direct external link
      immediateRedirect: req.body.immediateRedirect || false, // Immediate redirect or landing page
      imagePath: imagePath,
      startsAt: req.body.startsAt,
      endsAt: req.body.endsAt,
    });

    const newMemo = await memo.save();
    res.status(201).json(newMemo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a memo by ID
exports.updateMemoById = async (req, res) => {
  try {
    const updatedMemo = await Memo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMemo) return res.status(404).json({ message: 'Memo not found' });
    res.json(updatedMemo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a memo by ID
exports.deleteMemoById = async (req, res) => {
  try {
    const deletedMemo = await Memo.findByIdAndDelete(req.params.id);
    if (!deletedMemo) return res.status(404).json({ message: 'Memo not found' });
    res.json({ message: 'Memo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
  
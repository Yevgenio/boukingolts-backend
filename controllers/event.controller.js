const Event = require('../models/event.model'); // Assuming you have a Event model defined

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).send('Event not found');
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchEvents =  async (req, res) => {
  try {
    const { search, sort, limit, page } = req.query;

    // Build query object
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive search
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Define sort options
    const sortOptions = {};
    if (sort === 'recent') {
      sortOptions.createdAt = -1; // Sort by most recent
    }

    // Pagination (defaults to 10 items per page)
    const itemsPerPage = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * itemsPerPage;

    // Fetch events from the database
    const events = await Event.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);

    // Total count for pagination
    const totalCount = await Event.countDocuments(query);

    res.json({
      data: events,
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

exports.addNewEvent = async (req, res) => {
  const imagePath = req.files?.imagePath ? req.files.imagePath[0].filename.split('/').pop() : 'default.jpg';

  const event = new Event({
    name: req.body.name,
    description: req.body.description,
    link: req.body.link,
    category: req.body.category,
    imagePath: imagePath,
    createdBy: req.user._id,
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

exports.updateEventById = async (req, res) => {
  try {
    // Find the existing event first
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Handle uploaded files
    const imagePath = req.files?.imagePath ? req.files.imagePath[0].filename.split('/').pop() : existingEvent.imagePath.split('/').pop();

    // Prepare the update data
    const updateData = {
      ...existingEvent.toObject(), // Start with the existing data
      ...req.body, // Overwrite with new data from the request
      imagePath, // Use new or existing image path
    };

    // Ensure we don't accidentally update `_id` or other immutable fields
    delete updateData._id;

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a event by ID
exports.deleteEventById = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
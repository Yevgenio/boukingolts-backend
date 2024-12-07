const Chat = require('../models/chat.model'); // Assuming you have a Chat model defined

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.addNewChat = async (req, res) => {
  const imagePath = req.files?.imagePath ? `/${req.files.imagePath[0].filename}` : null;

  const chat = new Chat({
    name: req.body.name,
    description: req.body.description,
    link: req.body.link,
    category: req.body.category,
    imagePath: imagePath,
  });

  try {
    const newChat = await chat.save();
    res.status(201).json(newChat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).send('Chat not found');
    }
    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).send('Server error');
  }
};

// exports.catalog = (category) => {
//     return (req, res) => {
//       if (category === "new") {
//         // Logic for "new" chats
//         res.send("Showing new chats");
//       } else if (category === "popular") {
//         // Logic for "popular" chats
//         res.send("Showing popular chats");
//       } else if (category === "sale") {
//         // Logic for chats on sale
//         res.send("Showing chats on sale");
//       } else {
//         res.status(400).send("Invalid category");
//       }
//     };
//   };
  
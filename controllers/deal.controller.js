const Deal = require('../models/deal.model'); // Assuming you have a Deal model defined

// const mapRequestToSchema = (reqBody, schemaPaths) => {
//   const mappedData = {};
//   Object.keys(schemaPaths).forEach((path) => {
//     if (reqBody[path] !== undefined) {
//       mappedData[path] = reqBody[path];
//     }
//   });
//   return mappedData;
// };

exports.getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.addNewDeal = async (req, res) => {
  try {
    // Save the image path if a file was uploaded
    const imagePath = req.files?.imagePath ? `/${req.files.imagePath[0].filename}` : null;
    const barcodePath = req.files?.barcodePath ? `/${req.files.barcodePath[0].filename}` : null;

    const deal = new Deal({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      imagePath: imagePath,
      barcodePath: barcodePath,
      stock: req.body.stock,
      startsAt: req.body.startsAt,
      endsAt: req.body.endsAt,
    });    

    const newDeal = await deal.save();
    res.status(201).json(newDeal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).send('Deal not found');
    }
    res.json(deal);
  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).send('Server error');
  }
};

// exports.catalog = (category) => {
//     return (req, res) => {
//       if (category === "new") {
//         // Logic for "new" deals
//         res.send("Showing new deals");
//       } else if (category === "popular") {
//         // Logic for "popular" deals
//         res.send("Showing popular deals");
//       } else if (category === "sale") {
//         // Logic for deals on sale
//         res.send("Showing deals on sale");
//       } else {
//         res.status(400).send("Invalid category");
//       }
//     };
//   };
  
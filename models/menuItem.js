let mongoose = require("mongoose");

let menuItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  options: [
    {
      price: { type: Number, min: 0.01 },
      title: { type: String, trim: true },
    },
  ],
  category: { type: String, required: true, trim: true },
  image: {
    location: { type: String, trim: true },
    key: { type: String, trim: true },
  },
  modifiers: {
    multiSelect: { type: Boolean, default: false },
    values: [
      {
        title: { type: String, trim: true },
        price: { type: Number, min: 0.01 },
      },
    ],
  },
  tags: [
    {
      title: { type: String, trim: true },
      color: { type: String, trim: true },
    },
  ],
});

module.exports = mongoose.model("Menu", menuItemSchema);

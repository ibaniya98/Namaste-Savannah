let mongoose = require("mongoose");

let partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  imageUrl: { type: String, trim: true, required: true },
  popularItems: [{ type: String, trim: true, required: true }],
  orderLink: { type: String, trim: true, required: true },
  isPopular: { type: Boolean, default: false },
  showInHomepage: { type: Boolean, default: false },
});

module.exports = mongoose.model("Partner", partnerSchema);

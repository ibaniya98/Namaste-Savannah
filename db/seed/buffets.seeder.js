const { Seeder } = require("mongoose-data-seed");
const Buffet = require("../models/buffet");

const data = [
  {
    menuItems: [],
    price: 12.99,
    startTime: "11:00 AM",
    endTime: "4:00 PM",
    updatedAt: "2020-03-13T14:28:04.044Z",
    extraItems: [
      "Steamed Rice",
      "Naan",
      "Gulab Jamun",
      "Salad & fruits",
      "Tandoori Chicken",
      "Chicken Tikka Masala",
      "Veg Pakora",
      "Saag paneer",
      "Chana masala",
      "Dal tadka",
      "Zeera Aloo",
      "Chicken Biryani",
      "Shrimp Vindaloo",
    ],
  },
];

class BuffetsSeeder extends Seeder {
  async shouldRun() {
    return Buffet.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return Buffet.create(data);
  }
}

module.exports = BuffetsSeeder;

const { Seeder } = require("mongoose-data-seed");
const Menu = require("../models/menuItem");

const data = [
  {
    itemName: "Steamed Mo:Mo",
    category: "Momo",
    description:
      "Homemade dumplings filled with mixed veg. and your choice of meat. Served with traditional tomato sauce.",
    options: [
      {
        price: 9.99,
        title: "Veg",
      },
      {
        price: 11.99,
        title: "Chicken",
      },
      {
        price: 14.99,
        title: "Bison",
      },
    ],
  },
];

class MenusSeeder extends Seeder {
  async shouldRun() {
    return Menu.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return Menu.create(data);
  }
}

module.exports = MenusSeeder;

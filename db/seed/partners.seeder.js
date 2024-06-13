const { Seeder } = require("mongoose-data-seed");
const Partner = require("../models/partner");

const data = [
  {
    popularItems: ["Garlic Naan", "Kothe Mo:Mo", "Tikka Masala"],
    isPopular: true,
    name: "Grubhub",
    imageUrl: "https://d5qqlksrf0i9x.cloudfront.net/partners/grubhub.png",
    orderLink: "https://www.grubhub.com/delivery/ga-savannah",
    showInHomepage: true,
  },
];

class PartnersSeeder extends Seeder {
  async shouldRun() {
    return Partner.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return Partner.create(data);
  }
}

module.exports = PartnersSeeder;

const mongoose = require("mongoose");

const Buffets = require("./db/seed/buffets.seeder");
const Menus = require("./db/seed/menus.seeder");
const Partners = require("./db/seed/partners.seeder");
const Users = require("./db/seed/users.seeder");

const mongoURL =
  process.env.MONGODB_URL ||
  "mongodb://localhost:27017/namaste-savannah?authSource=admin";

module.exports = {
  /**
   * Seeders List
   * order is important
   * @type {Object}
   */
  seedersList: {
    Buffets,
    Menus,
    Partners,
    Users,
  },
  /**
   * Connect to mongodb implementation
   * @return {Promise}
   */
  connect: async () => {
    await mongoose.connect(mongoURL, { useNewUrlParser: true });
  },

  /**
   * Drop/Clear the database implementation
   * @return {Promise}
   */
  dropdb: async () => {
    mongoose.connection.db.dropDatabase();
  },
};

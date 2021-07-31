const { Seeder } = require("mongoose-data-seed");
const User = require("../models/user");

const data = [
  {
    isAdmin: false,
    username: "dummy",
    email: "dummy@namaste-savannah.com",
    salt: "dsafsdfa",
    hash: "dafdasdfsadf",
  },
];

class UsersSeeder extends Seeder {
  async shouldRun() {
    return User.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return User.create(data);
  }
}

module.exports = UsersSeeder;
